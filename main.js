var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var UldaSign = /** @class */ (function () {
    function UldaSign(cfg) {
        if (cfg === void 0) { cfg = {}; }
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var g = (this.globalConfig = {
            version: (_a = cfg.version) !== null && _a !== void 0 ? _a : "1",
            fmt: { export: (_c = (_b = cfg === null || cfg === void 0 ? void 0 : cfg.fmt) === null || _b === void 0 ? void 0 : _b.export) !== null && _c !== void 0 ? _c : "hex" },
            sign: {
                N: (_e = (_d = cfg === null || cfg === void 0 ? void 0 : cfg.sign) === null || _d === void 0 ? void 0 : _d.N) !== null && _e !== void 0 ? _e : 5,
                mode: (_g = (_f = cfg === null || cfg === void 0 ? void 0 : cfg.sign) === null || _f === void 0 ? void 0 : _f.mode) !== null && _g !== void 0 ? _g : "S",
                hash: (_j = (_h = cfg === null || cfg === void 0 ? void 0 : cfg.sign) === null || _h === void 0 ? void 0 : _h.hash) !== null && _j !== void 0 ? _j : "SHA-256",
                originSize: (_l = (_k = cfg === null || cfg === void 0 ? void 0 : cfg.sign) === null || _k === void 0 ? void 0 : _k.originSize) !== null && _l !== void 0 ? _l : 256,
                pack: (_o = (_m = cfg === null || cfg === void 0 ? void 0 : cfg.sign) === null || _m === void 0 ? void 0 : _m.pack) !== null && _o !== void 0 ? _o : "simpleSig",
            },
            externalHashers: (_p = cfg.externalHashers) !== null && _p !== void 0 ? _p : {},
        });
        var self = this;
        this.externalHashers = g.externalHashers;
        var s = (_q = cfg.sign) !== null && _q !== void 0 ? _q : {};
        if (typeof s.func === "function") {
            var id = (_r = s.hash) !== null && _r !== void 0 ? _r : "custom";
            g.externalHashers[id] = {
                fn: s.func,
                output: (_s = s.output) !== null && _s !== void 0 ? _s : "bytes",
                size: (_t = s.originSize) !== null && _t !== void 0 ? _t : null,
                cdn: (_u = s.cdn) !== null && _u !== void 0 ? _u : null,
                ready: true,
            };
            this.encoder = (_v = this.encoder) !== null && _v !== void 0 ? _v : { mode: {}, algorithm: {} };
            this.decoder = (_w = this.decoder) !== null && _w !== void 0 ? _w : { mode: {}, algorithm: {} };
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
            algorithm: Object.fromEntries(Object.entries(this.encoder.algorithm).map(function (_a) {
                var n = _a[0], c = _a[1];
                return [c, n];
            })),
        };
        var cv = (this.convert = {
            bytesToHex: function (u8) {
                return Array.from(u8).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
            },
            hexToBytes: function (str) {
                return Uint8Array.from(str.match(/../g).map(function (h) { return parseInt(h, 16); }));
            },
            bytesToBase64: function (u8) { return btoa(String.fromCharCode.apply(null, Array.from(u8))); },
            base64ToBytes: function (str) {
                return Uint8Array.from(atob(str), function (c) { return c.charCodeAt(0); });
            },
            guessToBytes: function (str) {
                return /^[0-9a-f]+$/i.test(str) && str.length % 2 === 0
                    ? cv.hexToBytes(str)
                    : cv.base64ToBytes(str);
            },
            indexToBytes: function (idx) {
                var b = typeof idx === "bigint" ? idx : BigInt(idx);
                if (b === BigInt(0))
                    return Uint8Array.of(0);
                var r = [];
                while (b > BigInt(0)) {
                    r.unshift(Number(b & BigInt(0xff)));
                    b >>= BigInt(8);
                }
                return Uint8Array.from(r);
            },
            concatBytes: function () {
                var arrs = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    arrs[_i] = arguments[_i];
                }
                var out = new Uint8Array(arrs.reduce(function (s, a) { return s + a.length; }, 0));
                var off = 0;
                arrs.forEach(function (a) { return (out.set(a, off), (off += a.length)); });
                return out;
            },
            equalBytes: function (a, b) {
                return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
            },
            export: function (bytes) {
                var _a;
                return ((_a = {
                    base64: cv.bytesToBase64,
                    bytes: function (x) { return x; },
                    hex: cv.bytesToHex,
                }[g.fmt.export]) !== null && _a !== void 0 ? _a : cv.bytesToHex)(bytes);
            },
            importToBytes: function (d) {
                var _a;
                return d instanceof Uint8Array
                    ? d
                    : ((_a = { hex: cv.hexToBytes, base64: cv.base64ToBytes }[g.fmt.export]) !== null && _a !== void 0 ? _a : cv.guessToBytes)(d);
            },
            splitSig: function (p) {
                var _a;
                return (_a = p.blocks) !== null && _a !== void 0 ? _a : (function () {
                    var originLen = p.originLen, blkLen = p.blkLen, sigBytes = p.sigBytes, N = p.N, a = [sigBytes.slice(0, originLen)];
                    for (var i = 0; i < N - 1; i++)
                        a.push(sigBytes.slice(originLen + i * blkLen, originLen + (i + 1) * blkLen));
                    return a;
                })();
            },
        });
        var enc = (this.enc = {
            hash: function (u8_1) {
                var args_1 = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args_1[_i - 1] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([u8_1], args_1, true), void 0, function (u8, alg) {
                    var buffer, _a, ext, raw, fmt, bytes;
                    var _b;
                    if (alg === void 0) { alg = "SHA-256"; }
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!["SHA-1", "SHA-256", "SHA-384", "SHA-512"].includes(alg)) return [3 /*break*/, 2];
                                buffer = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
                                _a = Uint8Array.bind;
                                return [4 /*yield*/, crypto.subtle.digest(alg, buffer)];
                            case 1: return [2 /*return*/, new (_a.apply(Uint8Array, [void 0, _c.sent()]))()];
                            case 2:
                                ext = g.externalHashers[alg];
                                if (!ext)
                                    throw "Hasher <".concat(alg, "> not registered");
                                if (!(ext.cdn && !ext.ready)) return [3 /*break*/, 4];
                                return [4 /*yield*/, UldaSign.loadScriptOnce(ext.cdn)];
                            case 3:
                                _c.sent();
                                ext.ready = true;
                                _c.label = 4;
                            case 4: return [4 /*yield*/, ext.fn(u8)];
                            case 5:
                                raw = _c.sent(), fmt = (_b = ext.output) !== null && _b !== void 0 ? _b : "bytes", bytes = fmt === "bytes"
                                    ? raw
                                    : fmt === "hex"
                                        ? cv.hexToBytes(raw)
                                        : fmt === "base64"
                                            ? cv.base64ToBytes(raw)
                                            : (function () {
                                                throw "Unsupported output ".concat(fmt);
                                            })();
                                if (ext.size && bytes.length * 8 !== ext.size)
                                    throw "Hasher <".concat(alg, "> size mismatch");
                                return [2 /*return*/, bytes];
                        }
                    });
                });
            },
            hashIter: function (u8_1, t_1) {
                var args_1 = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args_1[_i - 2] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([u8_1, t_1], args_1, true), void 0, function (u8, t, alg) {
                    var h, i;
                    if (alg === void 0) { alg = "SHA-256"; }
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                h = u8;
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < t)) return [3 /*break*/, 4];
                                return [4 /*yield*/, enc.hash(h, alg)];
                            case 2:
                                h = _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, h];
                        }
                    });
                });
            },
            ladder: function (blocks_1) {
                var args_1 = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args_1[_i - 1] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([blocks_1], args_1, true), void 0, function (blocks, mode, alg) {
                    if (mode === void 0) { mode = "S"; }
                    if (alg === void 0) { alg = "SHA-256"; }
                    return __generator(this, function (_a) {
                        return [2 /*return*/, mode === "X" ? enc._ladderX(blocks, alg) : enc._ladderS(blocks, alg)];
                    });
                });
            },
            _ladderS: function (blocks, alg) { return __awaiter(_this, void 0, void 0, function () {
                var sig, i, block, _a, _b, final;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            sig = [];
                            i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(i < blocks.length)) return [3 /*break*/, 4];
                            block = blocks[i];
                            if (!block) return [3 /*break*/, 3];
                            _b = (_a = sig).push;
                            return [4 /*yield*/, enc.hashIter(block, i, alg)];
                        case 2:
                            _b.apply(_a, [_c.sent()]);
                            _c.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4:
                            final = sig[sig.length - 1];
                            if (!final)
                                throw new Error("Empty signature blocks");
                            return [2 /*return*/, { sigBlocks: sig, final: final }];
                    }
                });
            }); },
            _ladderX: function (blocks_1) {
                var args_1 = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args_1[_i - 1] = arguments[_i];
                }
                return __awaiter(_this, __spreadArray([blocks_1], args_1, true), void 0, function (blocks, alg) {
                    var cat, sig, prev, d, cur, i, first, second, _a, _b, firstCur, filteredSig, final;
                    if (alg === void 0) { alg = "SHA-256"; }
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!(blocks === null || blocks === void 0 ? void 0 : blocks.length))
                                    throw "_ladderX: empty blocks";
                                cat = cv.concatBytes, sig = [blocks[0]];
                                prev = blocks;
                                d = 1;
                                _c.label = 1;
                            case 1:
                                if (!(d < blocks.length)) return [3 /*break*/, 7];
                                cur = [];
                                i = 0;
                                _c.label = 2;
                            case 2:
                                if (!(i < prev.length - 1)) return [3 /*break*/, 5];
                                first = prev[i];
                                second = prev[i + 1];
                                if (!(first && second)) return [3 /*break*/, 4];
                                _b = (_a = cur).push;
                                return [4 /*yield*/, enc.hash(cat(first, second), alg)];
                            case 3:
                                _b.apply(_a, [_c.sent()]);
                                _c.label = 4;
                            case 4:
                                i++;
                                return [3 /*break*/, 2];
                            case 5:
                                firstCur = cur[0];
                                if (firstCur) {
                                    sig.push(firstCur);
                                }
                                prev = cur.filter(function (item) { return item !== undefined; });
                                _c.label = 6;
                            case 6:
                                d++;
                                return [3 /*break*/, 1];
                            case 7:
                                filteredSig = sig.filter(function (item) { return item !== undefined; });
                                final = filteredSig[filteredSig.length - 1];
                                if (!final)
                                    throw new Error("Empty signature blocks");
                                return [2 /*return*/, { sigBlocks: filteredSig, final: final }];
                        }
                    });
                });
            },
        });
        var a;
        this.actions = a = {
            Sign: function (pkg) { return __awaiter(_this, void 0, void 0, function () {
                var p, origin, mode, alg, index, N, sigBlocks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            p = a.import.origin(pkg), origin = p.origin, mode = p.mode, alg = p.alg, index = p.index, N = p.N;
                            return [4 /*yield*/, enc.ladder(origin, mode, alg)];
                        case 1:
                            sigBlocks = (_a.sent()).sigBlocks;
                            return [2 /*return*/, a.PackSignature(cv.concatBytes.apply(cv, sigBlocks), { index: index, N: N, mode: mode, alg: alg })];
                    }
                });
            }); },
            VerifyS: function (o, n) { return __awaiter(_this, void 0, void 0, function () {
                var older, newer, g, ob, nb, i, nbItem, obItem, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            older = o.index < n.index ? o : n, newer = o.index < n.index ? n : o, g = Number(newer.index - older.index);
                            if (g <= 0 || g >= older.N)
                                return [2 /*return*/, false];
                            if (older.originLen !== newer.originLen || older.blkLen !== newer.blkLen)
                                return [2 /*return*/, false];
                            ob = cv.splitSig(older), nb = cv.splitSig(newer);
                            i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(i < older.N - g)) return [3 /*break*/, 4];
                            nbItem = nb[i];
                            obItem = ob[i + g];
                            if (!(nbItem && obItem)) return [3 /*break*/, 3];
                            _b = (_a = cv).equalBytes;
                            return [4 /*yield*/, enc.hashIter(nbItem, g, older.alg)];
                        case 2:
                            if (!_b.apply(_a, [_c.sent(), obItem]))
                                return [2 /*return*/, false];
                            _c.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, true];
                    }
                });
            }); },
            VerifyX: function (sa, sb) { return __awaiter(_this, void 0, void 0, function () {
                var older, newer, N, A, B, cat, d, aPrev, bPrev, aCur, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            older = sa.index < sb.index ? sa : sb, newer = sa.index < sb.index ? sb : sa;
                            if (Number(newer.index - older.index) !== 1)
                                return [2 /*return*/, false];
                            N = older.N;
                            if (older.sigBytes.length !== newer.sigBytes.length ||
                                older.sigBytes.length % N)
                                return [2 /*return*/, false];
                            A = cv.splitSig(older), B = cv.splitSig(newer), cat = cv.concatBytes;
                            d = 1;
                            _c.label = 1;
                        case 1:
                            if (!(d < N)) return [3 /*break*/, 4];
                            aPrev = A[d - 1];
                            bPrev = B[d - 1];
                            aCur = A[d];
                            if (!(aPrev && bPrev && aCur)) return [3 /*break*/, 3];
                            _b = (_a = cv).equalBytes;
                            return [4 /*yield*/, enc.hash(cat(aPrev, bPrev), older.alg)];
                        case 2:
                            if (!_b.apply(_a, [_c.sent(), aCur]))
                                return [2 /*return*/, false];
                            _c.label = 3;
                        case 3:
                            d++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, true];
                    }
                });
            }); },
            Verify: function (aSig, bSig) { return __awaiter(_this, void 0, void 0, function () {
                var A, B;
                return __generator(this, function (_a) {
                    A = a.import.signature(aSig), B = a.import.signature(bSig);
                    if (A.N !== B.N || A.mode !== B.mode || A.alg !== B.alg)
                        return [2 /*return*/, false];
                    return [2 /*return*/, A.mode === "S"
                            ? a.VerifyS(A, B)
                            : A.mode === "X"
                                ? a.VerifyX(A, B)
                                : false];
                });
            }); },
            import: {
                signature: function (pkg) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    var bytes = pkg instanceof Uint8Array ? pkg : cv.importToBytes(pkg), hdr = bytes[1], N = bytes[2];
                    if (hdr === undefined || N === undefined)
                        throw "Invalid package format";
                    var mode = (_c = (_a = self.decoder) === null || _a === void 0 ? void 0 : _a.mode[(_b = bytes[3]) !== null && _b !== void 0 ? _b : 0]) !== null && _c !== void 0 ? _c : "U", alg = (_f = (_d = self.decoder) === null || _d === void 0 ? void 0 : _d.algorithm[(_e = bytes[4]) !== null && _e !== void 0 ? _e : 0]) !== null && _f !== void 0 ? _f : "UNK";
                    var idx = BigInt(0);
                    for (var i = 5; i < hdr - 1; i++) {
                        var byte = bytes[i];
                        if (byte !== undefined) {
                            idx = (idx << BigInt(8)) | BigInt(byte);
                        }
                    }
                    var sigBytes = bytes.slice(hdr), originLen = ((_g = g.sign.originSize) !== null && _g !== void 0 ? _g : 256) >>> 3, rest = sigBytes.length - originLen, blkLen = rest / (N - 1);
                    if (rest < 0 || !Number.isInteger(blkLen))
                        throw "SigImporter sizes";
                    var blocks = [sigBytes.slice(0, originLen)];
                    for (var i = 0; i < N - 1; i++)
                        blocks.push(sigBytes.slice(originLen + i * blkLen, originLen + (i + 1) * blkLen));
                    return { bytes: bytes, N: N, mode: mode, alg: alg, index: idx, sigBytes: sigBytes, originLen: originLen, blkLen: blkLen, blocks: blocks };
                },
                origin: function (pkg) {
                    var _a, _b, _c, _d, _e, _f;
                    var bytes = pkg instanceof Uint8Array ? pkg : cv.importToBytes(pkg), hdr = bytes[1];
                    if (hdr === undefined)
                        throw "Invalid package format";
                    if (bytes[0] || bytes[hdr - 1])
                        throw "sentinel";
                    var N = bytes[2];
                    if (N === undefined)
                        throw "Invalid package format";
                    var mode = (_c = (_a = self.decoder) === null || _a === void 0 ? void 0 : _a.mode[(_b = bytes[3]) !== null && _b !== void 0 ? _b : 0]) !== null && _c !== void 0 ? _c : "U", alg = (_f = (_d = self.decoder) === null || _d === void 0 ? void 0 : _d.algorithm[(_e = bytes[4]) !== null && _e !== void 0 ? _e : 0]) !== null && _f !== void 0 ? _f : "UNK";
                    var idx = BigInt(0);
                    for (var i = 5; i < hdr - 1; i++) {
                        var byte = bytes[i];
                        if (byte !== undefined) {
                            idx = (idx << BigInt(8)) | BigInt(byte);
                        }
                    }
                    var body = bytes.slice(hdr), blkLen = body.length / N;
                    if (!Number.isInteger(blkLen))
                        throw "div";
                    var origin = [];
                    for (var i = 0; i < N; i++)
                        origin.push(body.slice(i * blkLen, (i + 1) * blkLen));
                    return { bytes: bytes, N: N, mode: mode, alg: alg, index: idx, blockLen: blkLen, origin: origin };
                },
            },
            OriginGenerator: function () {
                var len = g.sign.originSize >>> 3;
                return {
                    origin: Array.from({ length: g.sign.N }, function () { return a.RandomBlock(len); }),
                };
            },
            RandomBlock: function (len) { return crypto.getRandomValues(new Uint8Array(len)); },
            _hdr: function (N, mode, alg, idxBytes) {
                var _a, _b, _c, _d;
                var h = new Uint8Array(5 + idxBytes.length + 1);
                h.set([0, h.length, N, (_b = (_a = self.encoder) === null || _a === void 0 ? void 0 : _a.mode[mode]) !== null && _b !== void 0 ? _b : 255, (_d = (_c = self.encoder) === null || _c === void 0 ? void 0 : _c.algorithm[alg]) !== null && _d !== void 0 ? _d : 255]);
                h.set(idxBytes, 5);
                h[h.length - 1] = 0;
                return h;
            },
            NewExporter: function (originObj, index) {
                if (index === void 0) { index = BigInt(0); }
                var _a = g.sign, N = _a.N, mode = _a.mode, hash = _a.hash, hdr = a._hdr(N, mode, hash, cv.indexToBytes(index));
                return cv.export(cv.concatBytes.apply(cv, __spreadArray([hdr], originObj.origin, false)));
            },
            SignExporter: function (sigBytes, index, N, mode, hash) {
                var hdr = a._hdr(N, mode, hash, cv.indexToBytes(index));
                return cv.export(cv.concatBytes(hdr, sigBytes));
            },
            PackSignature: function (sigBytes, m) {
                return a.SignExporter(sigBytes, m.index, m.N, m.mode, m.alg);
            },
            StepUp: function (pkg) {
                var _a = a.import.origin(pkg), origin = _a.origin, blockLen = _a.blockLen, index = _a.index, next = origin.slice(1);
                next.push(a.RandomBlock(blockLen));
                return a.NewExporter({ origin: next }, index + BigInt(1));
            },
        };
    }
    UldaSign.loadScriptOnce = function (src) {
        return new Promise(function (res, rej) {
            if (document.querySelector("script[src=\"".concat(src, "\"]")))
                return res();
            var s = document.createElement("script");
            s.src = src;
            s.onload = function () { return res(); };
            s.onerror = function () { return rej(new Error("Failed to load script: ".concat(src))); };
            document.head.appendChild(s);
        });
    };
    UldaSign.prototype.New = function (i) {
        if (i === void 0) { i = BigInt(0); }
        return this.actions.NewExporter(this.actions.OriginGenerator(), i);
    };
    UldaSign.prototype.stepUp = function (pkg) {
        return this.actions.StepUp(pkg);
    };
    UldaSign.prototype.sign = function (pkg) {
        return this.actions.Sign(pkg);
    };
    UldaSign.prototype.verify = function (a, b) {
        return this.actions.Verify(a, b);
    };
    return UldaSign;
}());
module.exports = UldaSign;
if (typeof window !== "undefined" && !window.UldaSign)
    window.UldaSign = UldaSign;
