export interface GlobalConfig {
  version: string;
  fmt: { export: string };
  sign: {
    N: number;
    mode: string;
    hash: string;
    originSize: number;
    pack: string;
  };
  externalHashers: Record<
    string,
    {
      fn: (u8: Uint8Array) => Promise<Uint8Array | string> | Uint8Array | string;
      output?: string;
      size?: number | null;
      cdn?: string | null;
      ready?: boolean;
    }
  >;
}

export interface Encoder {
  mode: Record<string, number>;
  algorithm: Record<string, number>;
}

export interface Decoder {
  mode: Record<number, string>;
  algorithm: Record<number, string>;
}

export interface Convert {
  bytesToHex: (u8: Uint8Array) => string;
  hexToBytes: (str: string) => Uint8Array;
  bytesToBase64: (u8: Uint8Array) => string;
  base64ToBytes: (str: string) => Uint8Array;
  guessToBytes: (str: string) => Uint8Array;
  indexToBytes: (idx: bigint | number) => Uint8Array;
  concatBytes: (...arrs: Uint8Array[]) => Uint8Array;
  equalBytes: (a: Uint8Array, b: Uint8Array) => boolean;
  export: (bytes: Uint8Array) => string | Uint8Array;
  importToBytes: (d: Uint8Array | string) => Uint8Array;
  splitSig: (p: {
    blocks?: Uint8Array[];
    originLen: number;
    blkLen: number;
    sigBytes: Uint8Array;
    N: number;
  }) => Uint8Array[];
}

export interface Enc {
  hash: (u8: Uint8Array, alg?: string) => Promise<Uint8Array>;
  hashIter: (u8: Uint8Array, t: number, alg?: string) => Promise<Uint8Array>;
  ladder: (
    blocks: Uint8Array[],
    mode?: string,
    alg?: string
  ) => Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }>;
  _ladderS: (blocks: Uint8Array[], alg: string) => Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }>;
  _ladderX: (blocks: Uint8Array[], alg?: string) => Promise<{ sigBlocks: Uint8Array[]; final: Uint8Array }>;
}

export interface SignaturePackage {
  bytes: Uint8Array;
  N: number;
  mode: string;
  alg: string;
  index: bigint;
  sigBytes: Uint8Array;
  originLen: number;
  blkLen: number;
  blocks: Uint8Array[];
}

export interface OriginPackage {
  bytes: Uint8Array;
  N: number;
  mode: string;
  alg: string;
  index: bigint;
  blockLen: number;
  origin: Uint8Array[];
}

export interface OriginObject {
  origin: Uint8Array[];
}

export interface Actions {
  Sign: (pkg: Uint8Array | string) => Promise<string | Uint8Array>;
  VerifyS: (o: SignaturePackage, n: SignaturePackage) => Promise<boolean>;
  VerifyX: (sa: SignaturePackage, sb: SignaturePackage) => Promise<boolean>;
  Verify: (aSig: Uint8Array | string, bSig: Uint8Array | string) => Promise<boolean>;
  import: {
    signature: (pkg: Uint8Array | string) => SignaturePackage;
    origin: (pkg: Uint8Array | string) => OriginPackage;
  };
  OriginGenerator: () => OriginObject;
  RandomBlock: (len: number) => Uint8Array;
  _hdr: (N: number, mode: string, alg: string, idxBytes: Uint8Array) => Uint8Array;
  NewExporter: (originObj: OriginObject, index?: bigint) => string | Uint8Array;
  SignExporter: (sigBytes: Uint8Array, index: bigint, N: number, mode: string, hash: string) => string | Uint8Array;
  PackSignature: (
    sigBytes: Uint8Array,
    m: { index: bigint; N: number; mode: string; alg: string }
  ) => string | Uint8Array;
  StepUp: (pkg: Uint8Array | string) => string | Uint8Array;
}

export interface UldaSignConfig {
  version?: string;
  fmt?: { export?: string };
  sign?: {
    N?: number;
    mode?: string;
    hash?: string;
    originSize?: number;
    pack?: string;
    func?: (u8: Uint8Array) => Promise<Uint8Array | string> | Uint8Array | string;
    output?: string;
    cdn?: string;
  };
  externalHashers?: GlobalConfig["externalHashers"];
}
