(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // shims/process.js
  var process;
  var init_process = __esm({
    "shims/process.js"() {
      process = { platform: "android", env: {}, cwd: () => "/", contextIsolated: true, resourcesPath: "/" };
    }
  });

  // shims/stub.js
  var require_stub = __commonJS({
    "shims/stub.js"(exports, module) {
      init_process();
      module.exports = { existsSync: () => false, tmpdir: () => "/tmp", platform: () => "android" };
    }
  });

  // node_modules/path-browserify/index.js
  var require_path_browserify = __commonJS({
    "node_modules/path-browserify/index.js"(exports, module) {
      "use strict";
      init_process();
      function assertPath(path) {
        if (typeof path !== "string") {
          throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
        }
      }
      function normalizeStringPosix(path, allowAboveRoot) {
        var res = "";
        var lastSegmentLength = 0;
        var lastSlash = -1;
        var dots = 0;
        var code;
        for (var i = 0; i <= path.length; ++i) {
          if (i < path.length)
            code = path.charCodeAt(i);
          else if (code === 47)
            break;
          else
            code = 47;
          if (code === 47) {
            if (lastSlash === i - 1 || dots === 1) {
            } else if (lastSlash !== i - 1 && dots === 2) {
              if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
                if (res.length > 2) {
                  var lastSlashIndex = res.lastIndexOf("/");
                  if (lastSlashIndex !== res.length - 1) {
                    if (lastSlashIndex === -1) {
                      res = "";
                      lastSegmentLength = 0;
                    } else {
                      res = res.slice(0, lastSlashIndex);
                      lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
                    }
                    lastSlash = i;
                    dots = 0;
                    continue;
                  }
                } else if (res.length === 2 || res.length === 1) {
                  res = "";
                  lastSegmentLength = 0;
                  lastSlash = i;
                  dots = 0;
                  continue;
                }
              }
              if (allowAboveRoot) {
                if (res.length > 0)
                  res += "/..";
                else
                  res = "..";
                lastSegmentLength = 2;
              }
            } else {
              if (res.length > 0)
                res += "/" + path.slice(lastSlash + 1, i);
              else
                res = path.slice(lastSlash + 1, i);
              lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
          } else if (code === 46 && dots !== -1) {
            ++dots;
          } else {
            dots = -1;
          }
        }
        return res;
      }
      function _format(sep, pathObject) {
        var dir = pathObject.dir || pathObject.root;
        var base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir) {
          return base;
        }
        if (dir === pathObject.root) {
          return dir + base;
        }
        return dir + sep + base;
      }
      var posix = {
        // path.resolve([from ...], to)
        resolve: function resolve() {
          var resolvedPath = "";
          var resolvedAbsolute = false;
          var cwd;
          for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path;
            if (i >= 0)
              path = arguments[i];
            else {
              if (cwd === void 0)
                cwd = process.cwd();
              path = cwd;
            }
            assertPath(path);
            if (path.length === 0) {
              continue;
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charCodeAt(0) === 47;
          }
          resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
          if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
              return "/" + resolvedPath;
            else
              return "/";
          } else if (resolvedPath.length > 0) {
            return resolvedPath;
          } else {
            return ".";
          }
        },
        normalize: function normalize(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var isAbsolute = path.charCodeAt(0) === 47;
          var trailingSeparator = path.charCodeAt(path.length - 1) === 47;
          path = normalizeStringPosix(path, !isAbsolute);
          if (path.length === 0 && !isAbsolute) path = ".";
          if (path.length > 0 && trailingSeparator) path += "/";
          if (isAbsolute) return "/" + path;
          return path;
        },
        isAbsolute: function isAbsolute(path) {
          assertPath(path);
          return path.length > 0 && path.charCodeAt(0) === 47;
        },
        join: function join() {
          if (arguments.length === 0)
            return ".";
          var joined;
          for (var i = 0; i < arguments.length; ++i) {
            var arg = arguments[i];
            assertPath(arg);
            if (arg.length > 0) {
              if (joined === void 0)
                joined = arg;
              else
                joined += "/" + arg;
            }
          }
          if (joined === void 0)
            return ".";
          return posix.normalize(joined);
        },
        relative: function relative(from, to) {
          assertPath(from);
          assertPath(to);
          if (from === to) return "";
          from = posix.resolve(from);
          to = posix.resolve(to);
          if (from === to) return "";
          var fromStart = 1;
          for (; fromStart < from.length; ++fromStart) {
            if (from.charCodeAt(fromStart) !== 47)
              break;
          }
          var fromEnd = from.length;
          var fromLen = fromEnd - fromStart;
          var toStart = 1;
          for (; toStart < to.length; ++toStart) {
            if (to.charCodeAt(toStart) !== 47)
              break;
          }
          var toEnd = to.length;
          var toLen = toEnd - toStart;
          var length = fromLen < toLen ? fromLen : toLen;
          var lastCommonSep = -1;
          var i = 0;
          for (; i <= length; ++i) {
            if (i === length) {
              if (toLen > length) {
                if (to.charCodeAt(toStart + i) === 47) {
                  return to.slice(toStart + i + 1);
                } else if (i === 0) {
                  return to.slice(toStart + i);
                }
              } else if (fromLen > length) {
                if (from.charCodeAt(fromStart + i) === 47) {
                  lastCommonSep = i;
                } else if (i === 0) {
                  lastCommonSep = 0;
                }
              }
              break;
            }
            var fromCode = from.charCodeAt(fromStart + i);
            var toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
              break;
            else if (fromCode === 47)
              lastCommonSep = i;
          }
          var out = "";
          for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === 47) {
              if (out.length === 0)
                out += "..";
              else
                out += "/..";
            }
          }
          if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
          else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === 47)
              ++toStart;
            return to.slice(toStart);
          }
        },
        _makeLong: function _makeLong(path) {
          return path;
        },
        dirname: function dirname(path) {
          assertPath(path);
          if (path.length === 0) return ".";
          var code = path.charCodeAt(0);
          var hasRoot = code === 47;
          var end = -1;
          var matchedSlash = true;
          for (var i = path.length - 1; i >= 1; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                end = i;
                break;
              }
            } else {
              matchedSlash = false;
            }
          }
          if (end === -1) return hasRoot ? "/" : ".";
          if (hasRoot && end === 1) return "//";
          return path.slice(0, end);
        },
        basename: function basename(path, ext) {
          if (ext !== void 0 && typeof ext !== "string") throw new TypeError('"ext" argument must be a string');
          assertPath(path);
          var start = 0;
          var end = -1;
          var matchedSlash = true;
          var i;
          if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            var extIdx = ext.length - 1;
            var firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
              var code = path.charCodeAt(i);
              if (code === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else {
                if (firstNonSlashEnd === -1) {
                  matchedSlash = false;
                  firstNonSlashEnd = i + 1;
                }
                if (extIdx >= 0) {
                  if (code === ext.charCodeAt(extIdx)) {
                    if (--extIdx === -1) {
                      end = i;
                    }
                  } else {
                    extIdx = -1;
                    end = firstNonSlashEnd;
                  }
                }
              }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
          } else {
            for (i = path.length - 1; i >= 0; --i) {
              if (path.charCodeAt(i) === 47) {
                if (!matchedSlash) {
                  start = i + 1;
                  break;
                }
              } else if (end === -1) {
                matchedSlash = false;
                end = i + 1;
              }
            }
            if (end === -1) return "";
            return path.slice(start, end);
          }
        },
        extname: function extname(path) {
          assertPath(path);
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var preDotState = 0;
          for (var i = path.length - 1; i >= 0; --i) {
            var code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1)
                startDot = i;
              else if (preDotState !== 1)
                preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
          }
          return path.slice(startDot, end);
        },
        format: function format(pathObject) {
          if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
          }
          return _format("/", pathObject);
        },
        parse: function parse(path) {
          assertPath(path);
          var ret = { root: "", dir: "", base: "", ext: "", name: "" };
          if (path.length === 0) return ret;
          var code = path.charCodeAt(0);
          var isAbsolute = code === 47;
          var start;
          if (isAbsolute) {
            ret.root = "/";
            start = 1;
          } else {
            start = 0;
          }
          var startDot = -1;
          var startPart = 0;
          var end = -1;
          var matchedSlash = true;
          var i = path.length - 1;
          var preDotState = 0;
          for (; i >= start; --i) {
            code = path.charCodeAt(i);
            if (code === 47) {
              if (!matchedSlash) {
                startPart = i + 1;
                break;
              }
              continue;
            }
            if (end === -1) {
              matchedSlash = false;
              end = i + 1;
            }
            if (code === 46) {
              if (startDot === -1) startDot = i;
              else if (preDotState !== 1) preDotState = 1;
            } else if (startDot !== -1) {
              preDotState = -1;
            }
          }
          if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
          preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
          preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
              if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
              else ret.base = ret.name = path.slice(startPart, end);
            }
          } else {
            if (startPart === 0 && isAbsolute) {
              ret.name = path.slice(1, startDot);
              ret.base = path.slice(1, end);
            } else {
              ret.name = path.slice(startPart, startDot);
              ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
          }
          if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
          else if (isAbsolute) ret.dir = "/";
          return ret;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null
      };
      posix.posix = posix;
      module.exports = posix;
    }
  });

  // node_modules/@noble/hashes/_assert.js
  var require_assert = __commonJS({
    "node_modules/@noble/hashes/_assert.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isBytes = isBytes;
      exports.number = number;
      exports.bool = bool;
      exports.bytes = bytes;
      exports.hash = hash;
      exports.exists = exists;
      exports.output = output;
      function number(n) {
        if (!Number.isSafeInteger(n) || n < 0)
          throw new Error(`positive integer expected, not ${n}`);
      }
      function bool(b) {
        if (typeof b !== "boolean")
          throw new Error(`boolean expected, not ${b}`);
      }
      function isBytes(a) {
        return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
      }
      function bytes(b, ...lengths) {
        if (!isBytes(b))
          throw new Error("Uint8Array expected");
        if (lengths.length > 0 && !lengths.includes(b.length))
          throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
      }
      function hash(h) {
        if (typeof h !== "function" || typeof h.create !== "function")
          throw new Error("Hash should be wrapped by utils.wrapConstructor");
        number(h.outputLen);
        number(h.blockLen);
      }
      function exists(instance, checkFinished = true) {
        if (instance.destroyed)
          throw new Error("Hash instance has been destroyed");
        if (checkFinished && instance.finished)
          throw new Error("Hash#digest() has already been called");
      }
      function output(out, instance) {
        bytes(out);
        const min = instance.outputLen;
        if (out.length < min) {
          throw new Error(`digestInto() expects output buffer of length at least ${min}`);
        }
      }
      var assert = { number, bool, bytes, hash, exists, output };
      exports.default = assert;
    }
  });

  // node_modules/@noble/hashes/crypto.js
  var require_crypto = __commonJS({
    "node_modules/@noble/hashes/crypto.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.crypto = void 0;
      exports.crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    }
  });

  // node_modules/@noble/hashes/utils.js
  var require_utils = __commonJS({
    "node_modules/@noble/hashes/utils.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Hash = exports.nextTick = exports.byteSwapIfBE = exports.byteSwap = exports.isLE = exports.rotl = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
      exports.isBytes = isBytes;
      exports.byteSwap32 = byteSwap32;
      exports.bytesToHex = bytesToHex;
      exports.hexToBytes = hexToBytes;
      exports.asyncLoop = asyncLoop;
      exports.utf8ToBytes = utf8ToBytes;
      exports.toBytes = toBytes;
      exports.concatBytes = concatBytes;
      exports.checkOpts = checkOpts;
      exports.wrapConstructor = wrapConstructor;
      exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
      exports.wrapXOFConstructorWithOpts = wrapXOFConstructorWithOpts;
      exports.randomBytes = randomBytes;
      var crypto_1 = require_crypto();
      var _assert_js_1 = require_assert();
      function isBytes(a) {
        return a instanceof Uint8Array || a != null && typeof a === "object" && a.constructor.name === "Uint8Array";
      }
      var u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      exports.u8 = u8;
      var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
      exports.u32 = u32;
      var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
      exports.createView = createView;
      var rotr = (word, shift) => word << 32 - shift | word >>> shift;
      exports.rotr = rotr;
      var rotl = (word, shift) => word << shift | word >>> 32 - shift >>> 0;
      exports.rotl = rotl;
      exports.isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
      var byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
      exports.byteSwap = byteSwap;
      exports.byteSwapIfBE = exports.isLE ? (n) => n : (n) => (0, exports.byteSwap)(n);
      function byteSwap32(arr) {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = (0, exports.byteSwap)(arr[i]);
        }
      }
      var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
      function bytesToHex(bytes) {
        (0, _assert_js_1.bytes)(bytes);
        let hex = "";
        for (let i = 0; i < bytes.length; i++) {
          hex += hexes[bytes[i]];
        }
        return hex;
      }
      var asciis = { _0: 48, _9: 57, _A: 65, _F: 70, _a: 97, _f: 102 };
      function asciiToBase16(char) {
        if (char >= asciis._0 && char <= asciis._9)
          return char - asciis._0;
        if (char >= asciis._A && char <= asciis._F)
          return char - (asciis._A - 10);
        if (char >= asciis._a && char <= asciis._f)
          return char - (asciis._a - 10);
        return;
      }
      function hexToBytes(hex) {
        if (typeof hex !== "string")
          throw new Error("hex string expected, got " + typeof hex);
        const hl = hex.length;
        const al = hl / 2;
        if (hl % 2)
          throw new Error("padded hex string expected, got unpadded hex of length " + hl);
        const array = new Uint8Array(al);
        for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
          const n1 = asciiToBase16(hex.charCodeAt(hi));
          const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
          if (n1 === void 0 || n2 === void 0) {
            const char = hex[hi] + hex[hi + 1];
            throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
          }
          array[ai] = n1 * 16 + n2;
        }
        return array;
      }
      var nextTick = async () => {
      };
      exports.nextTick = nextTick;
      async function asyncLoop(iters, tick, cb) {
        let ts = Date.now();
        for (let i = 0; i < iters; i++) {
          cb(i);
          const diff = Date.now() - ts;
          if (diff >= 0 && diff < tick)
            continue;
          await (0, exports.nextTick)();
          ts += diff;
        }
      }
      function utf8ToBytes(str) {
        if (typeof str !== "string")
          throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
        return new Uint8Array(new TextEncoder().encode(str));
      }
      function toBytes(data) {
        if (typeof data === "string")
          data = utf8ToBytes(data);
        (0, _assert_js_1.bytes)(data);
        return data;
      }
      function concatBytes(...arrays) {
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
          const a = arrays[i];
          (0, _assert_js_1.bytes)(a);
          sum += a.length;
        }
        const res = new Uint8Array(sum);
        for (let i = 0, pad = 0; i < arrays.length; i++) {
          const a = arrays[i];
          res.set(a, pad);
          pad += a.length;
        }
        return res;
      }
      var Hash = class {
        // Safe version that clones internal state
        clone() {
          return this._cloneInto();
        }
      };
      exports.Hash = Hash;
      var toStr = {}.toString;
      function checkOpts(defaults, opts) {
        if (opts !== void 0 && toStr.call(opts) !== "[object Object]")
          throw new Error("Options should be object or undefined");
        const merged = Object.assign(defaults, opts);
        return merged;
      }
      function wrapConstructor(hashCons) {
        const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
        const tmp = hashCons();
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = () => hashCons();
        return hashC;
      }
      function wrapConstructorWithOpts(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      function wrapXOFConstructorWithOpts(hashCons) {
        const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
        const tmp = hashCons({});
        hashC.outputLen = tmp.outputLen;
        hashC.blockLen = tmp.blockLen;
        hashC.create = (opts) => hashCons(opts);
        return hashC;
      }
      function randomBytes(bytesLength = 32) {
        if (crypto_1.crypto && typeof crypto_1.crypto.getRandomValues === "function") {
          return crypto_1.crypto.getRandomValues(new Uint8Array(bytesLength));
        }
        if (crypto_1.crypto && typeof crypto_1.crypto.randomBytes === "function") {
          return crypto_1.crypto.randomBytes(bytesLength);
        }
        throw new Error("crypto.getRandomValues must be defined");
      }
    }
  });

  // node_modules/@noble/hashes/_md.js
  var require_md = __commonJS({
    "node_modules/@noble/hashes/_md.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.HashMD = exports.Maj = exports.Chi = void 0;
      var _assert_js_1 = require_assert();
      var utils_js_1 = require_utils();
      function setBigUint64(view, byteOffset, value, isLE) {
        if (typeof view.setBigUint64 === "function")
          return view.setBigUint64(byteOffset, value, isLE);
        const _32n = BigInt(32);
        const _u32_max = BigInt(4294967295);
        const wh = Number(value >> _32n & _u32_max);
        const wl = Number(value & _u32_max);
        const h = isLE ? 4 : 0;
        const l = isLE ? 0 : 4;
        view.setUint32(byteOffset + h, wh, isLE);
        view.setUint32(byteOffset + l, wl, isLE);
      }
      var Chi = (a, b, c) => a & b ^ ~a & c;
      exports.Chi = Chi;
      var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
      exports.Maj = Maj;
      var HashMD = class extends utils_js_1.Hash {
        constructor(blockLen, outputLen, padOffset, isLE) {
          super();
          this.blockLen = blockLen;
          this.outputLen = outputLen;
          this.padOffset = padOffset;
          this.isLE = isLE;
          this.finished = false;
          this.length = 0;
          this.pos = 0;
          this.destroyed = false;
          this.buffer = new Uint8Array(blockLen);
          this.view = (0, utils_js_1.createView)(this.buffer);
        }
        update(data) {
          (0, _assert_js_1.exists)(this);
          const { view, buffer, blockLen } = this;
          data = (0, utils_js_1.toBytes)(data);
          const len = data.length;
          for (let pos = 0; pos < len; ) {
            const take = Math.min(blockLen - this.pos, len - pos);
            if (take === blockLen) {
              const dataView = (0, utils_js_1.createView)(data);
              for (; blockLen <= len - pos; pos += blockLen)
                this.process(dataView, pos);
              continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
              this.process(view, 0);
              this.pos = 0;
            }
          }
          this.length += data.length;
          this.roundClean();
          return this;
        }
        digestInto(out) {
          (0, _assert_js_1.exists)(this);
          (0, _assert_js_1.output)(out, this);
          this.finished = true;
          const { buffer, view, blockLen, isLE } = this;
          let { pos } = this;
          buffer[pos++] = 128;
          this.buffer.subarray(pos).fill(0);
          if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
          }
          for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
          setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
          this.process(view, 0);
          const oview = (0, utils_js_1.createView)(out);
          const len = this.outputLen;
          if (len % 4)
            throw new Error("_sha2: outputLen should be aligned to 32bit");
          const outLen = len / 4;
          const state = this.get();
          if (outLen > state.length)
            throw new Error("_sha2: outputLen bigger than state");
          for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
        }
        digest() {
          const { buffer, outputLen } = this;
          this.digestInto(buffer);
          const res = buffer.slice(0, outputLen);
          this.destroy();
          return res;
        }
        _cloneInto(to) {
          to || (to = new this.constructor());
          to.set(...this.get());
          const { blockLen, buffer, length, finished, destroyed, pos } = this;
          to.length = length;
          to.pos = pos;
          to.finished = finished;
          to.destroyed = destroyed;
          if (length % blockLen)
            to.buffer.set(buffer);
          return to;
        }
      };
      exports.HashMD = HashMD;
    }
  });

  // node_modules/@noble/hashes/sha256.js
  var require_sha256 = __commonJS({
    "node_modules/@noble/hashes/sha256.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sha224 = exports.sha256 = exports.SHA256 = void 0;
      var _md_js_1 = require_md();
      var utils_js_1 = require_utils();
      var SHA256_K = /* @__PURE__ */ new Uint32Array([
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ]);
      var SHA256_IV = /* @__PURE__ */ new Uint32Array([
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ]);
      var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
      var SHA256 = class extends _md_js_1.HashMD {
        constructor() {
          super(64, 32, 8, false);
          this.A = SHA256_IV[0] | 0;
          this.B = SHA256_IV[1] | 0;
          this.C = SHA256_IV[2] | 0;
          this.D = SHA256_IV[3] | 0;
          this.E = SHA256_IV[4] | 0;
          this.F = SHA256_IV[5] | 0;
          this.G = SHA256_IV[6] | 0;
          this.H = SHA256_IV[7] | 0;
        }
        get() {
          const { A, B, C, D, E, F, G, H } = this;
          return [A, B, C, D, E, F, G, H];
        }
        // prettier-ignore
        set(A, B, C, D, E, F, G, H) {
          this.A = A | 0;
          this.B = B | 0;
          this.C = C | 0;
          this.D = D | 0;
          this.E = E | 0;
          this.F = F | 0;
          this.G = G | 0;
          this.H = H | 0;
        }
        process(view, offset) {
          for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
          for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ W15 >>> 3;
            const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ W2 >>> 10;
            SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
          }
          let { A, B, C, D, E, F, G, H } = this;
          for (let i = 0; i < 64; i++) {
            const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
            const T1 = H + sigma1 + (0, _md_js_1.Chi)(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
            const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
            const T2 = sigma0 + (0, _md_js_1.Maj)(A, B, C) | 0;
            H = G;
            G = F;
            F = E;
            E = D + T1 | 0;
            D = C;
            C = B;
            B = A;
            A = T1 + T2 | 0;
          }
          A = A + this.A | 0;
          B = B + this.B | 0;
          C = C + this.C | 0;
          D = D + this.D | 0;
          E = E + this.E | 0;
          F = F + this.F | 0;
          G = G + this.G | 0;
          H = H + this.H | 0;
          this.set(A, B, C, D, E, F, G, H);
        }
        roundClean() {
          SHA256_W.fill(0);
        }
        destroy() {
          this.set(0, 0, 0, 0, 0, 0, 0, 0);
          this.buffer.fill(0);
        }
      };
      exports.SHA256 = SHA256;
      var SHA224 = class extends SHA256 {
        constructor() {
          super();
          this.A = 3238371032 | 0;
          this.B = 914150663 | 0;
          this.C = 812702999 | 0;
          this.D = 4144912697 | 0;
          this.E = 4290775857 | 0;
          this.F = 1750603025 | 0;
          this.G = 1694076839 | 0;
          this.H = 3204075428 | 0;
          this.outputLen = 28;
        }
      };
      exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
      exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
    }
  });

  // node_modules/@noble/hashes/hmac.js
  var require_hmac = __commonJS({
    "node_modules/@noble/hashes/hmac.js"(exports) {
      "use strict";
      init_process();
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hmac = exports.HMAC = void 0;
      var _assert_js_1 = require_assert();
      var utils_js_1 = require_utils();
      var HMAC = class extends utils_js_1.Hash {
        constructor(hash, _key) {
          super();
          this.finished = false;
          this.destroyed = false;
          (0, _assert_js_1.hash)(hash);
          const key = (0, utils_js_1.toBytes)(_key);
          this.iHash = hash.create();
          if (typeof this.iHash.update !== "function")
            throw new Error("Expected instance of class which extends utils.Hash");
          this.blockLen = this.iHash.blockLen;
          this.outputLen = this.iHash.outputLen;
          const blockLen = this.blockLen;
          const pad = new Uint8Array(blockLen);
          pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54;
          this.iHash.update(pad);
          this.oHash = hash.create();
          for (let i = 0; i < pad.length; i++)
            pad[i] ^= 54 ^ 92;
          this.oHash.update(pad);
          pad.fill(0);
        }
        update(buf) {
          (0, _assert_js_1.exists)(this);
          this.iHash.update(buf);
          return this;
        }
        digestInto(out) {
          (0, _assert_js_1.exists)(this);
          (0, _assert_js_1.bytes)(out, this.outputLen);
          this.finished = true;
          this.iHash.digestInto(out);
          this.oHash.update(out);
          this.oHash.digestInto(out);
          this.destroy();
        }
        digest() {
          const out = new Uint8Array(this.oHash.outputLen);
          this.digestInto(out);
          return out;
        }
        _cloneInto(to) {
          to || (to = Object.create(Object.getPrototypeOf(this), {}));
          const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
          to = to;
          to.finished = finished;
          to.destroyed = destroyed;
          to.blockLen = blockLen;
          to.outputLen = outputLen;
          to.oHash = oHash._cloneInto(to.oHash);
          to.iHash = iHash._cloneInto(to.iHash);
          return to;
        }
        destroy() {
          this.destroyed = true;
          this.oHash.destroy();
          this.iHash.destroy();
        }
      };
      exports.HMAC = HMAC;
      var hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
      exports.hmac = hmac;
      exports.hmac.create = (hash, key) => new HMAC(hash, key);
    }
  });

  // shims/crypto.js
  var require_crypto2 = __commonJS({
    "shims/crypto.js"(exports, module) {
      init_process();
      var { sha256 } = require_sha256();
      var { hmac } = require_hmac();
      var { bytesToHex, utf8ToBytes } = require_utils();
      var acc = (fin) => {
        let d = "";
        const o = { update(s) {
          d += s;
          return o;
        }, digest: () => fin(d) };
        return o;
      };
      module.exports = {
        createHash: () => acc((d) => bytesToHex(sha256(utf8ToBytes(d)))),
        createHmac: (_a, k) => acc((d) => bytesToHex(hmac(sha256, utf8ToBytes(k), utf8ToBytes(d)))),
        randomBytes: (n) => {
          const b = globalThis.crypto.getRandomValues(new Uint8Array(n));
          return { toString: () => bytesToHex(b) };
        }
      };
    }
  });

  // node_modules/sql.js/dist/sql-wasm.js
  var require_sql_wasm = __commonJS({
    "node_modules/sql.js/dist/sql-wasm.js"(exports, module) {
      init_process();
      var initSqlJsPromise = void 0;
      var initSqlJs2 = function(moduleConfig) {
        if (initSqlJsPromise) {
          return initSqlJsPromise;
        }
        initSqlJsPromise = new Promise(function(resolveModule, reject) {
          var Module = typeof moduleConfig !== "undefined" ? moduleConfig : {};
          var originalOnAbortFunction = Module["onAbort"];
          Module["onAbort"] = function(errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort));
            if (originalOnAbortFunction) {
              originalOnAbortFunction(errorThatCausedAbort);
            }
          };
          Module["postRun"] = Module["postRun"] || [];
          Module["postRun"].push(function() {
            resolveModule(Module);
          });
          module = void 0;
          var f;
          f ||= typeof Module !== "undefined" ? Module : {};
          "use strict";
          f.onRuntimeInitialized = function() {
            function a(g, l) {
              switch (typeof l) {
                case "boolean":
                  mc(g, l ? 1 : 0);
                  break;
                case "number":
                  nc(g, l);
                  break;
                case "string":
                  oc(g, l, -1, -1);
                  break;
                case "object":
                  if (null === l) lb(g);
                  else if (null != l.length) {
                    var n = aa(l, ba);
                    pc(g, n, l.length, -1);
                    ca(n);
                  } else Aa(g, "Wrong API use : tried to return a value of an unknown type (" + l + ").", -1);
                  break;
                default:
                  lb(g);
              }
            }
            function b(g, l) {
              for (var n = [], t = 0; t < g; t += 1) {
                var w = m(l + 4 * t, "i32"), z = qc(w);
                if (1 === z || 2 === z) w = rc(w);
                else if (3 === z) w = sc(w);
                else if (4 === z) {
                  z = w;
                  w = tc(z);
                  z = uc(z);
                  for (var N = new Uint8Array(w), L = 0; L < w; L += 1) N[L] = p[z + L];
                  w = N;
                } else w = null;
                n.push(w);
              }
              return n;
            }
            function c(g, l) {
              this.La = g;
              this.db = l;
              this.Ja = 1;
              this.fb = [];
            }
            function d(g, l) {
              this.db = l;
              l = da(g) + 1;
              this.Ya = ea(l);
              if (null === this.Ya) throw Error("Unable to allocate memory for the SQL string");
              fa(g, q, this.Ya, l);
              this.eb = this.Ya;
              this.Ua = this.ib = null;
            }
            function e(g) {
              this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);
              if (null != g) {
                var l = this.filename, n = "/", t = l;
                n && (n = "string" == typeof n ? n : ha(n), t = l ? u(n + "/" + l) : n);
                l = ia(true, true);
                t = ja(t, (void 0 !== l ? l : 438) & 4095 | 32768, 0);
                if (g) {
                  if ("string" == typeof g) {
                    n = Array(g.length);
                    for (var w = 0, z = g.length; w < z; ++w) n[w] = g.charCodeAt(w);
                    g = n;
                  }
                  ka(t, l | 146);
                  n = la(t, 577);
                  ma(n, g, 0, g.length, 0);
                  na(n);
                  ka(t, l);
                }
              }
              this.handleError(r(this.filename, h));
              this.db = m(h, "i32");
              ob(this.db);
              this.Za = {};
              this.Na = {};
            }
            var h = x(4), k = f.cwrap, r = k("sqlite3_open", "number", ["string", "number"]), y = k("sqlite3_close_v2", "number", ["number"]), v = k("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]), F = k(
              "sqlite3_changes",
              "number",
              ["number"]
            ), H = k("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]), pb = k("sqlite3_sql", "string", ["number"]), vc = k("sqlite3_normalized_sql", "string", ["number"]), qb = k("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]), wc = k("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]), rb = k("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]), xc = k("sqlite3_bind_double", "number", ["number", "number", "number"]), yc = k("sqlite3_bind_int", "number", ["number", "number", "number"]), zc = k("sqlite3_bind_parameter_index", "number", ["number", "string"]), Ac = k("sqlite3_step", "number", ["number"]), Bc = k("sqlite3_errmsg", "string", ["number"]), Cc = k("sqlite3_column_count", "number", ["number"]), Dc = k("sqlite3_data_count", "number", ["number"]), Ec = k("sqlite3_column_double", "number", ["number", "number"]), sb = k("sqlite3_column_text", "string", ["number", "number"]), Fc = k("sqlite3_column_blob", "number", ["number", "number"]), Gc = k(
              "sqlite3_column_bytes",
              "number",
              ["number", "number"]
            ), Hc = k("sqlite3_column_type", "number", ["number", "number"]), Ic = k("sqlite3_column_name", "string", ["number", "number"]), Jc = k("sqlite3_reset", "number", ["number"]), Kc = k("sqlite3_clear_bindings", "number", ["number"]), Lc = k("sqlite3_finalize", "number", ["number"]), tb = k("sqlite3_create_function_v2", "number", "number string number number number number number number number".split(" ")), qc = k("sqlite3_value_type", "number", ["number"]), tc = k("sqlite3_value_bytes", "number", ["number"]), sc = k(
              "sqlite3_value_text",
              "string",
              ["number"]
            ), uc = k("sqlite3_value_blob", "number", ["number"]), rc = k("sqlite3_value_double", "number", ["number"]), nc = k("sqlite3_result_double", "", ["number", "number"]), lb = k("sqlite3_result_null", "", ["number"]), oc = k("sqlite3_result_text", "", ["number", "string", "number", "number"]), pc = k("sqlite3_result_blob", "", ["number", "number", "number", "number"]), mc = k("sqlite3_result_int", "", ["number", "number"]), Aa = k("sqlite3_result_error", "", ["number", "string", "number"]), ub = k(
              "sqlite3_aggregate_context",
              "number",
              ["number", "number"]
            ), ob = k("RegisterExtensionFunctions", "number", ["number"]);
            c.prototype.bind = function(g) {
              if (!this.La) throw "Statement closed";
              this.reset();
              return Array.isArray(g) ? this.wb(g) : null != g && "object" === typeof g ? this.xb(g) : true;
            };
            c.prototype.step = function() {
              if (!this.La) throw "Statement closed";
              this.Ja = 1;
              var g = Ac(this.La);
              switch (g) {
                case 100:
                  return true;
                case 101:
                  return false;
                default:
                  throw this.db.handleError(g);
              }
            };
            c.prototype.rb = function(g) {
              null == g && (g = this.Ja, this.Ja += 1);
              return Ec(this.La, g);
            };
            c.prototype.Ab = function(g) {
              null == g && (g = this.Ja, this.Ja += 1);
              g = sb(this.La, g);
              if ("function" !== typeof BigInt) throw Error("BigInt is not supported");
              return BigInt(g);
            };
            c.prototype.Bb = function(g) {
              null == g && (g = this.Ja, this.Ja += 1);
              return sb(this.La, g);
            };
            c.prototype.getBlob = function(g) {
              null == g && (g = this.Ja, this.Ja += 1);
              var l = Gc(this.La, g);
              g = Fc(this.La, g);
              for (var n = new Uint8Array(l), t = 0; t < l; t += 1) n[t] = p[g + t];
              return n;
            };
            c.prototype.get = function(g, l) {
              l = l || {};
              null != g && this.bind(g) && this.step();
              g = [];
              for (var n = Dc(this.La), t = 0; t < n; t += 1) switch (Hc(this.La, t)) {
                case 1:
                  var w = l.useBigInt ? this.Ab(t) : this.rb(t);
                  g.push(w);
                  break;
                case 2:
                  g.push(this.rb(t));
                  break;
                case 3:
                  g.push(this.Bb(t));
                  break;
                case 4:
                  g.push(this.getBlob(t));
                  break;
                default:
                  g.push(null);
              }
              return g;
            };
            c.prototype.getColumnNames = function() {
              for (var g = [], l = Cc(this.La), n = 0; n < l; n += 1) g.push(Ic(this.La, n));
              return g;
            };
            c.prototype.getAsObject = function(g, l) {
              g = this.get(g, l);
              l = this.getColumnNames();
              for (var n = {}, t = 0; t < l.length; t += 1) n[l[t]] = g[t];
              return n;
            };
            c.prototype.getSQL = function() {
              return pb(this.La);
            };
            c.prototype.getNormalizedSQL = function() {
              return vc(this.La);
            };
            c.prototype.run = function(g) {
              null != g && this.bind(g);
              this.step();
              return this.reset();
            };
            c.prototype.nb = function(g, l) {
              null == l && (l = this.Ja, this.Ja += 1);
              g = oa(g);
              var n = aa(g, ba);
              this.fb.push(n);
              this.db.handleError(wc(this.La, l, n, g.length - 1, 0));
            };
            c.prototype.vb = function(g, l) {
              null == l && (l = this.Ja, this.Ja += 1);
              var n = aa(g, ba);
              this.fb.push(n);
              this.db.handleError(rb(this.La, l, n, g.length, 0));
            };
            c.prototype.mb = function(g, l) {
              null == l && (l = this.Ja, this.Ja += 1);
              this.db.handleError((g === (g | 0) ? yc : xc)(this.La, l, g));
            };
            c.prototype.yb = function(g) {
              null == g && (g = this.Ja, this.Ja += 1);
              rb(this.La, g, 0, 0, 0);
            };
            c.prototype.ob = function(g, l) {
              null == l && (l = this.Ja, this.Ja += 1);
              switch (typeof g) {
                case "string":
                  this.nb(g, l);
                  return;
                case "number":
                  this.mb(g, l);
                  return;
                case "bigint":
                  this.nb(g.toString(), l);
                  return;
                case "boolean":
                  this.mb(g + 0, l);
                  return;
                case "object":
                  if (null === g) {
                    this.yb(l);
                    return;
                  }
                  if (null != g.length) {
                    this.vb(g, l);
                    return;
                  }
              }
              throw "Wrong API use : tried to bind a value of an unknown type (" + g + ").";
            };
            c.prototype.xb = function(g) {
              var l = this;
              Object.keys(g).forEach(function(n) {
                var t = zc(l.La, n);
                0 !== t && l.ob(g[n], t);
              });
              return true;
            };
            c.prototype.wb = function(g) {
              for (var l = 0; l < g.length; l += 1) this.ob(g[l], l + 1);
              return true;
            };
            c.prototype.reset = function() {
              this.freemem();
              return 0 === Kc(this.La) && 0 === Jc(this.La);
            };
            c.prototype.freemem = function() {
              for (var g; void 0 !== (g = this.fb.pop()); ) ca(g);
            };
            c.prototype.free = function() {
              this.freemem();
              var g = 0 === Lc(this.La);
              delete this.db.Za[this.La];
              this.La = 0;
              return g;
            };
            d.prototype.next = function() {
              if (null === this.Ya) return { done: true };
              null !== this.Ua && (this.Ua.free(), this.Ua = null);
              if (!this.db.db) throw this.gb(), Error("Database closed");
              var g = pa(), l = x(4);
              qa(h);
              qa(l);
              try {
                this.db.handleError(qb(this.db.db, this.eb, -1, h, l));
                this.eb = m(l, "i32");
                var n = m(h, "i32");
                if (0 === n) return this.gb(), { done: true };
                this.Ua = new c(n, this.db);
                this.db.Za[n] = this.Ua;
                return { value: this.Ua, done: false };
              } catch (t) {
                throw this.ib = ra(this.eb), this.gb(), t;
              } finally {
                sa(g);
              }
            };
            d.prototype.gb = function() {
              ca(this.Ya);
              this.Ya = null;
            };
            d.prototype.getRemainingSQL = function() {
              return null !== this.ib ? this.ib : ra(this.eb);
            };
            "function" === typeof Symbol && "symbol" === typeof Symbol.iterator && (d.prototype[Symbol.iterator] = function() {
              return this;
            });
            e.prototype.run = function(g, l) {
              if (!this.db) throw "Database closed";
              if (l) {
                g = this.prepare(g, l);
                try {
                  g.step();
                } finally {
                  g.free();
                }
              } else this.handleError(v(this.db, g, 0, 0, h));
              return this;
            };
            e.prototype.exec = function(g, l, n) {
              if (!this.db) throw "Database closed";
              var t = pa(), w = null;
              try {
                var z = ta(g), N = x(4);
                for (g = []; 0 !== m(z, "i8"); ) {
                  qa(h);
                  qa(N);
                  this.handleError(qb(
                    this.db,
                    z,
                    -1,
                    h,
                    N
                  ));
                  var L = m(h, "i32");
                  z = m(N, "i32");
                  if (0 !== L) {
                    var K = null;
                    w = new c(L, this);
                    for (null != l && w.bind(l); w.step(); ) null === K && (K = { columns: w.getColumnNames(), values: [] }, g.push(K)), K.values.push(w.get(null, n));
                    w.free();
                  }
                }
                return g;
              } catch (O) {
                throw w && w.free(), O;
              } finally {
                sa(t);
              }
            };
            e.prototype.each = function(g, l, n, t, w) {
              "function" === typeof l && (t = n, n = l, l = void 0);
              g = this.prepare(g, l);
              try {
                for (; g.step(); ) n(g.getAsObject(null, w));
              } finally {
                g.free();
              }
              if ("function" === typeof t) return t();
            };
            e.prototype.prepare = function(g, l) {
              qa(h);
              this.handleError(H(this.db, g, -1, h, 0));
              g = m(h, "i32");
              if (0 === g) throw "Nothing to prepare";
              var n = new c(g, this);
              null != l && n.bind(l);
              return this.Za[g] = n;
            };
            e.prototype.iterateStatements = function(g) {
              return new d(g, this);
            };
            e.prototype["export"] = function() {
              Object.values(this.Za).forEach(function(l) {
                l.free();
              });
              Object.values(this.Na).forEach(ua);
              this.Na = {};
              this.handleError(y(this.db));
              var g = va(this.filename);
              this.handleError(r(this.filename, h));
              this.db = m(h, "i32");
              ob(this.db);
              return g;
            };
            e.prototype.close = function() {
              null !== this.db && (Object.values(this.Za).forEach(function(g) {
                g.free();
              }), Object.values(this.Na).forEach(ua), this.Na = {}, this.handleError(y(this.db)), wa("/" + this.filename), this.db = null);
            };
            e.prototype.handleError = function(g) {
              if (0 === g) return null;
              g = Bc(this.db);
              throw Error(g);
            };
            e.prototype.getRowsModified = function() {
              return F(this.db);
            };
            e.prototype.create_function = function(g, l) {
              Object.prototype.hasOwnProperty.call(this.Na, g) && (ua(this.Na[g]), delete this.Na[g]);
              var n = xa(function(t, w, z) {
                w = b(w, z);
                try {
                  var N = l.apply(
                    null,
                    w
                  );
                } catch (L) {
                  Aa(t, L, -1);
                  return;
                }
                a(t, N);
              }, "viii");
              this.Na[g] = n;
              this.handleError(tb(this.db, g, l.length, 1, 0, n, 0, 0, 0));
              return this;
            };
            e.prototype.create_aggregate = function(g, l) {
              var n = l.init || function() {
                return null;
              }, t = l.finalize || function(K) {
                return K;
              }, w = l.step;
              if (!w) throw "An aggregate function must have a step function in " + g;
              var z = {};
              Object.hasOwnProperty.call(this.Na, g) && (ua(this.Na[g]), delete this.Na[g]);
              l = g + "__finalize";
              Object.hasOwnProperty.call(this.Na, l) && (ua(this.Na[l]), delete this.Na[l]);
              var N = xa(function(K, O, Ua) {
                var X = ub(K, 1);
                Object.hasOwnProperty.call(z, X) || (z[X] = n());
                O = b(O, Ua);
                O = [z[X]].concat(O);
                try {
                  z[X] = w.apply(null, O);
                } catch (Nc) {
                  delete z[X], Aa(K, Nc, -1);
                }
              }, "viii"), L = xa(function(K) {
                var O = ub(K, 1);
                try {
                  var Ua = t(z[O]);
                } catch (X) {
                  delete z[O];
                  Aa(K, X, -1);
                  return;
                }
                a(K, Ua);
                delete z[O];
              }, "vi");
              this.Na[g] = N;
              this.Na[l] = L;
              this.handleError(tb(this.db, g, w.length - 1, 1, 0, 0, N, L, 0));
              return this;
            };
            f.Database = e;
          };
          var ya = Object.assign({}, f), za = "./this.program", Ba = "object" == typeof window, Ca = "function" == typeof importScripts, Da = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, A = "", Ea, Fa, Ga;
          if (Da) {
            var fs = require_stub(), Ha = require_path_browserify();
            A = Ca ? Ha.dirname(A) + "/" : "//";
            Ea = (a, b) => {
              a = Ia(a) ? new URL(a) : Ha.normalize(a);
              return fs.readFileSync(a, b ? void 0 : "utf8");
            };
            Ga = (a) => {
              a = Ea(a, true);
              a.buffer || (a = new Uint8Array(a));
              return a;
            };
            Fa = (a, b, c, d = true) => {
              a = Ia(a) ? new URL(a) : Ha.normalize(a);
              fs.readFile(a, d ? void 0 : "utf8", (e, h) => {
                e ? c(e) : b(d ? h.buffer : h);
              });
            };
            !f.thisProgram && 1 < process.argv.length && (za = process.argv[1].replace(/\\/g, "/"));
            process.argv.slice(2);
            "undefined" != typeof module && (module.exports = f);
            f.inspect = () => "[Emscripten Module object]";
          } else if (Ba || Ca) Ca ? A = self.location.href : "undefined" != typeof document && document.currentScript && (A = document.currentScript.src), A = 0 !== A.indexOf("blob:") ? A.substr(0, A.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Ea = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.send(null);
            return b.responseText;
          }, Ca && (Ga = (a) => {
            var b = new XMLHttpRequest();
            b.open("GET", a, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }), Fa = (a, b, c) => {
            var d = new XMLHttpRequest();
            d.open(
              "GET",
              a,
              true
            );
            d.responseType = "arraybuffer";
            d.onload = () => {
              200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
            };
            d.onerror = c;
            d.send(null);
          };
          var Ja = f.print || console.log.bind(console), B = f.printErr || console.error.bind(console);
          Object.assign(f, ya);
          ya = null;
          f.thisProgram && (za = f.thisProgram);
          var Ka;
          f.wasmBinary && (Ka = f.wasmBinary);
          "object" != typeof WebAssembly && C("no native wasm support detected");
          var La, Ma = false, p, q, Na, D, E, Oa, Pa;
          function Qa() {
            var a = La.buffer;
            f.HEAP8 = p = new Int8Array(a);
            f.HEAP16 = Na = new Int16Array(a);
            f.HEAPU8 = q = new Uint8Array(a);
            f.HEAPU16 = new Uint16Array(a);
            f.HEAP32 = D = new Int32Array(a);
            f.HEAPU32 = E = new Uint32Array(a);
            f.HEAPF32 = Oa = new Float32Array(a);
            f.HEAPF64 = Pa = new Float64Array(a);
          }
          var Ra = [], Sa = [], Ta = [];
          function Va() {
            var a = f.preRun.shift();
            Ra.unshift(a);
          }
          var G = 0, Wa = null, Xa = null;
          function C(a) {
            f.onAbort?.(a);
            a = "Aborted(" + a + ")";
            B(a);
            Ma = true;
            throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
          }
          var Ya = (a) => a.startsWith("data:application/octet-stream;base64,"), Ia = (a) => a.startsWith("file://"), Za;
          Za = "sql-wasm.wasm";
          if (!Ya(Za)) {
            var $a = Za;
            Za = f.locateFile ? f.locateFile($a, A) : A + $a;
          }
          function ab(a) {
            if (a == Za && Ka) return new Uint8Array(Ka);
            if (Ga) return Ga(a);
            throw "both async and sync fetching of the wasm failed";
          }
          function bb(a) {
            if (!Ka && (Ba || Ca)) {
              if ("function" == typeof fetch && !Ia(a)) return fetch(a, { credentials: "same-origin" }).then((b) => {
                if (!b.ok) throw "failed to load wasm binary file at '" + a + "'";
                return b.arrayBuffer();
              }).catch(() => ab(a));
              if (Fa) return new Promise((b, c) => {
                Fa(a, (d) => b(new Uint8Array(d)), c);
              });
            }
            return Promise.resolve().then(() => ab(a));
          }
          function cb(a, b, c) {
            return bb(a).then((d) => WebAssembly.instantiate(d, b)).then((d) => d).then(c, (d) => {
              B(`failed to asynchronously prepare wasm: ${d}`);
              C(d);
            });
          }
          function db(a, b) {
            var c = Za;
            Ka || "function" != typeof WebAssembly.instantiateStreaming || Ya(c) || Ia(c) || Da || "function" != typeof fetch ? cb(c, a, b) : fetch(c, { credentials: "same-origin" }).then((d) => WebAssembly.instantiateStreaming(d, a).then(b, function(e) {
              B(`wasm streaming compile failed: ${e}`);
              B("falling back to ArrayBuffer instantiation");
              return cb(c, a, b);
            }));
          }
          var I, J, eb = (a) => {
            for (; 0 < a.length; ) a.shift()(f);
          };
          function m(a, b = "i8") {
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                return p[a >> 0];
              case "i8":
                return p[a >> 0];
              case "i16":
                return Na[a >> 1];
              case "i32":
                return D[a >> 2];
              case "i64":
                C("to do getValue(i64) use WASM_BIGINT");
              case "float":
                return Oa[a >> 2];
              case "double":
                return Pa[a >> 3];
              case "*":
                return E[a >> 2];
              default:
                C(`invalid type for getValue: ${b}`);
            }
          }
          function qa(a) {
            var b = "i32";
            b.endsWith("*") && (b = "*");
            switch (b) {
              case "i1":
                p[a >> 0] = 0;
                break;
              case "i8":
                p[a >> 0] = 0;
                break;
              case "i16":
                Na[a >> 1] = 0;
                break;
              case "i32":
                D[a >> 2] = 0;
                break;
              case "i64":
                C("to do setValue(i64) use WASM_BIGINT");
              case "float":
                Oa[a >> 2] = 0;
                break;
              case "double":
                Pa[a >> 3] = 0;
                break;
              case "*":
                E[a >> 2] = 0;
                break;
              default:
                C(`invalid type for setValue: ${b}`);
            }
          }
          var fb = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, M = (a, b, c) => {
            var d = b + c;
            for (c = b; a[c] && !(c >= d); ) ++c;
            if (16 < c - b && a.buffer && fb) return fb.decode(a.subarray(b, c));
            for (d = ""; b < c; ) {
              var e = a[b++];
              if (e & 128) {
                var h = a[b++] & 63;
                if (192 == (e & 224)) d += String.fromCharCode((e & 31) << 6 | h);
                else {
                  var k = a[b++] & 63;
                  e = 224 == (e & 240) ? (e & 15) << 12 | h << 6 | k : (e & 7) << 18 | h << 12 | k << 6 | a[b++] & 63;
                  65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
                }
              } else d += String.fromCharCode(e);
            }
            return d;
          }, ra = (a, b) => a ? M(q, a, b) : "", gb = (a, b) => {
            for (var c = 0, d = a.length - 1; 0 <= d; d--) {
              var e = a[d];
              "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
            }
            if (b) for (; c; c--) a.unshift("..");
            return a;
          }, u = (a) => {
            var b = "/" === a.charAt(0), c = "/" === a.substr(-1);
            (a = gb(a.split("/").filter((d) => !!d), !b).join("/")) || b || (a = ".");
            a && c && (a += "/");
            return (b ? "/" : "") + a;
          }, hb = (a) => {
            var b = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
            a = b[0];
            b = b[1];
            if (!a && !b) return ".";
            b &&= b.substr(0, b.length - 1);
            return a + b;
          }, ib = (a) => {
            if ("/" === a) return "/";
            a = u(a);
            a = a.replace(/\/$/, "");
            var b = a.lastIndexOf("/");
            return -1 === b ? a : a.substr(b + 1);
          }, jb = () => {
            if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) return (c) => crypto.getRandomValues(c);
            if (Da) try {
              var a = require_crypto2();
              if (a.randomFillSync) return (c) => a.randomFillSync(c);
              var b = a.randomBytes;
              return (c) => (c.set(b(c.byteLength)), c);
            } catch (c) {
            }
            C("initRandomDevice");
          }, kb = (a) => (kb = jb())(a);
          function mb() {
            for (var a = "", b = false, c = arguments.length - 1; -1 <= c && !b; c--) {
              b = 0 <= c ? arguments[c] : "/";
              if ("string" != typeof b) throw new TypeError("Arguments to path.resolve must be strings");
              if (!b) return "";
              a = b + "/" + a;
              b = "/" === b.charAt(0);
            }
            a = gb(a.split("/").filter((d) => !!d), !b).join("/");
            return (b ? "/" : "") + a || ".";
          }
          var nb = [], da = (a) => {
            for (var b = 0, c = 0; c < a.length; ++c) {
              var d = a.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            return b;
          }, fa = (a, b, c, d) => {
            if (!(0 < d)) return 0;
            var e = c;
            d = c + d - 1;
            for (var h = 0; h < a.length; ++h) {
              var k = a.charCodeAt(h);
              if (55296 <= k && 57343 >= k) {
                var r = a.charCodeAt(++h);
                k = 65536 + ((k & 1023) << 10) | r & 1023;
              }
              if (127 >= k) {
                if (c >= d) break;
                b[c++] = k;
              } else {
                if (2047 >= k) {
                  if (c + 1 >= d) break;
                  b[c++] = 192 | k >> 6;
                } else {
                  if (65535 >= k) {
                    if (c + 2 >= d) break;
                    b[c++] = 224 | k >> 12;
                  } else {
                    if (c + 3 >= d) break;
                    b[c++] = 240 | k >> 18;
                    b[c++] = 128 | k >> 12 & 63;
                  }
                  b[c++] = 128 | k >> 6 & 63;
                }
                b[c++] = 128 | k & 63;
              }
            }
            b[c] = 0;
            return c - e;
          };
          function oa(a, b) {
            var c = Array(da(a) + 1);
            a = fa(a, c, 0, c.length);
            b && (c.length = a);
            return c;
          }
          var vb = [];
          function wb(a, b) {
            vb[a] = { input: [], output: [], Xa: b };
            xb(a, yb);
          }
          var yb = { open(a) {
            var b = vb[a.node.rdev];
            if (!b) throw new P(43);
            a.tty = b;
            a.seekable = false;
          }, close(a) {
            a.tty.Xa.fsync(a.tty);
          }, fsync(a) {
            a.tty.Xa.fsync(a.tty);
          }, read(a, b, c, d) {
            if (!a.tty || !a.tty.Xa.sb) throw new P(60);
            for (var e = 0, h = 0; h < d; h++) {
              try {
                var k = a.tty.Xa.sb(a.tty);
              } catch (r) {
                throw new P(29);
              }
              if (void 0 === k && 0 === e) throw new P(6);
              if (null === k || void 0 === k) break;
              e++;
              b[c + h] = k;
            }
            e && (a.node.timestamp = Date.now());
            return e;
          }, write(a, b, c, d) {
            if (!a.tty || !a.tty.Xa.jb) throw new P(60);
            try {
              for (var e = 0; e < d; e++) a.tty.Xa.jb(a.tty, b[c + e]);
            } catch (h) {
              throw new P(29);
            }
            d && (a.node.timestamp = Date.now());
            return e;
          } }, zb = { sb() {
            a: {
              if (!nb.length) {
                var a = null;
                if (Da) {
                  var b = Buffer.alloc(256), c = 0, d = process.stdin.fd;
                  try {
                    c = fs.readSync(d, b);
                  } catch (e) {
                    if (e.toString().includes("EOF")) c = 0;
                    else throw e;
                  }
                  0 < c ? a = b.slice(0, c).toString("utf-8") : a = null;
                } else "undefined" != typeof window && "function" == typeof window.prompt ? (a = window.prompt("Input: "), null !== a && (a += "\n")) : "function" == typeof readline && (a = readline(), null !== a && (a += "\n"));
                if (!a) {
                  a = null;
                  break a;
                }
                nb = oa(a, true);
              }
              a = nb.shift();
            }
            return a;
          }, jb(a, b) {
            null === b || 10 === b ? (Ja(M(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
          }, fsync(a) {
            a.output && 0 < a.output.length && (Ja(M(a.output, 0)), a.output = []);
          }, Mb() {
            return { Ib: 25856, Kb: 5, Hb: 191, Jb: 35387, Gb: [3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
          }, Nb() {
            return 0;
          }, Ob() {
            return [24, 80];
          } }, Ab = { jb(a, b) {
            null === b || 10 === b ? (B(M(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
          }, fsync(a) {
            a.output && 0 < a.output.length && (B(M(a.output, 0)), a.output = []);
          } };
          function Bb(a, b) {
            var c = a.Ia ? a.Ia.length : 0;
            c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.Ia, a.Ia = new Uint8Array(b), 0 < a.Ma && a.Ia.set(c.subarray(0, a.Ma), 0));
          }
          var Q = {
            Qa: null,
            Ra() {
              return Q.createNode(null, "/", 16895, 0);
            },
            createNode(a, b, c, d) {
              if (24576 === (c & 61440) || 4096 === (c & 61440)) throw new P(63);
              Q.Qa || (Q.Qa = { dir: { node: { Pa: Q.Ga.Pa, Oa: Q.Ga.Oa, lookup: Q.Ga.lookup, ab: Q.Ga.ab, rename: Q.Ga.rename, unlink: Q.Ga.unlink, rmdir: Q.Ga.rmdir, readdir: Q.Ga.readdir, symlink: Q.Ga.symlink }, stream: { Ta: Q.Ha.Ta } }, file: { node: { Pa: Q.Ga.Pa, Oa: Q.Ga.Oa }, stream: { Ta: Q.Ha.Ta, read: Q.Ha.read, write: Q.Ha.write, lb: Q.Ha.lb, bb: Q.Ha.bb, cb: Q.Ha.cb } }, link: {
                node: { Pa: Q.Ga.Pa, Oa: Q.Ga.Oa, readlink: Q.Ga.readlink },
                stream: {}
              }, pb: { node: { Pa: Q.Ga.Pa, Oa: Q.Ga.Oa }, stream: Cb } });
              c = Db(a, b, c, d);
              R(c.mode) ? (c.Ga = Q.Qa.dir.node, c.Ha = Q.Qa.dir.stream, c.Ia = {}) : 32768 === (c.mode & 61440) ? (c.Ga = Q.Qa.file.node, c.Ha = Q.Qa.file.stream, c.Ma = 0, c.Ia = null) : 40960 === (c.mode & 61440) ? (c.Ga = Q.Qa.link.node, c.Ha = Q.Qa.link.stream) : 8192 === (c.mode & 61440) && (c.Ga = Q.Qa.pb.node, c.Ha = Q.Qa.pb.stream);
              c.timestamp = Date.now();
              a && (a.Ia[b] = c, a.timestamp = c.timestamp);
              return c;
            },
            Lb(a) {
              return a.Ia ? a.Ia.subarray ? a.Ia.subarray(0, a.Ma) : new Uint8Array(a.Ia) : new Uint8Array(0);
            },
            Ga: { Pa(a) {
              var b = {};
              b.dev = 8192 === (a.mode & 61440) ? a.id : 1;
              b.ino = a.id;
              b.mode = a.mode;
              b.nlink = 1;
              b.uid = 0;
              b.gid = 0;
              b.rdev = a.rdev;
              R(a.mode) ? b.size = 4096 : 32768 === (a.mode & 61440) ? b.size = a.Ma : 40960 === (a.mode & 61440) ? b.size = a.link.length : b.size = 0;
              b.atime = new Date(a.timestamp);
              b.mtime = new Date(a.timestamp);
              b.ctime = new Date(a.timestamp);
              b.zb = 4096;
              b.blocks = Math.ceil(b.size / b.zb);
              return b;
            }, Oa(a, b) {
              void 0 !== b.mode && (a.mode = b.mode);
              void 0 !== b.timestamp && (a.timestamp = b.timestamp);
              if (void 0 !== b.size && (b = b.size, a.Ma != b)) if (0 == b) a.Ia = null, a.Ma = 0;
              else {
                var c = a.Ia;
                a.Ia = new Uint8Array(b);
                c && a.Ia.set(c.subarray(0, Math.min(b, a.Ma)));
                a.Ma = b;
              }
            }, lookup() {
              throw Eb[44];
            }, ab(a, b, c, d) {
              return Q.createNode(a, b, c, d);
            }, rename(a, b, c) {
              if (R(a.mode)) {
                try {
                  var d = Fb(b, c);
                } catch (h) {
                }
                if (d) for (var e in d.Ia) throw new P(55);
              }
              delete a.parent.Ia[a.name];
              a.parent.timestamp = Date.now();
              a.name = c;
              b.Ia[c] = a;
              b.timestamp = a.parent.timestamp;
              a.parent = b;
            }, unlink(a, b) {
              delete a.Ia[b];
              a.timestamp = Date.now();
            }, rmdir(a, b) {
              var c = Fb(a, b), d;
              for (d in c.Ia) throw new P(55);
              delete a.Ia[b];
              a.timestamp = Date.now();
            }, readdir(a) {
              var b = [".", ".."], c;
              for (c of Object.keys(a.Ia)) b.push(c);
              return b;
            }, symlink(a, b, c) {
              a = Q.createNode(a, b, 41471, 0);
              a.link = c;
              return a;
            }, readlink(a) {
              if (40960 !== (a.mode & 61440)) throw new P(28);
              return a.link;
            } },
            Ha: {
              read(a, b, c, d, e) {
                var h = a.node.Ia;
                if (e >= a.node.Ma) return 0;
                a = Math.min(a.node.Ma - e, d);
                if (8 < a && h.subarray) b.set(h.subarray(e, e + a), c);
                else for (d = 0; d < a; d++) b[c + d] = h[e + d];
                return a;
              },
              write(a, b, c, d, e, h) {
                b.buffer === p.buffer && (h = false);
                if (!d) return 0;
                a = a.node;
                a.timestamp = Date.now();
                if (b.subarray && (!a.Ia || a.Ia.subarray)) {
                  if (h) return a.Ia = b.subarray(c, c + d), a.Ma = d;
                  if (0 === a.Ma && 0 === e) return a.Ia = b.slice(c, c + d), a.Ma = d;
                  if (e + d <= a.Ma) return a.Ia.set(b.subarray(c, c + d), e), d;
                }
                Bb(a, e + d);
                if (a.Ia.subarray && b.subarray) a.Ia.set(b.subarray(c, c + d), e);
                else for (h = 0; h < d; h++) a.Ia[e + h] = b[c + h];
                a.Ma = Math.max(a.Ma, e + d);
                return d;
              },
              Ta(a, b, c) {
                1 === c ? b += a.position : 2 === c && 32768 === (a.node.mode & 61440) && (b += a.node.Ma);
                if (0 > b) throw new P(28);
                return b;
              },
              lb(a, b, c) {
                Bb(a.node, b + c);
                a.node.Ma = Math.max(a.node.Ma, b + c);
              },
              bb(a, b, c, d, e) {
                if (32768 !== (a.node.mode & 61440)) throw new P(43);
                a = a.node.Ia;
                if (e & 2 || a.buffer !== p.buffer) {
                  if (0 < c || c + b < a.length) a.subarray ? a = a.subarray(c, c + b) : a = Array.prototype.slice.call(a, c, c + b);
                  c = true;
                  b = 65536 * Math.ceil(b / 65536);
                  (e = Gb(65536, b)) ? (q.fill(0, e, e + b), b = e) : b = 0;
                  if (!b) throw new P(48);
                  p.set(a, b);
                } else c = false, b = a.byteOffset;
                return { Db: b, ub: c };
              },
              cb(a, b, c, d) {
                Q.Ha.write(a, b, 0, d, c, false);
                return 0;
              }
            }
          }, ia = (a, b) => {
            var c = 0;
            a && (c |= 365);
            b && (c |= 146);
            return c;
          }, Hb = null, Ib = {}, Jb = [], Kb = 1, S = null, Lb = true, P = null, Eb = {};
          function T(a, b = {}) {
            a = mb(a);
            if (!a) return { path: "", node: null };
            b = Object.assign({ qb: true, kb: 0 }, b);
            if (8 < b.kb) throw new P(32);
            a = a.split("/").filter((k) => !!k);
            for (var c = Hb, d = "/", e = 0; e < a.length; e++) {
              var h = e === a.length - 1;
              if (h && b.parent) break;
              c = Fb(c, a[e]);
              d = u(d + "/" + a[e]);
              c.Va && (!h || h && b.qb) && (c = c.Va.root);
              if (!h || b.Sa) {
                for (h = 0; 40960 === (c.mode & 61440); ) if (c = Mb(d), d = mb(hb(d), c), c = T(d, { kb: b.kb + 1 }).node, 40 < h++) throw new P(32);
              }
            }
            return { path: d, node: c };
          }
          function ha(a) {
            for (var b; ; ) {
              if (a === a.parent) return a = a.Ra.tb, b ? "/" !== a[a.length - 1] ? `${a}/${b}` : a + b : a;
              b = b ? `${a.name}/${b}` : a.name;
              a = a.parent;
            }
          }
          function Nb(a, b) {
            for (var c = 0, d = 0; d < b.length; d++) c = (c << 5) - c + b.charCodeAt(d) | 0;
            return (a + c >>> 0) % S.length;
          }
          function Ob(a) {
            var b = Nb(a.parent.id, a.name);
            if (S[b] === a) S[b] = a.Wa;
            else for (b = S[b]; b; ) {
              if (b.Wa === a) {
                b.Wa = a.Wa;
                break;
              }
              b = b.Wa;
            }
          }
          function Fb(a, b) {
            var c;
            if (c = (c = Pb(a, "x")) ? c : a.Ga.lookup ? 0 : 2) throw new P(c, a);
            for (c = S[Nb(a.id, b)]; c; c = c.Wa) {
              var d = c.name;
              if (c.parent.id === a.id && d === b) return c;
            }
            return a.Ga.lookup(a, b);
          }
          function Db(a, b, c, d) {
            a = new Qb(a, b, c, d);
            b = Nb(a.parent.id, a.name);
            a.Wa = S[b];
            return S[b] = a;
          }
          function R(a) {
            return 16384 === (a & 61440);
          }
          function Rb(a) {
            var b = ["r", "w", "rw"][a & 3];
            a & 512 && (b += "w");
            return b;
          }
          function Pb(a, b) {
            if (Lb) return 0;
            if (!b.includes("r") || a.mode & 292) {
              if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) return 2;
            } else return 2;
            return 0;
          }
          function Sb(a, b) {
            try {
              return Fb(a, b), 20;
            } catch (c) {
            }
            return Pb(a, "wx");
          }
          function Tb(a, b, c) {
            try {
              var d = Fb(a, b);
            } catch (e) {
              return e.Ka;
            }
            if (a = Pb(a, "wx")) return a;
            if (c) {
              if (!R(d.mode)) return 54;
              if (d === d.parent || "/" === ha(d)) return 10;
            } else if (R(d.mode)) return 31;
            return 0;
          }
          function Ub() {
            for (var a = 0; 4096 >= a; a++) if (!Jb[a]) return a;
            throw new P(33);
          }
          function U(a) {
            a = Jb[a];
            if (!a) throw new P(8);
            return a;
          }
          function Vb(a, b = -1) {
            Wb || (Wb = function() {
              this.$a = {};
            }, Wb.prototype = {}, Object.defineProperties(Wb.prototype, { object: { get() {
              return this.node;
            }, set(c) {
              this.node = c;
            } }, flags: { get() {
              return this.$a.flags;
            }, set(c) {
              this.$a.flags = c;
            } }, position: { get() {
              return this.$a.position;
            }, set(c) {
              this.$a.position = c;
            } } }));
            a = Object.assign(new Wb(), a);
            -1 == b && (b = Ub());
            a.fd = b;
            return Jb[b] = a;
          }
          var Cb = { open(a) {
            a.Ha = Ib[a.node.rdev].Ha;
            a.Ha.open?.(a);
          }, Ta() {
            throw new P(70);
          } };
          function xb(a, b) {
            Ib[a] = { Ha: b };
          }
          function Xb(a, b) {
            var c = "/" === b, d = !b;
            if (c && Hb) throw new P(10);
            if (!c && !d) {
              var e = T(b, { qb: false });
              b = e.path;
              e = e.node;
              if (e.Va) throw new P(10);
              if (!R(e.mode)) throw new P(54);
            }
            b = { type: a, Pb: {}, tb: b, Cb: [] };
            a = a.Ra(b);
            a.Ra = b;
            b.root = a;
            c ? Hb = a : e && (e.Va = b, e.Ra && e.Ra.Cb.push(b));
          }
          function ja(a, b, c) {
            var d = T(a, { parent: true }).node;
            a = ib(a);
            if (!a || "." === a || ".." === a) throw new P(28);
            var e = Sb(d, a);
            if (e) throw new P(e);
            if (!d.Ga.ab) throw new P(63);
            return d.Ga.ab(d, a, b, c);
          }
          function V(a, b) {
            return ja(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0);
          }
          function Yb(a, b, c) {
            "undefined" == typeof c && (c = b, b = 438);
            ja(a, b | 8192, c);
          }
          function Zb(a, b) {
            if (!mb(a)) throw new P(44);
            var c = T(b, { parent: true }).node;
            if (!c) throw new P(44);
            b = ib(b);
            var d = Sb(c, b);
            if (d) throw new P(d);
            if (!c.Ga.symlink) throw new P(63);
            c.Ga.symlink(c, b, a);
          }
          function $b(a) {
            var b = T(a, { parent: true }).node;
            a = ib(a);
            var c = Fb(b, a), d = Tb(b, a, true);
            if (d) throw new P(d);
            if (!b.Ga.rmdir) throw new P(63);
            if (c.Va) throw new P(10);
            b.Ga.rmdir(b, a);
            Ob(c);
          }
          function wa(a) {
            var b = T(a, { parent: true }).node;
            if (!b) throw new P(44);
            a = ib(a);
            var c = Fb(b, a), d = Tb(b, a, false);
            if (d) throw new P(d);
            if (!b.Ga.unlink) throw new P(63);
            if (c.Va) throw new P(10);
            b.Ga.unlink(b, a);
            Ob(c);
          }
          function Mb(a) {
            a = T(a).node;
            if (!a) throw new P(44);
            if (!a.Ga.readlink) throw new P(28);
            return mb(ha(a.parent), a.Ga.readlink(a));
          }
          function ac(a, b) {
            a = T(a, { Sa: !b }).node;
            if (!a) throw new P(44);
            if (!a.Ga.Pa) throw new P(63);
            return a.Ga.Pa(a);
          }
          function bc(a) {
            return ac(a, true);
          }
          function ka(a, b) {
            a = "string" == typeof a ? T(a, { Sa: true }).node : a;
            if (!a.Ga.Oa) throw new P(63);
            a.Ga.Oa(a, { mode: b & 4095 | a.mode & -4096, timestamp: Date.now() });
          }
          function cc(a, b) {
            if (0 > b) throw new P(28);
            a = "string" == typeof a ? T(a, { Sa: true }).node : a;
            if (!a.Ga.Oa) throw new P(63);
            if (R(a.mode)) throw new P(31);
            if (32768 !== (a.mode & 61440)) throw new P(28);
            var c = Pb(a, "w");
            if (c) throw new P(c);
            a.Ga.Oa(a, { size: b, timestamp: Date.now() });
          }
          function la(a, b, c) {
            if ("" === a) throw new P(44);
            if ("string" == typeof b) {
              var d = { r: 0, "r+": 2, w: 577, "w+": 578, a: 1089, "a+": 1090 }[b];
              if ("undefined" == typeof d) throw Error(`Unknown file open mode: ${b}`);
              b = d;
            }
            c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
            if ("object" == typeof a) var e = a;
            else {
              a = u(a);
              try {
                e = T(a, { Sa: !(b & 131072) }).node;
              } catch (h) {
              }
            }
            d = false;
            if (b & 64) if (e) {
              if (b & 128) throw new P(20);
            } else e = ja(a, c, 0), d = true;
            if (!e) throw new P(44);
            8192 === (e.mode & 61440) && (b &= -513);
            if (b & 65536 && !R(e.mode)) throw new P(54);
            if (!d && (c = e ? 40960 === (e.mode & 61440) ? 32 : R(e.mode) && ("r" !== Rb(b) || b & 512) ? 31 : Pb(e, Rb(b)) : 44)) throw new P(c);
            b & 512 && !d && cc(e, 0);
            b &= -131713;
            e = Vb({ node: e, path: ha(e), flags: b, seekable: true, position: 0, Ha: e.Ha, Fb: [], error: false });
            e.Ha.open && e.Ha.open(e);
            !f.logReadFiles || b & 1 || (dc ||= {}, a in dc || (dc[a] = 1));
            return e;
          }
          function na(a) {
            if (null === a.fd) throw new P(8);
            a.hb && (a.hb = null);
            try {
              a.Ha.close && a.Ha.close(a);
            } catch (b) {
              throw b;
            } finally {
              Jb[a.fd] = null;
            }
            a.fd = null;
          }
          function ec(a, b, c) {
            if (null === a.fd) throw new P(8);
            if (!a.seekable || !a.Ha.Ta) throw new P(70);
            if (0 != c && 1 != c && 2 != c) throw new P(28);
            a.position = a.Ha.Ta(a, b, c);
            a.Fb = [];
          }
          function fc(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new P(28);
            if (null === a.fd) throw new P(8);
            if (1 === (a.flags & 2097155)) throw new P(8);
            if (R(a.node.mode)) throw new P(31);
            if (!a.Ha.read) throw new P(28);
            var h = "undefined" != typeof e;
            if (!h) e = a.position;
            else if (!a.seekable) throw new P(70);
            b = a.Ha.read(a, b, c, d, e);
            h || (a.position += b);
            return b;
          }
          function ma(a, b, c, d, e) {
            if (0 > d || 0 > e) throw new P(28);
            if (null === a.fd) throw new P(8);
            if (0 === (a.flags & 2097155)) throw new P(8);
            if (R(a.node.mode)) throw new P(31);
            if (!a.Ha.write) throw new P(28);
            a.seekable && a.flags & 1024 && ec(a, 0, 2);
            var h = "undefined" != typeof e;
            if (!h) e = a.position;
            else if (!a.seekable) throw new P(70);
            b = a.Ha.write(a, b, c, d, e, void 0);
            h || (a.position += b);
            return b;
          }
          function va(a) {
            var b = "binary";
            if ("utf8" !== b && "binary" !== b) throw Error(`Invalid encoding type "${b}"`);
            var c;
            var d = la(a, d || 0);
            a = ac(a).size;
            var e = new Uint8Array(a);
            fc(d, e, 0, a, 0);
            "utf8" === b ? c = M(e, 0) : "binary" === b && (c = e);
            na(d);
            return c;
          }
          function gc() {
            P || (P = function(a, b) {
              this.name = "ErrnoError";
              this.node = b;
              this.Eb = function(c) {
                this.Ka = c;
              };
              this.Eb(a);
              this.message = "FS error";
            }, P.prototype = Error(), P.prototype.constructor = P, [44].forEach((a) => {
              Eb[a] = new P(a);
              Eb[a].stack = "<generic error, no stack>";
            }));
          }
          var hc;
          function ic(a, b, c) {
            a = u("/dev/" + a);
            var d = ia(!!b, !!c);
            jc ||= 64;
            var e = jc++ << 8 | 0;
            xb(e, { open(h) {
              h.seekable = false;
            }, close() {
              c?.buffer?.length && c(10);
            }, read(h, k, r, y) {
              for (var v = 0, F = 0; F < y; F++) {
                try {
                  var H = b();
                } catch (pb) {
                  throw new P(29);
                }
                if (void 0 === H && 0 === v) throw new P(6);
                if (null === H || void 0 === H) break;
                v++;
                k[r + F] = H;
              }
              v && (h.node.timestamp = Date.now());
              return v;
            }, write(h, k, r, y) {
              for (var v = 0; v < y; v++) try {
                c(k[r + v]);
              } catch (F) {
                throw new P(29);
              }
              y && (h.node.timestamp = Date.now());
              return v;
            } });
            Yb(a, d, e);
          }
          var jc, W = {}, Wb, dc;
          function kc(a, b, c) {
            if ("/" === b.charAt(0)) return b;
            a = -100 === a ? "/" : U(a).path;
            if (0 == b.length) {
              if (!c) throw new P(44);
              return a;
            }
            return u(a + "/" + b);
          }
          function lc(a, b, c) {
            try {
              var d = a(b);
            } catch (h) {
              if (h && h.node && u(b) !== u(ha(h.node))) return -54;
              throw h;
            }
            D[c >> 2] = d.dev;
            D[c + 4 >> 2] = d.mode;
            E[c + 8 >> 2] = d.nlink;
            D[c + 12 >> 2] = d.uid;
            D[c + 16 >> 2] = d.gid;
            D[c + 20 >> 2] = d.rdev;
            J = [d.size >>> 0, (I = d.size, 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
            D[c + 24 >> 2] = J[0];
            D[c + 28 >> 2] = J[1];
            D[c + 32 >> 2] = 4096;
            D[c + 36 >> 2] = d.blocks;
            a = d.atime.getTime();
            b = d.mtime.getTime();
            var e = d.ctime.getTime();
            J = [Math.floor(a / 1e3) >>> 0, (I = Math.floor(a / 1e3), 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
            D[c + 40 >> 2] = J[0];
            D[c + 44 >> 2] = J[1];
            E[c + 48 >> 2] = a % 1e3 * 1e3;
            J = [Math.floor(b / 1e3) >>> 0, (I = Math.floor(b / 1e3), 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
            D[c + 56 >> 2] = J[0];
            D[c + 60 >> 2] = J[1];
            E[c + 64 >> 2] = b % 1e3 * 1e3;
            J = [Math.floor(e / 1e3) >>> 0, (I = Math.floor(e / 1e3), 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
            D[c + 72 >> 2] = J[0];
            D[c + 76 >> 2] = J[1];
            E[c + 80 >> 2] = e % 1e3 * 1e3;
            J = [d.ino >>> 0, (I = d.ino, 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
            D[c + 88 >> 2] = J[0];
            D[c + 92 >> 2] = J[1];
            return 0;
          }
          var Mc = void 0;
          function Oc() {
            var a = D[+Mc >> 2];
            Mc += 4;
            return a;
          }
          var Pc = (a, b) => b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN, Qc = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335], Rc = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334], Sc = (a) => {
            var b = da(a) + 1, c = ea(b);
            c && fa(a, q, c, b);
            return c;
          }, Tc = {}, Vc = () => {
            if (!Uc) {
              var a = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _: za || "./this.program" }, b;
              for (b in Tc) void 0 === Tc[b] ? delete a[b] : a[b] = Tc[b];
              var c = [];
              for (b in a) c.push(`${b}=${a[b]}`);
              Uc = c;
            }
            return Uc;
          }, Uc, ta = (a) => {
            var b = da(a) + 1, c = x(b);
            fa(a, q, c, b);
            return c;
          }, Wc = (a, b, c, d) => {
            var e = { string: (v) => {
              var F = 0;
              null !== v && void 0 !== v && 0 !== v && (F = ta(v));
              return F;
            }, array: (v) => {
              var F = x(v.length);
              p.set(v, F);
              return F;
            } };
            a = f["_" + a];
            var h = [], k = 0;
            if (d) for (var r = 0; r < d.length; r++) {
              var y = e[c[r]];
              y ? (0 === k && (k = pa()), h[r] = y(d[r])) : h[r] = d[r];
            }
            c = a.apply(null, h);
            return c = function(v) {
              0 !== k && sa(k);
              return "string" === b ? v ? M(q, v) : "" : "boolean" === b ? !!v : v;
            }(c);
          }, ba = 0, aa = (a, b) => {
            b = 1 == b ? x(a.length) : ea(a.length);
            a.subarray || a.slice || (a = new Uint8Array(a));
            q.set(a, b);
            return b;
          }, Xc, Yc = [], Y, ua = (a) => {
            Xc.delete(Y.get(a));
            Y.set(a, null);
            Yc.push(a);
          }, xa = (a, b) => {
            if (!Xc) {
              Xc = /* @__PURE__ */ new WeakMap();
              var c = Y.length;
              if (Xc) for (var d = 0; d < 0 + c; d++) {
                var e = Y.get(d);
                e && Xc.set(e, d);
              }
            }
            if (c = Xc.get(a) || 0) return c;
            if (Yc.length) c = Yc.pop();
            else {
              try {
                Y.grow(1);
              } catch (r) {
                if (!(r instanceof RangeError)) throw r;
                throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
              }
              c = Y.length - 1;
            }
            try {
              Y.set(c, a);
            } catch (r) {
              if (!(r instanceof TypeError)) throw r;
              if ("function" == typeof WebAssembly.Function) {
                d = WebAssembly.Function;
                e = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" };
                for (var h = { parameters: [], results: "v" == b[0] ? [] : [e[b[0]]] }, k = 1; k < b.length; ++k) h.parameters.push(e[b[k]]);
                b = new d(h, a);
              } else {
                d = [1];
                e = b.slice(0, 1);
                b = b.slice(1);
                h = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
                d.push(96);
                k = b.length;
                128 > k ? d.push(k) : d.push(k % 128 | 128, k >> 7);
                for (k = 0; k < b.length; ++k) d.push(h[b[k]]);
                "v" == e ? d.push(0) : d.push(1, h[e]);
                b = [0, 97, 115, 109, 1, 0, 0, 0, 1];
                e = d.length;
                128 > e ? b.push(e) : b.push(e % 128 | 128, e >> 7);
                b.push.apply(b, d);
                b.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
                b = new WebAssembly.Module(new Uint8Array(b));
                b = new WebAssembly.Instance(b, { e: { f: a } }).exports.f;
              }
              Y.set(c, b);
            }
            Xc.set(a, c);
            return c;
          };
          function Qb(a, b, c, d) {
            a ||= this;
            this.parent = a;
            this.Ra = a.Ra;
            this.Va = null;
            this.id = Kb++;
            this.name = b;
            this.mode = c;
            this.Ga = {};
            this.Ha = {};
            this.rdev = d;
          }
          Object.defineProperties(Qb.prototype, { read: { get: function() {
            return 365 === (this.mode & 365);
          }, set: function(a) {
            a ? this.mode |= 365 : this.mode &= -366;
          } }, write: { get: function() {
            return 146 === (this.mode & 146);
          }, set: function(a) {
            a ? this.mode |= 146 : this.mode &= -147;
          } } });
          gc();
          S = Array(4096);
          Xb(Q, "/");
          V("/tmp");
          V("/home");
          V("/home/web_user");
          (function() {
            V("/dev");
            xb(259, { read: () => 0, write: (d, e, h, k) => k });
            Yb("/dev/null", 259);
            wb(1280, zb);
            wb(1536, Ab);
            Yb("/dev/tty", 1280);
            Yb("/dev/tty1", 1536);
            var a = new Uint8Array(1024), b = 0, c = () => {
              0 === b && (b = kb(a).byteLength);
              return a[--b];
            };
            ic("random", c);
            ic("urandom", c);
            V("/dev/shm");
            V("/dev/shm/tmp");
          })();
          (function() {
            V("/proc");
            var a = V("/proc/self");
            V("/proc/self/fd");
            Xb({ Ra() {
              var b = Db(a, "fd", 16895, 73);
              b.Ga = { lookup(c, d) {
                var e = U(+d);
                c = { parent: null, Ra: { tb: "fake" }, Ga: { readlink: () => e.path } };
                return c.parent = c;
              } };
              return b;
            } }, "/proc/self/fd");
          })();
          var $c = {
            a: (a, b, c, d) => {
              C(`Assertion failed: ${a ? M(q, a) : ""}, at: ` + [b ? b ? M(q, b) : "" : "unknown filename", c, d ? d ? M(q, d) : "" : "unknown function"]);
            },
            h: function(a, b) {
              try {
                return a = a ? M(q, a) : "", ka(a, b), 0;
              } catch (c) {
                if ("undefined" == typeof W || "ErrnoError" !== c.name) throw c;
                return -c.Ka;
              }
            },
            H: function(a, b, c) {
              try {
                b = b ? M(q, b) : "";
                b = kc(a, b);
                if (c & -8) return -28;
                var d = T(b, { Sa: true }).node;
                if (!d) return -44;
                a = "";
                c & 4 && (a += "r");
                c & 2 && (a += "w");
                c & 1 && (a += "x");
                return a && Pb(d, a) ? -2 : 0;
              } catch (e) {
                if ("undefined" == typeof W || "ErrnoError" !== e.name) throw e;
                return -e.Ka;
              }
            },
            i: function(a, b) {
              try {
                var c = U(a);
                ka(c.node, b);
                return 0;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            g: function(a) {
              try {
                var b = U(a).node;
                var c = "string" == typeof b ? T(b, { Sa: true }).node : b;
                if (!c.Ga.Oa) throw new P(63);
                c.Ga.Oa(c, { timestamp: Date.now() });
                return 0;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            b: function(a, b, c) {
              Mc = c;
              try {
                var d = U(a);
                switch (b) {
                  case 0:
                    var e = Oc();
                    if (0 > e) return -28;
                    for (; Jb[e]; ) e++;
                    return Vb(d, e).fd;
                  case 1:
                  case 2:
                    return 0;
                  case 3:
                    return d.flags;
                  case 4:
                    return e = Oc(), d.flags |= e, 0;
                  case 5:
                    return e = Oc(), Na[e + 0 >> 1] = 2, 0;
                  case 6:
                  case 7:
                    return 0;
                  case 16:
                  case 8:
                    return -28;
                  case 9:
                    return D[Zc() >> 2] = 28, -1;
                  default:
                    return -28;
                }
              } catch (h) {
                if ("undefined" == typeof W || "ErrnoError" !== h.name) throw h;
                return -h.Ka;
              }
            },
            f: function(a, b) {
              try {
                var c = U(a);
                return lc(ac, c.path, b);
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            n: function(a, b, c) {
              b = Pc(b, c);
              try {
                if (isNaN(b)) return 61;
                var d = U(a);
                if (0 === (d.flags & 2097155)) throw new P(28);
                cc(d.node, b);
                return 0;
              } catch (e) {
                if ("undefined" == typeof W || "ErrnoError" !== e.name) throw e;
                return -e.Ka;
              }
            },
            C: function(a, b) {
              try {
                if (0 === b) return -28;
                var c = da("/") + 1;
                if (b < c) return -68;
                fa("/", q, a, b);
                return c;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            F: function(a, b) {
              try {
                return a = a ? M(q, a) : "", lc(bc, a, b);
              } catch (c) {
                if ("undefined" == typeof W || "ErrnoError" !== c.name) throw c;
                return -c.Ka;
              }
            },
            z: function(a, b, c) {
              try {
                return b = b ? M(q, b) : "", b = kc(a, b), b = u(b), "/" === b[b.length - 1] && (b = b.substr(
                  0,
                  b.length - 1
                )), V(b, c), 0;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            E: function(a, b, c, d) {
              try {
                b = b ? M(q, b) : "";
                var e = d & 256;
                b = kc(a, b, d & 4096);
                return lc(e ? bc : ac, b, c);
              } catch (h) {
                if ("undefined" == typeof W || "ErrnoError" !== h.name) throw h;
                return -h.Ka;
              }
            },
            y: function(a, b, c, d) {
              Mc = d;
              try {
                b = b ? M(q, b) : "";
                b = kc(a, b);
                var e = d ? Oc() : 0;
                return la(b, c, e).fd;
              } catch (h) {
                if ("undefined" == typeof W || "ErrnoError" !== h.name) throw h;
                return -h.Ka;
              }
            },
            w: function(a, b, c, d) {
              try {
                b = b ? M(q, b) : "";
                b = kc(a, b);
                if (0 >= d) return -28;
                var e = Mb(b), h = Math.min(d, da(e)), k = p[c + h];
                fa(e, q, c, d + 1);
                p[c + h] = k;
                return h;
              } catch (r) {
                if ("undefined" == typeof W || "ErrnoError" !== r.name) throw r;
                return -r.Ka;
              }
            },
            v: function(a) {
              try {
                return a = a ? M(q, a) : "", $b(a), 0;
              } catch (b) {
                if ("undefined" == typeof W || "ErrnoError" !== b.name) throw b;
                return -b.Ka;
              }
            },
            G: function(a, b) {
              try {
                return a = a ? M(q, a) : "", lc(ac, a, b);
              } catch (c) {
                if ("undefined" == typeof W || "ErrnoError" !== c.name) throw c;
                return -c.Ka;
              }
            },
            r: function(a, b, c) {
              try {
                return b = b ? M(q, b) : "", b = kc(a, b), 0 === c ? wa(b) : 512 === c ? $b(b) : C("Invalid flags passed to unlinkat"), 0;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return -d.Ka;
              }
            },
            q: function(a, b, c) {
              try {
                b = b ? M(q, b) : "";
                b = kc(a, b, true);
                if (c) {
                  var d = E[c >> 2] + 4294967296 * D[c + 4 >> 2], e = D[c + 8 >> 2];
                  h = 1e3 * d + e / 1e6;
                  c += 16;
                  d = E[c >> 2] + 4294967296 * D[c + 4 >> 2];
                  e = D[c + 8 >> 2];
                  k = 1e3 * d + e / 1e6;
                } else var h = Date.now(), k = h;
                a = h;
                var r = T(b, { Sa: true }).node;
                r.Ga.Oa(r, { timestamp: Math.max(a, k) });
                return 0;
              } catch (y) {
                if ("undefined" == typeof W || "ErrnoError" !== y.name) throw y;
                return -y.Ka;
              }
            },
            l: function(a, b, c) {
              a = new Date(1e3 * Pc(a, b));
              D[c >> 2] = a.getSeconds();
              D[c + 4 >> 2] = a.getMinutes();
              D[c + 8 >> 2] = a.getHours();
              D[c + 12 >> 2] = a.getDate();
              D[c + 16 >> 2] = a.getMonth();
              D[c + 20 >> 2] = a.getFullYear() - 1900;
              D[c + 24 >> 2] = a.getDay();
              b = a.getFullYear();
              D[c + 28 >> 2] = (0 !== b % 4 || 0 === b % 100 && 0 !== b % 400 ? Rc : Qc)[a.getMonth()] + a.getDate() - 1 | 0;
              D[c + 36 >> 2] = -(60 * a.getTimezoneOffset());
              b = new Date(a.getFullYear(), 6, 1).getTimezoneOffset();
              var d = new Date(a.getFullYear(), 0, 1).getTimezoneOffset();
              D[c + 32 >> 2] = (b != d && a.getTimezoneOffset() == Math.min(d, b)) | 0;
            },
            j: function(a, b, c, d, e, h, k, r) {
              e = Pc(e, h);
              try {
                if (isNaN(e)) return 61;
                var y = U(d);
                if (0 !== (b & 2) && 0 === (c & 2) && 2 !== (y.flags & 2097155)) throw new P(2);
                if (1 === (y.flags & 2097155)) throw new P(2);
                if (!y.Ha.bb) throw new P(43);
                var v = y.Ha.bb(y, a, e, b, c);
                var F = v.Db;
                D[k >> 2] = v.ub;
                E[r >> 2] = F;
                return 0;
              } catch (H) {
                if ("undefined" == typeof W || "ErrnoError" !== H.name) throw H;
                return -H.Ka;
              }
            },
            k: function(a, b, c, d, e, h, k) {
              h = Pc(h, k);
              try {
                if (isNaN(h)) return 61;
                var r = U(e);
                if (c & 2) {
                  if (32768 !== (r.node.mode & 61440)) throw new P(43);
                  if (!(d & 2)) {
                    var y = q.slice(a, a + b);
                    r.Ha.cb && r.Ha.cb(r, y, h, b, d);
                  }
                }
              } catch (v) {
                if ("undefined" == typeof W || "ErrnoError" !== v.name) throw v;
                return -v.Ka;
              }
            },
            s: (a, b, c) => {
              function d(y) {
                return (y = y.toTimeString().match(/\(([A-Za-z ]+)\)$/)) ? y[1] : "GMT";
              }
              var e = (/* @__PURE__ */ new Date()).getFullYear(), h = new Date(e, 0, 1), k = new Date(e, 6, 1);
              e = h.getTimezoneOffset();
              var r = k.getTimezoneOffset();
              E[a >> 2] = 60 * Math.max(e, r);
              D[b >> 2] = Number(e != r);
              a = d(h);
              b = d(k);
              a = Sc(a);
              b = Sc(b);
              r < e ? (E[c >> 2] = a, E[c + 4 >> 2] = b) : (E[c >> 2] = b, E[c + 4 >> 2] = a);
            },
            d: () => Date.now(),
            t: () => 2147483648,
            c: () => performance.now(),
            o: (a) => {
              var b = q.length;
              a >>>= 0;
              if (2147483648 < a) return false;
              for (var c = 1; 4 >= c; c *= 2) {
                var d = b * (1 + 0.2 / c);
                d = Math.min(d, a + 100663296);
                var e = Math;
                d = Math.max(a, d);
                a: {
                  e = (e.min.call(e, 2147483648, d + (65536 - d % 65536) % 65536) - La.buffer.byteLength + 65535) / 65536;
                  try {
                    La.grow(e);
                    Qa();
                    var h = 1;
                    break a;
                  } catch (k) {
                  }
                  h = void 0;
                }
                if (h) return true;
              }
              return false;
            },
            A: (a, b) => {
              var c = 0;
              Vc().forEach((d, e) => {
                var h = b + c;
                e = E[a + 4 * e >> 2] = h;
                for (h = 0; h < d.length; ++h) p[e++ >> 0] = d.charCodeAt(h);
                p[e >> 0] = 0;
                c += d.length + 1;
              });
              return 0;
            },
            B: (a, b) => {
              var c = Vc();
              E[a >> 2] = c.length;
              var d = 0;
              c.forEach((e) => d += e.length + 1);
              E[b >> 2] = d;
              return 0;
            },
            e: function(a) {
              try {
                var b = U(a);
                na(b);
                return 0;
              } catch (c) {
                if ("undefined" == typeof W || "ErrnoError" !== c.name) throw c;
                return c.Ka;
              }
            },
            p: function(a, b) {
              try {
                var c = U(a);
                p[b >> 0] = c.tty ? 2 : R(c.mode) ? 3 : 40960 === (c.mode & 61440) ? 7 : 4;
                Na[b + 2 >> 1] = 0;
                J = [0, (I = 0, 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
                D[b + 8 >> 2] = J[0];
                D[b + 12 >> 2] = J[1];
                J = [0, (I = 0, 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
                D[b + 16 >> 2] = J[0];
                D[b + 20 >> 2] = J[1];
                return 0;
              } catch (d) {
                if ("undefined" == typeof W || "ErrnoError" !== d.name) throw d;
                return d.Ka;
              }
            },
            x: function(a, b, c, d) {
              try {
                a: {
                  var e = U(a);
                  a = b;
                  for (var h, k = b = 0; k < c; k++) {
                    var r = E[a >> 2], y = E[a + 4 >> 2];
                    a += 8;
                    var v = fc(e, p, r, y, h);
                    if (0 > v) {
                      var F = -1;
                      break a;
                    }
                    b += v;
                    if (v < y) break;
                    "undefined" !== typeof h && (h += v);
                  }
                  F = b;
                }
                E[d >> 2] = F;
                return 0;
              } catch (H) {
                if ("undefined" == typeof W || "ErrnoError" !== H.name) throw H;
                return H.Ka;
              }
            },
            m: function(a, b, c, d, e) {
              b = Pc(b, c);
              try {
                if (isNaN(b)) return 61;
                var h = U(a);
                ec(h, b, d);
                J = [h.position >>> 0, (I = h.position, 1 <= +Math.abs(I) ? 0 < I ? +Math.floor(I / 4294967296) >>> 0 : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0 : 0)];
                D[e >> 2] = J[0];
                D[e + 4 >> 2] = J[1];
                h.hb && 0 === b && 0 === d && (h.hb = null);
                return 0;
              } catch (k) {
                if ("undefined" == typeof W || "ErrnoError" !== k.name) throw k;
                return k.Ka;
              }
            },
            D: function(a) {
              try {
                var b = U(a);
                return b.Ha?.fsync ? b.Ha.fsync(b) : 0;
              } catch (c) {
                if ("undefined" == typeof W || "ErrnoError" !== c.name) throw c;
                return c.Ka;
              }
            },
            u: function(a, b, c, d) {
              try {
                a: {
                  var e = U(a);
                  a = b;
                  for (var h, k = b = 0; k < c; k++) {
                    var r = E[a >> 2], y = E[a + 4 >> 2];
                    a += 8;
                    var v = ma(e, p, r, y, h);
                    if (0 > v) {
                      var F = -1;
                      break a;
                    }
                    b += v;
                    "undefined" !== typeof h && (h += v);
                  }
                  F = b;
                }
                E[d >> 2] = F;
                return 0;
              } catch (H) {
                if ("undefined" == typeof W || "ErrnoError" !== H.name) throw H;
                return H.Ka;
              }
            }
          }, Z = function() {
            function a(c) {
              Z = c.exports;
              La = Z.I;
              Qa();
              Y = Z.Aa;
              Sa.unshift(Z.J);
              G--;
              f.monitorRunDependencies?.(G);
              0 == G && (null !== Wa && (clearInterval(Wa), Wa = null), Xa && (c = Xa, Xa = null, c()));
              return Z;
            }
            var b = { a: $c };
            G++;
            f.monitorRunDependencies?.(G);
            if (f.instantiateWasm) try {
              return f.instantiateWasm(b, a);
            } catch (c) {
              return B(`Module.instantiateWasm callback failed with error: ${c}`), false;
            }
            db(b, function(c) {
              a(c.instance);
            });
            return {};
          }();
          f._sqlite3_free = (a) => (f._sqlite3_free = Z.K)(a);
          f._sqlite3_value_text = (a) => (f._sqlite3_value_text = Z.L)(a);
          var Zc = () => (Zc = Z.M)();
          f._sqlite3_prepare_v2 = (a, b, c, d, e) => (f._sqlite3_prepare_v2 = Z.N)(a, b, c, d, e);
          f._sqlite3_step = (a) => (f._sqlite3_step = Z.O)(a);
          f._sqlite3_reset = (a) => (f._sqlite3_reset = Z.P)(a);
          f._sqlite3_exec = (a, b, c, d, e) => (f._sqlite3_exec = Z.Q)(a, b, c, d, e);
          f._sqlite3_finalize = (a) => (f._sqlite3_finalize = Z.R)(a);
          f._sqlite3_column_name = (a, b) => (f._sqlite3_column_name = Z.S)(a, b);
          f._sqlite3_column_text = (a, b) => (f._sqlite3_column_text = Z.T)(a, b);
          f._sqlite3_column_type = (a, b) => (f._sqlite3_column_type = Z.U)(a, b);
          f._sqlite3_errmsg = (a) => (f._sqlite3_errmsg = Z.V)(a);
          f._sqlite3_clear_bindings = (a) => (f._sqlite3_clear_bindings = Z.W)(a);
          f._sqlite3_value_blob = (a) => (f._sqlite3_value_blob = Z.X)(a);
          f._sqlite3_value_bytes = (a) => (f._sqlite3_value_bytes = Z.Y)(a);
          f._sqlite3_value_double = (a) => (f._sqlite3_value_double = Z.Z)(a);
          f._sqlite3_value_int = (a) => (f._sqlite3_value_int = Z._)(a);
          f._sqlite3_value_type = (a) => (f._sqlite3_value_type = Z.$)(a);
          f._sqlite3_result_blob = (a, b, c, d) => (f._sqlite3_result_blob = Z.aa)(a, b, c, d);
          f._sqlite3_result_double = (a, b) => (f._sqlite3_result_double = Z.ba)(a, b);
          f._sqlite3_result_error = (a, b, c) => (f._sqlite3_result_error = Z.ca)(a, b, c);
          f._sqlite3_result_int = (a, b) => (f._sqlite3_result_int = Z.da)(a, b);
          f._sqlite3_result_int64 = (a, b, c) => (f._sqlite3_result_int64 = Z.ea)(a, b, c);
          f._sqlite3_result_null = (a) => (f._sqlite3_result_null = Z.fa)(a);
          f._sqlite3_result_text = (a, b, c, d) => (f._sqlite3_result_text = Z.ga)(a, b, c, d);
          f._sqlite3_aggregate_context = (a, b) => (f._sqlite3_aggregate_context = Z.ha)(a, b);
          f._sqlite3_column_count = (a) => (f._sqlite3_column_count = Z.ia)(a);
          f._sqlite3_data_count = (a) => (f._sqlite3_data_count = Z.ja)(a);
          f._sqlite3_column_blob = (a, b) => (f._sqlite3_column_blob = Z.ka)(a, b);
          f._sqlite3_column_bytes = (a, b) => (f._sqlite3_column_bytes = Z.la)(a, b);
          f._sqlite3_column_double = (a, b) => (f._sqlite3_column_double = Z.ma)(a, b);
          f._sqlite3_bind_blob = (a, b, c, d, e) => (f._sqlite3_bind_blob = Z.na)(a, b, c, d, e);
          f._sqlite3_bind_double = (a, b, c) => (f._sqlite3_bind_double = Z.oa)(a, b, c);
          f._sqlite3_bind_int = (a, b, c) => (f._sqlite3_bind_int = Z.pa)(a, b, c);
          f._sqlite3_bind_text = (a, b, c, d, e) => (f._sqlite3_bind_text = Z.qa)(a, b, c, d, e);
          f._sqlite3_bind_parameter_index = (a, b) => (f._sqlite3_bind_parameter_index = Z.ra)(a, b);
          f._sqlite3_sql = (a) => (f._sqlite3_sql = Z.sa)(a);
          f._sqlite3_normalized_sql = (a) => (f._sqlite3_normalized_sql = Z.ta)(a);
          f._sqlite3_changes = (a) => (f._sqlite3_changes = Z.ua)(a);
          f._sqlite3_close_v2 = (a) => (f._sqlite3_close_v2 = Z.va)(a);
          f._sqlite3_create_function_v2 = (a, b, c, d, e, h, k, r, y) => (f._sqlite3_create_function_v2 = Z.wa)(a, b, c, d, e, h, k, r, y);
          f._sqlite3_open = (a, b) => (f._sqlite3_open = Z.xa)(a, b);
          var ea = f._malloc = (a) => (ea = f._malloc = Z.ya)(a), ca = f._free = (a) => (ca = f._free = Z.za)(a);
          f._RegisterExtensionFunctions = (a) => (f._RegisterExtensionFunctions = Z.Ba)(a);
          var Gb = (a, b) => (Gb = Z.Ca)(a, b), pa = () => (pa = Z.Da)(), sa = (a) => (sa = Z.Ea)(a), x = (a) => (x = Z.Fa)(a);
          f.stackAlloc = x;
          f.stackSave = pa;
          f.stackRestore = sa;
          f.cwrap = (a, b, c, d) => {
            var e = !c || c.every((h) => "number" === h || "boolean" === h);
            return "string" !== b && e && !d ? f["_" + a] : function() {
              return Wc(a, b, c, arguments);
            };
          };
          f.addFunction = xa;
          f.removeFunction = ua;
          f.UTF8ToString = ra;
          f.ALLOC_NORMAL = ba;
          f.allocate = aa;
          f.allocateUTF8OnStack = ta;
          var ad;
          Xa = function bd() {
            ad || cd();
            ad || (Xa = bd);
          };
          function cd() {
            function a() {
              if (!ad && (ad = true, f.calledRun = true, !Ma)) {
                f.noFSInit || hc || (hc = true, gc(), f.stdin = f.stdin, f.stdout = f.stdout, f.stderr = f.stderr, f.stdin ? ic("stdin", f.stdin) : Zb("/dev/tty", "/dev/stdin"), f.stdout ? ic("stdout", null, f.stdout) : Zb("/dev/tty", "/dev/stdout"), f.stderr ? ic("stderr", null, f.stderr) : Zb("/dev/tty1", "/dev/stderr"), la("/dev/stdin", 0), la("/dev/stdout", 1), la("/dev/stderr", 1));
                Lb = false;
                eb(Sa);
                if (f.onRuntimeInitialized) f.onRuntimeInitialized();
                if (f.postRun) for ("function" == typeof f.postRun && (f.postRun = [f.postRun]); f.postRun.length; ) {
                  var b = f.postRun.shift();
                  Ta.unshift(b);
                }
                eb(Ta);
              }
            }
            if (!(0 < G)) {
              if (f.preRun) for ("function" == typeof f.preRun && (f.preRun = [f.preRun]); f.preRun.length; ) Va();
              eb(Ra);
              0 < G || (f.setStatus ? (f.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  f.setStatus("");
                }, 1);
                a();
              }, 1)) : a());
            }
          }
          if (f.preInit) for ("function" == typeof f.preInit && (f.preInit = [f.preInit]); 0 < f.preInit.length; ) f.preInit.pop()();
          cd();
          return Module;
        });
        return initSqlJsPromise;
      };
      if (typeof exports === "object" && typeof module === "object") {
        module.exports = initSqlJs2;
        module.exports.default = initSqlJs2;
      } else if (typeof define === "function" && define["amd"]) {
        define([], function() {
          return initSqlJs2;
        });
      } else if (typeof exports === "object") {
        exports["Module"] = initSqlJs2;
      }
    }
  });

  // shims/electron.js
  var require_electron = __commonJS({
    "shims/electron.js"(exports, module) {
      init_process();
      var H = globalThis.__handlers = {};
      var BW = class {
        constructor() {
          this.webContents = { on() {
          }, setWindowOpenHandler() {
          }, toggleDevTools() {
          }, getPrintersAsync: async () => [] };
        }
        on() {
        }
        loadURL() {
        }
        loadFile() {
        }
        show() {
        }
        static getAllWindows() {
          return [];
        }
      };
      module.exports = {
        app: { whenReady: () => Promise.resolve(), on() {
        }, quit() {
        }, getPath: () => "/", getVersion: () => "1.1.0" },
        BrowserWindow: BW,
        dialog: {},
        shell: { openExternal: (u) => window.open(u, "_blank") },
        ipcMain: { handle: (c, f) => {
          H[c] = f;
        } },
        ipcRenderer: { invoke: async (c, ...a) => H[c] ? H[c]({}, ...a) : { ok: false, error: "Phone par support nahi: " + c } },
        contextBridge: { exposeInMainWorld: (k, v) => {
          window[k] = v;
        } }
      };
    }
  });

  // shims/toolkit-utils.js
  var require_toolkit_utils = __commonJS({
    "shims/toolkit-utils.js"(exports, module) {
      init_process();
      module.exports = { is: { dev: false }, electronApp: { setAppUserModelId() {
      } }, optimizer: { watchWindowShortcuts() {
      } } };
    }
  });

  // shims/sqlite.js
  var require_sqlite = __commonJS({
    "shims/sqlite.js"(exports, module) {
      init_process();
      var P = () => globalThis.__POS;
      var Stmt = class {
        constructor(d, s) {
          this.d = d;
          this.sql = s;
          this.r = false;
          this.w = !/^\s*(select|pragma)/i.test(s);
        }
        raw(v = true) {
          this.r = v;
          return this;
        }
        q(a, rows) {
          const s = this.d.h.prepare(this.sql);
          try {
            s.bind(a.flat().map((v) => v === void 0 ? null : typeof v === "boolean" ? +v : v));
            const out = [];
            while (s.step()) {
              if (rows) out.push(this.r ? s.get() : s.getAsObject());
            }
            return out;
          } finally {
            s.free();
            if (this.w) this.d.dirty();
          }
        }
        all(...a) {
          return this.q(a, true);
        }
        get(...a) {
          return this.q(a, true)[0];
        }
        run(...a) {
          this.q(a, false);
          return { changes: this.d.h.getRowsModified(), lastInsertRowid: this.d.h.exec("select last_insert_rowid()")[0].values[0][0] };
        }
      };
      var Database = class {
        constructor() {
          const { SQL, bytes } = P();
          this.h = bytes ? new SQL.Database(bytes) : new SQL.Database();
          this.depth = 0;
          this.t = 0;
          P().db = this;
        }
        prepare(s) {
          return new Stmt(this, s);
        }
        exec(s) {
          this.h.exec(s);
          this.dirty();
          return this;
        }
        pragma(s) {
          try {
            const r = this.h.exec("PRAGMA " + s)[0];
            return r ? r.values.map((v) => Object.fromEntries(r.columns.map((c, i) => [c, v[i]]))) : [];
          } catch {
            return [];
          }
        }
        transaction(fn) {
          const f = (...a) => {
            const n = "sp" + this.depth++;
            this.h.exec(this.depth === 1 ? "BEGIN" : "SAVEPOINT " + n);
            try {
              const r = fn(...a);
              this.h.exec(this.depth === 1 ? "COMMIT" : "RELEASE " + n);
              this.depth--;
              this.dirty();
              return r;
            } catch (e) {
              this.h.exec(this.depth === 1 ? "ROLLBACK" : "ROLLBACK TO " + n);
              this.depth--;
              throw e;
            }
          };
          f.deferred = f.immediate = f.exclusive = f;
          return f;
        }
        dirty() {
          if (this.t) return;
          this.t = setTimeout(() => {
            this.t = 0;
            this.save();
          }, 400);
        }
        save() {
          if (this.depth) return this.dirty();
          const b = this.h.export();
          this.h.exec("PRAGMA foreign_keys=ON");
          P().put(b);
          return b;
        }
        close() {
          this.save();
        }
      };
      module.exports = Database;
    }
  });

  // node_modules/drizzle-orm/entity.cjs
  var require_entity = __commonJS({
    "node_modules/drizzle-orm/entity.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var entity_exports = {};
      __export(entity_exports, {
        entityKind: () => entityKind,
        hasOwnEntityKind: () => hasOwnEntityKind,
        is: () => is
      });
      module.exports = __toCommonJS(entity_exports);
      var entityKind = Symbol.for("drizzle:entityKind");
      var hasOwnEntityKind = Symbol.for("drizzle:hasOwnEntityKind");
      function is(value, type) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (value instanceof type) {
          return true;
        }
        if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
          throw new Error(
            `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
          );
        }
        let cls = Object.getPrototypeOf(value).constructor;
        if (cls) {
          while (cls) {
            if (entityKind in cls && cls[entityKind] === type[entityKind]) {
              return true;
            }
            cls = Object.getPrototypeOf(cls);
          }
        }
        return false;
      }
    }
  });

  // node_modules/drizzle-orm/logger.cjs
  var require_logger = __commonJS({
    "node_modules/drizzle-orm/logger.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var logger_exports = {};
      __export(logger_exports, {
        ConsoleLogWriter: () => ConsoleLogWriter,
        DefaultLogger: () => DefaultLogger,
        NoopLogger: () => NoopLogger
      });
      module.exports = __toCommonJS(logger_exports);
      var import_entity = require_entity();
      var ConsoleLogWriter = class {
        static [import_entity.entityKind] = "ConsoleLogWriter";
        write(message) {
          console.log(message);
        }
      };
      var DefaultLogger = class {
        static [import_entity.entityKind] = "DefaultLogger";
        writer;
        constructor(config) {
          this.writer = config?.writer ?? new ConsoleLogWriter();
        }
        logQuery(query, params) {
          const stringifiedParams = params.map((p) => {
            try {
              return JSON.stringify(p);
            } catch {
              return String(p);
            }
          });
          const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
          this.writer.write(`Query: ${query}${paramsStr}`);
        }
      };
      var NoopLogger = class {
        static [import_entity.entityKind] = "NoopLogger";
        logQuery() {
        }
      };
    }
  });

  // node_modules/drizzle-orm/table.utils.cjs
  var require_table_utils = __commonJS({
    "node_modules/drizzle-orm/table.utils.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var table_utils_exports = {};
      __export(table_utils_exports, {
        TableName: () => TableName
      });
      module.exports = __toCommonJS(table_utils_exports);
      var TableName = Symbol.for("drizzle:Name");
    }
  });

  // node_modules/drizzle-orm/table.cjs
  var require_table = __commonJS({
    "node_modules/drizzle-orm/table.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var table_exports = {};
      __export(table_exports, {
        BaseName: () => BaseName,
        Columns: () => Columns,
        ExtraConfigBuilder: () => ExtraConfigBuilder,
        ExtraConfigColumns: () => ExtraConfigColumns,
        IsAlias: () => IsAlias,
        OriginalName: () => OriginalName,
        Schema: () => Schema,
        Table: () => Table,
        getTableName: () => getTableName,
        getTableUniqueName: () => getTableUniqueName,
        isTable: () => isTable
      });
      module.exports = __toCommonJS(table_exports);
      var import_entity = require_entity();
      var import_table_utils = require_table_utils();
      var Schema = Symbol.for("drizzle:Schema");
      var Columns = Symbol.for("drizzle:Columns");
      var ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
      var OriginalName = Symbol.for("drizzle:OriginalName");
      var BaseName = Symbol.for("drizzle:BaseName");
      var IsAlias = Symbol.for("drizzle:IsAlias");
      var ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
      var IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
      var Table = class {
        static [import_entity.entityKind] = "Table";
        /** @internal */
        static Symbol = {
          Name: import_table_utils.TableName,
          Schema,
          OriginalName,
          Columns,
          ExtraConfigColumns,
          BaseName,
          IsAlias,
          ExtraConfigBuilder
        };
        /**
         * @internal
         * Can be changed if the table is aliased.
         */
        [import_table_utils.TableName];
        /**
         * @internal
         * Used to store the original name of the table, before any aliasing.
         */
        [OriginalName];
        /** @internal */
        [Schema];
        /** @internal */
        [Columns];
        /** @internal */
        [ExtraConfigColumns];
        /**
         *  @internal
         * Used to store the table name before the transformation via the `tableCreator` functions.
         */
        [BaseName];
        /** @internal */
        [IsAlias] = false;
        /** @internal */
        [IsDrizzleTable] = true;
        /** @internal */
        [ExtraConfigBuilder] = void 0;
        constructor(name, schema, baseName) {
          this[import_table_utils.TableName] = this[OriginalName] = name;
          this[Schema] = schema;
          this[BaseName] = baseName;
        }
      };
      function isTable(table) {
        return typeof table === "object" && table !== null && IsDrizzleTable in table;
      }
      function getTableName(table) {
        return table[import_table_utils.TableName];
      }
      function getTableUniqueName(table) {
        return `${table[Schema] ?? "public"}.${table[import_table_utils.TableName]}`;
      }
    }
  });

  // node_modules/drizzle-orm/column.cjs
  var require_column = __commonJS({
    "node_modules/drizzle-orm/column.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var column_exports = {};
      __export(column_exports, {
        Column: () => Column
      });
      module.exports = __toCommonJS(column_exports);
      var import_entity = require_entity();
      var Column = class {
        constructor(table, config) {
          this.table = table;
          this.config = config;
          this.name = config.name;
          this.keyAsName = config.keyAsName;
          this.notNull = config.notNull;
          this.default = config.default;
          this.defaultFn = config.defaultFn;
          this.onUpdateFn = config.onUpdateFn;
          this.hasDefault = config.hasDefault;
          this.primary = config.primaryKey;
          this.isUnique = config.isUnique;
          this.uniqueName = config.uniqueName;
          this.uniqueType = config.uniqueType;
          this.dataType = config.dataType;
          this.columnType = config.columnType;
          this.generated = config.generated;
          this.generatedIdentity = config.generatedIdentity;
        }
        static [import_entity.entityKind] = "Column";
        name;
        keyAsName;
        primary;
        notNull;
        default;
        defaultFn;
        onUpdateFn;
        hasDefault;
        isUnique;
        uniqueName;
        uniqueType;
        dataType;
        columnType;
        enumValues = void 0;
        generated = void 0;
        generatedIdentity = void 0;
        config;
        mapFromDriverValue(value) {
          return value;
        }
        mapToDriverValue(value) {
          return value;
        }
        // ** @internal */
        shouldDisableInsert() {
          return this.config.generated !== void 0 && this.config.generated.type !== "byDefault";
        }
      };
    }
  });

  // node_modules/drizzle-orm/column-builder.cjs
  var require_column_builder = __commonJS({
    "node_modules/drizzle-orm/column-builder.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var column_builder_exports = {};
      __export(column_builder_exports, {
        ColumnBuilder: () => ColumnBuilder
      });
      module.exports = __toCommonJS(column_builder_exports);
      var import_entity = require_entity();
      var ColumnBuilder = class {
        static [import_entity.entityKind] = "ColumnBuilder";
        config;
        constructor(name, dataType, columnType) {
          this.config = {
            name,
            keyAsName: name === "",
            notNull: false,
            default: void 0,
            hasDefault: false,
            primaryKey: false,
            isUnique: false,
            uniqueName: void 0,
            uniqueType: void 0,
            dataType,
            columnType,
            generated: void 0
          };
        }
        /**
         * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
         *
         * @example
         * ```ts
         * const users = pgTable('users', {
         * 	id: integer('id').$type<UserId>().primaryKey(),
         * 	details: json('details').$type<UserDetails>().notNull(),
         * });
         * ```
         */
        $type() {
          return this;
        }
        /**
         * Adds a `not null` clause to the column definition.
         *
         * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
         */
        notNull() {
          this.config.notNull = true;
          return this;
        }
        /**
         * Adds a `default <value>` clause to the column definition.
         *
         * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
         *
         * If you need to set a dynamic default value, use {@link $defaultFn} instead.
         */
        default(value) {
          this.config.default = value;
          this.config.hasDefault = true;
          return this;
        }
        /**
         * Adds a dynamic default value to the column.
         * The function will be called when the row is inserted, and the returned value will be used as the column value.
         *
         * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
         */
        $defaultFn(fn) {
          this.config.defaultFn = fn;
          this.config.hasDefault = true;
          return this;
        }
        /**
         * Alias for {@link $defaultFn}.
         */
        $default = this.$defaultFn;
        /**
         * Adds a dynamic update value to the column.
         * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
         * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
         *
         * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
         */
        $onUpdateFn(fn) {
          this.config.onUpdateFn = fn;
          this.config.hasDefault = true;
          return this;
        }
        /**
         * Alias for {@link $onUpdateFn}.
         */
        $onUpdate = this.$onUpdateFn;
        /**
         * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
         *
         * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
         */
        primaryKey() {
          this.config.primaryKey = true;
          this.config.notNull = true;
          return this;
        }
        /** @internal Sets the name of the column to the key within the table definition if a name was not given. */
        setName(name) {
          if (this.config.name !== "") return;
          this.config.name = name;
        }
      };
    }
  });

  // node_modules/drizzle-orm/pg-core/foreign-keys.cjs
  var require_foreign_keys = __commonJS({
    "node_modules/drizzle-orm/pg-core/foreign-keys.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var foreign_keys_exports = {};
      __export(foreign_keys_exports, {
        ForeignKey: () => ForeignKey,
        ForeignKeyBuilder: () => ForeignKeyBuilder,
        foreignKey: () => foreignKey
      });
      module.exports = __toCommonJS(foreign_keys_exports);
      var import_entity = require_entity();
      var import_table_utils = require_table_utils();
      var ForeignKeyBuilder = class {
        static [import_entity.entityKind] = "PgForeignKeyBuilder";
        /** @internal */
        reference;
        /** @internal */
        _onUpdate = "no action";
        /** @internal */
        _onDelete = "no action";
        constructor(config, actions) {
          this.reference = () => {
            const { name, columns, foreignColumns } = config();
            return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
          };
          if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
          }
        }
        onUpdate(action) {
          this._onUpdate = action === void 0 ? "no action" : action;
          return this;
        }
        onDelete(action) {
          this._onDelete = action === void 0 ? "no action" : action;
          return this;
        }
        /** @internal */
        build(table) {
          return new ForeignKey(table, this);
        }
      };
      var ForeignKey = class {
        constructor(table, builder) {
          this.table = table;
          this.reference = builder.reference;
          this.onUpdate = builder._onUpdate;
          this.onDelete = builder._onDelete;
        }
        static [import_entity.entityKind] = "PgForeignKey";
        reference;
        onUpdate;
        onDelete;
        getName() {
          const { name, columns, foreignColumns } = this.reference();
          const columnNames = columns.map((column) => column.name);
          const foreignColumnNames = foreignColumns.map((column) => column.name);
          const chunks = [
            this.table[import_table_utils.TableName],
            ...columnNames,
            foreignColumns[0].table[import_table_utils.TableName],
            ...foreignColumnNames
          ];
          return name ?? `${chunks.join("_")}_fk`;
        }
      };
      function foreignKey(config) {
        function mappedConfig() {
          const { name, columns, foreignColumns } = config;
          return {
            name,
            columns,
            foreignColumns
          };
        }
        return new ForeignKeyBuilder(mappedConfig);
      }
    }
  });

  // node_modules/drizzle-orm/tracing-utils.cjs
  var require_tracing_utils = __commonJS({
    "node_modules/drizzle-orm/tracing-utils.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var tracing_utils_exports = {};
      __export(tracing_utils_exports, {
        iife: () => iife
      });
      module.exports = __toCommonJS(tracing_utils_exports);
      function iife(fn, ...args) {
        return fn(...args);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/unique-constraint.cjs
  var require_unique_constraint = __commonJS({
    "node_modules/drizzle-orm/pg-core/unique-constraint.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var unique_constraint_exports = {};
      __export(unique_constraint_exports, {
        UniqueConstraint: () => UniqueConstraint,
        UniqueConstraintBuilder: () => UniqueConstraintBuilder,
        UniqueOnConstraintBuilder: () => UniqueOnConstraintBuilder,
        unique: () => unique,
        uniqueKeyName: () => uniqueKeyName
      });
      module.exports = __toCommonJS(unique_constraint_exports);
      var import_entity = require_entity();
      var import_table_utils = require_table_utils();
      function unique(name) {
        return new UniqueOnConstraintBuilder(name);
      }
      function uniqueKeyName(table, columns) {
        return `${table[import_table_utils.TableName]}_${columns.join("_")}_unique`;
      }
      var UniqueConstraintBuilder = class {
        constructor(columns, name) {
          this.name = name;
          this.columns = columns;
        }
        static [import_entity.entityKind] = "PgUniqueConstraintBuilder";
        /** @internal */
        columns;
        /** @internal */
        nullsNotDistinctConfig = false;
        nullsNotDistinct() {
          this.nullsNotDistinctConfig = true;
          return this;
        }
        /** @internal */
        build(table) {
          return new UniqueConstraint(table, this.columns, this.nullsNotDistinctConfig, this.name);
        }
      };
      var UniqueOnConstraintBuilder = class {
        static [import_entity.entityKind] = "PgUniqueOnConstraintBuilder";
        /** @internal */
        name;
        constructor(name) {
          this.name = name;
        }
        on(...columns) {
          return new UniqueConstraintBuilder(columns, this.name);
        }
      };
      var UniqueConstraint = class {
        constructor(table, columns, nullsNotDistinct, name) {
          this.table = table;
          this.columns = columns;
          this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
          this.nullsNotDistinct = nullsNotDistinct;
        }
        static [import_entity.entityKind] = "PgUniqueConstraint";
        columns;
        name;
        nullsNotDistinct = false;
        getName() {
          return this.name;
        }
      };
    }
  });

  // node_modules/drizzle-orm/pg-core/utils/array.cjs
  var require_array = __commonJS({
    "node_modules/drizzle-orm/pg-core/utils/array.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var array_exports = {};
      __export(array_exports, {
        makePgArray: () => makePgArray,
        parsePgArray: () => parsePgArray,
        parsePgNestedArray: () => parsePgNestedArray
      });
      module.exports = __toCommonJS(array_exports);
      function parsePgArrayValue(arrayString, startFrom, inQuotes) {
        for (let i = startFrom; i < arrayString.length; i++) {
          const char = arrayString[i];
          if (char === "\\") {
            i++;
            continue;
          }
          if (char === '"') {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i + 1];
          }
          if (inQuotes) {
            continue;
          }
          if (char === "," || char === "}") {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ""), i];
          }
        }
        return [arrayString.slice(startFrom).replace(/\\/g, ""), arrayString.length];
      }
      function parsePgNestedArray(arrayString, startFrom = 0) {
        const result = [];
        let i = startFrom;
        let lastCharIsComma = false;
        while (i < arrayString.length) {
          const char = arrayString[i];
          if (char === ",") {
            if (lastCharIsComma || i === startFrom) {
              result.push("");
            }
            lastCharIsComma = true;
            i++;
            continue;
          }
          lastCharIsComma = false;
          if (char === "\\") {
            i += 2;
            continue;
          }
          if (char === '"') {
            const [value2, startFrom2] = parsePgArrayValue(arrayString, i + 1, true);
            result.push(value2);
            i = startFrom2;
            continue;
          }
          if (char === "}") {
            return [result, i + 1];
          }
          if (char === "{") {
            const [value2, startFrom2] = parsePgNestedArray(arrayString, i + 1);
            result.push(value2);
            i = startFrom2;
            continue;
          }
          const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
          result.push(value);
          i = newStartFrom;
        }
        return [result, i];
      }
      function parsePgArray(arrayString) {
        const [result] = parsePgNestedArray(arrayString, 1);
        return result;
      }
      function makePgArray(array) {
        return `{${array.map((item) => {
          if (Array.isArray(item)) {
            return makePgArray(item);
          }
          if (typeof item === "string") {
            return `"${item.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
          }
          return `${item}`;
        }).join(",")}}`;
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/common.cjs
  var require_common = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/common.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var common_exports = {};
      __export(common_exports, {
        ExtraConfigColumn: () => ExtraConfigColumn,
        IndexedColumn: () => IndexedColumn,
        PgArray: () => PgArray,
        PgArrayBuilder: () => PgArrayBuilder,
        PgColumn: () => PgColumn,
        PgColumnBuilder: () => PgColumnBuilder
      });
      module.exports = __toCommonJS(common_exports);
      var import_column_builder = require_column_builder();
      var import_column = require_column();
      var import_entity = require_entity();
      var import_foreign_keys = require_foreign_keys();
      var import_tracing_utils = require_tracing_utils();
      var import_unique_constraint = require_unique_constraint();
      var import_array = require_array();
      var PgColumnBuilder = class extends import_column_builder.ColumnBuilder {
        foreignKeyConfigs = [];
        static [import_entity.entityKind] = "PgColumnBuilder";
        array(size) {
          return new PgArrayBuilder(this.config.name, this, size);
        }
        references(ref, actions = {}) {
          this.foreignKeyConfigs.push({ ref, actions });
          return this;
        }
        unique(name, config) {
          this.config.isUnique = true;
          this.config.uniqueName = name;
          this.config.uniqueType = config?.nulls;
          return this;
        }
        generatedAlwaysAs(as) {
          this.config.generated = {
            as,
            type: "always",
            mode: "stored"
          };
          return this;
        }
        /** @internal */
        buildForeignKeys(column, table) {
          return this.foreignKeyConfigs.map(({ ref, actions }) => {
            return (0, import_tracing_utils.iife)(
              (ref2, actions2) => {
                const builder = new import_foreign_keys.ForeignKeyBuilder(() => {
                  const foreignColumn = ref2();
                  return { columns: [column], foreignColumns: [foreignColumn] };
                });
                if (actions2.onUpdate) {
                  builder.onUpdate(actions2.onUpdate);
                }
                if (actions2.onDelete) {
                  builder.onDelete(actions2.onDelete);
                }
                return builder.build(table);
              },
              ref,
              actions
            );
          });
        }
        /** @internal */
        buildExtraConfigColumn(table) {
          return new ExtraConfigColumn(table, this.config);
        }
      };
      var PgColumn = class extends import_column.Column {
        constructor(table, config) {
          if (!config.uniqueName) {
            config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
          }
          super(table, config);
          this.table = table;
        }
        static [import_entity.entityKind] = "PgColumn";
      };
      var ExtraConfigColumn = class extends PgColumn {
        static [import_entity.entityKind] = "ExtraConfigColumn";
        getSQLType() {
          return this.getSQLType();
        }
        indexConfig = {
          order: this.config.order ?? "asc",
          nulls: this.config.nulls ?? "last",
          opClass: this.config.opClass
        };
        defaultConfig = {
          order: "asc",
          nulls: "last",
          opClass: void 0
        };
        asc() {
          this.indexConfig.order = "asc";
          return this;
        }
        desc() {
          this.indexConfig.order = "desc";
          return this;
        }
        nullsFirst() {
          this.indexConfig.nulls = "first";
          return this;
        }
        nullsLast() {
          this.indexConfig.nulls = "last";
          return this;
        }
        /**
         * ### PostgreSQL documentation quote
         *
         * > An operator class with optional parameters can be specified for each column of an index.
         * The operator class identifies the operators to be used by the index for that column.
         * For example, a B-tree index on four-byte integers would use the int4_ops class;
         * this operator class includes comparison functions for four-byte integers.
         * In practice the default operator class for the column's data type is usually sufficient.
         * The main point of having operator classes is that for some data types, there could be more than one meaningful ordering.
         * For example, we might want to sort a complex-number data type either by absolute value or by real part.
         * We could do this by defining two operator classes for the data type and then selecting the proper class when creating an index.
         * More information about operator classes check:
         *
         * ### Useful links
         * https://www.postgresql.org/docs/current/sql-createindex.html
         *
         * https://www.postgresql.org/docs/current/indexes-opclass.html
         *
         * https://www.postgresql.org/docs/current/xindex.html
         *
         * ### Additional types
         * If you have the `pg_vector` extension installed in your database, you can use the
         * `vector_l2_ops`, `vector_ip_ops`, `vector_cosine_ops`, `vector_l1_ops`, `bit_hamming_ops`, `bit_jaccard_ops`, `halfvec_l2_ops`, `sparsevec_l2_ops` options, which are predefined types.
         *
         * **You can always specify any string you want in the operator class, in case Drizzle doesn't have it natively in its types**
         *
         * @param opClass
         * @returns
         */
        op(opClass) {
          this.indexConfig.opClass = opClass;
          return this;
        }
      };
      var IndexedColumn = class {
        static [import_entity.entityKind] = "IndexedColumn";
        constructor(name, keyAsName, type, indexConfig) {
          this.name = name;
          this.keyAsName = keyAsName;
          this.type = type;
          this.indexConfig = indexConfig;
        }
        name;
        keyAsName;
        type;
        indexConfig;
      };
      var PgArrayBuilder = class extends PgColumnBuilder {
        static [import_entity.entityKind] = "PgArrayBuilder";
        constructor(name, baseBuilder, size) {
          super(name, "array", "PgArray");
          this.config.baseBuilder = baseBuilder;
          this.config.size = size;
        }
        /** @internal */
        build(table) {
          const baseColumn = this.config.baseBuilder.build(table);
          return new PgArray(
            table,
            this.config,
            baseColumn
          );
        }
      };
      var PgArray = class _PgArray extends PgColumn {
        constructor(table, config, baseColumn, range) {
          super(table, config);
          this.baseColumn = baseColumn;
          this.range = range;
          this.size = config.size;
        }
        size;
        static [import_entity.entityKind] = "PgArray";
        getSQLType() {
          return `${this.baseColumn.getSQLType()}[${typeof this.size === "number" ? this.size : ""}]`;
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            value = (0, import_array.parsePgArray)(value);
          }
          return value.map((v) => this.baseColumn.mapFromDriverValue(v));
        }
        mapToDriverValue(value, isNestedArray = false) {
          const a = value.map(
            (v) => v === null ? null : (0, import_entity.is)(this.baseColumn, _PgArray) ? this.baseColumn.mapToDriverValue(v, true) : this.baseColumn.mapToDriverValue(v)
          );
          if (isNestedArray) return a;
          return (0, import_array.makePgArray)(a);
        }
      };
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/enum.cjs
  var require_enum = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/enum.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var enum_exports = {};
      __export(enum_exports, {
        PgEnumColumn: () => PgEnumColumn,
        PgEnumColumnBuilder: () => PgEnumColumnBuilder,
        PgEnumObjectColumn: () => PgEnumObjectColumn,
        PgEnumObjectColumnBuilder: () => PgEnumObjectColumnBuilder,
        isPgEnum: () => isPgEnum,
        pgEnum: () => pgEnum,
        pgEnumObjectWithSchema: () => pgEnumObjectWithSchema,
        pgEnumWithSchema: () => pgEnumWithSchema
      });
      module.exports = __toCommonJS(enum_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgEnumObjectColumnBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgEnumObjectColumnBuilder";
        constructor(name, enumInstance) {
          super(name, "string", "PgEnumObjectColumn");
          this.config.enum = enumInstance;
        }
        /** @internal */
        build(table) {
          return new PgEnumObjectColumn(
            table,
            this.config
          );
        }
      };
      var PgEnumObjectColumn = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgEnumObjectColumn";
        enum;
        enumValues = this.config.enum.enumValues;
        constructor(table, config) {
          super(table, config);
          this.enum = config.enum;
        }
        getSQLType() {
          return this.enum.enumName;
        }
      };
      var isPgEnumSym = Symbol.for("drizzle:isPgEnum");
      function isPgEnum(obj) {
        return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
      }
      var PgEnumColumnBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgEnumColumnBuilder";
        constructor(name, enumInstance) {
          super(name, "string", "PgEnumColumn");
          this.config.enum = enumInstance;
        }
        /** @internal */
        build(table) {
          return new PgEnumColumn(
            table,
            this.config
          );
        }
      };
      var PgEnumColumn = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgEnumColumn";
        enum = this.config.enum;
        enumValues = this.config.enum.enumValues;
        constructor(table, config) {
          super(table, config);
          this.enum = config.enum;
        }
        getSQLType() {
          return this.enum.enumName;
        }
      };
      function pgEnum(enumName, input) {
        return Array.isArray(input) ? pgEnumWithSchema(enumName, [...input], void 0) : pgEnumObjectWithSchema(enumName, input, void 0);
      }
      function pgEnumWithSchema(enumName, values, schema) {
        const enumInstance = Object.assign(
          (name) => new PgEnumColumnBuilder(name ?? "", enumInstance),
          {
            enumName,
            enumValues: values,
            schema,
            [isPgEnumSym]: true
          }
        );
        return enumInstance;
      }
      function pgEnumObjectWithSchema(enumName, values, schema) {
        const enumInstance = Object.assign(
          (name) => new PgEnumObjectColumnBuilder(name ?? "", enumInstance),
          {
            enumName,
            enumValues: Object.values(values),
            schema,
            [isPgEnumSym]: true
          }
        );
        return enumInstance;
      }
    }
  });

  // node_modules/drizzle-orm/subquery.cjs
  var require_subquery = __commonJS({
    "node_modules/drizzle-orm/subquery.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var subquery_exports = {};
      __export(subquery_exports, {
        Subquery: () => Subquery,
        WithSubquery: () => WithSubquery
      });
      module.exports = __toCommonJS(subquery_exports);
      var import_entity = require_entity();
      var Subquery = class {
        static [import_entity.entityKind] = "Subquery";
        constructor(sql, fields, alias, isWith = false, usedTables = []) {
          this._ = {
            brand: "Subquery",
            sql,
            selectedFields: fields,
            alias,
            isWith,
            usedTables
          };
        }
        // getSQL(): SQL<unknown> {
        // 	return new SQL([this]);
        // }
      };
      var WithSubquery = class extends Subquery {
        static [import_entity.entityKind] = "WithSubquery";
      };
    }
  });

  // node_modules/drizzle-orm/version.cjs
  var require_version = __commonJS({
    "node_modules/drizzle-orm/version.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var version_exports = {};
      __export(version_exports, {
        compatibilityVersion: () => compatibilityVersion,
        npmVersion: () => version
      });
      module.exports = __toCommonJS(version_exports);
      var version = "0.45.2";
      var compatibilityVersion = 10;
    }
  });

  // node_modules/drizzle-orm/tracing.cjs
  var require_tracing = __commonJS({
    "node_modules/drizzle-orm/tracing.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var tracing_exports = {};
      __export(tracing_exports, {
        tracer: () => tracer
      });
      module.exports = __toCommonJS(tracing_exports);
      var import_tracing_utils = require_tracing_utils();
      var import_version = require_version();
      var otel;
      var rawTracer;
      var tracer = {
        startActiveSpan(name, fn) {
          if (!otel) {
            return fn();
          }
          if (!rawTracer) {
            rawTracer = otel.trace.getTracer("drizzle-orm", import_version.npmVersion);
          }
          return (0, import_tracing_utils.iife)(
            (otel2, rawTracer2) => rawTracer2.startActiveSpan(
              name,
              (span) => {
                try {
                  return fn(span);
                } catch (e) {
                  span.setStatus({
                    code: otel2.SpanStatusCode.ERROR,
                    message: e instanceof Error ? e.message : "Unknown error"
                    // eslint-disable-line no-instanceof/no-instanceof
                  });
                  throw e;
                } finally {
                  span.end();
                }
              }
            ),
            otel,
            rawTracer
          );
        }
      };
    }
  });

  // node_modules/drizzle-orm/view-common.cjs
  var require_view_common = __commonJS({
    "node_modules/drizzle-orm/view-common.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var view_common_exports = {};
      __export(view_common_exports, {
        ViewBaseConfig: () => ViewBaseConfig
      });
      module.exports = __toCommonJS(view_common_exports);
      var ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
    }
  });

  // node_modules/drizzle-orm/sql/sql.cjs
  var require_sql = __commonJS({
    "node_modules/drizzle-orm/sql/sql.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name2 in all)
          __defProp2(target, name2, { get: all[name2], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var sql_exports = {};
      __export(sql_exports, {
        FakePrimitiveParam: () => FakePrimitiveParam,
        Name: () => Name,
        Param: () => Param,
        Placeholder: () => Placeholder,
        SQL: () => SQL,
        StringChunk: () => StringChunk,
        View: () => View,
        fillPlaceholders: () => fillPlaceholders,
        getViewName: () => getViewName,
        isDriverValueEncoder: () => isDriverValueEncoder,
        isSQLWrapper: () => isSQLWrapper,
        isView: () => isView,
        name: () => name,
        noopDecoder: () => noopDecoder,
        noopEncoder: () => noopEncoder,
        noopMapper: () => noopMapper,
        param: () => param,
        placeholder: () => placeholder,
        sql: () => sql
      });
      module.exports = __toCommonJS(sql_exports);
      var import_entity = require_entity();
      var import_enum = require_enum();
      var import_subquery = require_subquery();
      var import_tracing = require_tracing();
      var import_view_common = require_view_common();
      var import_column = require_column();
      var import_table = require_table();
      var FakePrimitiveParam = class {
        static [import_entity.entityKind] = "FakePrimitiveParam";
      };
      function isSQLWrapper(value) {
        return value !== null && value !== void 0 && typeof value.getSQL === "function";
      }
      function mergeQueries(queries) {
        const result = { sql: "", params: [] };
        for (const query of queries) {
          result.sql += query.sql;
          result.params.push(...query.params);
          if (query.typings?.length) {
            if (!result.typings) {
              result.typings = [];
            }
            result.typings.push(...query.typings);
          }
        }
        return result;
      }
      var StringChunk = class {
        static [import_entity.entityKind] = "StringChunk";
        value;
        constructor(value) {
          this.value = Array.isArray(value) ? value : [value];
        }
        getSQL() {
          return new SQL([this]);
        }
      };
      var SQL = class _SQL {
        constructor(queryChunks) {
          this.queryChunks = queryChunks;
          for (const chunk of queryChunks) {
            if ((0, import_entity.is)(chunk, import_table.Table)) {
              const schemaName = chunk[import_table.Table.Symbol.Schema];
              this.usedTables.push(
                schemaName === void 0 ? chunk[import_table.Table.Symbol.Name] : schemaName + "." + chunk[import_table.Table.Symbol.Name]
              );
            }
          }
        }
        static [import_entity.entityKind] = "SQL";
        /** @internal */
        decoder = noopDecoder;
        shouldInlineParams = false;
        /** @internal */
        usedTables = [];
        append(query) {
          this.queryChunks.push(...query.queryChunks);
          return this;
        }
        toQuery(config) {
          return import_tracing.tracer.startActiveSpan("drizzle.buildSQL", (span) => {
            const query = this.buildQueryFromSourceParams(this.queryChunks, config);
            span?.setAttributes({
              "drizzle.query.text": query.sql,
              "drizzle.query.params": JSON.stringify(query.params)
            });
            return query;
          });
        }
        buildQueryFromSourceParams(chunks, _config) {
          const config = Object.assign({}, _config, {
            inlineParams: _config.inlineParams || this.shouldInlineParams,
            paramStartIndex: _config.paramStartIndex || { value: 0 }
          });
          const {
            casing,
            escapeName,
            escapeParam,
            prepareTyping,
            inlineParams,
            paramStartIndex
          } = config;
          return mergeQueries(chunks.map((chunk) => {
            if ((0, import_entity.is)(chunk, StringChunk)) {
              return { sql: chunk.value.join(""), params: [] };
            }
            if ((0, import_entity.is)(chunk, Name)) {
              return { sql: escapeName(chunk.value), params: [] };
            }
            if (chunk === void 0) {
              return { sql: "", params: [] };
            }
            if (Array.isArray(chunk)) {
              const result = [new StringChunk("(")];
              for (const [i, p] of chunk.entries()) {
                result.push(p);
                if (i < chunk.length - 1) {
                  result.push(new StringChunk(", "));
                }
              }
              result.push(new StringChunk(")"));
              return this.buildQueryFromSourceParams(result, config);
            }
            if ((0, import_entity.is)(chunk, _SQL)) {
              return this.buildQueryFromSourceParams(chunk.queryChunks, {
                ...config,
                inlineParams: inlineParams || chunk.shouldInlineParams
              });
            }
            if ((0, import_entity.is)(chunk, import_table.Table)) {
              const schemaName = chunk[import_table.Table.Symbol.Schema];
              const tableName = chunk[import_table.Table.Symbol.Name];
              return {
                sql: schemaName === void 0 || chunk[import_table.IsAlias] ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
                params: []
              };
            }
            if ((0, import_entity.is)(chunk, import_column.Column)) {
              const columnName = casing.getColumnCasing(chunk);
              if (_config.invokeSource === "indexes") {
                return { sql: escapeName(columnName), params: [] };
              }
              const schemaName = chunk.table[import_table.Table.Symbol.Schema];
              return {
                sql: chunk.table[import_table.IsAlias] || schemaName === void 0 ? escapeName(chunk.table[import_table.Table.Symbol.Name]) + "." + escapeName(columnName) : escapeName(schemaName) + "." + escapeName(chunk.table[import_table.Table.Symbol.Name]) + "." + escapeName(columnName),
                params: []
              };
            }
            if ((0, import_entity.is)(chunk, View)) {
              const schemaName = chunk[import_view_common.ViewBaseConfig].schema;
              const viewName = chunk[import_view_common.ViewBaseConfig].name;
              return {
                sql: schemaName === void 0 || chunk[import_view_common.ViewBaseConfig].isAlias ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
                params: []
              };
            }
            if ((0, import_entity.is)(chunk, Param)) {
              if ((0, import_entity.is)(chunk.value, Placeholder)) {
                return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
              }
              const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
              if ((0, import_entity.is)(mappedValue, _SQL)) {
                return this.buildQueryFromSourceParams([mappedValue], config);
              }
              if (inlineParams) {
                return { sql: this.mapInlineParam(mappedValue, config), params: [] };
              }
              let typings = ["none"];
              if (prepareTyping) {
                typings = [prepareTyping(chunk.encoder)];
              }
              return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
            }
            if ((0, import_entity.is)(chunk, Placeholder)) {
              return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
            }
            if ((0, import_entity.is)(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
              return { sql: escapeName(chunk.fieldAlias), params: [] };
            }
            if ((0, import_entity.is)(chunk, import_subquery.Subquery)) {
              if (chunk._.isWith) {
                return { sql: escapeName(chunk._.alias), params: [] };
              }
              return this.buildQueryFromSourceParams([
                new StringChunk("("),
                chunk._.sql,
                new StringChunk(") "),
                new Name(chunk._.alias)
              ], config);
            }
            if ((0, import_enum.isPgEnum)(chunk)) {
              if (chunk.schema) {
                return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
              }
              return { sql: escapeName(chunk.enumName), params: [] };
            }
            if (isSQLWrapper(chunk)) {
              if (chunk.shouldOmitSQLParens?.()) {
                return this.buildQueryFromSourceParams([chunk.getSQL()], config);
              }
              return this.buildQueryFromSourceParams([
                new StringChunk("("),
                chunk.getSQL(),
                new StringChunk(")")
              ], config);
            }
            if (inlineParams) {
              return { sql: this.mapInlineParam(chunk, config), params: [] };
            }
            return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk], typings: ["none"] };
          }));
        }
        mapInlineParam(chunk, { escapeString }) {
          if (chunk === null) {
            return "null";
          }
          if (typeof chunk === "number" || typeof chunk === "boolean") {
            return chunk.toString();
          }
          if (typeof chunk === "string") {
            return escapeString(chunk);
          }
          if (typeof chunk === "object") {
            const mappedValueAsString = chunk.toString();
            if (mappedValueAsString === "[object Object]") {
              return escapeString(JSON.stringify(chunk));
            }
            return escapeString(mappedValueAsString);
          }
          throw new Error("Unexpected param value: " + chunk);
        }
        getSQL() {
          return this;
        }
        as(alias) {
          if (alias === void 0) {
            return this;
          }
          return new _SQL.Aliased(this, alias);
        }
        mapWith(decoder) {
          this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
          return this;
        }
        inlineParams() {
          this.shouldInlineParams = true;
          return this;
        }
        /**
         * This method is used to conditionally include a part of the query.
         *
         * @param condition - Condition to check
         * @returns itself if the condition is `true`, otherwise `undefined`
         */
        if(condition) {
          return condition ? this : void 0;
        }
      };
      var Name = class {
        constructor(value) {
          this.value = value;
        }
        static [import_entity.entityKind] = "Name";
        brand;
        getSQL() {
          return new SQL([this]);
        }
      };
      function name(value) {
        return new Name(value);
      }
      function isDriverValueEncoder(value) {
        return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
      }
      var noopDecoder = {
        mapFromDriverValue: (value) => value
      };
      var noopEncoder = {
        mapToDriverValue: (value) => value
      };
      var noopMapper = {
        ...noopDecoder,
        ...noopEncoder
      };
      var Param = class {
        /**
         * @param value - Parameter value
         * @param encoder - Encoder to convert the value to a driver parameter
         */
        constructor(value, encoder = noopEncoder) {
          this.value = value;
          this.encoder = encoder;
        }
        static [import_entity.entityKind] = "Param";
        brand;
        getSQL() {
          return new SQL([this]);
        }
      };
      function param(value, encoder) {
        return new Param(value, encoder);
      }
      function sql(strings, ...params) {
        const queryChunks = [];
        if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
          queryChunks.push(new StringChunk(strings[0]));
        }
        for (const [paramIndex, param2] of params.entries()) {
          queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
        }
        return new SQL(queryChunks);
      }
      ((sql2) => {
        function empty() {
          return new SQL([]);
        }
        sql2.empty = empty;
        function fromList(list) {
          return new SQL(list);
        }
        sql2.fromList = fromList;
        function raw(str) {
          return new SQL([new StringChunk(str)]);
        }
        sql2.raw = raw;
        function join(chunks, separator) {
          const result = [];
          for (const [i, chunk] of chunks.entries()) {
            if (i > 0 && separator !== void 0) {
              result.push(separator);
            }
            result.push(chunk);
          }
          return new SQL(result);
        }
        sql2.join = join;
        function identifier(value) {
          return new Name(value);
        }
        sql2.identifier = identifier;
        function placeholder2(name2) {
          return new Placeholder(name2);
        }
        sql2.placeholder = placeholder2;
        function param2(value, encoder) {
          return new Param(value, encoder);
        }
        sql2.param = param2;
      })(sql || (sql = {}));
      ((SQL2) => {
        class Aliased {
          constructor(sql2, fieldAlias) {
            this.sql = sql2;
            this.fieldAlias = fieldAlias;
          }
          static [import_entity.entityKind] = "SQL.Aliased";
          /** @internal */
          isSelectionField = false;
          getSQL() {
            return this.sql;
          }
          /** @internal */
          clone() {
            return new Aliased(this.sql, this.fieldAlias);
          }
        }
        SQL2.Aliased = Aliased;
      })(SQL || (SQL = {}));
      var Placeholder = class {
        constructor(name2) {
          this.name = name2;
        }
        static [import_entity.entityKind] = "Placeholder";
        getSQL() {
          return new SQL([this]);
        }
      };
      function placeholder(name2) {
        return new Placeholder(name2);
      }
      function fillPlaceholders(params, values) {
        return params.map((p) => {
          if ((0, import_entity.is)(p, Placeholder)) {
            if (!(p.name in values)) {
              throw new Error(`No value for placeholder "${p.name}" was provided`);
            }
            return values[p.name];
          }
          if ((0, import_entity.is)(p, Param) && (0, import_entity.is)(p.value, Placeholder)) {
            if (!(p.value.name in values)) {
              throw new Error(`No value for placeholder "${p.value.name}" was provided`);
            }
            return p.encoder.mapToDriverValue(values[p.value.name]);
          }
          return p;
        });
      }
      var IsDrizzleView = Symbol.for("drizzle:IsDrizzleView");
      var View = class {
        static [import_entity.entityKind] = "View";
        /** @internal */
        [import_view_common.ViewBaseConfig];
        /** @internal */
        [IsDrizzleView] = true;
        constructor({ name: name2, schema, selectedFields, query }) {
          this[import_view_common.ViewBaseConfig] = {
            name: name2,
            originalName: name2,
            schema,
            selectedFields,
            query,
            isExisting: !query,
            isAlias: false
          };
        }
        getSQL() {
          return new SQL([this]);
        }
      };
      function isView(view) {
        return typeof view === "object" && view !== null && IsDrizzleView in view;
      }
      function getViewName(view) {
        return view[import_view_common.ViewBaseConfig].name;
      }
      import_column.Column.prototype.getSQL = function() {
        return new SQL([this]);
      };
      import_table.Table.prototype.getSQL = function() {
        return new SQL([this]);
      };
      import_subquery.Subquery.prototype.getSQL = function() {
        return new SQL([this]);
      };
    }
  });

  // node_modules/drizzle-orm/utils.cjs
  var require_utils2 = __commonJS({
    "node_modules/drizzle-orm/utils.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var utils_exports = {};
      __export(utils_exports, {
        applyMixins: () => applyMixins,
        getColumnNameAndConfig: () => getColumnNameAndConfig,
        getTableColumns: () => getTableColumns,
        getTableLikeName: () => getTableLikeName,
        getViewSelectedFields: () => getViewSelectedFields,
        haveSameKeys: () => haveSameKeys,
        isConfig: () => isConfig,
        mapResultRow: () => mapResultRow,
        mapUpdateSet: () => mapUpdateSet,
        orderSelectedFields: () => orderSelectedFields,
        textDecoder: () => textDecoder
      });
      module.exports = __toCommonJS(utils_exports);
      var import_column = require_column();
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_subquery = require_subquery();
      var import_table = require_table();
      var import_view_common = require_view_common();
      function mapResultRow(columns, row, joinsNotNullableMap) {
        const nullifyMap = {};
        const result = columns.reduce(
          (result2, { path, field }, columnIndex) => {
            let decoder;
            if ((0, import_entity.is)(field, import_column.Column)) {
              decoder = field;
            } else if ((0, import_entity.is)(field, import_sql2.SQL)) {
              decoder = field.decoder;
            } else if ((0, import_entity.is)(field, import_subquery.Subquery)) {
              decoder = field._.sql.decoder;
            } else {
              decoder = field.sql.decoder;
            }
            let node = result2;
            for (const [pathChunkIndex, pathChunk] of path.entries()) {
              if (pathChunkIndex < path.length - 1) {
                if (!(pathChunk in node)) {
                  node[pathChunk] = {};
                }
                node = node[pathChunk];
              } else {
                const rawValue = row[columnIndex];
                const value = node[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
                if (joinsNotNullableMap && (0, import_entity.is)(field, import_column.Column) && path.length === 2) {
                  const objectName = path[0];
                  if (!(objectName in nullifyMap)) {
                    nullifyMap[objectName] = value === null ? (0, import_table.getTableName)(field.table) : false;
                  } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== (0, import_table.getTableName)(field.table)) {
                    nullifyMap[objectName] = false;
                  }
                }
              }
            }
            return result2;
          },
          {}
        );
        if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
          for (const [objectName, tableName] of Object.entries(nullifyMap)) {
            if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
              result[objectName] = null;
            }
          }
        }
        return result;
      }
      function orderSelectedFields(fields, pathPrefix) {
        return Object.entries(fields).reduce((result, [name, field]) => {
          if (typeof name !== "string") {
            return result;
          }
          const newPath = pathPrefix ? [...pathPrefix, name] : [name];
          if ((0, import_entity.is)(field, import_column.Column) || (0, import_entity.is)(field, import_sql2.SQL) || (0, import_entity.is)(field, import_sql2.SQL.Aliased) || (0, import_entity.is)(field, import_subquery.Subquery)) {
            result.push({ path: newPath, field });
          } else if ((0, import_entity.is)(field, import_table.Table)) {
            result.push(...orderSelectedFields(field[import_table.Table.Symbol.Columns], newPath));
          } else {
            result.push(...orderSelectedFields(field, newPath));
          }
          return result;
        }, []);
      }
      function haveSameKeys(left, right) {
        const leftKeys = Object.keys(left);
        const rightKeys = Object.keys(right);
        if (leftKeys.length !== rightKeys.length) {
          return false;
        }
        for (const [index, key] of leftKeys.entries()) {
          if (key !== rightKeys[index]) {
            return false;
          }
        }
        return true;
      }
      function mapUpdateSet(table, values) {
        const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
          if ((0, import_entity.is)(value, import_sql2.SQL) || (0, import_entity.is)(value, import_column.Column)) {
            return [key, value];
          } else {
            return [key, new import_sql2.Param(value, table[import_table.Table.Symbol.Columns][key])];
          }
        });
        if (entries.length === 0) {
          throw new Error("No values to set");
        }
        return Object.fromEntries(entries);
      }
      function applyMixins(baseClass, extendedClasses) {
        for (const extendedClass of extendedClasses) {
          for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
            if (name === "constructor") continue;
            Object.defineProperty(
              baseClass.prototype,
              name,
              Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
            );
          }
        }
      }
      function getTableColumns(table) {
        return table[import_table.Table.Symbol.Columns];
      }
      function getViewSelectedFields(view) {
        return view[import_view_common.ViewBaseConfig].selectedFields;
      }
      function getTableLikeName(table) {
        return (0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_sql2.View) ? table[import_view_common.ViewBaseConfig].name : (0, import_entity.is)(table, import_sql2.SQL) ? void 0 : table[import_table.Table.Symbol.IsAlias] ? table[import_table.Table.Symbol.Name] : table[import_table.Table.Symbol.BaseName];
      }
      function getColumnNameAndConfig(a, b) {
        return {
          name: typeof a === "string" && a.length > 0 ? a : "",
          config: typeof a === "object" ? a : b
        };
      }
      function isConfig(data) {
        if (typeof data !== "object" || data === null) return false;
        if (data.constructor.name !== "Object") return false;
        if ("logger" in data) {
          const type = typeof data["logger"];
          if (type !== "boolean" && (type !== "object" || typeof data["logger"]["logQuery"] !== "function") && type !== "undefined") return false;
          return true;
        }
        if ("schema" in data) {
          const type = typeof data["schema"];
          if (type !== "object" && type !== "undefined") return false;
          return true;
        }
        if ("casing" in data) {
          const type = typeof data["casing"];
          if (type !== "string" && type !== "undefined") return false;
          return true;
        }
        if ("mode" in data) {
          if (data["mode"] !== "default" || data["mode"] !== "planetscale" || data["mode"] !== void 0) return false;
          return true;
        }
        if ("connection" in data) {
          const type = typeof data["connection"];
          if (type !== "string" && type !== "object" && type !== "undefined") return false;
          return true;
        }
        if ("client" in data) {
          const type = typeof data["client"];
          if (type !== "object" && type !== "function" && type !== "undefined") return false;
          return true;
        }
        if (Object.keys(data).length === 0) return true;
        return false;
      }
      var textDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder();
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/int.common.cjs
  var require_int_common = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/int.common.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var int_common_exports = {};
      __export(int_common_exports, {
        PgIntColumnBaseBuilder: () => PgIntColumnBaseBuilder
      });
      module.exports = __toCommonJS(int_common_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgIntColumnBaseBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgIntColumnBaseBuilder";
        generatedAlwaysAsIdentity(sequence) {
          if (sequence) {
            const { name, ...options } = sequence;
            this.config.generatedIdentity = {
              type: "always",
              sequenceName: name,
              sequenceOptions: options
            };
          } else {
            this.config.generatedIdentity = {
              type: "always"
            };
          }
          this.config.hasDefault = true;
          this.config.notNull = true;
          return this;
        }
        generatedByDefaultAsIdentity(sequence) {
          if (sequence) {
            const { name, ...options } = sequence;
            this.config.generatedIdentity = {
              type: "byDefault",
              sequenceName: name,
              sequenceOptions: options
            };
          } else {
            this.config.generatedIdentity = {
              type: "byDefault"
            };
          }
          this.config.hasDefault = true;
          this.config.notNull = true;
          return this;
        }
      };
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/bigint.cjs
  var require_bigint = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/bigint.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var bigint_exports = {};
      __export(bigint_exports, {
        PgBigInt53: () => PgBigInt53,
        PgBigInt53Builder: () => PgBigInt53Builder,
        PgBigInt64: () => PgBigInt64,
        PgBigInt64Builder: () => PgBigInt64Builder,
        bigint: () => bigint
      });
      module.exports = __toCommonJS(bigint_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var import_int_common = require_int_common();
      var PgBigInt53Builder = class extends import_int_common.PgIntColumnBaseBuilder {
        static [import_entity.entityKind] = "PgBigInt53Builder";
        constructor(name) {
          super(name, "number", "PgBigInt53");
        }
        /** @internal */
        build(table) {
          return new PgBigInt53(table, this.config);
        }
      };
      var PgBigInt53 = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBigInt53";
        getSQLType() {
          return "bigint";
        }
        mapFromDriverValue(value) {
          if (typeof value === "number") {
            return value;
          }
          return Number(value);
        }
      };
      var PgBigInt64Builder = class extends import_int_common.PgIntColumnBaseBuilder {
        static [import_entity.entityKind] = "PgBigInt64Builder";
        constructor(name) {
          super(name, "bigint", "PgBigInt64");
        }
        /** @internal */
        build(table) {
          return new PgBigInt64(
            table,
            this.config
          );
        }
      };
      var PgBigInt64 = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBigInt64";
        getSQLType() {
          return "bigint";
        }
        // eslint-disable-next-line unicorn/prefer-native-coercion-functions
        mapFromDriverValue(value) {
          return BigInt(value);
        }
      };
      function bigint(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config.mode === "number") {
          return new PgBigInt53Builder(name);
        }
        return new PgBigInt64Builder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/bigserial.cjs
  var require_bigserial = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/bigserial.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var bigserial_exports = {};
      __export(bigserial_exports, {
        PgBigSerial53: () => PgBigSerial53,
        PgBigSerial53Builder: () => PgBigSerial53Builder,
        PgBigSerial64: () => PgBigSerial64,
        PgBigSerial64Builder: () => PgBigSerial64Builder,
        bigserial: () => bigserial
      });
      module.exports = __toCommonJS(bigserial_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgBigSerial53Builder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgBigSerial53Builder";
        constructor(name) {
          super(name, "number", "PgBigSerial53");
          this.config.hasDefault = true;
          this.config.notNull = true;
        }
        /** @internal */
        build(table) {
          return new PgBigSerial53(
            table,
            this.config
          );
        }
      };
      var PgBigSerial53 = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBigSerial53";
        getSQLType() {
          return "bigserial";
        }
        mapFromDriverValue(value) {
          if (typeof value === "number") {
            return value;
          }
          return Number(value);
        }
      };
      var PgBigSerial64Builder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgBigSerial64Builder";
        constructor(name) {
          super(name, "bigint", "PgBigSerial64");
          this.config.hasDefault = true;
        }
        /** @internal */
        build(table) {
          return new PgBigSerial64(
            table,
            this.config
          );
        }
      };
      var PgBigSerial64 = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBigSerial64";
        getSQLType() {
          return "bigserial";
        }
        // eslint-disable-next-line unicorn/prefer-native-coercion-functions
        mapFromDriverValue(value) {
          return BigInt(value);
        }
      };
      function bigserial(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config.mode === "number") {
          return new PgBigSerial53Builder(name);
        }
        return new PgBigSerial64Builder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/boolean.cjs
  var require_boolean = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/boolean.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var boolean_exports = {};
      __export(boolean_exports, {
        PgBoolean: () => PgBoolean,
        PgBooleanBuilder: () => PgBooleanBuilder,
        boolean: () => boolean
      });
      module.exports = __toCommonJS(boolean_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgBooleanBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgBooleanBuilder";
        constructor(name) {
          super(name, "boolean", "PgBoolean");
        }
        /** @internal */
        build(table) {
          return new PgBoolean(table, this.config);
        }
      };
      var PgBoolean = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBoolean";
        getSQLType() {
          return "boolean";
        }
      };
      function boolean(name) {
        return new PgBooleanBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/char.cjs
  var require_char = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/char.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var char_exports = {};
      __export(char_exports, {
        PgChar: () => PgChar,
        PgCharBuilder: () => PgCharBuilder,
        char: () => char
      });
      module.exports = __toCommonJS(char_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgCharBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgCharBuilder";
        constructor(name, config) {
          super(name, "string", "PgChar");
          this.config.length = config.length;
          this.config.enumValues = config.enum;
        }
        /** @internal */
        build(table) {
          return new PgChar(
            table,
            this.config
          );
        }
      };
      var PgChar = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgChar";
        length = this.config.length;
        enumValues = this.config.enumValues;
        getSQLType() {
          return this.length === void 0 ? `char` : `char(${this.length})`;
        }
      };
      function char(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgCharBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/cidr.cjs
  var require_cidr = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/cidr.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var cidr_exports = {};
      __export(cidr_exports, {
        PgCidr: () => PgCidr,
        PgCidrBuilder: () => PgCidrBuilder,
        cidr: () => cidr
      });
      module.exports = __toCommonJS(cidr_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgCidrBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgCidrBuilder";
        constructor(name) {
          super(name, "string", "PgCidr");
        }
        /** @internal */
        build(table) {
          return new PgCidr(table, this.config);
        }
      };
      var PgCidr = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgCidr";
        getSQLType() {
          return "cidr";
        }
      };
      function cidr(name) {
        return new PgCidrBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/custom.cjs
  var require_custom = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/custom.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var custom_exports = {};
      __export(custom_exports, {
        PgCustomColumn: () => PgCustomColumn,
        PgCustomColumnBuilder: () => PgCustomColumnBuilder,
        customType: () => customType
      });
      module.exports = __toCommonJS(custom_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgCustomColumnBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgCustomColumnBuilder";
        constructor(name, fieldConfig, customTypeParams) {
          super(name, "custom", "PgCustomColumn");
          this.config.fieldConfig = fieldConfig;
          this.config.customTypeParams = customTypeParams;
        }
        /** @internal */
        build(table) {
          return new PgCustomColumn(
            table,
            this.config
          );
        }
      };
      var PgCustomColumn = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgCustomColumn";
        sqlName;
        mapTo;
        mapFrom;
        constructor(table, config) {
          super(table, config);
          this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
          this.mapTo = config.customTypeParams.toDriver;
          this.mapFrom = config.customTypeParams.fromDriver;
        }
        getSQLType() {
          return this.sqlName;
        }
        mapFromDriverValue(value) {
          return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
        }
        mapToDriverValue(value) {
          return typeof this.mapTo === "function" ? this.mapTo(value) : value;
        }
      };
      function customType(customTypeParams) {
        return (a, b) => {
          const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
          return new PgCustomColumnBuilder(name, config, customTypeParams);
        };
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/date.common.cjs
  var require_date_common = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/date.common.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var date_common_exports = {};
      __export(date_common_exports, {
        PgDateColumnBaseBuilder: () => PgDateColumnBaseBuilder
      });
      module.exports = __toCommonJS(date_common_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_common = require_common();
      var PgDateColumnBaseBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgDateColumnBaseBuilder";
        defaultNow() {
          return this.default(import_sql2.sql`now()`);
        }
      };
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/date.cjs
  var require_date = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/date.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var date_exports = {};
      __export(date_exports, {
        PgDate: () => PgDate,
        PgDateBuilder: () => PgDateBuilder,
        PgDateString: () => PgDateString,
        PgDateStringBuilder: () => PgDateStringBuilder,
        date: () => date
      });
      module.exports = __toCommonJS(date_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var import_date_common = require_date_common();
      var PgDateBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
        static [import_entity.entityKind] = "PgDateBuilder";
        constructor(name) {
          super(name, "date", "PgDate");
        }
        /** @internal */
        build(table) {
          return new PgDate(table, this.config);
        }
      };
      var PgDate = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgDate";
        getSQLType() {
          return "date";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") return new Date(value);
          return value;
        }
        mapToDriverValue(value) {
          return value.toISOString();
        }
      };
      var PgDateStringBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
        static [import_entity.entityKind] = "PgDateStringBuilder";
        constructor(name) {
          super(name, "string", "PgDateString");
        }
        /** @internal */
        build(table) {
          return new PgDateString(
            table,
            this.config
          );
        }
      };
      var PgDateString = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgDateString";
        getSQLType() {
          return "date";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") return value;
          return value.toISOString().slice(0, -14);
        }
      };
      function date(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config?.mode === "date") {
          return new PgDateBuilder(name);
        }
        return new PgDateStringBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/double-precision.cjs
  var require_double_precision = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/double-precision.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var double_precision_exports = {};
      __export(double_precision_exports, {
        PgDoublePrecision: () => PgDoublePrecision,
        PgDoublePrecisionBuilder: () => PgDoublePrecisionBuilder,
        doublePrecision: () => doublePrecision
      });
      module.exports = __toCommonJS(double_precision_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgDoublePrecisionBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgDoublePrecisionBuilder";
        constructor(name) {
          super(name, "number", "PgDoublePrecision");
        }
        /** @internal */
        build(table) {
          return new PgDoublePrecision(
            table,
            this.config
          );
        }
      };
      var PgDoublePrecision = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgDoublePrecision";
        getSQLType() {
          return "double precision";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            return Number.parseFloat(value);
          }
          return value;
        }
      };
      function doublePrecision(name) {
        return new PgDoublePrecisionBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/inet.cjs
  var require_inet = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/inet.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var inet_exports = {};
      __export(inet_exports, {
        PgInet: () => PgInet,
        PgInetBuilder: () => PgInetBuilder,
        inet: () => inet
      });
      module.exports = __toCommonJS(inet_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgInetBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgInetBuilder";
        constructor(name) {
          super(name, "string", "PgInet");
        }
        /** @internal */
        build(table) {
          return new PgInet(table, this.config);
        }
      };
      var PgInet = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgInet";
        getSQLType() {
          return "inet";
        }
      };
      function inet(name) {
        return new PgInetBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/integer.cjs
  var require_integer = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/integer.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var integer_exports = {};
      __export(integer_exports, {
        PgInteger: () => PgInteger,
        PgIntegerBuilder: () => PgIntegerBuilder,
        integer: () => integer
      });
      module.exports = __toCommonJS(integer_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var import_int_common = require_int_common();
      var PgIntegerBuilder = class extends import_int_common.PgIntColumnBaseBuilder {
        static [import_entity.entityKind] = "PgIntegerBuilder";
        constructor(name) {
          super(name, "number", "PgInteger");
        }
        /** @internal */
        build(table) {
          return new PgInteger(table, this.config);
        }
      };
      var PgInteger = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgInteger";
        getSQLType() {
          return "integer";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            return Number.parseInt(value);
          }
          return value;
        }
      };
      function integer(name) {
        return new PgIntegerBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/interval.cjs
  var require_interval = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/interval.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var interval_exports = {};
      __export(interval_exports, {
        PgInterval: () => PgInterval,
        PgIntervalBuilder: () => PgIntervalBuilder,
        interval: () => interval
      });
      module.exports = __toCommonJS(interval_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgIntervalBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgIntervalBuilder";
        constructor(name, intervalConfig) {
          super(name, "string", "PgInterval");
          this.config.intervalConfig = intervalConfig;
        }
        /** @internal */
        build(table) {
          return new PgInterval(table, this.config);
        }
      };
      var PgInterval = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgInterval";
        fields = this.config.intervalConfig.fields;
        precision = this.config.intervalConfig.precision;
        getSQLType() {
          const fields = this.fields ? ` ${this.fields}` : "";
          const precision = this.precision ? `(${this.precision})` : "";
          return `interval${fields}${precision}`;
        }
      };
      function interval(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgIntervalBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/json.cjs
  var require_json = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/json.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var json_exports = {};
      __export(json_exports, {
        PgJson: () => PgJson,
        PgJsonBuilder: () => PgJsonBuilder,
        json: () => json
      });
      module.exports = __toCommonJS(json_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgJsonBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgJsonBuilder";
        constructor(name) {
          super(name, "json", "PgJson");
        }
        /** @internal */
        build(table) {
          return new PgJson(table, this.config);
        }
      };
      var PgJson = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgJson";
        constructor(table, config) {
          super(table, config);
        }
        getSQLType() {
          return "json";
        }
        mapToDriverValue(value) {
          return JSON.stringify(value);
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          return value;
        }
      };
      function json(name) {
        return new PgJsonBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/jsonb.cjs
  var require_jsonb = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/jsonb.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var jsonb_exports = {};
      __export(jsonb_exports, {
        PgJsonb: () => PgJsonb,
        PgJsonbBuilder: () => PgJsonbBuilder,
        jsonb: () => jsonb
      });
      module.exports = __toCommonJS(jsonb_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgJsonbBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgJsonbBuilder";
        constructor(name) {
          super(name, "json", "PgJsonb");
        }
        /** @internal */
        build(table) {
          return new PgJsonb(table, this.config);
        }
      };
      var PgJsonb = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgJsonb";
        constructor(table, config) {
          super(table, config);
        }
        getSQLType() {
          return "jsonb";
        }
        mapToDriverValue(value) {
          return JSON.stringify(value);
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          return value;
        }
      };
      function jsonb(name) {
        return new PgJsonbBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/line.cjs
  var require_line = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/line.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var line_exports = {};
      __export(line_exports, {
        PgLineABC: () => PgLineABC,
        PgLineABCBuilder: () => PgLineABCBuilder,
        PgLineBuilder: () => PgLineBuilder,
        PgLineTuple: () => PgLineTuple,
        line: () => line
      });
      module.exports = __toCommonJS(line_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgLineBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgLineBuilder";
        constructor(name) {
          super(name, "array", "PgLine");
        }
        /** @internal */
        build(table) {
          return new PgLineTuple(
            table,
            this.config
          );
        }
      };
      var PgLineTuple = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgLine";
        getSQLType() {
          return "line";
        }
        mapFromDriverValue(value) {
          const [a, b, c] = value.slice(1, -1).split(",");
          return [Number.parseFloat(a), Number.parseFloat(b), Number.parseFloat(c)];
        }
        mapToDriverValue(value) {
          return `{${value[0]},${value[1]},${value[2]}}`;
        }
      };
      var PgLineABCBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgLineABCBuilder";
        constructor(name) {
          super(name, "json", "PgLineABC");
        }
        /** @internal */
        build(table) {
          return new PgLineABC(
            table,
            this.config
          );
        }
      };
      var PgLineABC = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgLineABC";
        getSQLType() {
          return "line";
        }
        mapFromDriverValue(value) {
          const [a, b, c] = value.slice(1, -1).split(",");
          return { a: Number.parseFloat(a), b: Number.parseFloat(b), c: Number.parseFloat(c) };
        }
        mapToDriverValue(value) {
          return `{${value.a},${value.b},${value.c}}`;
        }
      };
      function line(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (!config?.mode || config.mode === "tuple") {
          return new PgLineBuilder(name);
        }
        return new PgLineABCBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/macaddr.cjs
  var require_macaddr = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/macaddr.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var macaddr_exports = {};
      __export(macaddr_exports, {
        PgMacaddr: () => PgMacaddr,
        PgMacaddrBuilder: () => PgMacaddrBuilder,
        macaddr: () => macaddr
      });
      module.exports = __toCommonJS(macaddr_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgMacaddrBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgMacaddrBuilder";
        constructor(name) {
          super(name, "string", "PgMacaddr");
        }
        /** @internal */
        build(table) {
          return new PgMacaddr(table, this.config);
        }
      };
      var PgMacaddr = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgMacaddr";
        getSQLType() {
          return "macaddr";
        }
      };
      function macaddr(name) {
        return new PgMacaddrBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/macaddr8.cjs
  var require_macaddr8 = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/macaddr8.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var macaddr8_exports = {};
      __export(macaddr8_exports, {
        PgMacaddr8: () => PgMacaddr8,
        PgMacaddr8Builder: () => PgMacaddr8Builder,
        macaddr8: () => macaddr8
      });
      module.exports = __toCommonJS(macaddr8_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgMacaddr8Builder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgMacaddr8Builder";
        constructor(name) {
          super(name, "string", "PgMacaddr8");
        }
        /** @internal */
        build(table) {
          return new PgMacaddr8(table, this.config);
        }
      };
      var PgMacaddr8 = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgMacaddr8";
        getSQLType() {
          return "macaddr8";
        }
      };
      function macaddr8(name) {
        return new PgMacaddr8Builder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/numeric.cjs
  var require_numeric = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/numeric.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var numeric_exports = {};
      __export(numeric_exports, {
        PgNumeric: () => PgNumeric,
        PgNumericBigInt: () => PgNumericBigInt,
        PgNumericBigIntBuilder: () => PgNumericBigIntBuilder,
        PgNumericBuilder: () => PgNumericBuilder,
        PgNumericNumber: () => PgNumericNumber,
        PgNumericNumberBuilder: () => PgNumericNumberBuilder,
        decimal: () => decimal,
        numeric: () => numeric
      });
      module.exports = __toCommonJS(numeric_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgNumericBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgNumericBuilder";
        constructor(name, precision, scale) {
          super(name, "string", "PgNumeric");
          this.config.precision = precision;
          this.config.scale = scale;
        }
        /** @internal */
        build(table) {
          return new PgNumeric(table, this.config);
        }
      };
      var PgNumeric = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgNumeric";
        precision;
        scale;
        constructor(table, config) {
          super(table, config);
          this.precision = config.precision;
          this.scale = config.scale;
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") return value;
          return String(value);
        }
        getSQLType() {
          if (this.precision !== void 0 && this.scale !== void 0) {
            return `numeric(${this.precision}, ${this.scale})`;
          } else if (this.precision === void 0) {
            return "numeric";
          } else {
            return `numeric(${this.precision})`;
          }
        }
      };
      var PgNumericNumberBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgNumericNumberBuilder";
        constructor(name, precision, scale) {
          super(name, "number", "PgNumericNumber");
          this.config.precision = precision;
          this.config.scale = scale;
        }
        /** @internal */
        build(table) {
          return new PgNumericNumber(
            table,
            this.config
          );
        }
      };
      var PgNumericNumber = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgNumericNumber";
        precision;
        scale;
        constructor(table, config) {
          super(table, config);
          this.precision = config.precision;
          this.scale = config.scale;
        }
        mapFromDriverValue(value) {
          if (typeof value === "number") return value;
          return Number(value);
        }
        mapToDriverValue = String;
        getSQLType() {
          if (this.precision !== void 0 && this.scale !== void 0) {
            return `numeric(${this.precision}, ${this.scale})`;
          } else if (this.precision === void 0) {
            return "numeric";
          } else {
            return `numeric(${this.precision})`;
          }
        }
      };
      var PgNumericBigIntBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgNumericBigIntBuilder";
        constructor(name, precision, scale) {
          super(name, "bigint", "PgNumericBigInt");
          this.config.precision = precision;
          this.config.scale = scale;
        }
        /** @internal */
        build(table) {
          return new PgNumericBigInt(
            table,
            this.config
          );
        }
      };
      var PgNumericBigInt = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgNumericBigInt";
        precision;
        scale;
        constructor(table, config) {
          super(table, config);
          this.precision = config.precision;
          this.scale = config.scale;
        }
        mapFromDriverValue = BigInt;
        mapToDriverValue = String;
        getSQLType() {
          if (this.precision !== void 0 && this.scale !== void 0) {
            return `numeric(${this.precision}, ${this.scale})`;
          } else if (this.precision === void 0) {
            return "numeric";
          } else {
            return `numeric(${this.precision})`;
          }
        }
      };
      function numeric(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        const mode = config?.mode;
        return mode === "number" ? new PgNumericNumberBuilder(name, config?.precision, config?.scale) : mode === "bigint" ? new PgNumericBigIntBuilder(name, config?.precision, config?.scale) : new PgNumericBuilder(name, config?.precision, config?.scale);
      }
      var decimal = numeric;
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/point.cjs
  var require_point = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/point.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var point_exports = {};
      __export(point_exports, {
        PgPointObject: () => PgPointObject,
        PgPointObjectBuilder: () => PgPointObjectBuilder,
        PgPointTuple: () => PgPointTuple,
        PgPointTupleBuilder: () => PgPointTupleBuilder,
        point: () => point
      });
      module.exports = __toCommonJS(point_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgPointTupleBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgPointTupleBuilder";
        constructor(name) {
          super(name, "array", "PgPointTuple");
        }
        /** @internal */
        build(table) {
          return new PgPointTuple(
            table,
            this.config
          );
        }
      };
      var PgPointTuple = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgPointTuple";
        getSQLType() {
          return "point";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            const [x, y] = value.slice(1, -1).split(",");
            return [Number.parseFloat(x), Number.parseFloat(y)];
          }
          return [value.x, value.y];
        }
        mapToDriverValue(value) {
          return `(${value[0]},${value[1]})`;
        }
      };
      var PgPointObjectBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgPointObjectBuilder";
        constructor(name) {
          super(name, "json", "PgPointObject");
        }
        /** @internal */
        build(table) {
          return new PgPointObject(
            table,
            this.config
          );
        }
      };
      var PgPointObject = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgPointObject";
        getSQLType() {
          return "point";
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") {
            const [x, y] = value.slice(1, -1).split(",");
            return { x: Number.parseFloat(x), y: Number.parseFloat(y) };
          }
          return value;
        }
        mapToDriverValue(value) {
          return `(${value.x},${value.y})`;
        }
      };
      function point(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (!config?.mode || config.mode === "tuple") {
          return new PgPointTupleBuilder(name);
        }
        return new PgPointObjectBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.cjs
  var require_utils3 = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/postgis_extension/utils.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var utils_exports = {};
      __export(utils_exports, {
        parseEWKB: () => parseEWKB
      });
      module.exports = __toCommonJS(utils_exports);
      function hexToBytes(hex) {
        const bytes = [];
        for (let c = 0; c < hex.length; c += 2) {
          bytes.push(Number.parseInt(hex.slice(c, c + 2), 16));
        }
        return new Uint8Array(bytes);
      }
      function bytesToFloat64(bytes, offset) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        for (let i = 0; i < 8; i++) {
          view.setUint8(i, bytes[offset + i]);
        }
        return view.getFloat64(0, true);
      }
      function parseEWKB(hex) {
        const bytes = hexToBytes(hex);
        let offset = 0;
        const byteOrder = bytes[offset];
        offset += 1;
        const view = new DataView(bytes.buffer);
        const geomType = view.getUint32(offset, byteOrder === 1);
        offset += 4;
        let _srid;
        if (geomType & 536870912) {
          _srid = view.getUint32(offset, byteOrder === 1);
          offset += 4;
        }
        if ((geomType & 65535) === 1) {
          const x = bytesToFloat64(bytes, offset);
          offset += 8;
          const y = bytesToFloat64(bytes, offset);
          offset += 8;
          return [x, y];
        }
        throw new Error("Unsupported geometry type");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.cjs
  var require_geometry = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/postgis_extension/geometry.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var geometry_exports = {};
      __export(geometry_exports, {
        PgGeometry: () => PgGeometry,
        PgGeometryBuilder: () => PgGeometryBuilder,
        PgGeometryObject: () => PgGeometryObject,
        PgGeometryObjectBuilder: () => PgGeometryObjectBuilder,
        geometry: () => geometry
      });
      module.exports = __toCommonJS(geometry_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var import_utils2 = require_utils3();
      var PgGeometryBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgGeometryBuilder";
        constructor(name) {
          super(name, "array", "PgGeometry");
        }
        /** @internal */
        build(table) {
          return new PgGeometry(
            table,
            this.config
          );
        }
      };
      var PgGeometry = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgGeometry";
        getSQLType() {
          return "geometry(point)";
        }
        mapFromDriverValue(value) {
          return (0, import_utils2.parseEWKB)(value);
        }
        mapToDriverValue(value) {
          return `point(${value[0]} ${value[1]})`;
        }
      };
      var PgGeometryObjectBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgGeometryObjectBuilder";
        constructor(name) {
          super(name, "json", "PgGeometryObject");
        }
        /** @internal */
        build(table) {
          return new PgGeometryObject(
            table,
            this.config
          );
        }
      };
      var PgGeometryObject = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgGeometryObject";
        getSQLType() {
          return "geometry(point)";
        }
        mapFromDriverValue(value) {
          const parsed = (0, import_utils2.parseEWKB)(value);
          return { x: parsed[0], y: parsed[1] };
        }
        mapToDriverValue(value) {
          return `point(${value.x} ${value.y})`;
        }
      };
      function geometry(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (!config?.mode || config.mode === "tuple") {
          return new PgGeometryBuilder(name);
        }
        return new PgGeometryObjectBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/real.cjs
  var require_real = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/real.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var real_exports = {};
      __export(real_exports, {
        PgReal: () => PgReal,
        PgRealBuilder: () => PgRealBuilder,
        real: () => real
      });
      module.exports = __toCommonJS(real_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgRealBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgRealBuilder";
        constructor(name, length) {
          super(name, "number", "PgReal");
          this.config.length = length;
        }
        /** @internal */
        build(table) {
          return new PgReal(table, this.config);
        }
      };
      var PgReal = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgReal";
        constructor(table, config) {
          super(table, config);
        }
        getSQLType() {
          return "real";
        }
        mapFromDriverValue = (value) => {
          if (typeof value === "string") {
            return Number.parseFloat(value);
          }
          return value;
        };
      };
      function real(name) {
        return new PgRealBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/serial.cjs
  var require_serial = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/serial.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var serial_exports = {};
      __export(serial_exports, {
        PgSerial: () => PgSerial,
        PgSerialBuilder: () => PgSerialBuilder,
        serial: () => serial
      });
      module.exports = __toCommonJS(serial_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgSerialBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgSerialBuilder";
        constructor(name) {
          super(name, "number", "PgSerial");
          this.config.hasDefault = true;
          this.config.notNull = true;
        }
        /** @internal */
        build(table) {
          return new PgSerial(table, this.config);
        }
      };
      var PgSerial = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgSerial";
        getSQLType() {
          return "serial";
        }
      };
      function serial(name) {
        return new PgSerialBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/smallint.cjs
  var require_smallint = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/smallint.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var smallint_exports = {};
      __export(smallint_exports, {
        PgSmallInt: () => PgSmallInt,
        PgSmallIntBuilder: () => PgSmallIntBuilder,
        smallint: () => smallint
      });
      module.exports = __toCommonJS(smallint_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var import_int_common = require_int_common();
      var PgSmallIntBuilder = class extends import_int_common.PgIntColumnBaseBuilder {
        static [import_entity.entityKind] = "PgSmallIntBuilder";
        constructor(name) {
          super(name, "number", "PgSmallInt");
        }
        /** @internal */
        build(table) {
          return new PgSmallInt(table, this.config);
        }
      };
      var PgSmallInt = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgSmallInt";
        getSQLType() {
          return "smallint";
        }
        mapFromDriverValue = (value) => {
          if (typeof value === "string") {
            return Number(value);
          }
          return value;
        };
      };
      function smallint(name) {
        return new PgSmallIntBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/smallserial.cjs
  var require_smallserial = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/smallserial.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var smallserial_exports = {};
      __export(smallserial_exports, {
        PgSmallSerial: () => PgSmallSerial,
        PgSmallSerialBuilder: () => PgSmallSerialBuilder,
        smallserial: () => smallserial
      });
      module.exports = __toCommonJS(smallserial_exports);
      var import_entity = require_entity();
      var import_common = require_common();
      var PgSmallSerialBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgSmallSerialBuilder";
        constructor(name) {
          super(name, "number", "PgSmallSerial");
          this.config.hasDefault = true;
          this.config.notNull = true;
        }
        /** @internal */
        build(table) {
          return new PgSmallSerial(
            table,
            this.config
          );
        }
      };
      var PgSmallSerial = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgSmallSerial";
        getSQLType() {
          return "smallserial";
        }
      };
      function smallserial(name) {
        return new PgSmallSerialBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/text.cjs
  var require_text = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/text.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var text_exports = {};
      __export(text_exports, {
        PgText: () => PgText,
        PgTextBuilder: () => PgTextBuilder,
        text: () => text
      });
      module.exports = __toCommonJS(text_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgTextBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgTextBuilder";
        constructor(name, config) {
          super(name, "string", "PgText");
          this.config.enumValues = config.enum;
        }
        /** @internal */
        build(table) {
          return new PgText(table, this.config);
        }
      };
      var PgText = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgText";
        enumValues = this.config.enumValues;
        getSQLType() {
          return "text";
        }
      };
      function text(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgTextBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/time.cjs
  var require_time = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/time.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var time_exports = {};
      __export(time_exports, {
        PgTime: () => PgTime,
        PgTimeBuilder: () => PgTimeBuilder,
        time: () => time
      });
      module.exports = __toCommonJS(time_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var import_date_common = require_date_common();
      var PgTimeBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
        constructor(name, withTimezone, precision) {
          super(name, "string", "PgTime");
          this.withTimezone = withTimezone;
          this.precision = precision;
          this.config.withTimezone = withTimezone;
          this.config.precision = precision;
        }
        static [import_entity.entityKind] = "PgTimeBuilder";
        /** @internal */
        build(table) {
          return new PgTime(table, this.config);
        }
      };
      var PgTime = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgTime";
        withTimezone;
        precision;
        constructor(table, config) {
          super(table, config);
          this.withTimezone = config.withTimezone;
          this.precision = config.precision;
        }
        getSQLType() {
          const precision = this.precision === void 0 ? "" : `(${this.precision})`;
          return `time${precision}${this.withTimezone ? " with time zone" : ""}`;
        }
      };
      function time(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgTimeBuilder(name, config.withTimezone ?? false, config.precision);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/timestamp.cjs
  var require_timestamp = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/timestamp.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var timestamp_exports = {};
      __export(timestamp_exports, {
        PgTimestamp: () => PgTimestamp,
        PgTimestampBuilder: () => PgTimestampBuilder,
        PgTimestampString: () => PgTimestampString,
        PgTimestampStringBuilder: () => PgTimestampStringBuilder,
        timestamp: () => timestamp
      });
      module.exports = __toCommonJS(timestamp_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var import_date_common = require_date_common();
      var PgTimestampBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
        static [import_entity.entityKind] = "PgTimestampBuilder";
        constructor(name, withTimezone, precision) {
          super(name, "date", "PgTimestamp");
          this.config.withTimezone = withTimezone;
          this.config.precision = precision;
        }
        /** @internal */
        build(table) {
          return new PgTimestamp(table, this.config);
        }
      };
      var PgTimestamp = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgTimestamp";
        withTimezone;
        precision;
        constructor(table, config) {
          super(table, config);
          this.withTimezone = config.withTimezone;
          this.precision = config.precision;
        }
        getSQLType() {
          const precision = this.precision === void 0 ? "" : ` (${this.precision})`;
          return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") return new Date(this.withTimezone ? value : value + "+0000");
          return value;
        }
        mapToDriverValue = (value) => {
          return value.toISOString();
        };
      };
      var PgTimestampStringBuilder = class extends import_date_common.PgDateColumnBaseBuilder {
        static [import_entity.entityKind] = "PgTimestampStringBuilder";
        constructor(name, withTimezone, precision) {
          super(name, "string", "PgTimestampString");
          this.config.withTimezone = withTimezone;
          this.config.precision = precision;
        }
        /** @internal */
        build(table) {
          return new PgTimestampString(
            table,
            this.config
          );
        }
      };
      var PgTimestampString = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgTimestampString";
        withTimezone;
        precision;
        constructor(table, config) {
          super(table, config);
          this.withTimezone = config.withTimezone;
          this.precision = config.precision;
        }
        getSQLType() {
          const precision = this.precision === void 0 ? "" : `(${this.precision})`;
          return `timestamp${precision}${this.withTimezone ? " with time zone" : ""}`;
        }
        mapFromDriverValue(value) {
          if (typeof value === "string") return value;
          const shortened = value.toISOString().slice(0, -1).replace("T", " ");
          if (this.withTimezone) {
            const offset = value.getTimezoneOffset();
            const sign = offset <= 0 ? "+" : "-";
            return `${shortened}${sign}${Math.floor(Math.abs(offset) / 60).toString().padStart(2, "0")}`;
          }
          return shortened;
        }
      };
      function timestamp(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config?.mode === "string") {
          return new PgTimestampStringBuilder(name, config.withTimezone ?? false, config.precision);
        }
        return new PgTimestampBuilder(name, config?.withTimezone ?? false, config?.precision);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/uuid.cjs
  var require_uuid = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/uuid.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var uuid_exports = {};
      __export(uuid_exports, {
        PgUUID: () => PgUUID,
        PgUUIDBuilder: () => PgUUIDBuilder,
        uuid: () => uuid
      });
      module.exports = __toCommonJS(uuid_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_common = require_common();
      var PgUUIDBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgUUIDBuilder";
        constructor(name) {
          super(name, "string", "PgUUID");
        }
        /**
         * Adds `default gen_random_uuid()` to the column definition.
         */
        defaultRandom() {
          return this.default(import_sql2.sql`gen_random_uuid()`);
        }
        /** @internal */
        build(table) {
          return new PgUUID(table, this.config);
        }
      };
      var PgUUID = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgUUID";
        getSQLType() {
          return "uuid";
        }
      };
      function uuid(name) {
        return new PgUUIDBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/varchar.cjs
  var require_varchar = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/varchar.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var varchar_exports = {};
      __export(varchar_exports, {
        PgVarchar: () => PgVarchar,
        PgVarcharBuilder: () => PgVarcharBuilder,
        varchar: () => varchar
      });
      module.exports = __toCommonJS(varchar_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgVarcharBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgVarcharBuilder";
        constructor(name, config) {
          super(name, "string", "PgVarchar");
          this.config.length = config.length;
          this.config.enumValues = config.enum;
        }
        /** @internal */
        build(table) {
          return new PgVarchar(
            table,
            this.config
          );
        }
      };
      var PgVarchar = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgVarchar";
        length = this.config.length;
        enumValues = this.config.enumValues;
        getSQLType() {
          return this.length === void 0 ? `varchar` : `varchar(${this.length})`;
        }
      };
      function varchar(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgVarcharBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.cjs
  var require_bit = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/vector_extension/bit.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var bit_exports = {};
      __export(bit_exports, {
        PgBinaryVector: () => PgBinaryVector,
        PgBinaryVectorBuilder: () => PgBinaryVectorBuilder,
        bit: () => bit
      });
      module.exports = __toCommonJS(bit_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgBinaryVectorBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgBinaryVectorBuilder";
        constructor(name, config) {
          super(name, "string", "PgBinaryVector");
          this.config.dimensions = config.dimensions;
        }
        /** @internal */
        build(table) {
          return new PgBinaryVector(
            table,
            this.config
          );
        }
      };
      var PgBinaryVector = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgBinaryVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `bit(${this.dimensions})`;
        }
      };
      function bit(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgBinaryVectorBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.cjs
  var require_halfvec = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/vector_extension/halfvec.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var halfvec_exports = {};
      __export(halfvec_exports, {
        PgHalfVector: () => PgHalfVector,
        PgHalfVectorBuilder: () => PgHalfVectorBuilder,
        halfvec: () => halfvec
      });
      module.exports = __toCommonJS(halfvec_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgHalfVectorBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgHalfVectorBuilder";
        constructor(name, config) {
          super(name, "array", "PgHalfVector");
          this.config.dimensions = config.dimensions;
        }
        /** @internal */
        build(table) {
          return new PgHalfVector(
            table,
            this.config
          );
        }
      };
      var PgHalfVector = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgHalfVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `halfvec(${this.dimensions})`;
        }
        mapToDriverValue(value) {
          return JSON.stringify(value);
        }
        mapFromDriverValue(value) {
          return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
        }
      };
      function halfvec(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgHalfVectorBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.cjs
  var require_sparsevec = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/vector_extension/sparsevec.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var sparsevec_exports = {};
      __export(sparsevec_exports, {
        PgSparseVector: () => PgSparseVector,
        PgSparseVectorBuilder: () => PgSparseVectorBuilder,
        sparsevec: () => sparsevec
      });
      module.exports = __toCommonJS(sparsevec_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgSparseVectorBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgSparseVectorBuilder";
        constructor(name, config) {
          super(name, "string", "PgSparseVector");
          this.config.dimensions = config.dimensions;
        }
        /** @internal */
        build(table) {
          return new PgSparseVector(
            table,
            this.config
          );
        }
      };
      var PgSparseVector = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgSparseVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `sparsevec(${this.dimensions})`;
        }
      };
      function sparsevec(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgSparseVectorBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.cjs
  var require_vector = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/vector_extension/vector.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var vector_exports = {};
      __export(vector_exports, {
        PgVector: () => PgVector,
        PgVectorBuilder: () => PgVectorBuilder,
        vector: () => vector
      });
      module.exports = __toCommonJS(vector_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common();
      var PgVectorBuilder = class extends import_common.PgColumnBuilder {
        static [import_entity.entityKind] = "PgVectorBuilder";
        constructor(name, config) {
          super(name, "array", "PgVector");
          this.config.dimensions = config.dimensions;
        }
        /** @internal */
        build(table) {
          return new PgVector(
            table,
            this.config
          );
        }
      };
      var PgVector = class extends import_common.PgColumn {
        static [import_entity.entityKind] = "PgVector";
        dimensions = this.config.dimensions;
        getSQLType() {
          return `vector(${this.dimensions})`;
        }
        mapToDriverValue(value) {
          return JSON.stringify(value);
        }
        mapFromDriverValue(value) {
          return value.slice(1, -1).split(",").map((v) => Number.parseFloat(v));
        }
      };
      function vector(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        return new PgVectorBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/columns/all.cjs
  var require_all = __commonJS({
    "node_modules/drizzle-orm/pg-core/columns/all.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var all_exports = {};
      __export(all_exports, {
        getPgColumnBuilders: () => getPgColumnBuilders
      });
      module.exports = __toCommonJS(all_exports);
      var import_bigint = require_bigint();
      var import_bigserial = require_bigserial();
      var import_boolean = require_boolean();
      var import_char = require_char();
      var import_cidr = require_cidr();
      var import_custom = require_custom();
      var import_date = require_date();
      var import_double_precision = require_double_precision();
      var import_inet = require_inet();
      var import_integer = require_integer();
      var import_interval = require_interval();
      var import_json = require_json();
      var import_jsonb = require_jsonb();
      var import_line = require_line();
      var import_macaddr = require_macaddr();
      var import_macaddr8 = require_macaddr8();
      var import_numeric = require_numeric();
      var import_point = require_point();
      var import_geometry = require_geometry();
      var import_real = require_real();
      var import_serial = require_serial();
      var import_smallint = require_smallint();
      var import_smallserial = require_smallserial();
      var import_text = require_text();
      var import_time = require_time();
      var import_timestamp = require_timestamp();
      var import_uuid = require_uuid();
      var import_varchar = require_varchar();
      var import_bit = require_bit();
      var import_halfvec = require_halfvec();
      var import_sparsevec = require_sparsevec();
      var import_vector = require_vector();
      function getPgColumnBuilders() {
        return {
          bigint: import_bigint.bigint,
          bigserial: import_bigserial.bigserial,
          boolean: import_boolean.boolean,
          char: import_char.char,
          cidr: import_cidr.cidr,
          customType: import_custom.customType,
          date: import_date.date,
          doublePrecision: import_double_precision.doublePrecision,
          inet: import_inet.inet,
          integer: import_integer.integer,
          interval: import_interval.interval,
          json: import_json.json,
          jsonb: import_jsonb.jsonb,
          line: import_line.line,
          macaddr: import_macaddr.macaddr,
          macaddr8: import_macaddr8.macaddr8,
          numeric: import_numeric.numeric,
          point: import_point.point,
          geometry: import_geometry.geometry,
          real: import_real.real,
          serial: import_serial.serial,
          smallint: import_smallint.smallint,
          smallserial: import_smallserial.smallserial,
          text: import_text.text,
          time: import_time.time,
          timestamp: import_timestamp.timestamp,
          uuid: import_uuid.uuid,
          varchar: import_varchar.varchar,
          bit: import_bit.bit,
          halfvec: import_halfvec.halfvec,
          sparsevec: import_sparsevec.sparsevec,
          vector: import_vector.vector
        };
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/table.cjs
  var require_table2 = __commonJS({
    "node_modules/drizzle-orm/pg-core/table.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var table_exports = {};
      __export(table_exports, {
        EnableRLS: () => EnableRLS,
        InlineForeignKeys: () => InlineForeignKeys,
        PgTable: () => PgTable,
        pgTable: () => pgTable,
        pgTableCreator: () => pgTableCreator,
        pgTableWithSchema: () => pgTableWithSchema
      });
      module.exports = __toCommonJS(table_exports);
      var import_entity = require_entity();
      var import_table = require_table();
      var import_all = require_all();
      var InlineForeignKeys = Symbol.for("drizzle:PgInlineForeignKeys");
      var EnableRLS = Symbol.for("drizzle:EnableRLS");
      var PgTable = class extends import_table.Table {
        static [import_entity.entityKind] = "PgTable";
        /** @internal */
        static Symbol = Object.assign({}, import_table.Table.Symbol, {
          InlineForeignKeys,
          EnableRLS
        });
        /**@internal */
        [InlineForeignKeys] = [];
        /** @internal */
        [EnableRLS] = false;
        /** @internal */
        [import_table.Table.Symbol.ExtraConfigBuilder] = void 0;
        /** @internal */
        [import_table.Table.Symbol.ExtraConfigColumns] = {};
      };
      function pgTableWithSchema(name, columns, extraConfig, schema, baseName = name) {
        const rawTable = new PgTable(name, schema, baseName);
        const parsedColumns = typeof columns === "function" ? columns((0, import_all.getPgColumnBuilders)()) : columns;
        const builtColumns = Object.fromEntries(
          Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
            const colBuilder = colBuilderBase;
            colBuilder.setName(name2);
            const column = colBuilder.build(rawTable);
            rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
            return [name2, column];
          })
        );
        const builtColumnsForExtraConfig = Object.fromEntries(
          Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
            const colBuilder = colBuilderBase;
            colBuilder.setName(name2);
            const column = colBuilder.buildExtraConfigColumn(rawTable);
            return [name2, column];
          })
        );
        const table = Object.assign(rawTable, builtColumns);
        table[import_table.Table.Symbol.Columns] = builtColumns;
        table[import_table.Table.Symbol.ExtraConfigColumns] = builtColumnsForExtraConfig;
        if (extraConfig) {
          table[PgTable.Symbol.ExtraConfigBuilder] = extraConfig;
        }
        return Object.assign(table, {
          enableRLS: () => {
            table[PgTable.Symbol.EnableRLS] = true;
            return table;
          }
        });
      }
      var pgTable = (name, columns, extraConfig) => {
        return pgTableWithSchema(name, columns, extraConfig, void 0);
      };
      function pgTableCreator(customizeTableName) {
        return (name, columns, extraConfig) => {
          return pgTableWithSchema(customizeTableName(name), columns, extraConfig, void 0, name);
        };
      }
    }
  });

  // node_modules/drizzle-orm/pg-core/primary-keys.cjs
  var require_primary_keys = __commonJS({
    "node_modules/drizzle-orm/pg-core/primary-keys.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var primary_keys_exports = {};
      __export(primary_keys_exports, {
        PrimaryKey: () => PrimaryKey,
        PrimaryKeyBuilder: () => PrimaryKeyBuilder,
        primaryKey: () => primaryKey
      });
      module.exports = __toCommonJS(primary_keys_exports);
      var import_entity = require_entity();
      var import_table = require_table2();
      function primaryKey(...config) {
        if (config[0].columns) {
          return new PrimaryKeyBuilder(config[0].columns, config[0].name);
        }
        return new PrimaryKeyBuilder(config);
      }
      var PrimaryKeyBuilder = class {
        static [import_entity.entityKind] = "PgPrimaryKeyBuilder";
        /** @internal */
        columns;
        /** @internal */
        name;
        constructor(columns, name) {
          this.columns = columns;
          this.name = name;
        }
        /** @internal */
        build(table) {
          return new PrimaryKey(table, this.columns, this.name);
        }
      };
      var PrimaryKey = class {
        constructor(table, columns, name) {
          this.table = table;
          this.columns = columns;
          this.name = name;
        }
        static [import_entity.entityKind] = "PgPrimaryKey";
        columns;
        name;
        getName() {
          return this.name ?? `${this.table[import_table.PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sql/expressions/conditions.cjs
  var require_conditions = __commonJS({
    "node_modules/drizzle-orm/sql/expressions/conditions.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var conditions_exports = {};
      __export(conditions_exports, {
        and: () => and,
        arrayContained: () => arrayContained,
        arrayContains: () => arrayContains,
        arrayOverlaps: () => arrayOverlaps,
        between: () => between,
        bindIfParam: () => bindIfParam,
        eq: () => eq,
        exists: () => exists,
        gt: () => gt,
        gte: () => gte,
        ilike: () => ilike,
        inArray: () => inArray,
        isNotNull: () => isNotNull,
        isNull: () => isNull,
        like: () => like,
        lt: () => lt,
        lte: () => lte,
        ne: () => ne,
        not: () => not,
        notBetween: () => notBetween,
        notExists: () => notExists,
        notIlike: () => notIlike,
        notInArray: () => notInArray,
        notLike: () => notLike,
        or: () => or
      });
      module.exports = __toCommonJS(conditions_exports);
      var import_column = require_column();
      var import_entity = require_entity();
      var import_table = require_table();
      var import_sql2 = require_sql();
      function bindIfParam(value, column) {
        if ((0, import_sql2.isDriverValueEncoder)(column) && !(0, import_sql2.isSQLWrapper)(value) && !(0, import_entity.is)(value, import_sql2.Param) && !(0, import_entity.is)(value, import_sql2.Placeholder) && !(0, import_entity.is)(value, import_column.Column) && !(0, import_entity.is)(value, import_table.Table) && !(0, import_entity.is)(value, import_sql2.View)) {
          return new import_sql2.Param(value, column);
        }
        return value;
      }
      var eq = (left, right) => {
        return import_sql2.sql`${left} = ${bindIfParam(right, left)}`;
      };
      var ne = (left, right) => {
        return import_sql2.sql`${left} <> ${bindIfParam(right, left)}`;
      };
      function and(...unfilteredConditions) {
        const conditions = unfilteredConditions.filter(
          (c) => c !== void 0
        );
        if (conditions.length === 0) {
          return void 0;
        }
        if (conditions.length === 1) {
          return new import_sql2.SQL(conditions);
        }
        return new import_sql2.SQL([
          new import_sql2.StringChunk("("),
          import_sql2.sql.join(conditions, new import_sql2.StringChunk(" and ")),
          new import_sql2.StringChunk(")")
        ]);
      }
      function or(...unfilteredConditions) {
        const conditions = unfilteredConditions.filter(
          (c) => c !== void 0
        );
        if (conditions.length === 0) {
          return void 0;
        }
        if (conditions.length === 1) {
          return new import_sql2.SQL(conditions);
        }
        return new import_sql2.SQL([
          new import_sql2.StringChunk("("),
          import_sql2.sql.join(conditions, new import_sql2.StringChunk(" or ")),
          new import_sql2.StringChunk(")")
        ]);
      }
      function not(condition) {
        return import_sql2.sql`not ${condition}`;
      }
      var gt = (left, right) => {
        return import_sql2.sql`${left} > ${bindIfParam(right, left)}`;
      };
      var gte = (left, right) => {
        return import_sql2.sql`${left} >= ${bindIfParam(right, left)}`;
      };
      var lt = (left, right) => {
        return import_sql2.sql`${left} < ${bindIfParam(right, left)}`;
      };
      var lte = (left, right) => {
        return import_sql2.sql`${left} <= ${bindIfParam(right, left)}`;
      };
      function inArray(column, values) {
        if (Array.isArray(values)) {
          if (values.length === 0) {
            return import_sql2.sql`false`;
          }
          return import_sql2.sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
        }
        return import_sql2.sql`${column} in ${bindIfParam(values, column)}`;
      }
      function notInArray(column, values) {
        if (Array.isArray(values)) {
          if (values.length === 0) {
            return import_sql2.sql`true`;
          }
          return import_sql2.sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
        }
        return import_sql2.sql`${column} not in ${bindIfParam(values, column)}`;
      }
      function isNull(value) {
        return import_sql2.sql`${value} is null`;
      }
      function isNotNull(value) {
        return import_sql2.sql`${value} is not null`;
      }
      function exists(subquery) {
        return import_sql2.sql`exists ${subquery}`;
      }
      function notExists(subquery) {
        return import_sql2.sql`not exists ${subquery}`;
      }
      function between(column, min, max) {
        return import_sql2.sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
          max,
          column
        )}`;
      }
      function notBetween(column, min, max) {
        return import_sql2.sql`${column} not between ${bindIfParam(
          min,
          column
        )} and ${bindIfParam(max, column)}`;
      }
      function like(column, value) {
        return import_sql2.sql`${column} like ${value}`;
      }
      function notLike(column, value) {
        return import_sql2.sql`${column} not like ${value}`;
      }
      function ilike(column, value) {
        return import_sql2.sql`${column} ilike ${value}`;
      }
      function notIlike(column, value) {
        return import_sql2.sql`${column} not ilike ${value}`;
      }
      function arrayContains(column, values) {
        if (Array.isArray(values)) {
          if (values.length === 0) {
            throw new Error("arrayContains requires at least one value");
          }
          const array = import_sql2.sql`${bindIfParam(values, column)}`;
          return import_sql2.sql`${column} @> ${array}`;
        }
        return import_sql2.sql`${column} @> ${bindIfParam(values, column)}`;
      }
      function arrayContained(column, values) {
        if (Array.isArray(values)) {
          if (values.length === 0) {
            throw new Error("arrayContained requires at least one value");
          }
          const array = import_sql2.sql`${bindIfParam(values, column)}`;
          return import_sql2.sql`${column} <@ ${array}`;
        }
        return import_sql2.sql`${column} <@ ${bindIfParam(values, column)}`;
      }
      function arrayOverlaps(column, values) {
        if (Array.isArray(values)) {
          if (values.length === 0) {
            throw new Error("arrayOverlaps requires at least one value");
          }
          const array = import_sql2.sql`${bindIfParam(values, column)}`;
          return import_sql2.sql`${column} && ${array}`;
        }
        return import_sql2.sql`${column} && ${bindIfParam(values, column)}`;
      }
    }
  });

  // node_modules/drizzle-orm/sql/expressions/select.cjs
  var require_select = __commonJS({
    "node_modules/drizzle-orm/sql/expressions/select.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc2) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var select_exports = {};
      __export(select_exports, {
        asc: () => asc,
        desc: () => desc
      });
      module.exports = __toCommonJS(select_exports);
      var import_sql2 = require_sql();
      function asc(column) {
        return import_sql2.sql`${column} asc`;
      }
      function desc(column) {
        return import_sql2.sql`${column} desc`;
      }
    }
  });

  // node_modules/drizzle-orm/sql/expressions/index.cjs
  var require_expressions = __commonJS({
    "node_modules/drizzle-orm/sql/expressions/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var expressions_exports = {};
      module.exports = __toCommonJS(expressions_exports);
      __reExport(expressions_exports, require_conditions(), module.exports);
      __reExport(expressions_exports, require_select(), module.exports);
    }
  });

  // node_modules/drizzle-orm/relations.cjs
  var require_relations = __commonJS({
    "node_modules/drizzle-orm/relations.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc2) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc2(from, key)) || desc2.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var relations_exports = {};
      __export(relations_exports, {
        Many: () => Many,
        One: () => One,
        Relation: () => Relation,
        Relations: () => Relations,
        createMany: () => createMany,
        createOne: () => createOne,
        createTableRelationsHelpers: () => createTableRelationsHelpers,
        extractTablesRelationalConfig: () => extractTablesRelationalConfig,
        getOperators: () => getOperators,
        getOrderByOperators: () => getOrderByOperators,
        mapRelationalRow: () => mapRelationalRow,
        normalizeRelation: () => normalizeRelation,
        relations: () => relations
      });
      module.exports = __toCommonJS(relations_exports);
      var import_table = require_table();
      var import_column = require_column();
      var import_entity = require_entity();
      var import_primary_keys = require_primary_keys();
      var import_expressions = require_expressions();
      var import_sql2 = require_sql();
      var Relation = class {
        constructor(sourceTable, referencedTable, relationName) {
          this.sourceTable = sourceTable;
          this.referencedTable = referencedTable;
          this.relationName = relationName;
          this.referencedTableName = referencedTable[import_table.Table.Symbol.Name];
        }
        static [import_entity.entityKind] = "Relation";
        referencedTableName;
        fieldName;
      };
      var Relations = class {
        constructor(table, config) {
          this.table = table;
          this.config = config;
        }
        static [import_entity.entityKind] = "Relations";
      };
      var One = class _One extends Relation {
        constructor(sourceTable, referencedTable, config, isNullable) {
          super(sourceTable, referencedTable, config?.relationName);
          this.config = config;
          this.isNullable = isNullable;
        }
        static [import_entity.entityKind] = "One";
        withFieldName(fieldName) {
          const relation = new _One(
            this.sourceTable,
            this.referencedTable,
            this.config,
            this.isNullable
          );
          relation.fieldName = fieldName;
          return relation;
        }
      };
      var Many = class _Many extends Relation {
        constructor(sourceTable, referencedTable, config) {
          super(sourceTable, referencedTable, config?.relationName);
          this.config = config;
        }
        static [import_entity.entityKind] = "Many";
        withFieldName(fieldName) {
          const relation = new _Many(
            this.sourceTable,
            this.referencedTable,
            this.config
          );
          relation.fieldName = fieldName;
          return relation;
        }
      };
      function getOperators() {
        return {
          and: import_expressions.and,
          between: import_expressions.between,
          eq: import_expressions.eq,
          exists: import_expressions.exists,
          gt: import_expressions.gt,
          gte: import_expressions.gte,
          ilike: import_expressions.ilike,
          inArray: import_expressions.inArray,
          isNull: import_expressions.isNull,
          isNotNull: import_expressions.isNotNull,
          like: import_expressions.like,
          lt: import_expressions.lt,
          lte: import_expressions.lte,
          ne: import_expressions.ne,
          not: import_expressions.not,
          notBetween: import_expressions.notBetween,
          notExists: import_expressions.notExists,
          notLike: import_expressions.notLike,
          notIlike: import_expressions.notIlike,
          notInArray: import_expressions.notInArray,
          or: import_expressions.or,
          sql: import_sql2.sql
        };
      }
      function getOrderByOperators() {
        return {
          sql: import_sql2.sql,
          asc: import_expressions.asc,
          desc: import_expressions.desc
        };
      }
      function extractTablesRelationalConfig(schema, configHelpers) {
        if (Object.keys(schema).length === 1 && "default" in schema && !(0, import_entity.is)(schema["default"], import_table.Table)) {
          schema = schema["default"];
        }
        const tableNamesMap = {};
        const relationsBuffer = {};
        const tablesConfig = {};
        for (const [key, value] of Object.entries(schema)) {
          if ((0, import_entity.is)(value, import_table.Table)) {
            const dbName = (0, import_table.getTableUniqueName)(value);
            const bufferedRelations = relationsBuffer[dbName];
            tableNamesMap[dbName] = key;
            tablesConfig[key] = {
              tsName: key,
              dbName: value[import_table.Table.Symbol.Name],
              schema: value[import_table.Table.Symbol.Schema],
              columns: value[import_table.Table.Symbol.Columns],
              relations: bufferedRelations?.relations ?? {},
              primaryKey: bufferedRelations?.primaryKey ?? []
            };
            for (const column of Object.values(
              value[import_table.Table.Symbol.Columns]
            )) {
              if (column.primary) {
                tablesConfig[key].primaryKey.push(column);
              }
            }
            const extraConfig = value[import_table.Table.Symbol.ExtraConfigBuilder]?.(value[import_table.Table.Symbol.ExtraConfigColumns]);
            if (extraConfig) {
              for (const configEntry of Object.values(extraConfig)) {
                if ((0, import_entity.is)(configEntry, import_primary_keys.PrimaryKeyBuilder)) {
                  tablesConfig[key].primaryKey.push(...configEntry.columns);
                }
              }
            }
          } else if ((0, import_entity.is)(value, Relations)) {
            const dbName = (0, import_table.getTableUniqueName)(value.table);
            const tableName = tableNamesMap[dbName];
            const relations2 = value.config(
              configHelpers(value.table)
            );
            let primaryKey;
            for (const [relationName, relation] of Object.entries(relations2)) {
              if (tableName) {
                const tableConfig = tablesConfig[tableName];
                tableConfig.relations[relationName] = relation;
                if (primaryKey) {
                  tableConfig.primaryKey.push(...primaryKey);
                }
              } else {
                if (!(dbName in relationsBuffer)) {
                  relationsBuffer[dbName] = {
                    relations: {},
                    primaryKey
                  };
                }
                relationsBuffer[dbName].relations[relationName] = relation;
              }
            }
          }
        }
        return { tables: tablesConfig, tableNamesMap };
      }
      function relations(table, relations2) {
        return new Relations(
          table,
          (helpers) => Object.fromEntries(
            Object.entries(relations2(helpers)).map(([key, value]) => [
              key,
              value.withFieldName(key)
            ])
          )
        );
      }
      function createOne(sourceTable) {
        return function one(table, config) {
          return new One(
            sourceTable,
            table,
            config,
            config?.fields.reduce((res, f) => res && f.notNull, true) ?? false
          );
        };
      }
      function createMany(sourceTable) {
        return function many(referencedTable, config) {
          return new Many(sourceTable, referencedTable, config);
        };
      }
      function normalizeRelation(schema, tableNamesMap, relation) {
        if ((0, import_entity.is)(relation, One) && relation.config) {
          return {
            fields: relation.config.fields,
            references: relation.config.references
          };
        }
        const referencedTableTsName = tableNamesMap[(0, import_table.getTableUniqueName)(relation.referencedTable)];
        if (!referencedTableTsName) {
          throw new Error(
            `Table "${relation.referencedTable[import_table.Table.Symbol.Name]}" not found in schema`
          );
        }
        const referencedTableConfig = schema[referencedTableTsName];
        if (!referencedTableConfig) {
          throw new Error(`Table "${referencedTableTsName}" not found in schema`);
        }
        const sourceTable = relation.sourceTable;
        const sourceTableTsName = tableNamesMap[(0, import_table.getTableUniqueName)(sourceTable)];
        if (!sourceTableTsName) {
          throw new Error(
            `Table "${sourceTable[import_table.Table.Symbol.Name]}" not found in schema`
          );
        }
        const reverseRelations = [];
        for (const referencedTableRelation of Object.values(
          referencedTableConfig.relations
        )) {
          if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
            reverseRelations.push(referencedTableRelation);
          }
        }
        if (reverseRelations.length > 1) {
          throw relation.relationName ? new Error(
            `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
          ) : new Error(
            `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[import_table.Table.Symbol.Name]}". Please specify relation name`
          );
        }
        if (reverseRelations[0] && (0, import_entity.is)(reverseRelations[0], One) && reverseRelations[0].config) {
          return {
            fields: reverseRelations[0].config.references,
            references: reverseRelations[0].config.fields
          };
        }
        throw new Error(
          `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
        );
      }
      function createTableRelationsHelpers(sourceTable) {
        return {
          one: createOne(sourceTable),
          many: createMany(sourceTable)
        };
      }
      function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
        const result = {};
        for (const [
          selectionItemIndex,
          selectionItem
        ] of buildQueryResultSelection.entries()) {
          if (selectionItem.isJson) {
            const relation = tableConfig.relations[selectionItem.tsKey];
            const rawSubRows = row[selectionItemIndex];
            const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
            result[selectionItem.tsKey] = (0, import_entity.is)(relation, One) ? subRows && mapRelationalRow(
              tablesConfig,
              tablesConfig[selectionItem.relationTableTsKey],
              subRows,
              selectionItem.selection,
              mapColumnValue
            ) : subRows.map(
              (subRow) => mapRelationalRow(
                tablesConfig,
                tablesConfig[selectionItem.relationTableTsKey],
                subRow,
                selectionItem.selection,
                mapColumnValue
              )
            );
          } else {
            const value = mapColumnValue(row[selectionItemIndex]);
            const field = selectionItem.field;
            let decoder;
            if ((0, import_entity.is)(field, import_column.Column)) {
              decoder = field;
            } else if ((0, import_entity.is)(field, import_sql2.SQL)) {
              decoder = field.decoder;
            } else {
              decoder = field.sql.decoder;
            }
            result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
          }
        }
        return result;
      }
    }
  });

  // node_modules/drizzle-orm/alias.cjs
  var require_alias = __commonJS({
    "node_modules/drizzle-orm/alias.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var alias_exports = {};
      __export(alias_exports, {
        ColumnAliasProxyHandler: () => ColumnAliasProxyHandler,
        RelationTableAliasProxyHandler: () => RelationTableAliasProxyHandler,
        TableAliasProxyHandler: () => TableAliasProxyHandler,
        aliasedRelation: () => aliasedRelation,
        aliasedTable: () => aliasedTable,
        aliasedTableColumn: () => aliasedTableColumn,
        mapColumnsInAliasedSQLToAlias: () => mapColumnsInAliasedSQLToAlias,
        mapColumnsInSQLToAlias: () => mapColumnsInSQLToAlias
      });
      module.exports = __toCommonJS(alias_exports);
      var import_column = require_column();
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_table = require_table();
      var import_view_common = require_view_common();
      var ColumnAliasProxyHandler = class {
        constructor(table) {
          this.table = table;
        }
        static [import_entity.entityKind] = "ColumnAliasProxyHandler";
        get(columnObj, prop) {
          if (prop === "table") {
            return this.table;
          }
          return columnObj[prop];
        }
      };
      var TableAliasProxyHandler = class {
        constructor(alias, replaceOriginalName) {
          this.alias = alias;
          this.replaceOriginalName = replaceOriginalName;
        }
        static [import_entity.entityKind] = "TableAliasProxyHandler";
        get(target, prop) {
          if (prop === import_table.Table.Symbol.IsAlias) {
            return true;
          }
          if (prop === import_table.Table.Symbol.Name) {
            return this.alias;
          }
          if (this.replaceOriginalName && prop === import_table.Table.Symbol.OriginalName) {
            return this.alias;
          }
          if (prop === import_view_common.ViewBaseConfig) {
            return {
              ...target[import_view_common.ViewBaseConfig],
              name: this.alias,
              isAlias: true
            };
          }
          if (prop === import_table.Table.Symbol.Columns) {
            const columns = target[import_table.Table.Symbol.Columns];
            if (!columns) {
              return columns;
            }
            const proxiedColumns = {};
            Object.keys(columns).map((key) => {
              proxiedColumns[key] = new Proxy(
                columns[key],
                new ColumnAliasProxyHandler(new Proxy(target, this))
              );
            });
            return proxiedColumns;
          }
          const value = target[prop];
          if ((0, import_entity.is)(value, import_column.Column)) {
            return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
          }
          return value;
        }
      };
      var RelationTableAliasProxyHandler = class {
        constructor(alias) {
          this.alias = alias;
        }
        static [import_entity.entityKind] = "RelationTableAliasProxyHandler";
        get(target, prop) {
          if (prop === "sourceTable") {
            return aliasedTable(target.sourceTable, this.alias);
          }
          return target[prop];
        }
      };
      function aliasedTable(table, tableAlias) {
        return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
      }
      function aliasedRelation(relation, tableAlias) {
        return new Proxy(relation, new RelationTableAliasProxyHandler(tableAlias));
      }
      function aliasedTableColumn(column, tableAlias) {
        return new Proxy(
          column,
          new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
        );
      }
      function mapColumnsInAliasedSQLToAlias(query, alias) {
        return new import_sql2.SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
      }
      function mapColumnsInSQLToAlias(query, alias) {
        return import_sql2.sql.join(query.queryChunks.map((c) => {
          if ((0, import_entity.is)(c, import_column.Column)) {
            return aliasedTableColumn(c, alias);
          }
          if ((0, import_entity.is)(c, import_sql2.SQL)) {
            return mapColumnsInSQLToAlias(c, alias);
          }
          if ((0, import_entity.is)(c, import_sql2.SQL.Aliased)) {
            return mapColumnsInAliasedSQLToAlias(c, alias);
          }
          return c;
        }));
      }
    }
  });

  // node_modules/drizzle-orm/selection-proxy.cjs
  var require_selection_proxy = __commonJS({
    "node_modules/drizzle-orm/selection-proxy.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var selection_proxy_exports = {};
      __export(selection_proxy_exports, {
        SelectionProxyHandler: () => SelectionProxyHandler
      });
      module.exports = __toCommonJS(selection_proxy_exports);
      var import_alias = require_alias();
      var import_column = require_column();
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_subquery = require_subquery();
      var import_view_common = require_view_common();
      var SelectionProxyHandler = class _SelectionProxyHandler {
        static [import_entity.entityKind] = "SelectionProxyHandler";
        config;
        constructor(config) {
          this.config = { ...config };
        }
        get(subquery, prop) {
          if (prop === "_") {
            return {
              ...subquery["_"],
              selectedFields: new Proxy(
                subquery._.selectedFields,
                this
              )
            };
          }
          if (prop === import_view_common.ViewBaseConfig) {
            return {
              ...subquery[import_view_common.ViewBaseConfig],
              selectedFields: new Proxy(
                subquery[import_view_common.ViewBaseConfig].selectedFields,
                this
              )
            };
          }
          if (typeof prop === "symbol") {
            return subquery[prop];
          }
          const columns = (0, import_entity.is)(subquery, import_subquery.Subquery) ? subquery._.selectedFields : (0, import_entity.is)(subquery, import_sql2.View) ? subquery[import_view_common.ViewBaseConfig].selectedFields : subquery;
          const value = columns[prop];
          if ((0, import_entity.is)(value, import_sql2.SQL.Aliased)) {
            if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
              return value.sql;
            }
            const newValue = value.clone();
            newValue.isSelectionField = true;
            return newValue;
          }
          if ((0, import_entity.is)(value, import_sql2.SQL)) {
            if (this.config.sqlBehavior === "sql") {
              return value;
            }
            throw new Error(
              `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
            );
          }
          if ((0, import_entity.is)(value, import_column.Column)) {
            if (this.config.alias) {
              return new Proxy(
                value,
                new import_alias.ColumnAliasProxyHandler(
                  new Proxy(
                    value.table,
                    new import_alias.TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
                  )
                )
              );
            }
            return value;
          }
          if (typeof value !== "object" || value === null) {
            return value;
          }
          return new Proxy(value, new _SelectionProxyHandler(this.config));
        }
      };
    }
  });

  // node_modules/drizzle-orm/query-promise.cjs
  var require_query_promise = __commonJS({
    "node_modules/drizzle-orm/query-promise.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var query_promise_exports = {};
      __export(query_promise_exports, {
        QueryPromise: () => QueryPromise
      });
      module.exports = __toCommonJS(query_promise_exports);
      var import_entity = require_entity();
      var QueryPromise = class {
        static [import_entity.entityKind] = "QueryPromise";
        [Symbol.toStringTag] = "QueryPromise";
        catch(onRejected) {
          return this.then(void 0, onRejected);
        }
        finally(onFinally) {
          return this.then(
            (value) => {
              onFinally?.();
              return value;
            },
            (reason) => {
              onFinally?.();
              throw reason;
            }
          );
        }
        then(onFulfilled, onRejected) {
          return this.execute().then(onFulfilled, onRejected);
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/foreign-keys.cjs
  var require_foreign_keys2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/foreign-keys.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var foreign_keys_exports = {};
      __export(foreign_keys_exports, {
        ForeignKey: () => ForeignKey,
        ForeignKeyBuilder: () => ForeignKeyBuilder,
        foreignKey: () => foreignKey
      });
      module.exports = __toCommonJS(foreign_keys_exports);
      var import_entity = require_entity();
      var import_table_utils = require_table_utils();
      var ForeignKeyBuilder = class {
        static [import_entity.entityKind] = "SQLiteForeignKeyBuilder";
        /** @internal */
        reference;
        /** @internal */
        _onUpdate;
        /** @internal */
        _onDelete;
        constructor(config, actions) {
          this.reference = () => {
            const { name, columns, foreignColumns } = config();
            return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
          };
          if (actions) {
            this._onUpdate = actions.onUpdate;
            this._onDelete = actions.onDelete;
          }
        }
        onUpdate(action) {
          this._onUpdate = action;
          return this;
        }
        onDelete(action) {
          this._onDelete = action;
          return this;
        }
        /** @internal */
        build(table) {
          return new ForeignKey(table, this);
        }
      };
      var ForeignKey = class {
        constructor(table, builder) {
          this.table = table;
          this.reference = builder.reference;
          this.onUpdate = builder._onUpdate;
          this.onDelete = builder._onDelete;
        }
        static [import_entity.entityKind] = "SQLiteForeignKey";
        reference;
        onUpdate;
        onDelete;
        getName() {
          const { name, columns, foreignColumns } = this.reference();
          const columnNames = columns.map((column) => column.name);
          const foreignColumnNames = foreignColumns.map((column) => column.name);
          const chunks = [
            this.table[import_table_utils.TableName],
            ...columnNames,
            foreignColumns[0].table[import_table_utils.TableName],
            ...foreignColumnNames
          ];
          return name ?? `${chunks.join("_")}_fk`;
        }
      };
      function foreignKey(config) {
        function mappedConfig() {
          if (typeof config === "function") {
            const { name, columns, foreignColumns } = config();
            return {
              name,
              columns,
              foreignColumns
            };
          }
          return config;
        }
        return new ForeignKeyBuilder(mappedConfig);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/unique-constraint.cjs
  var require_unique_constraint2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/unique-constraint.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var unique_constraint_exports = {};
      __export(unique_constraint_exports, {
        UniqueConstraint: () => UniqueConstraint,
        UniqueConstraintBuilder: () => UniqueConstraintBuilder,
        UniqueOnConstraintBuilder: () => UniqueOnConstraintBuilder,
        unique: () => unique,
        uniqueKeyName: () => uniqueKeyName
      });
      module.exports = __toCommonJS(unique_constraint_exports);
      var import_entity = require_entity();
      var import_table_utils = require_table_utils();
      function uniqueKeyName(table, columns) {
        return `${table[import_table_utils.TableName]}_${columns.join("_")}_unique`;
      }
      function unique(name) {
        return new UniqueOnConstraintBuilder(name);
      }
      var UniqueConstraintBuilder = class {
        constructor(columns, name) {
          this.name = name;
          this.columns = columns;
        }
        static [import_entity.entityKind] = "SQLiteUniqueConstraintBuilder";
        /** @internal */
        columns;
        /** @internal */
        build(table) {
          return new UniqueConstraint(table, this.columns, this.name);
        }
      };
      var UniqueOnConstraintBuilder = class {
        static [import_entity.entityKind] = "SQLiteUniqueOnConstraintBuilder";
        /** @internal */
        name;
        constructor(name) {
          this.name = name;
        }
        on(...columns) {
          return new UniqueConstraintBuilder(columns, this.name);
        }
      };
      var UniqueConstraint = class {
        constructor(table, columns, name) {
          this.table = table;
          this.columns = columns;
          this.name = name ?? uniqueKeyName(this.table, this.columns.map((column) => column.name));
        }
        static [import_entity.entityKind] = "SQLiteUniqueConstraint";
        columns;
        name;
        getName() {
          return this.name;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/common.cjs
  var require_common2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/common.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var common_exports = {};
      __export(common_exports, {
        SQLiteColumn: () => SQLiteColumn,
        SQLiteColumnBuilder: () => SQLiteColumnBuilder
      });
      module.exports = __toCommonJS(common_exports);
      var import_column_builder = require_column_builder();
      var import_column = require_column();
      var import_entity = require_entity();
      var import_foreign_keys = require_foreign_keys2();
      var import_unique_constraint = require_unique_constraint2();
      var SQLiteColumnBuilder = class extends import_column_builder.ColumnBuilder {
        static [import_entity.entityKind] = "SQLiteColumnBuilder";
        foreignKeyConfigs = [];
        references(ref, actions = {}) {
          this.foreignKeyConfigs.push({ ref, actions });
          return this;
        }
        unique(name) {
          this.config.isUnique = true;
          this.config.uniqueName = name;
          return this;
        }
        generatedAlwaysAs(as, config) {
          this.config.generated = {
            as,
            type: "always",
            mode: config?.mode ?? "virtual"
          };
          return this;
        }
        /** @internal */
        buildForeignKeys(column, table) {
          return this.foreignKeyConfigs.map(({ ref, actions }) => {
            return ((ref2, actions2) => {
              const builder = new import_foreign_keys.ForeignKeyBuilder(() => {
                const foreignColumn = ref2();
                return { columns: [column], foreignColumns: [foreignColumn] };
              });
              if (actions2.onUpdate) {
                builder.onUpdate(actions2.onUpdate);
              }
              if (actions2.onDelete) {
                builder.onDelete(actions2.onDelete);
              }
              return builder.build(table);
            })(ref, actions);
          });
        }
      };
      var SQLiteColumn = class extends import_column.Column {
        constructor(table, config) {
          if (!config.uniqueName) {
            config.uniqueName = (0, import_unique_constraint.uniqueKeyName)(table, [config.name]);
          }
          super(table, config);
          this.table = table;
        }
        static [import_entity.entityKind] = "SQLiteColumn";
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/blob.cjs
  var require_blob = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/blob.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var blob_exports = {};
      __export(blob_exports, {
        SQLiteBigInt: () => SQLiteBigInt,
        SQLiteBigIntBuilder: () => SQLiteBigIntBuilder,
        SQLiteBlobBuffer: () => SQLiteBlobBuffer,
        SQLiteBlobBufferBuilder: () => SQLiteBlobBufferBuilder,
        SQLiteBlobJson: () => SQLiteBlobJson,
        SQLiteBlobJsonBuilder: () => SQLiteBlobJsonBuilder,
        blob: () => blob
      });
      module.exports = __toCommonJS(blob_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common2();
      var SQLiteBigIntBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteBigIntBuilder";
        constructor(name) {
          super(name, "bigint", "SQLiteBigInt");
        }
        /** @internal */
        build(table) {
          return new SQLiteBigInt(table, this.config);
        }
      };
      var SQLiteBigInt = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteBigInt";
        getSQLType() {
          return "blob";
        }
        mapFromDriverValue(value) {
          if (typeof Buffer !== "undefined" && Buffer.from) {
            const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
            return BigInt(buf.toString("utf8"));
          }
          return BigInt(import_utils.textDecoder.decode(value));
        }
        mapToDriverValue(value) {
          return Buffer.from(value.toString());
        }
      };
      var SQLiteBlobJsonBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteBlobJsonBuilder";
        constructor(name) {
          super(name, "json", "SQLiteBlobJson");
        }
        /** @internal */
        build(table) {
          return new SQLiteBlobJson(
            table,
            this.config
          );
        }
      };
      var SQLiteBlobJson = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteBlobJson";
        getSQLType() {
          return "blob";
        }
        mapFromDriverValue(value) {
          if (typeof Buffer !== "undefined" && Buffer.from) {
            const buf = Buffer.isBuffer(value) ? value : value instanceof ArrayBuffer ? Buffer.from(value) : value.buffer ? Buffer.from(value.buffer, value.byteOffset, value.byteLength) : Buffer.from(value);
            return JSON.parse(buf.toString("utf8"));
          }
          return JSON.parse(import_utils.textDecoder.decode(value));
        }
        mapToDriverValue(value) {
          return Buffer.from(JSON.stringify(value));
        }
      };
      var SQLiteBlobBufferBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteBlobBufferBuilder";
        constructor(name) {
          super(name, "buffer", "SQLiteBlobBuffer");
        }
        /** @internal */
        build(table) {
          return new SQLiteBlobBuffer(table, this.config);
        }
      };
      var SQLiteBlobBuffer = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteBlobBuffer";
        mapFromDriverValue(value) {
          if (Buffer.isBuffer(value)) {
            return value;
          }
          return Buffer.from(value);
        }
        getSQLType() {
          return "blob";
        }
      };
      function blob(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config?.mode === "json") {
          return new SQLiteBlobJsonBuilder(name);
        }
        if (config?.mode === "bigint") {
          return new SQLiteBigIntBuilder(name);
        }
        return new SQLiteBlobBufferBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/custom.cjs
  var require_custom2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/custom.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var custom_exports = {};
      __export(custom_exports, {
        SQLiteCustomColumn: () => SQLiteCustomColumn,
        SQLiteCustomColumnBuilder: () => SQLiteCustomColumnBuilder,
        customType: () => customType
      });
      module.exports = __toCommonJS(custom_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common2();
      var SQLiteCustomColumnBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteCustomColumnBuilder";
        constructor(name, fieldConfig, customTypeParams) {
          super(name, "custom", "SQLiteCustomColumn");
          this.config.fieldConfig = fieldConfig;
          this.config.customTypeParams = customTypeParams;
        }
        /** @internal */
        build(table) {
          return new SQLiteCustomColumn(
            table,
            this.config
          );
        }
      };
      var SQLiteCustomColumn = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteCustomColumn";
        sqlName;
        mapTo;
        mapFrom;
        constructor(table, config) {
          super(table, config);
          this.sqlName = config.customTypeParams.dataType(config.fieldConfig);
          this.mapTo = config.customTypeParams.toDriver;
          this.mapFrom = config.customTypeParams.fromDriver;
        }
        getSQLType() {
          return this.sqlName;
        }
        mapFromDriverValue(value) {
          return typeof this.mapFrom === "function" ? this.mapFrom(value) : value;
        }
        mapToDriverValue(value) {
          return typeof this.mapTo === "function" ? this.mapTo(value) : value;
        }
      };
      function customType(customTypeParams) {
        return (a, b) => {
          const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
          return new SQLiteCustomColumnBuilder(
            name,
            config,
            customTypeParams
          );
        };
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/integer.cjs
  var require_integer2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/integer.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var integer_exports = {};
      __export(integer_exports, {
        SQLiteBaseInteger: () => SQLiteBaseInteger,
        SQLiteBaseIntegerBuilder: () => SQLiteBaseIntegerBuilder,
        SQLiteBoolean: () => SQLiteBoolean,
        SQLiteBooleanBuilder: () => SQLiteBooleanBuilder,
        SQLiteInteger: () => SQLiteInteger,
        SQLiteIntegerBuilder: () => SQLiteIntegerBuilder,
        SQLiteTimestamp: () => SQLiteTimestamp,
        SQLiteTimestampBuilder: () => SQLiteTimestampBuilder,
        int: () => int,
        integer: () => integer
      });
      module.exports = __toCommonJS(integer_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_utils = require_utils2();
      var import_common = require_common2();
      var SQLiteBaseIntegerBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteBaseIntegerBuilder";
        constructor(name, dataType, columnType) {
          super(name, dataType, columnType);
          this.config.autoIncrement = false;
        }
        primaryKey(config) {
          if (config?.autoIncrement) {
            this.config.autoIncrement = true;
          }
          this.config.hasDefault = true;
          return super.primaryKey();
        }
      };
      var SQLiteBaseInteger = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteBaseInteger";
        autoIncrement = this.config.autoIncrement;
        getSQLType() {
          return "integer";
        }
      };
      var SQLiteIntegerBuilder = class extends SQLiteBaseIntegerBuilder {
        static [import_entity.entityKind] = "SQLiteIntegerBuilder";
        constructor(name) {
          super(name, "number", "SQLiteInteger");
        }
        build(table) {
          return new SQLiteInteger(
            table,
            this.config
          );
        }
      };
      var SQLiteInteger = class extends SQLiteBaseInteger {
        static [import_entity.entityKind] = "SQLiteInteger";
      };
      var SQLiteTimestampBuilder = class extends SQLiteBaseIntegerBuilder {
        static [import_entity.entityKind] = "SQLiteTimestampBuilder";
        constructor(name, mode) {
          super(name, "date", "SQLiteTimestamp");
          this.config.mode = mode;
        }
        /**
         * @deprecated Use `default()` with your own expression instead.
         *
         * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
         */
        defaultNow() {
          return this.default(import_sql2.sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
        }
        build(table) {
          return new SQLiteTimestamp(
            table,
            this.config
          );
        }
      };
      var SQLiteTimestamp = class extends SQLiteBaseInteger {
        static [import_entity.entityKind] = "SQLiteTimestamp";
        mode = this.config.mode;
        mapFromDriverValue(value) {
          if (this.config.mode === "timestamp") {
            return new Date(value * 1e3);
          }
          return new Date(value);
        }
        mapToDriverValue(value) {
          const unix = value.getTime();
          if (this.config.mode === "timestamp") {
            return Math.floor(unix / 1e3);
          }
          return unix;
        }
      };
      var SQLiteBooleanBuilder = class extends SQLiteBaseIntegerBuilder {
        static [import_entity.entityKind] = "SQLiteBooleanBuilder";
        constructor(name, mode) {
          super(name, "boolean", "SQLiteBoolean");
          this.config.mode = mode;
        }
        build(table) {
          return new SQLiteBoolean(
            table,
            this.config
          );
        }
      };
      var SQLiteBoolean = class extends SQLiteBaseInteger {
        static [import_entity.entityKind] = "SQLiteBoolean";
        mode = this.config.mode;
        mapFromDriverValue(value) {
          return Number(value) === 1;
        }
        mapToDriverValue(value) {
          return value ? 1 : 0;
        }
      };
      function integer(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config?.mode === "timestamp" || config?.mode === "timestamp_ms") {
          return new SQLiteTimestampBuilder(name, config.mode);
        }
        if (config?.mode === "boolean") {
          return new SQLiteBooleanBuilder(name, config.mode);
        }
        return new SQLiteIntegerBuilder(name);
      }
      var int = integer;
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/numeric.cjs
  var require_numeric2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/numeric.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var numeric_exports = {};
      __export(numeric_exports, {
        SQLiteNumeric: () => SQLiteNumeric,
        SQLiteNumericBigInt: () => SQLiteNumericBigInt,
        SQLiteNumericBigIntBuilder: () => SQLiteNumericBigIntBuilder,
        SQLiteNumericBuilder: () => SQLiteNumericBuilder,
        SQLiteNumericNumber: () => SQLiteNumericNumber,
        SQLiteNumericNumberBuilder: () => SQLiteNumericNumberBuilder,
        numeric: () => numeric
      });
      module.exports = __toCommonJS(numeric_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common2();
      var SQLiteNumericBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteNumericBuilder";
        constructor(name) {
          super(name, "string", "SQLiteNumeric");
        }
        /** @internal */
        build(table) {
          return new SQLiteNumeric(
            table,
            this.config
          );
        }
      };
      var SQLiteNumeric = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteNumeric";
        mapFromDriverValue(value) {
          if (typeof value === "string") return value;
          return String(value);
        }
        getSQLType() {
          return "numeric";
        }
      };
      var SQLiteNumericNumberBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteNumericNumberBuilder";
        constructor(name) {
          super(name, "number", "SQLiteNumericNumber");
        }
        /** @internal */
        build(table) {
          return new SQLiteNumericNumber(
            table,
            this.config
          );
        }
      };
      var SQLiteNumericNumber = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteNumericNumber";
        mapFromDriverValue(value) {
          if (typeof value === "number") return value;
          return Number(value);
        }
        mapToDriverValue = String;
        getSQLType() {
          return "numeric";
        }
      };
      var SQLiteNumericBigIntBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteNumericBigIntBuilder";
        constructor(name) {
          super(name, "bigint", "SQLiteNumericBigInt");
        }
        /** @internal */
        build(table) {
          return new SQLiteNumericBigInt(
            table,
            this.config
          );
        }
      };
      var SQLiteNumericBigInt = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteNumericBigInt";
        mapFromDriverValue = BigInt;
        mapToDriverValue = String;
        getSQLType() {
          return "numeric";
        }
      };
      function numeric(a, b) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        const mode = config?.mode;
        return mode === "number" ? new SQLiteNumericNumberBuilder(name) : mode === "bigint" ? new SQLiteNumericBigIntBuilder(name) : new SQLiteNumericBuilder(name);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/real.cjs
  var require_real2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/real.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var real_exports = {};
      __export(real_exports, {
        SQLiteReal: () => SQLiteReal,
        SQLiteRealBuilder: () => SQLiteRealBuilder,
        real: () => real
      });
      module.exports = __toCommonJS(real_exports);
      var import_entity = require_entity();
      var import_common = require_common2();
      var SQLiteRealBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteRealBuilder";
        constructor(name) {
          super(name, "number", "SQLiteReal");
        }
        /** @internal */
        build(table) {
          return new SQLiteReal(table, this.config);
        }
      };
      var SQLiteReal = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteReal";
        getSQLType() {
          return "real";
        }
      };
      function real(name) {
        return new SQLiteRealBuilder(name ?? "");
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/text.cjs
  var require_text2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/text.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var text_exports = {};
      __export(text_exports, {
        SQLiteText: () => SQLiteText,
        SQLiteTextBuilder: () => SQLiteTextBuilder,
        SQLiteTextJson: () => SQLiteTextJson,
        SQLiteTextJsonBuilder: () => SQLiteTextJsonBuilder,
        text: () => text
      });
      module.exports = __toCommonJS(text_exports);
      var import_entity = require_entity();
      var import_utils = require_utils2();
      var import_common = require_common2();
      var SQLiteTextBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteTextBuilder";
        constructor(name, config) {
          super(name, "string", "SQLiteText");
          this.config.enumValues = config.enum;
          this.config.length = config.length;
        }
        /** @internal */
        build(table) {
          return new SQLiteText(
            table,
            this.config
          );
        }
      };
      var SQLiteText = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteText";
        enumValues = this.config.enumValues;
        length = this.config.length;
        constructor(table, config) {
          super(table, config);
        }
        getSQLType() {
          return `text${this.config.length ? `(${this.config.length})` : ""}`;
        }
      };
      var SQLiteTextJsonBuilder = class extends import_common.SQLiteColumnBuilder {
        static [import_entity.entityKind] = "SQLiteTextJsonBuilder";
        constructor(name) {
          super(name, "json", "SQLiteTextJson");
        }
        /** @internal */
        build(table) {
          return new SQLiteTextJson(
            table,
            this.config
          );
        }
      };
      var SQLiteTextJson = class extends import_common.SQLiteColumn {
        static [import_entity.entityKind] = "SQLiteTextJson";
        getSQLType() {
          return "text";
        }
        mapFromDriverValue(value) {
          return JSON.parse(value);
        }
        mapToDriverValue(value) {
          return JSON.stringify(value);
        }
      };
      function text(a, b = {}) {
        const { name, config } = (0, import_utils.getColumnNameAndConfig)(a, b);
        if (config.mode === "json") {
          return new SQLiteTextJsonBuilder(name);
        }
        return new SQLiteTextBuilder(name, config);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/all.cjs
  var require_all2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/all.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var all_exports = {};
      __export(all_exports, {
        getSQLiteColumnBuilders: () => getSQLiteColumnBuilders
      });
      module.exports = __toCommonJS(all_exports);
      var import_blob = require_blob();
      var import_custom = require_custom2();
      var import_integer = require_integer2();
      var import_numeric = require_numeric2();
      var import_real = require_real2();
      var import_text = require_text2();
      function getSQLiteColumnBuilders() {
        return {
          blob: import_blob.blob,
          customType: import_custom.customType,
          integer: import_integer.integer,
          numeric: import_numeric.numeric,
          real: import_real.real,
          text: import_text.text
        };
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/table.cjs
  var require_table3 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/table.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var table_exports = {};
      __export(table_exports, {
        InlineForeignKeys: () => InlineForeignKeys,
        SQLiteTable: () => SQLiteTable,
        sqliteTable: () => sqliteTable,
        sqliteTableCreator: () => sqliteTableCreator
      });
      module.exports = __toCommonJS(table_exports);
      var import_entity = require_entity();
      var import_table = require_table();
      var import_all = require_all2();
      var InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
      var SQLiteTable = class extends import_table.Table {
        static [import_entity.entityKind] = "SQLiteTable";
        /** @internal */
        static Symbol = Object.assign({}, import_table.Table.Symbol, {
          InlineForeignKeys
        });
        /** @internal */
        [import_table.Table.Symbol.Columns];
        /** @internal */
        [InlineForeignKeys] = [];
        /** @internal */
        [import_table.Table.Symbol.ExtraConfigBuilder] = void 0;
      };
      function sqliteTableBase(name, columns, extraConfig, schema, baseName = name) {
        const rawTable = new SQLiteTable(name, schema, baseName);
        const parsedColumns = typeof columns === "function" ? columns((0, import_all.getSQLiteColumnBuilders)()) : columns;
        const builtColumns = Object.fromEntries(
          Object.entries(parsedColumns).map(([name2, colBuilderBase]) => {
            const colBuilder = colBuilderBase;
            colBuilder.setName(name2);
            const column = colBuilder.build(rawTable);
            rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
            return [name2, column];
          })
        );
        const table = Object.assign(rawTable, builtColumns);
        table[import_table.Table.Symbol.Columns] = builtColumns;
        table[import_table.Table.Symbol.ExtraConfigColumns] = builtColumns;
        if (extraConfig) {
          table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
        }
        return table;
      }
      var sqliteTable = (name, columns, extraConfig) => {
        return sqliteTableBase(name, columns, extraConfig);
      };
      function sqliteTableCreator(customizeTableName) {
        return (name, columns, extraConfig) => {
          return sqliteTableBase(customizeTableName(name), columns, extraConfig, void 0, name);
        };
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/checks.cjs
  var require_checks = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/checks.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var checks_exports = {};
      __export(checks_exports, {
        Check: () => Check,
        CheckBuilder: () => CheckBuilder,
        check: () => check
      });
      module.exports = __toCommonJS(checks_exports);
      var import_entity = require_entity();
      var CheckBuilder = class {
        constructor(name, value) {
          this.name = name;
          this.value = value;
        }
        static [import_entity.entityKind] = "SQLiteCheckBuilder";
        brand;
        build(table) {
          return new Check(table, this);
        }
      };
      var Check = class {
        constructor(table, builder) {
          this.table = table;
          this.name = builder.name;
          this.value = builder.value;
        }
        static [import_entity.entityKind] = "SQLiteCheck";
        name;
        value;
      };
      function check(name, value) {
        return new CheckBuilder(name, value);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/indexes.cjs
  var require_indexes = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/indexes.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var indexes_exports = {};
      __export(indexes_exports, {
        Index: () => Index,
        IndexBuilder: () => IndexBuilder,
        IndexBuilderOn: () => IndexBuilderOn,
        index: () => index,
        uniqueIndex: () => uniqueIndex
      });
      module.exports = __toCommonJS(indexes_exports);
      var import_entity = require_entity();
      var IndexBuilderOn = class {
        constructor(name, unique) {
          this.name = name;
          this.unique = unique;
        }
        static [import_entity.entityKind] = "SQLiteIndexBuilderOn";
        on(...columns) {
          return new IndexBuilder(this.name, columns, this.unique);
        }
      };
      var IndexBuilder = class {
        static [import_entity.entityKind] = "SQLiteIndexBuilder";
        /** @internal */
        config;
        constructor(name, columns, unique) {
          this.config = {
            name,
            columns,
            unique,
            where: void 0
          };
        }
        /**
         * Condition for partial index.
         */
        where(condition) {
          this.config.where = condition;
          return this;
        }
        /** @internal */
        build(table) {
          return new Index(this.config, table);
        }
      };
      var Index = class {
        static [import_entity.entityKind] = "SQLiteIndex";
        config;
        constructor(config, table) {
          this.config = { ...config, table };
        }
      };
      function index(name) {
        return new IndexBuilderOn(name, false);
      }
      function uniqueIndex(name) {
        return new IndexBuilderOn(name, true);
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/primary-keys.cjs
  var require_primary_keys2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/primary-keys.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var primary_keys_exports = {};
      __export(primary_keys_exports, {
        PrimaryKey: () => PrimaryKey,
        PrimaryKeyBuilder: () => PrimaryKeyBuilder,
        primaryKey: () => primaryKey
      });
      module.exports = __toCommonJS(primary_keys_exports);
      var import_entity = require_entity();
      var import_table = require_table3();
      function primaryKey(...config) {
        if (config[0].columns) {
          return new PrimaryKeyBuilder(config[0].columns, config[0].name);
        }
        return new PrimaryKeyBuilder(config);
      }
      var PrimaryKeyBuilder = class {
        static [import_entity.entityKind] = "SQLitePrimaryKeyBuilder";
        /** @internal */
        columns;
        /** @internal */
        name;
        constructor(columns, name) {
          this.columns = columns;
          this.name = name;
        }
        /** @internal */
        build(table) {
          return new PrimaryKey(table, this.columns, this.name);
        }
      };
      var PrimaryKey = class {
        constructor(table, columns, name) {
          this.table = table;
          this.columns = columns;
          this.name = name;
        }
        static [import_entity.entityKind] = "SQLitePrimaryKey";
        columns;
        name;
        getName() {
          return this.name ?? `${this.table[import_table.SQLiteTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/utils.cjs
  var require_utils4 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/utils.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var utils_exports = {};
      __export(utils_exports, {
        extractUsedTable: () => extractUsedTable,
        getTableConfig: () => getTableConfig,
        getViewConfig: () => getViewConfig
      });
      module.exports = __toCommonJS(utils_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var import_subquery = require_subquery();
      var import_table = require_table();
      var import_view_common = require_view_common();
      var import_checks = require_checks();
      var import_foreign_keys = require_foreign_keys2();
      var import_indexes = require_indexes();
      var import_primary_keys = require_primary_keys2();
      var import_table2 = require_table3();
      var import_unique_constraint = require_unique_constraint2();
      function getTableConfig(table) {
        const columns = Object.values(table[import_table2.SQLiteTable.Symbol.Columns]);
        const indexes = [];
        const checks = [];
        const primaryKeys = [];
        const uniqueConstraints = [];
        const foreignKeys = Object.values(table[import_table2.SQLiteTable.Symbol.InlineForeignKeys]);
        const name = table[import_table.Table.Symbol.Name];
        const extraConfigBuilder = table[import_table2.SQLiteTable.Symbol.ExtraConfigBuilder];
        if (extraConfigBuilder !== void 0) {
          const extraConfig = extraConfigBuilder(table[import_table2.SQLiteTable.Symbol.Columns]);
          const extraValues = Array.isArray(extraConfig) ? extraConfig.flat(1) : Object.values(extraConfig);
          for (const builder of Object.values(extraValues)) {
            if ((0, import_entity.is)(builder, import_indexes.IndexBuilder)) {
              indexes.push(builder.build(table));
            } else if ((0, import_entity.is)(builder, import_checks.CheckBuilder)) {
              checks.push(builder.build(table));
            } else if ((0, import_entity.is)(builder, import_unique_constraint.UniqueConstraintBuilder)) {
              uniqueConstraints.push(builder.build(table));
            } else if ((0, import_entity.is)(builder, import_primary_keys.PrimaryKeyBuilder)) {
              primaryKeys.push(builder.build(table));
            } else if ((0, import_entity.is)(builder, import_foreign_keys.ForeignKeyBuilder)) {
              foreignKeys.push(builder.build(table));
            }
          }
        }
        return {
          columns,
          indexes,
          foreignKeys,
          checks,
          primaryKeys,
          uniqueConstraints,
          name
        };
      }
      function extractUsedTable(table) {
        if ((0, import_entity.is)(table, import_table2.SQLiteTable)) {
          return [`${table[import_table.Table.Symbol.BaseName]}`];
        }
        if ((0, import_entity.is)(table, import_subquery.Subquery)) {
          return table._.usedTables ?? [];
        }
        if ((0, import_entity.is)(table, import_sql2.SQL)) {
          return table.usedTables ?? [];
        }
        return [];
      }
      function getViewConfig(view) {
        return {
          ...view[import_view_common.ViewBaseConfig]
          // ...view[SQLiteViewConfig],
        };
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/delete.cjs
  var require_delete = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/delete.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var delete_exports = {};
      __export(delete_exports, {
        SQLiteDeleteBase: () => SQLiteDeleteBase
      });
      module.exports = __toCommonJS(delete_exports);
      var import_entity = require_entity();
      var import_query_promise = require_query_promise();
      var import_selection_proxy = require_selection_proxy();
      var import_table = require_table3();
      var import_table2 = require_table();
      var import_utils = require_utils2();
      var import_utils2 = require_utils4();
      var SQLiteDeleteBase = class extends import_query_promise.QueryPromise {
        constructor(table, session, dialect, withList) {
          super();
          this.table = table;
          this.session = session;
          this.dialect = dialect;
          this.config = { table, withList };
        }
        static [import_entity.entityKind] = "SQLiteDelete";
        /** @internal */
        config;
        /**
         * Adds a `where` clause to the query.
         *
         * Calling this method will delete only those rows that fulfill a specified condition.
         *
         * See docs: {@link https://orm.drizzle.team/docs/delete}
         *
         * @param where the `where` clause.
         *
         * @example
         * You can use conditional operators and `sql function` to filter the rows to be deleted.
         *
         * ```ts
         * // Delete all cars with green color
         * db.delete(cars).where(eq(cars.color, 'green'));
         * // or
         * db.delete(cars).where(sql`${cars.color} = 'green'`)
         * ```
         *
         * You can logically combine conditional operators with `and()` and `or()` operators:
         *
         * ```ts
         * // Delete all BMW cars with a green color
         * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
         *
         * // Delete all cars with the green or blue color
         * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
         * ```
         */
        where(where) {
          this.config.where = where;
          return this;
        }
        orderBy(...columns) {
          if (typeof columns[0] === "function") {
            const orderBy = columns[0](
              new Proxy(
                this.config.table[import_table2.Table.Symbol.Columns],
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
              )
            );
            const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
            this.config.orderBy = orderByArray;
          } else {
            const orderByArray = columns;
            this.config.orderBy = orderByArray;
          }
          return this;
        }
        limit(limit) {
          this.config.limit = limit;
          return this;
        }
        returning(fields = this.table[import_table.SQLiteTable.Symbol.Columns]) {
          this.config.returning = (0, import_utils.orderSelectedFields)(fields);
          return this;
        }
        /** @internal */
        getSQL() {
          return this.dialect.buildDeleteQuery(this.config);
        }
        toSQL() {
          const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
          return rest;
        }
        /** @internal */
        _prepare(isOneTimeQuery = true) {
          return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
            this.dialect.sqlToQuery(this.getSQL()),
            this.config.returning,
            this.config.returning ? "all" : "run",
            true,
            void 0,
            {
              type: "delete",
              tables: (0, import_utils2.extractUsedTable)(this.config.table)
            }
          );
        }
        prepare() {
          return this._prepare(false);
        }
        run = (placeholderValues) => {
          return this._prepare().run(placeholderValues);
        };
        all = (placeholderValues) => {
          return this._prepare().all(placeholderValues);
        };
        get = (placeholderValues) => {
          return this._prepare().get(placeholderValues);
        };
        values = (placeholderValues) => {
          return this._prepare().values(placeholderValues);
        };
        async execute(placeholderValues) {
          return this._prepare().execute(placeholderValues);
        }
        $dynamic() {
          return this;
        }
      };
    }
  });

  // node_modules/drizzle-orm/casing.cjs
  var require_casing = __commonJS({
    "node_modules/drizzle-orm/casing.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var casing_exports = {};
      __export(casing_exports, {
        CasingCache: () => CasingCache,
        toCamelCase: () => toCamelCase,
        toSnakeCase: () => toSnakeCase
      });
      module.exports = __toCommonJS(casing_exports);
      var import_entity = require_entity();
      var import_table = require_table();
      function toSnakeCase(input) {
        const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
        return words.map((word) => word.toLowerCase()).join("_");
      }
      function toCamelCase(input) {
        const words = input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? [];
        return words.reduce((acc, word, i) => {
          const formattedWord = i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`;
          return acc + formattedWord;
        }, "");
      }
      function noopCase(input) {
        return input;
      }
      var CasingCache = class {
        static [import_entity.entityKind] = "CasingCache";
        /** @internal */
        cache = {};
        cachedTables = {};
        convert;
        constructor(casing) {
          this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
        }
        getColumnCasing(column) {
          if (!column.keyAsName) return column.name;
          const schema = column.table[import_table.Table.Symbol.Schema] ?? "public";
          const tableName = column.table[import_table.Table.Symbol.OriginalName];
          const key = `${schema}.${tableName}.${column.name}`;
          if (!this.cache[key]) {
            this.cacheTable(column.table);
          }
          return this.cache[key];
        }
        cacheTable(table) {
          const schema = table[import_table.Table.Symbol.Schema] ?? "public";
          const tableName = table[import_table.Table.Symbol.OriginalName];
          const tableKey = `${schema}.${tableName}`;
          if (!this.cachedTables[tableKey]) {
            for (const column of Object.values(table[import_table.Table.Symbol.Columns])) {
              const columnKey = `${tableKey}.${column.name}`;
              this.cache[columnKey] = this.convert(column.name);
            }
            this.cachedTables[tableKey] = true;
          }
        }
        clearCache() {
          this.cache = {};
          this.cachedTables = {};
        }
      };
    }
  });

  // node_modules/drizzle-orm/errors.cjs
  var require_errors = __commonJS({
    "node_modules/drizzle-orm/errors.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var errors_exports = {};
      __export(errors_exports, {
        DrizzleError: () => DrizzleError,
        DrizzleQueryError: () => DrizzleQueryError,
        TransactionRollbackError: () => TransactionRollbackError
      });
      module.exports = __toCommonJS(errors_exports);
      var import_entity = require_entity();
      var DrizzleError = class extends Error {
        static [import_entity.entityKind] = "DrizzleError";
        constructor({ message, cause }) {
          super(message);
          this.name = "DrizzleError";
          this.cause = cause;
        }
      };
      var DrizzleQueryError = class _DrizzleQueryError extends Error {
        constructor(query, params, cause) {
          super(`Failed query: ${query}
params: ${params}`);
          this.query = query;
          this.params = params;
          this.cause = cause;
          Error.captureStackTrace(this, _DrizzleQueryError);
          if (cause) this.cause = cause;
        }
      };
      var TransactionRollbackError = class extends DrizzleError {
        static [import_entity.entityKind] = "TransactionRollbackError";
        constructor() {
          super({ message: "Rollback" });
        }
      };
    }
  });

  // node_modules/drizzle-orm/sql/functions/aggregate.cjs
  var require_aggregate = __commonJS({
    "node_modules/drizzle-orm/sql/functions/aggregate.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var aggregate_exports = {};
      __export(aggregate_exports, {
        avg: () => avg,
        avgDistinct: () => avgDistinct,
        count: () => count,
        countDistinct: () => countDistinct,
        max: () => max,
        min: () => min,
        sum: () => sum,
        sumDistinct: () => sumDistinct
      });
      module.exports = __toCommonJS(aggregate_exports);
      var import_column = require_column();
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      function count(expression) {
        return import_sql2.sql`count(${expression || import_sql2.sql.raw("*")})`.mapWith(Number);
      }
      function countDistinct(expression) {
        return import_sql2.sql`count(distinct ${expression})`.mapWith(Number);
      }
      function avg(expression) {
        return import_sql2.sql`avg(${expression})`.mapWith(String);
      }
      function avgDistinct(expression) {
        return import_sql2.sql`avg(distinct ${expression})`.mapWith(String);
      }
      function sum(expression) {
        return import_sql2.sql`sum(${expression})`.mapWith(String);
      }
      function sumDistinct(expression) {
        return import_sql2.sql`sum(distinct ${expression})`.mapWith(String);
      }
      function max(expression) {
        return import_sql2.sql`max(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
      }
      function min(expression) {
        return import_sql2.sql`min(${expression})`.mapWith((0, import_entity.is)(expression, import_column.Column) ? expression : String);
      }
    }
  });

  // node_modules/drizzle-orm/sql/functions/vector.cjs
  var require_vector2 = __commonJS({
    "node_modules/drizzle-orm/sql/functions/vector.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var vector_exports = {};
      __export(vector_exports, {
        cosineDistance: () => cosineDistance,
        hammingDistance: () => hammingDistance,
        innerProduct: () => innerProduct,
        jaccardDistance: () => jaccardDistance,
        l1Distance: () => l1Distance,
        l2Distance: () => l2Distance
      });
      module.exports = __toCommonJS(vector_exports);
      var import_sql2 = require_sql();
      function toSql(value) {
        return JSON.stringify(value);
      }
      function l2Distance(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <-> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <-> ${value}`;
      }
      function l1Distance(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <+> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <+> ${value}`;
      }
      function innerProduct(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <#> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <#> ${value}`;
      }
      function cosineDistance(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <=> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <=> ${value}`;
      }
      function hammingDistance(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <~> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <~> ${value}`;
      }
      function jaccardDistance(column, value) {
        if (Array.isArray(value)) {
          return import_sql2.sql`${column} <%> ${toSql(value)}`;
        }
        return import_sql2.sql`${column} <%> ${value}`;
      }
    }
  });

  // node_modules/drizzle-orm/sql/functions/index.cjs
  var require_functions = __commonJS({
    "node_modules/drizzle-orm/sql/functions/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var functions_exports = {};
      module.exports = __toCommonJS(functions_exports);
      __reExport(functions_exports, require_aggregate(), module.exports);
      __reExport(functions_exports, require_vector2(), module.exports);
    }
  });

  // node_modules/drizzle-orm/sql/index.cjs
  var require_sql2 = __commonJS({
    "node_modules/drizzle-orm/sql/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var sql_exports = {};
      module.exports = __toCommonJS(sql_exports);
      __reExport(sql_exports, require_expressions(), module.exports);
      __reExport(sql_exports, require_functions(), module.exports);
      __reExport(sql_exports, require_sql(), module.exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/columns/index.cjs
  var require_columns = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/columns/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var columns_exports = {};
      module.exports = __toCommonJS(columns_exports);
      __reExport(columns_exports, require_blob(), module.exports);
      __reExport(columns_exports, require_common2(), module.exports);
      __reExport(columns_exports, require_custom2(), module.exports);
      __reExport(columns_exports, require_integer2(), module.exports);
      __reExport(columns_exports, require_numeric2(), module.exports);
      __reExport(columns_exports, require_real2(), module.exports);
      __reExport(columns_exports, require_text2(), module.exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/view-base.cjs
  var require_view_base = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/view-base.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var view_base_exports = {};
      __export(view_base_exports, {
        SQLiteViewBase: () => SQLiteViewBase
      });
      module.exports = __toCommonJS(view_base_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var SQLiteViewBase = class extends import_sql2.View {
        static [import_entity.entityKind] = "SQLiteViewBase";
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/dialect.cjs
  var require_dialect = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/dialect.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var dialect_exports = {};
      __export(dialect_exports, {
        SQLiteAsyncDialect: () => SQLiteAsyncDialect,
        SQLiteDialect: () => SQLiteDialect,
        SQLiteSyncDialect: () => SQLiteSyncDialect
      });
      module.exports = __toCommonJS(dialect_exports);
      var import_alias = require_alias();
      var import_casing = require_casing();
      var import_column = require_column();
      var import_entity = require_entity();
      var import_errors = require_errors();
      var import_relations = require_relations();
      var import_sql2 = require_sql2();
      var import_sql22 = require_sql();
      var import_columns = require_columns();
      var import_table = require_table3();
      var import_subquery = require_subquery();
      var import_table2 = require_table();
      var import_utils = require_utils2();
      var import_view_common = require_view_common();
      var import_view_base = require_view_base();
      var SQLiteDialect = class {
        static [import_entity.entityKind] = "SQLiteDialect";
        /** @internal */
        casing;
        constructor(config) {
          this.casing = new import_casing.CasingCache(config?.casing);
        }
        escapeName(name) {
          return `"${name.replace(/"/g, '""')}"`;
        }
        escapeParam(_num) {
          return "?";
        }
        escapeString(str) {
          return `'${str.replace(/'/g, "''")}'`;
        }
        buildWithCTE(queries) {
          if (!queries?.length) return void 0;
          const withSqlChunks = [import_sql22.sql`with `];
          for (const [i, w] of queries.entries()) {
            withSqlChunks.push(import_sql22.sql`${import_sql22.sql.identifier(w._.alias)} as (${w._.sql})`);
            if (i < queries.length - 1) {
              withSqlChunks.push(import_sql22.sql`, `);
            }
          }
          withSqlChunks.push(import_sql22.sql` `);
          return import_sql22.sql.join(withSqlChunks);
        }
        buildDeleteQuery({
          table,
          where,
          returning,
          withList,
          limit,
          orderBy
        }) {
          const withSql = this.buildWithCTE(withList);
          const returningSql = returning ? import_sql22.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
          const whereSql = where ? import_sql22.sql` where ${where}` : void 0;
          const orderBySql = this.buildOrderBy(orderBy);
          const limitSql = this.buildLimit(limit);
          return import_sql22.sql`${withSql}delete from ${table}${whereSql}${returningSql}${orderBySql}${limitSql}`;
        }
        buildUpdateSet(table, set) {
          const tableColumns = table[import_table2.Table.Symbol.Columns];
          const columnNames = Object.keys(tableColumns).filter(
            (colName) => set[colName] !== void 0 || tableColumns[colName]?.onUpdateFn !== void 0
          );
          const setSize = columnNames.length;
          return import_sql22.sql.join(
            columnNames.flatMap((colName, i) => {
              const col = tableColumns[colName];
              const onUpdateFnResult = col.onUpdateFn?.();
              const value = set[colName] ?? ((0, import_entity.is)(onUpdateFnResult, import_sql22.SQL) ? onUpdateFnResult : import_sql22.sql.param(onUpdateFnResult, col));
              const res = import_sql22.sql`${import_sql22.sql.identifier(this.casing.getColumnCasing(col))} = ${value}`;
              if (i < setSize - 1) {
                return [res, import_sql22.sql.raw(", ")];
              }
              return [res];
            })
          );
        }
        buildUpdateQuery({
          table,
          set,
          where,
          returning,
          withList,
          joins,
          from,
          limit,
          orderBy
        }) {
          const withSql = this.buildWithCTE(withList);
          const setSql = this.buildUpdateSet(table, set);
          const fromSql = from && import_sql22.sql.join([import_sql22.sql.raw(" from "), this.buildFromTable(from)]);
          const joinsSql = this.buildJoins(joins);
          const returningSql = returning ? import_sql22.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
          const whereSql = where ? import_sql22.sql` where ${where}` : void 0;
          const orderBySql = this.buildOrderBy(orderBy);
          const limitSql = this.buildLimit(limit);
          return import_sql22.sql`${withSql}update ${table} set ${setSql}${fromSql}${joinsSql}${whereSql}${returningSql}${orderBySql}${limitSql}`;
        }
        /**
         * Builds selection SQL with provided fields/expressions
         *
         * Examples:
         *
         * `select <selection> from`
         *
         * `insert ... returning <selection>`
         *
         * If `isSingleTable` is true, then columns won't be prefixed with table name
         */
        buildSelection(fields, { isSingleTable = false } = {}) {
          const columnsLen = fields.length;
          const chunks = fields.flatMap(({ field }, i) => {
            const chunk = [];
            if ((0, import_entity.is)(field, import_sql22.SQL.Aliased) && field.isSelectionField) {
              chunk.push(import_sql22.sql.identifier(field.fieldAlias));
            } else if ((0, import_entity.is)(field, import_sql22.SQL.Aliased) || (0, import_entity.is)(field, import_sql22.SQL)) {
              const query = (0, import_entity.is)(field, import_sql22.SQL.Aliased) ? field.sql : field;
              if (isSingleTable) {
                chunk.push(
                  new import_sql22.SQL(
                    query.queryChunks.map((c) => {
                      if ((0, import_entity.is)(c, import_column.Column)) {
                        return import_sql22.sql.identifier(this.casing.getColumnCasing(c));
                      }
                      return c;
                    })
                  )
                );
              } else {
                chunk.push(query);
              }
              if ((0, import_entity.is)(field, import_sql22.SQL.Aliased)) {
                chunk.push(import_sql22.sql` as ${import_sql22.sql.identifier(field.fieldAlias)}`);
              }
            } else if ((0, import_entity.is)(field, import_column.Column)) {
              const tableName = field.table[import_table2.Table.Symbol.Name];
              if (field.columnType === "SQLiteNumericBigInt") {
                if (isSingleTable) {
                  chunk.push(
                    import_sql22.sql`cast(${import_sql22.sql.identifier(this.casing.getColumnCasing(field))} as text)`
                  );
                } else {
                  chunk.push(
                    import_sql22.sql`cast(${import_sql22.sql.identifier(tableName)}.${import_sql22.sql.identifier(this.casing.getColumnCasing(field))} as text)`
                  );
                }
              } else {
                if (isSingleTable) {
                  chunk.push(import_sql22.sql.identifier(this.casing.getColumnCasing(field)));
                } else {
                  chunk.push(
                    import_sql22.sql`${import_sql22.sql.identifier(tableName)}.${import_sql22.sql.identifier(this.casing.getColumnCasing(field))}`
                  );
                }
              }
            } else if ((0, import_entity.is)(field, import_subquery.Subquery)) {
              const entries = Object.entries(field._.selectedFields);
              if (entries.length === 1) {
                const entry = entries[0][1];
                const fieldDecoder = (0, import_entity.is)(entry, import_sql22.SQL) ? entry.decoder : (0, import_entity.is)(entry, import_column.Column) ? { mapFromDriverValue: (v) => entry.mapFromDriverValue(v) } : entry.sql.decoder;
                if (fieldDecoder) field._.sql.decoder = fieldDecoder;
              }
              chunk.push(field);
            }
            if (i < columnsLen - 1) {
              chunk.push(import_sql22.sql`, `);
            }
            return chunk;
          });
          return import_sql22.sql.join(chunks);
        }
        buildJoins(joins) {
          if (!joins || joins.length === 0) {
            return void 0;
          }
          const joinsArray = [];
          if (joins) {
            for (const [index, joinMeta] of joins.entries()) {
              if (index === 0) {
                joinsArray.push(import_sql22.sql` `);
              }
              const table = joinMeta.table;
              const onSql = joinMeta.on ? import_sql22.sql` on ${joinMeta.on}` : void 0;
              if ((0, import_entity.is)(table, import_table.SQLiteTable)) {
                const tableName = table[import_table.SQLiteTable.Symbol.Name];
                const tableSchema = table[import_table.SQLiteTable.Symbol.Schema];
                const origTableName = table[import_table.SQLiteTable.Symbol.OriginalName];
                const alias = tableName === origTableName ? void 0 : joinMeta.alias;
                joinsArray.push(
                  import_sql22.sql`${import_sql22.sql.raw(joinMeta.joinType)} join ${tableSchema ? import_sql22.sql`${import_sql22.sql.identifier(tableSchema)}.` : void 0}${import_sql22.sql.identifier(
                    origTableName
                  )}${alias && import_sql22.sql` ${import_sql22.sql.identifier(alias)}`}${onSql}`
                );
              } else {
                joinsArray.push(
                  import_sql22.sql`${import_sql22.sql.raw(joinMeta.joinType)} join ${table}${onSql}`
                );
              }
              if (index < joins.length - 1) {
                joinsArray.push(import_sql22.sql` `);
              }
            }
          }
          return import_sql22.sql.join(joinsArray);
        }
        buildLimit(limit) {
          return typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql22.sql` limit ${limit}` : void 0;
        }
        buildOrderBy(orderBy) {
          const orderByList = [];
          if (orderBy) {
            for (const [index, orderByValue] of orderBy.entries()) {
              orderByList.push(orderByValue);
              if (index < orderBy.length - 1) {
                orderByList.push(import_sql22.sql`, `);
              }
            }
          }
          return orderByList.length > 0 ? import_sql22.sql` order by ${import_sql22.sql.join(orderByList)}` : void 0;
        }
        buildFromTable(table) {
          if ((0, import_entity.is)(table, import_table2.Table) && table[import_table2.Table.Symbol.IsAlias]) {
            return import_sql22.sql`${import_sql22.sql`${import_sql22.sql.identifier(table[import_table2.Table.Symbol.Schema] ?? "")}.`.if(table[import_table2.Table.Symbol.Schema])}${import_sql22.sql.identifier(
              table[import_table2.Table.Symbol.OriginalName]
            )} ${import_sql22.sql.identifier(table[import_table2.Table.Symbol.Name])}`;
          }
          return table;
        }
        buildSelectQuery({
          withList,
          fields,
          fieldsFlat,
          where,
          having,
          table,
          joins,
          orderBy,
          groupBy,
          limit,
          offset,
          distinct,
          setOperators
        }) {
          const fieldsList = fieldsFlat ?? (0, import_utils.orderSelectedFields)(fields);
          for (const f of fieldsList) {
            if ((0, import_entity.is)(f.field, import_column.Column) && (0, import_table2.getTableName)(f.field.table) !== ((0, import_entity.is)(table, import_subquery.Subquery) ? table._.alias : (0, import_entity.is)(table, import_view_base.SQLiteViewBase) ? table[import_view_common.ViewBaseConfig].name : (0, import_entity.is)(table, import_sql22.SQL) ? void 0 : (0, import_table2.getTableName)(table)) && !((table2) => joins?.some(
              ({ alias }) => alias === (table2[import_table2.Table.Symbol.IsAlias] ? (0, import_table2.getTableName)(table2) : table2[import_table2.Table.Symbol.BaseName])
            ))(f.field.table)) {
              const tableName = (0, import_table2.getTableName)(f.field.table);
              throw new Error(
                `Your "${f.path.join(
                  "->"
                )}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
              );
            }
          }
          const isSingleTable = !joins || joins.length === 0;
          const withSql = this.buildWithCTE(withList);
          const distinctSql = distinct ? import_sql22.sql` distinct` : void 0;
          const selection = this.buildSelection(fieldsList, { isSingleTable });
          const tableSql = this.buildFromTable(table);
          const joinsSql = this.buildJoins(joins);
          const whereSql = where ? import_sql22.sql` where ${where}` : void 0;
          const havingSql = having ? import_sql22.sql` having ${having}` : void 0;
          const groupByList = [];
          if (groupBy) {
            for (const [index, groupByValue] of groupBy.entries()) {
              groupByList.push(groupByValue);
              if (index < groupBy.length - 1) {
                groupByList.push(import_sql22.sql`, `);
              }
            }
          }
          const groupBySql = groupByList.length > 0 ? import_sql22.sql` group by ${import_sql22.sql.join(groupByList)}` : void 0;
          const orderBySql = this.buildOrderBy(orderBy);
          const limitSql = this.buildLimit(limit);
          const offsetSql = offset ? import_sql22.sql` offset ${offset}` : void 0;
          const finalQuery = import_sql22.sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
          if (setOperators.length > 0) {
            return this.buildSetOperations(finalQuery, setOperators);
          }
          return finalQuery;
        }
        buildSetOperations(leftSelect, setOperators) {
          const [setOperator, ...rest] = setOperators;
          if (!setOperator) {
            throw new Error("Cannot pass undefined values to any set operator");
          }
          if (rest.length === 0) {
            return this.buildSetOperationQuery({ leftSelect, setOperator });
          }
          return this.buildSetOperations(
            this.buildSetOperationQuery({ leftSelect, setOperator }),
            rest
          );
        }
        buildSetOperationQuery({
          leftSelect,
          setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
        }) {
          const leftChunk = import_sql22.sql`${leftSelect.getSQL()} `;
          const rightChunk = import_sql22.sql`${rightSelect.getSQL()}`;
          let orderBySql;
          if (orderBy && orderBy.length > 0) {
            const orderByValues = [];
            for (const singleOrderBy of orderBy) {
              if ((0, import_entity.is)(singleOrderBy, import_columns.SQLiteColumn)) {
                orderByValues.push(import_sql22.sql.identifier(singleOrderBy.name));
              } else if ((0, import_entity.is)(singleOrderBy, import_sql22.SQL)) {
                for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
                  const chunk = singleOrderBy.queryChunks[i];
                  if ((0, import_entity.is)(chunk, import_columns.SQLiteColumn)) {
                    singleOrderBy.queryChunks[i] = import_sql22.sql.identifier(
                      this.casing.getColumnCasing(chunk)
                    );
                  }
                }
                orderByValues.push(import_sql22.sql`${singleOrderBy}`);
              } else {
                orderByValues.push(import_sql22.sql`${singleOrderBy}`);
              }
            }
            orderBySql = import_sql22.sql` order by ${import_sql22.sql.join(orderByValues, import_sql22.sql`, `)}`;
          }
          const limitSql = typeof limit === "object" || typeof limit === "number" && limit >= 0 ? import_sql22.sql` limit ${limit}` : void 0;
          const operatorChunk = import_sql22.sql.raw(`${type} ${isAll ? "all " : ""}`);
          const offsetSql = offset ? import_sql22.sql` offset ${offset}` : void 0;
          return import_sql22.sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
        }
        buildInsertQuery({
          table,
          values: valuesOrSelect,
          onConflict,
          returning,
          withList,
          select
        }) {
          const valuesSqlList = [];
          const columns = table[import_table2.Table.Symbol.Columns];
          const colEntries = Object.entries(columns).filter(
            ([_, col]) => !col.shouldDisableInsert()
          );
          const insertOrder = colEntries.map(([, column]) => import_sql22.sql.identifier(this.casing.getColumnCasing(column)));
          if (select) {
            const select2 = valuesOrSelect;
            if ((0, import_entity.is)(select2, import_sql22.SQL)) {
              valuesSqlList.push(select2);
            } else {
              valuesSqlList.push(select2.getSQL());
            }
          } else {
            const values = valuesOrSelect;
            valuesSqlList.push(import_sql22.sql.raw("values "));
            for (const [valueIndex, value] of values.entries()) {
              const valueList = [];
              for (const [fieldName, col] of colEntries) {
                const colValue = value[fieldName];
                if (colValue === void 0 || (0, import_entity.is)(colValue, import_sql22.Param) && colValue.value === void 0) {
                  let defaultValue;
                  if (col.default !== null && col.default !== void 0) {
                    defaultValue = (0, import_entity.is)(col.default, import_sql22.SQL) ? col.default : import_sql22.sql.param(col.default, col);
                  } else if (col.defaultFn !== void 0) {
                    const defaultFnResult = col.defaultFn();
                    defaultValue = (0, import_entity.is)(defaultFnResult, import_sql22.SQL) ? defaultFnResult : import_sql22.sql.param(defaultFnResult, col);
                  } else if (!col.default && col.onUpdateFn !== void 0) {
                    const onUpdateFnResult = col.onUpdateFn();
                    defaultValue = (0, import_entity.is)(onUpdateFnResult, import_sql22.SQL) ? onUpdateFnResult : import_sql22.sql.param(onUpdateFnResult, col);
                  } else {
                    defaultValue = import_sql22.sql`null`;
                  }
                  valueList.push(defaultValue);
                } else {
                  valueList.push(colValue);
                }
              }
              valuesSqlList.push(valueList);
              if (valueIndex < values.length - 1) {
                valuesSqlList.push(import_sql22.sql`, `);
              }
            }
          }
          const withSql = this.buildWithCTE(withList);
          const valuesSql = import_sql22.sql.join(valuesSqlList);
          const returningSql = returning ? import_sql22.sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
          const onConflictSql = onConflict?.length ? import_sql22.sql.join(onConflict) : void 0;
          return import_sql22.sql`${withSql}insert into ${table} ${insertOrder} ${valuesSql}${onConflictSql}${returningSql}`;
        }
        sqlToQuery(sql2, invokeSource) {
          return sql2.toQuery({
            casing: this.casing,
            escapeName: this.escapeName,
            escapeParam: this.escapeParam,
            escapeString: this.escapeString,
            invokeSource
          });
        }
        buildRelationalQuery({
          fullSchema,
          schema,
          tableNamesMap,
          table,
          tableConfig,
          queryConfig: config,
          tableAlias,
          nestedQueryRelation,
          joinOn
        }) {
          let selection = [];
          let limit, offset, orderBy = [], where;
          const joins = [];
          if (config === true) {
            const selectionEntries = Object.entries(tableConfig.columns);
            selection = selectionEntries.map(([key, value]) => ({
              dbKey: value.name,
              tsKey: key,
              field: (0, import_alias.aliasedTableColumn)(value, tableAlias),
              relationTableTsKey: void 0,
              isJson: false,
              selection: []
            }));
          } else {
            const aliasedColumns = Object.fromEntries(
              Object.entries(tableConfig.columns).map(([key, value]) => [
                key,
                (0, import_alias.aliasedTableColumn)(value, tableAlias)
              ])
            );
            if (config.where) {
              const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, (0, import_relations.getOperators)()) : config.where;
              where = whereSql && (0, import_alias.mapColumnsInSQLToAlias)(whereSql, tableAlias);
            }
            const fieldsSelection = [];
            let selectedColumns = [];
            if (config.columns) {
              let isIncludeMode = false;
              for (const [field, value] of Object.entries(config.columns)) {
                if (value === void 0) {
                  continue;
                }
                if (field in tableConfig.columns) {
                  if (!isIncludeMode && value === true) {
                    isIncludeMode = true;
                  }
                  selectedColumns.push(field);
                }
              }
              if (selectedColumns.length > 0) {
                selectedColumns = isIncludeMode ? selectedColumns.filter((c) => config.columns?.[c] === true) : Object.keys(tableConfig.columns).filter(
                  (key) => !selectedColumns.includes(key)
                );
              }
            } else {
              selectedColumns = Object.keys(tableConfig.columns);
            }
            for (const field of selectedColumns) {
              const column = tableConfig.columns[field];
              fieldsSelection.push({ tsKey: field, value: column });
            }
            let selectedRelations = [];
            if (config.with) {
              selectedRelations = Object.entries(config.with).filter(
                (entry) => !!entry[1]
              ).map(([tsKey, queryConfig]) => ({
                tsKey,
                queryConfig,
                relation: tableConfig.relations[tsKey]
              }));
            }
            let extras;
            if (config.extras) {
              extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql: import_sql22.sql }) : config.extras;
              for (const [tsKey, value] of Object.entries(extras)) {
                fieldsSelection.push({
                  tsKey,
                  value: (0, import_alias.mapColumnsInAliasedSQLToAlias)(value, tableAlias)
                });
              }
            }
            for (const { tsKey, value } of fieldsSelection) {
              selection.push({
                dbKey: (0, import_entity.is)(value, import_sql22.SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
                tsKey,
                field: (0, import_entity.is)(value, import_column.Column) ? (0, import_alias.aliasedTableColumn)(value, tableAlias) : value,
                relationTableTsKey: void 0,
                isJson: false,
                selection: []
              });
            }
            let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, (0, import_relations.getOrderByOperators)()) : config.orderBy ?? [];
            if (!Array.isArray(orderByOrig)) {
              orderByOrig = [orderByOrig];
            }
            orderBy = orderByOrig.map((orderByValue) => {
              if ((0, import_entity.is)(orderByValue, import_column.Column)) {
                return (0, import_alias.aliasedTableColumn)(orderByValue, tableAlias);
              }
              return (0, import_alias.mapColumnsInSQLToAlias)(orderByValue, tableAlias);
            });
            limit = config.limit;
            offset = config.offset;
            for (const {
              tsKey: selectedRelationTsKey,
              queryConfig: selectedRelationConfigValue,
              relation
            } of selectedRelations) {
              const normalizedRelation = (0, import_relations.normalizeRelation)(
                schema,
                tableNamesMap,
                relation
              );
              const relationTableName = (0, import_table2.getTableUniqueName)(relation.referencedTable);
              const relationTableTsName = tableNamesMap[relationTableName];
              const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
              const joinOn2 = (0, import_sql2.and)(
                ...normalizedRelation.fields.map(
                  (field2, i) => (0, import_sql2.eq)(
                    (0, import_alias.aliasedTableColumn)(
                      normalizedRelation.references[i],
                      relationTableAlias
                    ),
                    (0, import_alias.aliasedTableColumn)(field2, tableAlias)
                  )
                )
              );
              const builtRelation = this.buildRelationalQuery({
                fullSchema,
                schema,
                tableNamesMap,
                table: fullSchema[relationTableTsName],
                tableConfig: schema[relationTableTsName],
                queryConfig: (0, import_entity.is)(relation, import_relations.One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
                tableAlias: relationTableAlias,
                joinOn: joinOn2,
                nestedQueryRelation: relation
              });
              const field = import_sql22.sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
              selection.push({
                dbKey: selectedRelationTsKey,
                tsKey: selectedRelationTsKey,
                field,
                relationTableTsKey: relationTableTsName,
                isJson: true,
                selection: builtRelation.selection
              });
            }
          }
          if (selection.length === 0) {
            throw new import_errors.DrizzleError({
              message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
            });
          }
          let result;
          where = (0, import_sql2.and)(joinOn, where);
          if (nestedQueryRelation) {
            let field = import_sql22.sql`json_array(${import_sql22.sql.join(
              selection.map(
                ({ field: field2 }) => (0, import_entity.is)(field2, import_columns.SQLiteColumn) ? import_sql22.sql.identifier(this.casing.getColumnCasing(field2)) : (0, import_entity.is)(field2, import_sql22.SQL.Aliased) ? field2.sql : field2
              ),
              import_sql22.sql`, `
            )})`;
            if ((0, import_entity.is)(nestedQueryRelation, import_relations.Many)) {
              field = import_sql22.sql`coalesce(json_group_array(${field}), json_array())`;
            }
            const nestedSelection = [
              {
                dbKey: "data",
                tsKey: "data",
                field: field.as("data"),
                isJson: true,
                relationTableTsKey: tableConfig.tsName,
                selection
              }
            ];
            const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
            if (needsSubquery) {
              result = this.buildSelectQuery({
                table: (0, import_alias.aliasedTable)(table, tableAlias),
                fields: {},
                fieldsFlat: [
                  {
                    path: [],
                    field: import_sql22.sql.raw("*")
                  }
                ],
                where,
                limit,
                offset,
                orderBy,
                setOperators: []
              });
              where = void 0;
              limit = void 0;
              offset = void 0;
              orderBy = void 0;
            } else {
              result = (0, import_alias.aliasedTable)(table, tableAlias);
            }
            result = this.buildSelectQuery({
              table: (0, import_entity.is)(result, import_table.SQLiteTable) ? result : new import_subquery.Subquery(result, {}, tableAlias),
              fields: {},
              fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
                path: [],
                field: (0, import_entity.is)(field2, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field2, tableAlias) : field2
              })),
              joins,
              where,
              limit,
              offset,
              orderBy,
              setOperators: []
            });
          } else {
            result = this.buildSelectQuery({
              table: (0, import_alias.aliasedTable)(table, tableAlias),
              fields: {},
              fieldsFlat: selection.map(({ field }) => ({
                path: [],
                field: (0, import_entity.is)(field, import_column.Column) ? (0, import_alias.aliasedTableColumn)(field, tableAlias) : field
              })),
              joins,
              where,
              limit,
              offset,
              orderBy,
              setOperators: []
            });
          }
          return {
            tableTsKey: tableConfig.tsName,
            sql: result,
            selection
          };
        }
      };
      var SQLiteSyncDialect = class extends SQLiteDialect {
        static [import_entity.entityKind] = "SQLiteSyncDialect";
        migrate(migrations, session, config) {
          const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
          const migrationTableCreate = import_sql22.sql`
			CREATE TABLE IF NOT EXISTS ${import_sql22.sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
          session.run(migrationTableCreate);
          const dbMigrations = session.values(
            import_sql22.sql`SELECT id, hash, created_at FROM ${import_sql22.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
          );
          const lastDbMigration = dbMigrations[0] ?? void 0;
          session.run(import_sql22.sql`BEGIN`);
          try {
            for (const migration of migrations) {
              if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
                for (const stmt of migration.sql) {
                  session.run(import_sql22.sql.raw(stmt));
                }
                session.run(
                  import_sql22.sql`INSERT INTO ${import_sql22.sql.identifier(
                    migrationsTable
                  )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
                );
              }
            }
            session.run(import_sql22.sql`COMMIT`);
          } catch (e) {
            session.run(import_sql22.sql`ROLLBACK`);
            throw e;
          }
        }
      };
      var SQLiteAsyncDialect = class extends SQLiteDialect {
        static [import_entity.entityKind] = "SQLiteAsyncDialect";
        async migrate(migrations, session, config) {
          const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
          const migrationTableCreate = import_sql22.sql`
			CREATE TABLE IF NOT EXISTS ${import_sql22.sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
          await session.run(migrationTableCreate);
          const dbMigrations = await session.values(
            import_sql22.sql`SELECT id, hash, created_at FROM ${import_sql22.sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
          );
          const lastDbMigration = dbMigrations[0] ?? void 0;
          await session.transaction(async (tx) => {
            for (const migration of migrations) {
              if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
                for (const stmt of migration.sql) {
                  await tx.run(import_sql22.sql.raw(stmt));
                }
                await tx.run(
                  import_sql22.sql`INSERT INTO ${import_sql22.sql.identifier(
                    migrationsTable
                  )} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
                );
              }
            }
          });
        }
      };
    }
  });

  // node_modules/drizzle-orm/query-builders/query-builder.cjs
  var require_query_builder = __commonJS({
    "node_modules/drizzle-orm/query-builders/query-builder.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var query_builder_exports = {};
      __export(query_builder_exports, {
        TypedQueryBuilder: () => TypedQueryBuilder
      });
      module.exports = __toCommonJS(query_builder_exports);
      var import_entity = require_entity();
      var TypedQueryBuilder = class {
        static [import_entity.entityKind] = "TypedQueryBuilder";
        /** @internal */
        getSelectedFields() {
          return this._.selectedFields;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/select.cjs
  var require_select2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/select.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except2, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except2)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var select_exports = {};
      __export(select_exports, {
        SQLiteSelectBase: () => SQLiteSelectBase,
        SQLiteSelectBuilder: () => SQLiteSelectBuilder,
        SQLiteSelectQueryBuilderBase: () => SQLiteSelectQueryBuilderBase,
        except: () => except,
        intersect: () => intersect,
        union: () => union,
        unionAll: () => unionAll
      });
      module.exports = __toCommonJS(select_exports);
      var import_entity = require_entity();
      var import_query_builder = require_query_builder();
      var import_query_promise = require_query_promise();
      var import_selection_proxy = require_selection_proxy();
      var import_sql2 = require_sql();
      var import_subquery = require_subquery();
      var import_table = require_table();
      var import_utils = require_utils2();
      var import_view_common = require_view_common();
      var import_utils2 = require_utils4();
      var import_view_base = require_view_base();
      var SQLiteSelectBuilder = class {
        static [import_entity.entityKind] = "SQLiteSelectBuilder";
        fields;
        session;
        dialect;
        withList;
        distinct;
        constructor(config) {
          this.fields = config.fields;
          this.session = config.session;
          this.dialect = config.dialect;
          this.withList = config.withList;
          this.distinct = config.distinct;
        }
        from(source) {
          const isPartialSelect = !!this.fields;
          let fields;
          if (this.fields) {
            fields = this.fields;
          } else if ((0, import_entity.is)(source, import_subquery.Subquery)) {
            fields = Object.fromEntries(
              Object.keys(source._.selectedFields).map((key) => [key, source[key]])
            );
          } else if ((0, import_entity.is)(source, import_view_base.SQLiteViewBase)) {
            fields = source[import_view_common.ViewBaseConfig].selectedFields;
          } else if ((0, import_entity.is)(source, import_sql2.SQL)) {
            fields = {};
          } else {
            fields = (0, import_utils.getTableColumns)(source);
          }
          return new SQLiteSelectBase({
            table: source,
            fields,
            isPartialSelect,
            session: this.session,
            dialect: this.dialect,
            withList: this.withList,
            distinct: this.distinct
          });
        }
      };
      var SQLiteSelectQueryBuilderBase = class extends import_query_builder.TypedQueryBuilder {
        static [import_entity.entityKind] = "SQLiteSelectQueryBuilder";
        _;
        /** @internal */
        config;
        joinsNotNullableMap;
        tableName;
        isPartialSelect;
        session;
        dialect;
        cacheConfig = void 0;
        usedTables = /* @__PURE__ */ new Set();
        constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
          super();
          this.config = {
            withList,
            table,
            fields: { ...fields },
            distinct,
            setOperators: []
          };
          this.isPartialSelect = isPartialSelect;
          this.session = session;
          this.dialect = dialect;
          this._ = {
            selectedFields: fields,
            config: this.config
          };
          this.tableName = (0, import_utils.getTableLikeName)(table);
          this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
          for (const item of (0, import_utils2.extractUsedTable)(table)) this.usedTables.add(item);
        }
        /** @internal */
        getUsedTables() {
          return [...this.usedTables];
        }
        createJoin(joinType) {
          return (table, on) => {
            const baseTableName = this.tableName;
            const tableName = (0, import_utils.getTableLikeName)(table);
            for (const item of (0, import_utils2.extractUsedTable)(table)) this.usedTables.add(item);
            if (typeof tableName === "string" && this.config.joins?.some((join) => join.alias === tableName)) {
              throw new Error(`Alias "${tableName}" is already used in this query`);
            }
            if (!this.isPartialSelect) {
              if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
                this.config.fields = {
                  [baseTableName]: this.config.fields
                };
              }
              if (typeof tableName === "string" && !(0, import_entity.is)(table, import_sql2.SQL)) {
                const selection = (0, import_entity.is)(table, import_subquery.Subquery) ? table._.selectedFields : (0, import_entity.is)(table, import_sql2.View) ? table[import_view_common.ViewBaseConfig].selectedFields : table[import_table.Table.Symbol.Columns];
                this.config.fields[tableName] = selection;
              }
            }
            if (typeof on === "function") {
              on = on(
                new Proxy(
                  this.config.fields,
                  new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
                )
              );
            }
            if (!this.config.joins) {
              this.config.joins = [];
            }
            this.config.joins.push({ on, table, joinType, alias: tableName });
            if (typeof tableName === "string") {
              switch (joinType) {
                case "left": {
                  this.joinsNotNullableMap[tableName] = false;
                  break;
                }
                case "right": {
                  this.joinsNotNullableMap = Object.fromEntries(
                    Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                  );
                  this.joinsNotNullableMap[tableName] = true;
                  break;
                }
                case "cross":
                case "inner": {
                  this.joinsNotNullableMap[tableName] = true;
                  break;
                }
                case "full": {
                  this.joinsNotNullableMap = Object.fromEntries(
                    Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
                  );
                  this.joinsNotNullableMap[tableName] = false;
                  break;
                }
              }
            }
            return this;
          };
        }
        /**
         * Executes a `left join` operation by adding another table to the current query.
         *
         * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
         *
         * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
         *
         * @param table the table to join.
         * @param on the `on` clause.
         *
         * @example
         *
         * ```ts
         * // Select all users and their pets
         * const usersWithPets: { user: User; pets: Pet | null; }[] = await db.select()
         *   .from(users)
         *   .leftJoin(pets, eq(users.id, pets.ownerId))
         *
         * // Select userId and petId
         * const usersIdsAndPetIds: { userId: number; petId: number | null; }[] = await db.select({
         *   userId: users.id,
         *   petId: pets.id,
         * })
         *   .from(users)
         *   .leftJoin(pets, eq(users.id, pets.ownerId))
         * ```
         */
        leftJoin = this.createJoin("left");
        /**
         * Executes a `right join` operation by adding another table to the current query.
         *
         * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
         *
         * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
         *
         * @param table the table to join.
         * @param on the `on` clause.
         *
         * @example
         *
         * ```ts
         * // Select all users and their pets
         * const usersWithPets: { user: User | null; pets: Pet; }[] = await db.select()
         *   .from(users)
         *   .rightJoin(pets, eq(users.id, pets.ownerId))
         *
         * // Select userId and petId
         * const usersIdsAndPetIds: { userId: number | null; petId: number; }[] = await db.select({
         *   userId: users.id,
         *   petId: pets.id,
         * })
         *   .from(users)
         *   .rightJoin(pets, eq(users.id, pets.ownerId))
         * ```
         */
        rightJoin = this.createJoin("right");
        /**
         * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
         *
         * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
         *
         * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
         *
         * @param table the table to join.
         * @param on the `on` clause.
         *
         * @example
         *
         * ```ts
         * // Select all users and their pets
         * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
         *   .from(users)
         *   .innerJoin(pets, eq(users.id, pets.ownerId))
         *
         * // Select userId and petId
         * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
         *   userId: users.id,
         *   petId: pets.id,
         * })
         *   .from(users)
         *   .innerJoin(pets, eq(users.id, pets.ownerId))
         * ```
         */
        innerJoin = this.createJoin("inner");
        /**
         * Executes a `full join` operation by combining rows from two tables into a new table.
         *
         * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
         *
         * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
         *
         * @param table the table to join.
         * @param on the `on` clause.
         *
         * @example
         *
         * ```ts
         * // Select all users and their pets
         * const usersWithPets: { user: User | null; pets: Pet | null; }[] = await db.select()
         *   .from(users)
         *   .fullJoin(pets, eq(users.id, pets.ownerId))
         *
         * // Select userId and petId
         * const usersIdsAndPetIds: { userId: number | null; petId: number | null; }[] = await db.select({
         *   userId: users.id,
         *   petId: pets.id,
         * })
         *   .from(users)
         *   .fullJoin(pets, eq(users.id, pets.ownerId))
         * ```
         */
        fullJoin = this.createJoin("full");
        /**
         * Executes a `cross join` operation by combining rows from two tables into a new table.
         *
         * Calling this method retrieves all rows from both main and joined tables, merging all rows from each table.
         *
         * See docs: {@link https://orm.drizzle.team/docs/joins#cross-join}
         *
         * @param table the table to join.
         *
         * @example
         *
         * ```ts
         * // Select all users, each user with every pet
         * const usersWithPets: { user: User; pets: Pet; }[] = await db.select()
         *   .from(users)
         *   .crossJoin(pets)
         *
         * // Select userId and petId
         * const usersIdsAndPetIds: { userId: number; petId: number; }[] = await db.select({
         *   userId: users.id,
         *   petId: pets.id,
         * })
         *   .from(users)
         *   .crossJoin(pets)
         * ```
         */
        crossJoin = this.createJoin("cross");
        createSetOperator(type, isAll) {
          return (rightSelection) => {
            const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
            if (!(0, import_utils.haveSameKeys)(this.getSelectedFields(), rightSelect.getSelectedFields())) {
              throw new Error(
                "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
              );
            }
            this.config.setOperators.push({ type, isAll, rightSelect });
            return this;
          };
        }
        /**
         * Adds `union` set operator to the query.
         *
         * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
         *
         * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
         *
         * @example
         *
         * ```ts
         * // Select all unique names from customers and users tables
         * await db.select({ name: users.name })
         *   .from(users)
         *   .union(
         *     db.select({ name: customers.name }).from(customers)
         *   );
         * // or
         * import { union } from 'drizzle-orm/sqlite-core'
         *
         * await union(
         *   db.select({ name: users.name }).from(users),
         *   db.select({ name: customers.name }).from(customers)
         * );
         * ```
         */
        union = this.createSetOperator("union", false);
        /**
         * Adds `union all` set operator to the query.
         *
         * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
         *
         * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
         *
         * @example
         *
         * ```ts
         * // Select all transaction ids from both online and in-store sales
         * await db.select({ transaction: onlineSales.transactionId })
         *   .from(onlineSales)
         *   .unionAll(
         *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
         *   );
         * // or
         * import { unionAll } from 'drizzle-orm/sqlite-core'
         *
         * await unionAll(
         *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
         *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
         * );
         * ```
         */
        unionAll = this.createSetOperator("union", true);
        /**
         * Adds `intersect` set operator to the query.
         *
         * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
         *
         * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
         *
         * @example
         *
         * ```ts
         * // Select course names that are offered in both departments A and B
         * await db.select({ courseName: depA.courseName })
         *   .from(depA)
         *   .intersect(
         *     db.select({ courseName: depB.courseName }).from(depB)
         *   );
         * // or
         * import { intersect } from 'drizzle-orm/sqlite-core'
         *
         * await intersect(
         *   db.select({ courseName: depA.courseName }).from(depA),
         *   db.select({ courseName: depB.courseName }).from(depB)
         * );
         * ```
         */
        intersect = this.createSetOperator("intersect", false);
        /**
         * Adds `except` set operator to the query.
         *
         * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
         *
         * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
         *
         * @example
         *
         * ```ts
         * // Select all courses offered in department A but not in department B
         * await db.select({ courseName: depA.courseName })
         *   .from(depA)
         *   .except(
         *     db.select({ courseName: depB.courseName }).from(depB)
         *   );
         * // or
         * import { except } from 'drizzle-orm/sqlite-core'
         *
         * await except(
         *   db.select({ courseName: depA.courseName }).from(depA),
         *   db.select({ courseName: depB.courseName }).from(depB)
         * );
         * ```
         */
        except = this.createSetOperator("except", false);
        /** @internal */
        addSetOperators(setOperators) {
          this.config.setOperators.push(...setOperators);
          return this;
        }
        /**
         * Adds a `where` clause to the query.
         *
         * Calling this method will select only those rows that fulfill a specified condition.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
         *
         * @param where the `where` clause.
         *
         * @example
         * You can use conditional operators and `sql function` to filter the rows to be selected.
         *
         * ```ts
         * // Select all cars with green color
         * await db.select().from(cars).where(eq(cars.color, 'green'));
         * // or
         * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
         * ```
         *
         * You can logically combine conditional operators with `and()` and `or()` operators:
         *
         * ```ts
         * // Select all BMW cars with a green color
         * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
         *
         * // Select all cars with the green or blue color
         * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
         * ```
         */
        where(where) {
          if (typeof where === "function") {
            where = where(
              new Proxy(
                this.config.fields,
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          this.config.where = where;
          return this;
        }
        /**
         * Adds a `having` clause to the query.
         *
         * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
         *
         * @param having the `having` clause.
         *
         * @example
         *
         * ```ts
         * // Select all brands with more than one car
         * await db.select({
         * 	brand: cars.brand,
         * 	count: sql<number>`cast(count(${cars.id}) as int)`,
         * })
         *   .from(cars)
         *   .groupBy(cars.brand)
         *   .having(({ count }) => gt(count, 1));
         * ```
         */
        having(having) {
          if (typeof having === "function") {
            having = having(
              new Proxy(
                this.config.fields,
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
              )
            );
          }
          this.config.having = having;
          return this;
        }
        groupBy(...columns) {
          if (typeof columns[0] === "function") {
            const groupBy = columns[0](
              new Proxy(
                this.config.fields,
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
              )
            );
            this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
          } else {
            this.config.groupBy = columns;
          }
          return this;
        }
        orderBy(...columns) {
          if (typeof columns[0] === "function") {
            const orderBy = columns[0](
              new Proxy(
                this.config.fields,
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
              )
            );
            const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
            if (this.config.setOperators.length > 0) {
              this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
              this.config.orderBy = orderByArray;
            }
          } else {
            const orderByArray = columns;
            if (this.config.setOperators.length > 0) {
              this.config.setOperators.at(-1).orderBy = orderByArray;
            } else {
              this.config.orderBy = orderByArray;
            }
          }
          return this;
        }
        /**
         * Adds a `limit` clause to the query.
         *
         * Calling this method will set the maximum number of rows that will be returned by this query.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
         *
         * @param limit the `limit` clause.
         *
         * @example
         *
         * ```ts
         * // Get the first 10 people from this query.
         * await db.select().from(people).limit(10);
         * ```
         */
        limit(limit) {
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).limit = limit;
          } else {
            this.config.limit = limit;
          }
          return this;
        }
        /**
         * Adds an `offset` clause to the query.
         *
         * Calling this method will skip a number of rows when returning results from this query.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
         *
         * @param offset the `offset` clause.
         *
         * @example
         *
         * ```ts
         * // Get the 10th-20th people from this query.
         * await db.select().from(people).offset(10).limit(10);
         * ```
         */
        offset(offset) {
          if (this.config.setOperators.length > 0) {
            this.config.setOperators.at(-1).offset = offset;
          } else {
            this.config.offset = offset;
          }
          return this;
        }
        /** @internal */
        getSQL() {
          return this.dialect.buildSelectQuery(this.config);
        }
        toSQL() {
          const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
          return rest;
        }
        as(alias) {
          const usedTables = [];
          usedTables.push(...(0, import_utils2.extractUsedTable)(this.config.table));
          if (this.config.joins) {
            for (const it of this.config.joins) usedTables.push(...(0, import_utils2.extractUsedTable)(it.table));
          }
          return new Proxy(
            new import_subquery.Subquery(this.getSQL(), this.config.fields, alias, false, [...new Set(usedTables)]),
            new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }
        /** @internal */
        getSelectedFields() {
          return new Proxy(
            this.config.fields,
            new import_selection_proxy.SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
          );
        }
        $dynamic() {
          return this;
        }
      };
      var SQLiteSelectBase = class extends SQLiteSelectQueryBuilderBase {
        static [import_entity.entityKind] = "SQLiteSelect";
        /** @internal */
        _prepare(isOneTimeQuery = true) {
          if (!this.session) {
            throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
          }
          const fieldsList = (0, import_utils.orderSelectedFields)(this.config.fields);
          const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
            this.dialect.sqlToQuery(this.getSQL()),
            fieldsList,
            "all",
            true,
            void 0,
            {
              type: "select",
              tables: [...this.usedTables]
            },
            this.cacheConfig
          );
          query.joinsNotNullableMap = this.joinsNotNullableMap;
          return query;
        }
        $withCache(config) {
          this.cacheConfig = config === void 0 ? { config: {}, enable: true, autoInvalidate: true } : config === false ? { enable: false } : { enable: true, autoInvalidate: true, ...config };
          return this;
        }
        prepare() {
          return this._prepare(false);
        }
        run = (placeholderValues) => {
          return this._prepare().run(placeholderValues);
        };
        all = (placeholderValues) => {
          return this._prepare().all(placeholderValues);
        };
        get = (placeholderValues) => {
          return this._prepare().get(placeholderValues);
        };
        values = (placeholderValues) => {
          return this._prepare().values(placeholderValues);
        };
        async execute() {
          return this.all();
        }
      };
      (0, import_utils.applyMixins)(SQLiteSelectBase, [import_query_promise.QueryPromise]);
      function createSetOperator(type, isAll) {
        return (leftSelect, rightSelect, ...restSelects) => {
          const setOperators = [rightSelect, ...restSelects].map((select) => ({
            type,
            isAll,
            rightSelect: select
          }));
          for (const setOperator of setOperators) {
            if (!(0, import_utils.haveSameKeys)(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
              throw new Error(
                "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
              );
            }
          }
          return leftSelect.addSetOperators(setOperators);
        };
      }
      var getSQLiteSetOperators = () => ({
        union,
        unionAll,
        intersect,
        except
      });
      var union = createSetOperator("union", false);
      var unionAll = createSetOperator("union", true);
      var intersect = createSetOperator("intersect", false);
      var except = createSetOperator("except", false);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.cjs
  var require_query_builder2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/query-builder.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var query_builder_exports = {};
      __export(query_builder_exports, {
        QueryBuilder: () => QueryBuilder
      });
      module.exports = __toCommonJS(query_builder_exports);
      var import_entity = require_entity();
      var import_selection_proxy = require_selection_proxy();
      var import_dialect = require_dialect();
      var import_subquery = require_subquery();
      var import_select = require_select2();
      var QueryBuilder = class {
        static [import_entity.entityKind] = "SQLiteQueryBuilder";
        dialect;
        dialectConfig;
        constructor(dialect) {
          this.dialect = (0, import_entity.is)(dialect, import_dialect.SQLiteDialect) ? dialect : void 0;
          this.dialectConfig = (0, import_entity.is)(dialect, import_dialect.SQLiteDialect) ? void 0 : dialect;
        }
        $with = (alias, selection) => {
          const queryBuilder = this;
          const as = (qb) => {
            if (typeof qb === "function") {
              qb = qb(queryBuilder);
            }
            return new Proxy(
              new import_subquery.WithSubquery(
                qb.getSQL(),
                selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
                alias,
                true
              ),
              new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
            );
          };
          return { as };
        };
        with(...queries) {
          const self2 = this;
          function select(fields) {
            return new import_select.SQLiteSelectBuilder({
              fields: fields ?? void 0,
              session: void 0,
              dialect: self2.getDialect(),
              withList: queries
            });
          }
          function selectDistinct(fields) {
            return new import_select.SQLiteSelectBuilder({
              fields: fields ?? void 0,
              session: void 0,
              dialect: self2.getDialect(),
              withList: queries,
              distinct: true
            });
          }
          return { select, selectDistinct };
        }
        select(fields) {
          return new import_select.SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
        }
        selectDistinct(fields) {
          return new import_select.SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: void 0,
            dialect: this.getDialect(),
            distinct: true
          });
        }
        // Lazy load dialect to avoid circular dependency
        getDialect() {
          if (!this.dialect) {
            this.dialect = new import_dialect.SQLiteSyncDialect(this.dialectConfig);
          }
          return this.dialect;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/insert.cjs
  var require_insert = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/insert.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var insert_exports = {};
      __export(insert_exports, {
        SQLiteInsertBase: () => SQLiteInsertBase,
        SQLiteInsertBuilder: () => SQLiteInsertBuilder
      });
      module.exports = __toCommonJS(insert_exports);
      var import_entity = require_entity();
      var import_query_promise = require_query_promise();
      var import_sql2 = require_sql();
      var import_table = require_table3();
      var import_table2 = require_table();
      var import_utils = require_utils2();
      var import_utils2 = require_utils4();
      var import_query_builder = require_query_builder2();
      var SQLiteInsertBuilder = class {
        constructor(table, session, dialect, withList) {
          this.table = table;
          this.session = session;
          this.dialect = dialect;
          this.withList = withList;
        }
        static [import_entity.entityKind] = "SQLiteInsertBuilder";
        values(values) {
          values = Array.isArray(values) ? values : [values];
          if (values.length === 0) {
            throw new Error("values() must be called with at least one value");
          }
          const mappedValues = values.map((entry) => {
            const result = {};
            const cols = this.table[import_table2.Table.Symbol.Columns];
            for (const colKey of Object.keys(entry)) {
              const colValue = entry[colKey];
              result[colKey] = (0, import_entity.is)(colValue, import_sql2.SQL) ? colValue : new import_sql2.Param(colValue, cols[colKey]);
            }
            return result;
          });
          return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
        }
        select(selectQuery) {
          const select = typeof selectQuery === "function" ? selectQuery(new import_query_builder.QueryBuilder()) : selectQuery;
          if (!(0, import_entity.is)(select, import_sql2.SQL) && !(0, import_utils.haveSameKeys)(this.table[import_table2.Columns], select._.selectedFields)) {
            throw new Error(
              "Insert select error: selected fields are not the same or are in a different order compared to the table definition"
            );
          }
          return new SQLiteInsertBase(this.table, select, this.session, this.dialect, this.withList, true);
        }
      };
      var SQLiteInsertBase = class extends import_query_promise.QueryPromise {
        constructor(table, values, session, dialect, withList, select) {
          super();
          this.session = session;
          this.dialect = dialect;
          this.config = { table, values, withList, select };
        }
        static [import_entity.entityKind] = "SQLiteInsert";
        /** @internal */
        config;
        returning(fields = this.config.table[import_table.SQLiteTable.Symbol.Columns]) {
          this.config.returning = (0, import_utils.orderSelectedFields)(fields);
          return this;
        }
        /**
         * Adds an `on conflict do nothing` clause to the query.
         *
         * Calling this method simply avoids inserting a row as its alternative action.
         *
         * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
         *
         * @param config The `target` and `where` clauses.
         *
         * @example
         * ```ts
         * // Insert one row and cancel the insert if there's a conflict
         * await db.insert(cars)
         *   .values({ id: 1, brand: 'BMW' })
         *   .onConflictDoNothing();
         *
         * // Explicitly specify conflict target
         * await db.insert(cars)
         *   .values({ id: 1, brand: 'BMW' })
         *   .onConflictDoNothing({ target: cars.id });
         * ```
         */
        onConflictDoNothing(config = {}) {
          if (!this.config.onConflict) this.config.onConflict = [];
          if (config.target === void 0) {
            this.config.onConflict.push(import_sql2.sql` on conflict do nothing`);
          } else {
            const targetSql = Array.isArray(config.target) ? import_sql2.sql`${config.target}` : import_sql2.sql`${[config.target]}`;
            const whereSql = config.where ? import_sql2.sql` where ${config.where}` : import_sql2.sql``;
            this.config.onConflict.push(import_sql2.sql` on conflict ${targetSql} do nothing${whereSql}`);
          }
          return this;
        }
        /**
         * Adds an `on conflict do update` clause to the query.
         *
         * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
         *
         * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
         *
         * @param config The `target`, `set` and `where` clauses.
         *
         * @example
         * ```ts
         * // Update the row if there's a conflict
         * await db.insert(cars)
         *   .values({ id: 1, brand: 'BMW' })
         *   .onConflictDoUpdate({
         *     target: cars.id,
         *     set: { brand: 'Porsche' }
         *   });
         *
         * // Upsert with 'where' clause
         * await db.insert(cars)
         *   .values({ id: 1, brand: 'BMW' })
         *   .onConflictDoUpdate({
         *     target: cars.id,
         *     set: { brand: 'newBMW' },
         *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
         *   });
         * ```
         */
        onConflictDoUpdate(config) {
          if (config.where && (config.targetWhere || config.setWhere)) {
            throw new Error(
              'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
            );
          }
          if (!this.config.onConflict) this.config.onConflict = [];
          const whereSql = config.where ? import_sql2.sql` where ${config.where}` : void 0;
          const targetWhereSql = config.targetWhere ? import_sql2.sql` where ${config.targetWhere}` : void 0;
          const setWhereSql = config.setWhere ? import_sql2.sql` where ${config.setWhere}` : void 0;
          const targetSql = Array.isArray(config.target) ? import_sql2.sql`${config.target}` : import_sql2.sql`${[config.target]}`;
          const setSql = this.dialect.buildUpdateSet(this.config.table, (0, import_utils.mapUpdateSet)(this.config.table, config.set));
          this.config.onConflict.push(
            import_sql2.sql` on conflict ${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`
          );
          return this;
        }
        /** @internal */
        getSQL() {
          return this.dialect.buildInsertQuery(this.config);
        }
        toSQL() {
          const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
          return rest;
        }
        /** @internal */
        _prepare(isOneTimeQuery = true) {
          return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
            this.dialect.sqlToQuery(this.getSQL()),
            this.config.returning,
            this.config.returning ? "all" : "run",
            true,
            void 0,
            {
              type: "insert",
              tables: (0, import_utils2.extractUsedTable)(this.config.table)
            }
          );
        }
        prepare() {
          return this._prepare(false);
        }
        run = (placeholderValues) => {
          return this._prepare().run(placeholderValues);
        };
        all = (placeholderValues) => {
          return this._prepare().all(placeholderValues);
        };
        get = (placeholderValues) => {
          return this._prepare().get(placeholderValues);
        };
        values = (placeholderValues) => {
          return this._prepare().values(placeholderValues);
        };
        async execute() {
          return this.config.returning ? this.all() : this.run();
        }
        $dynamic() {
          return this;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/select.types.cjs
  var require_select_types = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/select.types.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var select_types_exports = {};
      module.exports = __toCommonJS(select_types_exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/update.cjs
  var require_update = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/update.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var update_exports = {};
      __export(update_exports, {
        SQLiteUpdateBase: () => SQLiteUpdateBase,
        SQLiteUpdateBuilder: () => SQLiteUpdateBuilder
      });
      module.exports = __toCommonJS(update_exports);
      var import_entity = require_entity();
      var import_query_promise = require_query_promise();
      var import_selection_proxy = require_selection_proxy();
      var import_table = require_table3();
      var import_subquery = require_subquery();
      var import_table2 = require_table();
      var import_utils = require_utils2();
      var import_view_common = require_view_common();
      var import_utils2 = require_utils4();
      var import_view_base = require_view_base();
      var SQLiteUpdateBuilder = class {
        constructor(table, session, dialect, withList) {
          this.table = table;
          this.session = session;
          this.dialect = dialect;
          this.withList = withList;
        }
        static [import_entity.entityKind] = "SQLiteUpdateBuilder";
        set(values) {
          return new SQLiteUpdateBase(
            this.table,
            (0, import_utils.mapUpdateSet)(this.table, values),
            this.session,
            this.dialect,
            this.withList
          );
        }
      };
      var SQLiteUpdateBase = class extends import_query_promise.QueryPromise {
        constructor(table, set, session, dialect, withList) {
          super();
          this.session = session;
          this.dialect = dialect;
          this.config = { set, table, withList, joins: [] };
        }
        static [import_entity.entityKind] = "SQLiteUpdate";
        /** @internal */
        config;
        from(source) {
          this.config.from = source;
          return this;
        }
        createJoin(joinType) {
          return (table, on) => {
            const tableName = (0, import_utils.getTableLikeName)(table);
            if (typeof tableName === "string" && this.config.joins.some((join) => join.alias === tableName)) {
              throw new Error(`Alias "${tableName}" is already used in this query`);
            }
            if (typeof on === "function") {
              const from = this.config.from ? (0, import_entity.is)(table, import_table.SQLiteTable) ? table[import_table2.Table.Symbol.Columns] : (0, import_entity.is)(table, import_subquery.Subquery) ? table._.selectedFields : (0, import_entity.is)(table, import_view_base.SQLiteViewBase) ? table[import_view_common.ViewBaseConfig].selectedFields : void 0 : void 0;
              on = on(
                new Proxy(
                  this.config.table[import_table2.Table.Symbol.Columns],
                  new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
                ),
                from && new Proxy(
                  from,
                  new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
                )
              );
            }
            this.config.joins.push({ on, table, joinType, alias: tableName });
            return this;
          };
        }
        leftJoin = this.createJoin("left");
        rightJoin = this.createJoin("right");
        innerJoin = this.createJoin("inner");
        fullJoin = this.createJoin("full");
        /**
         * Adds a 'where' clause to the query.
         *
         * Calling this method will update only those rows that fulfill a specified condition.
         *
         * See docs: {@link https://orm.drizzle.team/docs/update}
         *
         * @param where the 'where' clause.
         *
         * @example
         * You can use conditional operators and `sql function` to filter the rows to be updated.
         *
         * ```ts
         * // Update all cars with green color
         * db.update(cars).set({ color: 'red' })
         *   .where(eq(cars.color, 'green'));
         * // or
         * db.update(cars).set({ color: 'red' })
         *   .where(sql`${cars.color} = 'green'`)
         * ```
         *
         * You can logically combine conditional operators with `and()` and `or()` operators:
         *
         * ```ts
         * // Update all BMW cars with a green color
         * db.update(cars).set({ color: 'red' })
         *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
         *
         * // Update all cars with the green or blue color
         * db.update(cars).set({ color: 'red' })
         *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
         * ```
         */
        where(where) {
          this.config.where = where;
          return this;
        }
        orderBy(...columns) {
          if (typeof columns[0] === "function") {
            const orderBy = columns[0](
              new Proxy(
                this.config.table[import_table2.Table.Symbol.Columns],
                new import_selection_proxy.SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
              )
            );
            const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
            this.config.orderBy = orderByArray;
          } else {
            const orderByArray = columns;
            this.config.orderBy = orderByArray;
          }
          return this;
        }
        limit(limit) {
          this.config.limit = limit;
          return this;
        }
        returning(fields = this.config.table[import_table.SQLiteTable.Symbol.Columns]) {
          this.config.returning = (0, import_utils.orderSelectedFields)(fields);
          return this;
        }
        /** @internal */
        getSQL() {
          return this.dialect.buildUpdateQuery(this.config);
        }
        toSQL() {
          const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
          return rest;
        }
        /** @internal */
        _prepare(isOneTimeQuery = true) {
          return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
            this.dialect.sqlToQuery(this.getSQL()),
            this.config.returning,
            this.config.returning ? "all" : "run",
            true,
            void 0,
            {
              type: "insert",
              tables: (0, import_utils2.extractUsedTable)(this.config.table)
            }
          );
        }
        prepare() {
          return this._prepare(false);
        }
        run = (placeholderValues) => {
          return this._prepare().run(placeholderValues);
        };
        all = (placeholderValues) => {
          return this._prepare().all(placeholderValues);
        };
        get = (placeholderValues) => {
          return this._prepare().get(placeholderValues);
        };
        values = (placeholderValues) => {
          return this._prepare().values(placeholderValues);
        };
        async execute() {
          return this.config.returning ? this.all() : this.run();
        }
        $dynamic() {
          return this;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/index.cjs
  var require_query_builders = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var query_builders_exports = {};
      module.exports = __toCommonJS(query_builders_exports);
      __reExport(query_builders_exports, require_delete(), module.exports);
      __reExport(query_builders_exports, require_insert(), module.exports);
      __reExport(query_builders_exports, require_query_builder2(), module.exports);
      __reExport(query_builders_exports, require_select2(), module.exports);
      __reExport(query_builders_exports, require_select_types(), module.exports);
      __reExport(query_builders_exports, require_update(), module.exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/count.cjs
  var require_count = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/count.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var count_exports = {};
      __export(count_exports, {
        SQLiteCountBuilder: () => SQLiteCountBuilder
      });
      module.exports = __toCommonJS(count_exports);
      var import_entity = require_entity();
      var import_sql2 = require_sql();
      var SQLiteCountBuilder = class _SQLiteCountBuilder extends import_sql2.SQL {
        constructor(params) {
          super(_SQLiteCountBuilder.buildEmbeddedCount(params.source, params.filters).queryChunks);
          this.params = params;
          this.session = params.session;
          this.sql = _SQLiteCountBuilder.buildCount(
            params.source,
            params.filters
          );
        }
        sql;
        static [import_entity.entityKind] = "SQLiteCountBuilderAsync";
        [Symbol.toStringTag] = "SQLiteCountBuilderAsync";
        session;
        static buildEmbeddedCount(source, filters) {
          return import_sql2.sql`(select count(*) from ${source}${import_sql2.sql.raw(" where ").if(filters)}${filters})`;
        }
        static buildCount(source, filters) {
          return import_sql2.sql`select count(*) from ${source}${import_sql2.sql.raw(" where ").if(filters)}${filters}`;
        }
        then(onfulfilled, onrejected) {
          return Promise.resolve(this.session.count(this.sql)).then(
            onfulfilled,
            onrejected
          );
        }
        catch(onRejected) {
          return this.then(void 0, onRejected);
        }
        finally(onFinally) {
          return this.then(
            (value) => {
              onFinally?.();
              return value;
            },
            (reason) => {
              onFinally?.();
              throw reason;
            }
          );
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/query.cjs
  var require_query = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/query.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var query_exports = {};
      __export(query_exports, {
        RelationalQueryBuilder: () => RelationalQueryBuilder,
        SQLiteRelationalQuery: () => SQLiteRelationalQuery,
        SQLiteSyncRelationalQuery: () => SQLiteSyncRelationalQuery
      });
      module.exports = __toCommonJS(query_exports);
      var import_entity = require_entity();
      var import_query_promise = require_query_promise();
      var import_relations = require_relations();
      var RelationalQueryBuilder = class {
        constructor(mode, fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session) {
          this.mode = mode;
          this.fullSchema = fullSchema;
          this.schema = schema;
          this.tableNamesMap = tableNamesMap;
          this.table = table;
          this.tableConfig = tableConfig;
          this.dialect = dialect;
          this.session = session;
        }
        static [import_entity.entityKind] = "SQLiteAsyncRelationalQueryBuilder";
        findMany(config) {
          return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? config : {},
            "many"
          ) : new SQLiteRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? config : {},
            "many"
          );
        }
        findFirst(config) {
          return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? { ...config, limit: 1 } : { limit: 1 },
            "first"
          ) : new SQLiteRelationalQuery(
            this.fullSchema,
            this.schema,
            this.tableNamesMap,
            this.table,
            this.tableConfig,
            this.dialect,
            this.session,
            config ? { ...config, limit: 1 } : { limit: 1 },
            "first"
          );
        }
      };
      var SQLiteRelationalQuery = class extends import_query_promise.QueryPromise {
        constructor(fullSchema, schema, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
          super();
          this.fullSchema = fullSchema;
          this.schema = schema;
          this.tableNamesMap = tableNamesMap;
          this.table = table;
          this.tableConfig = tableConfig;
          this.dialect = dialect;
          this.session = session;
          this.config = config;
          this.mode = mode;
        }
        static [import_entity.entityKind] = "SQLiteAsyncRelationalQuery";
        /** @internal */
        mode;
        /** @internal */
        getSQL() {
          return this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName
          }).sql;
        }
        /** @internal */
        _prepare(isOneTimeQuery = false) {
          const { query, builtQuery } = this._toSQL();
          return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
            builtQuery,
            void 0,
            this.mode === "first" ? "get" : "all",
            true,
            (rawRows, mapColumnValue) => {
              const rows = rawRows.map(
                (row) => (0, import_relations.mapRelationalRow)(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
              );
              if (this.mode === "first") {
                return rows[0];
              }
              return rows;
            }
          );
        }
        prepare() {
          return this._prepare(false);
        }
        _toSQL() {
          const query = this.dialect.buildRelationalQuery({
            fullSchema: this.fullSchema,
            schema: this.schema,
            tableNamesMap: this.tableNamesMap,
            table: this.table,
            tableConfig: this.tableConfig,
            queryConfig: this.config,
            tableAlias: this.tableConfig.tsName
          });
          const builtQuery = this.dialect.sqlToQuery(query.sql);
          return { query, builtQuery };
        }
        toSQL() {
          return this._toSQL().builtQuery;
        }
        /** @internal */
        executeRaw() {
          if (this.mode === "first") {
            return this._prepare(false).get();
          }
          return this._prepare(false).all();
        }
        async execute() {
          return this.executeRaw();
        }
      };
      var SQLiteSyncRelationalQuery = class extends SQLiteRelationalQuery {
        static [import_entity.entityKind] = "SQLiteSyncRelationalQuery";
        sync() {
          return this.executeRaw();
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/query-builders/raw.cjs
  var require_raw = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/query-builders/raw.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var raw_exports = {};
      __export(raw_exports, {
        SQLiteRaw: () => SQLiteRaw
      });
      module.exports = __toCommonJS(raw_exports);
      var import_entity = require_entity();
      var import_query_promise = require_query_promise();
      var SQLiteRaw = class extends import_query_promise.QueryPromise {
        constructor(execute, getSQL, action, dialect, mapBatchResult) {
          super();
          this.execute = execute;
          this.getSQL = getSQL;
          this.dialect = dialect;
          this.mapBatchResult = mapBatchResult;
          this.config = { action };
        }
        static [import_entity.entityKind] = "SQLiteRaw";
        /** @internal */
        config;
        getQuery() {
          return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
        }
        mapResult(result, isFromBatch) {
          return isFromBatch ? this.mapBatchResult(result) : result;
        }
        _prepare() {
          return this;
        }
        /** @internal */
        isResponseInArrayMode() {
          return false;
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/db.cjs
  var require_db = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/db.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var db_exports = {};
      __export(db_exports, {
        BaseSQLiteDatabase: () => BaseSQLiteDatabase,
        withReplicas: () => withReplicas
      });
      module.exports = __toCommonJS(db_exports);
      var import_entity = require_entity();
      var import_selection_proxy = require_selection_proxy();
      var import_sql2 = require_sql();
      var import_query_builders = require_query_builders();
      var import_subquery = require_subquery();
      var import_count = require_count();
      var import_query = require_query();
      var import_raw = require_raw();
      var BaseSQLiteDatabase = class {
        constructor(resultKind, dialect, session, schema) {
          this.resultKind = resultKind;
          this.dialect = dialect;
          this.session = session;
          this._ = schema ? {
            schema: schema.schema,
            fullSchema: schema.fullSchema,
            tableNamesMap: schema.tableNamesMap
          } : {
            schema: void 0,
            fullSchema: {},
            tableNamesMap: {}
          };
          this.query = {};
          const query = this.query;
          if (this._.schema) {
            for (const [tableName, columns] of Object.entries(this._.schema)) {
              query[tableName] = new import_query.RelationalQueryBuilder(
                resultKind,
                schema.fullSchema,
                this._.schema,
                this._.tableNamesMap,
                schema.fullSchema[tableName],
                columns,
                dialect,
                session
              );
            }
          }
          this.$cache = { invalidate: async (_params) => {
          } };
        }
        static [import_entity.entityKind] = "BaseSQLiteDatabase";
        query;
        /**
         * Creates a subquery that defines a temporary named result set as a CTE.
         *
         * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
         *
         * @param alias The alias for the subquery.
         *
         * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
         *
         * @example
         *
         * ```ts
         * // Create a subquery with alias 'sq' and use it in the select query
         * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
         *
         * const result = await db.with(sq).select().from(sq);
         * ```
         *
         * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
         *
         * ```ts
         * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
         * const sq = db.$with('sq').as(db.select({
         *   name: sql<string>`upper(${users.name})`.as('name'),
         * })
         * .from(users));
         *
         * const result = await db.with(sq).select({ name: sq.name }).from(sq);
         * ```
         */
        $with = (alias, selection) => {
          const self2 = this;
          const as = (qb) => {
            if (typeof qb === "function") {
              qb = qb(new import_query_builders.QueryBuilder(self2.dialect));
            }
            return new Proxy(
              new import_subquery.WithSubquery(
                qb.getSQL(),
                selection ?? ("getSelectedFields" in qb ? qb.getSelectedFields() ?? {} : {}),
                alias,
                true
              ),
              new import_selection_proxy.SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
            );
          };
          return { as };
        };
        $count(source, filters) {
          return new import_count.SQLiteCountBuilder({ source, filters, session: this.session });
        }
        /**
         * Incorporates a previously defined CTE (using `$with`) into the main query.
         *
         * This method allows the main query to reference a temporary named result set.
         *
         * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
         *
         * @param queries The CTEs to incorporate into the main query.
         *
         * @example
         *
         * ```ts
         * // Define a subquery 'sq' as a CTE using $with
         * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
         *
         * // Incorporate the CTE 'sq' into the main query and select from it
         * const result = await db.with(sq).select().from(sq);
         * ```
         */
        with(...queries) {
          const self2 = this;
          function select(fields) {
            return new import_query_builders.SQLiteSelectBuilder({
              fields: fields ?? void 0,
              session: self2.session,
              dialect: self2.dialect,
              withList: queries
            });
          }
          function selectDistinct(fields) {
            return new import_query_builders.SQLiteSelectBuilder({
              fields: fields ?? void 0,
              session: self2.session,
              dialect: self2.dialect,
              withList: queries,
              distinct: true
            });
          }
          function update(table) {
            return new import_query_builders.SQLiteUpdateBuilder(table, self2.session, self2.dialect, queries);
          }
          function insert(into) {
            return new import_query_builders.SQLiteInsertBuilder(into, self2.session, self2.dialect, queries);
          }
          function delete_(from) {
            return new import_query_builders.SQLiteDeleteBase(from, self2.session, self2.dialect, queries);
          }
          return { select, selectDistinct, update, insert, delete: delete_ };
        }
        select(fields) {
          return new import_query_builders.SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
        }
        selectDistinct(fields) {
          return new import_query_builders.SQLiteSelectBuilder({
            fields: fields ?? void 0,
            session: this.session,
            dialect: this.dialect,
            distinct: true
          });
        }
        /**
         * Creates an update query.
         *
         * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
         *
         * Use `.set()` method to specify which values to update.
         *
         * See docs: {@link https://orm.drizzle.team/docs/update}
         *
         * @param table The table to update.
         *
         * @example
         *
         * ```ts
         * // Update all rows in the 'cars' table
         * await db.update(cars).set({ color: 'red' });
         *
         * // Update rows with filters and conditions
         * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
         *
         * // Update with returning clause
         * const updatedCar: Car[] = await db.update(cars)
         *   .set({ color: 'red' })
         *   .where(eq(cars.id, 1))
         *   .returning();
         * ```
         */
        update(table) {
          return new import_query_builders.SQLiteUpdateBuilder(table, this.session, this.dialect);
        }
        $cache;
        /**
         * Creates an insert query.
         *
         * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
         *
         * See docs: {@link https://orm.drizzle.team/docs/insert}
         *
         * @param table The table to insert into.
         *
         * @example
         *
         * ```ts
         * // Insert one row
         * await db.insert(cars).values({ brand: 'BMW' });
         *
         * // Insert multiple rows
         * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
         *
         * // Insert with returning clause
         * const insertedCar: Car[] = await db.insert(cars)
         *   .values({ brand: 'BMW' })
         *   .returning();
         * ```
         */
        insert(into) {
          return new import_query_builders.SQLiteInsertBuilder(into, this.session, this.dialect);
        }
        /**
         * Creates a delete query.
         *
         * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
         *
         * See docs: {@link https://orm.drizzle.team/docs/delete}
         *
         * @param table The table to delete from.
         *
         * @example
         *
         * ```ts
         * // Delete all rows in the 'cars' table
         * await db.delete(cars);
         *
         * // Delete rows with filters and conditions
         * await db.delete(cars).where(eq(cars.color, 'green'));
         *
         * // Delete with returning clause
         * const deletedCar: Car[] = await db.delete(cars)
         *   .where(eq(cars.id, 1))
         *   .returning();
         * ```
         */
        delete(from) {
          return new import_query_builders.SQLiteDeleteBase(from, this.session, this.dialect);
        }
        run(query) {
          const sequel = typeof query === "string" ? import_sql2.sql.raw(query) : query.getSQL();
          if (this.resultKind === "async") {
            return new import_raw.SQLiteRaw(
              async () => this.session.run(sequel),
              () => sequel,
              "run",
              this.dialect,
              this.session.extractRawRunValueFromBatchResult.bind(this.session)
            );
          }
          return this.session.run(sequel);
        }
        all(query) {
          const sequel = typeof query === "string" ? import_sql2.sql.raw(query) : query.getSQL();
          if (this.resultKind === "async") {
            return new import_raw.SQLiteRaw(
              async () => this.session.all(sequel),
              () => sequel,
              "all",
              this.dialect,
              this.session.extractRawAllValueFromBatchResult.bind(this.session)
            );
          }
          return this.session.all(sequel);
        }
        get(query) {
          const sequel = typeof query === "string" ? import_sql2.sql.raw(query) : query.getSQL();
          if (this.resultKind === "async") {
            return new import_raw.SQLiteRaw(
              async () => this.session.get(sequel),
              () => sequel,
              "get",
              this.dialect,
              this.session.extractRawGetValueFromBatchResult.bind(this.session)
            );
          }
          return this.session.get(sequel);
        }
        values(query) {
          const sequel = typeof query === "string" ? import_sql2.sql.raw(query) : query.getSQL();
          if (this.resultKind === "async") {
            return new import_raw.SQLiteRaw(
              async () => this.session.values(sequel),
              () => sequel,
              "values",
              this.dialect,
              this.session.extractRawValuesValueFromBatchResult.bind(this.session)
            );
          }
          return this.session.values(sequel);
        }
        transaction(transaction, config) {
          return this.session.transaction(transaction, config);
        }
      };
      var withReplicas = (primary, replicas, getReplica = () => replicas[Math.floor(Math.random() * replicas.length)]) => {
        const select = (...args) => getReplica(replicas).select(...args);
        const selectDistinct = (...args) => getReplica(replicas).selectDistinct(...args);
        const $count = (...args) => getReplica(replicas).$count(...args);
        const $with = (...args) => getReplica(replicas).with(...args);
        const update = (...args) => primary.update(...args);
        const insert = (...args) => primary.insert(...args);
        const $delete = (...args) => primary.delete(...args);
        const run = (...args) => primary.run(...args);
        const all = (...args) => primary.all(...args);
        const get = (...args) => primary.get(...args);
        const values = (...args) => primary.values(...args);
        const transaction = (...args) => primary.transaction(...args);
        return {
          ...primary,
          update,
          insert,
          delete: $delete,
          run,
          all,
          get,
          values,
          transaction,
          $primary: primary,
          $replicas: replicas,
          select,
          selectDistinct,
          $count,
          with: $with,
          get query() {
            return getReplica(replicas).query;
          }
        };
      };
    }
  });

  // node_modules/drizzle-orm/cache/core/cache.cjs
  var require_cache = __commonJS({
    "node_modules/drizzle-orm/cache/core/cache.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var cache_exports = {};
      __export(cache_exports, {
        Cache: () => Cache,
        NoopCache: () => NoopCache,
        hashQuery: () => hashQuery
      });
      module.exports = __toCommonJS(cache_exports);
      var import_entity = require_entity();
      var Cache = class {
        static [import_entity.entityKind] = "Cache";
      };
      var NoopCache = class extends Cache {
        strategy() {
          return "all";
        }
        static [import_entity.entityKind] = "NoopCache";
        async get(_key) {
          return void 0;
        }
        async put(_hashedQuery, _response, _tables, _config) {
        }
        async onMutate(_params) {
        }
      };
      async function hashQuery(sql, params) {
        const dataToHash = `${sql}-${JSON.stringify(params)}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(dataToHash);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = [...new Uint8Array(hashBuffer)];
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
      }
    }
  });

  // node_modules/drizzle-orm/cache/core/index.cjs
  var require_core = __commonJS({
    "node_modules/drizzle-orm/cache/core/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var core_exports = {};
      module.exports = __toCommonJS(core_exports);
      __reExport(core_exports, require_cache(), module.exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/alias.cjs
  var require_alias2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/alias.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var alias_exports = {};
      __export(alias_exports, {
        alias: () => alias
      });
      module.exports = __toCommonJS(alias_exports);
      var import_alias = require_alias();
      function alias(table, alias2) {
        return new Proxy(table, new import_alias.TableAliasProxyHandler(alias2, false));
      }
    }
  });

  // node_modules/drizzle-orm/sqlite-core/session.cjs
  var require_session = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/session.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var session_exports = {};
      __export(session_exports, {
        ExecuteResultSync: () => ExecuteResultSync,
        SQLitePreparedQuery: () => SQLitePreparedQuery,
        SQLiteSession: () => SQLiteSession,
        SQLiteTransaction: () => SQLiteTransaction
      });
      module.exports = __toCommonJS(session_exports);
      var import_cache = require_cache();
      var import_entity = require_entity();
      var import_errors = require_errors();
      var import_query_promise = require_query_promise();
      var import_db = require_db();
      var ExecuteResultSync = class extends import_query_promise.QueryPromise {
        constructor(resultCb) {
          super();
          this.resultCb = resultCb;
        }
        static [import_entity.entityKind] = "ExecuteResultSync";
        async execute() {
          return this.resultCb();
        }
        sync() {
          return this.resultCb();
        }
      };
      var SQLitePreparedQuery = class {
        constructor(mode, executeMethod, query, cache, queryMetadata, cacheConfig) {
          this.mode = mode;
          this.executeMethod = executeMethod;
          this.query = query;
          this.cache = cache;
          this.queryMetadata = queryMetadata;
          this.cacheConfig = cacheConfig;
          if (cache && cache.strategy() === "all" && cacheConfig === void 0) {
            this.cacheConfig = { enable: true, autoInvalidate: true };
          }
          if (!this.cacheConfig?.enable) {
            this.cacheConfig = void 0;
          }
        }
        static [import_entity.entityKind] = "PreparedQuery";
        /** @internal */
        joinsNotNullableMap;
        /** @internal */
        async queryWithCache(queryString, params, query) {
          if (this.cache === void 0 || (0, import_entity.is)(this.cache, import_cache.NoopCache) || this.queryMetadata === void 0) {
            try {
              return await query();
            } catch (e) {
              throw new import_errors.DrizzleQueryError(queryString, params, e);
            }
          }
          if (this.cacheConfig && !this.cacheConfig.enable) {
            try {
              return await query();
            } catch (e) {
              throw new import_errors.DrizzleQueryError(queryString, params, e);
            }
          }
          if ((this.queryMetadata.type === "insert" || this.queryMetadata.type === "update" || this.queryMetadata.type === "delete") && this.queryMetadata.tables.length > 0) {
            try {
              const [res] = await Promise.all([
                query(),
                this.cache.onMutate({ tables: this.queryMetadata.tables })
              ]);
              return res;
            } catch (e) {
              throw new import_errors.DrizzleQueryError(queryString, params, e);
            }
          }
          if (!this.cacheConfig) {
            try {
              return await query();
            } catch (e) {
              throw new import_errors.DrizzleQueryError(queryString, params, e);
            }
          }
          if (this.queryMetadata.type === "select") {
            const fromCache = await this.cache.get(
              this.cacheConfig.tag ?? await (0, import_cache.hashQuery)(queryString, params),
              this.queryMetadata.tables,
              this.cacheConfig.tag !== void 0,
              this.cacheConfig.autoInvalidate
            );
            if (fromCache === void 0) {
              let result;
              try {
                result = await query();
              } catch (e) {
                throw new import_errors.DrizzleQueryError(queryString, params, e);
              }
              await this.cache.put(
                this.cacheConfig.tag ?? await (0, import_cache.hashQuery)(queryString, params),
                result,
                // make sure we send tables that were used in a query only if user wants to invalidate it on each write
                this.cacheConfig.autoInvalidate ? this.queryMetadata.tables : [],
                this.cacheConfig.tag !== void 0,
                this.cacheConfig.config
              );
              return result;
            }
            return fromCache;
          }
          try {
            return await query();
          } catch (e) {
            throw new import_errors.DrizzleQueryError(queryString, params, e);
          }
        }
        getQuery() {
          return this.query;
        }
        mapRunResult(result, _isFromBatch) {
          return result;
        }
        mapAllResult(_result, _isFromBatch) {
          throw new Error("Not implemented");
        }
        mapGetResult(_result, _isFromBatch) {
          throw new Error("Not implemented");
        }
        execute(placeholderValues) {
          if (this.mode === "async") {
            return this[this.executeMethod](placeholderValues);
          }
          return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
        }
        mapResult(response, isFromBatch) {
          switch (this.executeMethod) {
            case "run": {
              return this.mapRunResult(response, isFromBatch);
            }
            case "all": {
              return this.mapAllResult(response, isFromBatch);
            }
            case "get": {
              return this.mapGetResult(response, isFromBatch);
            }
          }
        }
      };
      var SQLiteSession = class {
        constructor(dialect) {
          this.dialect = dialect;
        }
        static [import_entity.entityKind] = "SQLiteSession";
        prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
          return this.prepareQuery(
            query,
            fields,
            executeMethod,
            isResponseInArrayMode,
            customResultMapper,
            queryMetadata,
            cacheConfig
          );
        }
        run(query) {
          const staticQuery = this.dialect.sqlToQuery(query);
          try {
            return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
          } catch (err) {
            throw new import_errors.DrizzleError({ cause: err, message: `Failed to run the query '${staticQuery.sql}'` });
          }
        }
        /** @internal */
        extractRawRunValueFromBatchResult(result) {
          return result;
        }
        all(query) {
          return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
        }
        /** @internal */
        extractRawAllValueFromBatchResult(_result) {
          throw new Error("Not implemented");
        }
        get(query) {
          return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
        }
        /** @internal */
        extractRawGetValueFromBatchResult(_result) {
          throw new Error("Not implemented");
        }
        values(query) {
          return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
        }
        async count(sql) {
          const result = await this.values(sql);
          return result[0][0];
        }
        /** @internal */
        extractRawValuesValueFromBatchResult(_result) {
          throw new Error("Not implemented");
        }
      };
      var SQLiteTransaction = class extends import_db.BaseSQLiteDatabase {
        constructor(resultType, dialect, session, schema, nestedIndex = 0) {
          super(resultType, dialect, session, schema);
          this.schema = schema;
          this.nestedIndex = nestedIndex;
        }
        static [import_entity.entityKind] = "SQLiteTransaction";
        rollback() {
          throw new import_errors.TransactionRollbackError();
        }
      };
    }
  });

  // node_modules/drizzle-orm/sqlite-core/subquery.cjs
  var require_subquery2 = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/subquery.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var subquery_exports = {};
      module.exports = __toCommonJS(subquery_exports);
    }
  });

  // node_modules/drizzle-orm/sqlite-core/view.cjs
  var require_view = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/view.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var view_exports = {};
      __export(view_exports, {
        ManualViewBuilder: () => ManualViewBuilder,
        SQLiteView: () => SQLiteView,
        ViewBuilder: () => ViewBuilder,
        ViewBuilderCore: () => ViewBuilderCore,
        sqliteView: () => sqliteView,
        view: () => view
      });
      module.exports = __toCommonJS(view_exports);
      var import_entity = require_entity();
      var import_selection_proxy = require_selection_proxy();
      var import_utils = require_utils2();
      var import_query_builder = require_query_builder2();
      var import_table = require_table3();
      var import_view_base = require_view_base();
      var ViewBuilderCore = class {
        constructor(name) {
          this.name = name;
        }
        static [import_entity.entityKind] = "SQLiteViewBuilderCore";
        config = {};
      };
      var ViewBuilder = class extends ViewBuilderCore {
        static [import_entity.entityKind] = "SQLiteViewBuilder";
        as(qb) {
          if (typeof qb === "function") {
            qb = qb(new import_query_builder.QueryBuilder());
          }
          const selectionProxy = new import_selection_proxy.SelectionProxyHandler({
            alias: this.name,
            sqlBehavior: "error",
            sqlAliasedBehavior: "alias",
            replaceOriginalName: true
          });
          const aliasedSelectedFields = qb.getSelectedFields();
          return new Proxy(
            new SQLiteView({
              // sqliteConfig: this.config,
              config: {
                name: this.name,
                schema: void 0,
                selectedFields: aliasedSelectedFields,
                query: qb.getSQL().inlineParams()
              }
            }),
            selectionProxy
          );
        }
      };
      var ManualViewBuilder = class extends ViewBuilderCore {
        static [import_entity.entityKind] = "SQLiteManualViewBuilder";
        columns;
        constructor(name, columns) {
          super(name);
          this.columns = (0, import_utils.getTableColumns)((0, import_table.sqliteTable)(name, columns));
        }
        existing() {
          return new Proxy(
            new SQLiteView({
              config: {
                name: this.name,
                schema: void 0,
                selectedFields: this.columns,
                query: void 0
              }
            }),
            new import_selection_proxy.SelectionProxyHandler({
              alias: this.name,
              sqlBehavior: "error",
              sqlAliasedBehavior: "alias",
              replaceOriginalName: true
            })
          );
        }
        as(query) {
          return new Proxy(
            new SQLiteView({
              config: {
                name: this.name,
                schema: void 0,
                selectedFields: this.columns,
                query: query.inlineParams()
              }
            }),
            new import_selection_proxy.SelectionProxyHandler({
              alias: this.name,
              sqlBehavior: "error",
              sqlAliasedBehavior: "alias",
              replaceOriginalName: true
            })
          );
        }
      };
      var SQLiteView = class extends import_view_base.SQLiteViewBase {
        static [import_entity.entityKind] = "SQLiteView";
        constructor({ config }) {
          super(config);
        }
      };
      function sqliteView(name, selection) {
        if (selection) {
          return new ManualViewBuilder(name, selection);
        }
        return new ViewBuilder(name);
      }
      var view = sqliteView;
    }
  });

  // node_modules/drizzle-orm/sqlite-core/index.cjs
  var require_sqlite_core = __commonJS({
    "node_modules/drizzle-orm/sqlite-core/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var sqlite_core_exports = {};
      module.exports = __toCommonJS(sqlite_core_exports);
      __reExport(sqlite_core_exports, require_alias2(), module.exports);
      __reExport(sqlite_core_exports, require_checks(), module.exports);
      __reExport(sqlite_core_exports, require_columns(), module.exports);
      __reExport(sqlite_core_exports, require_db(), module.exports);
      __reExport(sqlite_core_exports, require_dialect(), module.exports);
      __reExport(sqlite_core_exports, require_foreign_keys2(), module.exports);
      __reExport(sqlite_core_exports, require_indexes(), module.exports);
      __reExport(sqlite_core_exports, require_primary_keys2(), module.exports);
      __reExport(sqlite_core_exports, require_query_builders(), module.exports);
      __reExport(sqlite_core_exports, require_session(), module.exports);
      __reExport(sqlite_core_exports, require_subquery2(), module.exports);
      __reExport(sqlite_core_exports, require_table3(), module.exports);
      __reExport(sqlite_core_exports, require_unique_constraint2(), module.exports);
      __reExport(sqlite_core_exports, require_utils4(), module.exports);
      __reExport(sqlite_core_exports, require_view(), module.exports);
    }
  });

  // node_modules/drizzle-orm/better-sqlite3/session.cjs
  var require_session2 = __commonJS({
    "node_modules/drizzle-orm/better-sqlite3/session.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var session_exports = {};
      __export(session_exports, {
        BetterSQLiteSession: () => BetterSQLiteSession,
        BetterSQLiteTransaction: () => BetterSQLiteTransaction,
        PreparedQuery: () => PreparedQuery
      });
      module.exports = __toCommonJS(session_exports);
      var import_core = require_core();
      var import_entity = require_entity();
      var import_logger = require_logger();
      var import_sql2 = require_sql();
      var import_sqlite_core = require_sqlite_core();
      var import_session = require_session();
      var import_utils = require_utils2();
      var BetterSQLiteSession = class extends import_session.SQLiteSession {
        constructor(client, dialect, schema, options = {}) {
          super(dialect);
          this.client = client;
          this.schema = schema;
          this.logger = options.logger ?? new import_logger.NoopLogger();
          this.cache = options.cache ?? new import_core.NoopCache();
        }
        static [import_entity.entityKind] = "BetterSQLiteSession";
        logger;
        cache;
        prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
          const stmt = this.client.prepare(query.sql);
          return new PreparedQuery(
            stmt,
            query,
            this.logger,
            this.cache,
            queryMetadata,
            cacheConfig,
            fields,
            executeMethod,
            isResponseInArrayMode,
            customResultMapper
          );
        }
        transaction(transaction, config = {}) {
          const tx = new BetterSQLiteTransaction("sync", this.dialect, this, this.schema);
          const nativeTx = this.client.transaction(transaction);
          return nativeTx[config.behavior ?? "deferred"](tx);
        }
      };
      var BetterSQLiteTransaction = class _BetterSQLiteTransaction extends import_sqlite_core.SQLiteTransaction {
        static [import_entity.entityKind] = "BetterSQLiteTransaction";
        transaction(transaction) {
          const savepointName = `sp${this.nestedIndex}`;
          const tx = new _BetterSQLiteTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
          this.session.run(import_sql2.sql.raw(`savepoint ${savepointName}`));
          try {
            const result = transaction(tx);
            this.session.run(import_sql2.sql.raw(`release savepoint ${savepointName}`));
            return result;
          } catch (err) {
            this.session.run(import_sql2.sql.raw(`rollback to savepoint ${savepointName}`));
            throw err;
          }
        }
      };
      var PreparedQuery = class extends import_session.SQLitePreparedQuery {
        constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
          super("sync", executeMethod, query, cache, queryMetadata, cacheConfig);
          this.stmt = stmt;
          this.logger = logger;
          this.fields = fields;
          this._isResponseInArrayMode = _isResponseInArrayMode;
          this.customResultMapper = customResultMapper;
        }
        static [import_entity.entityKind] = "BetterSQLitePreparedQuery";
        run(placeholderValues) {
          const params = (0, import_sql2.fillPlaceholders)(this.query.params, placeholderValues ?? {});
          this.logger.logQuery(this.query.sql, params);
          return this.stmt.run(...params);
        }
        all(placeholderValues) {
          const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
          if (!fields && !customResultMapper) {
            const params = (0, import_sql2.fillPlaceholders)(query.params, placeholderValues ?? {});
            logger.logQuery(query.sql, params);
            return stmt.all(...params);
          }
          const rows = this.values(placeholderValues);
          if (customResultMapper) {
            return customResultMapper(rows);
          }
          return rows.map((row) => (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap));
        }
        get(placeholderValues) {
          const params = (0, import_sql2.fillPlaceholders)(this.query.params, placeholderValues ?? {});
          this.logger.logQuery(this.query.sql, params);
          const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
          if (!fields && !customResultMapper) {
            return stmt.get(...params);
          }
          const row = stmt.raw().get(...params);
          if (!row) {
            return void 0;
          }
          if (customResultMapper) {
            return customResultMapper([row]);
          }
          return (0, import_utils.mapResultRow)(fields, row, joinsNotNullableMap);
        }
        values(placeholderValues) {
          const params = (0, import_sql2.fillPlaceholders)(this.query.params, placeholderValues ?? {});
          this.logger.logQuery(this.query.sql, params);
          return this.stmt.raw().all(...params);
        }
        /** @internal */
        isResponseInArrayMode() {
          return this._isResponseInArrayMode;
        }
      };
    }
  });

  // node_modules/drizzle-orm/better-sqlite3/driver.cjs
  var require_driver = __commonJS({
    "node_modules/drizzle-orm/better-sqlite3/driver.cjs"(exports, module) {
      "use strict";
      init_process();
      var __create2 = Object.create;
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __getProtoOf2 = Object.getPrototypeOf;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name in all)
          __defProp2(target, name, { get: all[name], enumerable: true });
      };
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
        mod
      ));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var driver_exports = {};
      __export(driver_exports, {
        BetterSQLite3Database: () => BetterSQLite3Database,
        drizzle: () => drizzle
      });
      module.exports = __toCommonJS(driver_exports);
      var import_better_sqlite3 = __toESM2(require_sqlite(), 1);
      var import_entity = require_entity();
      var import_logger = require_logger();
      var import_relations = require_relations();
      var import_db = require_db();
      var import_dialect = require_dialect();
      var import_utils = require_utils2();
      var import_session = require_session2();
      var BetterSQLite3Database = class extends import_db.BaseSQLiteDatabase {
        static [import_entity.entityKind] = "BetterSQLite3Database";
      };
      function construct(client, config = {}) {
        const dialect = new import_dialect.SQLiteSyncDialect({ casing: config.casing });
        let logger;
        if (config.logger === true) {
          logger = new import_logger.DefaultLogger();
        } else if (config.logger !== false) {
          logger = config.logger;
        }
        let schema;
        if (config.schema) {
          const tablesConfig = (0, import_relations.extractTablesRelationalConfig)(
            config.schema,
            import_relations.createTableRelationsHelpers
          );
          schema = {
            fullSchema: config.schema,
            schema: tablesConfig.tables,
            tableNamesMap: tablesConfig.tableNamesMap
          };
        }
        const session = new import_session.BetterSQLiteSession(client, dialect, schema, { logger });
        const db = new BetterSQLite3Database("sync", dialect, session, schema);
        db.$client = client;
        return db;
      }
      function drizzle(...params) {
        if (params[0] === void 0 || typeof params[0] === "string") {
          const instance = params[0] === void 0 ? new import_better_sqlite3.default() : new import_better_sqlite3.default(params[0]);
          return construct(instance, params[1]);
        }
        if ((0, import_utils.isConfig)(params[0])) {
          const { connection, client, ...drizzleConfig } = params[0];
          if (client) return construct(client, drizzleConfig);
          if (typeof connection === "object") {
            const { source, ...options } = connection;
            const instance2 = new import_better_sqlite3.default(source, options);
            return construct(instance2, drizzleConfig);
          }
          const instance = new import_better_sqlite3.default(connection);
          return construct(instance, drizzleConfig);
        }
        return construct(params[0], params[1]);
      }
      ((drizzle2) => {
        function mock(config) {
          return construct({}, config);
        }
        drizzle2.mock = mock;
      })(drizzle || (drizzle = {}));
    }
  });

  // node_modules/drizzle-orm/better-sqlite3/index.cjs
  var require_better_sqlite3 = __commonJS({
    "node_modules/drizzle-orm/better-sqlite3/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var better_sqlite3_exports = {};
      module.exports = __toCommonJS(better_sqlite3_exports);
      __reExport(better_sqlite3_exports, require_driver(), module.exports);
      __reExport(better_sqlite3_exports, require_session2(), module.exports);
    }
  });

  // node_modules/drizzle-orm/operations.cjs
  var require_operations = __commonJS({
    "node_modules/drizzle-orm/operations.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var operations_exports = {};
      module.exports = __toCommonJS(operations_exports);
    }
  });

  // node_modules/drizzle-orm/index.cjs
  var require_drizzle_orm = __commonJS({
    "node_modules/drizzle-orm/index.cjs"(exports, module) {
      "use strict";
      init_process();
      var __defProp2 = Object.defineProperty;
      var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames2 = Object.getOwnPropertyNames;
      var __hasOwnProp2 = Object.prototype.hasOwnProperty;
      var __copyProps2 = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames2(from))
            if (!__hasOwnProp2.call(to, key) && key !== except)
              __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __reExport = (target, mod, secondTarget) => (__copyProps2(target, mod, "default"), secondTarget && __copyProps2(secondTarget, mod, "default"));
      var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
      var index_exports = {};
      module.exports = __toCommonJS(index_exports);
      __reExport(index_exports, require_alias(), module.exports);
      __reExport(index_exports, require_column_builder(), module.exports);
      __reExport(index_exports, require_column(), module.exports);
      __reExport(index_exports, require_entity(), module.exports);
      __reExport(index_exports, require_errors(), module.exports);
      __reExport(index_exports, require_logger(), module.exports);
      __reExport(index_exports, require_operations(), module.exports);
      __reExport(index_exports, require_query_promise(), module.exports);
      __reExport(index_exports, require_relations(), module.exports);
      __reExport(index_exports, require_sql2(), module.exports);
      __reExport(index_exports, require_subquery(), module.exports);
      __reExport(index_exports, require_table(), module.exports);
      __reExport(index_exports, require_utils2(), module.exports);
      __reExport(index_exports, require_view_common(), module.exports);
    }
  });

  // shims/child_process.js
  var require_child_process = __commonJS({
    "shims/child_process.js"(exports, module) {
      init_process();
      function id() {
        let v = localStorage.getItem("deviceId");
        if (!v) {
          v = crypto.randomUUID();
          localStorage.setItem("deviceId", v);
        }
        return v;
      }
      module.exports = { execSync: () => "MachineGuid    REG_SZ    " + id(), execFile() {
      } };
    }
  });

  // vendor/main/index.js
  var require_main = __commonJS({
    "vendor/main/index.js"() {
      "use strict";
      init_process();
      var electron = require_electron();
      var path = require_path_browserify();
      var utils = require_toolkit_utils();
      var Database = require_sqlite();
      var betterSqlite3 = require_better_sqlite3();
      var sqliteCore = require_sqlite_core();
      var drizzleOrm = require_drizzle_orm();
      var nodeThermalPrinter = require_stub();
      var fs = require_stub();
      var os = require_stub();
      var child_process = require_child_process();
      var crypto2 = require_crypto2();
      var icon = path.join("/", "../../resources/icon.png");
      var categories = sqliteCore.sqliteTable("categories", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name").notNull(),
        sortOrder: sqliteCore.integer("sort_order").notNull().default(0),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var products = sqliteCore.sqliteTable("products", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        categoryId: sqliteCore.integer("category_id").notNull().references(() => categories.id),
        name: sqliteCore.text("name").notNull(),
        price: sqliteCore.integer("price").notNull().default(0),
        hasVariants: sqliteCore.integer("has_variants", { mode: "boolean" }).notNull().default(false),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        timesSold: sqliteCore.integer("times_sold").notNull().default(0),
        lastSoldAt: sqliteCore.text("last_sold_at"),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var variants = sqliteCore.sqliteTable("variants", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        productId: sqliteCore.integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
        name: sqliteCore.text("name").notNull(),
        price: sqliteCore.integer("price").notNull().default(0),
        sortOrder: sqliteCore.integer("sort_order").notNull().default(0),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true)
      });
      var restaurantTables = sqliteCore.sqliteTable("restaurant_tables", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name").notNull(),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var waiters = sqliteCore.sqliteTable("waiters", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name").notNull(),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var orders = sqliteCore.sqliteTable("orders", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        orderNumber: sqliteCore.text("order_number").notNull().unique(),
        orderType: sqliteCore.text("order_type", { enum: ["dine_in", "take_away", "delivery"] }).notNull(),
        tableId: sqliteCore.integer("table_id").references(() => restaurantTables.id),
        waiterId: sqliteCore.integer("waiter_id").references(() => waiters.id),
        status: sqliteCore.text("status", { enum: ["pending", "paid", "cancelled"] }).notNull().default("pending"),
        subtotal: sqliteCore.integer("subtotal").notNull().default(0),
        discountPercent: sqliteCore.integer("discount_percent").notNull().default(0),
        discount: sqliteCore.integer("discount").notNull().default(0),
        deliveryCharge: sqliteCore.integer("delivery_charge").notNull().default(0),
        serviceCharge: sqliteCore.integer("service_charge").notNull().default(0),
        taxAmount: sqliteCore.integer("tax_amount").notNull().default(0),
        total: sqliteCore.integer("total").notNull().default(0),
        note: sqliteCore.text("note"),
        userId: sqliteCore.integer("user_id").references(() => users.id),
        customerName: sqliteCore.text("customer_name"),
        customerPhone: sqliteCore.text("customer_phone"),
        customerAddress: sqliteCore.text("customer_address"),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`),
        paidAt: sqliteCore.text("paid_at"),
        kitchenPrintedAt: sqliteCore.text("kitchen_printed_at"),
        amountPaid: sqliteCore.integer("amount_paid").notNull().default(0)
      });
      var orderPayments = sqliteCore.sqliteTable("order_payments", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        orderId: sqliteCore.integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
        amount: sqliteCore.integer("amount").notNull(),
        method: sqliteCore.text("method").notNull().default("cash"),
        note: sqliteCore.text("note"),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var orderItems = sqliteCore.sqliteTable("order_items", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        orderId: sqliteCore.integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
        productId: sqliteCore.integer("product_id").notNull(),
        variantId: sqliteCore.integer("variant_id"),
        productName: sqliteCore.text("product_name").notNull(),
        variantName: sqliteCore.text("variant_name"),
        unitPrice: sqliteCore.integer("unit_price").notNull(),
        quantity: sqliteCore.integer("quantity").notNull().default(1),
        note: sqliteCore.text("note"),
        lineTotal: sqliteCore.integer("line_total").notNull()
      });
      var users = sqliteCore.sqliteTable("users", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name").notNull(),
        role: sqliteCore.text("role", { enum: ["admin", "cashier"] }).notNull().default("cashier"),
        pinHash: sqliteCore.text("pin_hash").notNull(),
        pinSalt: sqliteCore.text("pin_salt").notNull(),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var expenseItems = sqliteCore.sqliteTable("expense_items", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name").notNull(),
        isActive: sqliteCore.integer("is_active", { mode: "boolean" }).notNull().default(true),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var expenses = sqliteCore.sqliteTable("expenses", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        expenseDate: sqliteCore.text("expense_date").notNull(),
        category: sqliteCore.text("category", { enum: ["ingredients", "utilities", "salaries", "rent", "equipment", "other"] }).notNull(),
        expenseItemId: sqliteCore.integer("expense_item_id").references(() => expenseItems.id),
        quantity: sqliteCore.text("quantity"),
        description: sqliteCore.text("description"),
        amount: sqliteCore.integer("amount").notNull(),
        userId: sqliteCore.integer("user_id").references(() => users.id),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var customers = sqliteCore.sqliteTable("customers", {
        id: sqliteCore.integer("id").primaryKey({ autoIncrement: true }),
        name: sqliteCore.text("name"),
        phone: sqliteCore.text("phone").notNull().unique(),
        address: sqliteCore.text("address"),
        timesOrdered: sqliteCore.integer("times_ordered").notNull().default(0),
        lastOrderAt: sqliteCore.text("last_order_at"),
        createdAt: sqliteCore.text("created_at").notNull().default(drizzleOrm.sql`(datetime('now','localtime'))`)
      });
      var settings = sqliteCore.sqliteTable("settings", {
        key: sqliteCore.text("key").primaryKey(),
        value: sqliteCore.text("value").notNull()
      });
      var schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        categories,
        customers,
        expenseItems,
        expenses,
        orderItems,
        orderPayments,
        orders,
        products,
        restaurantTables,
        settings,
        users,
        variants,
        waiters
      }, Symbol.toStringTag, { value: "Module" }));
      var SML = (s, m, l) => [
        ["Small", s],
        ["Medium", m],
        ["Large", l]
      ];
      var MENU = {
        Pizza: [
          { name: "Chicken Fajita Pizza", variants: SML(550, 950, 1400) },
          { name: "Chicken Tikka Pizza", variants: SML(550, 950, 1400) },
          { name: "Veggie Lover Pizza", variants: SML(550, 950, 1400) },
          { name: "Cheese Lover Pizza", variants: SML(550, 950, 1400) },
          { name: "Shahi Pizza", variants: SML(600, 1e3, 1500) },
          { name: "Bone Fire Pizza", variants: SML(600, 1e3, 1500) },
          { name: "Supreme Pizza", variants: SML(600, 1e3, 1500) },
          { name: "Shawarma Pizza", variants: SML(600, 1e3, 1500) },
          { name: "Afghani Tikka Pizza", variants: SML(650, 1050, 1600) },
          { name: "Seekh Kabab Pizza", variants: SML(650, 1050, 1600) },
          { name: "BBQ Pizza", variants: SML(650, 1050, 1600) },
          { name: "Malai Boti Pizza", variants: SML(650, 1050, 1600) },
          { name: "Peri Peri Pizza", variants: SML(650, 1050, 1600) },
          { name: "Extreme Pizza", variants: SML(700, 1100, 1700) },
          { name: "Special Behari Pizza", variants: SML(700, 1100, 1700) },
          { name: "Crown Crust Pizza", variants: SML(700, 1100, 1700) },
          { name: "Lasagnia Pizza", variants: SML(750, 1150, 1800) },
          { name: "Special Islamic Pizza", variants: SML(750, 1150, 1800) },
          {
            name: "Extra Large Pizza",
            variants: [
              ["2300", 2300],
              ["2500", 2500],
              ["2700", 2700]
            ]
          }
        ],
        Wraps: [
          { name: "Arabic Wrap", price: 550 },
          { name: "Crispy Wrap", price: 650 },
          { name: "BBQ Wrap", price: 650 }
        ],
        "Chicken Rolls": [
          { name: "Shawarma Roll", price: 220 },
          { name: "Paratha Roll", price: 300 },
          { name: "Cheese Paratha Roll", price: 350 },
          { name: "Cheese Shawarma", price: 250 },
          { name: "Kabab Paratha", price: 300 },
          { name: "Zingish Roll", price: 350 },
          { name: "Pizza Paratha", price: 600 },
          { name: "Behari Roll", price: 350 },
          { name: "Turkish Roll", price: 400 },
          { name: "Shawarma Sandwich", price: 550 }
        ],
        Fries: [
          {
            name: "Fries",
            variants: [
              ["Regular", 200],
              ["Medium", 300],
              ["Family", 400]
            ]
          },
          {
            name: "Loaded Fries",
            variants: [
              ["Small", 400],
              ["Large", 800]
            ]
          }
        ],
        Pasta: [
          {
            name: "Cheese Pasta",
            variants: [
              ["Small", 500],
              ["Large", 900]
            ]
          },
          {
            name: "Crunchy Pasta",
            variants: [
              ["Small", 550],
              ["Large", 950]
            ]
          }
        ],
        Burgers: [
          { name: "Zinger Burger", price: 330 },
          { name: "Tikka Burger", price: 300 },
          { name: "Chicken Patty Burger", price: 300 },
          { name: "Double Patty Burger", price: 500 },
          { name: "Kabab Burger", price: 300 },
          { name: "Grill Burger", price: 600 },
          { name: "Double Decker Burger", price: 600 },
          { name: "Mighty Burger", price: 650 },
          { name: "Thunder Cheese Burger", price: 450 }
        ],
        "Chicken Broast": [
          { name: "Chest Piece", price: 400 },
          { name: "Leg Piece", price: 380 },
          { name: "Zinger Piece", price: 250 },
          { name: "Drum Piece", price: 250 },
          { name: "Thigh Piece", price: 250 },
          { name: "BBQ Piece", price: 400 }
        ],
        Nuggets: [
          {
            name: "Nuggets",
            variants: [
              ["6 Pcs", 300],
              ["12 Pcs", 600]
            ]
          }
        ],
        "Hot Wings": [
          {
            name: "Hot Wings",
            variants: [
              ["6 Pcs", 300],
              ["12 Pcs", 600]
            ]
          }
        ],
        "Seekh Kabab": [{ name: "Seekh Kabab (6 Pcs)", price: 400 }],
        Extras: [
          {
            name: "Extra Topping Chicken Cheese",
            variants: [
              ["Small", 100],
              ["Medium", 150],
              ["Large", 250]
            ]
          },
          { name: "Dip Sauce", price: 50 },
          { name: "Cheese Sauce", price: 60 }
        ]
      };
      function seedIfEmpty() {
        const sqlite2 = getSqlite();
        const count = sqlite2.prepare("SELECT COUNT(*) as c FROM products").get();
        if (count.c > 0) return;
        const insertCat = sqlite2.prepare("INSERT INTO categories (name, sort_order) VALUES (?, ?)");
        const insertProd = sqlite2.prepare(
          "INSERT INTO products (category_id, name, price, has_variants) VALUES (?, ?, ?, ?)"
        );
        const insertVar = sqlite2.prepare(
          "INSERT INTO variants (product_id, name, price, sort_order) VALUES (?, ?, ?, ?)"
        );
        const tx = sqlite2.transaction(() => {
          let catOrder = 0;
          for (const [catName, items] of Object.entries(MENU)) {
            const catId = insertCat.run(catName, catOrder++).lastInsertRowid;
            for (const item of items) {
              const hasVariants = (item.variants?.length ?? 0) > 0;
              const prodId = insertProd.run(
                catId,
                item.name,
                hasVariants ? 0 : item.price ?? 0,
                hasVariants ? 1 : 0
              ).lastInsertRowid;
              item.variants?.forEach(([vName, vPrice], i) => {
                insertVar.run(prodId, vName, vPrice, i);
              });
            }
          }
        });
        tx();
        console.log("[db] menu seeded");
      }
      var sqlite = null;
      var db = null;
      var MIGRATIONS = [
        // v1 â€” initial schema
        `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    has_variants INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    times_sold INTEGER NOT NULL DEFAULT 0,
    last_sold_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS restaurant_tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS waiters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    order_type TEXT NOT NULL,
    table_id INTEGER REFERENCES restaurant_tables(id),
    waiter_id INTEGER REFERENCES waiters(id),
    status TEXT NOT NULL DEFAULT 'pending',
    subtotal INTEGER NOT NULL DEFAULT 0,
    discount INTEGER NOT NULL DEFAULT 0,
    tax_amount INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    paid_at TEXT
  );
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    variant_id INTEGER,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    unit_price INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    note TEXT,
    line_total INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
  `,
        // v2 — delivery customer info + percentage discount
        `
  ALTER TABLE orders ADD COLUMN customer_phone TEXT;
  ALTER TABLE orders ADD COLUMN customer_address TEXT;
  ALTER TABLE orders ADD COLUMN discount_percent INTEGER NOT NULL DEFAULT 0;
  `,
        // v3 - users with PIN auth + order attribution
        `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cashier',
    pin_hash TEXT NOT NULL,
    pin_salt TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id);
  `,
        // v4 - expense items + expenses + customers
        `
  CREATE TABLE IF NOT EXISTS expense_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_date TEXT NOT NULL,
    category TEXT NOT NULL,
    expense_item_id INTEGER REFERENCES expense_items(id),
    quantity TEXT,
    description TEXT,
    amount INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
  CREATE INDEX IF NOT EXISTS idx_expenses_item ON expenses(expense_item_id);
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    times_ordered INTEGER NOT NULL DEFAULT 0,
    last_order_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
  `,
        // v5 - delivery charge on orders
        `
  ALTER TABLE orders ADD COLUMN delivery_charge INTEGER NOT NULL DEFAULT 0;
  `,
        // v6 - customer name on every order, manual service charge, part payments,
        // kitchen printing as a timestamp instead of a status.
        `
  ALTER TABLE orders ADD COLUMN customer_name TEXT;
  ALTER TABLE orders ADD COLUMN service_charge INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE orders ADD COLUMN amount_paid INTEGER NOT NULL DEFAULT 0;
  ALTER TABLE orders ADD COLUMN kitchen_printed_at TEXT;
  CREATE TABLE IF NOT EXISTS order_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    method TEXT NOT NULL DEFAULT 'cash',
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );
  CREATE INDEX IF NOT EXISTS idx_order_payments_order ON order_payments(order_id);
  CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);
  UPDATE orders SET kitchen_printed_at = created_at WHERE status = 'kitchen_printed';
  UPDATE orders SET amount_paid = total WHERE status = 'paid';
  UPDATE orders SET status = 'pending' WHERE status = 'kitchen_printed';
  INSERT INTO order_payments (order_id, amount, method, created_at)
    SELECT id, total, 'cash', COALESCE(paid_at, created_at) FROM orders WHERE status = 'paid';
  `
      ];
      function ensureColumns(conn) {
        const cols = conn.prepare(`PRAGMA table_info(orders)`).all().map(
          (c) => c.name
        );
        const add = (name, ddl) => {
          if (!cols.includes(name)) conn.exec(`ALTER TABLE orders ADD COLUMN ${ddl};`);
        };
        add("delivery_charge", "delivery_charge INTEGER NOT NULL DEFAULT 0");
        add("customer_name", "customer_name TEXT");
        add("service_charge", "service_charge INTEGER NOT NULL DEFAULT 0");
        add("amount_paid", "amount_paid INTEGER NOT NULL DEFAULT 0");
        add("kitchen_printed_at", "kitchen_printed_at TEXT");
        conn.exec(`
    CREATE TABLE IF NOT EXISTS order_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      method TEXT NOT NULL DEFAULT 'cash',
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_order_payments_order ON order_payments(order_id);
  `);
        conn.exec(`
    UPDATE orders SET kitchen_printed_at = created_at
      WHERE status = 'kitchen_printed' AND kitchen_printed_at IS NULL;
    UPDATE orders SET amount_paid = total WHERE status = 'paid' AND amount_paid = 0;
    UPDATE orders SET status = 'pending' WHERE status = 'kitchen_printed';
  `);
      }
      function runMigrations(conn) {
        const current = conn.pragma("user_version", { simple: true });
        for (let v = current; v < MIGRATIONS.length; v++) {
          const migrate = conn.transaction(() => {
            conn.exec(MIGRATIONS[v]);
            conn.pragma(`user_version = ${v + 1}`);
          });
          migrate();
          console.log(`[db] migration v${v + 1} applied`);
        }
        ensureColumns(conn);
      }
      function initDatabase() {
        const dbPath = path.join(electron.app.getPath("userData"), "restaurant-pos.db");
        sqlite = new Database(dbPath);
        sqlite.pragma("journal_mode = WAL");
        sqlite.pragma("foreign_keys = ON");
        runMigrations(sqlite);
        db = betterSqlite3.drizzle(sqlite, { schema });
        seedIfEmpty();
        console.log("[db] ready at", dbPath);
      }
      function getDb() {
        if (!db) throw new Error("Database not initialized. Call initDatabase() first.");
        return db;
      }
      function getSqlite() {
        if (!sqlite) throw new Error("Database not initialized.");
        return sqlite;
      }
      function closeDatabase() {
        sqlite?.close();
        sqlite = null;
        db = null;
      }
      function listCategories() {
        return getDb().select().from(categories).orderBy(drizzleOrm.asc(categories.sortOrder), drizzleOrm.asc(categories.name)).all();
      }
      function createCategory(input) {
        const name = input.name.trim();
        if (!name) throw new Error("Category name is required");
        const row = getDb().insert(categories).values({ name, sortOrder: input.sortOrder ?? 0 }).returning().get();
        return row;
      }
      function updateCategory(input) {
        const { id, ...changes } = input;
        if (changes.name !== void 0 && !changes.name.trim()) {
          throw new Error("Category name cannot be empty");
        }
        const row = getDb().update(categories).set(changes).where(drizzleOrm.eq(categories.id, id)).returning().get();
        if (!row) throw new Error("Category not found");
        return row;
      }
      function deleteCategory(id) {
        const used = getSqlite().prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ?").get(id);
        if (used.count > 0) {
          throw new Error("This category has products. Move or delete its products first, or disable the category.");
        }
        const result = getDb().delete(categories).where(drizzleOrm.eq(categories.id, id)).run();
        if (result.changes === 0) throw new Error("Category not found");
      }
      function makeService(table) {
        return {
          list() {
            return getDb().select().from(table).orderBy(drizzleOrm.asc(table.name)).all();
          },
          create(input) {
            const name = input.name.trim();
            if (!name) throw new Error("Name is required");
            return getDb().insert(table).values({ name }).returning().get();
          },
          update(input) {
            const { id, ...changes } = input;
            if (changes.name !== void 0 && !changes.name.trim()) {
              throw new Error("Name cannot be empty");
            }
            if (changes.name !== void 0) changes.name = changes.name.trim();
            const row = getDb().update(table).set(changes).where(drizzleOrm.eq(table.id, id)).returning().get();
            if (!row) throw new Error("Not found");
            return row;
          },
          remove(id) {
            const result = getDb().delete(table).where(drizzleOrm.eq(table.id, id)).run();
            if (result.changes === 0) throw new Error("Not found");
          }
        };
      }
      var tablesService = makeService(restaurantTables);
      var waitersService = makeService(waiters);
      function validateVariants(list) {
        const cleaned = list.map((v) => ({ name: v.name.trim(), price: Math.round(v.price) })).filter((v) => v.name.length > 0);
        const names = new Set(cleaned.map((v) => v.name.toLowerCase()));
        if (names.size !== cleaned.length) throw new Error("Variant names must be unique");
        for (const v of cleaned) {
          if (v.price < 0) throw new Error("Variant price cannot be negative");
        }
        return cleaned;
      }
      function listProducts() {
        const db2 = getDb();
        const prods = db2.select({
          id: products.id,
          categoryId: products.categoryId,
          name: products.name,
          price: products.price,
          hasVariants: products.hasVariants,
          isActive: products.isActive,
          timesSold: products.timesSold,
          lastSoldAt: products.lastSoldAt,
          createdAt: products.createdAt,
          categoryName: categories.name
        }).from(products).innerJoin(categories, drizzleOrm.eq(products.categoryId, categories.id)).orderBy(drizzleOrm.asc(categories.sortOrder), drizzleOrm.asc(categories.name), drizzleOrm.asc(products.name)).all();
        const allVariants = db2.select().from(variants).orderBy(drizzleOrm.asc(variants.sortOrder), drizzleOrm.asc(variants.id)).all();
        const byProduct = /* @__PURE__ */ new Map();
        for (const v of allVariants) {
          const arr = byProduct.get(v.productId) ?? [];
          arr.push(v);
          byProduct.set(v.productId, arr);
        }
        return prods.map((p) => ({ ...p, variants: byProduct.get(p.id) ?? [] }));
      }
      function createProduct(input) {
        const name = input.name.trim();
        if (!name) throw new Error("Product name is required");
        if (input.price < 0) throw new Error("Price cannot be negative");
        const variantList = validateVariants(input.variants ?? []);
        const hasVariants = variantList.length > 0;
        const db2 = getDb();
        const tx = getSqlite().transaction(() => {
          const row = db2.insert(products).values({
            categoryId: input.categoryId,
            name,
            price: hasVariants ? 0 : Math.round(input.price),
            hasVariants
          }).returning().get();
          variantList.forEach((v, i) => {
            db2.insert(variants).values({ productId: row.id, name: v.name, price: v.price, sortOrder: i }).run();
          });
          return row;
        });
        return tx();
      }
      function updateProduct(input) {
        const db2 = getDb();
        const { id, variants: variantList, ...changes } = input;
        if (changes.name !== void 0) {
          changes.name = changes.name.trim();
          if (!changes.name) throw new Error("Product name cannot be empty");
        }
        if (changes.price !== void 0 && changes.price < 0) {
          throw new Error("Price cannot be negative");
        }
        const tx = getSqlite().transaction(() => {
          let cleanedVariants;
          if (variantList !== void 0) {
            cleanedVariants = validateVariants(variantList);
            db2.delete(variants).where(drizzleOrm.eq(variants.productId, id)).run();
            cleanedVariants.forEach((v, i) => {
              db2.insert(variants).values({ productId: id, name: v.name, price: v.price, sortOrder: i }).run();
            });
          }
          const finalChanges = { ...changes };
          if (cleanedVariants !== void 0) {
            finalChanges.hasVariants = cleanedVariants.length > 0;
            if (cleanedVariants.length > 0) finalChanges.price = 0;
          }
          if (changes.price !== void 0) finalChanges.price = Math.round(changes.price);
          const row = db2.update(products).set(finalChanges).where(drizzleOrm.eq(products.id, id)).returning().get();
          if (!row) throw new Error("Product not found");
          return row;
        });
        return tx();
      }
      function deleteProduct(id) {
        const used = getSqlite().prepare("SELECT COUNT(*) as count FROM order_items WHERE product_id = ?").get(id);
        if (used.count > 0) {
          throw new Error("This product has been used in orders. Disable it instead of deleting.");
        }
        const result = getDb().delete(products).where(drizzleOrm.eq(products.id, id)).run();
        if (result.changes === 0) throw new Error("Product not found");
      }
      function searchCustomers(query) {
        const q = query.trim();
        if (q.length < 3) return [];
        return getSqlite().prepare(
          `SELECT id, name, phone, address, times_ordered AS timesOrdered,
              last_order_at AS lastOrderAt, created_at AS createdAt
       FROM customers
       WHERE phone LIKE ? OR LOWER(COALESCE(name,'')) LIKE LOWER(?)
       ORDER BY times_ordered DESC, last_order_at DESC
       LIMIT 6`
        ).all(`%${q}%`, `%${q}%`);
      }
      function upsertCustomerOnOrder(input) {
        const phone = input.phone.trim();
        if (!phone) return;
        const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
        const db2 = getDb();
        const existing = db2.select().from(customers).where(drizzleOrm.eq(customers.phone, phone)).get();
        if (existing) {
          db2.update(customers).set({
            name: input.name?.trim() || existing.name,
            address: input.address?.trim() || existing.address,
            timesOrdered: existing.timesOrdered + 1,
            lastOrderAt: now
          }).where(drizzleOrm.eq(customers.id, existing.id)).run();
        } else {
          db2.insert(customers).values({
            phone,
            name: input.name?.trim() || null,
            address: input.address?.trim() || null,
            timesOrdered: 1,
            lastOrderAt: now
          }).run();
        }
      }
      function nowStamp() {
        const d = /* @__PURE__ */ new Date();
        const p = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      }
      function nextOrderNumber() {
        const today = /* @__PURE__ */ new Date();
        const y = today.getFullYear();
        const mo = String(today.getMonth() + 1).padStart(2, "0");
        const d = String(today.getDate()).padStart(2, "0");
        const datePart = `${y}${mo}${d}`;
        const row = getSqlite().prepare(`SELECT COUNT(*) as c FROM orders WHERE order_number LIKE ?`).get(`${datePart}-%`);
        return `${datePart}-${String(row.c + 1).padStart(3, "0")}`;
      }
      function createOrder(input) {
        if (!input.items || input.items.length === 0) throw new Error("Order has no items");
        if (input.orderType === "dine_in" && !input.tableId) throw new Error("Select a table for dine-in");
        const discountInput = Math.max(0, Math.round(input.discountAmount ?? 0));
        const deliveryChargeInput = input.orderType === "delivery" ? Math.max(0, Math.round(input.deliveryCharge ?? 0)) : 0;
        const serviceChargeInput = Math.max(0, Math.round(input.serviceCharge ?? 0));
        const db2 = getDb();
        const sqlite2 = getSqlite();
        const tx = sqlite2.transaction(() => {
          const resolvedItems = input.items.map((item) => {
            const product = db2.select().from(products).where(drizzleOrm.eq(products.id, item.productId)).get();
            if (!product) throw new Error(`Product ${item.productId} not found`);
            if (item.quantity < 1) throw new Error("Quantity must be at least 1");
            let unitPrice = product.price;
            let variantName = null;
            if (item.variantId != null) {
              const variant = db2.select().from(variants).where(drizzleOrm.eq(variants.id, item.variantId)).get();
              if (!variant || variant.productId !== product.id) throw new Error("Invalid variant");
              unitPrice = variant.price;
              variantName = variant.name;
            } else if (product.hasVariants) {
              throw new Error(`${product.name} requires a variant`);
            }
            return {
              productId: product.id,
              variantId: item.variantId ?? null,
              productName: product.name,
              variantName,
              unitPrice,
              quantity: Math.round(item.quantity),
              note: item.note?.trim() || null,
              lineTotal: unitPrice * Math.round(item.quantity)
            };
          });
          const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
          const discount = Math.min(discountInput, subtotal);
          const discountPercent = subtotal > 0 ? Math.round(discount / subtotal * 100) : 0;
          const total = subtotal - discount + deliveryChargeInput + serviceChargeInput;
          const now = nowStamp();
          const order = db2.insert(orders).values({
            userId: input.userId ?? null,
            orderNumber: nextOrderNumber(),
            orderType: input.orderType,
            tableId: input.orderType === "dine_in" ? input.tableId ?? null : null,
            waiterId: input.orderType === "dine_in" ? input.waiterId ?? null : null,
            status: input.markPaid ? "paid" : "pending",
            subtotal,
            discountPercent,
            discount,
            deliveryCharge: deliveryChargeInput,
            serviceCharge: serviceChargeInput,
            amountPaid: input.markPaid ? total : 0,
            taxAmount: 0,
            total,
            note: input.note?.trim() || null,
            customerName: input.customerName?.trim() || null,
            customerPhone: input.orderType === "delivery" ? input.customerPhone?.trim() || null : null,
            customerAddress: input.orderType === "delivery" ? input.customerAddress?.trim() || null : null,
            paidAt: input.markPaid ? now : null
          }).returning().get();
          const savedItems = resolvedItems.map(
            (item) => db2.insert(orderItems).values({ ...item, orderId: order.id }).returning().get()
          );
          if (input.markPaid && total > 0) {
            sqlite2.prepare("INSERT INTO order_payments (order_id, amount, method, created_at) VALUES (?, ?, 'cash', ?)").run(order.id, total, now);
          }
          const bump = sqlite2.prepare(
            `UPDATE products SET times_sold = times_sold + ?, last_sold_at = ? WHERE id = ?`
          );
          for (const item of resolvedItems) {
            bump.run(item.quantity, now, item.productId);
          }
          if (input.orderType === "delivery" && input.customerPhone?.trim()) {
            upsertCustomerOnOrder({
              phone: input.customerPhone,
              name: input.customerName,
              address: input.customerAddress
            });
          }
          return { ...order, items: savedItems };
        });
        return tx();
      }
      function listOrders(filter = {}) {
        const sqlite2 = getSqlite();
        const conditions = [];
        const params = [];
        if (filter.date) {
          conditions.push(`date(created_at) = ?`);
          params.push(filter.date);
        }
        if (filter.status === "kitchen") {
          conditions.push("kitchen_printed_at IS NOT NULL AND status = 'pending'");
        } else if (filter.status && filter.status !== "all") {
          conditions.push(`status = ?`);
          params.push(filter.status);
        }
        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const orderRows = sqlite2.prepare(`SELECT * FROM orders ${where} ORDER BY id DESC LIMIT 500`).all(...params);
        if (orderRows.length === 0) return [];
        const ids = orderRows.map((o) => o.id);
        const itemRows = sqlite2.prepare(
          `SELECT * FROM order_items WHERE order_id IN (${ids.map(() => "?").join(",")})`
        ).all(...ids);
        const itemsByOrder = /* @__PURE__ */ new Map();
        for (const item of itemRows) {
          const oid = item.order_id;
          const arr = itemsByOrder.get(oid) ?? [];
          arr.push(item);
          itemsByOrder.set(oid, arr);
        }
        const mapItem = (r) => ({
          id: r.id,
          orderId: r.order_id,
          productId: r.product_id,
          variantId: r.variant_id,
          productName: r.product_name,
          variantName: r.variant_name,
          unitPrice: r.unit_price,
          quantity: r.quantity,
          note: r.note,
          lineTotal: r.line_total
        });
        return orderRows.map((r) => ({
          id: r.id,
          orderNumber: r.order_number,
          orderType: r.order_type,
          tableId: r.table_id,
          waiterId: r.waiter_id,
          status: r.status,
          subtotal: r.subtotal,
          discountPercent: r.discount_percent,
          discount: r.discount,
          deliveryCharge: r.delivery_charge,
          taxAmount: r.tax_amount,
          total: r.total,
          note: r.note,
          customerName: r.customer_name,
          customerPhone: r.customer_phone,
          customerAddress: r.customer_address,
          serviceCharge: r.service_charge,
          amountPaid: r.amount_paid,
          createdAt: r.created_at,
          paidAt: r.paid_at,
          kitchenPrintedAt: r.kitchen_printed_at,
          items: (itemsByOrder.get(r.id) ?? []).map(mapItem)
        }));
      }
      function updateOrderItems(input) {
        if (!input.items || input.items.length === 0) throw new Error("Order has no items");
        const discountInput = Math.max(0, Math.round(input.discountAmount ?? 0));
        const db2 = getDb();
        const sqlite2 = getSqlite();
        const tx = sqlite2.transaction(() => {
          const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, input.orderId)).get();
          if (!existing) throw new Error("Order not found");
          if (existing.status !== "pending") {
            throw new Error("Only unpaid orders can be edited");
          }
          const oldItems = db2.select().from(orderItems).where(drizzleOrm.eq(orderItems.orderId, input.orderId)).all();
          const unbump = sqlite2.prepare(
            `UPDATE products SET times_sold = MAX(0, times_sold - ?) WHERE id = ?`
          );
          for (const item of oldItems) {
            unbump.run(item.quantity, item.productId);
          }
          db2.delete(orderItems).where(drizzleOrm.eq(orderItems.orderId, input.orderId)).run();
          const resolvedItems = input.items.map((item) => {
            const product = db2.select().from(products).where(drizzleOrm.eq(products.id, item.productId)).get();
            if (!product) throw new Error(`Product ${item.productId} not found`);
            if (item.quantity < 1) throw new Error("Quantity must be at least 1");
            let unitPrice = product.price;
            let variantName = null;
            if (item.variantId != null) {
              const variant = db2.select().from(variants).where(drizzleOrm.eq(variants.id, item.variantId)).get();
              if (!variant || variant.productId !== product.id) throw new Error("Invalid variant");
              unitPrice = variant.price;
              variantName = variant.name;
            } else if (product.hasVariants) {
              throw new Error(`${product.name} requires a variant`);
            }
            return {
              orderId: input.orderId,
              productId: product.id,
              variantId: item.variantId ?? null,
              productName: product.name,
              variantName,
              unitPrice,
              quantity: Math.round(item.quantity),
              note: item.note?.trim() || null,
              lineTotal: unitPrice * Math.round(item.quantity)
            };
          });
          const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0);
          const discount = Math.min(discountInput, subtotal);
          const discountPercent = subtotal > 0 ? Math.round(discount / subtotal * 100) : 0;
          const newOrderType = input.orderType ?? existing.orderType;
          const deliveryChargeInput = newOrderType === "delivery" ? Math.max(0, Math.round(input.deliveryCharge ?? 0)) : 0;
          const serviceChargeInput = Math.max(0, Math.round(input.serviceCharge ?? existing.serviceCharge));
          const total = subtotal - discount + deliveryChargeInput + serviceChargeInput;
          const now = nowStamp();
          const savedItems = resolvedItems.map(
            (item) => db2.insert(orderItems).values(item).returning().get()
          );
          const bump = sqlite2.prepare(
            `UPDATE products SET times_sold = times_sold + ?, last_sold_at = ? WHERE id = ?`
          );
          for (const item of resolvedItems) {
            bump.run(item.quantity, now, item.productId);
          }
          const order = db2.update(orders).set({
            orderType: newOrderType,
            customerName: input.customerName?.trim() ?? existing.customerName ?? null,
            tableId: newOrderType === "dine_in" ? input.tableId ?? existing.tableId ?? null : null,
            waiterId: newOrderType === "dine_in" ? input.waiterId ?? existing.waiterId ?? null : null,
            customerPhone: newOrderType === "delivery" ? input.customerPhone?.trim() ?? existing.customerPhone ?? null : null,
            customerAddress: newOrderType === "delivery" ? input.customerAddress?.trim() ?? existing.customerAddress ?? null : null,
            subtotal,
            discountPercent,
            discount,
            deliveryCharge: deliveryChargeInput,
            serviceCharge: serviceChargeInput,
            total,
            note: input.note?.trim() || existing.note
          }).where(drizzleOrm.eq(orders.id, input.orderId)).returning().get();
          return { ...order, items: savedItems };
        });
        return tx();
      }
      function withItems(id) {
        const db2 = getDb();
        const order = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
        if (!order) throw new Error("Order not found");
        const items = db2.select().from(orderItems).where(drizzleOrm.eq(orderItems.orderId, id)).all();
        return { ...order, items };
      }
      function updateOrderStatus(id, status) {
        const db2 = getDb();
        const sqlite2 = getSqlite();
        const now = nowStamp();
        const tx = sqlite2.transaction(() => {
          const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
          if (!existing) throw new Error("Order not found");
          const changes = { status };
          if (status === "paid") {
            const owed = Math.max(0, existing.total - existing.amountPaid);
            if (owed > 0) {
              sqlite2.prepare(
                "INSERT INTO order_payments (order_id, amount, method, created_at) VALUES (?, ?, 'cash', ?)"
              ).run(id, owed, now);
            }
            changes.amountPaid = existing.total;
            changes.paidAt = now;
          }
          db2.update(orders).set(changes).where(drizzleOrm.eq(orders.id, id)).run();
          return withItems(id);
        });
        return tx();
      }
      function markKitchenPrinted(id) {
        const db2 = getDb();
        const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, id)).get();
        if (!existing) throw new Error("Order not found");
        if (!existing.kitchenPrintedAt) {
          db2.update(orders).set({ kitchenPrintedAt: nowStamp() }).where(drizzleOrm.eq(orders.id, id)).run();
        }
        return withItems(id);
      }
      function addOrderPayment(input) {
        const amount = Math.round(input.amount);
        if (amount <= 0) throw new Error("Payment must be greater than zero");
        const db2 = getDb();
        const sqlite2 = getSqlite();
        const now = nowStamp();
        const tx = sqlite2.transaction(() => {
          const existing = db2.select().from(orders).where(drizzleOrm.eq(orders.id, input.orderId)).get();
          if (!existing) throw new Error("Order not found");
          if (existing.status === "cancelled") throw new Error("Order is cancelled");
          const owed = Math.max(0, existing.total - existing.amountPaid);
          if (owed === 0) throw new Error("Order is already fully paid");
          if (amount > owed) throw new Error("Only Rs " + owed + " is outstanding on this order");
          sqlite2.prepare(
            "INSERT INTO order_payments (order_id, amount, method, note, created_at) VALUES (?, ?, ?, ?, ?)"
          ).run(input.orderId, amount, input.method?.trim() || "cash", input.note?.trim() || null, now);
          const paidNow = existing.amountPaid + amount;
          const settled = paidNow >= existing.total;
          db2.update(orders).set({
            amountPaid: paidNow,
            status: settled ? "paid" : existing.status,
            paidAt: settled ? now : existing.paidAt
          }).where(drizzleOrm.eq(orders.id, input.orderId)).run();
          return withItems(input.orderId);
        });
        return tx();
      }
      function listOrderPayments(orderId) {
        return getSqlite().prepare(
          "SELECT id, order_id as orderId, amount, method, note, created_at as createdAt FROM order_payments WHERE order_id = ? ORDER BY id ASC"
        ).all(orderId);
      }
      function listUnpaidOrders(query) {
        const sqlite2 = getSqlite();
        const params = [];
        let where = "WHERE status = 'pending' AND amount_paid < total";
        if (query?.trim()) {
          where += " AND (customer_phone LIKE ? OR customer_name LIKE ?)";
          const q = "%" + query.trim() + "%";
          params.push(q, q);
        }
        const rows = sqlite2.prepare("SELECT id FROM orders " + where + " ORDER BY id DESC LIMIT 500").all(...params);
        return rows.map((r) => withItems(r.id));
      }
      var DEFAULTS = {
        restaurantName: "Islamic Pizza & Fast Food",
        address: "Muqabil Allah Wali Market, Jatoi Road, Shehar Sultan",
        phone: "0305-1415678 / 0306-1415678",
        receiptHeader: "",
        receiptFooter: "Thank you for your order!",
        currency: "Rs",
        defaultPrinter: "",
        kitchenPrinter: "",
        receiptWidth: "80",
        charsPerLine: 0,
        receiptLogo: "",
        paymentQr: ""
      };
      function getSettings() {
        const rows = getSqlite().prepare("SELECT key, value FROM settings").all();
        const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
        return { ...DEFAULTS, ...stored };
      }
      function saveSettings(input) {
        const stmt = getSqlite().prepare(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        );
        const tx = getSqlite().transaction(() => {
          for (const [key, value] of Object.entries(input)) {
            if (value !== void 0) stmt.run(key, String(value));
          }
        });
        tx();
        return getSettings();
      }
      function layout(settings2) {
        const override = settings2.charsPerLine;
        const width = override && override > 0 ? override : settings2.receiptWidth === "58" ? 32 : 48;
        const amtW = Math.max(6, Math.round(width * 0.21));
        const qtyW = Math.max(3, Math.round(width * 0.1));
        return { width, qtyW, amtW };
      }
      function resourcePath(file) {
        const devPath = path.join(process.cwd(), "resources", file);
        if (fs.existsSync(devPath)) return devPath;
        const unpacked = path.join(process.resourcesPath, "app.asar.unpacked", "resources", file);
        if (fs.existsSync(unpacked)) return unpacked;
        return path.join(process.resourcesPath, "resources", file);
      }
      function makePrinter(width) {
        const printer = new nodeThermalPrinter.ThermalPrinter({
          type: nodeThermalPrinter.PrinterTypes.EPSON,
          interface: "buffer",
          characterSet: nodeThermalPrinter.CharacterSet.PC437_USA,
          removeSpecialCharacters: false,
          width,
          lineCharacter: "-"
        });
        printer.add(Buffer.from([27, 64]));
        printer.add(Buffer.from([27, 33, 0]));
        printer.add(Buffer.from([27, 32, 0]));
        return printer;
      }
      async function sendRaw(printerName, buffer) {
        if (!printerName) throw new Error("No printer selected in Settings");
        const tmpFile = path.join(os.tmpdir(), `escpos-${Date.now()}.prn`);
        fs.writeFileSync(tmpFile, buffer);
        const psScript = `
$printer = "${printerName.replace(/"/g, '""')}"
$path = "${tmpFile.replace(/\\/g, "\\\\")}"
$bytes = [System.IO.File]::ReadAllBytes($path)
$src = @"
using System;
using System.IO;
using System.Runtime.InteropServices;
public class RawPrint {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
  public struct DOCINFOA { [MarshalAs(UnmanagedType.LPStr)] public string pDocName; [MarshalAs(UnmanagedType.LPStr)] public string pOutputFile; [MarshalAs(UnmanagedType.LPStr)] public string pDataType; }
  [DllImport("winspool.Drv", EntryPoint="OpenPrinterA", SetLastError=true, CharSet=CharSet.Ansi)] public static extern bool OpenPrinter(string src, out IntPtr hPrinter, IntPtr pd);
  [DllImport("winspool.Drv", EntryPoint="ClosePrinter", SetLastError=true)] public static extern bool ClosePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartDocPrinterA", SetLastError=true, CharSet=CharSet.Ansi)] public static extern bool StartDocPrinter(IntPtr hPrinter, int level, ref DOCINFOA di);
  [DllImport("winspool.Drv", EntryPoint="EndDocPrinter", SetLastError=true)] public static extern bool EndDocPrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="StartPagePrinter", SetLastError=true)] public static extern bool StartPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="EndPagePrinter", SetLastError=true)] public static extern bool EndPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.Drv", EntryPoint="WritePrinter", SetLastError=true)] public static extern bool WritePrinter(IntPtr hPrinter, byte[] pBytes, int dwCount, out int dwWritten);
  public static void Send(string name, byte[] bytes) {
    IntPtr h;
    if (!OpenPrinter(name, out h, IntPtr.Zero)) throw new Exception("OpenPrinter failed - check printer name");
    DOCINFOA di = new DOCINFOA(); di.pDocName = "Receipt"; di.pDataType = "RAW";
    StartDocPrinter(h, 1, ref di); StartPagePrinter(h);
    int written; WritePrinter(h, bytes, bytes.Length, out written);
    EndPagePrinter(h); EndDocPrinter(h); ClosePrinter(h);
  }
}
"@
Add-Type -TypeDefinition $src -Language CSharp
[RawPrint]::Send($printer, $bytes)
`;
        await new Promise((resolve, reject) => {
          child_process.execFile("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", psScript], (err) => {
            try {
              fs.unlinkSync(tmpFile);
            } catch {
            }
            if (err) reject(new Error(err.message));
            else resolve();
          });
        });
      }
      function money(n) {
        return `Rs ${n}`;
      }
      function padRow(left, right, L) {
        let l = left;
        let r = right;
        if (l.length + r.length + 1 > L.width) {
          const maxLeft = Math.max(1, L.width - r.length - 1);
          l = l.slice(0, maxLeft);
        }
        const space = Math.max(1, L.width - l.length - r.length);
        return l + " ".repeat(space) + r;
      }
      function itemLine(name, qty, amount, L) {
        const nameW = L.width - L.qtyW - L.amtW;
        const qtyStr = String(qty).padStart(Math.floor((L.qtyW + String(qty).length) / 2)).padEnd(L.qtyW);
        const amtStr = amount.padStart(L.amtW);
        const lines = [];
        let remaining = name;
        let first = true;
        while (remaining.length > 0) {
          const chunk = remaining.slice(0, nameW);
          remaining = remaining.slice(chunk.length);
          if (first) {
            lines.push(chunk.padEnd(nameW) + qtyStr + amtStr);
            first = false;
          } else {
            lines.push(chunk);
          }
        }
        return lines.join("\n");
      }
      function itemHeader(L) {
        const nameW = L.width - L.qtyW - L.amtW;
        return "Item".padEnd(nameW) + "Qty".padStart(Math.floor((L.qtyW + 3) / 2)).padEnd(L.qtyW) + "Amount".padStart(L.amtW);
      }
      async function printReceiptEscpos(order, settings2, names) {
        const L = layout(settings2);
        const printer = makePrinter(L.width);
        printer.alignCenter();
        if (settings2.receiptLogo) {
          try {
            await printer.printImage(settings2.receiptLogo);
          } catch {
          }
        }
        printer.bold(true);
        printer.setTextSize(1, 1);
        printer.println(settings2.restaurantName || "Restaurant");
        printer.setTextNormal();
        if (settings2.receiptHeader) {
          printer.bold(true);
          printer.println(settings2.receiptHeader);
          printer.bold(false);
        }
        if (settings2.address) printer.println(settings2.address);
        if (settings2.phone) printer.println(settings2.phone);
        printer.drawLine();
        printer.alignLeft();
        const typeLabel = order.orderType === "dine_in" ? "DINE IN" : order.orderType === "delivery" ? "DELIVERY" : "TAKE AWAY";
        printer.println(`${typeLabel}   #${order.orderNumber}`);
        printer.println(new Date(order.createdAt).toLocaleString());
        if (names.tableName) printer.println(`Table: ${names.tableName}`);
        if (names.waiterName) printer.println(`Waiter: ${names.waiterName}`);
        if (names.servedBy) printer.println(`Served by: ${names.servedBy}`);
        if (order.customerName) printer.println("Name: " + order.customerName);
        if (order.customerPhone) printer.println(`Phone: ${order.customerPhone}`);
        if (order.customerAddress) printer.println(`Address: ${order.customerAddress}`);
        printer.drawLine();
        printer.bold(true);
        printer.add(Buffer.from([27, 71, 1]));
        printer.println(itemHeader(L));
        printer.add(Buffer.from([27, 71, 0]));
        printer.bold(false);
        printer.drawLine();
        for (const item of order.items) {
          const name = item.variantName ? item.productName + " (" + item.variantName + ")" : item.productName;
          printer.println(itemLine(name, item.quantity, money(item.lineTotal), L));
        }
        printer.drawLine();
        if (order.discount > 0 || order.deliveryCharge > 0 || order.serviceCharge > 0) {
          printer.println(padRow("Subtotal:", money(order.subtotal), L));
        }
        if (order.discount > 0) {
          printer.println(padRow("Discount:", "-" + money(order.discount), L));
        }
        if (order.serviceCharge > 0) {
          printer.println(padRow("Service:", "+" + money(order.serviceCharge), L));
        }
        if (order.deliveryCharge > 0) {
          printer.println(padRow("Delivery:", "+" + money(order.deliveryCharge), L));
        }
        printer.bold(true);
        printer.setTextSize(1, 1);
        printer.println(padRow("TOTAL:", money(order.total), L));
        printer.setTextNormal();
        printer.bold(false);
        if (order.amountPaid > 0 && order.amountPaid < order.total) {
          printer.println(padRow("Paid:", money(order.amountPaid), L));
          printer.bold(true);
          printer.println(padRow("BALANCE:", money(order.total - order.amountPaid), L));
          printer.bold(false);
        }
        printer.alignCenter();
        printer.drawLine();
        if (settings2.receiptFooter) printer.println(settings2.receiptFooter);
        try {
          await printer.printImage(resourcePath("xiom-logo-print.png"));
        } catch {
          printer.println("Powered by XIOM");
        }
        printer.println("0301-4442459");
        printer.add(Buffer.from([10, 10, 10, 10]));
        printer.add(Buffer.from([29, 86, 0]));
        await sendRaw(settings2.defaultPrinter, printer.getBuffer());
      }
      async function printKitchenEscpos(order, settings2, names) {
        const printerName = settings2.kitchenPrinter || settings2.defaultPrinter;
        const L = layout(settings2);
        const printer = makePrinter(L.width);
        printer.alignCenter();
        printer.bold(true);
        printer.setTextSize(1, 1);
        printer.println("KITCHEN");
        const typeLabel = order.orderType === "dine_in" ? "DINE IN" : order.orderType === "delivery" ? "DELIVERY" : "TAKE AWAY";
        printer.bold(true);
        printer.setTextSize(1, 1);
        printer.println(`${typeLabel}  #${order.orderNumber}`);
        printer.setTextNormal();
        printer.bold(false);
        printer.println(new Date(order.createdAt).toLocaleString());
        if (names.tableName) printer.println(`Table: ${names.tableName}`);
        if (order.customerName) {
          printer.bold(true);
          printer.println("Name: " + order.customerName);
          printer.bold(false);
        }
        printer.drawLine();
        printer.alignLeft();
        for (const item of order.items) {
          const name = item.variantName ? item.productName + " (" + item.variantName + ")" : item.productName;
          printer.bold(true);
          printer.setTextSize(1, 1);
          printer.println(`${item.quantity} x ${name}`);
          printer.setTextNormal();
          printer.bold(false);
          if (item.note) printer.println(`    * ${item.note}`);
        }
        printer.cut();
        await sendRaw(printerName, printer.getBuffer());
      }
      async function printReportEscpos(report, settings2) {
        const L = layout(settings2);
        const printer = makePrinter(L.width);
        const s = report.summary;
        const range = report.from === report.to ? report.from : `${report.from} to ${report.to}`;
        printer.alignCenter();
        printer.bold(true);
        printer.println("SALES REPORT");
        printer.println(settings2.restaurantName || "Restaurant");
        printer.bold(false);
        printer.println(range);
        printer.drawLine();
        printer.alignLeft();
        printer.println(padRow("Paid Orders:", String(s.paidOrders), L));
        printer.bold(true);
        printer.println(padRow("Revenue:", money(s.paidRevenue), L));
        printer.bold(false);
        printer.println(padRow("Avg Order:", money(s.avgOrderValue), L));
        printer.println(padRow("Discounts:", money(s.totalDiscount), L));
        printer.println(padRow("Unpaid:", s.pendingOrders + " (" + money(s.pendingAmount) + ")", L));
        printer.println(padRow("Cancelled:", String(s.cancelledOrders), L));
        printer.drawLine();
        printer.bold(true);
        printer.println("TOP ITEMS");
        printer.println(itemHeader(L));
        printer.bold(false);
        printer.drawLine();
        for (const p of report.popular) {
          const name = p.variantName ? p.productName + " (" + p.variantName + ")" : p.productName;
          printer.println(itemLine(name, p.quantity, money(p.revenue), L));
        }
        printer.drawLine();
        printer.alignCenter();
        printer.println(`Printed: ${(/* @__PURE__ */ new Date()).toLocaleString()}`);
        printer.cut();
        await sendRaw(settings2.defaultPrinter, printer.getBuffer());
      }
      async function testPrintEscpos(printerName) {
        const settings2 = getSettings();
        const L = layout(settings2);
        const printer = makePrinter(L.width);
        printer.alignCenter();
        printer.bold(true);
        printer.println("PRINTER TEST");
        printer.bold(false);
        printer.println(`Paper: ${settings2.receiptWidth}mm  Width: ${L.width} chars`);
        printer.println((/* @__PURE__ */ new Date()).toLocaleString());
        printer.drawLine();
        printer.alignLeft();
        printer.println("Column width check:");
        let ruler = "";
        for (let i = 1; i <= L.width; i++) ruler += String(i % 10);
        printer.println(ruler);
        printer.drawLine();
        printer.println(itemHeader(L));
        printer.drawLine();
        printer.println(itemLine("Short item", 1, money(250), L));
        printer.println(itemLine("A much longer product name that wraps", 2, money(1500), L));
        printer.drawLine();
        printer.println(padRow("TOTAL:", money(1750), L));
        printer.drawLine();
        printer.alignCenter();
        printer.println("If columns line up, printer is OK");
        printer.println("Powered by XIOM");
        printer.cut();
        await sendRaw(printerName, printer.getBuffer());
      }
      async function rawTestPrint$1(text) {
        const settings2 = getSettings();
        const L = layout(settings2);
        const printer = makePrinter(L.width);
        for (const line of text.split("\n")) printer.println(line);
        printer.cut();
        await sendRaw(settings2.defaultPrinter, printer.getBuffer());
      }
      function resolveNames(order) {
        const db2 = getDb();
        const out = {};
        if (order.userId != null) {
          const u = db2.select().from(users).where(drizzleOrm.eq(users.id, order.userId)).get();
          if (u) out.servedBy = u.name;
        }
        if (order.tableId != null) {
          const t = db2.select().from(restaurantTables).where(drizzleOrm.eq(restaurantTables.id, order.tableId)).get();
          if (t) out.tableName = t.name;
        }
        if (order.waiterId != null) {
          const w = db2.select().from(waiters).where(drizzleOrm.eq(waiters.id, order.waiterId)).get();
          if (w) out.waiterName = w.name;
        }
        return out;
      }
      async function printReport(report) {
        const settings2 = getSettings();
        await printReportEscpos(report, settings2);
      }
      async function printTest() {
        const settings2 = getSettings();
        await testPrintEscpos(settings2.defaultPrinter);
      }
      async function printReceipt(order) {
        const settings2 = getSettings();
        await printReceiptEscpos(order, settings2, resolveNames(order));
      }
      async function printKitchenSlip(order) {
        const settings2 = getSettings();
        await printKitchenEscpos(order, settings2, resolveNames(order));
      }
      async function rawTestPrint(text) {
        await rawTestPrint$1(text);
      }
      function getSalesReport(filter) {
        const sqlite2 = getSqlite();
        const { from, to } = filter;
        if (!from || !to) throw new Error("Date range is required");
        if (from > to) throw new Error("From date must be before To date");
        const summaryRow = sqlite2.prepare(
          `SELECT
        COUNT(CASE WHEN status = 'paid' THEN 1 END) AS paidOrders,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN total END), 0) AS paidRevenue,
        COUNT(CASE WHEN status IN ('pending', 'kitchen_printed') THEN 1 END) AS pendingOrders,
        COALESCE(SUM(CASE WHEN status IN ('pending', 'kitchen_printed') THEN total END), 0) AS pendingAmount,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelledOrders,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN discount END), 0) AS totalDiscount
      FROM orders
      WHERE date(created_at) BETWEEN ? AND ?`
        ).get(from, to);
        const avgOrderValue = summaryRow.paidOrders > 0 ? Math.round(summaryRow.paidRevenue / summaryRow.paidOrders) : 0;
        const popular = sqlite2.prepare(
          `SELECT
        oi.product_name AS productName,
        oi.variant_name AS variantName,
        SUM(oi.quantity) AS quantity,
        SUM(oi.line_total) AS revenue
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.status = 'paid' AND date(o.created_at) BETWEEN ? AND ?
      GROUP BY oi.product_name, oi.variant_name
      ORDER BY quantity DESC, revenue DESC
      LIMIT 15`
        ).all(from, to);
        const daily = sqlite2.prepare(
          `SELECT
        date(created_at) AS date,
        COUNT(*) AS orders,
        COALESCE(SUM(total), 0) AS revenue
      FROM orders
      WHERE status = 'paid' AND date(created_at) BETWEEN ? AND ?
      GROUP BY date(created_at)
      ORDER BY date`
        ).all(from, to);
        return { from, to, summary: { ...summaryRow, avgOrderValue }, popular, daily };
      }
      async function backupDatabase() {
        const now = /* @__PURE__ */ new Date();
        const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
        const result = await electron.dialog.showSaveDialog({
          title: "Save Backup",
          defaultPath: `pos-backup-${stamp}.db`,
          filters: [{ name: "Database", extensions: ["db"] }]
        });
        if (result.canceled || !result.filePath) throw new Error("Backup cancelled");
        await getSqlite().backup(result.filePath);
        return result.filePath;
      }
      async function restoreDatabase() {
        const result = await electron.dialog.showOpenDialog({
          title: "Select Backup File",
          filters: [{ name: "Database", extensions: ["db"] }],
          properties: ["openFile"]
        });
        if (result.canceled || result.filePaths.length === 0) throw new Error("Restore cancelled");
        const backupPath = result.filePaths[0];
        if (!fs.existsSync(backupPath)) throw new Error("Backup file not found");
        const dbPath = path.join(electron.app.getPath("userData"), "restaurant-pos.db");
        const safetyPath = path.join(electron.app.getPath("userData"), "pre-restore-safety.db");
        await getSqlite().backup(safetyPath);
        closeDatabase();
        fs.copyFileSync(backupPath, dbPath);
        initDatabase();
        return backupPath;
      }
      function checkIntegrity() {
        const rows = getSqlite().pragma("integrity_check");
        const result = rows.map((r) => r.integrity_check).join("; ");
        if (result !== "ok") throw new Error(`Integrity check failed: ${result}`);
        return "Database integrity: OK";
      }
      function hashPin(pin, salt) {
        return crypto2.createHash("sha256").update(`${salt}:${pin}`).digest("hex");
      }
      function validatePin(pin) {
        if (!/^\d{4,6}$/.test(pin)) throw new Error("PIN must be 4-6 digits");
      }
      function toSafe(u) {
        return { id: u.id, name: u.name, role: u.role, isActive: u.isActive, createdAt: u.createdAt };
      }
      function hasAnyUser() {
        const row = getDb().select({ id: users.id }).from(users).limit(1).get();
        return row !== void 0;
      }
      function setupAdmin(name, pin) {
        if (hasAnyUser()) throw new Error("Setup already completed");
        const trimmed = name.trim();
        if (!trimmed) throw new Error("Name is required");
        validatePin(pin);
        const salt = crypto2.randomBytes(16).toString("hex");
        const row = getDb().insert(users).values({ name: trimmed, role: "admin", pinHash: hashPin(pin, salt), pinSalt: salt }).returning().get();
        return toSafe(row);
      }
      function login(pin) {
        validatePin(pin);
        const all = getDb().select().from(users).where(drizzleOrm.eq(users.isActive, true)).all();
        for (const u of all) {
          if (hashPin(pin, u.pinSalt) === u.pinHash) return toSafe(u);
        }
        throw new Error("Invalid PIN");
      }
      function listUsers() {
        return getDb().select().from(users).orderBy(drizzleOrm.asc(users.name)).all().map(toSafe);
      }
      function createUser(input) {
        const name = input.name.trim();
        if (!name) throw new Error("Name is required");
        validatePin(input.pin);
        const salt = crypto2.randomBytes(16).toString("hex");
        const row = getDb().insert(users).values({ name, role: input.role, pinHash: hashPin(input.pin, salt), pinSalt: salt }).returning().get();
        return toSafe(row);
      }
      function updateUser(input) {
        const { id, pin, ...changes } = input;
        const db2 = getDb();
        const existing = db2.select().from(users).where(drizzleOrm.eq(users.id, id)).get();
        if (!existing) throw new Error("User not found");
        if (changes.name !== void 0 && !changes.name.trim()) throw new Error("Name cannot be empty");
        const demotingAdmin = existing.role === "admin" && (changes.role === "cashier" || changes.isActive === false);
        if (demotingAdmin) {
          const activeAdmins = db2.select().from(users).where(drizzleOrm.eq(users.role, "admin")).all().filter((u) => u.isActive && u.id !== id);
          if (activeAdmins.length === 0) throw new Error("At least one active admin is required");
        }
        const finalChanges = { ...changes };
        if (changes.name !== void 0) finalChanges.name = changes.name.trim();
        if (pin !== void 0) {
          validatePin(pin);
          const salt = crypto2.randomBytes(16).toString("hex");
          finalChanges.pinSalt = salt;
          finalChanges.pinHash = hashPin(pin, salt);
        }
        const row = db2.update(users).set(finalChanges).where(drizzleOrm.eq(users.id, id)).returning().get();
        return toSafe(row);
      }
      var LICENSE_SECRET = "IsPz-2026-Kx9#mQv7$Lw2@Rt8!Zn4&Jh6";
      var cachedMachineId = null;
      function getMachineId() {
        if (cachedMachineId) return cachedMachineId;
        try {
          const out = child_process.execSync(
            'reg query "HKLM\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid',
            { encoding: "utf8" }
          );
          const match = out.match(/MachineGuid\s+REG_SZ\s+([a-f0-9-]+)/i);
          if (!match) throw new Error("MachineGuid not found");
          cachedMachineId = match[1].toUpperCase();
          return cachedMachineId;
        } catch {
          throw new Error("Could not read machine ID");
        }
      }
      function signature(machineId, expiry) {
        const raw = crypto2.createHmac("sha256", LICENSE_SECRET).update(`${machineId}:${expiry}`).digest("hex").toUpperCase().slice(0, 20);
        return `${raw.slice(0, 5)}-${raw.slice(5, 10)}-${raw.slice(10, 15)}-${raw.slice(15, 20)}`;
      }
      function todayStr() {
        const d = /* @__PURE__ */ new Date();
        return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      }
      function verifyKey(key) {
        const cleaned = key.trim().toUpperCase();
        const match = cleaned.match(/^([A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5})-(\d{8})$/);
        if (!match) return { valid: false, error: "Invalid key format" };
        const [, sig, expiry] = match;
        const machineId = getMachineId();
        if (signature(machineId, expiry) !== sig) {
          return { valid: false, error: "Key is not valid for this computer" };
        }
        if (expiry < todayStr()) {
          return { valid: false, error: `License expired on ${expiry.slice(0, 4)}-${expiry.slice(4, 6)}-${expiry.slice(6, 8)}` };
        }
        return { valid: true, expiry };
      }
      function activate(key) {
        const res = verifyKey(key);
        if (!res.valid) throw new Error(res.error ?? "Invalid key");
        const stmt = getSqlite().prepare(
          "INSERT INTO settings (key, value) VALUES ('licenseKey', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
        );
        stmt.run(key.trim().toUpperCase());
        return getLicenseStatus();
      }
      function getLicenseStatus() {
        const machineId = getMachineId();
        const row = getSqlite().prepare("SELECT value FROM settings WHERE key = 'licenseKey'").get();
        if (!row) return { activated: false, machineId, expiresOn: null, daysLeft: null };
        const res = verifyKey(row.value);
        if (!res.valid) {
          return { activated: false, machineId, expiresOn: null, daysLeft: null, error: res.error };
        }
        const e = res.expiry;
        const expiresOn = `${e.slice(0, 4)}-${e.slice(4, 6)}-${e.slice(6, 8)}`;
        const msLeft = (/* @__PURE__ */ new Date(`${expiresOn}T23:59:59`)).getTime() - Date.now();
        const daysLeft = Math.max(0, Math.ceil(msLeft / 864e5));
        return { activated: true, machineId, expiresOn, daysLeft };
      }
      var VALID_CATEGORIES = ["ingredients", "utilities", "salaries", "rent", "equipment", "other"];
      function validate(input) {
        if (input.amount !== void 0 && (!Number.isFinite(input.amount) || input.amount <= 0)) {
          throw new Error("Amount must be a positive number");
        }
        if (input.category !== void 0 && !VALID_CATEGORIES.includes(input.category)) {
          throw new Error("Invalid category");
        }
        if (input.expenseDate !== void 0 && !/^\d{4}-\d{2}-\d{2}$/.test(input.expenseDate)) {
          throw new Error("Invalid date");
        }
      }
      function listExpenseItems() {
        return getDb().select().from(expenseItems).orderBy(drizzleOrm.asc(expenseItems.name)).all();
      }
      function createExpenseItem(name) {
        const trimmed = name.trim();
        if (!trimmed) throw new Error("Item name is required");
        const existing = getSqlite().prepare("SELECT id FROM expense_items WHERE LOWER(name) = LOWER(?)").get(trimmed);
        if (existing) throw new Error("Item already exists");
        return getDb().insert(expenseItems).values({ name: trimmed }).returning().get();
      }
      function updateExpenseItem(input) {
        const { id, ...changes } = input;
        if (changes.name !== void 0) {
          changes.name = changes.name.trim();
          if (!changes.name) throw new Error("Item name cannot be empty");
        }
        const row = getDb().update(expenseItems).set(changes).where(drizzleOrm.eq(expenseItems.id, id)).returning().get();
        if (!row) throw new Error("Item not found");
        return row;
      }
      function listExpenses(filter) {
        const rows = getDb().select({
          id: expenses.id,
          expenseDate: expenses.expenseDate,
          category: expenses.category,
          expenseItemId: expenses.expenseItemId,
          itemName: expenseItems.name,
          quantity: expenses.quantity,
          description: expenses.description,
          amount: expenses.amount,
          userId: expenses.userId,
          createdAt: expenses.createdAt
        }).from(expenses).leftJoin(expenseItems, drizzleOrm.eq(expenses.expenseItemId, expenseItems.id)).where(drizzleOrm.and(drizzleOrm.gte(expenses.expenseDate, filter.from), drizzleOrm.lte(expenses.expenseDate, filter.to))).orderBy(drizzleOrm.desc(expenses.expenseDate), drizzleOrm.desc(expenses.id)).all();
        return rows;
      }
      function createExpense(input) {
        validate(input);
        const row = getDb().insert(expenses).values({
          expenseDate: input.expenseDate,
          category: input.category,
          expenseItemId: input.expenseItemId ?? null,
          quantity: input.quantity?.trim() || null,
          description: input.description?.trim() || null,
          amount: Math.round(input.amount),
          userId: input.userId ?? null
        }).returning().get();
        return { ...row, itemName: null };
      }
      function updateExpense(input) {
        const { id, ...changes } = input;
        validate(changes);
        const finalChanges = { ...changes };
        if (changes.description !== void 0) finalChanges.description = changes.description.trim() || null;
        if (changes.quantity !== void 0) finalChanges.quantity = changes.quantity.trim() || null;
        if (changes.amount !== void 0) finalChanges.amount = Math.round(changes.amount);
        const row = getDb().update(expenses).set(finalChanges).where(drizzleOrm.eq(expenses.id, id)).returning().get();
        if (!row) throw new Error("Expense not found");
        return { ...row, itemName: null };
      }
      function deleteExpense(id) {
        const result = getDb().delete(expenses).where(drizzleOrm.eq(expenses.id, id)).run();
        if (result.changes === 0) throw new Error("Expense not found");
      }
      function expenseSummary(filter) {
        const sqlite2 = getSqlite();
        const byCategory = sqlite2.prepare(
          `SELECT category, COALESCE(SUM(amount), 0) AS total
       FROM expenses WHERE expense_date BETWEEN ? AND ?
       GROUP BY category ORDER BY total DESC`
        ).all(filter.from, filter.to);
        const byItem = sqlite2.prepare(
          `SELECT ei.name AS itemName, COUNT(*) AS purchases,
              COALESCE(SUM(e.amount), 0) AS total, MAX(e.expense_date) AS lastDate
       FROM expenses e JOIN expense_items ei ON ei.id = e.expense_item_id
       WHERE e.expense_date BETWEEN ? AND ?
       GROUP BY ei.name ORDER BY total DESC`
        ).all(filter.from, filter.to);
        return {
          total: byCategory.reduce((s, r) => s + r.total, 0),
          byCategory,
          byItem
        };
      }
      function handle(channel, fn) {
        electron.ipcMain.handle(channel, (_event, ...args) => {
          try {
            return { ok: true, data: fn(...args) };
          } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error(`[ipc] ${channel} failed:`, message);
            return { ok: false, error: message };
          }
        });
      }
      function registerIpcHandlers() {
        handle("categories:list", listCategories);
        handle("categories:create", createCategory);
        handle("categories:update", updateCategory);
        handle("categories:delete", deleteCategory);
        handle("products:list", listProducts);
        handle("products:create", createProduct);
        handle("products:update", updateProduct);
        handle("products:delete", deleteProduct);
        handle("tables:list", tablesService.list);
        handle("tables:create", tablesService.create);
        handle("tables:update", tablesService.update);
        handle("tables:delete", tablesService.remove);
        handle("license:status", getLicenseStatus);
        handle("license:activate", activate);
        handle("auth:hasAnyUser", hasAnyUser);
        handle("auth:setupAdmin", setupAdmin);
        handle("auth:login", login);
        handle("users:list", listUsers);
        handle("users:create", createUser);
        handle("users:update", updateUser);
        electron.ipcMain.handle("settings:pickImage", async (_e, kind) => {
          try {
            const result = await electron.dialog.showOpenDialog({
              title: kind === "logo" ? "Select Receipt Logo" : "Select Payment QR Image",
              filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }],
              properties: ["openFile"]
            });
            if (result.canceled || result.filePaths.length === 0) {
              return { ok: false, error: "Cancelled" };
            }
            const destName = kind === "logo" ? "receipt-logo.png" : "payment-qr.png";
            const destPath = path.join(electron.app.getPath("userData"), destName);
            const sharp = require_stub();
            await sharp(result.filePaths[0]).flatten({ background: "#ffffff" }).resize(360, 360, { fit: "inside", withoutEnlargement: false }).greyscale().threshold(180).png().toFile(destPath);
            const key = kind === "logo" ? "receiptLogo" : "paymentQr";
            saveSettings({ [key]: destPath });
            return { ok: true, data: destPath };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Image failed" };
          }
        });
        electron.ipcMain.handle("settings:clearImage", (_e, kind) => {
          const key = kind === "logo" ? "receiptLogo" : "paymentQr";
          saveSettings({ [key]: "" });
          return { ok: true };
        });
        handle("settings:get", getSettings);
        handle("settings:save", saveSettings);
        electron.ipcMain.handle("printers:list", async () => {
          try {
            const win = electron.BrowserWindow.getAllWindows()[0];
            if (!win) return { ok: false, error: "No window available" };
            const printers = await win.webContents.getPrintersAsync();
            return { ok: true, data: printers.map((p) => ({ name: p.name, isDefault: false })) };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Failed to list printers" };
          }
        });
        handle("reports:sales", getSalesReport);
        handle("expenses:listItems", listExpenseItems);
        handle("expenses:createItem", createExpenseItem);
        handle("expenses:updateItem", updateExpenseItem);
        handle("expenses:list", listExpenses);
        handle("expenses:create", createExpense);
        handle("expenses:update", updateExpense);
        handle("expenses:delete", deleteExpense);
        handle("expenses:summary", expenseSummary);
        handle("customers:search", searchCustomers);
        electron.ipcMain.handle("backup:create", async () => {
          try {
            const path2 = await backupDatabase();
            return { ok: true, data: path2 };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Backup failed" };
          }
        });
        electron.ipcMain.handle("backup:restore", async () => {
          try {
            const path2 = await restoreDatabase();
            return { ok: true, data: path2 };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Restore failed" };
          }
        });
        handle("backup:check", checkIntegrity);
        electron.ipcMain.handle("print:report", async (_e, report) => {
          try {
            await printReport(report);
            return { ok: true };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
          }
        });
        electron.ipcMain.handle("print:raw", async (_e, text) => {
          try {
            await rawTestPrint(text);
            return { ok: true };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
          }
        });
        electron.ipcMain.handle("print:test", async () => {
          try {
            await printTest();
            return { ok: true };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
          }
        });
        electron.ipcMain.handle("print:receipt", async (_e, order) => {
          try {
            await printReceipt(order);
            return { ok: true };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
          }
        });
        electron.ipcMain.handle("print:kitchen", async (_e, order) => {
          try {
            await printKitchenSlip(order);
            return { ok: true };
          } catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : "Print failed" };
          }
        });
        handle("orders:create", createOrder);
        handle("orders:list", listOrders);
        handle("orders:updateItems", updateOrderItems);
        handle("orders:updateStatus", updateOrderStatus);
        handle("orders:markKitchenPrinted", markKitchenPrinted);
        handle("orders:addPayment", addOrderPayment);
        handle("orders:payments", listOrderPayments);
        handle("orders:unpaid", listUnpaidOrders);
        handle("waiters:list", waitersService.list);
        handle("waiters:create", waitersService.create);
        handle("waiters:update", waitersService.update);
        handle("waiters:delete", waitersService.remove);
      }
      function createWindow() {
        const mainWindow = new electron.BrowserWindow({
          title: "Restaurant POS",
          width: 1280,
          height: 800,
          show: false,
          autoHideMenuBar: true,
          ...process.platform === "linux" ? { icon } : {},
          webPreferences: {
            preload: path.join("/", "../preload/index.js"),
            sandbox: false
          }
        });
        mainWindow.on("ready-to-show", () => {
          mainWindow.show();
        });
        mainWindow.webContents.on("before-input-event", (_e, input) => {
          if (input.type === "keyDown" && input.key === "F12") {
            mainWindow.webContents.toggleDevTools();
          }
        });
        mainWindow.webContents.setWindowOpenHandler((details) => {
          electron.shell.openExternal(details.url);
          return { action: "deny" };
        });
        if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
          mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
        } else {
          mainWindow.loadFile(path.join("/", "../renderer/index.html"));
        }
      }
      electron.app.whenReady().then(() => {
        utils.electronApp.setAppUserModelId("com.restaurantpos.app");
        electron.app.on("browser-window-created", (_, window2) => {
          utils.optimizer.watchWindowShortcuts(window2);
        });
        initDatabase();
        registerIpcHandlers();
        createWindow();
        electron.app.on("activate", function() {
          if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
        });
      });
      electron.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
          closeDatabase();
          electron.app.quit();
        }
      });
    }
  });

  // shims/toolkit-preload.js
  var require_toolkit_preload = __commonJS({
    "shims/toolkit-preload.js"(exports, module) {
      init_process();
      module.exports = { electronAPI: {} };
    }
  });

  // vendor/preload/index.js
  var require_preload = __commonJS({
    "vendor/preload/index.js"() {
      "use strict";
      init_process();
      var electron = require_electron();
      var preload = require_toolkit_preload();
      function namedEntityApi(prefix) {
        return {
          list: () => electron.ipcRenderer.invoke(`${prefix}:list`),
          create: (input) => electron.ipcRenderer.invoke(`${prefix}:create`, input),
          update: (input) => electron.ipcRenderer.invoke(`${prefix}:update`, input),
          delete: (id) => electron.ipcRenderer.invoke(`${prefix}:delete`, id)
        };
      }
      var api = {
        categories: {
          list: () => electron.ipcRenderer.invoke("categories:list"),
          create: (input) => electron.ipcRenderer.invoke("categories:create", input),
          update: (input) => electron.ipcRenderer.invoke("categories:update", input),
          delete: (id) => electron.ipcRenderer.invoke("categories:delete", id)
        },
        products: {
          list: () => electron.ipcRenderer.invoke("products:list"),
          create: (input) => electron.ipcRenderer.invoke("products:create", input),
          update: (input) => electron.ipcRenderer.invoke("products:update", input),
          delete: (id) => electron.ipcRenderer.invoke("products:delete", id)
        },
        expenses: {
          listItems: () => electron.ipcRenderer.invoke("expenses:listItems"),
          createItem: (name) => electron.ipcRenderer.invoke("expenses:createItem", name),
          updateItem: (input) => electron.ipcRenderer.invoke("expenses:updateItem", input),
          list: (filter) => electron.ipcRenderer.invoke("expenses:list", filter),
          create: (input) => electron.ipcRenderer.invoke("expenses:create", input),
          update: (input) => electron.ipcRenderer.invoke("expenses:update", input),
          delete: (id) => electron.ipcRenderer.invoke("expenses:delete", id),
          summary: (filter) => electron.ipcRenderer.invoke("expenses:summary", filter)
        },
        customers: {
          search: (query) => electron.ipcRenderer.invoke("customers:search", query)
        },
        license: {
          status: () => electron.ipcRenderer.invoke("license:status"),
          activate: (key) => electron.ipcRenderer.invoke("license:activate", key)
        },
        auth: {
          hasAnyUser: () => electron.ipcRenderer.invoke("auth:hasAnyUser"),
          setupAdmin: (name, pin) => electron.ipcRenderer.invoke("auth:setupAdmin", name, pin),
          login: (pin) => electron.ipcRenderer.invoke("auth:login", pin)
        },
        users: {
          list: () => electron.ipcRenderer.invoke("users:list"),
          create: (input) => electron.ipcRenderer.invoke("users:create", input),
          update: (input) => electron.ipcRenderer.invoke("users:update", input)
        },
        settings: {
          pickImage: (kind) => electron.ipcRenderer.invoke("settings:pickImage", kind),
          clearImage: (kind) => electron.ipcRenderer.invoke("settings:clearImage", kind),
          get: () => electron.ipcRenderer.invoke("settings:get"),
          save: (input) => electron.ipcRenderer.invoke("settings:save", input)
        },
        printers: {
          list: () => electron.ipcRenderer.invoke("printers:list")
        },
        backup: {
          create: () => electron.ipcRenderer.invoke("backup:create"),
          restore: () => electron.ipcRenderer.invoke("backup:restore"),
          check: () => electron.ipcRenderer.invoke("backup:check")
        },
        reports: {
          sales: (filter) => electron.ipcRenderer.invoke("reports:sales", filter)
        },
        print: {
          raw: (text) => electron.ipcRenderer.invoke("print:raw", text),
          test: () => electron.ipcRenderer.invoke("print:test"),
          report: (report) => electron.ipcRenderer.invoke("print:report", report),
          receipt: (order) => electron.ipcRenderer.invoke("print:receipt", order),
          kitchen: (order) => electron.ipcRenderer.invoke("print:kitchen", order)
        },
        orders: {
          list: (filter) => electron.ipcRenderer.invoke("orders:list", filter),
          create: (input) => electron.ipcRenderer.invoke("orders:create", input),
          updateStatus: (id, status) => electron.ipcRenderer.invoke("orders:updateStatus", id, status),
          markKitchenPrinted: (id) => electron.ipcRenderer.invoke("orders:markKitchenPrinted", id),
          addPayment: (input) => electron.ipcRenderer.invoke("orders:addPayment", input),
          payments: (orderId) => electron.ipcRenderer.invoke("orders:payments", orderId),
          unpaid: (query) => electron.ipcRenderer.invoke("orders:unpaid", query),
          updateItems: (input) => electron.ipcRenderer.invoke("orders:updateItems", input)
        },
        tables: namedEntityApi("tables"),
        waiters: namedEntityApi("waiters")
      };
      if (process.contextIsolated) {
        try {
          electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
          electron.contextBridge.exposeInMainWorld("api", api);
        } catch (error) {
          console.error(error);
        }
      } else {
        window.electron = preload.electronAPI;
        window.api = api;
      }
    }
  });

  // entry.js
  init_process();
  var import_sql = __toESM(require_sql_wasm());
  var open = () => new Promise((res, rej) => {
    const r = indexedDB.open("pos", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  var idb = async (mode, fn) => {
    const d = await open();
    return new Promise((res, rej) => {
      const q = fn(d.transaction("kv", mode).objectStore("kv"));
      q.onsuccess = () => res(q.result);
      q.onerror = () => rej(q.error);
    });
  };
  (async () => {
    const SQL = await (0, import_sql.default)({ locateFile: (f) => "./" + f });
    const bytes = await idb("readonly", (s2) => s2.get("db"));
    globalThis.__POS = { SQL, bytes: bytes ? new Uint8Array(bytes) : null, put: (b) => idb("readwrite", (s2) => s2.put(b, "db")) };
    require_main();
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
    require_preload();
    const H = globalThis.__handlers, fail = (m) => async () => ({ ok: false, error: m });
    for (const c of ["print:raw", "print:test", "print:report", "print:receipt", "print:kitchen"]) H[c] = fail("Phone se printing abhi support nahi hai");
    H["printers:list"] = async () => ({ ok: true, data: [] });
    H["settings:pickImage"] = fail("Logo phone se abhi change nahi ho sakta");
    H["backup:create"] = async () => {
      const b = __POS.db.save() || __POS.db.h.export();
      const n = "pos-backup-" + (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) + ".db";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([b]));
      a.download = n;
      a.click();
      return { ok: true, data: n };
    };
    H["backup:restore"] = () => new Promise((res) => {
      const i = document.createElement("input");
      i.type = "file";
      i.accept = ".db";
      i.onchange = async () => {
        await __POS.put(new Uint8Array(await i.files[0].arrayBuffer()));
        res({ ok: true, data: i.files[0].name });
        location.reload();
      };
      i.click();
    });
    addEventListener("pagehide", () => __POS.db.save());
    const s = document.createElement("script");
    s.type = "module";
    s.src = "./assets/" + window.__RENDERER;
    document.body.appendChild(s);
  })();
})();
/*! Bundled license information:

@noble/hashes/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
