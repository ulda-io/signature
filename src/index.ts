import type {
  GlobalConfig,
  Encoder,
  Decoder,
  Convert,
  Enc,
  SignaturePackage,
  OriginPackage,
  OriginObject,
  Actions,
  UldaSignConfig
} from './types';

class UldaSign {
  globalConfig: GlobalConfig;
  externalHashers: GlobalConfig["externalHashers"];
  encoder?: Encoder;
  decoder?: Decoder;
  convert: Convert;
  enc: Enc;
  actions: Actions;

  constructor(cfg: UldaSignConfig = {}) {
    const g = (this.globalConfig = {
      version: cfg.version ?? "1",
      fmt: { export: cfg?.fmt?.export ?? "hex" },
      sign: {
        N: cfg?.sign?.N ?? 5,
        mode: cfg?.sign?.mode ?? "S",
        hash: cfg?.sign?.hash ?? "SHA-256",
        originSize: cfg?.sign?.originSize ?? 256,
        pack: cfg?.sign?.pack ?? "simpleSig",
      },
      externalHashers: cfg.externalHashers ?? {},
    });
    const self = this;
    this.externalHashers = g.externalHashers;
    const s = cfg.sign ?? {};
    if (typeof s.func === "function") {
      const id = s.hash ?? "custom";
      g.externalHashers[id] = {
        fn: s.func,
        output: s.output ?? "bytes",
        size: s.originSize ?? null,
        cdn: s.cdn ?? null,
        ready: true,
      };
      this.encoder = this.encoder ?? { mode: {}, algorithm: {} };
      this.decoder = this.decoder ?? { mode: {}, algorithm: {} };
      this.encoder.algorithm[id] = 0xff;
      this.decoder.algorithm[0xff] = id;
    }

    this.encoder = {
      mode: { S: 1, X: 2 },
      algorithm: {
        "SHA-1": 1,
        "SHA-256": 2,
        "SHA-384": 3,
        "SHA-512": 4,
        "SHA3-256": 5,
        "SHA3-512": 6,
        BLAKE3: 7,
        WHIRLPOOL: 8,
        CUSTOM: 0xff,
      },
    };
    this.decoder = {
      mode: { 1: "S", 2: "X" },
      algorithm: Object.fromEntries(
        Object.entries(this.encoder.algorithm).map(([n, c]) => [c, n]),
      ),
    };

    const cv = (this.convert = {
      bytesToHex: (u8: Uint8Array): string =>
        Array.from(u8).map((b) => b.toString(16).padStart(2, "0")).join(""),
      hexToBytes: (str: string): Uint8Array =>
        Uint8Array.from(str.match(/../g)!.map((h) => parseInt(h, 16))),
      bytesToBase64: (u8: Uint8Array): string => btoa(String.fromCharCode.apply(null, Array.from(u8))),
      base64ToBytes: (str: string): Uint8Array =>
        Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
      guessToBytes: (str: string): Uint8Array =>
        /^[0-9a-f]+$/i.test(str) && str.length % 2 === 0
          ? cv.hexToBytes(str)
          : cv.base64ToBytes(str),
      indexToBytes: (idx: bigint | number): Uint8Array => {
        let b = typeof idx === "bigint" ? idx : BigInt(idx);
        if (b === BigInt(0)) return Uint8Array.of(0);
        const r: number[] = [];
        while (b > BigInt(0)) {
          r.unshift(Number(b & BigInt(0xff)));
          b >>= BigInt(8);
        }
        return Uint8Array.from(r);
      },
      concatBytes: (...arrs: Uint8Array[]): Uint8Array => {
        const out = new Uint8Array(arrs.reduce((s, a) => s + a.length, 0));
        let off = 0;
        arrs.forEach((a) => (out.set(a, off), (off += a.length)));
        return out;
      },
      equalBytes: (a: Uint8Array, b: Uint8Array): boolean =>
        a.length === b.length && a.every((v, i) => v === b[i]),
      export: (bytes: Uint8Array): string | Uint8Array =>
        (
          {
            base64: cv.bytesToBase64,
            bytes: (x: Uint8Array) => x,
            hex: cv.bytesToHex,
          }[g.fmt.export] ?? cv.bytesToHex
        )(bytes),
      importToBytes: (d: Uint8Array | string): Uint8Array =>
        d instanceof Uint8Array
          ? d
          : (
            { hex: cv.hexToBytes, base64: cv.base64ToBytes }[g.fmt.export] ??
            cv.guessToBytes
          )(d as string),
      splitSig: (p: {
        blocks?: Uint8Array[];
        originLen: number;
        blkLen: number;
        sigBytes: Uint8Array;
        N: number;
      }): Uint8Array[] =>
        p.blocks ??
        (() => {
          const { originLen, blkLen, sigBytes, N } = p,
            a = [sigBytes.slice(0, originLen)];
          for (let i = 0; i < N - 1; i++)
            a.push(sigBytes.slice(originLen + i * blkLen, originLen + (i + 1) * blkLen));
          return a;
        })(),
    });

    const enc = (this.enc = {
      hash: async (u8: Uint8Array, alg: string = "SHA-256"): Promise<Uint8Array> => {
        if (["SHA-1", "SHA-256", "SHA-384", "SHA-512"].includes(alg)) {
          const buffer = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
          return new Uint8Array(await crypto.subtle.digest(alg, buffer));
        }
        const ext = g.externalHashers[alg];
        if (!ext) throw `Hasher <${alg}> not registered`;
        if (ext.cdn && !ext.ready) {
          await UldaSign.loadScriptOnce(ext.cdn);
          ext.ready = true;
        }
        const raw = await ext.fn(u8),
          fmt = ext.output ?? "bytes",
          bytes =
            fmt === "bytes"
              ? (raw as Uint8Array)
              : fmt === "hex"
                ? cv.hexToBytes(raw as string)
                : fmt === "base64"
                  ? cv.base64ToBytes(raw as string)
                  : (() => {
                    throw `Unsupported output ${fmt}`;
                  })();
        if (ext.size && bytes.length * 8 !== ext.size)
          throw `Hasher <${alg}> size mismatch`;
        return bytes;
      },
      hashIter: async (u8: Uint8Array, t: number, alg: string = "SHA-256"): Promise<Uint8Array> => {
        let h = u8;
        for (let i = 0; i < t; i++) h = await enc.hash(h, alg);
        return h;
      },
      ladder: async (
        blocks: Uint8Array[],
        mode: string = "S",
        alg: string = "SHA-256",
      ): Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }> =>
        mode === "X" ? enc._ladderX(blocks, alg) : enc._ladderS(blocks, alg),
      _ladderS: async (
        blocks: Uint8Array[],
        alg: string,
      ): Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }> => {
        const sig: Uint8Array[] = [];
        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          if (block) {
            sig.push(await enc.hashIter(block, i, alg));
          }
        }
        const final = sig[sig.length - 1];
        if (!final) throw new Error("Empty signature blocks");
        return { sigBlocks: sig, final };
      },
      _ladderX: async (
        blocks: Uint8Array[],
        alg: string = "SHA-256",
      ): Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }> => {
        if (!blocks?.length) throw "_ladderX: empty blocks";
        const cat = cv.concatBytes,
          sig = [blocks[0]];
        let prev = blocks;
        for (let d = 1; d < blocks.length; d++) {
          const cur: Uint8Array[] = [];
          for (let i = 0; i < prev.length - 1; i++) {
            const first = prev[i];
            const second = prev[i + 1];
            if (first && second) {
              cur.push(await enc.hash(cat(first, second), alg));
            }
          }
          const firstCur = cur[0];
          if (firstCur) {
            sig.push(firstCur);
          }
          prev = cur.filter((item): item is Uint8Array => item !== undefined);
        }
        const filteredSig = sig.filter((item): item is Uint8Array => item !== undefined);
        const final = filteredSig[filteredSig.length - 1];
        if (!final) throw new Error("Empty signature blocks");
        return { sigBlocks: filteredSig, final };
      },
    });

    let a: Actions;
    this.actions = a = {
      Sign: async (pkg: Uint8Array | string): Promise<string | Uint8Array> => {
        const p = a.import.origin(pkg),
          { origin, mode, alg, index, N } = p,
          { sigBlocks } = await enc.ladder(origin, mode, alg);
        return a.PackSignature(cv.concatBytes(...sigBlocks), { index, N, mode, alg });
      },
      VerifyS: async (o: SignaturePackage, n: SignaturePackage): Promise<boolean> => {
        const older = o.index < n.index ? o : n,
          newer = o.index < n.index ? n : o,
          g = Number(newer.index - older.index);
        if (g <= 0 || g >= older.N) return false;
        if (older.originLen !== newer.originLen || older.blkLen !== newer.blkLen)
          return false;
        const ob = cv.splitSig(older),
          nb = cv.splitSig(newer);
        for (let i = 0; i < older.N - g; i++) {
          const nbItem = nb[i];
          const obItem = ob[i + g];
          if (nbItem && obItem) {
            if (!cv.equalBytes(await enc.hashIter(nbItem, g, older.alg), obItem))
              return false;
          }
        }
        return true;
      },
      VerifyX: async (sa: SignaturePackage, sb: SignaturePackage): Promise<boolean> => {
        const older = sa.index < sb.index ? sa : sb,
          newer = sa.index < sb.index ? sb : sa;
        if (Number(newer.index - older.index) !== 1) return false;
        const { N } = older;
        if (
          older.sigBytes.length !== newer.sigBytes.length ||
          older.sigBytes.length % N
        )
          return false;
        const A = cv.splitSig(older),
          B = cv.splitSig(newer),
          cat = cv.concatBytes;
        for (let d = 1; d < N; d++) {
          const aPrev = A[d - 1];
          const bPrev = B[d - 1];
          const aCur = A[d];
          if (aPrev && bPrev && aCur) {
            if (!cv.equalBytes(await enc.hash(cat(aPrev, bPrev), older.alg), aCur))
              return false;
          }
        }
        return true;
      },
      Verify: async (
        aSig: Uint8Array | string,
        bSig: Uint8Array | string,
      ): Promise<boolean> => {
        const A = a.import.signature(aSig),
          B = a.import.signature(bSig);
        if (A.N !== B.N || A.mode !== B.mode || A.alg !== B.alg) return false;
        return A.mode === "S"
          ? a.VerifyS(A, B)
          : A.mode === "X"
            ? a.VerifyX(A, B)
            : false;
      },
      import: {
        signature: (pkg: Uint8Array | string): SignaturePackage => {
          const bytes =
              pkg instanceof Uint8Array ? pkg : cv.importToBytes(pkg as string),
            hdr = bytes[1],
            N = bytes[2];
          if (hdr === undefined || N === undefined) throw "Invalid package format";
          const mode = self.decoder?.mode[bytes[3] ?? 0] ?? "U",
            alg = self.decoder?.algorithm[bytes[4] ?? 0] ?? "UNK";
          let idx = BigInt(0);
          for (let i = 5; i < hdr - 1; i++) {
            const byte = bytes[i];
            if (byte !== undefined) {
              idx = (idx << BigInt(8)) | BigInt(byte);
            }
          }
          const sigBytes = bytes.slice(hdr),
            originLen = (g.sign.originSize ?? 256) >>> 3,
            rest = sigBytes.length - originLen,
            blkLen = rest / (N - 1);
          if (rest < 0 || !Number.isInteger(blkLen)) throw "SigImporter sizes";
          const blocks = [sigBytes.slice(0, originLen)];
          for (let i = 0; i < N - 1; i++)
            blocks.push(sigBytes.slice(originLen + i * blkLen, originLen + (i + 1) * blkLen));
          return { bytes, N, mode, alg, index: idx, sigBytes, originLen, blkLen, blocks };
        },
        origin: (pkg: Uint8Array | string): OriginPackage => {
          const bytes =
              pkg instanceof Uint8Array ? pkg : cv.importToBytes(pkg as string),
            hdr = bytes[1];
          if (hdr === undefined) throw "Invalid package format";
          if (bytes[0] || bytes[hdr - 1]) throw "sentinel";
          const N = bytes[2];
          if (N === undefined) throw "Invalid package format";
          const mode = self.decoder?.mode[bytes[3] ?? 0] ?? "U",
            alg = self.decoder?.algorithm[bytes[4] ?? 0] ?? "UNK";
          let idx = BigInt(0);
          for (let i = 5; i < hdr - 1; i++) {
            const byte = bytes[i];
            if (byte !== undefined) {
              idx = (idx << BigInt(8)) | BigInt(byte);
            }
          }
          const body = bytes.slice(hdr),
            blkLen = body.length / N;
          if (!Number.isInteger(blkLen)) throw "div";
          const origin: Uint8Array[] = [];
          for (let i = 0; i < N; i++)
            origin.push(body.slice(i * blkLen, (i + 1) * blkLen));
          return { bytes, N, mode, alg, index: idx, blockLen: blkLen, origin };
        },
      },
      OriginGenerator: (): OriginObject => {
        const len = g.sign.originSize >>> 3;
        return {
          origin: Array.from({ length: g.sign.N }, () => a.RandomBlock(len)),
        };
      },
      RandomBlock: (len: number): Uint8Array => crypto.getRandomValues(new Uint8Array(len)),
      _hdr: (N: number, mode: string, alg: string, idxBytes: Uint8Array): Uint8Array => {
        const h = new Uint8Array(5 + idxBytes.length + 1);
        h.set([0, h.length, N, self.encoder?.mode[mode] ?? 255, self.encoder?.algorithm[alg] ?? 255]);
        h.set(idxBytes, 5);
        h[h.length - 1] = 0;
        return h;
      },
      NewExporter: (originObj: OriginObject, index: bigint = BigInt(0)): string | Uint8Array => {
        const { N, mode, hash } = g.sign,
          hdr = a._hdr(N, mode, hash, cv.indexToBytes(index));
        return cv.export(cv.concatBytes(hdr, ...originObj.origin));
      },
      SignExporter: (
        sigBytes: Uint8Array,
        index: bigint,
        N: number,
        mode: string,
        hash: string,
      ): string | Uint8Array => {
        const hdr = a._hdr(N, mode, hash, cv.indexToBytes(index));
        return cv.export(cv.concatBytes(hdr, sigBytes));
      },
      PackSignature: (
        sigBytes: Uint8Array,
        m: { index: bigint; N: number; mode: string; alg: string },
      ): string | Uint8Array =>
        a.SignExporter(sigBytes, m.index, m.N, m.mode, m.alg),
      StepUp: (pkg: Uint8Array | string): string | Uint8Array => {
        const { origin, blockLen, index } = a.import.origin(pkg),
          next = origin.slice(1);
        next.push(a.RandomBlock(blockLen));
        return a.NewExporter({ origin: next }, index + BigInt(1));
      },
    };
  }

  static loadScriptOnce(src: string): Promise<void> {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => res();
      s.onerror = () => rej(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(s);
    });
  }

  New(i: bigint = BigInt(0)): string | Uint8Array {
    return this.actions.NewExporter(this.actions.OriginGenerator(), i);
  }
  stepUp(pkg: Uint8Array | string): string | Uint8Array {
    return this.actions.StepUp(pkg);
  }
  sign(pkg: Uint8Array | string): Promise<string | Uint8Array> {
    return this.actions.Sign(pkg);
  }
  verify(a: Uint8Array | string, b: Uint8Array | string): Promise<boolean> {
    return this.actions.Verify(a, b);
  }
}

// Export the main class
export default UldaSign;

// Export types for TypeScript users
export type {
  GlobalConfig,
  Encoder,
  Decoder,
  Convert,
  Enc,
  SignaturePackage,
  OriginPackage,
  OriginObject,
  Actions,
  UldaSignConfig
} from './types';

// Global assignment for browser usage
if (typeof window !== "undefined" && !(window as any).UldaSign) {
  (window as any).UldaSign = UldaSign;
}