(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // node_modules/.pnpm/@firebase+util@1.6.0/node_modules/@firebase/util/dist/index.esm2017.js
  var stringToByteArray$1 = function(str) {
    const out = [];
    let p2 = 0;
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) {
        out[p2++] = c;
      } else if (c < 2048) {
        out[p2++] = c >> 6 | 192;
        out[p2++] = c & 63 | 128;
      } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
        c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        out[p2++] = c >> 18 | 240;
        out[p2++] = c >> 12 & 63 | 128;
        out[p2++] = c >> 6 & 63 | 128;
        out[p2++] = c & 63 | 128;
      } else {
        out[p2++] = c >> 12 | 224;
        out[p2++] = c >> 6 & 63 | 128;
        out[p2++] = c & 63 | 128;
      }
    }
    return out;
  };
  var byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c2 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
        out[c++] = String.fromCharCode(55296 + (u >> 10));
        out[c++] = String.fromCharCode(56320 + (u & 1023));
      } else {
        const c2 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
      }
    }
    return out.join("");
  };
  var base64 = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i = 0; i < input.length; i += 3) {
        const byte1 = input[i];
        const haveByte2 = i + 1 < input.length;
        const byte2 = haveByte2 ? input[i + 1] : 0;
        const haveByte3 = i + 2 < input.length;
        const byte3 = haveByte3 ? input[i + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i = 0; i < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i++)];
        const haveByte2 = i < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
        ++i;
        const haveByte3 = i < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        const haveByte4 = i < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw Error();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i = 0; i < this.ENCODED_VALS.length; i++) {
          this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
          this.charToByteMap_[this.byteToCharMap_[i]] = i;
          this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
          if (i >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
          }
        }
      }
    }
  };
  var base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  var base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  var Deferred = class {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  };
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isElectron() {
    return getUA().indexOf("Electron/") >= 0;
  }
  function isIE() {
    const ua2 = getUA();
    return ua2.indexOf("MSIE ") >= 0 || ua2.indexOf("Trident/") >= 0;
  }
  function isUWP() {
    return getUA().indexOf("MSAppHost/") >= 0;
  }
  function isIndexedDBAvailable() {
    return typeof indexedDB === "object";
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a2;
          reject(((_a2 = request.error) === null || _a2 === void 0 ? void 0 : _a2.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  var ERROR_NAME = "FirebaseError";
  var FirebaseError = class extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  };
  var ErrorFactory = class {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = `${this.service}/${code}`;
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  };
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  var PATTERN = /\{\$([^}]+)}/g;
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    for (const k3 of aKeys) {
      if (!bKeys.includes(k3)) {
        return false;
      }
      const aProp = a[k3];
      const bProp = b[k3];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k3 of bKeys) {
      if (!aKeys.includes(k3)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  var MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }

  // node_modules/.pnpm/@firebase+component@0.5.14/node_modules/@firebase/component/dist/esm/index.esm2017.js
  var Component = class {
    constructor(name3, instanceFactory, type) {
      this.name = name3;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  };
  var DEFAULT_ENTRY_NAME = "[DEFAULT]";
  var Provider = class {
    constructor(name3, container) {
      this.name = name3;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      var _a2;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
      const optional = (_a2 = options === null || options === void 0 ? void 0 : options.optional) !== null && _a2 !== void 0 ? _a2 : false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e) {
          if (optional) {
            return null;
          } else {
            throw e;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error(`Service ${this.name} is not available`);
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
        } catch (e) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    onInit(callback, identifier) {
      var _a2;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = (_a2 = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a2 !== void 0 ? _a2 : /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch (_a2) {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch (_a2) {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  };
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var ComponentContainer = class {
    constructor(name3) {
      this.name = name3;
      this.providers = /* @__PURE__ */ new Map();
    }
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    getProvider(name3) {
      if (this.providers.has(name3)) {
        return this.providers.get(name3);
      }
      const provider = new Provider(name3, this);
      this.providers.set(name3, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  };

  // node_modules/.pnpm/@firebase+logger@0.3.2/node_modules/@firebase/logger/dist/esm/index.esm2017.js
  var instances = [];
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  var levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  var defaultLogLevel = LogLevel.INFO;
  var ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  var defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = new Date().toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
      throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
  };
  var Logger = class {
    constructor(name3) {
      this.name = name3;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
      instances.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
      }
      this._logLevel = val;
    }
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  };

  // node_modules/.pnpm/idb@7.0.1/node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);

  // node_modules/.pnpm/idb@7.0.1/node_modules/idb/build/index.js
  function openDB(name3, version3, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name3, version3);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
      });
    }
    if (blocked)
      request.addEventListener("blocked", () => blocked());
    openPromise.then((db3) => {
      if (terminated)
        db3.addEventListener("close", () => terminated());
      if (blocking)
        db3.addEventListener("versionchange", () => blocking());
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => __spreadProps(__spreadValues({}, oldTraps), {
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // node_modules/.pnpm/@firebase+app@0.7.25/node_modules/@firebase/app/dist/esm/index.esm2017.js
  var PlatformLoggerServiceImpl = class {
    constructor(container) {
      this.container = container;
    }
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return `${service.library}/${service.version}`;
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  };
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  var name$o = "@firebase/app";
  var version$1 = "0.7.25";
  var logger = new Logger("@firebase/app");
  var name$n = "@firebase/app-compat";
  var name$m = "@firebase/analytics-compat";
  var name$l = "@firebase/analytics";
  var name$k = "@firebase/app-check-compat";
  var name$j = "@firebase/app-check";
  var name$i = "@firebase/auth";
  var name$h = "@firebase/auth-compat";
  var name$g = "@firebase/database";
  var name$f = "@firebase/database-compat";
  var name$e = "@firebase/functions";
  var name$d = "@firebase/functions-compat";
  var name$c = "@firebase/installations";
  var name$b = "@firebase/installations-compat";
  var name$a = "@firebase/messaging";
  var name$9 = "@firebase/messaging-compat";
  var name$8 = "@firebase/performance";
  var name$7 = "@firebase/performance-compat";
  var name$6 = "@firebase/remote-config";
  var name$5 = "@firebase/remote-config-compat";
  var name$4 = "@firebase/storage";
  var name$3 = "@firebase/storage-compat";
  var name$2 = "@firebase/firestore";
  var name$1 = "@firebase/firestore-compat";
  var name = "firebase";
  var version = "9.8.2";
  var DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
  var PLATFORM_LOG_STRING = {
    [name$o]: "fire-core",
    [name$n]: "fire-core-compat",
    [name$l]: "fire-analytics",
    [name$m]: "fire-analytics-compat",
    [name$j]: "fire-app-check",
    [name$k]: "fire-app-check-compat",
    [name$i]: "fire-auth",
    [name$h]: "fire-auth-compat",
    [name$g]: "fire-rtdb",
    [name$f]: "fire-rtdb-compat",
    [name$e]: "fire-fn",
    [name$d]: "fire-fn-compat",
    [name$c]: "fire-iid",
    [name$b]: "fire-iid-compat",
    [name$a]: "fire-fcm",
    [name$9]: "fire-fcm-compat",
    [name$8]: "fire-perf",
    [name$7]: "fire-perf-compat",
    [name$6]: "fire-rc",
    [name$5]: "fire-rc-compat",
    [name$4]: "fire-gcs",
    [name$3]: "fire-gcs-compat",
    [name$2]: "fire-fst",
    [name$1]: "fire-fst-compat",
    "fire-js": "fire-js",
    [name]: "fire-js-all"
  };
  var _apps = /* @__PURE__ */ new Map();
  var _components = /* @__PURE__ */ new Map();
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    return true;
  }
  function _getProvider(app2, name3) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name3);
  }
  var ERRORS = {
    ["no-app"]: "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
    ["bad-app-name"]: "Illegal App name: '{$appName}",
    ["duplicate-app"]: "Firebase App named '{$appName}' already exists with different options or config",
    ["app-deleted"]: "Firebase App named '{$appName}' already deleted",
    ["invalid-app-argument"]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    ["invalid-log-argument"]: "First argument to `onLog` must be null or a function.",
    ["storage-open"]: "Error thrown when opening storage. Original error: {$originalErrorMessage}.",
    ["storage-get"]: "Error thrown when reading from storage. Original error: {$originalErrorMessage}.",
    ["storage-set"]: "Error thrown when writing to storage. Original error: {$originalErrorMessage}.",
    ["storage-delete"]: "Error thrown when deleting from storage. Original error: {$originalErrorMessage}."
  };
  var ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
  var FirebaseAppImpl = class {
    constructor(options, config, container) {
      this._isDeleted = false;
      this._options = Object.assign({}, options);
      this._config = Object.assign({}, config);
      this._name = config.name;
      this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
      }
    }
  };
  var SDK_VERSION = version;
  function initializeApp(options, rawConfig = {}) {
    if (typeof rawConfig !== "object") {
      const name4 = rawConfig;
      rawConfig = { name: name4 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name3 = config.name;
    if (typeof name3 !== "string" || !name3) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name3)
      });
    }
    const existingApp = _apps.get(name3);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name3 });
      }
    }
    const container = new ComponentContainer(name3);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name3, newApp);
    return newApp;
  }
  function getApp(name3 = DEFAULT_ENTRY_NAME2) {
    const app2 = _apps.get(name3);
    if (!app2) {
      throw ERROR_FACTORY.create("no-app", { appName: name3 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version3, variant) {
    var _a2;
    let library = (_a2 = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a2 !== void 0 ? _a2 : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version3.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version3}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version3}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(`${library}-version`, () => ({ library, version: version3 }), "VERSION"));
  }
  var DB_NAME = "firebase-heartbeat-database";
  var DB_VERSION = 1;
  var STORE_NAME = "firebase-heartbeat-store";
  var dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db3, oldVersion) => {
          switch (oldVersion) {
            case 0:
              db3.createObjectStore(STORE_NAME);
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("storage-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db3 = await getDbPromise();
      return db3.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app2));
    } catch (e) {
      throw ERROR_FACTORY.create("storage-get", {
        originalErrorMessage: e.message
      });
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db3 = await getDbPromise();
      const tx = db3.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      return tx.done;
    } catch (e) {
      throw ERROR_FACTORY.create("storage-set", {
        originalErrorMessage: e.message
      });
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  var MAX_HEADER_BYTES = 1024;
  var STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
  var HeartbeatServiceImpl = class {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app2 = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app2);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    async triggerHeartbeat() {
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (this._heartbeatsCache === null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
      }
      this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
        const now = Date.now();
        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
      });
      return this._storage.overwrite(this._heartbeatsCache);
    }
    async getHeartbeatsHeader() {
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    }
  };
  function getUTCDateString() {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb2) => hb2.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  var HeartbeatStorageImpl = class {
    constructor(app2) {
      this.app = app2;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        return idbHeartbeatObject || { heartbeats: [] };
      }
    }
    async overwrite(heartbeatsObject) {
      var _a2;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a2 = heartbeatsObject.lastSentHeartbeatDate) !== null && _a2 !== void 0 ? _a2 : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    async add(heartbeatsObject) {
      var _a2;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a2 = heartbeatsObject.lastSentHeartbeatDate) !== null && _a2 !== void 0 ? _a2 : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  };
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsCache })).length;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component("platform-logger", (container) => new PlatformLoggerServiceImpl(container), "PRIVATE"));
    _registerComponent(new Component("heartbeat", (container) => new HeartbeatServiceImpl(container), "PRIVATE"));
    registerVersion(name$o, version$1, variant);
    registerVersion(name$o, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");

  // node_modules/.pnpm/firebase@9.8.2/node_modules/firebase/app/dist/index.esm.js
  var name2 = "firebase";
  var version2 = "9.8.2";
  registerVersion(name2, version2, "app");

  // node_modules/.pnpm/@firebase+webchannel-wrapper@0.6.1/node_modules/@firebase/webchannel-wrapper/dist/index.esm2017.js
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var esm = {};
  var k;
  var goog = goog || {};
  var l = commonjsGlobal || self;
  function aa() {
  }
  function ba(a) {
    var b = typeof a;
    b = b != "object" ? b : a ? Array.isArray(a) ? "array" : b : "null";
    return b == "array" || b == "object" && typeof a.length == "number";
  }
  function p(a) {
    var b = typeof a;
    return b == "object" && a != null || b == "function";
  }
  function da(a) {
    return Object.prototype.hasOwnProperty.call(a, ea) && a[ea] || (a[ea] = ++fa);
  }
  var ea = "closure_uid_" + (1e9 * Math.random() >>> 0);
  var fa = 0;
  function ha(a, b, c) {
    return a.call.apply(a.bind, arguments);
  }
  function ia(a, b, c) {
    if (!a)
      throw Error();
    if (2 < arguments.length) {
      var d = Array.prototype.slice.call(arguments, 2);
      return function() {
        var e = Array.prototype.slice.call(arguments);
        Array.prototype.unshift.apply(e, d);
        return a.apply(b, e);
      };
    }
    return function() {
      return a.apply(b, arguments);
    };
  }
  function q(a, b, c) {
    Function.prototype.bind && Function.prototype.bind.toString().indexOf("native code") != -1 ? q = ha : q = ia;
    return q.apply(null, arguments);
  }
  function ja(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
      var d = c.slice();
      d.push.apply(d, arguments);
      return a.apply(this, d);
    };
  }
  function t(a, b) {
    function c() {
    }
    c.prototype = b.prototype;
    a.Z = b.prototype;
    a.prototype = new c();
    a.prototype.constructor = a;
    a.Vb = function(d, e, f) {
      for (var h = Array(arguments.length - 2), n = 2; n < arguments.length; n++)
        h[n - 2] = arguments[n];
      return b.prototype[e].apply(d, h);
    };
  }
  function v() {
    this.s = this.s;
    this.o = this.o;
  }
  var ka = 0;
  var la = {};
  v.prototype.s = false;
  v.prototype.na = function() {
    if (!this.s && (this.s = true, this.M(), ka != 0)) {
      var a = da(this);
      delete la[a];
    }
  };
  v.prototype.M = function() {
    if (this.o)
      for (; this.o.length; )
        this.o.shift()();
  };
  var ma = Array.prototype.indexOf ? function(a, b) {
    return Array.prototype.indexOf.call(a, b, void 0);
  } : function(a, b) {
    if (typeof a === "string")
      return typeof b !== "string" || b.length != 1 ? -1 : a.indexOf(b, 0);
    for (let c = 0; c < a.length; c++)
      if (c in a && a[c] === b)
        return c;
    return -1;
  };
  var na = Array.prototype.forEach ? function(a, b, c) {
    Array.prototype.forEach.call(a, b, c);
  } : function(a, b, c) {
    const d = a.length, e = typeof a === "string" ? a.split("") : a;
    for (let f = 0; f < d; f++)
      f in e && b.call(c, e[f], f, a);
  };
  function oa(a) {
    a: {
      var b = pa;
      const c = a.length, d = typeof a === "string" ? a.split("") : a;
      for (let e = 0; e < c; e++)
        if (e in d && b.call(void 0, d[e], e, a)) {
          b = e;
          break a;
        }
      b = -1;
    }
    return 0 > b ? null : typeof a === "string" ? a.charAt(b) : a[b];
  }
  function qa(a) {
    return Array.prototype.concat.apply([], arguments);
  }
  function ra(a) {
    const b = a.length;
    if (0 < b) {
      const c = Array(b);
      for (let d = 0; d < b; d++)
        c[d] = a[d];
      return c;
    }
    return [];
  }
  function sa(a) {
    return /^[\s\xa0]*$/.test(a);
  }
  var ta = String.prototype.trim ? function(a) {
    return a.trim();
  } : function(a) {
    return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(a)[1];
  };
  function w(a, b) {
    return a.indexOf(b) != -1;
  }
  function ua(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
  }
  var x;
  a: {
    va = l.navigator;
    if (va) {
      wa2 = va.userAgent;
      if (wa2) {
        x = wa2;
        break a;
      }
    }
    x = "";
  }
  var va;
  var wa2;
  function xa(a, b, c) {
    for (const d in a)
      b.call(c, a[d], d, a);
  }
  function ya(a) {
    const b = {};
    for (const c in a)
      b[c] = a[c];
    return b;
  }
  var za = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
  function Aa(a, b) {
    let c, d;
    for (let e = 1; e < arguments.length; e++) {
      d = arguments[e];
      for (c in d)
        a[c] = d[c];
      for (let f = 0; f < za.length; f++)
        c = za[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
  function Ca(a) {
    Ca[" "](a);
    return a;
  }
  Ca[" "] = aa;
  function Fa(a) {
    var b = Ga;
    return Object.prototype.hasOwnProperty.call(b, 9) ? b[9] : b[9] = a(9);
  }
  var Ha = w(x, "Opera");
  var y = w(x, "Trident") || w(x, "MSIE");
  var Ia = w(x, "Edge");
  var Ja = Ia || y;
  var Ka = w(x, "Gecko") && !(w(x.toLowerCase(), "webkit") && !w(x, "Edge")) && !(w(x, "Trident") || w(x, "MSIE")) && !w(x, "Edge");
  var La = w(x.toLowerCase(), "webkit") && !w(x, "Edge");
  function Ma() {
    var a = l.document;
    return a ? a.documentMode : void 0;
  }
  var Na;
  a: {
    Oa = "", Pa2 = function() {
      var a = x;
      if (Ka)
        return /rv:([^\);]+)(\)|;)/.exec(a);
      if (Ia)
        return /Edge\/([\d\.]+)/.exec(a);
      if (y)
        return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
      if (La)
        return /WebKit\/(\S+)/.exec(a);
      if (Ha)
        return /(?:Version)[ \/]?(\S+)/.exec(a);
    }();
    Pa2 && (Oa = Pa2 ? Pa2[1] : "");
    if (y) {
      Qa = Ma();
      if (Qa != null && Qa > parseFloat(Oa)) {
        Na = String(Qa);
        break a;
      }
    }
    Na = Oa;
  }
  var Oa;
  var Pa2;
  var Qa;
  var Ga = {};
  function Ra() {
    return Fa(function() {
      let a = 0;
      const b = ta(String(Na)).split("."), c = ta("9").split("."), d = Math.max(b.length, c.length);
      for (let h = 0; a == 0 && h < d; h++) {
        var e = b[h] || "", f = c[h] || "";
        do {
          e = /(\d*)(\D*)(.*)/.exec(e) || ["", "", "", ""];
          f = /(\d*)(\D*)(.*)/.exec(f) || ["", "", "", ""];
          if (e[0].length == 0 && f[0].length == 0)
            break;
          a = ua(e[1].length == 0 ? 0 : parseInt(e[1], 10), f[1].length == 0 ? 0 : parseInt(f[1], 10)) || ua(e[2].length == 0, f[2].length == 0) || ua(e[2], f[2]);
          e = e[3];
          f = f[3];
        } while (a == 0);
      }
      return 0 <= a;
    });
  }
  var Sa;
  if (l.document && y) {
    Ta = Ma();
    Sa = Ta ? Ta : parseInt(Na, 10) || void 0;
  } else
    Sa = void 0;
  var Ta;
  var Ua = Sa;
  var Va = function() {
    if (!l.addEventListener || !Object.defineProperty)
      return false;
    var a = false, b = Object.defineProperty({}, "passive", { get: function() {
      a = true;
    } });
    try {
      l.addEventListener("test", aa, b), l.removeEventListener("test", aa, b);
    } catch (c) {
    }
    return a;
  }();
  function z(a, b) {
    this.type = a;
    this.g = this.target = b;
    this.defaultPrevented = false;
  }
  z.prototype.h = function() {
    this.defaultPrevented = true;
  };
  function A(a, b) {
    z.call(this, a ? a.type : "");
    this.relatedTarget = this.g = this.target = null;
    this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
    this.key = "";
    this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
    this.state = null;
    this.pointerId = 0;
    this.pointerType = "";
    this.i = null;
    if (a) {
      var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
      this.target = a.target || a.srcElement;
      this.g = b;
      if (b = a.relatedTarget) {
        if (Ka) {
          a: {
            try {
              Ca(b.nodeName);
              var e = true;
              break a;
            } catch (f) {
            }
            e = false;
          }
          e || (b = null);
        }
      } else
        c == "mouseover" ? b = a.fromElement : c == "mouseout" && (b = a.toElement);
      this.relatedTarget = b;
      d ? (this.clientX = d.clientX !== void 0 ? d.clientX : d.pageX, this.clientY = d.clientY !== void 0 ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX, this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
      this.button = a.button;
      this.key = a.key || "";
      this.ctrlKey = a.ctrlKey;
      this.altKey = a.altKey;
      this.shiftKey = a.shiftKey;
      this.metaKey = a.metaKey;
      this.pointerId = a.pointerId || 0;
      this.pointerType = typeof a.pointerType === "string" ? a.pointerType : Wa[a.pointerType] || "";
      this.state = a.state;
      this.i = a;
      a.defaultPrevented && A.Z.h.call(this);
    }
  }
  t(A, z);
  var Wa = { 2: "touch", 3: "pen", 4: "mouse" };
  A.prototype.h = function() {
    A.Z.h.call(this);
    var a = this.i;
    a.preventDefault ? a.preventDefault() : a.returnValue = false;
  };
  var B = "closure_listenable_" + (1e6 * Math.random() | 0);
  var Xa = 0;
  function Ya(a, b, c, d, e) {
    this.listener = a;
    this.proxy = null;
    this.src = b;
    this.type = c;
    this.capture = !!d;
    this.ia = e;
    this.key = ++Xa;
    this.ca = this.fa = false;
  }
  function Za(a) {
    a.ca = true;
    a.listener = null;
    a.proxy = null;
    a.src = null;
    a.ia = null;
  }
  function $a(a) {
    this.src = a;
    this.g = {};
    this.h = 0;
  }
  $a.prototype.add = function(a, b, c, d, e) {
    var f = a.toString();
    a = this.g[f];
    a || (a = this.g[f] = [], this.h++);
    var h = ab(a, b, d, e);
    -1 < h ? (b = a[h], c || (b.fa = false)) : (b = new Ya(b, this.src, f, !!d, e), b.fa = c, a.push(b));
    return b;
  };
  function bb(a, b) {
    var c = b.type;
    if (c in a.g) {
      var d = a.g[c], e = ma(d, b), f;
      (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
      f && (Za(b), a.g[c].length == 0 && (delete a.g[c], a.h--));
    }
  }
  function ab(a, b, c, d) {
    for (var e = 0; e < a.length; ++e) {
      var f = a[e];
      if (!f.ca && f.listener == b && f.capture == !!c && f.ia == d)
        return e;
    }
    return -1;
  }
  var cb = "closure_lm_" + (1e6 * Math.random() | 0);
  var db = {};
  function fb(a, b, c, d, e) {
    if (d && d.once)
      return gb(a, b, c, d, e);
    if (Array.isArray(b)) {
      for (var f = 0; f < b.length; f++)
        fb(a, b[f], c, d, e);
      return null;
    }
    c = hb(c);
    return a && a[B] ? a.N(b, c, p(d) ? !!d.capture : !!d, e) : ib(a, b, c, false, d, e);
  }
  function ib(a, b, c, d, e, f) {
    if (!b)
      throw Error("Invalid event type");
    var h = p(e) ? !!e.capture : !!e, n = jb(a);
    n || (a[cb] = n = new $a(a));
    c = n.add(b, c, d, h, f);
    if (c.proxy)
      return c;
    d = kb();
    c.proxy = d;
    d.src = a;
    d.listener = c;
    if (a.addEventListener)
      Va || (e = h), e === void 0 && (e = false), a.addEventListener(b.toString(), d, e);
    else if (a.attachEvent)
      a.attachEvent(lb(b.toString()), d);
    else if (a.addListener && a.removeListener)
      a.addListener(d);
    else
      throw Error("addEventListener and attachEvent are unavailable.");
    return c;
  }
  function kb() {
    function a(c) {
      return b.call(a.src, a.listener, c);
    }
    var b = mb;
    return a;
  }
  function gb(a, b, c, d, e) {
    if (Array.isArray(b)) {
      for (var f = 0; f < b.length; f++)
        gb(a, b[f], c, d, e);
      return null;
    }
    c = hb(c);
    return a && a[B] ? a.O(b, c, p(d) ? !!d.capture : !!d, e) : ib(a, b, c, true, d, e);
  }
  function nb(a, b, c, d, e) {
    if (Array.isArray(b))
      for (var f = 0; f < b.length; f++)
        nb(a, b[f], c, d, e);
    else
      (d = p(d) ? !!d.capture : !!d, c = hb(c), a && a[B]) ? (a = a.i, b = String(b).toString(), b in a.g && (f = a.g[b], c = ab(f, c, d, e), -1 < c && (Za(f[c]), Array.prototype.splice.call(f, c, 1), f.length == 0 && (delete a.g[b], a.h--)))) : a && (a = jb(a)) && (b = a.g[b.toString()], a = -1, b && (a = ab(b, c, d, e)), (c = -1 < a ? b[a] : null) && ob(c));
  }
  function ob(a) {
    if (typeof a !== "number" && a && !a.ca) {
      var b = a.src;
      if (b && b[B])
        bb(b.i, a);
      else {
        var c = a.type, d = a.proxy;
        b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent ? b.detachEvent(lb(c), d) : b.addListener && b.removeListener && b.removeListener(d);
        (c = jb(b)) ? (bb(c, a), c.h == 0 && (c.src = null, b[cb] = null)) : Za(a);
      }
    }
  }
  function lb(a) {
    return a in db ? db[a] : db[a] = "on" + a;
  }
  function mb(a, b) {
    if (a.ca)
      a = true;
    else {
      b = new A(b, this);
      var c = a.listener, d = a.ia || a.src;
      a.fa && ob(a);
      a = c.call(d, b);
    }
    return a;
  }
  function jb(a) {
    a = a[cb];
    return a instanceof $a ? a : null;
  }
  var pb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
  function hb(a) {
    if (typeof a === "function")
      return a;
    a[pb] || (a[pb] = function(b) {
      return a.handleEvent(b);
    });
    return a[pb];
  }
  function C() {
    v.call(this);
    this.i = new $a(this);
    this.P = this;
    this.I = null;
  }
  t(C, v);
  C.prototype[B] = true;
  C.prototype.removeEventListener = function(a, b, c, d) {
    nb(this, a, b, c, d);
  };
  function D(a, b) {
    var c, d = a.I;
    if (d)
      for (c = []; d; d = d.I)
        c.push(d);
    a = a.P;
    d = b.type || b;
    if (typeof b === "string")
      b = new z(b, a);
    else if (b instanceof z)
      b.target = b.target || a;
    else {
      var e = b;
      b = new z(d, a);
      Aa(b, e);
    }
    e = true;
    if (c)
      for (var f = c.length - 1; 0 <= f; f--) {
        var h = b.g = c[f];
        e = qb(h, d, true, b) && e;
      }
    h = b.g = a;
    e = qb(h, d, true, b) && e;
    e = qb(h, d, false, b) && e;
    if (c)
      for (f = 0; f < c.length; f++)
        h = b.g = c[f], e = qb(h, d, false, b) && e;
  }
  C.prototype.M = function() {
    C.Z.M.call(this);
    if (this.i) {
      var a = this.i, c;
      for (c in a.g) {
        for (var d = a.g[c], e = 0; e < d.length; e++)
          Za(d[e]);
        delete a.g[c];
        a.h--;
      }
    }
    this.I = null;
  };
  C.prototype.N = function(a, b, c, d) {
    return this.i.add(String(a), b, false, c, d);
  };
  C.prototype.O = function(a, b, c, d) {
    return this.i.add(String(a), b, true, c, d);
  };
  function qb(a, b, c, d) {
    b = a.i.g[String(b)];
    if (!b)
      return true;
    b = b.concat();
    for (var e = true, f = 0; f < b.length; ++f) {
      var h = b[f];
      if (h && !h.ca && h.capture == c) {
        var n = h.listener, u = h.ia || h.src;
        h.fa && bb(a.i, h);
        e = n.call(u, d) !== false && e;
      }
    }
    return e && !d.defaultPrevented;
  }
  var rb = l.JSON.stringify;
  function sb() {
    var a = tb;
    let b = null;
    a.g && (b = a.g, a.g = a.g.next, a.g || (a.h = null), b.next = null);
    return b;
  }
  var ub = class {
    constructor() {
      this.h = this.g = null;
    }
    add(a, b) {
      const c = vb.get();
      c.set(a, b);
      this.h ? this.h.next = c : this.g = c;
      this.h = c;
    }
  };
  var vb = new class {
    constructor(a, b) {
      this.i = a;
      this.j = b;
      this.h = 0;
      this.g = null;
    }
    get() {
      let a;
      0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
      return a;
    }
  }(() => new wb(), (a) => a.reset());
  var wb = class {
    constructor() {
      this.next = this.g = this.h = null;
    }
    set(a, b) {
      this.h = a;
      this.g = b;
      this.next = null;
    }
    reset() {
      this.next = this.g = this.h = null;
    }
  };
  function yb(a) {
    l.setTimeout(() => {
      throw a;
    }, 0);
  }
  function zb(a, b) {
    Ab || Bb();
    Cb || (Ab(), Cb = true);
    tb.add(a, b);
  }
  var Ab;
  function Bb() {
    var a = l.Promise.resolve(void 0);
    Ab = function() {
      a.then(Db);
    };
  }
  var Cb = false;
  var tb = new ub();
  function Db() {
    for (var a; a = sb(); ) {
      try {
        a.h.call(a.g);
      } catch (c) {
        yb(c);
      }
      var b = vb;
      b.j(a);
      100 > b.h && (b.h++, a.next = b.g, b.g = a);
    }
    Cb = false;
  }
  function Eb(a, b) {
    C.call(this);
    this.h = a || 1;
    this.g = b || l;
    this.j = q(this.kb, this);
    this.l = Date.now();
  }
  t(Eb, C);
  k = Eb.prototype;
  k.da = false;
  k.S = null;
  k.kb = function() {
    if (this.da) {
      var a = Date.now() - this.l;
      0 < a && a < 0.8 * this.h ? this.S = this.g.setTimeout(this.j, this.h - a) : (this.S && (this.g.clearTimeout(this.S), this.S = null), D(this, "tick"), this.da && (Fb(this), this.start()));
    }
  };
  k.start = function() {
    this.da = true;
    this.S || (this.S = this.g.setTimeout(this.j, this.h), this.l = Date.now());
  };
  function Fb(a) {
    a.da = false;
    a.S && (a.g.clearTimeout(a.S), a.S = null);
  }
  k.M = function() {
    Eb.Z.M.call(this);
    Fb(this);
    delete this.g;
  };
  function Gb(a, b, c) {
    if (typeof a === "function")
      c && (a = q(a, c));
    else if (a && typeof a.handleEvent == "function")
      a = q(a.handleEvent, a);
    else
      throw Error("Invalid listener argument");
    return 2147483647 < Number(b) ? -1 : l.setTimeout(a, b || 0);
  }
  function Hb(a) {
    a.g = Gb(() => {
      a.g = null;
      a.i && (a.i = false, Hb(a));
    }, a.j);
    const b = a.h;
    a.h = null;
    a.m.apply(null, b);
  }
  var Ib = class extends v {
    constructor(a, b) {
      super();
      this.m = a;
      this.j = b;
      this.h = null;
      this.i = false;
      this.g = null;
    }
    l(a) {
      this.h = arguments;
      this.g ? this.i = true : Hb(this);
    }
    M() {
      super.M();
      this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
    }
  };
  function E(a) {
    v.call(this);
    this.h = a;
    this.g = {};
  }
  t(E, v);
  var Jb = [];
  function Kb(a, b, c, d) {
    Array.isArray(c) || (c && (Jb[0] = c.toString()), c = Jb);
    for (var e = 0; e < c.length; e++) {
      var f = fb(b, c[e], d || a.handleEvent, false, a.h || a);
      if (!f)
        break;
      a.g[f.key] = f;
    }
  }
  function Lb(a) {
    xa(a.g, function(b, c) {
      this.g.hasOwnProperty(c) && ob(b);
    }, a);
    a.g = {};
  }
  E.prototype.M = function() {
    E.Z.M.call(this);
    Lb(this);
  };
  E.prototype.handleEvent = function() {
    throw Error("EventHandler.handleEvent not implemented");
  };
  function Mb() {
    this.g = true;
  }
  Mb.prototype.Aa = function() {
    this.g = false;
  };
  function Nb(a, b, c, d, e, f) {
    a.info(function() {
      if (a.g)
        if (f) {
          var h = "";
          for (var n = f.split("&"), u = 0; u < n.length; u++) {
            var m = n[u].split("=");
            if (1 < m.length) {
              var r = m[0];
              m = m[1];
              var G2 = r.split("_");
              h = 2 <= G2.length && G2[1] == "type" ? h + (r + "=" + m + "&") : h + (r + "=redacted&");
            }
          }
        } else
          h = null;
      else
        h = f;
      return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b + "\n" + c + "\n" + h;
    });
  }
  function Ob(a, b, c, d, e, f, h) {
    a.info(function() {
      return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b + "\n" + c + "\n" + f + " " + h;
    });
  }
  function F(a, b, c, d) {
    a.info(function() {
      return "XMLHTTP TEXT (" + b + "): " + Pb(a, c) + (d ? " " + d : "");
    });
  }
  function Qb(a, b) {
    a.info(function() {
      return "TIMEOUT: " + b;
    });
  }
  Mb.prototype.info = function() {
  };
  function Pb(a, b) {
    if (!a.g)
      return b;
    if (!b)
      return null;
    try {
      var c = JSON.parse(b);
      if (c) {
        for (a = 0; a < c.length; a++)
          if (Array.isArray(c[a])) {
            var d = c[a];
            if (!(2 > d.length)) {
              var e = d[1];
              if (Array.isArray(e) && !(1 > e.length)) {
                var f = e[0];
                if (f != "noop" && f != "stop" && f != "close")
                  for (var h = 1; h < e.length; h++)
                    e[h] = "";
              }
            }
          }
      }
      return rb(c);
    } catch (n) {
      return b;
    }
  }
  var H = {};
  var Rb = null;
  function Sb() {
    return Rb = Rb || new C();
  }
  H.Ma = "serverreachability";
  function Tb(a) {
    z.call(this, H.Ma, a);
  }
  t(Tb, z);
  function I(a) {
    const b = Sb();
    D(b, new Tb(b, a));
  }
  H.STAT_EVENT = "statevent";
  function Ub(a, b) {
    z.call(this, H.STAT_EVENT, a);
    this.stat = b;
  }
  t(Ub, z);
  function J(a) {
    const b = Sb();
    D(b, new Ub(b, a));
  }
  H.Na = "timingevent";
  function Vb(a, b) {
    z.call(this, H.Na, a);
    this.size = b;
  }
  t(Vb, z);
  function K(a, b) {
    if (typeof a !== "function")
      throw Error("Fn must not be null and must be a function");
    return l.setTimeout(function() {
      a();
    }, b);
  }
  var Wb = { NO_ERROR: 0, lb: 1, yb: 2, xb: 3, sb: 4, wb: 5, zb: 6, Ja: 7, TIMEOUT: 8, Cb: 9 };
  var Xb = { qb: "complete", Mb: "success", Ka: "error", Ja: "abort", Eb: "ready", Fb: "readystatechange", TIMEOUT: "timeout", Ab: "incrementaldata", Db: "progress", tb: "downloadprogress", Ub: "uploadprogress" };
  function Yb() {
  }
  Yb.prototype.h = null;
  function Zb(a) {
    return a.h || (a.h = a.i());
  }
  function $b() {
  }
  var L = { OPEN: "a", pb: "b", Ka: "c", Bb: "d" };
  function ac() {
    z.call(this, "d");
  }
  t(ac, z);
  function bc() {
    z.call(this, "c");
  }
  t(bc, z);
  var cc;
  function dc() {
  }
  t(dc, Yb);
  dc.prototype.g = function() {
    return new XMLHttpRequest();
  };
  dc.prototype.i = function() {
    return {};
  };
  cc = new dc();
  function M(a, b, c, d) {
    this.l = a;
    this.j = b;
    this.m = c;
    this.X = d || 1;
    this.V = new E(this);
    this.P = ec;
    a = Ja ? 125 : void 0;
    this.W = new Eb(a);
    this.H = null;
    this.i = false;
    this.s = this.A = this.v = this.K = this.F = this.Y = this.B = null;
    this.D = [];
    this.g = null;
    this.C = 0;
    this.o = this.u = null;
    this.N = -1;
    this.I = false;
    this.O = 0;
    this.L = null;
    this.aa = this.J = this.$ = this.U = false;
    this.h = new fc();
  }
  function fc() {
    this.i = null;
    this.g = "";
    this.h = false;
  }
  var ec = 45e3;
  var gc = {};
  var hc = {};
  k = M.prototype;
  k.setTimeout = function(a) {
    this.P = a;
  };
  function ic(a, b, c) {
    a.K = 1;
    a.v = jc(N(b));
    a.s = c;
    a.U = true;
    kc(a, null);
  }
  function kc(a, b) {
    a.F = Date.now();
    lc(a);
    a.A = N(a.v);
    var c = a.A, d = a.X;
    Array.isArray(d) || (d = [String(d)]);
    mc(c.h, "t", d);
    a.C = 0;
    c = a.l.H;
    a.h = new fc();
    a.g = nc(a.l, c ? b : null, !a.s);
    0 < a.O && (a.L = new Ib(q(a.Ia, a, a.g), a.O));
    Kb(a.V, a.g, "readystatechange", a.gb);
    b = a.H ? ya(a.H) : {};
    a.s ? (a.u || (a.u = "POST"), b["Content-Type"] = "application/x-www-form-urlencoded", a.g.ea(a.A, a.u, a.s, b)) : (a.u = "GET", a.g.ea(a.A, a.u, null, b));
    I(1);
    Nb(a.j, a.u, a.A, a.m, a.X, a.s);
  }
  k.gb = function(a) {
    a = a.target;
    const b = this.L;
    b && O(a) == 3 ? b.l() : this.Ia(a);
  };
  k.Ia = function(a) {
    try {
      if (a == this.g)
        a: {
          const r = O(this.g);
          var b = this.g.Da();
          const G2 = this.g.ba();
          if (!(3 > r) && (r != 3 || Ja || this.g && (this.h.h || this.g.ga() || oc(this.g)))) {
            this.I || r != 4 || b == 7 || (b == 8 || 0 >= G2 ? I(3) : I(2));
            pc(this);
            var c = this.g.ba();
            this.N = c;
            b:
              if (qc(this)) {
                var d = oc(this.g);
                a = "";
                var e = d.length, f = O(this.g) == 4;
                if (!this.h.i) {
                  if (typeof TextDecoder === "undefined") {
                    P(this);
                    rc(this);
                    var h = "";
                    break b;
                  }
                  this.h.i = new l.TextDecoder();
                }
                for (b = 0; b < e; b++)
                  this.h.h = true, a += this.h.i.decode(d[b], { stream: f && b == e - 1 });
                d.splice(0, e);
                this.h.g += a;
                this.C = 0;
                h = this.h.g;
              } else
                h = this.g.ga();
            this.i = c == 200;
            Ob(this.j, this.u, this.A, this.m, this.X, r, c);
            if (this.i) {
              if (this.$ && !this.J) {
                b: {
                  if (this.g) {
                    var n, u = this.g;
                    if ((n = u.g ? u.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !sa(n)) {
                      var m = n;
                      break b;
                    }
                  }
                  m = null;
                }
                if (c = m)
                  F(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.J = true, sc(this, c);
                else {
                  this.i = false;
                  this.o = 3;
                  J(12);
                  P(this);
                  rc(this);
                  break a;
                }
              }
              this.U ? (tc(this, r, h), Ja && this.i && r == 3 && (Kb(this.V, this.W, "tick", this.fb), this.W.start())) : (F(this.j, this.m, h, null), sc(this, h));
              r == 4 && P(this);
              this.i && !this.I && (r == 4 ? uc(this.l, this) : (this.i = false, lc(this)));
            } else
              c == 400 && 0 < h.indexOf("Unknown SID") ? (this.o = 3, J(12)) : (this.o = 0, J(13)), P(this), rc(this);
          }
        }
    } catch (r) {
    } finally {
    }
  };
  function qc(a) {
    return a.g ? a.u == "GET" && a.K != 2 && a.l.Ba : false;
  }
  function tc(a, b, c) {
    let d = true, e;
    for (; !a.I && a.C < c.length; )
      if (e = vc(a, c), e == hc) {
        b == 4 && (a.o = 4, J(14), d = false);
        F(a.j, a.m, null, "[Incomplete Response]");
        break;
      } else if (e == gc) {
        a.o = 4;
        J(15);
        F(a.j, a.m, c, "[Invalid Chunk]");
        d = false;
        break;
      } else
        F(a.j, a.m, e, null), sc(a, e);
    qc(a) && e != hc && e != gc && (a.h.g = "", a.C = 0);
    b != 4 || c.length != 0 || a.h.h || (a.o = 1, J(16), d = false);
    a.i = a.i && d;
    d ? 0 < c.length && !a.aa && (a.aa = true, b = a.l, b.g == a && b.$ && !b.L && (b.h.info("Great, no buffering proxy detected. Bytes received: " + c.length), wc(b), b.L = true, J(11))) : (F(a.j, a.m, c, "[Invalid Chunked Response]"), P(a), rc(a));
  }
  k.fb = function() {
    if (this.g) {
      var a = O(this.g), b = this.g.ga();
      this.C < b.length && (pc(this), tc(this, a, b), this.i && a != 4 && lc(this));
    }
  };
  function vc(a, b) {
    var c = a.C, d = b.indexOf("\n", c);
    if (d == -1)
      return hc;
    c = Number(b.substring(c, d));
    if (isNaN(c))
      return gc;
    d += 1;
    if (d + c > b.length)
      return hc;
    b = b.substr(d, c);
    a.C = d + c;
    return b;
  }
  k.cancel = function() {
    this.I = true;
    P(this);
  };
  function lc(a) {
    a.Y = Date.now() + a.P;
    xc(a, a.P);
  }
  function xc(a, b) {
    if (a.B != null)
      throw Error("WatchDog timer not null");
    a.B = K(q(a.eb, a), b);
  }
  function pc(a) {
    a.B && (l.clearTimeout(a.B), a.B = null);
  }
  k.eb = function() {
    this.B = null;
    const a = Date.now();
    0 <= a - this.Y ? (Qb(this.j, this.A), this.K != 2 && (I(3), J(17)), P(this), this.o = 2, rc(this)) : xc(this, this.Y - a);
  };
  function rc(a) {
    a.l.G == 0 || a.I || uc(a.l, a);
  }
  function P(a) {
    pc(a);
    var b = a.L;
    b && typeof b.na == "function" && b.na();
    a.L = null;
    Fb(a.W);
    Lb(a.V);
    a.g && (b = a.g, a.g = null, b.abort(), b.na());
  }
  function sc(a, b) {
    try {
      var c = a.l;
      if (c.G != 0 && (c.g == a || yc(c.i, a))) {
        if (c.I = a.N, !a.J && yc(c.i, a) && c.G == 3) {
          try {
            var d = c.Ca.g.parse(b);
          } catch (m) {
            d = null;
          }
          if (Array.isArray(d) && d.length == 3) {
            var e = d;
            if (e[0] == 0)
              a: {
                if (!c.u) {
                  if (c.g)
                    if (c.g.F + 3e3 < a.F)
                      zc(c), Ac(c);
                    else
                      break a;
                  Bc(c);
                  J(18);
                }
              }
            else
              c.ta = e[1], 0 < c.ta - c.U && 37500 > e[2] && c.N && c.A == 0 && !c.v && (c.v = K(q(c.ab, c), 6e3));
            if (1 >= Cc(c.i) && c.ka) {
              try {
                c.ka();
              } catch (m) {
              }
              c.ka = void 0;
            }
          } else
            Q(c, 11);
        } else if ((a.J || c.g == a) && zc(c), !sa(b))
          for (e = c.Ca.g.parse(b), b = 0; b < e.length; b++) {
            let m = e[b];
            c.U = m[0];
            m = m[1];
            if (c.G == 2)
              if (m[0] == "c") {
                c.J = m[1];
                c.la = m[2];
                const r = m[3];
                r != null && (c.ma = r, c.h.info("VER=" + c.ma));
                const G2 = m[4];
                G2 != null && (c.za = G2, c.h.info("SVER=" + c.za));
                const Da = m[5];
                Da != null && typeof Da === "number" && 0 < Da && (d = 1.5 * Da, c.K = d, c.h.info("backChannelRequestTimeoutMs_=" + d));
                d = c;
                const ca2 = a.g;
                if (ca2) {
                  const Ea = ca2.g ? ca2.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                  if (Ea) {
                    var f = d.i;
                    !f.g && (w(Ea, "spdy") || w(Ea, "quic") || w(Ea, "h2")) && (f.j = f.l, f.g = /* @__PURE__ */ new Set(), f.h && (Dc(f, f.h), f.h = null));
                  }
                  if (d.D) {
                    const xb = ca2.g ? ca2.g.getResponseHeader("X-HTTP-Session-Id") : null;
                    xb && (d.sa = xb, R(d.F, d.D, xb));
                  }
                }
                c.G = 3;
                c.j && c.j.xa();
                c.$ && (c.O = Date.now() - a.F, c.h.info("Handshake RTT: " + c.O + "ms"));
                d = c;
                var h = a;
                d.oa = Ec(d, d.H ? d.la : null, d.W);
                if (h.J) {
                  Fc(d.i, h);
                  var n = h, u = d.K;
                  u && n.setTimeout(u);
                  n.B && (pc(n), lc(n));
                  d.g = h;
                } else
                  Gc(d);
                0 < c.l.length && Hc(c);
              } else
                m[0] != "stop" && m[0] != "close" || Q(c, 7);
            else
              c.G == 3 && (m[0] == "stop" || m[0] == "close" ? m[0] == "stop" ? Q(c, 7) : Ic(c) : m[0] != "noop" && c.j && c.j.wa(m), c.A = 0);
          }
      }
      I(4);
    } catch (m) {
    }
  }
  function Jc(a) {
    if (a.R && typeof a.R == "function")
      return a.R();
    if (typeof a === "string")
      return a.split("");
    if (ba(a)) {
      for (var b = [], c = a.length, d = 0; d < c; d++)
        b.push(a[d]);
      return b;
    }
    b = [];
    c = 0;
    for (d in a)
      b[c++] = a[d];
    return b;
  }
  function Kc(a, b) {
    if (a.forEach && typeof a.forEach == "function")
      a.forEach(b, void 0);
    else if (ba(a) || typeof a === "string")
      na(a, b, void 0);
    else {
      if (a.T && typeof a.T == "function")
        var c = a.T();
      else if (a.R && typeof a.R == "function")
        c = void 0;
      else if (ba(a) || typeof a === "string") {
        c = [];
        for (var d = a.length, e = 0; e < d; e++)
          c.push(e);
      } else
        for (e in c = [], d = 0, a)
          c[d++] = e;
      d = Jc(a);
      e = d.length;
      for (var f = 0; f < e; f++)
        b.call(void 0, d[f], c && c[f], a);
    }
  }
  function S(a, b) {
    this.h = {};
    this.g = [];
    this.i = 0;
    var c = arguments.length;
    if (1 < c) {
      if (c % 2)
        throw Error("Uneven number of arguments");
      for (var d = 0; d < c; d += 2)
        this.set(arguments[d], arguments[d + 1]);
    } else if (a)
      if (a instanceof S)
        for (c = a.T(), d = 0; d < c.length; d++)
          this.set(c[d], a.get(c[d]));
      else
        for (d in a)
          this.set(d, a[d]);
  }
  k = S.prototype;
  k.R = function() {
    Lc(this);
    for (var a = [], b = 0; b < this.g.length; b++)
      a.push(this.h[this.g[b]]);
    return a;
  };
  k.T = function() {
    Lc(this);
    return this.g.concat();
  };
  function Lc(a) {
    if (a.i != a.g.length) {
      for (var b = 0, c = 0; b < a.g.length; ) {
        var d = a.g[b];
        T(a.h, d) && (a.g[c++] = d);
        b++;
      }
      a.g.length = c;
    }
    if (a.i != a.g.length) {
      var e = {};
      for (c = b = 0; b < a.g.length; )
        d = a.g[b], T(e, d) || (a.g[c++] = d, e[d] = 1), b++;
      a.g.length = c;
    }
  }
  k.get = function(a, b) {
    return T(this.h, a) ? this.h[a] : b;
  };
  k.set = function(a, b) {
    T(this.h, a) || (this.i++, this.g.push(a));
    this.h[a] = b;
  };
  k.forEach = function(a, b) {
    for (var c = this.T(), d = 0; d < c.length; d++) {
      var e = c[d], f = this.get(e);
      a.call(b, f, e, this);
    }
  };
  function T(a, b) {
    return Object.prototype.hasOwnProperty.call(a, b);
  }
  var Mc = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^\\/?#]*)@)?([^\\/?#]*?)(?::([0-9]+))?(?=[\\/?#]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;
  function Nc(a, b) {
    if (a) {
      a = a.split("&");
      for (var c = 0; c < a.length; c++) {
        var d = a[c].indexOf("="), e = null;
        if (0 <= d) {
          var f = a[c].substring(0, d);
          e = a[c].substring(d + 1);
        } else
          f = a[c];
        b(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
      }
    }
  }
  function U(a, b) {
    this.i = this.s = this.j = "";
    this.m = null;
    this.o = this.l = "";
    this.g = false;
    if (a instanceof U) {
      this.g = b !== void 0 ? b : a.g;
      Oc(this, a.j);
      this.s = a.s;
      Pc(this, a.i);
      Qc(this, a.m);
      this.l = a.l;
      b = a.h;
      var c = new Rc();
      c.i = b.i;
      b.g && (c.g = new S(b.g), c.h = b.h);
      Sc(this, c);
      this.o = a.o;
    } else
      a && (c = String(a).match(Mc)) ? (this.g = !!b, Oc(this, c[1] || "", true), this.s = Tc(c[2] || ""), Pc(this, c[3] || "", true), Qc(this, c[4]), this.l = Tc(c[5] || "", true), Sc(this, c[6] || "", true), this.o = Tc(c[7] || "")) : (this.g = !!b, this.h = new Rc(null, this.g));
  }
  U.prototype.toString = function() {
    var a = [], b = this.j;
    b && a.push(Uc(b, Vc, true), ":");
    var c = this.i;
    if (c || b == "file")
      a.push("//"), (b = this.s) && a.push(Uc(b, Vc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, c != null && a.push(":", String(c));
    if (c = this.l)
      this.i && c.charAt(0) != "/" && a.push("/"), a.push(Uc(c, c.charAt(0) == "/" ? Wc : Xc, true));
    (c = this.h.toString()) && a.push("?", c);
    (c = this.o) && a.push("#", Uc(c, Yc));
    return a.join("");
  };
  function N(a) {
    return new U(a);
  }
  function Oc(a, b, c) {
    a.j = c ? Tc(b, true) : b;
    a.j && (a.j = a.j.replace(/:$/, ""));
  }
  function Pc(a, b, c) {
    a.i = c ? Tc(b, true) : b;
  }
  function Qc(a, b) {
    if (b) {
      b = Number(b);
      if (isNaN(b) || 0 > b)
        throw Error("Bad port number " + b);
      a.m = b;
    } else
      a.m = null;
  }
  function Sc(a, b, c) {
    b instanceof Rc ? (a.h = b, Zc(a.h, a.g)) : (c || (b = Uc(b, $c)), a.h = new Rc(b, a.g));
  }
  function R(a, b, c) {
    a.h.set(b, c);
  }
  function jc(a) {
    R(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
    return a;
  }
  function ad(a) {
    return a instanceof U ? N(a) : new U(a, void 0);
  }
  function bd(a, b, c, d) {
    var e = new U(null, void 0);
    a && Oc(e, a);
    b && Pc(e, b);
    c && Qc(e, c);
    d && (e.l = d);
    return e;
  }
  function Tc(a, b) {
    return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
  }
  function Uc(a, b, c) {
    return typeof a === "string" ? (a = encodeURI(a).replace(b, cd), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
  }
  function cd(a) {
    a = a.charCodeAt(0);
    return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
  }
  var Vc = /[#\/\?@]/g;
  var Xc = /[#\?:]/g;
  var Wc = /[#\?]/g;
  var $c = /[#\?@]/g;
  var Yc = /#/g;
  function Rc(a, b) {
    this.h = this.g = null;
    this.i = a || null;
    this.j = !!b;
  }
  function V(a) {
    a.g || (a.g = new S(), a.h = 0, a.i && Nc(a.i, function(b, c) {
      a.add(decodeURIComponent(b.replace(/\+/g, " ")), c);
    }));
  }
  k = Rc.prototype;
  k.add = function(a, b) {
    V(this);
    this.i = null;
    a = W(this, a);
    var c = this.g.get(a);
    c || this.g.set(a, c = []);
    c.push(b);
    this.h += 1;
    return this;
  };
  function dd(a, b) {
    V(a);
    b = W(a, b);
    T(a.g.h, b) && (a.i = null, a.h -= a.g.get(b).length, a = a.g, T(a.h, b) && (delete a.h[b], a.i--, a.g.length > 2 * a.i && Lc(a)));
  }
  function ed(a, b) {
    V(a);
    b = W(a, b);
    return T(a.g.h, b);
  }
  k.forEach = function(a, b) {
    V(this);
    this.g.forEach(function(c, d) {
      na(c, function(e) {
        a.call(b, e, d, this);
      }, this);
    }, this);
  };
  k.T = function() {
    V(this);
    for (var a = this.g.R(), b = this.g.T(), c = [], d = 0; d < b.length; d++)
      for (var e = a[d], f = 0; f < e.length; f++)
        c.push(b[d]);
    return c;
  };
  k.R = function(a) {
    V(this);
    var b = [];
    if (typeof a === "string")
      ed(this, a) && (b = qa(b, this.g.get(W(this, a))));
    else {
      a = this.g.R();
      for (var c = 0; c < a.length; c++)
        b = qa(b, a[c]);
    }
    return b;
  };
  k.set = function(a, b) {
    V(this);
    this.i = null;
    a = W(this, a);
    ed(this, a) && (this.h -= this.g.get(a).length);
    this.g.set(a, [b]);
    this.h += 1;
    return this;
  };
  k.get = function(a, b) {
    if (!a)
      return b;
    a = this.R(a);
    return 0 < a.length ? String(a[0]) : b;
  };
  function mc(a, b, c) {
    dd(a, b);
    0 < c.length && (a.i = null, a.g.set(W(a, b), ra(c)), a.h += c.length);
  }
  k.toString = function() {
    if (this.i)
      return this.i;
    if (!this.g)
      return "";
    for (var a = [], b = this.g.T(), c = 0; c < b.length; c++) {
      var d = b[c], e = encodeURIComponent(String(d));
      d = this.R(d);
      for (var f = 0; f < d.length; f++) {
        var h = e;
        d[f] !== "" && (h += "=" + encodeURIComponent(String(d[f])));
        a.push(h);
      }
    }
    return this.i = a.join("&");
  };
  function W(a, b) {
    b = String(b);
    a.j && (b = b.toLowerCase());
    return b;
  }
  function Zc(a, b) {
    b && !a.j && (V(a), a.i = null, a.g.forEach(function(c, d) {
      var e = d.toLowerCase();
      d != e && (dd(this, d), mc(this, e, c));
    }, a));
    a.j = b;
  }
  var fd = class {
    constructor(a, b) {
      this.h = a;
      this.g = b;
    }
  };
  function gd(a) {
    this.l = a || hd;
    l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && (a[0].nextHopProtocol == "hq" || a[0].nextHopProtocol == "h2")) : a = !!(l.g && l.g.Ea && l.g.Ea() && l.g.Ea().Zb);
    this.j = a ? this.l : 1;
    this.g = null;
    1 < this.j && (this.g = /* @__PURE__ */ new Set());
    this.h = null;
    this.i = [];
  }
  var hd = 10;
  function id(a) {
    return a.h ? true : a.g ? a.g.size >= a.j : false;
  }
  function Cc(a) {
    return a.h ? 1 : a.g ? a.g.size : 0;
  }
  function yc(a, b) {
    return a.h ? a.h == b : a.g ? a.g.has(b) : false;
  }
  function Dc(a, b) {
    a.g ? a.g.add(b) : a.h = b;
  }
  function Fc(a, b) {
    a.h && a.h == b ? a.h = null : a.g && a.g.has(b) && a.g.delete(b);
  }
  gd.prototype.cancel = function() {
    this.i = jd(this);
    if (this.h)
      this.h.cancel(), this.h = null;
    else if (this.g && this.g.size !== 0) {
      for (const a of this.g.values())
        a.cancel();
      this.g.clear();
    }
  };
  function jd(a) {
    if (a.h != null)
      return a.i.concat(a.h.D);
    if (a.g != null && a.g.size !== 0) {
      let b = a.i;
      for (const c of a.g.values())
        b = b.concat(c.D);
      return b;
    }
    return ra(a.i);
  }
  function kd() {
  }
  kd.prototype.stringify = function(a) {
    return l.JSON.stringify(a, void 0);
  };
  kd.prototype.parse = function(a) {
    return l.JSON.parse(a, void 0);
  };
  function ld() {
    this.g = new kd();
  }
  function md(a, b, c) {
    const d = c || "";
    try {
      Kc(a, function(e, f) {
        let h = e;
        p(e) && (h = rb(e));
        b.push(d + f + "=" + encodeURIComponent(h));
      });
    } catch (e) {
      throw b.push(d + "type=" + encodeURIComponent("_badmap")), e;
    }
  }
  function nd(a, b) {
    const c = new Mb();
    if (l.Image) {
      const d = new Image();
      d.onload = ja(od, c, d, "TestLoadImage: loaded", true, b);
      d.onerror = ja(od, c, d, "TestLoadImage: error", false, b);
      d.onabort = ja(od, c, d, "TestLoadImage: abort", false, b);
      d.ontimeout = ja(od, c, d, "TestLoadImage: timeout", false, b);
      l.setTimeout(function() {
        if (d.ontimeout)
          d.ontimeout();
      }, 1e4);
      d.src = a;
    } else
      b(false);
  }
  function od(a, b, c, d, e) {
    try {
      b.onload = null, b.onerror = null, b.onabort = null, b.ontimeout = null, e(d);
    } catch (f) {
    }
  }
  function pd(a) {
    this.l = a.$b || null;
    this.j = a.ib || false;
  }
  t(pd, Yb);
  pd.prototype.g = function() {
    return new qd(this.l, this.j);
  };
  pd.prototype.i = function(a) {
    return function() {
      return a;
    };
  }({});
  function qd(a, b) {
    C.call(this);
    this.D = a;
    this.u = b;
    this.m = void 0;
    this.readyState = rd;
    this.status = 0;
    this.responseType = this.responseText = this.response = this.statusText = "";
    this.onreadystatechange = null;
    this.v = new Headers();
    this.h = null;
    this.C = "GET";
    this.B = "";
    this.g = false;
    this.A = this.j = this.l = null;
  }
  t(qd, C);
  var rd = 0;
  k = qd.prototype;
  k.open = function(a, b) {
    if (this.readyState != rd)
      throw this.abort(), Error("Error reopening a connection");
    this.C = a;
    this.B = b;
    this.readyState = 1;
    sd(this);
  };
  k.send = function(a) {
    if (this.readyState != 1)
      throw this.abort(), Error("need to call open() first. ");
    this.g = true;
    const b = { headers: this.v, method: this.C, credentials: this.m, cache: void 0 };
    a && (b.body = a);
    (this.D || l).fetch(new Request(this.B, b)).then(this.Va.bind(this), this.ha.bind(this));
  };
  k.abort = function() {
    this.response = this.responseText = "";
    this.v = new Headers();
    this.status = 0;
    this.j && this.j.cancel("Request was aborted.");
    1 <= this.readyState && this.g && this.readyState != 4 && (this.g = false, td(this));
    this.readyState = rd;
  };
  k.Va = function(a) {
    if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, sd(this)), this.g && (this.readyState = 3, sd(this), this.g)))
      if (this.responseType === "arraybuffer")
        a.arrayBuffer().then(this.Ta.bind(this), this.ha.bind(this));
      else if (typeof l.ReadableStream !== "undefined" && "body" in a) {
        this.j = a.body.getReader();
        if (this.u) {
          if (this.responseType)
            throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
          this.response = [];
        } else
          this.response = this.responseText = "", this.A = new TextDecoder();
        ud(this);
      } else
        a.text().then(this.Ua.bind(this), this.ha.bind(this));
  };
  function ud(a) {
    a.j.read().then(a.Sa.bind(a)).catch(a.ha.bind(a));
  }
  k.Sa = function(a) {
    if (this.g) {
      if (this.u && a.value)
        this.response.push(a.value);
      else if (!this.u) {
        var b = a.value ? a.value : new Uint8Array(0);
        if (b = this.A.decode(b, { stream: !a.done }))
          this.response = this.responseText += b;
      }
      a.done ? td(this) : sd(this);
      this.readyState == 3 && ud(this);
    }
  };
  k.Ua = function(a) {
    this.g && (this.response = this.responseText = a, td(this));
  };
  k.Ta = function(a) {
    this.g && (this.response = a, td(this));
  };
  k.ha = function() {
    this.g && td(this);
  };
  function td(a) {
    a.readyState = 4;
    a.l = null;
    a.j = null;
    a.A = null;
    sd(a);
  }
  k.setRequestHeader = function(a, b) {
    this.v.append(a, b);
  };
  k.getResponseHeader = function(a) {
    return this.h ? this.h.get(a.toLowerCase()) || "" : "";
  };
  k.getAllResponseHeaders = function() {
    if (!this.h)
      return "";
    const a = [], b = this.h.entries();
    for (var c = b.next(); !c.done; )
      c = c.value, a.push(c[0] + ": " + c[1]), c = b.next();
    return a.join("\r\n");
  };
  function sd(a) {
    a.onreadystatechange && a.onreadystatechange.call(a);
  }
  Object.defineProperty(qd.prototype, "withCredentials", { get: function() {
    return this.m === "include";
  }, set: function(a) {
    this.m = a ? "include" : "same-origin";
  } });
  var vd = l.JSON.parse;
  function X(a) {
    C.call(this);
    this.headers = new S();
    this.u = a || null;
    this.h = false;
    this.C = this.g = null;
    this.H = "";
    this.m = 0;
    this.j = "";
    this.l = this.F = this.v = this.D = false;
    this.B = 0;
    this.A = null;
    this.J = wd;
    this.K = this.L = false;
  }
  t(X, C);
  var wd = "";
  var xd = /^https?$/i;
  var yd = ["POST", "PUT"];
  k = X.prototype;
  k.ea = function(a, b, c, d) {
    if (this.g)
      throw Error("[goog.net.XhrIo] Object is active with another request=" + this.H + "; newUri=" + a);
    b = b ? b.toUpperCase() : "GET";
    this.H = a;
    this.j = "";
    this.m = 0;
    this.D = false;
    this.h = true;
    this.g = this.u ? this.u.g() : cc.g();
    this.C = this.u ? Zb(this.u) : Zb(cc);
    this.g.onreadystatechange = q(this.Fa, this);
    try {
      this.F = true, this.g.open(b, String(a), true), this.F = false;
    } catch (f) {
      zd(this, f);
      return;
    }
    a = c || "";
    const e = new S(this.headers);
    d && Kc(d, function(f, h) {
      e.set(h, f);
    });
    d = oa(e.T());
    c = l.FormData && a instanceof l.FormData;
    !(0 <= ma(yd, b)) || d || c || e.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
    e.forEach(function(f, h) {
      this.g.setRequestHeader(h, f);
    }, this);
    this.J && (this.g.responseType = this.J);
    "withCredentials" in this.g && this.g.withCredentials !== this.L && (this.g.withCredentials = this.L);
    try {
      Ad(this), 0 < this.B && ((this.K = Bd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.pa, this)) : this.A = Gb(this.pa, this.B, this)), this.v = true, this.g.send(a), this.v = false;
    } catch (f) {
      zd(this, f);
    }
  };
  function Bd(a) {
    return y && Ra() && typeof a.timeout === "number" && a.ontimeout !== void 0;
  }
  function pa(a) {
    return a.toLowerCase() == "content-type";
  }
  k.pa = function() {
    typeof goog != "undefined" && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, D(this, "timeout"), this.abort(8));
  };
  function zd(a, b) {
    a.h = false;
    a.g && (a.l = true, a.g.abort(), a.l = false);
    a.j = b;
    a.m = 5;
    Cd(a);
    Dd(a);
  }
  function Cd(a) {
    a.D || (a.D = true, D(a, "complete"), D(a, "error"));
  }
  k.abort = function(a) {
    this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, D(this, "complete"), D(this, "abort"), Dd(this));
  };
  k.M = function() {
    this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), Dd(this, true));
    X.Z.M.call(this);
  };
  k.Fa = function() {
    this.s || (this.F || this.v || this.l ? Ed(this) : this.cb());
  };
  k.cb = function() {
    Ed(this);
  };
  function Ed(a) {
    if (a.h && typeof goog != "undefined" && (!a.C[1] || O(a) != 4 || a.ba() != 2)) {
      if (a.v && O(a) == 4)
        Gb(a.Fa, 0, a);
      else if (D(a, "readystatechange"), O(a) == 4) {
        a.h = false;
        try {
          const n = a.ba();
          a:
            switch (n) {
              case 200:
              case 201:
              case 202:
              case 204:
              case 206:
              case 304:
              case 1223:
                var b = true;
                break a;
              default:
                b = false;
            }
          var c;
          if (!(c = b)) {
            var d;
            if (d = n === 0) {
              var e = String(a.H).match(Mc)[1] || null;
              if (!e && l.self && l.self.location) {
                var f = l.self.location.protocol;
                e = f.substr(0, f.length - 1);
              }
              d = !xd.test(e ? e.toLowerCase() : "");
            }
            c = d;
          }
          if (c)
            D(a, "complete"), D(a, "success");
          else {
            a.m = 6;
            try {
              var h = 2 < O(a) ? a.g.statusText : "";
            } catch (u) {
              h = "";
            }
            a.j = h + " [" + a.ba() + "]";
            Cd(a);
          }
        } finally {
          Dd(a);
        }
      }
    }
  }
  function Dd(a, b) {
    if (a.g) {
      Ad(a);
      const c = a.g, d = a.C[0] ? aa : null;
      a.g = null;
      a.C = null;
      b || D(a, "ready");
      try {
        c.onreadystatechange = d;
      } catch (e) {
      }
    }
  }
  function Ad(a) {
    a.g && a.K && (a.g.ontimeout = null);
    a.A && (l.clearTimeout(a.A), a.A = null);
  }
  function O(a) {
    return a.g ? a.g.readyState : 0;
  }
  k.ba = function() {
    try {
      return 2 < O(this) ? this.g.status : -1;
    } catch (a) {
      return -1;
    }
  };
  k.ga = function() {
    try {
      return this.g ? this.g.responseText : "";
    } catch (a) {
      return "";
    }
  };
  k.Qa = function(a) {
    if (this.g) {
      var b = this.g.responseText;
      a && b.indexOf(a) == 0 && (b = b.substring(a.length));
      return vd(b);
    }
  };
  function oc(a) {
    try {
      if (!a.g)
        return null;
      if ("response" in a.g)
        return a.g.response;
      switch (a.J) {
        case wd:
        case "text":
          return a.g.responseText;
        case "arraybuffer":
          if ("mozResponseArrayBuffer" in a.g)
            return a.g.mozResponseArrayBuffer;
      }
      return null;
    } catch (b) {
      return null;
    }
  }
  k.Da = function() {
    return this.m;
  };
  k.La = function() {
    return typeof this.j === "string" ? this.j : String(this.j);
  };
  function Fd(a) {
    let b = "";
    xa(a, function(c, d) {
      b += d;
      b += ":";
      b += c;
      b += "\r\n";
    });
    return b;
  }
  function Gd(a, b, c) {
    a: {
      for (d in c) {
        var d = false;
        break a;
      }
      d = true;
    }
    d || (c = Fd(c), typeof a === "string" ? c != null && encodeURIComponent(String(c)) : R(a, b, c));
  }
  function Hd(a, b, c) {
    return c && c.internalChannelParams ? c.internalChannelParams[a] || b : b;
  }
  function Id(a) {
    this.za = 0;
    this.l = [];
    this.h = new Mb();
    this.la = this.oa = this.F = this.W = this.g = this.sa = this.D = this.aa = this.o = this.P = this.s = null;
    this.Za = this.V = 0;
    this.Xa = Hd("failFast", false, a);
    this.N = this.v = this.u = this.m = this.j = null;
    this.X = true;
    this.I = this.ta = this.U = -1;
    this.Y = this.A = this.C = 0;
    this.Pa = Hd("baseRetryDelayMs", 5e3, a);
    this.$a = Hd("retryDelaySeedMs", 1e4, a);
    this.Ya = Hd("forwardChannelMaxRetries", 2, a);
    this.ra = Hd("forwardChannelRequestTimeoutMs", 2e4, a);
    this.qa = a && a.xmlHttpFactory || void 0;
    this.Ba = a && a.Yb || false;
    this.K = void 0;
    this.H = a && a.supportsCrossDomainXhr || false;
    this.J = "";
    this.i = new gd(a && a.concurrentRequestLimit);
    this.Ca = new ld();
    this.ja = a && a.fastHandshake || false;
    this.Ra = a && a.Wb || false;
    a && a.Aa && this.h.Aa();
    a && a.forceLongPolling && (this.X = false);
    this.$ = !this.ja && this.X && a && a.detectBufferingProxy || false;
    this.ka = void 0;
    this.O = 0;
    this.L = false;
    this.B = null;
    this.Wa = !a || a.Xb !== false;
  }
  k = Id.prototype;
  k.ma = 8;
  k.G = 1;
  function Ic(a) {
    Jd(a);
    if (a.G == 3) {
      var b = a.V++, c = N(a.F);
      R(c, "SID", a.J);
      R(c, "RID", b);
      R(c, "TYPE", "terminate");
      Kd(a, c);
      b = new M(a, a.h, b, void 0);
      b.K = 2;
      b.v = jc(N(c));
      c = false;
      l.navigator && l.navigator.sendBeacon && (c = l.navigator.sendBeacon(b.v.toString(), ""));
      !c && l.Image && (new Image().src = b.v, c = true);
      c || (b.g = nc(b.l, null), b.g.ea(b.v));
      b.F = Date.now();
      lc(b);
    }
    Ld(a);
  }
  k.hb = function(a) {
    try {
      this.h.info("Origin Trials invoked: " + a);
    } catch (b) {
    }
  };
  function Ac(a) {
    a.g && (wc(a), a.g.cancel(), a.g = null);
  }
  function Jd(a) {
    Ac(a);
    a.u && (l.clearTimeout(a.u), a.u = null);
    zc(a);
    a.i.cancel();
    a.m && (typeof a.m === "number" && l.clearTimeout(a.m), a.m = null);
  }
  function Md(a, b) {
    a.l.push(new fd(a.Za++, b));
    a.G == 3 && Hc(a);
  }
  function Hc(a) {
    id(a.i) || a.m || (a.m = true, zb(a.Ha, a), a.C = 0);
  }
  function Nd(a, b) {
    if (Cc(a.i) >= a.i.j - (a.m ? 1 : 0))
      return false;
    if (a.m)
      return a.l = b.D.concat(a.l), true;
    if (a.G == 1 || a.G == 2 || a.C >= (a.Xa ? 0 : a.Ya))
      return false;
    a.m = K(q(a.Ha, a, b), Od(a, a.C));
    a.C++;
    return true;
  }
  k.Ha = function(a) {
    if (this.m)
      if (this.m = null, this.G == 1) {
        if (!a) {
          this.V = Math.floor(1e5 * Math.random());
          a = this.V++;
          const e = new M(this, this.h, a, void 0);
          let f = this.s;
          this.P && (f ? (f = ya(f), Aa(f, this.P)) : f = this.P);
          this.o === null && (e.H = f);
          if (this.ja)
            a: {
              var b = 0;
              for (var c = 0; c < this.l.length; c++) {
                b: {
                  var d = this.l[c];
                  if ("__data__" in d.g && (d = d.g.__data__, typeof d === "string")) {
                    d = d.length;
                    break b;
                  }
                  d = void 0;
                }
                if (d === void 0)
                  break;
                b += d;
                if (4096 < b) {
                  b = c;
                  break a;
                }
                if (b === 4096 || c === this.l.length - 1) {
                  b = c + 1;
                  break a;
                }
              }
              b = 1e3;
            }
          else
            b = 1e3;
          b = Pd(this, e, b);
          c = N(this.F);
          R(c, "RID", a);
          R(c, "CVER", 22);
          this.D && R(c, "X-HTTP-Session-Id", this.D);
          Kd(this, c);
          this.o && f && Gd(c, this.o, f);
          Dc(this.i, e);
          this.Ra && R(c, "TYPE", "init");
          this.ja ? (R(c, "$req", b), R(c, "SID", "null"), e.$ = true, ic(e, c, null)) : ic(e, c, b);
          this.G = 2;
        }
      } else
        this.G == 3 && (a ? Qd(this, a) : this.l.length == 0 || id(this.i) || Qd(this));
  };
  function Qd(a, b) {
    var c;
    b ? c = b.m : c = a.V++;
    const d = N(a.F);
    R(d, "SID", a.J);
    R(d, "RID", c);
    R(d, "AID", a.U);
    Kd(a, d);
    a.o && a.s && Gd(d, a.o, a.s);
    c = new M(a, a.h, c, a.C + 1);
    a.o === null && (c.H = a.s);
    b && (a.l = b.D.concat(a.l));
    b = Pd(a, c, 1e3);
    c.setTimeout(Math.round(0.5 * a.ra) + Math.round(0.5 * a.ra * Math.random()));
    Dc(a.i, c);
    ic(c, d, b);
  }
  function Kd(a, b) {
    a.j && Kc({}, function(c, d) {
      R(b, d, c);
    });
  }
  function Pd(a, b, c) {
    c = Math.min(a.l.length, c);
    var d = a.j ? q(a.j.Oa, a.j, a) : null;
    a: {
      var e = a.l;
      let f = -1;
      for (; ; ) {
        const h = ["count=" + c];
        f == -1 ? 0 < c ? (f = e[0].h, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
        let n = true;
        for (let u = 0; u < c; u++) {
          let m = e[u].h;
          const r = e[u].g;
          m -= f;
          if (0 > m)
            f = Math.max(0, e[u].h - 100), n = false;
          else
            try {
              md(r, h, "req" + m + "_");
            } catch (G2) {
              d && d(r);
            }
        }
        if (n) {
          d = h.join("&");
          break a;
        }
      }
    }
    a = a.l.splice(0, c);
    b.D = a;
    return d;
  }
  function Gc(a) {
    a.g || a.u || (a.Y = 1, zb(a.Ga, a), a.A = 0);
  }
  function Bc(a) {
    if (a.g || a.u || 3 <= a.A)
      return false;
    a.Y++;
    a.u = K(q(a.Ga, a), Od(a, a.A));
    a.A++;
    return true;
  }
  k.Ga = function() {
    this.u = null;
    Rd(this);
    if (this.$ && !(this.L || this.g == null || 0 >= this.O)) {
      var a = 2 * this.O;
      this.h.info("BP detection timer enabled: " + a);
      this.B = K(q(this.bb, this), a);
    }
  };
  k.bb = function() {
    this.B && (this.B = null, this.h.info("BP detection timeout reached."), this.h.info("Buffering proxy detected and switch to long-polling!"), this.N = false, this.L = true, J(10), Ac(this), Rd(this));
  };
  function wc(a) {
    a.B != null && (l.clearTimeout(a.B), a.B = null);
  }
  function Rd(a) {
    a.g = new M(a, a.h, "rpc", a.Y);
    a.o === null && (a.g.H = a.s);
    a.g.O = 0;
    var b = N(a.oa);
    R(b, "RID", "rpc");
    R(b, "SID", a.J);
    R(b, "CI", a.N ? "0" : "1");
    R(b, "AID", a.U);
    Kd(a, b);
    R(b, "TYPE", "xmlhttp");
    a.o && a.s && Gd(b, a.o, a.s);
    a.K && a.g.setTimeout(a.K);
    var c = a.g;
    a = a.la;
    c.K = 1;
    c.v = jc(N(b));
    c.s = null;
    c.U = true;
    kc(c, a);
  }
  k.ab = function() {
    this.v != null && (this.v = null, Ac(this), Bc(this), J(19));
  };
  function zc(a) {
    a.v != null && (l.clearTimeout(a.v), a.v = null);
  }
  function uc(a, b) {
    var c = null;
    if (a.g == b) {
      zc(a);
      wc(a);
      a.g = null;
      var d = 2;
    } else if (yc(a.i, b))
      c = b.D, Fc(a.i, b), d = 1;
    else
      return;
    a.I = b.N;
    if (a.G != 0) {
      if (b.i)
        if (d == 1) {
          c = b.s ? b.s.length : 0;
          b = Date.now() - b.F;
          var e = a.C;
          d = Sb();
          D(d, new Vb(d, c, b, e));
          Hc(a);
        } else
          Gc(a);
      else if (e = b.o, e == 3 || e == 0 && 0 < a.I || !(d == 1 && Nd(a, b) || d == 2 && Bc(a)))
        switch (c && 0 < c.length && (b = a.i, b.i = b.i.concat(c)), e) {
          case 1:
            Q(a, 5);
            break;
          case 4:
            Q(a, 10);
            break;
          case 3:
            Q(a, 6);
            break;
          default:
            Q(a, 2);
        }
    }
  }
  function Od(a, b) {
    let c = a.Pa + Math.floor(Math.random() * a.$a);
    a.j || (c *= 2);
    return c * b;
  }
  function Q(a, b) {
    a.h.info("Error code " + b);
    if (b == 2) {
      var c = null;
      a.j && (c = null);
      var d = q(a.jb, a);
      c || (c = new U("//www.google.com/images/cleardot.gif"), l.location && l.location.protocol == "http" || Oc(c, "https"), jc(c));
      nd(c.toString(), d);
    } else
      J(2);
    a.G = 0;
    a.j && a.j.va(b);
    Ld(a);
    Jd(a);
  }
  k.jb = function(a) {
    a ? (this.h.info("Successfully pinged google.com"), J(2)) : (this.h.info("Failed to ping google.com"), J(1));
  };
  function Ld(a) {
    a.G = 0;
    a.I = -1;
    if (a.j) {
      if (jd(a.i).length != 0 || a.l.length != 0)
        a.i.i.length = 0, ra(a.l), a.l.length = 0;
      a.j.ua();
    }
  }
  function Ec(a, b, c) {
    let d = ad(c);
    if (d.i != "")
      b && Pc(d, b + "." + d.i), Qc(d, d.m);
    else {
      const e = l.location;
      d = bd(e.protocol, b ? b + "." + e.hostname : e.hostname, +e.port, c);
    }
    a.aa && xa(a.aa, function(e, f) {
      R(d, f, e);
    });
    b = a.D;
    c = a.sa;
    b && c && R(d, b, c);
    R(d, "VER", a.ma);
    Kd(a, d);
    return d;
  }
  function nc(a, b, c) {
    if (b && !a.H)
      throw Error("Can't create secondary domain capable XhrIo object.");
    b = c && a.Ba && !a.qa ? new X(new pd({ ib: true })) : new X(a.qa);
    b.L = a.H;
    return b;
  }
  function Sd() {
  }
  k = Sd.prototype;
  k.xa = function() {
  };
  k.wa = function() {
  };
  k.va = function() {
  };
  k.ua = function() {
  };
  k.Oa = function() {
  };
  function Td() {
    if (y && !(10 <= Number(Ua)))
      throw Error("Environmental error: no available transport.");
  }
  Td.prototype.g = function(a, b) {
    return new Y(a, b);
  };
  function Y(a, b) {
    C.call(this);
    this.g = new Id(b);
    this.l = a;
    this.h = b && b.messageUrlParams || null;
    a = b && b.messageHeaders || null;
    b && b.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
    this.g.s = a;
    a = b && b.initMessageHeaders || null;
    b && b.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b.messageContentType : a = { "X-WebChannel-Content-Type": b.messageContentType });
    b && b.ya && (a ? a["X-WebChannel-Client-Profile"] = b.ya : a = { "X-WebChannel-Client-Profile": b.ya });
    this.g.P = a;
    (a = b && b.httpHeadersOverwriteParam) && !sa(a) && (this.g.o = a);
    this.A = b && b.supportsCrossDomainXhr || false;
    this.v = b && b.sendRawJson || false;
    (b = b && b.httpSessionIdParam) && !sa(b) && (this.g.D = b, a = this.h, a !== null && b in a && (a = this.h, b in a && delete a[b]));
    this.j = new Z(this);
  }
  t(Y, C);
  Y.prototype.m = function() {
    this.g.j = this.j;
    this.A && (this.g.H = true);
    var a = this.g, b = this.l, c = this.h || void 0;
    a.Wa && (a.h.info("Origin Trials enabled."), zb(q(a.hb, a, b)));
    J(0);
    a.W = b;
    a.aa = c || {};
    a.N = a.X;
    a.F = Ec(a, null, a.W);
    Hc(a);
  };
  Y.prototype.close = function() {
    Ic(this.g);
  };
  Y.prototype.u = function(a) {
    if (typeof a === "string") {
      var b = {};
      b.__data__ = a;
      Md(this.g, b);
    } else
      this.v ? (b = {}, b.__data__ = rb(a), Md(this.g, b)) : Md(this.g, a);
  };
  Y.prototype.M = function() {
    this.g.j = null;
    delete this.j;
    Ic(this.g);
    delete this.g;
    Y.Z.M.call(this);
  };
  function Ud(a) {
    ac.call(this);
    var b = a.__sm__;
    if (b) {
      a: {
        for (const c in b) {
          a = c;
          break a;
        }
        a = void 0;
      }
      if (this.i = a)
        a = this.i, b = b !== null && a in b ? b[a] : void 0;
      this.data = b;
    } else
      this.data = a;
  }
  t(Ud, ac);
  function Vd() {
    bc.call(this);
    this.status = 1;
  }
  t(Vd, bc);
  function Z(a) {
    this.g = a;
  }
  t(Z, Sd);
  Z.prototype.xa = function() {
    D(this.g, "a");
  };
  Z.prototype.wa = function(a) {
    D(this.g, new Ud(a));
  };
  Z.prototype.va = function(a) {
    D(this.g, new Vd(a));
  };
  Z.prototype.ua = function() {
    D(this.g, "b");
  };
  Td.prototype.createWebChannel = Td.prototype.g;
  Y.prototype.send = Y.prototype.u;
  Y.prototype.open = Y.prototype.m;
  Y.prototype.close = Y.prototype.close;
  Wb.NO_ERROR = 0;
  Wb.TIMEOUT = 8;
  Wb.HTTP_ERROR = 6;
  Xb.COMPLETE = "complete";
  $b.EventType = L;
  L.OPEN = "a";
  L.CLOSE = "b";
  L.ERROR = "c";
  L.MESSAGE = "d";
  C.prototype.listen = C.prototype.N;
  X.prototype.listenOnce = X.prototype.O;
  X.prototype.getLastError = X.prototype.La;
  X.prototype.getLastErrorCode = X.prototype.Da;
  X.prototype.getStatus = X.prototype.ba;
  X.prototype.getResponseJson = X.prototype.Qa;
  X.prototype.getResponseText = X.prototype.ga;
  X.prototype.send = X.prototype.ea;
  var createWebChannelTransport = esm.createWebChannelTransport = function() {
    return new Td();
  };
  var getStatEventTarget = esm.getStatEventTarget = function() {
    return Sb();
  };
  var ErrorCode = esm.ErrorCode = Wb;
  var EventType = esm.EventType = Xb;
  var Event = esm.Event = H;
  var Stat = esm.Stat = { rb: 0, ub: 1, vb: 2, Ob: 3, Tb: 4, Qb: 5, Rb: 6, Pb: 7, Nb: 8, Sb: 9, PROXY: 10, NOPROXY: 11, Lb: 12, Hb: 13, Ib: 14, Gb: 15, Jb: 16, Kb: 17, nb: 18, mb: 19, ob: 20 };
  var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = pd;
  var WebChannel = esm.WebChannel = $b;
  var XhrIo = esm.XhrIo = X;

  // node_modules/.pnpm/@firebase+firestore@3.4.9_@firebase+app@0.7.25/node_modules/@firebase/firestore/dist/index.esm2017.js
  var D2 = "@firebase/firestore";
  var C2 = class {
    constructor(t2) {
      this.uid = t2;
    }
    isAuthenticated() {
      return this.uid != null;
    }
    toKey() {
      return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
    }
    isEqual(t2) {
      return t2.uid === this.uid;
    }
  };
  C2.UNAUTHENTICATED = new C2(null), C2.GOOGLE_CREDENTIALS = new C2("google-credentials-uid"), C2.FIRST_PARTY = new C2("first-party-uid"), C2.MOCK_USER = new C2("mock-user");
  var x2 = "9.8.0";
  var N2 = new Logger("@firebase/firestore");
  function k2() {
    return N2.logLevel;
  }
  function O2(t2, ...e) {
    if (N2.logLevel <= LogLevel.DEBUG) {
      const n = e.map(B2);
      N2.debug(`Firestore (${x2}): ${t2}`, ...n);
    }
  }
  function F2(t2, ...e) {
    if (N2.logLevel <= LogLevel.ERROR) {
      const n = e.map(B2);
      N2.error(`Firestore (${x2}): ${t2}`, ...n);
    }
  }
  function $(t2, ...e) {
    if (N2.logLevel <= LogLevel.WARN) {
      const n = e.map(B2);
      N2.warn(`Firestore (${x2}): ${t2}`, ...n);
    }
  }
  function B2(t2) {
    if (typeof t2 == "string")
      return t2;
    try {
      return e = t2, JSON.stringify(e);
    } catch (e2) {
      return t2;
    }
    var e;
  }
  function L2(t2 = "Unexpected state") {
    const e = `FIRESTORE (${x2}) INTERNAL ASSERTION FAILED: ` + t2;
    throw F2(e), new Error(e);
  }
  function U2(t2, e) {
    t2 || L2();
  }
  function K2(t2, e) {
    return t2;
  }
  var G = {
    OK: "ok",
    CANCELLED: "cancelled",
    UNKNOWN: "unknown",
    INVALID_ARGUMENT: "invalid-argument",
    DEADLINE_EXCEEDED: "deadline-exceeded",
    NOT_FOUND: "not-found",
    ALREADY_EXISTS: "already-exists",
    PERMISSION_DENIED: "permission-denied",
    UNAUTHENTICATED: "unauthenticated",
    RESOURCE_EXHAUSTED: "resource-exhausted",
    FAILED_PRECONDITION: "failed-precondition",
    ABORTED: "aborted",
    OUT_OF_RANGE: "out-of-range",
    UNIMPLEMENTED: "unimplemented",
    INTERNAL: "internal",
    UNAVAILABLE: "unavailable",
    DATA_LOSS: "data-loss"
  };
  var Q2 = class extends FirebaseError {
    constructor(t2, e) {
      super(t2, e), this.code = t2, this.message = e, this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
    }
  };
  var j = class {
    constructor() {
      this.promise = new Promise((t2, e) => {
        this.resolve = t2, this.reject = e;
      });
    }
  };
  var W2 = class {
    constructor(t2, e) {
      this.user = e, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${t2}`);
    }
  };
  var z2 = class {
    getToken() {
      return Promise.resolve(null);
    }
    invalidateToken() {
    }
    start(t2, e) {
      t2.enqueueRetryable(() => e(C2.UNAUTHENTICATED));
    }
    shutdown() {
    }
  };
  var J2 = class {
    constructor(t2) {
      this.t = t2, this.currentUser = C2.UNAUTHENTICATED, this.i = 0, this.forceRefresh = false, this.auth = null;
    }
    start(t2, e) {
      let n = this.i;
      const s = (t3) => this.i !== n ? (n = this.i, e(t3)) : Promise.resolve();
      let i = new j();
      this.o = () => {
        this.i++, this.currentUser = this.u(), i.resolve(), i = new j(), t2.enqueueRetryable(() => s(this.currentUser));
      };
      const r = () => {
        const e2 = i;
        t2.enqueueRetryable(async () => {
          await e2.promise, await s(this.currentUser);
        });
      }, o = (t3) => {
        O2("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = t3, this.auth.addAuthTokenListener(this.o), r();
      };
      this.t.onInit((t3) => o(t3)), setTimeout(() => {
        if (!this.auth) {
          const t3 = this.t.getImmediate({
            optional: true
          });
          t3 ? o(t3) : (O2("FirebaseAuthCredentialsProvider", "Auth not yet detected"), i.resolve(), i = new j());
        }
      }, 0), r();
    }
    getToken() {
      const t2 = this.i, e = this.forceRefresh;
      return this.forceRefresh = false, this.auth ? this.auth.getToken(e).then((e2) => this.i !== t2 ? (O2("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : e2 ? (U2(typeof e2.accessToken == "string"), new W2(e2.accessToken, this.currentUser)) : null) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.auth && this.auth.removeAuthTokenListener(this.o);
    }
    u() {
      const t2 = this.auth && this.auth.getUid();
      return U2(t2 === null || typeof t2 == "string"), new C2(t2);
    }
  };
  var Y2 = class {
    constructor(t2, e, n) {
      this.type = "FirstParty", this.user = C2.FIRST_PARTY, this.headers = /* @__PURE__ */ new Map(), this.headers.set("X-Goog-AuthUser", e);
      const s = t2.auth.getAuthHeaderValueForFirstParty([]);
      s && this.headers.set("Authorization", s), n && this.headers.set("X-Goog-Iam-Authorization-Token", n);
    }
  };
  var X2 = class {
    constructor(t2, e, n) {
      this.h = t2, this.l = e, this.m = n;
    }
    getToken() {
      return Promise.resolve(new Y2(this.h, this.l, this.m));
    }
    start(t2, e) {
      t2.enqueueRetryable(() => e(C2.FIRST_PARTY));
    }
    shutdown() {
    }
    invalidateToken() {
    }
  };
  var Z2 = class {
    constructor(t2) {
      this.value = t2, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), t2 && t2.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
    }
  };
  var tt = class {
    constructor(t2) {
      this.g = t2, this.forceRefresh = false, this.appCheck = null, this.p = null;
    }
    start(t2, e) {
      const n = (t3) => {
        t3.error != null && O2("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${t3.error.message}`);
        const n2 = t3.token !== this.p;
        return this.p = t3.token, O2("FirebaseAppCheckTokenProvider", `Received ${n2 ? "new" : "existing"} token.`), n2 ? e(t3.token) : Promise.resolve();
      };
      this.o = (e2) => {
        t2.enqueueRetryable(() => n(e2));
      };
      const s = (t3) => {
        O2("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = t3, this.appCheck.addTokenListener(this.o);
      };
      this.g.onInit((t3) => s(t3)), setTimeout(() => {
        if (!this.appCheck) {
          const t3 = this.g.getImmediate({
            optional: true
          });
          t3 ? s(t3) : O2("FirebaseAppCheckTokenProvider", "AppCheck not yet detected");
        }
      }, 0);
    }
    getToken() {
      const t2 = this.forceRefresh;
      return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(t2).then((t3) => t3 ? (U2(typeof t3.token == "string"), this.p = t3.token, new Z2(t3.token)) : null) : Promise.resolve(null);
    }
    invalidateToken() {
      this.forceRefresh = true;
    }
    shutdown() {
      this.appCheck && this.appCheck.removeTokenListener(this.o);
    }
  };
  var nt = class {
    constructor(t2, e) {
      this.previousValue = t2, e && (e.sequenceNumberHandler = (t3) => this.I(t3), this.T = (t3) => e.writeSequenceNumber(t3));
    }
    I(t2) {
      return this.previousValue = Math.max(t2, this.previousValue), this.previousValue;
    }
    next() {
      const t2 = ++this.previousValue;
      return this.T && this.T(t2), t2;
    }
  };
  function st(t2) {
    const e = typeof self != "undefined" && (self.crypto || self.msCrypto), n = new Uint8Array(t2);
    if (e && typeof e.getRandomValues == "function")
      e.getRandomValues(n);
    else
      for (let e2 = 0; e2 < t2; e2++)
        n[e2] = Math.floor(256 * Math.random());
    return n;
  }
  nt.A = -1;
  var it = class {
    static R() {
      const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t2.length) * t2.length;
      let n = "";
      for (; n.length < 20; ) {
        const s = st(40);
        for (let i = 0; i < s.length; ++i)
          n.length < 20 && s[i] < e && (n += t2.charAt(s[i] % t2.length));
      }
      return n;
    }
  };
  function rt(t2, e) {
    return t2 < e ? -1 : t2 > e ? 1 : 0;
  }
  function ot(t2, e, n) {
    return t2.length === e.length && t2.every((t3, s) => n(t3, e[s]));
  }
  var at = class {
    constructor(t2, e) {
      if (this.seconds = t2, this.nanoseconds = e, e < 0)
        throw new Q2(G.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
      if (e >= 1e9)
        throw new Q2(G.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + e);
      if (t2 < -62135596800)
        throw new Q2(G.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t2);
      if (t2 >= 253402300800)
        throw new Q2(G.INVALID_ARGUMENT, "Timestamp seconds out of range: " + t2);
    }
    static now() {
      return at.fromMillis(Date.now());
    }
    static fromDate(t2) {
      return at.fromMillis(t2.getTime());
    }
    static fromMillis(t2) {
      const e = Math.floor(t2 / 1e3), n = Math.floor(1e6 * (t2 - 1e3 * e));
      return new at(e, n);
    }
    toDate() {
      return new Date(this.toMillis());
    }
    toMillis() {
      return 1e3 * this.seconds + this.nanoseconds / 1e6;
    }
    _compareTo(t2) {
      return this.seconds === t2.seconds ? rt(this.nanoseconds, t2.nanoseconds) : rt(this.seconds, t2.seconds);
    }
    isEqual(t2) {
      return t2.seconds === this.seconds && t2.nanoseconds === this.nanoseconds;
    }
    toString() {
      return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
    }
    toJSON() {
      return {
        seconds: this.seconds,
        nanoseconds: this.nanoseconds
      };
    }
    valueOf() {
      const t2 = this.seconds - -62135596800;
      return String(t2).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
    }
  };
  var ct = class {
    constructor(t2) {
      this.timestamp = t2;
    }
    static fromTimestamp(t2) {
      return new ct(t2);
    }
    static min() {
      return new ct(new at(0, 0));
    }
    static max() {
      return new ct(new at(253402300799, 999999999));
    }
    compareTo(t2) {
      return this.timestamp._compareTo(t2.timestamp);
    }
    isEqual(t2) {
      return this.timestamp.isEqual(t2.timestamp);
    }
    toMicroseconds() {
      return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
    }
    toString() {
      return "SnapshotVersion(" + this.timestamp.toString() + ")";
    }
    toTimestamp() {
      return this.timestamp;
    }
  };
  function ht(t2) {
    let e = 0;
    for (const n in t2)
      Object.prototype.hasOwnProperty.call(t2, n) && e++;
    return e;
  }
  function lt(t2, e) {
    for (const n in t2)
      Object.prototype.hasOwnProperty.call(t2, n) && e(n, t2[n]);
  }
  function ft(t2) {
    for (const e in t2)
      if (Object.prototype.hasOwnProperty.call(t2, e))
        return false;
    return true;
  }
  var dt = class {
    constructor(t2, e, n) {
      e === void 0 ? e = 0 : e > t2.length && L2(), n === void 0 ? n = t2.length - e : n > t2.length - e && L2(), this.segments = t2, this.offset = e, this.len = n;
    }
    get length() {
      return this.len;
    }
    isEqual(t2) {
      return dt.comparator(this, t2) === 0;
    }
    child(t2) {
      const e = this.segments.slice(this.offset, this.limit());
      return t2 instanceof dt ? t2.forEach((t3) => {
        e.push(t3);
      }) : e.push(t2), this.construct(e);
    }
    limit() {
      return this.offset + this.length;
    }
    popFirst(t2) {
      return t2 = t2 === void 0 ? 1 : t2, this.construct(this.segments, this.offset + t2, this.length - t2);
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1);
    }
    firstSegment() {
      return this.segments[this.offset];
    }
    lastSegment() {
      return this.get(this.length - 1);
    }
    get(t2) {
      return this.segments[this.offset + t2];
    }
    isEmpty() {
      return this.length === 0;
    }
    isPrefixOf(t2) {
      if (t2.length < this.length)
        return false;
      for (let e = 0; e < this.length; e++)
        if (this.get(e) !== t2.get(e))
          return false;
      return true;
    }
    isImmediateParentOf(t2) {
      if (this.length + 1 !== t2.length)
        return false;
      for (let e = 0; e < this.length; e++)
        if (this.get(e) !== t2.get(e))
          return false;
      return true;
    }
    forEach(t2) {
      for (let e = this.offset, n = this.limit(); e < n; e++)
        t2(this.segments[e]);
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit());
    }
    static comparator(t2, e) {
      const n = Math.min(t2.length, e.length);
      for (let s = 0; s < n; s++) {
        const n2 = t2.get(s), i = e.get(s);
        if (n2 < i)
          return -1;
        if (n2 > i)
          return 1;
      }
      return t2.length < e.length ? -1 : t2.length > e.length ? 1 : 0;
    }
  };
  var _t = class extends dt {
    construct(t2, e, n) {
      return new _t(t2, e, n);
    }
    canonicalString() {
      return this.toArray().join("/");
    }
    toString() {
      return this.canonicalString();
    }
    static fromString(...t2) {
      const e = [];
      for (const n of t2) {
        if (n.indexOf("//") >= 0)
          throw new Q2(G.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
        e.push(...n.split("/").filter((t3) => t3.length > 0));
      }
      return new _t(e);
    }
    static emptyPath() {
      return new _t([]);
    }
  };
  var wt = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
  var mt = class extends dt {
    construct(t2, e, n) {
      return new mt(t2, e, n);
    }
    static isValidIdentifier(t2) {
      return wt.test(t2);
    }
    canonicalString() {
      return this.toArray().map((t2) => (t2 = t2.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), mt.isValidIdentifier(t2) || (t2 = "`" + t2 + "`"), t2)).join(".");
    }
    toString() {
      return this.canonicalString();
    }
    isKeyField() {
      return this.length === 1 && this.get(0) === "__name__";
    }
    static keyField() {
      return new mt(["__name__"]);
    }
    static fromServerFormat(t2) {
      const e = [];
      let n = "", s = 0;
      const i = () => {
        if (n.length === 0)
          throw new Q2(G.INVALID_ARGUMENT, `Invalid field path (${t2}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
        e.push(n), n = "";
      };
      let r = false;
      for (; s < t2.length; ) {
        const e2 = t2[s];
        if (e2 === "\\") {
          if (s + 1 === t2.length)
            throw new Q2(G.INVALID_ARGUMENT, "Path has trailing escape character: " + t2);
          const e3 = t2[s + 1];
          if (e3 !== "\\" && e3 !== "." && e3 !== "`")
            throw new Q2(G.INVALID_ARGUMENT, "Path has invalid escape sequence: " + t2);
          n += e3, s += 2;
        } else
          e2 === "`" ? (r = !r, s++) : e2 !== "." || r ? (n += e2, s++) : (i(), s++);
      }
      if (i(), r)
        throw new Q2(G.INVALID_ARGUMENT, "Unterminated ` in path: " + t2);
      return new mt(e);
    }
    static emptyPath() {
      return new mt([]);
    }
  };
  var pt = class {
    constructor(t2) {
      this.binaryString = t2;
    }
    static fromBase64String(t2) {
      const e = atob(t2);
      return new pt(e);
    }
    static fromUint8Array(t2) {
      const e = function(t3) {
        let e2 = "";
        for (let n = 0; n < t3.length; ++n)
          e2 += String.fromCharCode(t3[n]);
        return e2;
      }(t2);
      return new pt(e);
    }
    [Symbol.iterator]() {
      let t2 = 0;
      return {
        next: () => t2 < this.binaryString.length ? {
          value: this.binaryString.charCodeAt(t2++),
          done: false
        } : {
          value: void 0,
          done: true
        }
      };
    }
    toBase64() {
      return t2 = this.binaryString, btoa(t2);
      var t2;
    }
    toUint8Array() {
      return function(t2) {
        const e = new Uint8Array(t2.length);
        for (let n = 0; n < t2.length; n++)
          e[n] = t2.charCodeAt(n);
        return e;
      }(this.binaryString);
    }
    approximateByteSize() {
      return 2 * this.binaryString.length;
    }
    compareTo(t2) {
      return rt(this.binaryString, t2.binaryString);
    }
    isEqual(t2) {
      return this.binaryString === t2.binaryString;
    }
  };
  pt.EMPTY_BYTE_STRING = new pt("");
  var It = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
  function Tt(t2) {
    if (U2(!!t2), typeof t2 == "string") {
      let e = 0;
      const n = It.exec(t2);
      if (U2(!!n), n[1]) {
        let t3 = n[1];
        t3 = (t3 + "000000000").substr(0, 9), e = Number(t3);
      }
      const s = new Date(t2);
      return {
        seconds: Math.floor(s.getTime() / 1e3),
        nanos: e
      };
    }
    return {
      seconds: Et(t2.seconds),
      nanos: Et(t2.nanos)
    };
  }
  function Et(t2) {
    return typeof t2 == "number" ? t2 : typeof t2 == "string" ? Number(t2) : 0;
  }
  function At(t2) {
    return typeof t2 == "string" ? pt.fromBase64String(t2) : pt.fromUint8Array(t2);
  }
  function Rt(t2) {
    var e, n;
    return ((n = (((e = t2 == null ? void 0 : t2.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}).__type__) === null || n === void 0 ? void 0 : n.stringValue) === "server_timestamp";
  }
  function bt(t2) {
    const e = t2.mapValue.fields.__previous_value__;
    return Rt(e) ? bt(e) : e;
  }
  function Pt(t2) {
    const e = Tt(t2.mapValue.fields.__local_write_time__.timestampValue);
    return new at(e.seconds, e.nanos);
  }
  var Vt = class {
    constructor(t2, e, n, s, i, r, o, u) {
      this.databaseId = t2, this.appId = e, this.persistenceKey = n, this.host = s, this.ssl = i, this.forceLongPolling = r, this.autoDetectLongPolling = o, this.useFetchStreams = u;
    }
  };
  var vt = class {
    constructor(t2, e) {
      this.projectId = t2, this.database = e || "(default)";
    }
    static empty() {
      return new vt("", "");
    }
    get isDefaultDatabase() {
      return this.database === "(default)";
    }
    isEqual(t2) {
      return t2 instanceof vt && t2.projectId === this.projectId && t2.database === this.database;
    }
  };
  function St(t2) {
    return t2 == null;
  }
  function Dt(t2) {
    return t2 === 0 && 1 / t2 == -1 / 0;
  }
  var xt = class {
    constructor(t2) {
      this.path = t2;
    }
    static fromPath(t2) {
      return new xt(_t.fromString(t2));
    }
    static fromName(t2) {
      return new xt(_t.fromString(t2).popFirst(5));
    }
    static empty() {
      return new xt(_t.emptyPath());
    }
    get collectionGroup() {
      return this.path.popLast().lastSegment();
    }
    hasCollectionId(t2) {
      return this.path.length >= 2 && this.path.get(this.path.length - 2) === t2;
    }
    getCollectionGroup() {
      return this.path.get(this.path.length - 2);
    }
    getCollectionPath() {
      return this.path.popLast();
    }
    isEqual(t2) {
      return t2 !== null && _t.comparator(this.path, t2.path) === 0;
    }
    toString() {
      return this.path.toString();
    }
    static comparator(t2, e) {
      return _t.comparator(t2.path, e.path);
    }
    static isDocumentKey(t2) {
      return t2.length % 2 == 0;
    }
    static fromSegments(t2) {
      return new xt(new _t(t2.slice()));
    }
  };
  var Nt = {
    mapValue: {
      fields: {
        __type__: {
          stringValue: "__max__"
        }
      }
    }
  };
  function Mt(t2) {
    return "nullValue" in t2 ? 0 : "booleanValue" in t2 ? 1 : "integerValue" in t2 || "doubleValue" in t2 ? 2 : "timestampValue" in t2 ? 3 : "stringValue" in t2 ? 5 : "bytesValue" in t2 ? 6 : "referenceValue" in t2 ? 7 : "geoPointValue" in t2 ? 8 : "arrayValue" in t2 ? 9 : "mapValue" in t2 ? Rt(t2) ? 4 : Ht(t2) ? 9007199254740991 : 10 : L2();
  }
  function Ot(t2, e) {
    if (t2 === e)
      return true;
    const n = Mt(t2);
    if (n !== Mt(e))
      return false;
    switch (n) {
      case 0:
      case 9007199254740991:
        return true;
      case 1:
        return t2.booleanValue === e.booleanValue;
      case 4:
        return Pt(t2).isEqual(Pt(e));
      case 3:
        return function(t3, e2) {
          if (typeof t3.timestampValue == "string" && typeof e2.timestampValue == "string" && t3.timestampValue.length === e2.timestampValue.length)
            return t3.timestampValue === e2.timestampValue;
          const n2 = Tt(t3.timestampValue), s = Tt(e2.timestampValue);
          return n2.seconds === s.seconds && n2.nanos === s.nanos;
        }(t2, e);
      case 5:
        return t2.stringValue === e.stringValue;
      case 6:
        return function(t3, e2) {
          return At(t3.bytesValue).isEqual(At(e2.bytesValue));
        }(t2, e);
      case 7:
        return t2.referenceValue === e.referenceValue;
      case 8:
        return function(t3, e2) {
          return Et(t3.geoPointValue.latitude) === Et(e2.geoPointValue.latitude) && Et(t3.geoPointValue.longitude) === Et(e2.geoPointValue.longitude);
        }(t2, e);
      case 2:
        return function(t3, e2) {
          if ("integerValue" in t3 && "integerValue" in e2)
            return Et(t3.integerValue) === Et(e2.integerValue);
          if ("doubleValue" in t3 && "doubleValue" in e2) {
            const n2 = Et(t3.doubleValue), s = Et(e2.doubleValue);
            return n2 === s ? Dt(n2) === Dt(s) : isNaN(n2) && isNaN(s);
          }
          return false;
        }(t2, e);
      case 9:
        return ot(t2.arrayValue.values || [], e.arrayValue.values || [], Ot);
      case 10:
        return function(t3, e2) {
          const n2 = t3.mapValue.fields || {}, s = e2.mapValue.fields || {};
          if (ht(n2) !== ht(s))
            return false;
          for (const t4 in n2)
            if (n2.hasOwnProperty(t4) && (s[t4] === void 0 || !Ot(n2[t4], s[t4])))
              return false;
          return true;
        }(t2, e);
      default:
        return L2();
    }
  }
  function Ft(t2, e) {
    return (t2.values || []).find((t3) => Ot(t3, e)) !== void 0;
  }
  function $t(t2, e) {
    if (t2 === e)
      return 0;
    const n = Mt(t2), s = Mt(e);
    if (n !== s)
      return rt(n, s);
    switch (n) {
      case 0:
      case 9007199254740991:
        return 0;
      case 1:
        return rt(t2.booleanValue, e.booleanValue);
      case 2:
        return function(t3, e2) {
          const n2 = Et(t3.integerValue || t3.doubleValue), s2 = Et(e2.integerValue || e2.doubleValue);
          return n2 < s2 ? -1 : n2 > s2 ? 1 : n2 === s2 ? 0 : isNaN(n2) ? isNaN(s2) ? 0 : -1 : 1;
        }(t2, e);
      case 3:
        return Bt(t2.timestampValue, e.timestampValue);
      case 4:
        return Bt(Pt(t2), Pt(e));
      case 5:
        return rt(t2.stringValue, e.stringValue);
      case 6:
        return function(t3, e2) {
          const n2 = At(t3), s2 = At(e2);
          return n2.compareTo(s2);
        }(t2.bytesValue, e.bytesValue);
      case 7:
        return function(t3, e2) {
          const n2 = t3.split("/"), s2 = e2.split("/");
          for (let t4 = 0; t4 < n2.length && t4 < s2.length; t4++) {
            const e3 = rt(n2[t4], s2[t4]);
            if (e3 !== 0)
              return e3;
          }
          return rt(n2.length, s2.length);
        }(t2.referenceValue, e.referenceValue);
      case 8:
        return function(t3, e2) {
          const n2 = rt(Et(t3.latitude), Et(e2.latitude));
          if (n2 !== 0)
            return n2;
          return rt(Et(t3.longitude), Et(e2.longitude));
        }(t2.geoPointValue, e.geoPointValue);
      case 9:
        return function(t3, e2) {
          const n2 = t3.values || [], s2 = e2.values || [];
          for (let t4 = 0; t4 < n2.length && t4 < s2.length; ++t4) {
            const e3 = $t(n2[t4], s2[t4]);
            if (e3)
              return e3;
          }
          return rt(n2.length, s2.length);
        }(t2.arrayValue, e.arrayValue);
      case 10:
        return function(t3, e2) {
          if (t3 === Nt.mapValue && e2 === Nt.mapValue)
            return 0;
          if (t3 === Nt.mapValue)
            return 1;
          if (e2 === Nt.mapValue)
            return -1;
          const n2 = t3.fields || {}, s2 = Object.keys(n2), i = e2.fields || {}, r = Object.keys(i);
          s2.sort(), r.sort();
          for (let t4 = 0; t4 < s2.length && t4 < r.length; ++t4) {
            const e3 = rt(s2[t4], r[t4]);
            if (e3 !== 0)
              return e3;
            const o = $t(n2[s2[t4]], i[r[t4]]);
            if (o !== 0)
              return o;
          }
          return rt(s2.length, r.length);
        }(t2.mapValue, e.mapValue);
      default:
        throw L2();
    }
  }
  function Bt(t2, e) {
    if (typeof t2 == "string" && typeof e == "string" && t2.length === e.length)
      return rt(t2, e);
    const n = Tt(t2), s = Tt(e), i = rt(n.seconds, s.seconds);
    return i !== 0 ? i : rt(n.nanos, s.nanos);
  }
  function Lt(t2) {
    return Ut(t2);
  }
  function Ut(t2) {
    return "nullValue" in t2 ? "null" : "booleanValue" in t2 ? "" + t2.booleanValue : "integerValue" in t2 ? "" + t2.integerValue : "doubleValue" in t2 ? "" + t2.doubleValue : "timestampValue" in t2 ? function(t3) {
      const e2 = Tt(t3);
      return `time(${e2.seconds},${e2.nanos})`;
    }(t2.timestampValue) : "stringValue" in t2 ? t2.stringValue : "bytesValue" in t2 ? At(t2.bytesValue).toBase64() : "referenceValue" in t2 ? (n = t2.referenceValue, xt.fromName(n).toString()) : "geoPointValue" in t2 ? `geo(${(e = t2.geoPointValue).latitude},${e.longitude})` : "arrayValue" in t2 ? function(t3) {
      let e2 = "[", n2 = true;
      for (const s of t3.values || [])
        n2 ? n2 = false : e2 += ",", e2 += Ut(s);
      return e2 + "]";
    }(t2.arrayValue) : "mapValue" in t2 ? function(t3) {
      const e2 = Object.keys(t3.fields || {}).sort();
      let n2 = "{", s = true;
      for (const i of e2)
        s ? s = false : n2 += ",", n2 += `${i}:${Ut(t3.fields[i])}`;
      return n2 + "}";
    }(t2.mapValue) : L2();
    var e, n;
  }
  function Kt(t2) {
    return !!t2 && "integerValue" in t2;
  }
  function Gt(t2) {
    return !!t2 && "arrayValue" in t2;
  }
  function Qt(t2) {
    return !!t2 && "nullValue" in t2;
  }
  function jt(t2) {
    return !!t2 && "doubleValue" in t2 && isNaN(Number(t2.doubleValue));
  }
  function Wt(t2) {
    return !!t2 && "mapValue" in t2;
  }
  function zt(t2) {
    if (t2.geoPointValue)
      return {
        geoPointValue: Object.assign({}, t2.geoPointValue)
      };
    if (t2.timestampValue && typeof t2.timestampValue == "object")
      return {
        timestampValue: Object.assign({}, t2.timestampValue)
      };
    if (t2.mapValue) {
      const e = {
        mapValue: {
          fields: {}
        }
      };
      return lt(t2.mapValue.fields, (t3, n) => e.mapValue.fields[t3] = zt(n)), e;
    }
    if (t2.arrayValue) {
      const e = {
        arrayValue: {
          values: []
        }
      };
      for (let n = 0; n < (t2.arrayValue.values || []).length; ++n)
        e.arrayValue.values[n] = zt(t2.arrayValue.values[n]);
      return e;
    }
    return Object.assign({}, t2);
  }
  function Ht(t2) {
    return (((t2.mapValue || {}).fields || {}).__type__ || {}).stringValue === "__max__";
  }
  var te = class {
    constructor(t2) {
      this.value = t2;
    }
    static empty() {
      return new te({
        mapValue: {}
      });
    }
    field(t2) {
      if (t2.isEmpty())
        return this.value;
      {
        let e = this.value;
        for (let n = 0; n < t2.length - 1; ++n)
          if (e = (e.mapValue.fields || {})[t2.get(n)], !Wt(e))
            return null;
        return e = (e.mapValue.fields || {})[t2.lastSegment()], e || null;
      }
    }
    set(t2, e) {
      this.getFieldsMap(t2.popLast())[t2.lastSegment()] = zt(e);
    }
    setAll(t2) {
      let e = mt.emptyPath(), n = {}, s = [];
      t2.forEach((t3, i2) => {
        if (!e.isImmediateParentOf(i2)) {
          const t4 = this.getFieldsMap(e);
          this.applyChanges(t4, n, s), n = {}, s = [], e = i2.popLast();
        }
        t3 ? n[i2.lastSegment()] = zt(t3) : s.push(i2.lastSegment());
      });
      const i = this.getFieldsMap(e);
      this.applyChanges(i, n, s);
    }
    delete(t2) {
      const e = this.field(t2.popLast());
      Wt(e) && e.mapValue.fields && delete e.mapValue.fields[t2.lastSegment()];
    }
    isEqual(t2) {
      return Ot(this.value, t2.value);
    }
    getFieldsMap(t2) {
      let e = this.value;
      e.mapValue.fields || (e.mapValue = {
        fields: {}
      });
      for (let n = 0; n < t2.length; ++n) {
        let s = e.mapValue.fields[t2.get(n)];
        Wt(s) && s.mapValue.fields || (s = {
          mapValue: {
            fields: {}
          }
        }, e.mapValue.fields[t2.get(n)] = s), e = s;
      }
      return e.mapValue.fields;
    }
    applyChanges(t2, e, n) {
      lt(e, (e2, n2) => t2[e2] = n2);
      for (const e2 of n)
        delete t2[e2];
    }
    clone() {
      return new te(zt(this.value));
    }
  };
  var ne = class {
    constructor(t2, e, n, s, i, r) {
      this.key = t2, this.documentType = e, this.version = n, this.readTime = s, this.data = i, this.documentState = r;
    }
    static newInvalidDocument(t2) {
      return new ne(t2, 0, ct.min(), ct.min(), te.empty(), 0);
    }
    static newFoundDocument(t2, e, n) {
      return new ne(t2, 1, e, ct.min(), n, 0);
    }
    static newNoDocument(t2, e) {
      return new ne(t2, 2, e, ct.min(), te.empty(), 0);
    }
    static newUnknownDocument(t2, e) {
      return new ne(t2, 3, e, ct.min(), te.empty(), 2);
    }
    convertToFoundDocument(t2, e) {
      return this.version = t2, this.documentType = 1, this.data = e, this.documentState = 0, this;
    }
    convertToNoDocument(t2) {
      return this.version = t2, this.documentType = 2, this.data = te.empty(), this.documentState = 0, this;
    }
    convertToUnknownDocument(t2) {
      return this.version = t2, this.documentType = 3, this.data = te.empty(), this.documentState = 2, this;
    }
    setHasCommittedMutations() {
      return this.documentState = 2, this;
    }
    setHasLocalMutations() {
      return this.documentState = 1, this;
    }
    setReadTime(t2) {
      return this.readTime = t2, this;
    }
    get hasLocalMutations() {
      return this.documentState === 1;
    }
    get hasCommittedMutations() {
      return this.documentState === 2;
    }
    get hasPendingWrites() {
      return this.hasLocalMutations || this.hasCommittedMutations;
    }
    isValidDocument() {
      return this.documentType !== 0;
    }
    isFoundDocument() {
      return this.documentType === 1;
    }
    isNoDocument() {
      return this.documentType === 2;
    }
    isUnknownDocument() {
      return this.documentType === 3;
    }
    isEqual(t2) {
      return t2 instanceof ne && this.key.isEqual(t2.key) && this.version.isEqual(t2.version) && this.documentType === t2.documentType && this.documentState === t2.documentState && this.data.isEqual(t2.data);
    }
    mutableCopy() {
      return new ne(this.key, this.documentType, this.version, this.readTime, this.data.clone(), this.documentState);
    }
    toString() {
      return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
    }
  };
  var se = class {
    constructor(t2, e, n, s) {
      this.indexId = t2, this.collectionGroup = e, this.fields = n, this.indexState = s;
    }
  };
  se.UNKNOWN_ID = -1;
  function ae(t2, e) {
    const n = t2.toTimestamp().seconds, s = t2.toTimestamp().nanoseconds + 1, i = ct.fromTimestamp(s === 1e9 ? new at(n + 1, 0) : new at(n, s));
    return new he(i, xt.empty(), e);
  }
  function ce(t2) {
    return new he(t2.readTime, t2.key, -1);
  }
  var he = class {
    constructor(t2, e, n) {
      this.readTime = t2, this.documentKey = e, this.largestBatchId = n;
    }
    static min() {
      return new he(ct.min(), xt.empty(), -1);
    }
    static max() {
      return new he(ct.max(), xt.empty(), -1);
    }
  };
  function le(t2, e) {
    let n = t2.readTime.compareTo(e.readTime);
    return n !== 0 ? n : (n = xt.comparator(t2.documentKey, e.documentKey), n !== 0 ? n : rt(t2.largestBatchId, e.largestBatchId));
  }
  var fe = class {
    constructor(t2, e) {
      this.comparator = t2, this.root = e || _e.EMPTY;
    }
    insert(t2, e) {
      return new fe(this.comparator, this.root.insert(t2, e, this.comparator).copy(null, null, _e.BLACK, null, null));
    }
    remove(t2) {
      return new fe(this.comparator, this.root.remove(t2, this.comparator).copy(null, null, _e.BLACK, null, null));
    }
    get(t2) {
      let e = this.root;
      for (; !e.isEmpty(); ) {
        const n = this.comparator(t2, e.key);
        if (n === 0)
          return e.value;
        n < 0 ? e = e.left : n > 0 && (e = e.right);
      }
      return null;
    }
    indexOf(t2) {
      let e = 0, n = this.root;
      for (; !n.isEmpty(); ) {
        const s = this.comparator(t2, n.key);
        if (s === 0)
          return e + n.left.size;
        s < 0 ? n = n.left : (e += n.left.size + 1, n = n.right);
      }
      return -1;
    }
    isEmpty() {
      return this.root.isEmpty();
    }
    get size() {
      return this.root.size;
    }
    minKey() {
      return this.root.minKey();
    }
    maxKey() {
      return this.root.maxKey();
    }
    inorderTraversal(t2) {
      return this.root.inorderTraversal(t2);
    }
    forEach(t2) {
      this.inorderTraversal((e, n) => (t2(e, n), false));
    }
    toString() {
      const t2 = [];
      return this.inorderTraversal((e, n) => (t2.push(`${e}:${n}`), false)), `{${t2.join(", ")}}`;
    }
    reverseTraversal(t2) {
      return this.root.reverseTraversal(t2);
    }
    getIterator() {
      return new de(this.root, null, this.comparator, false);
    }
    getIteratorFrom(t2) {
      return new de(this.root, t2, this.comparator, false);
    }
    getReverseIterator() {
      return new de(this.root, null, this.comparator, true);
    }
    getReverseIteratorFrom(t2) {
      return new de(this.root, t2, this.comparator, true);
    }
  };
  var de = class {
    constructor(t2, e, n, s) {
      this.isReverse = s, this.nodeStack = [];
      let i = 1;
      for (; !t2.isEmpty(); )
        if (i = e ? n(t2.key, e) : 1, e && s && (i *= -1), i < 0)
          t2 = this.isReverse ? t2.left : t2.right;
        else {
          if (i === 0) {
            this.nodeStack.push(t2);
            break;
          }
          this.nodeStack.push(t2), t2 = this.isReverse ? t2.right : t2.left;
        }
    }
    getNext() {
      let t2 = this.nodeStack.pop();
      const e = {
        key: t2.key,
        value: t2.value
      };
      if (this.isReverse)
        for (t2 = t2.left; !t2.isEmpty(); )
          this.nodeStack.push(t2), t2 = t2.right;
      else
        for (t2 = t2.right; !t2.isEmpty(); )
          this.nodeStack.push(t2), t2 = t2.left;
      return e;
    }
    hasNext() {
      return this.nodeStack.length > 0;
    }
    peek() {
      if (this.nodeStack.length === 0)
        return null;
      const t2 = this.nodeStack[this.nodeStack.length - 1];
      return {
        key: t2.key,
        value: t2.value
      };
    }
  };
  var _e = class {
    constructor(t2, e, n, s, i) {
      this.key = t2, this.value = e, this.color = n != null ? n : _e.RED, this.left = s != null ? s : _e.EMPTY, this.right = i != null ? i : _e.EMPTY, this.size = this.left.size + 1 + this.right.size;
    }
    copy(t2, e, n, s, i) {
      return new _e(t2 != null ? t2 : this.key, e != null ? e : this.value, n != null ? n : this.color, s != null ? s : this.left, i != null ? i : this.right);
    }
    isEmpty() {
      return false;
    }
    inorderTraversal(t2) {
      return this.left.inorderTraversal(t2) || t2(this.key, this.value) || this.right.inorderTraversal(t2);
    }
    reverseTraversal(t2) {
      return this.right.reverseTraversal(t2) || t2(this.key, this.value) || this.left.reverseTraversal(t2);
    }
    min() {
      return this.left.isEmpty() ? this : this.left.min();
    }
    minKey() {
      return this.min().key;
    }
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey();
    }
    insert(t2, e, n) {
      let s = this;
      const i = n(t2, s.key);
      return s = i < 0 ? s.copy(null, null, null, s.left.insert(t2, e, n), null) : i === 0 ? s.copy(null, e, null, null, null) : s.copy(null, null, null, null, s.right.insert(t2, e, n)), s.fixUp();
    }
    removeMin() {
      if (this.left.isEmpty())
        return _e.EMPTY;
      let t2 = this;
      return t2.left.isRed() || t2.left.left.isRed() || (t2 = t2.moveRedLeft()), t2 = t2.copy(null, null, null, t2.left.removeMin(), null), t2.fixUp();
    }
    remove(t2, e) {
      let n, s = this;
      if (e(t2, s.key) < 0)
        s.left.isEmpty() || s.left.isRed() || s.left.left.isRed() || (s = s.moveRedLeft()), s = s.copy(null, null, null, s.left.remove(t2, e), null);
      else {
        if (s.left.isRed() && (s = s.rotateRight()), s.right.isEmpty() || s.right.isRed() || s.right.left.isRed() || (s = s.moveRedRight()), e(t2, s.key) === 0) {
          if (s.right.isEmpty())
            return _e.EMPTY;
          n = s.right.min(), s = s.copy(n.key, n.value, null, null, s.right.removeMin());
        }
        s = s.copy(null, null, null, null, s.right.remove(t2, e));
      }
      return s.fixUp();
    }
    isRed() {
      return this.color;
    }
    fixUp() {
      let t2 = this;
      return t2.right.isRed() && !t2.left.isRed() && (t2 = t2.rotateLeft()), t2.left.isRed() && t2.left.left.isRed() && (t2 = t2.rotateRight()), t2.left.isRed() && t2.right.isRed() && (t2 = t2.colorFlip()), t2;
    }
    moveRedLeft() {
      let t2 = this.colorFlip();
      return t2.right.left.isRed() && (t2 = t2.copy(null, null, null, null, t2.right.rotateRight()), t2 = t2.rotateLeft(), t2 = t2.colorFlip()), t2;
    }
    moveRedRight() {
      let t2 = this.colorFlip();
      return t2.left.left.isRed() && (t2 = t2.rotateRight(), t2 = t2.colorFlip()), t2;
    }
    rotateLeft() {
      const t2 = this.copy(null, null, _e.RED, null, this.right.left);
      return this.right.copy(null, null, this.color, t2, null);
    }
    rotateRight() {
      const t2 = this.copy(null, null, _e.RED, this.left.right, null);
      return this.left.copy(null, null, this.color, null, t2);
    }
    colorFlip() {
      const t2 = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
      return this.copy(null, null, !this.color, t2, e);
    }
    checkMaxDepth() {
      const t2 = this.check();
      return Math.pow(2, t2) <= this.size + 1;
    }
    check() {
      if (this.isRed() && this.left.isRed())
        throw L2();
      if (this.right.isRed())
        throw L2();
      const t2 = this.left.check();
      if (t2 !== this.right.check())
        throw L2();
      return t2 + (this.isRed() ? 0 : 1);
    }
  };
  _e.EMPTY = null, _e.RED = true, _e.BLACK = false;
  _e.EMPTY = new class {
    constructor() {
      this.size = 0;
    }
    get key() {
      throw L2();
    }
    get value() {
      throw L2();
    }
    get color() {
      throw L2();
    }
    get left() {
      throw L2();
    }
    get right() {
      throw L2();
    }
    copy(t2, e, n, s, i) {
      return this;
    }
    insert(t2, e, n) {
      return new _e(t2, e);
    }
    remove(t2, e) {
      return this;
    }
    isEmpty() {
      return true;
    }
    inorderTraversal(t2) {
      return false;
    }
    reverseTraversal(t2) {
      return false;
    }
    minKey() {
      return null;
    }
    maxKey() {
      return null;
    }
    isRed() {
      return false;
    }
    checkMaxDepth() {
      return true;
    }
    check() {
      return 0;
    }
  }();
  var we = class {
    constructor(t2) {
      this.comparator = t2, this.data = new fe(this.comparator);
    }
    has(t2) {
      return this.data.get(t2) !== null;
    }
    first() {
      return this.data.minKey();
    }
    last() {
      return this.data.maxKey();
    }
    get size() {
      return this.data.size;
    }
    indexOf(t2) {
      return this.data.indexOf(t2);
    }
    forEach(t2) {
      this.data.inorderTraversal((e, n) => (t2(e), false));
    }
    forEachInRange(t2, e) {
      const n = this.data.getIteratorFrom(t2[0]);
      for (; n.hasNext(); ) {
        const s = n.getNext();
        if (this.comparator(s.key, t2[1]) >= 0)
          return;
        e(s.key);
      }
    }
    forEachWhile(t2, e) {
      let n;
      for (n = e !== void 0 ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext(); ) {
        if (!t2(n.getNext().key))
          return;
      }
    }
    firstAfterOrEqual(t2) {
      const e = this.data.getIteratorFrom(t2);
      return e.hasNext() ? e.getNext().key : null;
    }
    getIterator() {
      return new me(this.data.getIterator());
    }
    getIteratorFrom(t2) {
      return new me(this.data.getIteratorFrom(t2));
    }
    add(t2) {
      return this.copy(this.data.remove(t2).insert(t2, true));
    }
    delete(t2) {
      return this.has(t2) ? this.copy(this.data.remove(t2)) : this;
    }
    isEmpty() {
      return this.data.isEmpty();
    }
    unionWith(t2) {
      let e = this;
      return e.size < t2.size && (e = t2, t2 = this), t2.forEach((t3) => {
        e = e.add(t3);
      }), e;
    }
    isEqual(t2) {
      if (!(t2 instanceof we))
        return false;
      if (this.size !== t2.size)
        return false;
      const e = this.data.getIterator(), n = t2.data.getIterator();
      for (; e.hasNext(); ) {
        const t3 = e.getNext().key, s = n.getNext().key;
        if (this.comparator(t3, s) !== 0)
          return false;
      }
      return true;
    }
    toArray() {
      const t2 = [];
      return this.forEach((e) => {
        t2.push(e);
      }), t2;
    }
    toString() {
      const t2 = [];
      return this.forEach((e) => t2.push(e)), "SortedSet(" + t2.toString() + ")";
    }
    copy(t2) {
      const e = new we(this.comparator);
      return e.data = t2, e;
    }
  };
  var me = class {
    constructor(t2) {
      this.iter = t2;
    }
    getNext() {
      return this.iter.getNext().key;
    }
    hasNext() {
      return this.iter.hasNext();
    }
  };
  var ye = class {
    constructor(t2, e = null, n = [], s = [], i = null, r = null, o = null) {
      this.path = t2, this.collectionGroup = e, this.orderBy = n, this.filters = s, this.limit = i, this.startAt = r, this.endAt = o, this.P = null;
    }
  };
  function pe(t2, e = null, n = [], s = [], i = null, r = null, o = null) {
    return new ye(t2, e, n, s, i, r, o);
  }
  function Ie(t2) {
    const e = K2(t2);
    if (e.P === null) {
      let t3 = e.path.canonicalString();
      e.collectionGroup !== null && (t3 += "|cg:" + e.collectionGroup), t3 += "|f:", t3 += e.filters.map((t4) => {
        return (e2 = t4).field.canonicalString() + e2.op.toString() + Lt(e2.value);
        var e2;
      }).join(","), t3 += "|ob:", t3 += e.orderBy.map((t4) => function(t5) {
        return t5.field.canonicalString() + t5.dir;
      }(t4)).join(","), St(e.limit) || (t3 += "|l:", t3 += e.limit), e.startAt && (t3 += "|lb:", t3 += e.startAt.inclusive ? "b:" : "a:", t3 += e.startAt.position.map((t4) => Lt(t4)).join(",")), e.endAt && (t3 += "|ub:", t3 += e.endAt.inclusive ? "a:" : "b:", t3 += e.endAt.position.map((t4) => Lt(t4)).join(",")), e.P = t3;
    }
    return e.P;
  }
  function Te(t2) {
    let e = t2.path.canonicalString();
    return t2.collectionGroup !== null && (e += " collectionGroup=" + t2.collectionGroup), t2.filters.length > 0 && (e += `, filters: [${t2.filters.map((t3) => {
      return `${(e2 = t3).field.canonicalString()} ${e2.op} ${Lt(e2.value)}`;
      var e2;
    }).join(", ")}]`), St(t2.limit) || (e += ", limit: " + t2.limit), t2.orderBy.length > 0 && (e += `, orderBy: [${t2.orderBy.map((t3) => function(t4) {
      return `${t4.field.canonicalString()} (${t4.dir})`;
    }(t3)).join(", ")}]`), t2.startAt && (e += ", startAt: ", e += t2.startAt.inclusive ? "b:" : "a:", e += t2.startAt.position.map((t3) => Lt(t3)).join(",")), t2.endAt && (e += ", endAt: ", e += t2.endAt.inclusive ? "a:" : "b:", e += t2.endAt.position.map((t3) => Lt(t3)).join(",")), `Target(${e})`;
  }
  function Ee(t2, e) {
    if (t2.limit !== e.limit)
      return false;
    if (t2.orderBy.length !== e.orderBy.length)
      return false;
    for (let n2 = 0; n2 < t2.orderBy.length; n2++)
      if (!$e(t2.orderBy[n2], e.orderBy[n2]))
        return false;
    if (t2.filters.length !== e.filters.length)
      return false;
    for (let i = 0; i < t2.filters.length; i++)
      if (n = t2.filters[i], s = e.filters[i], n.op !== s.op || !n.field.isEqual(s.field) || !Ot(n.value, s.value))
        return false;
    var n, s;
    return t2.collectionGroup === e.collectionGroup && (!!t2.path.isEqual(e.path) && (!!Le(t2.startAt, e.startAt) && Le(t2.endAt, e.endAt)));
  }
  function Ae(t2) {
    return xt.isDocumentKey(t2.path) && t2.collectionGroup === null && t2.filters.length === 0;
  }
  var Ve = class extends class {
  } {
    constructor(t2, e, n) {
      super(), this.field = t2, this.op = e, this.value = n;
    }
    static create(t2, e, n) {
      return t2.isKeyField() ? e === "in" || e === "not-in" ? this.V(t2, e, n) : new ve(t2, e, n) : e === "array-contains" ? new xe(t2, n) : e === "in" ? new Ne(t2, n) : e === "not-in" ? new ke(t2, n) : e === "array-contains-any" ? new Me(t2, n) : new Ve(t2, e, n);
    }
    static V(t2, e, n) {
      return e === "in" ? new Se(t2, n) : new De(t2, n);
    }
    matches(t2) {
      const e = t2.data.field(this.field);
      return this.op === "!=" ? e !== null && this.v($t(e, this.value)) : e !== null && Mt(this.value) === Mt(e) && this.v($t(e, this.value));
    }
    v(t2) {
      switch (this.op) {
        case "<":
          return t2 < 0;
        case "<=":
          return t2 <= 0;
        case "==":
          return t2 === 0;
        case "!=":
          return t2 !== 0;
        case ">":
          return t2 > 0;
        case ">=":
          return t2 >= 0;
        default:
          return L2();
      }
    }
    S() {
      return ["<", "<=", ">", ">=", "!=", "not-in"].indexOf(this.op) >= 0;
    }
  };
  var ve = class extends Ve {
    constructor(t2, e, n) {
      super(t2, e, n), this.key = xt.fromName(n.referenceValue);
    }
    matches(t2) {
      const e = xt.comparator(t2.key, this.key);
      return this.v(e);
    }
  };
  var Se = class extends Ve {
    constructor(t2, e) {
      super(t2, "in", e), this.keys = Ce("in", e);
    }
    matches(t2) {
      return this.keys.some((e) => e.isEqual(t2.key));
    }
  };
  var De = class extends Ve {
    constructor(t2, e) {
      super(t2, "not-in", e), this.keys = Ce("not-in", e);
    }
    matches(t2) {
      return !this.keys.some((e) => e.isEqual(t2.key));
    }
  };
  function Ce(t2, e) {
    var n;
    return (((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []).map((t3) => xt.fromName(t3.referenceValue));
  }
  var xe = class extends Ve {
    constructor(t2, e) {
      super(t2, "array-contains", e);
    }
    matches(t2) {
      const e = t2.data.field(this.field);
      return Gt(e) && Ft(e.arrayValue, this.value);
    }
  };
  var Ne = class extends Ve {
    constructor(t2, e) {
      super(t2, "in", e);
    }
    matches(t2) {
      const e = t2.data.field(this.field);
      return e !== null && Ft(this.value.arrayValue, e);
    }
  };
  var ke = class extends Ve {
    constructor(t2, e) {
      super(t2, "not-in", e);
    }
    matches(t2) {
      if (Ft(this.value.arrayValue, {
        nullValue: "NULL_VALUE"
      }))
        return false;
      const e = t2.data.field(this.field);
      return e !== null && !Ft(this.value.arrayValue, e);
    }
  };
  var Me = class extends Ve {
    constructor(t2, e) {
      super(t2, "array-contains-any", e);
    }
    matches(t2) {
      const e = t2.data.field(this.field);
      return !(!Gt(e) || !e.arrayValue.values) && e.arrayValue.values.some((t3) => Ft(this.value.arrayValue, t3));
    }
  };
  var Oe = class {
    constructor(t2, e) {
      this.position = t2, this.inclusive = e;
    }
  };
  var Fe = class {
    constructor(t2, e = "asc") {
      this.field = t2, this.dir = e;
    }
  };
  function $e(t2, e) {
    return t2.dir === e.dir && t2.field.isEqual(e.field);
  }
  function Be(t2, e, n) {
    let s = 0;
    for (let i = 0; i < t2.position.length; i++) {
      const r = e[i], o = t2.position[i];
      if (r.field.isKeyField())
        s = xt.comparator(xt.fromName(o.referenceValue), n.key);
      else {
        s = $t(o, n.data.field(r.field));
      }
      if (r.dir === "desc" && (s *= -1), s !== 0)
        break;
    }
    return s;
  }
  function Le(t2, e) {
    if (t2 === null)
      return e === null;
    if (e === null)
      return false;
    if (t2.inclusive !== e.inclusive || t2.position.length !== e.position.length)
      return false;
    for (let n = 0; n < t2.position.length; n++) {
      if (!Ot(t2.position[n], e.position[n]))
        return false;
    }
    return true;
  }
  var Ue = class {
    constructor(t2, e = null, n = [], s = [], i = null, r = "F", o = null, u = null) {
      this.path = t2, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = s, this.limit = i, this.limitType = r, this.startAt = o, this.endAt = u, this.D = null, this.C = null, this.startAt, this.endAt;
    }
  };
  function qe(t2, e, n, s, i, r, o, u) {
    return new Ue(t2, e, n, s, i, r, o, u);
  }
  function Ke(t2) {
    return new Ue(t2);
  }
  function Ge(t2) {
    return t2.filters.length === 0 && t2.limit === null && t2.startAt == null && t2.endAt == null && (t2.explicitOrderBy.length === 0 || t2.explicitOrderBy.length === 1 && t2.explicitOrderBy[0].field.isKeyField());
  }
  function Qe(t2) {
    return t2.explicitOrderBy.length > 0 ? t2.explicitOrderBy[0].field : null;
  }
  function je(t2) {
    for (const e of t2.filters)
      if (e.S())
        return e.field;
    return null;
  }
  function We(t2) {
    return t2.collectionGroup !== null;
  }
  function ze(t2) {
    const e = K2(t2);
    if (e.D === null) {
      e.D = [];
      const t3 = je(e), n = Qe(e);
      if (t3 !== null && n === null)
        t3.isKeyField() || e.D.push(new Fe(t3)), e.D.push(new Fe(mt.keyField(), "asc"));
      else {
        let t4 = false;
        for (const n2 of e.explicitOrderBy)
          e.D.push(n2), n2.field.isKeyField() && (t4 = true);
        if (!t4) {
          const t5 = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
          e.D.push(new Fe(mt.keyField(), t5));
        }
      }
    }
    return e.D;
  }
  function He(t2) {
    const e = K2(t2);
    if (!e.C)
      if (e.limitType === "F")
        e.C = pe(e.path, e.collectionGroup, ze(e), e.filters, e.limit, e.startAt, e.endAt);
      else {
        const t3 = [];
        for (const n2 of ze(e)) {
          const e2 = n2.dir === "desc" ? "asc" : "desc";
          t3.push(new Fe(n2.field, e2));
        }
        const n = e.endAt ? new Oe(e.endAt.position, e.endAt.inclusive) : null, s = e.startAt ? new Oe(e.startAt.position, e.startAt.inclusive) : null;
        e.C = pe(e.path, e.collectionGroup, t3, e.filters, e.limit, n, s);
      }
    return e.C;
  }
  function Je(t2, e, n) {
    return new Ue(t2.path, t2.collectionGroup, t2.explicitOrderBy.slice(), t2.filters.slice(), e, n, t2.startAt, t2.endAt);
  }
  function Ye(t2, e) {
    return Ee(He(t2), He(e)) && t2.limitType === e.limitType;
  }
  function Xe(t2) {
    return `${Ie(He(t2))}|lt:${t2.limitType}`;
  }
  function Ze(t2) {
    return `Query(target=${Te(He(t2))}; limitType=${t2.limitType})`;
  }
  function tn(t2, e) {
    return e.isFoundDocument() && function(t3, e2) {
      const n = e2.key.path;
      return t3.collectionGroup !== null ? e2.key.hasCollectionId(t3.collectionGroup) && t3.path.isPrefixOf(n) : xt.isDocumentKey(t3.path) ? t3.path.isEqual(n) : t3.path.isImmediateParentOf(n);
    }(t2, e) && function(t3, e2) {
      for (const n of t3.explicitOrderBy)
        if (!n.field.isKeyField() && e2.data.field(n.field) === null)
          return false;
      return true;
    }(t2, e) && function(t3, e2) {
      for (const n of t3.filters)
        if (!n.matches(e2))
          return false;
      return true;
    }(t2, e) && function(t3, e2) {
      if (t3.startAt && !function(t4, e3, n) {
        const s = Be(t4, e3, n);
        return t4.inclusive ? s <= 0 : s < 0;
      }(t3.startAt, ze(t3), e2))
        return false;
      if (t3.endAt && !function(t4, e3, n) {
        const s = Be(t4, e3, n);
        return t4.inclusive ? s >= 0 : s > 0;
      }(t3.endAt, ze(t3), e2))
        return false;
      return true;
    }(t2, e);
  }
  function en(t2) {
    return t2.collectionGroup || (t2.path.length % 2 == 1 ? t2.path.lastSegment() : t2.path.get(t2.path.length - 2));
  }
  function nn(t2) {
    return (e, n) => {
      let s = false;
      for (const i of ze(t2)) {
        const t3 = sn(i, e, n);
        if (t3 !== 0)
          return t3;
        s = s || i.field.isKeyField();
      }
      return 0;
    };
  }
  function sn(t2, e, n) {
    const s = t2.field.isKeyField() ? xt.comparator(e.key, n.key) : function(t3, e2, n2) {
      const s2 = e2.data.field(t3), i = n2.data.field(t3);
      return s2 !== null && i !== null ? $t(s2, i) : L2();
    }(t2.field, e, n);
    switch (t2.dir) {
      case "asc":
        return s;
      case "desc":
        return -1 * s;
      default:
        return L2();
    }
  }
  function rn(t2, e) {
    if (t2.N) {
      if (isNaN(e))
        return {
          doubleValue: "NaN"
        };
      if (e === 1 / 0)
        return {
          doubleValue: "Infinity"
        };
      if (e === -1 / 0)
        return {
          doubleValue: "-Infinity"
        };
    }
    return {
      doubleValue: Dt(e) ? "-0" : e
    };
  }
  function on(t2) {
    return {
      integerValue: "" + t2
    };
  }
  var an = class {
    constructor() {
      this._ = void 0;
    }
  };
  function cn(t2, e, n) {
    return t2 instanceof fn ? function(t3, e2) {
      const n2 = {
        fields: {
          __type__: {
            stringValue: "server_timestamp"
          },
          __local_write_time__: {
            timestampValue: {
              seconds: t3.seconds,
              nanos: t3.nanoseconds
            }
          }
        }
      };
      return e2 && (n2.fields.__previous_value__ = e2), {
        mapValue: n2
      };
    }(n, e) : t2 instanceof dn ? _n(t2, e) : t2 instanceof wn ? mn(t2, e) : function(t3, e2) {
      const n2 = ln(t3, e2), s = yn(n2) + yn(t3.k);
      return Kt(n2) && Kt(t3.k) ? on(s) : rn(t3.M, s);
    }(t2, e);
  }
  function hn(t2, e, n) {
    return t2 instanceof dn ? _n(t2, e) : t2 instanceof wn ? mn(t2, e) : n;
  }
  function ln(t2, e) {
    return t2 instanceof gn ? Kt(n = e) || function(t3) {
      return !!t3 && "doubleValue" in t3;
    }(n) ? e : {
      integerValue: 0
    } : null;
    var n;
  }
  var fn = class extends an {
  };
  var dn = class extends an {
    constructor(t2) {
      super(), this.elements = t2;
    }
  };
  function _n(t2, e) {
    const n = pn(e);
    for (const e2 of t2.elements)
      n.some((t3) => Ot(t3, e2)) || n.push(e2);
    return {
      arrayValue: {
        values: n
      }
    };
  }
  var wn = class extends an {
    constructor(t2) {
      super(), this.elements = t2;
    }
  };
  function mn(t2, e) {
    let n = pn(e);
    for (const e2 of t2.elements)
      n = n.filter((t3) => !Ot(t3, e2));
    return {
      arrayValue: {
        values: n
      }
    };
  }
  var gn = class extends an {
    constructor(t2, e) {
      super(), this.M = t2, this.k = e;
    }
  };
  function yn(t2) {
    return Et(t2.integerValue || t2.doubleValue);
  }
  function pn(t2) {
    return Gt(t2) && t2.arrayValue.values ? t2.arrayValue.values.slice() : [];
  }
  function Tn(t2, e) {
    return t2.field.isEqual(e.field) && function(t3, e2) {
      return t3 instanceof dn && e2 instanceof dn || t3 instanceof wn && e2 instanceof wn ? ot(t3.elements, e2.elements, Ot) : t3 instanceof gn && e2 instanceof gn ? Ot(t3.k, e2.k) : t3 instanceof fn && e2 instanceof fn;
    }(t2.transform, e.transform);
  }
  function Rn(t2, e) {
    return t2.updateTime !== void 0 ? e.isFoundDocument() && e.version.isEqual(t2.updateTime) : t2.exists === void 0 || t2.exists === e.isFoundDocument();
  }
  var bn = class {
  };
  function Pn(t2, e, n) {
    t2 instanceof Cn ? function(t3, e2, n2) {
      const s = t3.value.clone(), i = kn(t3.fieldTransforms, e2, n2.transformResults);
      s.setAll(i), e2.convertToFoundDocument(n2.version, s).setHasCommittedMutations();
    }(t2, e, n) : t2 instanceof xn ? function(t3, e2, n2) {
      if (!Rn(t3.precondition, e2))
        return void e2.convertToUnknownDocument(n2.version);
      const s = kn(t3.fieldTransforms, e2, n2.transformResults), i = e2.data;
      i.setAll(Nn(t3)), i.setAll(s), e2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
    }(t2, e, n) : function(t3, e2, n2) {
      e2.convertToNoDocument(n2.version).setHasCommittedMutations();
    }(0, e, n);
  }
  function Vn(t2, e, n) {
    t2 instanceof Cn ? function(t3, e2, n2) {
      if (!Rn(t3.precondition, e2))
        return;
      const s = t3.value.clone(), i = Mn(t3.fieldTransforms, n2, e2);
      s.setAll(i), e2.convertToFoundDocument(Dn(e2), s).setHasLocalMutations();
    }(t2, e, n) : t2 instanceof xn ? function(t3, e2, n2) {
      if (!Rn(t3.precondition, e2))
        return;
      const s = Mn(t3.fieldTransforms, n2, e2), i = e2.data;
      i.setAll(Nn(t3)), i.setAll(s), e2.convertToFoundDocument(Dn(e2), i).setHasLocalMutations();
    }(t2, e, n) : function(t3, e2) {
      Rn(t3.precondition, e2) && e2.convertToNoDocument(ct.min());
    }(t2, e);
  }
  function Sn(t2, e) {
    return t2.type === e.type && (!!t2.key.isEqual(e.key) && (!!t2.precondition.isEqual(e.precondition) && (!!function(t3, e2) {
      return t3 === void 0 && e2 === void 0 || !(!t3 || !e2) && ot(t3, e2, (t4, e3) => Tn(t4, e3));
    }(t2.fieldTransforms, e.fieldTransforms) && (t2.type === 0 ? t2.value.isEqual(e.value) : t2.type !== 1 || t2.data.isEqual(e.data) && t2.fieldMask.isEqual(e.fieldMask)))));
  }
  function Dn(t2) {
    return t2.isFoundDocument() ? t2.version : ct.min();
  }
  var Cn = class extends bn {
    constructor(t2, e, n, s = []) {
      super(), this.key = t2, this.value = e, this.precondition = n, this.fieldTransforms = s, this.type = 0;
    }
  };
  var xn = class extends bn {
    constructor(t2, e, n, s, i = []) {
      super(), this.key = t2, this.data = e, this.fieldMask = n, this.precondition = s, this.fieldTransforms = i, this.type = 1;
    }
  };
  function Nn(t2) {
    const e = /* @__PURE__ */ new Map();
    return t2.fieldMask.fields.forEach((n) => {
      if (!n.isEmpty()) {
        const s = t2.data.field(n);
        e.set(n, s);
      }
    }), e;
  }
  function kn(t2, e, n) {
    const s = /* @__PURE__ */ new Map();
    U2(t2.length === n.length);
    for (let i = 0; i < n.length; i++) {
      const r = t2[i], o = r.transform, u = e.data.field(r.field);
      s.set(r.field, hn(o, u, n[i]));
    }
    return s;
  }
  function Mn(t2, e, n) {
    const s = /* @__PURE__ */ new Map();
    for (const i of t2) {
      const t3 = i.transform, r = n.data.field(i.field);
      s.set(i.field, cn(t3, r, e));
    }
    return s;
  }
  var $n = class {
    constructor(t2) {
      this.count = t2;
    }
  };
  var Bn;
  var Ln;
  function qn(t2) {
    if (t2 === void 0)
      return F2("GRPC error has no .code"), G.UNKNOWN;
    switch (t2) {
      case Bn.OK:
        return G.OK;
      case Bn.CANCELLED:
        return G.CANCELLED;
      case Bn.UNKNOWN:
        return G.UNKNOWN;
      case Bn.DEADLINE_EXCEEDED:
        return G.DEADLINE_EXCEEDED;
      case Bn.RESOURCE_EXHAUSTED:
        return G.RESOURCE_EXHAUSTED;
      case Bn.INTERNAL:
        return G.INTERNAL;
      case Bn.UNAVAILABLE:
        return G.UNAVAILABLE;
      case Bn.UNAUTHENTICATED:
        return G.UNAUTHENTICATED;
      case Bn.INVALID_ARGUMENT:
        return G.INVALID_ARGUMENT;
      case Bn.NOT_FOUND:
        return G.NOT_FOUND;
      case Bn.ALREADY_EXISTS:
        return G.ALREADY_EXISTS;
      case Bn.PERMISSION_DENIED:
        return G.PERMISSION_DENIED;
      case Bn.FAILED_PRECONDITION:
        return G.FAILED_PRECONDITION;
      case Bn.ABORTED:
        return G.ABORTED;
      case Bn.OUT_OF_RANGE:
        return G.OUT_OF_RANGE;
      case Bn.UNIMPLEMENTED:
        return G.UNIMPLEMENTED;
      case Bn.DATA_LOSS:
        return G.DATA_LOSS;
      default:
        return L2();
    }
  }
  (Ln = Bn || (Bn = {}))[Ln.OK = 0] = "OK", Ln[Ln.CANCELLED = 1] = "CANCELLED", Ln[Ln.UNKNOWN = 2] = "UNKNOWN", Ln[Ln.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", Ln[Ln.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", Ln[Ln.NOT_FOUND = 5] = "NOT_FOUND", Ln[Ln.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", Ln[Ln.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", Ln[Ln.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", Ln[Ln.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", Ln[Ln.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", Ln[Ln.ABORTED = 10] = "ABORTED", Ln[Ln.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", Ln[Ln.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", Ln[Ln.INTERNAL = 13] = "INTERNAL", Ln[Ln.UNAVAILABLE = 14] = "UNAVAILABLE", Ln[Ln.DATA_LOSS = 15] = "DATA_LOSS";
  var Kn = class {
    constructor(t2, e) {
      this.mapKeyFn = t2, this.equalsFn = e, this.inner = {}, this.innerSize = 0;
    }
    get(t2) {
      const e = this.mapKeyFn(t2), n = this.inner[e];
      if (n !== void 0) {
        for (const [e2, s] of n)
          if (this.equalsFn(e2, t2))
            return s;
      }
    }
    has(t2) {
      return this.get(t2) !== void 0;
    }
    set(t2, e) {
      const n = this.mapKeyFn(t2), s = this.inner[n];
      if (s === void 0)
        return this.inner[n] = [[t2, e]], void this.innerSize++;
      for (let n2 = 0; n2 < s.length; n2++)
        if (this.equalsFn(s[n2][0], t2))
          return void (s[n2] = [t2, e]);
      s.push([t2, e]), this.innerSize++;
    }
    delete(t2) {
      const e = this.mapKeyFn(t2), n = this.inner[e];
      if (n === void 0)
        return false;
      for (let s = 0; s < n.length; s++)
        if (this.equalsFn(n[s][0], t2))
          return n.length === 1 ? delete this.inner[e] : n.splice(s, 1), this.innerSize--, true;
      return false;
    }
    forEach(t2) {
      lt(this.inner, (e, n) => {
        for (const [e2, s] of n)
          t2(e2, s);
      });
    }
    isEmpty() {
      return ft(this.inner);
    }
    size() {
      return this.innerSize;
    }
  };
  var Gn = new fe(xt.comparator);
  function Qn() {
    return Gn;
  }
  var jn = new fe(xt.comparator);
  function Wn(...t2) {
    let e = jn;
    for (const n of t2)
      e = e.insert(n.key, n);
    return e;
  }
  function zn() {
    return new Kn((t2) => t2.toString(), (t2, e) => t2.isEqual(e));
  }
  var Hn = new fe(xt.comparator);
  var Jn = new we(xt.comparator);
  function Yn(...t2) {
    let e = Jn;
    for (const n of t2)
      e = e.add(n);
    return e;
  }
  var Xn = new we(rt);
  function Zn() {
    return Xn;
  }
  var ts = class {
    constructor(t2, e, n, s, i) {
      this.snapshotVersion = t2, this.targetChanges = e, this.targetMismatches = n, this.documentUpdates = s, this.resolvedLimboDocuments = i;
    }
    static createSynthesizedRemoteEventForCurrentChange(t2, e) {
      const n = /* @__PURE__ */ new Map();
      return n.set(t2, es.createSynthesizedTargetChangeForCurrentChange(t2, e)), new ts(ct.min(), n, Zn(), Qn(), Yn());
    }
  };
  var es = class {
    constructor(t2, e, n, s, i) {
      this.resumeToken = t2, this.current = e, this.addedDocuments = n, this.modifiedDocuments = s, this.removedDocuments = i;
    }
    static createSynthesizedTargetChangeForCurrentChange(t2, e) {
      return new es(pt.EMPTY_BYTE_STRING, e, Yn(), Yn(), Yn());
    }
  };
  var ns = class {
    constructor(t2, e, n, s) {
      this.O = t2, this.removedTargetIds = e, this.key = n, this.F = s;
    }
  };
  var ss = class {
    constructor(t2, e) {
      this.targetId = t2, this.$ = e;
    }
  };
  var is = class {
    constructor(t2, e, n = pt.EMPTY_BYTE_STRING, s = null) {
      this.state = t2, this.targetIds = e, this.resumeToken = n, this.cause = s;
    }
  };
  var rs = class {
    constructor() {
      this.B = 0, this.L = as(), this.U = pt.EMPTY_BYTE_STRING, this.q = false, this.K = true;
    }
    get current() {
      return this.q;
    }
    get resumeToken() {
      return this.U;
    }
    get G() {
      return this.B !== 0;
    }
    get j() {
      return this.K;
    }
    W(t2) {
      t2.approximateByteSize() > 0 && (this.K = true, this.U = t2);
    }
    H() {
      let t2 = Yn(), e = Yn(), n = Yn();
      return this.L.forEach((s, i) => {
        switch (i) {
          case 0:
            t2 = t2.add(s);
            break;
          case 2:
            e = e.add(s);
            break;
          case 1:
            n = n.add(s);
            break;
          default:
            L2();
        }
      }), new es(this.U, this.q, t2, e, n);
    }
    J() {
      this.K = false, this.L = as();
    }
    Y(t2, e) {
      this.K = true, this.L = this.L.insert(t2, e);
    }
    X(t2) {
      this.K = true, this.L = this.L.remove(t2);
    }
    Z() {
      this.B += 1;
    }
    tt() {
      this.B -= 1;
    }
    et() {
      this.K = true, this.q = true;
    }
  };
  var os = class {
    constructor(t2) {
      this.nt = t2, this.st = /* @__PURE__ */ new Map(), this.it = Qn(), this.rt = us(), this.ot = new we(rt);
    }
    ut(t2) {
      for (const e of t2.O)
        t2.F && t2.F.isFoundDocument() ? this.at(e, t2.F) : this.ct(e, t2.key, t2.F);
      for (const e of t2.removedTargetIds)
        this.ct(e, t2.key, t2.F);
    }
    ht(t2) {
      this.forEachTarget(t2, (e) => {
        const n = this.lt(e);
        switch (t2.state) {
          case 0:
            this.ft(e) && n.W(t2.resumeToken);
            break;
          case 1:
            n.tt(), n.G || n.J(), n.W(t2.resumeToken);
            break;
          case 2:
            n.tt(), n.G || this.removeTarget(e);
            break;
          case 3:
            this.ft(e) && (n.et(), n.W(t2.resumeToken));
            break;
          case 4:
            this.ft(e) && (this.dt(e), n.W(t2.resumeToken));
            break;
          default:
            L2();
        }
      });
    }
    forEachTarget(t2, e) {
      t2.targetIds.length > 0 ? t2.targetIds.forEach(e) : this.st.forEach((t3, n) => {
        this.ft(n) && e(n);
      });
    }
    _t(t2) {
      const e = t2.targetId, n = t2.$.count, s = this.wt(e);
      if (s) {
        const t3 = s.target;
        if (Ae(t3))
          if (n === 0) {
            const n2 = new xt(t3.path);
            this.ct(e, n2, ne.newNoDocument(n2, ct.min()));
          } else
            U2(n === 1);
        else {
          this.gt(e) !== n && (this.dt(e), this.ot = this.ot.add(e));
        }
      }
    }
    yt(t2) {
      const e = /* @__PURE__ */ new Map();
      this.st.forEach((n2, s2) => {
        const i = this.wt(s2);
        if (i) {
          if (n2.current && Ae(i.target)) {
            const e2 = new xt(i.target.path);
            this.it.get(e2) !== null || this.It(s2, e2) || this.ct(s2, e2, ne.newNoDocument(e2, t2));
          }
          n2.j && (e.set(s2, n2.H()), n2.J());
        }
      });
      let n = Yn();
      this.rt.forEach((t3, e2) => {
        let s2 = true;
        e2.forEachWhile((t4) => {
          const e3 = this.wt(t4);
          return !e3 || e3.purpose === 2 || (s2 = false, false);
        }), s2 && (n = n.add(t3));
      }), this.it.forEach((e2, n2) => n2.setReadTime(t2));
      const s = new ts(t2, e, this.ot, this.it, n);
      return this.it = Qn(), this.rt = us(), this.ot = new we(rt), s;
    }
    at(t2, e) {
      if (!this.ft(t2))
        return;
      const n = this.It(t2, e.key) ? 2 : 0;
      this.lt(t2).Y(e.key, n), this.it = this.it.insert(e.key, e), this.rt = this.rt.insert(e.key, this.Tt(e.key).add(t2));
    }
    ct(t2, e, n) {
      if (!this.ft(t2))
        return;
      const s = this.lt(t2);
      this.It(t2, e) ? s.Y(e, 1) : s.X(e), this.rt = this.rt.insert(e, this.Tt(e).delete(t2)), n && (this.it = this.it.insert(e, n));
    }
    removeTarget(t2) {
      this.st.delete(t2);
    }
    gt(t2) {
      const e = this.lt(t2).H();
      return this.nt.getRemoteKeysForTarget(t2).size + e.addedDocuments.size - e.removedDocuments.size;
    }
    Z(t2) {
      this.lt(t2).Z();
    }
    lt(t2) {
      let e = this.st.get(t2);
      return e || (e = new rs(), this.st.set(t2, e)), e;
    }
    Tt(t2) {
      let e = this.rt.get(t2);
      return e || (e = new we(rt), this.rt = this.rt.insert(t2, e)), e;
    }
    ft(t2) {
      const e = this.wt(t2) !== null;
      return e || O2("WatchChangeAggregator", "Detected inactive target", t2), e;
    }
    wt(t2) {
      const e = this.st.get(t2);
      return e && e.G ? null : this.nt.Et(t2);
    }
    dt(t2) {
      this.st.set(t2, new rs());
      this.nt.getRemoteKeysForTarget(t2).forEach((e) => {
        this.ct(t2, e, null);
      });
    }
    It(t2, e) {
      return this.nt.getRemoteKeysForTarget(t2).has(e);
    }
  };
  function us() {
    return new fe(xt.comparator);
  }
  function as() {
    return new fe(xt.comparator);
  }
  var cs = (() => {
    const t2 = {
      asc: "ASCENDING",
      desc: "DESCENDING"
    };
    return t2;
  })();
  var hs = (() => {
    const t2 = {
      "<": "LESS_THAN",
      "<=": "LESS_THAN_OR_EQUAL",
      ">": "GREATER_THAN",
      ">=": "GREATER_THAN_OR_EQUAL",
      "==": "EQUAL",
      "!=": "NOT_EQUAL",
      "array-contains": "ARRAY_CONTAINS",
      in: "IN",
      "not-in": "NOT_IN",
      "array-contains-any": "ARRAY_CONTAINS_ANY"
    };
    return t2;
  })();
  var ls = class {
    constructor(t2, e) {
      this.databaseId = t2, this.N = e;
    }
  };
  function fs(t2, e) {
    if (t2.N) {
      return `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
    }
    return {
      seconds: "" + e.seconds,
      nanos: e.nanoseconds
    };
  }
  function ds(t2, e) {
    return t2.N ? e.toBase64() : e.toUint8Array();
  }
  function ws(t2) {
    return U2(!!t2), ct.fromTimestamp(function(t3) {
      const e = Tt(t3);
      return new at(e.seconds, e.nanos);
    }(t2));
  }
  function ms(t2, e) {
    return function(t3) {
      return new _t(["projects", t3.projectId, "databases", t3.database]);
    }(t2).child("documents").child(e).canonicalString();
  }
  function gs(t2) {
    const e = _t.fromString(t2);
    return U2(Ks(e)), e;
  }
  function ps(t2, e) {
    const n = gs(e);
    if (n.get(1) !== t2.databaseId.projectId)
      throw new Q2(G.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t2.databaseId.projectId);
    if (n.get(3) !== t2.databaseId.database)
      throw new Q2(G.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t2.databaseId.database);
    return new xt(As(n));
  }
  function Is(t2, e) {
    return ms(t2.databaseId, e);
  }
  function Ts(t2) {
    const e = gs(t2);
    return e.length === 4 ? _t.emptyPath() : As(e);
  }
  function Es(t2) {
    return new _t(["projects", t2.databaseId.projectId, "databases", t2.databaseId.database]).canonicalString();
  }
  function As(t2) {
    return U2(t2.length > 4 && t2.get(4) === "documents"), t2.popFirst(5);
  }
  function Vs(t2, e) {
    let n;
    if ("targetChange" in e) {
      e.targetChange;
      const s = function(t3) {
        return t3 === "NO_CHANGE" ? 0 : t3 === "ADD" ? 1 : t3 === "REMOVE" ? 2 : t3 === "CURRENT" ? 3 : t3 === "RESET" ? 4 : L2();
      }(e.targetChange.targetChangeType || "NO_CHANGE"), i = e.targetChange.targetIds || [], r = function(t3, e2) {
        return t3.N ? (U2(e2 === void 0 || typeof e2 == "string"), pt.fromBase64String(e2 || "")) : (U2(e2 === void 0 || e2 instanceof Uint8Array), pt.fromUint8Array(e2 || new Uint8Array()));
      }(t2, e.targetChange.resumeToken), o = e.targetChange.cause, u = o && function(t3) {
        const e2 = t3.code === void 0 ? G.UNKNOWN : qn(t3.code);
        return new Q2(e2, t3.message || "");
      }(o);
      n = new is(s, i, r, u || null);
    } else if ("documentChange" in e) {
      e.documentChange;
      const s = e.documentChange;
      s.document, s.document.name, s.document.updateTime;
      const i = ps(t2, s.document.name), r = ws(s.document.updateTime), o = new te({
        mapValue: {
          fields: s.document.fields
        }
      }), u = ne.newFoundDocument(i, r, o), a = s.targetIds || [], c = s.removedTargetIds || [];
      n = new ns(a, c, u.key, u);
    } else if ("documentDelete" in e) {
      e.documentDelete;
      const s = e.documentDelete;
      s.document;
      const i = ps(t2, s.document), r = s.readTime ? ws(s.readTime) : ct.min(), o = ne.newNoDocument(i, r), u = s.removedTargetIds || [];
      n = new ns([], u, o.key, o);
    } else if ("documentRemove" in e) {
      e.documentRemove;
      const s = e.documentRemove;
      s.document;
      const i = ps(t2, s.document), r = s.removedTargetIds || [];
      n = new ns([], r, i, null);
    } else {
      if (!("filter" in e))
        return L2();
      {
        e.filter;
        const t3 = e.filter;
        t3.targetId;
        const s = t3.count || 0, i = new $n(s), r = t3.targetId;
        n = new ss(r, i);
      }
    }
    return n;
  }
  function Cs(t2, e) {
    return {
      documents: [Is(t2, e.path)]
    };
  }
  function xs(t2, e) {
    const n = {
      structuredQuery: {}
    }, s = e.path;
    e.collectionGroup !== null ? (n.parent = Is(t2, s), n.structuredQuery.from = [{
      collectionId: e.collectionGroup,
      allDescendants: true
    }]) : (n.parent = Is(t2, s.popLast()), n.structuredQuery.from = [{
      collectionId: s.lastSegment()
    }]);
    const i = function(t3) {
      if (t3.length === 0)
        return;
      const e2 = t3.map((t4) => function(t5) {
        if (t5.op === "==") {
          if (jt(t5.value))
            return {
              unaryFilter: {
                field: $s(t5.field),
                op: "IS_NAN"
              }
            };
          if (Qt(t5.value))
            return {
              unaryFilter: {
                field: $s(t5.field),
                op: "IS_NULL"
              }
            };
        } else if (t5.op === "!=") {
          if (jt(t5.value))
            return {
              unaryFilter: {
                field: $s(t5.field),
                op: "IS_NOT_NAN"
              }
            };
          if (Qt(t5.value))
            return {
              unaryFilter: {
                field: $s(t5.field),
                op: "IS_NOT_NULL"
              }
            };
        }
        return {
          fieldFilter: {
            field: $s(t5.field),
            op: Fs(t5.op),
            value: t5.value
          }
        };
      }(t4));
      if (e2.length === 1)
        return e2[0];
      return {
        compositeFilter: {
          op: "AND",
          filters: e2
        }
      };
    }(e.filters);
    i && (n.structuredQuery.where = i);
    const r = function(t3) {
      if (t3.length === 0)
        return;
      return t3.map((t4) => function(t5) {
        return {
          field: $s(t5.field),
          direction: Os(t5.dir)
        };
      }(t4));
    }(e.orderBy);
    r && (n.structuredQuery.orderBy = r);
    const o = function(t3, e2) {
      return t3.N || St(e2) ? e2 : {
        value: e2
      };
    }(t2, e.limit);
    var u;
    return o !== null && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = {
      before: (u = e.startAt).inclusive,
      values: u.position
    }), e.endAt && (n.structuredQuery.endAt = function(t3) {
      return {
        before: !t3.inclusive,
        values: t3.position
      };
    }(e.endAt)), n;
  }
  function Ns(t2) {
    let e = Ts(t2.parent);
    const n = t2.structuredQuery, s = n.from ? n.from.length : 0;
    let i = null;
    if (s > 0) {
      U2(s === 1);
      const t3 = n.from[0];
      t3.allDescendants ? i = t3.collectionId : e = e.child(t3.collectionId);
    }
    let r = [];
    n.where && (r = Ms(n.where));
    let o = [];
    n.orderBy && (o = n.orderBy.map((t3) => function(t4) {
      return new Fe(Bs(t4.field), function(t5) {
        switch (t5) {
          case "ASCENDING":
            return "asc";
          case "DESCENDING":
            return "desc";
          default:
            return;
        }
      }(t4.direction));
    }(t3)));
    let u = null;
    n.limit && (u = function(t3) {
      let e2;
      return e2 = typeof t3 == "object" ? t3.value : t3, St(e2) ? null : e2;
    }(n.limit));
    let a = null;
    n.startAt && (a = function(t3) {
      const e2 = !!t3.before, n2 = t3.values || [];
      return new Oe(n2, e2);
    }(n.startAt));
    let c = null;
    return n.endAt && (c = function(t3) {
      const e2 = !t3.before, n2 = t3.values || [];
      return new Oe(n2, e2);
    }(n.endAt)), qe(e, i, o, r, u, "F", a, c);
  }
  function ks(t2, e) {
    const n = function(t3, e2) {
      switch (e2) {
        case 0:
          return null;
        case 1:
          return "existence-filter-mismatch";
        case 2:
          return "limbo-document";
        default:
          return L2();
      }
    }(0, e.purpose);
    return n == null ? null : {
      "goog-listen-tags": n
    };
  }
  function Ms(t2) {
    return t2 ? t2.unaryFilter !== void 0 ? [Us(t2)] : t2.fieldFilter !== void 0 ? [Ls(t2)] : t2.compositeFilter !== void 0 ? t2.compositeFilter.filters.map((t3) => Ms(t3)).reduce((t3, e) => t3.concat(e)) : L2() : [];
  }
  function Os(t2) {
    return cs[t2];
  }
  function Fs(t2) {
    return hs[t2];
  }
  function $s(t2) {
    return {
      fieldPath: t2.canonicalString()
    };
  }
  function Bs(t2) {
    return mt.fromServerFormat(t2.fieldPath);
  }
  function Ls(t2) {
    return Ve.create(Bs(t2.fieldFilter.field), function(t3) {
      switch (t3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return L2();
      }
    }(t2.fieldFilter.op), t2.fieldFilter.value);
  }
  function Us(t2) {
    switch (t2.unaryFilter.op) {
      case "IS_NAN":
        const e = Bs(t2.unaryFilter.field);
        return Ve.create(e, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = Bs(t2.unaryFilter.field);
        return Ve.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const s = Bs(t2.unaryFilter.field);
        return Ve.create(s, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = Bs(t2.unaryFilter.field);
        return Ve.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return L2();
    }
  }
  function Ks(t2) {
    return t2.length >= 4 && t2.get(0) === "projects" && t2.get(2) === "databases";
  }
  var fi = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
  var di = [...fi, "documentOverlays"];
  var _i = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
  var wi = [..._i, "indexConfiguration", "indexState", "indexEntries"];
  var mi = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
  var gi = class {
    constructor() {
      this.onCommittedListeners = [];
    }
    addOnCommittedListener(t2) {
      this.onCommittedListeners.push(t2);
    }
    raiseOnCommittedEvent() {
      this.onCommittedListeners.forEach((t2) => t2());
    }
  };
  var yi = class {
    constructor(t2) {
      this.nextCallback = null, this.catchCallback = null, this.result = void 0, this.error = void 0, this.isDone = false, this.callbackAttached = false, t2((t3) => {
        this.isDone = true, this.result = t3, this.nextCallback && this.nextCallback(t3);
      }, (t3) => {
        this.isDone = true, this.error = t3, this.catchCallback && this.catchCallback(t3);
      });
    }
    catch(t2) {
      return this.next(void 0, t2);
    }
    next(t2, e) {
      return this.callbackAttached && L2(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(e, this.error) : this.wrapSuccess(t2, this.result) : new yi((n, s) => {
        this.nextCallback = (e2) => {
          this.wrapSuccess(t2, e2).next(n, s);
        }, this.catchCallback = (t3) => {
          this.wrapFailure(e, t3).next(n, s);
        };
      });
    }
    toPromise() {
      return new Promise((t2, e) => {
        this.next(t2, e);
      });
    }
    wrapUserFunction(t2) {
      try {
        const e = t2();
        return e instanceof yi ? e : yi.resolve(e);
      } catch (t3) {
        return yi.reject(t3);
      }
    }
    wrapSuccess(t2, e) {
      return t2 ? this.wrapUserFunction(() => t2(e)) : yi.resolve(e);
    }
    wrapFailure(t2, e) {
      return t2 ? this.wrapUserFunction(() => t2(e)) : yi.reject(e);
    }
    static resolve(t2) {
      return new yi((e, n) => {
        e(t2);
      });
    }
    static reject(t2) {
      return new yi((e, n) => {
        n(t2);
      });
    }
    static waitFor(t2) {
      return new yi((e, n) => {
        let s = 0, i = 0, r = false;
        t2.forEach((t3) => {
          ++s, t3.next(() => {
            ++i, r && i === s && e();
          }, (t4) => n(t4));
        }), r = true, i === s && e();
      });
    }
    static or(t2) {
      let e = yi.resolve(false);
      for (const n of t2)
        e = e.next((t3) => t3 ? yi.resolve(t3) : n());
      return e;
    }
    static forEach(t2, e) {
      const n = [];
      return t2.forEach((t3, s) => {
        n.push(e.call(this, t3, s));
      }), this.waitFor(n);
    }
  };
  function Ai(t2) {
    return t2.name === "IndexedDbTransactionError";
  }
  var Di = class {
    constructor(t2, e, n, s) {
      this.batchId = t2, this.localWriteTime = e, this.baseMutations = n, this.mutations = s;
    }
    applyToRemoteDocument(t2, e) {
      const n = e.mutationResults;
      for (let e2 = 0; e2 < this.mutations.length; e2++) {
        const s = this.mutations[e2];
        if (s.key.isEqual(t2.key)) {
          Pn(s, t2, n[e2]);
        }
      }
    }
    applyToLocalView(t2) {
      for (const e of this.baseMutations)
        e.key.isEqual(t2.key) && Vn(e, t2, this.localWriteTime);
      for (const e of this.mutations)
        e.key.isEqual(t2.key) && Vn(e, t2, this.localWriteTime);
    }
    applyToLocalDocumentSet(t2) {
      this.mutations.forEach((e) => {
        const n = t2.get(e.key), s = n;
        this.applyToLocalView(s), n.isValidDocument() || s.convertToNoDocument(ct.min());
      });
    }
    keys() {
      return this.mutations.reduce((t2, e) => t2.add(e.key), Yn());
    }
    isEqual(t2) {
      return this.batchId === t2.batchId && ot(this.mutations, t2.mutations, (t3, e) => Sn(t3, e)) && ot(this.baseMutations, t2.baseMutations, (t3, e) => Sn(t3, e));
    }
  };
  var xi = class {
    constructor(t2, e) {
      this.largestBatchId = t2, this.mutation = e;
    }
    getKey() {
      return this.mutation.key;
    }
    isEqual(t2) {
      return t2 !== null && this.mutation === t2.mutation;
    }
    toString() {
      return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
    }
  };
  var Ni = class {
    constructor(t2, e, n, s, i = ct.min(), r = ct.min(), o = pt.EMPTY_BYTE_STRING) {
      this.target = t2, this.targetId = e, this.purpose = n, this.sequenceNumber = s, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = r, this.resumeToken = o;
    }
    withSequenceNumber(t2) {
      return new Ni(this.target, this.targetId, this.purpose, t2, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken);
    }
    withResumeToken(t2, e) {
      return new Ni(this.target, this.targetId, this.purpose, this.sequenceNumber, e, this.lastLimboFreeSnapshotVersion, t2);
    }
    withLastLimboFreeSnapshotVersion(t2) {
      return new Ni(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, t2, this.resumeToken);
    }
  };
  var ki = class {
    constructor(t2) {
      this.Jt = t2;
    }
  };
  function Ki(t2) {
    const e = Ns({
      parent: t2.parent,
      structuredQuery: t2.structuredQuery
    });
    return t2.limitType === "LAST" ? Je(e, e.limit, "L") : e;
  }
  var Yi = class {
    constructor() {
    }
    Zt(t2, e) {
      this.te(t2, e), e.ee();
    }
    te(t2, e) {
      if ("nullValue" in t2)
        this.ne(e, 5);
      else if ("booleanValue" in t2)
        this.ne(e, 10), e.se(t2.booleanValue ? 1 : 0);
      else if ("integerValue" in t2)
        this.ne(e, 15), e.se(Et(t2.integerValue));
      else if ("doubleValue" in t2) {
        const n = Et(t2.doubleValue);
        isNaN(n) ? this.ne(e, 13) : (this.ne(e, 15), Dt(n) ? e.se(0) : e.se(n));
      } else if ("timestampValue" in t2) {
        const n = t2.timestampValue;
        this.ne(e, 20), typeof n == "string" ? e.ie(n) : (e.ie(`${n.seconds || ""}`), e.se(n.nanos || 0));
      } else if ("stringValue" in t2)
        this.re(t2.stringValue, e), this.oe(e);
      else if ("bytesValue" in t2)
        this.ne(e, 30), e.ue(At(t2.bytesValue)), this.oe(e);
      else if ("referenceValue" in t2)
        this.ae(t2.referenceValue, e);
      else if ("geoPointValue" in t2) {
        const n = t2.geoPointValue;
        this.ne(e, 45), e.se(n.latitude || 0), e.se(n.longitude || 0);
      } else
        "mapValue" in t2 ? Ht(t2) ? this.ne(e, Number.MAX_SAFE_INTEGER) : (this.ce(t2.mapValue, e), this.oe(e)) : "arrayValue" in t2 ? (this.he(t2.arrayValue, e), this.oe(e)) : L2();
    }
    re(t2, e) {
      this.ne(e, 25), this.le(t2, e);
    }
    le(t2, e) {
      e.ie(t2);
    }
    ce(t2, e) {
      const n = t2.fields || {};
      this.ne(e, 55);
      for (const t3 of Object.keys(n))
        this.re(t3, e), this.te(n[t3], e);
    }
    he(t2, e) {
      const n = t2.values || [];
      this.ne(e, 50);
      for (const t3 of n)
        this.te(t3, e);
    }
    ae(t2, e) {
      this.ne(e, 37);
      xt.fromName(t2).path.forEach((t3) => {
        this.ne(e, 60), this.le(t3, e);
      });
    }
    ne(t2, e) {
      t2.se(e);
    }
    oe(t2) {
      t2.se(2);
    }
  };
  Yi.fe = new Yi();
  var ar = class {
    constructor() {
      this.qe = new cr();
    }
    addToCollectionParentIndex(t2, e) {
      return this.qe.add(e), yi.resolve();
    }
    getCollectionParents(t2, e) {
      return yi.resolve(this.qe.getEntries(e));
    }
    addFieldIndex(t2, e) {
      return yi.resolve();
    }
    deleteFieldIndex(t2, e) {
      return yi.resolve();
    }
    getDocumentsMatchingTarget(t2, e) {
      return yi.resolve(null);
    }
    getIndexType(t2, e) {
      return yi.resolve(0);
    }
    getFieldIndexes(t2, e) {
      return yi.resolve([]);
    }
    getNextCollectionGroupToUpdate(t2) {
      return yi.resolve(null);
    }
    getMinOffset(t2, e) {
      return yi.resolve(he.min());
    }
    updateCollectionGroup(t2, e, n) {
      return yi.resolve();
    }
    updateIndexEntries(t2, e) {
      return yi.resolve();
    }
  };
  var cr = class {
    constructor() {
      this.index = {};
    }
    add(t2) {
      const e = t2.lastSegment(), n = t2.popLast(), s = this.index[e] || new we(_t.comparator), i = !s.has(n);
      return this.index[e] = s.add(n), i;
    }
    has(t2) {
      const e = t2.lastSegment(), n = t2.popLast(), s = this.index[e];
      return s && s.has(n);
    }
    getEntries(t2) {
      return (this.index[t2] || new we(_t.comparator)).toArray();
    }
  };
  var hr = new Uint8Array(0);
  var gr = class {
    constructor(t2, e, n) {
      this.cacheSizeCollectionThreshold = t2, this.percentileToCollect = e, this.maximumSequenceNumbersToCollect = n;
    }
    static withCacheSize(t2) {
      return new gr(t2, gr.DEFAULT_COLLECTION_PERCENTILE, gr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
    }
  };
  gr.DEFAULT_COLLECTION_PERCENTILE = 10, gr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, gr.DEFAULT = new gr(41943040, gr.DEFAULT_COLLECTION_PERCENTILE, gr.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), gr.DISABLED = new gr(-1, 0, 0);
  var br = class {
    constructor(t2) {
      this.mn = t2;
    }
    next() {
      return this.mn += 2, this.mn;
    }
    static gn() {
      return new br(0);
    }
    static yn() {
      return new br(-1);
    }
  };
  async function Dr(t2) {
    if (t2.code !== G.FAILED_PRECONDITION || t2.message !== mi)
      throw t2;
    O2("LocalStore", "Unexpectedly lost primary lease");
  }
  var Fr = class {
    constructor() {
      this.changes = new Kn((t2) => t2.toString(), (t2, e) => t2.isEqual(e)), this.changesApplied = false;
    }
    addEntry(t2) {
      this.assertNotApplied(), this.changes.set(t2.key, t2);
    }
    removeEntry(t2, e) {
      this.assertNotApplied(), this.changes.set(t2, ne.newInvalidDocument(t2).setReadTime(e));
    }
    getEntry(t2, e) {
      this.assertNotApplied();
      const n = this.changes.get(e);
      return n !== void 0 ? yi.resolve(n) : this.getFromCache(t2, e);
    }
    getEntries(t2, e) {
      return this.getAllFromCache(t2, e);
    }
    apply(t2) {
      return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(t2);
    }
    assertNotApplied() {
    }
  };
  var Xr = class {
    constructor(t2, e, n) {
      this.ds = t2, this.Bs = e, this.indexManager = n;
    }
    Ls(t2, e) {
      return this.Bs.getAllMutationBatchesAffectingDocumentKey(t2, e).next((n) => this.Us(t2, e, n));
    }
    Us(t2, e, n) {
      return this.ds.getEntry(t2, e).next((t3) => {
        for (const e2 of n)
          e2.applyToLocalView(t3);
        return t3;
      });
    }
    qs(t2, e) {
      t2.forEach((t3, n) => {
        for (const t4 of e)
          t4.applyToLocalView(n);
      });
    }
    Ks(t2, e) {
      return this.ds.getEntries(t2, e).next((e2) => this.Gs(t2, e2).next(() => e2));
    }
    Gs(t2, e) {
      return this.Bs.getAllMutationBatchesAffectingDocumentKeys(t2, e).next((t3) => this.qs(e, t3));
    }
    Qs(t2, e, n) {
      return function(t3) {
        return xt.isDocumentKey(t3.path) && t3.collectionGroup === null && t3.filters.length === 0;
      }(e) ? this.js(t2, e.path) : We(e) ? this.Ws(t2, e, n) : this.zs(t2, e, n);
    }
    js(t2, e) {
      return this.Ls(t2, new xt(e)).next((t3) => {
        let e2 = Wn();
        return t3.isFoundDocument() && (e2 = e2.insert(t3.key, t3)), e2;
      });
    }
    Ws(t2, e, n) {
      const s = e.collectionGroup;
      let i = Wn();
      return this.indexManager.getCollectionParents(t2, s).next((r) => yi.forEach(r, (r2) => {
        const o = function(t3, e2) {
          return new Ue(e2, null, t3.explicitOrderBy.slice(), t3.filters.slice(), t3.limit, t3.limitType, t3.startAt, t3.endAt);
        }(e, r2.child(s));
        return this.zs(t2, o, n).next((t3) => {
          t3.forEach((t4, e2) => {
            i = i.insert(t4, e2);
          });
        });
      }).next(() => i));
    }
    zs(t2, e, n) {
      let s;
      return this.ds.getAllFromCollection(t2, e.path, n).next((n2) => (s = n2, this.Bs.getAllMutationBatchesAffectingQuery(t2, e))).next((t3) => {
        for (const e2 of t3)
          for (const t4 of e2.mutations) {
            const n2 = t4.key;
            let i = s.get(n2);
            i == null && (i = ne.newInvalidDocument(n2), s = s.insert(n2, i)), Vn(t4, i, e2.localWriteTime), i.isFoundDocument() || (s = s.remove(n2));
          }
      }).next(() => (s.forEach((t3, n2) => {
        tn(e, n2) || (s = s.remove(t3));
      }), s));
    }
  };
  var Zr = class {
    constructor(t2, e, n, s) {
      this.targetId = t2, this.fromCache = e, this.Hs = n, this.Js = s;
    }
    static Ys(t2, e) {
      let n = Yn(), s = Yn();
      for (const t3 of e.docChanges)
        switch (t3.type) {
          case 0:
            n = n.add(t3.doc.key);
            break;
          case 1:
            s = s.add(t3.doc.key);
        }
      return new Zr(t2, e.fromCache, n, s);
    }
  };
  var to = class {
    constructor() {
      this.Xs = false;
    }
    initialize(t2, e) {
      this.Zs = t2, this.indexManager = e, this.Xs = true;
    }
    Qs(t2, e, n, s) {
      return this.ti(t2, e).next((i) => i || this.ei(t2, e, s, n)).next((n2) => n2 || this.ni(t2, e));
    }
    ti(t2, e) {
      return yi.resolve(null);
    }
    ei(t2, e, n, s) {
      return Ge(e) || s.isEqual(ct.min()) ? this.ni(t2, e) : this.Zs.Ks(t2, n).next((i) => {
        const r = this.si(e, i);
        return this.ii(e, r, n, s) ? this.ni(t2, e) : (k2() <= LogLevel.DEBUG && O2("QueryEngine", "Re-using previous result from %s to execute query: %s", s.toString(), Ze(e)), this.ri(t2, r, e, ae(s, -1)));
      });
    }
    si(t2, e) {
      let n = new we(nn(t2));
      return e.forEach((e2, s) => {
        tn(t2, s) && (n = n.add(s));
      }), n;
    }
    ii(t2, e, n, s) {
      if (t2.limit === null)
        return false;
      if (n.size !== e.size)
        return true;
      const i = t2.limitType === "F" ? e.last() : e.first();
      return !!i && (i.hasPendingWrites || i.version.compareTo(s) > 0);
    }
    ni(t2, e) {
      return k2() <= LogLevel.DEBUG && O2("QueryEngine", "Using full collection scan to execute query:", Ze(e)), this.Zs.Qs(t2, e, he.min());
    }
    ri(t2, e, n, s) {
      return this.Zs.Qs(t2, n, s).next((t3) => (e.forEach((e2) => {
        t3 = t3.insert(e2.key, e2);
      }), t3));
    }
  };
  var eo = class {
    constructor(t2, e, n, s) {
      this.persistence = t2, this.oi = e, this.M = s, this.ui = new fe(rt), this.ai = new Kn((t3) => Ie(t3), Ee), this.ci = /* @__PURE__ */ new Map(), this.hi = t2.getRemoteDocumentCache(), this.fs = t2.getTargetCache(), this._s = t2.getBundleCache(), this.li(n);
    }
    li(t2) {
      this.indexManager = this.persistence.getIndexManager(t2), this.Bs = this.persistence.getMutationQueue(t2, this.indexManager), this.fi = new Xr(this.hi, this.Bs, this.indexManager), this.hi.setIndexManager(this.indexManager), this.oi.initialize(this.fi, this.indexManager);
    }
    collectGarbage(t2) {
      return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (e) => t2.collect(e, this.ui));
    }
  };
  function no(t2, e, n, s) {
    return new eo(t2, e, n, s);
  }
  async function so(t2, e) {
    const n = K2(t2);
    return await n.persistence.runTransaction("Handle user change", "readonly", (t3) => {
      let s;
      return n.Bs.getAllMutationBatches(t3).next((i) => (s = i, n.li(e), n.Bs.getAllMutationBatches(t3))).next((e2) => {
        const i = [], r = [];
        let o = Yn();
        for (const t4 of s) {
          i.push(t4.batchId);
          for (const e3 of t4.mutations)
            o = o.add(e3.key);
        }
        for (const t4 of e2) {
          r.push(t4.batchId);
          for (const e3 of t4.mutations)
            o = o.add(e3.key);
        }
        return n.fi.Ks(t3, o).next((t4) => ({
          di: t4,
          removedBatchIds: i,
          addedBatchIds: r
        }));
      });
    });
  }
  function ro(t2) {
    const e = K2(t2);
    return e.persistence.runTransaction("Get last remote snapshot version", "readonly", (t3) => e.fs.getLastRemoteSnapshotVersion(t3));
  }
  function oo(t2, e) {
    const n = K2(t2), s = e.snapshotVersion;
    let i = n.ui;
    return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (t3) => {
      const r = n.hi.newChangeBuffer({
        trackRemovals: true
      });
      i = n.ui;
      const o = [];
      e.targetChanges.forEach((r2, u2) => {
        const a = i.get(u2);
        if (!a)
          return;
        o.push(n.fs.removeMatchingKeys(t3, r2.removedDocuments, u2).next(() => n.fs.addMatchingKeys(t3, r2.addedDocuments, u2)));
        let c = a.withSequenceNumber(t3.currentSequenceNumber);
        e.targetMismatches.has(u2) ? c = c.withResumeToken(pt.EMPTY_BYTE_STRING, ct.min()).withLastLimboFreeSnapshotVersion(ct.min()) : r2.resumeToken.approximateByteSize() > 0 && (c = c.withResumeToken(r2.resumeToken, s)), i = i.insert(u2, c), function(t4, e2, n2) {
          if (t4.resumeToken.approximateByteSize() === 0)
            return true;
          if (e2.snapshotVersion.toMicroseconds() - t4.snapshotVersion.toMicroseconds() >= 3e8)
            return true;
          return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
        }(a, c, r2) && o.push(n.fs.updateTargetData(t3, c));
      });
      let u = Qn();
      if (e.documentUpdates.forEach((s2) => {
        e.resolvedLimboDocuments.has(s2) && o.push(n.persistence.referenceDelegate.updateLimboDocument(t3, s2));
      }), o.push(uo(t3, r, e.documentUpdates).next((t4) => {
        u = t4;
      })), !s.isEqual(ct.min())) {
        const e2 = n.fs.getLastRemoteSnapshotVersion(t3).next((e3) => n.fs.setTargetsMetadata(t3, t3.currentSequenceNumber, s));
        o.push(e2);
      }
      return yi.waitFor(o).next(() => r.apply(t3)).next(() => n.fi.Gs(t3, u)).next(() => u);
    }).then((t3) => (n.ui = i, t3));
  }
  function uo(t2, e, n) {
    let s = Yn();
    return n.forEach((t3) => s = s.add(t3)), e.getEntries(t2, s).next((t3) => {
      let s2 = Qn();
      return n.forEach((n2, i) => {
        const r = t3.get(n2);
        i.isNoDocument() && i.version.isEqual(ct.min()) ? (e.removeEntry(n2, i.readTime), s2 = s2.insert(n2, i)) : !r.isValidDocument() || i.version.compareTo(r.version) > 0 || i.version.compareTo(r.version) === 0 && r.hasPendingWrites ? (e.addEntry(i), s2 = s2.insert(n2, i)) : O2("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", r.version, " Watch version:", i.version);
      }), s2;
    });
  }
  function co(t2, e) {
    const n = K2(t2);
    return n.persistence.runTransaction("Allocate target", "readwrite", (t3) => {
      let s;
      return n.fs.getTargetData(t3, e).next((i) => i ? (s = i, yi.resolve(s)) : n.fs.allocateTargetId(t3).next((i2) => (s = new Ni(e, i2, 0, t3.currentSequenceNumber), n.fs.addTargetData(t3, s).next(() => s))));
    }).then((t3) => {
      const s = n.ui.get(t3.targetId);
      return (s === null || t3.snapshotVersion.compareTo(s.snapshotVersion) > 0) && (n.ui = n.ui.insert(t3.targetId, t3), n.ai.set(e, t3.targetId)), t3;
    });
  }
  async function ho(t2, e, n) {
    const s = K2(t2), i = s.ui.get(e), r = n ? "readwrite" : "readwrite-primary";
    try {
      n || await s.persistence.runTransaction("Release target", r, (t3) => s.persistence.referenceDelegate.removeTarget(t3, i));
    } catch (t3) {
      if (!Ai(t3))
        throw t3;
      O2("LocalStore", `Failed to update sequence numbers for target ${e}: ${t3}`);
    }
    s.ui = s.ui.remove(e), s.ai.delete(i.target);
  }
  function lo(t2, e, n) {
    const s = K2(t2);
    let i = ct.min(), r = Yn();
    return s.persistence.runTransaction("Execute query", "readonly", (t3) => function(t4, e2, n2) {
      const s2 = K2(t4), i2 = s2.ai.get(n2);
      return i2 !== void 0 ? yi.resolve(s2.ui.get(i2)) : s2.fs.getTargetData(e2, n2);
    }(s, t3, He(e)).next((e2) => {
      if (e2)
        return i = e2.lastLimboFreeSnapshotVersion, s.fs.getMatchingKeysForTargetId(t3, e2.targetId).next((t4) => {
          r = t4;
        });
    }).next(() => s.oi.Qs(t3, e, n ? i : ct.min(), n ? r : Yn())).next((t4) => (wo(s, en(e), t4), {
      documents: t4,
      _i: r
    })));
  }
  function wo(t2, e, n) {
    let s = ct.min();
    n.forEach((t3, e2) => {
      e2.readTime.compareTo(s) > 0 && (s = e2.readTime);
    }), t2.ci.set(e, s);
  }
  var yo = class {
    constructor(t2) {
      this.M = t2, this.yi = /* @__PURE__ */ new Map(), this.pi = /* @__PURE__ */ new Map();
    }
    getBundleMetadata(t2, e) {
      return yi.resolve(this.yi.get(e));
    }
    saveBundleMetadata(t2, e) {
      var n;
      return this.yi.set(e.id, {
        id: (n = e).id,
        version: n.version,
        createTime: ws(n.createTime)
      }), yi.resolve();
    }
    getNamedQuery(t2, e) {
      return yi.resolve(this.pi.get(e));
    }
    saveNamedQuery(t2, e) {
      return this.pi.set(e.name, function(t3) {
        return {
          name: t3.name,
          query: Ki(t3.bundledQuery),
          readTime: ws(t3.readTime)
        };
      }(e)), yi.resolve();
    }
  };
  var po = class {
    constructor() {
      this.overlays = new fe(xt.comparator), this.Ii = /* @__PURE__ */ new Map();
    }
    getOverlay(t2, e) {
      return yi.resolve(this.overlays.get(e));
    }
    saveOverlays(t2, e, n) {
      return n.forEach((n2, s) => {
        this.Xt(t2, e, s);
      }), yi.resolve();
    }
    removeOverlaysForBatchId(t2, e, n) {
      const s = this.Ii.get(n);
      return s !== void 0 && (s.forEach((t3) => this.overlays = this.overlays.remove(t3)), this.Ii.delete(n)), yi.resolve();
    }
    getOverlaysForCollection(t2, e, n) {
      const s = zn(), i = e.length + 1, r = new xt(e.child("")), o = this.overlays.getIteratorFrom(r);
      for (; o.hasNext(); ) {
        const t3 = o.getNext().value, r2 = t3.getKey();
        if (!e.isPrefixOf(r2.path))
          break;
        r2.path.length === i && (t3.largestBatchId > n && s.set(t3.getKey(), t3));
      }
      return yi.resolve(s);
    }
    getOverlaysForCollectionGroup(t2, e, n, s) {
      let i = new fe((t3, e2) => t3 - e2);
      const r = this.overlays.getIterator();
      for (; r.hasNext(); ) {
        const t3 = r.getNext().value;
        if (t3.getKey().getCollectionGroup() === e && t3.largestBatchId > n) {
          let e2 = i.get(t3.largestBatchId);
          e2 === null && (e2 = zn(), i = i.insert(t3.largestBatchId, e2)), e2.set(t3.getKey(), t3);
        }
      }
      const o = zn(), u = i.getIterator();
      for (; u.hasNext(); ) {
        if (u.getNext().value.forEach((t3, e2) => o.set(t3, e2)), o.size() >= s)
          break;
      }
      return yi.resolve(o);
    }
    Xt(t2, e, n) {
      if (n === null)
        return;
      const s = this.overlays.get(n.key);
      if (s !== null) {
        const t3 = this.Ii.get(s.largestBatchId).delete(n.key);
        this.Ii.set(s.largestBatchId, t3);
      }
      this.overlays = this.overlays.insert(n.key, new xi(e, n));
      let i = this.Ii.get(e);
      i === void 0 && (i = Yn(), this.Ii.set(e, i)), this.Ii.set(e, i.add(n.key));
    }
  };
  var Io = class {
    constructor() {
      this.Ti = new we(To.Ei), this.Ai = new we(To.Ri);
    }
    isEmpty() {
      return this.Ti.isEmpty();
    }
    addReference(t2, e) {
      const n = new To(t2, e);
      this.Ti = this.Ti.add(n), this.Ai = this.Ai.add(n);
    }
    bi(t2, e) {
      t2.forEach((t3) => this.addReference(t3, e));
    }
    removeReference(t2, e) {
      this.Pi(new To(t2, e));
    }
    Vi(t2, e) {
      t2.forEach((t3) => this.removeReference(t3, e));
    }
    vi(t2) {
      const e = new xt(new _t([])), n = new To(e, t2), s = new To(e, t2 + 1), i = [];
      return this.Ai.forEachInRange([n, s], (t3) => {
        this.Pi(t3), i.push(t3.key);
      }), i;
    }
    Si() {
      this.Ti.forEach((t2) => this.Pi(t2));
    }
    Pi(t2) {
      this.Ti = this.Ti.delete(t2), this.Ai = this.Ai.delete(t2);
    }
    Di(t2) {
      const e = new xt(new _t([])), n = new To(e, t2), s = new To(e, t2 + 1);
      let i = Yn();
      return this.Ai.forEachInRange([n, s], (t3) => {
        i = i.add(t3.key);
      }), i;
    }
    containsKey(t2) {
      const e = new To(t2, 0), n = this.Ti.firstAfterOrEqual(e);
      return n !== null && t2.isEqual(n.key);
    }
  };
  var To = class {
    constructor(t2, e) {
      this.key = t2, this.Ci = e;
    }
    static Ei(t2, e) {
      return xt.comparator(t2.key, e.key) || rt(t2.Ci, e.Ci);
    }
    static Ri(t2, e) {
      return rt(t2.Ci, e.Ci) || xt.comparator(t2.key, e.key);
    }
  };
  var Eo = class {
    constructor(t2, e) {
      this.indexManager = t2, this.referenceDelegate = e, this.Bs = [], this.xi = 1, this.Ni = new we(To.Ei);
    }
    checkEmpty(t2) {
      return yi.resolve(this.Bs.length === 0);
    }
    addMutationBatch(t2, e, n, s) {
      const i = this.xi;
      this.xi++, this.Bs.length > 0 && this.Bs[this.Bs.length - 1];
      const r = new Di(i, e, n, s);
      this.Bs.push(r);
      for (const e2 of s)
        this.Ni = this.Ni.add(new To(e2.key, i)), this.indexManager.addToCollectionParentIndex(t2, e2.key.path.popLast());
      return yi.resolve(r);
    }
    lookupMutationBatch(t2, e) {
      return yi.resolve(this.ki(e));
    }
    getNextMutationBatchAfterBatchId(t2, e) {
      const n = e + 1, s = this.Mi(n), i = s < 0 ? 0 : s;
      return yi.resolve(this.Bs.length > i ? this.Bs[i] : null);
    }
    getHighestUnacknowledgedBatchId() {
      return yi.resolve(this.Bs.length === 0 ? -1 : this.xi - 1);
    }
    getAllMutationBatches(t2) {
      return yi.resolve(this.Bs.slice());
    }
    getAllMutationBatchesAffectingDocumentKey(t2, e) {
      const n = new To(e, 0), s = new To(e, Number.POSITIVE_INFINITY), i = [];
      return this.Ni.forEachInRange([n, s], (t3) => {
        const e2 = this.ki(t3.Ci);
        i.push(e2);
      }), yi.resolve(i);
    }
    getAllMutationBatchesAffectingDocumentKeys(t2, e) {
      let n = new we(rt);
      return e.forEach((t3) => {
        const e2 = new To(t3, 0), s = new To(t3, Number.POSITIVE_INFINITY);
        this.Ni.forEachInRange([e2, s], (t4) => {
          n = n.add(t4.Ci);
        });
      }), yi.resolve(this.Oi(n));
    }
    getAllMutationBatchesAffectingQuery(t2, e) {
      const n = e.path, s = n.length + 1;
      let i = n;
      xt.isDocumentKey(i) || (i = i.child(""));
      const r = new To(new xt(i), 0);
      let o = new we(rt);
      return this.Ni.forEachWhile((t3) => {
        const e2 = t3.key.path;
        return !!n.isPrefixOf(e2) && (e2.length === s && (o = o.add(t3.Ci)), true);
      }, r), yi.resolve(this.Oi(o));
    }
    Oi(t2) {
      const e = [];
      return t2.forEach((t3) => {
        const n = this.ki(t3);
        n !== null && e.push(n);
      }), e;
    }
    removeMutationBatch(t2, e) {
      U2(this.Fi(e.batchId, "removed") === 0), this.Bs.shift();
      let n = this.Ni;
      return yi.forEach(e.mutations, (s) => {
        const i = new To(s.key, e.batchId);
        return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(t2, s.key);
      }).next(() => {
        this.Ni = n;
      });
    }
    _n(t2) {
    }
    containsKey(t2, e) {
      const n = new To(e, 0), s = this.Ni.firstAfterOrEqual(n);
      return yi.resolve(e.isEqual(s && s.key));
    }
    performConsistencyCheck(t2) {
      return this.Bs.length, yi.resolve();
    }
    Fi(t2, e) {
      return this.Mi(t2);
    }
    Mi(t2) {
      if (this.Bs.length === 0)
        return 0;
      return t2 - this.Bs[0].batchId;
    }
    ki(t2) {
      const e = this.Mi(t2);
      if (e < 0 || e >= this.Bs.length)
        return null;
      return this.Bs[e];
    }
  };
  var Ao = class {
    constructor(t2) {
      this.$i = t2, this.docs = new fe(xt.comparator), this.size = 0;
    }
    setIndexManager(t2) {
      this.indexManager = t2;
    }
    addEntry(t2, e) {
      const n = e.key, s = this.docs.get(n), i = s ? s.size : 0, r = this.$i(e);
      return this.docs = this.docs.insert(n, {
        document: e.mutableCopy(),
        size: r
      }), this.size += r - i, this.indexManager.addToCollectionParentIndex(t2, n.path.popLast());
    }
    removeEntry(t2) {
      const e = this.docs.get(t2);
      e && (this.docs = this.docs.remove(t2), this.size -= e.size);
    }
    getEntry(t2, e) {
      const n = this.docs.get(e);
      return yi.resolve(n ? n.document.mutableCopy() : ne.newInvalidDocument(e));
    }
    getEntries(t2, e) {
      let n = Qn();
      return e.forEach((t3) => {
        const e2 = this.docs.get(t3);
        n = n.insert(t3, e2 ? e2.document.mutableCopy() : ne.newInvalidDocument(t3));
      }), yi.resolve(n);
    }
    getAllFromCollection(t2, e, n) {
      let s = Qn();
      const i = new xt(e.child("")), r = this.docs.getIteratorFrom(i);
      for (; r.hasNext(); ) {
        const { key: t3, value: { document: i2 } } = r.getNext();
        if (!e.isPrefixOf(t3.path))
          break;
        t3.path.length > e.length + 1 || (le(ce(i2), n) <= 0 || (s = s.insert(i2.key, i2.mutableCopy())));
      }
      return yi.resolve(s);
    }
    getAllFromCollectionGroup(t2, e, n, s) {
      L2();
    }
    Bi(t2, e) {
      return yi.forEach(this.docs, (t3) => e(t3));
    }
    newChangeBuffer(t2) {
      return new Ro(this);
    }
    getSize(t2) {
      return yi.resolve(this.size);
    }
  };
  var Ro = class extends Fr {
    constructor(t2) {
      super(), this.Kn = t2;
    }
    applyChanges(t2) {
      const e = [];
      return this.changes.forEach((n, s) => {
        s.isValidDocument() ? e.push(this.Kn.addEntry(t2, s)) : this.Kn.removeEntry(n);
      }), yi.waitFor(e);
    }
    getFromCache(t2, e) {
      return this.Kn.getEntry(t2, e);
    }
    getAllFromCache(t2, e) {
      return this.Kn.getEntries(t2, e);
    }
  };
  var bo = class {
    constructor(t2) {
      this.persistence = t2, this.Li = new Kn((t3) => Ie(t3), Ee), this.lastRemoteSnapshotVersion = ct.min(), this.highestTargetId = 0, this.Ui = 0, this.qi = new Io(), this.targetCount = 0, this.Ki = br.gn();
    }
    forEachTarget(t2, e) {
      return this.Li.forEach((t3, n) => e(n)), yi.resolve();
    }
    getLastRemoteSnapshotVersion(t2) {
      return yi.resolve(this.lastRemoteSnapshotVersion);
    }
    getHighestSequenceNumber(t2) {
      return yi.resolve(this.Ui);
    }
    allocateTargetId(t2) {
      return this.highestTargetId = this.Ki.next(), yi.resolve(this.highestTargetId);
    }
    setTargetsMetadata(t2, e, n) {
      return n && (this.lastRemoteSnapshotVersion = n), e > this.Ui && (this.Ui = e), yi.resolve();
    }
    Tn(t2) {
      this.Li.set(t2.target, t2);
      const e = t2.targetId;
      e > this.highestTargetId && (this.Ki = new br(e), this.highestTargetId = e), t2.sequenceNumber > this.Ui && (this.Ui = t2.sequenceNumber);
    }
    addTargetData(t2, e) {
      return this.Tn(e), this.targetCount += 1, yi.resolve();
    }
    updateTargetData(t2, e) {
      return this.Tn(e), yi.resolve();
    }
    removeTargetData(t2, e) {
      return this.Li.delete(e.target), this.qi.vi(e.targetId), this.targetCount -= 1, yi.resolve();
    }
    removeTargets(t2, e, n) {
      let s = 0;
      const i = [];
      return this.Li.forEach((r, o) => {
        o.sequenceNumber <= e && n.get(o.targetId) === null && (this.Li.delete(r), i.push(this.removeMatchingKeysForTargetId(t2, o.targetId)), s++);
      }), yi.waitFor(i).next(() => s);
    }
    getTargetCount(t2) {
      return yi.resolve(this.targetCount);
    }
    getTargetData(t2, e) {
      const n = this.Li.get(e) || null;
      return yi.resolve(n);
    }
    addMatchingKeys(t2, e, n) {
      return this.qi.bi(e, n), yi.resolve();
    }
    removeMatchingKeys(t2, e, n) {
      this.qi.Vi(e, n);
      const s = this.persistence.referenceDelegate, i = [];
      return s && e.forEach((e2) => {
        i.push(s.markPotentiallyOrphaned(t2, e2));
      }), yi.waitFor(i);
    }
    removeMatchingKeysForTargetId(t2, e) {
      return this.qi.vi(e), yi.resolve();
    }
    getMatchingKeysForTargetId(t2, e) {
      const n = this.qi.Di(e);
      return yi.resolve(n);
    }
    containsKey(t2, e) {
      return yi.resolve(this.qi.containsKey(e));
    }
  };
  var Po = class {
    constructor(t2, e) {
      this.Gi = {}, this.overlays = {}, this.es = new nt(0), this.ns = false, this.ns = true, this.referenceDelegate = t2(this), this.fs = new bo(this);
      this.indexManager = new ar(), this.ds = function(t3) {
        return new Ao(t3);
      }((t3) => this.referenceDelegate.Qi(t3)), this.M = new ki(e), this._s = new yo(this.M);
    }
    start() {
      return Promise.resolve();
    }
    shutdown() {
      return this.ns = false, Promise.resolve();
    }
    get started() {
      return this.ns;
    }
    setDatabaseDeletedListener() {
    }
    setNetworkEnabled() {
    }
    getIndexManager(t2) {
      return this.indexManager;
    }
    getDocumentOverlayCache(t2) {
      let e = this.overlays[t2.toKey()];
      return e || (e = new po(), this.overlays[t2.toKey()] = e), e;
    }
    getMutationQueue(t2, e) {
      let n = this.Gi[t2.toKey()];
      return n || (n = new Eo(e, this.referenceDelegate), this.Gi[t2.toKey()] = n), n;
    }
    getTargetCache() {
      return this.fs;
    }
    getRemoteDocumentCache() {
      return this.ds;
    }
    getBundleCache() {
      return this._s;
    }
    runTransaction(t2, e, n) {
      O2("MemoryPersistence", "Starting transaction:", t2);
      const s = new Vo(this.es.next());
      return this.referenceDelegate.ji(), n(s).next((t3) => this.referenceDelegate.Wi(s).next(() => t3)).toPromise().then((t3) => (s.raiseOnCommittedEvent(), t3));
    }
    zi(t2, e) {
      return yi.or(Object.values(this.Gi).map((n) => () => n.containsKey(t2, e)));
    }
  };
  var Vo = class extends gi {
    constructor(t2) {
      super(), this.currentSequenceNumber = t2;
    }
  };
  var vo = class {
    constructor(t2) {
      this.persistence = t2, this.Hi = new Io(), this.Ji = null;
    }
    static Yi(t2) {
      return new vo(t2);
    }
    get Xi() {
      if (this.Ji)
        return this.Ji;
      throw L2();
    }
    addReference(t2, e, n) {
      return this.Hi.addReference(n, e), this.Xi.delete(n.toString()), yi.resolve();
    }
    removeReference(t2, e, n) {
      return this.Hi.removeReference(n, e), this.Xi.add(n.toString()), yi.resolve();
    }
    markPotentiallyOrphaned(t2, e) {
      return this.Xi.add(e.toString()), yi.resolve();
    }
    removeTarget(t2, e) {
      this.Hi.vi(e.targetId).forEach((t3) => this.Xi.add(t3.toString()));
      const n = this.persistence.getTargetCache();
      return n.getMatchingKeysForTargetId(t2, e.targetId).next((t3) => {
        t3.forEach((t4) => this.Xi.add(t4.toString()));
      }).next(() => n.removeTargetData(t2, e));
    }
    ji() {
      this.Ji = /* @__PURE__ */ new Set();
    }
    Wi(t2) {
      const e = this.persistence.getRemoteDocumentCache().newChangeBuffer();
      return yi.forEach(this.Xi, (n) => {
        const s = xt.fromPath(n);
        return this.Zi(t2, s).next((t3) => {
          t3 || e.removeEntry(s, ct.min());
        });
      }).next(() => (this.Ji = null, e.apply(t2)));
    }
    updateLimboDocument(t2, e) {
      return this.Zi(t2, e).next((t3) => {
        t3 ? this.Xi.delete(e.toString()) : this.Xi.add(e.toString());
      });
    }
    Qi(t2) {
      return 0;
    }
    Zi(t2, e) {
      return yi.or([() => yi.resolve(this.Hi.containsKey(e)), () => this.persistence.getTargetCache().containsKey(t2, e), () => this.persistence.zi(t2, e)]);
    }
  };
  var Oo = class {
    constructor() {
      this.activeTargetIds = Zn();
    }
    nr(t2) {
      this.activeTargetIds = this.activeTargetIds.add(t2);
    }
    sr(t2) {
      this.activeTargetIds = this.activeTargetIds.delete(t2);
    }
    er() {
      const t2 = {
        activeTargetIds: this.activeTargetIds.toArray(),
        updateTimeMs: Date.now()
      };
      return JSON.stringify(t2);
    }
  };
  var $o = class {
    constructor() {
      this.Ur = new Oo(), this.qr = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
    }
    addPendingMutation(t2) {
    }
    updateMutationState(t2, e, n) {
    }
    addLocalQueryTarget(t2) {
      return this.Ur.nr(t2), this.qr[t2] || "not-current";
    }
    updateQueryState(t2, e, n) {
      this.qr[t2] = e;
    }
    removeLocalQueryTarget(t2) {
      this.Ur.sr(t2);
    }
    isLocalQueryTarget(t2) {
      return this.Ur.activeTargetIds.has(t2);
    }
    clearQueryState(t2) {
      delete this.qr[t2];
    }
    getAllActiveQueryTargets() {
      return this.Ur.activeTargetIds;
    }
    isActiveQueryTarget(t2) {
      return this.Ur.activeTargetIds.has(t2);
    }
    start() {
      return this.Ur = new Oo(), Promise.resolve();
    }
    handleUserChange(t2, e, n) {
    }
    setOnlineState(t2) {
    }
    shutdown() {
    }
    writeSequenceNumber(t2) {
    }
    notifyBundleLoaded(t2) {
    }
  };
  var Bo = class {
    Kr(t2) {
    }
    shutdown() {
    }
  };
  var Lo = class {
    constructor() {
      this.Gr = () => this.Qr(), this.jr = () => this.Wr(), this.zr = [], this.Hr();
    }
    Kr(t2) {
      this.zr.push(t2);
    }
    shutdown() {
      window.removeEventListener("online", this.Gr), window.removeEventListener("offline", this.jr);
    }
    Hr() {
      window.addEventListener("online", this.Gr), window.addEventListener("offline", this.jr);
    }
    Qr() {
      O2("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
      for (const t2 of this.zr)
        t2(0);
    }
    Wr() {
      O2("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
      for (const t2 of this.zr)
        t2(1);
    }
    static vt() {
      return typeof window != "undefined" && window.addEventListener !== void 0 && window.removeEventListener !== void 0;
    }
  };
  var Uo = {
    BatchGetDocuments: "batchGet",
    Commit: "commit",
    RunQuery: "runQuery"
  };
  var qo = class {
    constructor(t2) {
      this.Jr = t2.Jr, this.Yr = t2.Yr;
    }
    Xr(t2) {
      this.Zr = t2;
    }
    eo(t2) {
      this.no = t2;
    }
    onMessage(t2) {
      this.so = t2;
    }
    close() {
      this.Yr();
    }
    send(t2) {
      this.Jr(t2);
    }
    io() {
      this.Zr();
    }
    ro(t2) {
      this.no(t2);
    }
    oo(t2) {
      this.so(t2);
    }
  };
  var Ko = class extends class {
    constructor(t2) {
      this.databaseInfo = t2, this.databaseId = t2.databaseId;
      const e = t2.ssl ? "https" : "http";
      this.uo = e + "://" + t2.host, this.ao = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
    }
    co(t2, e, n, s, i) {
      const r = this.ho(t2, e);
      O2("RestConnection", "Sending: ", r, n);
      const o = {};
      return this.lo(o, s, i), this.fo(t2, r, o, n).then((t3) => (O2("RestConnection", "Received: ", t3), t3), (e2) => {
        throw $("RestConnection", `${t2} failed with error: `, e2, "url: ", r, "request:", n), e2;
      });
    }
    _o(t2, e, n, s, i) {
      return this.co(t2, e, n, s, i);
    }
    lo(t2, e, n) {
      t2["X-Goog-Api-Client"] = "gl-js/ fire/" + x2, t2["Content-Type"] = "text/plain", this.databaseInfo.appId && (t2["X-Firebase-GMPID"] = this.databaseInfo.appId), e && e.headers.forEach((e2, n2) => t2[n2] = e2), n && n.headers.forEach((e2, n2) => t2[n2] = e2);
    }
    ho(t2, e) {
      const n = Uo[t2];
      return `${this.uo}/v1/${e}:${n}`;
    }
  } {
    constructor(t2) {
      super(t2), this.forceLongPolling = t2.forceLongPolling, this.autoDetectLongPolling = t2.autoDetectLongPolling, this.useFetchStreams = t2.useFetchStreams;
    }
    fo(t2, e, n, s) {
      return new Promise((i, r) => {
        const o = new XhrIo();
        o.listenOnce(EventType.COMPLETE, () => {
          try {
            switch (o.getLastErrorCode()) {
              case ErrorCode.NO_ERROR:
                const e2 = o.getResponseJson();
                O2("Connection", "XHR received:", JSON.stringify(e2)), i(e2);
                break;
              case ErrorCode.TIMEOUT:
                O2("Connection", 'RPC "' + t2 + '" timed out'), r(new Q2(G.DEADLINE_EXCEEDED, "Request time out"));
                break;
              case ErrorCode.HTTP_ERROR:
                const n2 = o.getStatus();
                if (O2("Connection", 'RPC "' + t2 + '" failed with status:', n2, "response text:", o.getResponseText()), n2 > 0) {
                  const t3 = o.getResponseJson().error;
                  if (t3 && t3.status && t3.message) {
                    const e3 = function(t4) {
                      const e4 = t4.toLowerCase().replace(/_/g, "-");
                      return Object.values(G).indexOf(e4) >= 0 ? e4 : G.UNKNOWN;
                    }(t3.status);
                    r(new Q2(e3, t3.message));
                  } else
                    r(new Q2(G.UNKNOWN, "Server responded with status " + o.getStatus()));
                } else
                  r(new Q2(G.UNAVAILABLE, "Connection failed."));
                break;
              default:
                L2();
            }
          } finally {
            O2("Connection", 'RPC "' + t2 + '" completed.');
          }
        });
        const u = JSON.stringify(s);
        o.send(e, "POST", u, n, 15);
      });
    }
    wo(t2, e, n) {
      const s = [this.uo, "/", "google.firestore.v1.Firestore", "/", t2, "/channel"], i = createWebChannelTransport(), r = getStatEventTarget(), o = {
        httpSessionIdParam: "gsessionid",
        initMessageHeaders: {},
        messageUrlParams: {
          database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
        },
        sendRawJson: true,
        supportsCrossDomainXhr: true,
        internalChannelParams: {
          forwardChannelRequestTimeoutMs: 6e5
        },
        forceLongPolling: this.forceLongPolling,
        detectBufferingProxy: this.autoDetectLongPolling
      };
      this.useFetchStreams && (o.xmlHttpFactory = new FetchXmlHttpFactory({})), this.lo(o.initMessageHeaders, e, n), isMobileCordova() || isReactNative() || isElectron() || isIE() || isUWP() || isBrowserExtension() || (o.httpHeadersOverwriteParam = "$httpHeaders");
      const u = s.join("");
      O2("Connection", "Creating WebChannel: " + u, o);
      const a = i.createWebChannel(u, o);
      let c = false, h = false;
      const l2 = new qo({
        Jr: (t3) => {
          h ? O2("Connection", "Not sending because WebChannel is closed:", t3) : (c || (O2("Connection", "Opening WebChannel transport."), a.open(), c = true), O2("Connection", "WebChannel sending:", t3), a.send(t3));
        },
        Yr: () => a.close()
      }), y2 = (t3, e2, n2) => {
        t3.listen(e2, (t4) => {
          try {
            n2(t4);
          } catch (t5) {
            setTimeout(() => {
              throw t5;
            }, 0);
          }
        });
      };
      return y2(a, WebChannel.EventType.OPEN, () => {
        h || O2("Connection", "WebChannel transport opened.");
      }), y2(a, WebChannel.EventType.CLOSE, () => {
        h || (h = true, O2("Connection", "WebChannel transport closed"), l2.ro());
      }), y2(a, WebChannel.EventType.ERROR, (t3) => {
        h || (h = true, $("Connection", "WebChannel transport errored:", t3), l2.ro(new Q2(G.UNAVAILABLE, "The operation could not be completed")));
      }), y2(a, WebChannel.EventType.MESSAGE, (t3) => {
        var e2;
        if (!h) {
          const n2 = t3.data[0];
          U2(!!n2);
          const s2 = n2, i2 = s2.error || ((e2 = s2[0]) === null || e2 === void 0 ? void 0 : e2.error);
          if (i2) {
            O2("Connection", "WebChannel received error:", i2);
            const t4 = i2.status;
            let e3 = function(t5) {
              const e4 = Bn[t5];
              if (e4 !== void 0)
                return qn(e4);
            }(t4), n3 = i2.message;
            e3 === void 0 && (e3 = G.INTERNAL, n3 = "Unknown error status: " + t4 + " with message " + i2.message), h = true, l2.ro(new Q2(e3, n3)), a.close();
          } else
            O2("Connection", "WebChannel received:", n2), l2.oo(n2);
        }
      }), y2(r, Event.STAT_EVENT, (t3) => {
        t3.stat === Stat.PROXY ? O2("Connection", "Detected buffering proxy") : t3.stat === Stat.NOPROXY && O2("Connection", "Detected no buffering proxy");
      }), setTimeout(() => {
        l2.io();
      }, 0), l2;
    }
  };
  function Qo() {
    return typeof document != "undefined" ? document : null;
  }
  function jo(t2) {
    return new ls(t2, true);
  }
  var Wo = class {
    constructor(t2, e, n = 1e3, s = 1.5, i = 6e4) {
      this.Yn = t2, this.timerId = e, this.mo = n, this.yo = s, this.po = i, this.Io = 0, this.To = null, this.Eo = Date.now(), this.reset();
    }
    reset() {
      this.Io = 0;
    }
    Ao() {
      this.Io = this.po;
    }
    Ro(t2) {
      this.cancel();
      const e = Math.floor(this.Io + this.bo()), n = Math.max(0, Date.now() - this.Eo), s = Math.max(0, e - n);
      s > 0 && O2("ExponentialBackoff", `Backing off for ${s} ms (base delay: ${this.Io} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`), this.To = this.Yn.enqueueAfterDelay(this.timerId, s, () => (this.Eo = Date.now(), t2())), this.Io *= this.yo, this.Io < this.mo && (this.Io = this.mo), this.Io > this.po && (this.Io = this.po);
    }
    Po() {
      this.To !== null && (this.To.skipDelay(), this.To = null);
    }
    cancel() {
      this.To !== null && (this.To.cancel(), this.To = null);
    }
    bo() {
      return (Math.random() - 0.5) * this.Io;
    }
  };
  var zo = class {
    constructor(t2, e, n, s, i, r, o, u) {
      this.Yn = t2, this.Vo = n, this.vo = s, this.So = i, this.authCredentialsProvider = r, this.appCheckCredentialsProvider = o, this.listener = u, this.state = 0, this.Do = 0, this.Co = null, this.xo = null, this.stream = null, this.No = new Wo(t2, e);
    }
    ko() {
      return this.state === 1 || this.state === 5 || this.Mo();
    }
    Mo() {
      return this.state === 2 || this.state === 3;
    }
    start() {
      this.state !== 4 ? this.auth() : this.Oo();
    }
    async stop() {
      this.ko() && await this.close(0);
    }
    Fo() {
      this.state = 0, this.No.reset();
    }
    $o() {
      this.Mo() && this.Co === null && (this.Co = this.Yn.enqueueAfterDelay(this.Vo, 6e4, () => this.Bo()));
    }
    Lo(t2) {
      this.Uo(), this.stream.send(t2);
    }
    async Bo() {
      if (this.Mo())
        return this.close(0);
    }
    Uo() {
      this.Co && (this.Co.cancel(), this.Co = null);
    }
    qo() {
      this.xo && (this.xo.cancel(), this.xo = null);
    }
    async close(t2, e) {
      this.Uo(), this.qo(), this.No.cancel(), this.Do++, t2 !== 4 ? this.No.reset() : e && e.code === G.RESOURCE_EXHAUSTED ? (F2(e.toString()), F2("Using maximum backoff delay to prevent overloading the backend."), this.No.Ao()) : e && e.code === G.UNAUTHENTICATED && this.state !== 3 && (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), this.stream !== null && (this.Ko(), this.stream.close(), this.stream = null), this.state = t2, await this.listener.eo(e);
    }
    Ko() {
    }
    auth() {
      this.state = 1;
      const t2 = this.Go(this.Do), e = this.Do;
      Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([t3, n]) => {
        this.Do === e && this.Qo(t3, n);
      }, (e2) => {
        t2(() => {
          const t3 = new Q2(G.UNKNOWN, "Fetching auth token failed: " + e2.message);
          return this.jo(t3);
        });
      });
    }
    Qo(t2, e) {
      const n = this.Go(this.Do);
      this.stream = this.Wo(t2, e), this.stream.Xr(() => {
        n(() => (this.state = 2, this.xo = this.Yn.enqueueAfterDelay(this.vo, 1e4, () => (this.Mo() && (this.state = 3), Promise.resolve())), this.listener.Xr()));
      }), this.stream.eo((t3) => {
        n(() => this.jo(t3));
      }), this.stream.onMessage((t3) => {
        n(() => this.onMessage(t3));
      });
    }
    Oo() {
      this.state = 5, this.No.Ro(async () => {
        this.state = 0, this.start();
      });
    }
    jo(t2) {
      return O2("PersistentStream", `close with error: ${t2}`), this.stream = null, this.close(4, t2);
    }
    Go(t2) {
      return (e) => {
        this.Yn.enqueueAndForget(() => this.Do === t2 ? e() : (O2("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
      };
    }
  };
  var Ho = class extends zo {
    constructor(t2, e, n, s, i, r) {
      super(t2, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", e, n, s, r), this.M = i;
    }
    Wo(t2, e) {
      return this.So.wo("Listen", t2, e);
    }
    onMessage(t2) {
      this.No.reset();
      const e = Vs(this.M, t2), n = function(t3) {
        if (!("targetChange" in t3))
          return ct.min();
        const e2 = t3.targetChange;
        return e2.targetIds && e2.targetIds.length ? ct.min() : e2.readTime ? ws(e2.readTime) : ct.min();
      }(t2);
      return this.listener.zo(e, n);
    }
    Ho(t2) {
      const e = {};
      e.database = Es(this.M), e.addTarget = function(t3, e2) {
        let n2;
        const s = e2.target;
        return n2 = Ae(s) ? {
          documents: Cs(t3, s)
        } : {
          query: xs(t3, s)
        }, n2.targetId = e2.targetId, e2.resumeToken.approximateByteSize() > 0 ? n2.resumeToken = ds(t3, e2.resumeToken) : e2.snapshotVersion.compareTo(ct.min()) > 0 && (n2.readTime = fs(t3, e2.snapshotVersion.toTimestamp())), n2;
      }(this.M, t2);
      const n = ks(this.M, t2);
      n && (e.labels = n), this.Lo(e);
    }
    Jo(t2) {
      const e = {};
      e.database = Es(this.M), e.removeTarget = t2, this.Lo(e);
    }
  };
  var Yo = class extends class {
  } {
    constructor(t2, e, n, s) {
      super(), this.authCredentials = t2, this.appCheckCredentials = e, this.So = n, this.M = s, this.su = false;
    }
    iu() {
      if (this.su)
        throw new Q2(G.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    co(t2, e, n) {
      return this.iu(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, i]) => this.So.co(t2, e, n, s, i)).catch((t3) => {
        throw t3.name === "FirebaseError" ? (t3.code === G.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t3) : new Q2(G.UNKNOWN, t3.toString());
      });
    }
    _o(t2, e, n) {
      return this.iu(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, i]) => this.So._o(t2, e, n, s, i)).catch((t3) => {
        throw t3.name === "FirebaseError" ? (t3.code === G.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t3) : new Q2(G.UNKNOWN, t3.toString());
      });
    }
    terminate() {
      this.su = true;
    }
  };
  var Xo = class {
    constructor(t2, e) {
      this.asyncQueue = t2, this.onlineStateHandler = e, this.state = "Unknown", this.ru = 0, this.ou = null, this.uu = true;
    }
    au() {
      this.ru === 0 && (this.cu("Unknown"), this.ou = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.ou = null, this.hu("Backend didn't respond within 10 seconds."), this.cu("Offline"), Promise.resolve())));
    }
    lu(t2) {
      this.state === "Online" ? this.cu("Unknown") : (this.ru++, this.ru >= 1 && (this.fu(), this.hu(`Connection failed 1 times. Most recent error: ${t2.toString()}`), this.cu("Offline")));
    }
    set(t2) {
      this.fu(), this.ru = 0, t2 === "Online" && (this.uu = false), this.cu(t2);
    }
    cu(t2) {
      t2 !== this.state && (this.state = t2, this.onlineStateHandler(t2));
    }
    hu(t2) {
      const e = `Could not reach Cloud Firestore backend. ${t2}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
      this.uu ? (F2(e), this.uu = false) : O2("OnlineStateTracker", e);
    }
    fu() {
      this.ou !== null && (this.ou.cancel(), this.ou = null);
    }
  };
  var Zo = class {
    constructor(t2, e, n, s, i) {
      this.localStore = t2, this.datastore = e, this.asyncQueue = n, this.remoteSyncer = {}, this.du = [], this._u = /* @__PURE__ */ new Map(), this.wu = /* @__PURE__ */ new Set(), this.mu = [], this.gu = i, this.gu.Kr((t3) => {
        n.enqueueAndForget(async () => {
          au(this) && (O2("RemoteStore", "Restarting streams for network reachability change."), await async function(t4) {
            const e2 = K2(t4);
            e2.wu.add(4), await eu(e2), e2.yu.set("Unknown"), e2.wu.delete(4), await tu(e2);
          }(this));
        });
      }), this.yu = new Xo(n, s);
    }
  };
  async function tu(t2) {
    if (au(t2))
      for (const e of t2.mu)
        await e(true);
  }
  async function eu(t2) {
    for (const e of t2.mu)
      await e(false);
  }
  function nu(t2, e) {
    const n = K2(t2);
    n._u.has(e.targetId) || (n._u.set(e.targetId, e), uu(n) ? ou(n) : Pu(n).Mo() && iu(n, e));
  }
  function su(t2, e) {
    const n = K2(t2), s = Pu(n);
    n._u.delete(e), s.Mo() && ru(n, e), n._u.size === 0 && (s.Mo() ? s.$o() : au(n) && n.yu.set("Unknown"));
  }
  function iu(t2, e) {
    t2.pu.Z(e.targetId), Pu(t2).Ho(e);
  }
  function ru(t2, e) {
    t2.pu.Z(e), Pu(t2).Jo(e);
  }
  function ou(t2) {
    t2.pu = new os({
      getRemoteKeysForTarget: (e) => t2.remoteSyncer.getRemoteKeysForTarget(e),
      Et: (e) => t2._u.get(e) || null
    }), Pu(t2).start(), t2.yu.au();
  }
  function uu(t2) {
    return au(t2) && !Pu(t2).ko() && t2._u.size > 0;
  }
  function au(t2) {
    return K2(t2).wu.size === 0;
  }
  function cu(t2) {
    t2.pu = void 0;
  }
  async function hu(t2) {
    t2._u.forEach((e, n) => {
      iu(t2, e);
    });
  }
  async function lu(t2, e) {
    cu(t2), uu(t2) ? (t2.yu.lu(e), ou(t2)) : t2.yu.set("Unknown");
  }
  async function fu(t2, e, n) {
    if (t2.yu.set("Online"), e instanceof is && e.state === 2 && e.cause)
      try {
        await async function(t3, e2) {
          const n2 = e2.cause;
          for (const s of e2.targetIds)
            t3._u.has(s) && (await t3.remoteSyncer.rejectListen(s, n2), t3._u.delete(s), t3.pu.removeTarget(s));
        }(t2, e);
      } catch (n2) {
        O2("RemoteStore", "Failed to remove targets %s: %s ", e.targetIds.join(","), n2), await du(t2, n2);
      }
    else if (e instanceof ns ? t2.pu.ut(e) : e instanceof ss ? t2.pu._t(e) : t2.pu.ht(e), !n.isEqual(ct.min()))
      try {
        const e2 = await ro(t2.localStore);
        n.compareTo(e2) >= 0 && await function(t3, e3) {
          const n2 = t3.pu.yt(e3);
          return n2.targetChanges.forEach((n3, s) => {
            if (n3.resumeToken.approximateByteSize() > 0) {
              const i = t3._u.get(s);
              i && t3._u.set(s, i.withResumeToken(n3.resumeToken, e3));
            }
          }), n2.targetMismatches.forEach((e4) => {
            const n3 = t3._u.get(e4);
            if (!n3)
              return;
            t3._u.set(e4, n3.withResumeToken(pt.EMPTY_BYTE_STRING, n3.snapshotVersion)), ru(t3, e4);
            const s = new Ni(n3.target, e4, 1, n3.sequenceNumber);
            iu(t3, s);
          }), t3.remoteSyncer.applyRemoteEvent(n2);
        }(t2, n);
      } catch (e2) {
        O2("RemoteStore", "Failed to raise snapshot:", e2), await du(t2, e2);
      }
  }
  async function du(t2, e, n) {
    if (!Ai(e))
      throw e;
    t2.wu.add(1), await eu(t2), t2.yu.set("Offline"), n || (n = () => ro(t2.localStore)), t2.asyncQueue.enqueueRetryable(async () => {
      O2("RemoteStore", "Retrying IndexedDB access"), await n(), t2.wu.delete(1), await tu(t2);
    });
  }
  async function Ru(t2, e) {
    const n = K2(t2);
    n.asyncQueue.verifyOperationInProgress(), O2("RemoteStore", "RemoteStore received new credentials");
    const s = au(n);
    n.wu.add(3), await eu(n), s && n.yu.set("Unknown"), await n.remoteSyncer.handleCredentialChange(e), n.wu.delete(3), await tu(n);
  }
  async function bu(t2, e) {
    const n = K2(t2);
    e ? (n.wu.delete(2), await tu(n)) : e || (n.wu.add(2), await eu(n), n.yu.set("Unknown"));
  }
  function Pu(t2) {
    return t2.Iu || (t2.Iu = function(t3, e, n) {
      const s = K2(t3);
      return s.iu(), new Ho(e, s.So, s.authCredentials, s.appCheckCredentials, s.M, n);
    }(t2.datastore, t2.asyncQueue, {
      Xr: hu.bind(null, t2),
      eo: lu.bind(null, t2),
      zo: fu.bind(null, t2)
    }), t2.mu.push(async (e) => {
      e ? (t2.Iu.Fo(), uu(t2) ? ou(t2) : t2.yu.set("Unknown")) : (await t2.Iu.stop(), cu(t2));
    })), t2.Iu;
  }
  var vu = class {
    constructor(t2, e, n, s, i) {
      this.asyncQueue = t2, this.timerId = e, this.targetTimeMs = n, this.op = s, this.removalCallback = i, this.deferred = new j(), this.then = this.deferred.promise.then.bind(this.deferred.promise), this.deferred.promise.catch((t3) => {
      });
    }
    static createAndSchedule(t2, e, n, s, i) {
      const r = Date.now() + n, o = new vu(t2, e, r, s, i);
      return o.start(n), o;
    }
    start(t2) {
      this.timerHandle = setTimeout(() => this.handleDelayElapsed(), t2);
    }
    skipDelay() {
      return this.handleDelayElapsed();
    }
    cancel(t2) {
      this.timerHandle !== null && (this.clearTimeout(), this.deferred.reject(new Q2(G.CANCELLED, "Operation cancelled" + (t2 ? ": " + t2 : ""))));
    }
    handleDelayElapsed() {
      this.asyncQueue.enqueueAndForget(() => this.timerHandle !== null ? (this.clearTimeout(), this.op().then((t2) => this.deferred.resolve(t2))) : Promise.resolve());
    }
    clearTimeout() {
      this.timerHandle !== null && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
    }
  };
  function Su(t2, e) {
    if (F2("AsyncQueue", `${e}: ${t2}`), Ai(t2))
      return new Q2(G.UNAVAILABLE, `${e}: ${t2}`);
    throw t2;
  }
  var Du = class {
    constructor(t2) {
      this.comparator = t2 ? (e, n) => t2(e, n) || xt.comparator(e.key, n.key) : (t3, e) => xt.comparator(t3.key, e.key), this.keyedMap = Wn(), this.sortedSet = new fe(this.comparator);
    }
    static emptySet(t2) {
      return new Du(t2.comparator);
    }
    has(t2) {
      return this.keyedMap.get(t2) != null;
    }
    get(t2) {
      return this.keyedMap.get(t2);
    }
    first() {
      return this.sortedSet.minKey();
    }
    last() {
      return this.sortedSet.maxKey();
    }
    isEmpty() {
      return this.sortedSet.isEmpty();
    }
    indexOf(t2) {
      const e = this.keyedMap.get(t2);
      return e ? this.sortedSet.indexOf(e) : -1;
    }
    get size() {
      return this.sortedSet.size;
    }
    forEach(t2) {
      this.sortedSet.inorderTraversal((e, n) => (t2(e), false));
    }
    add(t2) {
      const e = this.delete(t2.key);
      return e.copy(e.keyedMap.insert(t2.key, t2), e.sortedSet.insert(t2, null));
    }
    delete(t2) {
      const e = this.get(t2);
      return e ? this.copy(this.keyedMap.remove(t2), this.sortedSet.remove(e)) : this;
    }
    isEqual(t2) {
      if (!(t2 instanceof Du))
        return false;
      if (this.size !== t2.size)
        return false;
      const e = this.sortedSet.getIterator(), n = t2.sortedSet.getIterator();
      for (; e.hasNext(); ) {
        const t3 = e.getNext().key, s = n.getNext().key;
        if (!t3.isEqual(s))
          return false;
      }
      return true;
    }
    toString() {
      const t2 = [];
      return this.forEach((e) => {
        t2.push(e.toString());
      }), t2.length === 0 ? "DocumentSet ()" : "DocumentSet (\n  " + t2.join("  \n") + "\n)";
    }
    copy(t2, e) {
      const n = new Du();
      return n.comparator = this.comparator, n.keyedMap = t2, n.sortedSet = e, n;
    }
  };
  var Cu = class {
    constructor() {
      this.Eu = new fe(xt.comparator);
    }
    track(t2) {
      const e = t2.doc.key, n = this.Eu.get(e);
      n ? t2.type !== 0 && n.type === 3 ? this.Eu = this.Eu.insert(e, t2) : t2.type === 3 && n.type !== 1 ? this.Eu = this.Eu.insert(e, {
        type: n.type,
        doc: t2.doc
      }) : t2.type === 2 && n.type === 2 ? this.Eu = this.Eu.insert(e, {
        type: 2,
        doc: t2.doc
      }) : t2.type === 2 && n.type === 0 ? this.Eu = this.Eu.insert(e, {
        type: 0,
        doc: t2.doc
      }) : t2.type === 1 && n.type === 0 ? this.Eu = this.Eu.remove(e) : t2.type === 1 && n.type === 2 ? this.Eu = this.Eu.insert(e, {
        type: 1,
        doc: n.doc
      }) : t2.type === 0 && n.type === 1 ? this.Eu = this.Eu.insert(e, {
        type: 2,
        doc: t2.doc
      }) : L2() : this.Eu = this.Eu.insert(e, t2);
    }
    Au() {
      const t2 = [];
      return this.Eu.inorderTraversal((e, n) => {
        t2.push(n);
      }), t2;
    }
  };
  var xu = class {
    constructor(t2, e, n, s, i, r, o, u) {
      this.query = t2, this.docs = e, this.oldDocs = n, this.docChanges = s, this.mutatedKeys = i, this.fromCache = r, this.syncStateChanged = o, this.excludesMetadataChanges = u;
    }
    static fromInitialDocuments(t2, e, n, s) {
      const i = [];
      return e.forEach((t3) => {
        i.push({
          type: 0,
          doc: t3
        });
      }), new xu(t2, e, Du.emptySet(e), i, n, s, true, false);
    }
    get hasPendingWrites() {
      return !this.mutatedKeys.isEmpty();
    }
    isEqual(t2) {
      if (!(this.fromCache === t2.fromCache && this.syncStateChanged === t2.syncStateChanged && this.mutatedKeys.isEqual(t2.mutatedKeys) && Ye(this.query, t2.query) && this.docs.isEqual(t2.docs) && this.oldDocs.isEqual(t2.oldDocs)))
        return false;
      const e = this.docChanges, n = t2.docChanges;
      if (e.length !== n.length)
        return false;
      for (let t3 = 0; t3 < e.length; t3++)
        if (e[t3].type !== n[t3].type || !e[t3].doc.isEqual(n[t3].doc))
          return false;
      return true;
    }
  };
  var Nu = class {
    constructor() {
      this.Ru = void 0, this.listeners = [];
    }
  };
  var ku = class {
    constructor() {
      this.queries = new Kn((t2) => Xe(t2), Ye), this.onlineState = "Unknown", this.bu = /* @__PURE__ */ new Set();
    }
  };
  async function Mu(t2, e) {
    const n = K2(t2), s = e.query;
    let i = false, r = n.queries.get(s);
    if (r || (i = true, r = new Nu()), i)
      try {
        r.Ru = await n.onListen(s);
      } catch (t3) {
        const n2 = Su(t3, `Initialization of query '${Ze(e.query)}' failed`);
        return void e.onError(n2);
      }
    if (n.queries.set(s, r), r.listeners.push(e), e.Pu(n.onlineState), r.Ru) {
      e.Vu(r.Ru) && Bu(n);
    }
  }
  async function Ou(t2, e) {
    const n = K2(t2), s = e.query;
    let i = false;
    const r = n.queries.get(s);
    if (r) {
      const t3 = r.listeners.indexOf(e);
      t3 >= 0 && (r.listeners.splice(t3, 1), i = r.listeners.length === 0);
    }
    if (i)
      return n.queries.delete(s), n.onUnlisten(s);
  }
  function Fu(t2, e) {
    const n = K2(t2);
    let s = false;
    for (const t3 of e) {
      const e2 = t3.query, i = n.queries.get(e2);
      if (i) {
        for (const e3 of i.listeners)
          e3.Vu(t3) && (s = true);
        i.Ru = t3;
      }
    }
    s && Bu(n);
  }
  function $u(t2, e, n) {
    const s = K2(t2), i = s.queries.get(e);
    if (i)
      for (const t3 of i.listeners)
        t3.onError(n);
    s.queries.delete(e);
  }
  function Bu(t2) {
    t2.bu.forEach((t3) => {
      t3.next();
    });
  }
  var Lu = class {
    constructor(t2, e, n) {
      this.query = t2, this.vu = e, this.Su = false, this.Du = null, this.onlineState = "Unknown", this.options = n || {};
    }
    Vu(t2) {
      if (!this.options.includeMetadataChanges) {
        const e2 = [];
        for (const n of t2.docChanges)
          n.type !== 3 && e2.push(n);
        t2 = new xu(t2.query, t2.docs, t2.oldDocs, e2, t2.mutatedKeys, t2.fromCache, t2.syncStateChanged, true);
      }
      let e = false;
      return this.Su ? this.Cu(t2) && (this.vu.next(t2), e = true) : this.xu(t2, this.onlineState) && (this.Nu(t2), e = true), this.Du = t2, e;
    }
    onError(t2) {
      this.vu.error(t2);
    }
    Pu(t2) {
      this.onlineState = t2;
      let e = false;
      return this.Du && !this.Su && this.xu(this.Du, t2) && (this.Nu(this.Du), e = true), e;
    }
    xu(t2, e) {
      if (!t2.fromCache)
        return true;
      const n = e !== "Offline";
      return (!this.options.ku || !n) && (!t2.docs.isEmpty() || e === "Offline");
    }
    Cu(t2) {
      if (t2.docChanges.length > 0)
        return true;
      const e = this.Du && this.Du.hasPendingWrites !== t2.hasPendingWrites;
      return !(!t2.syncStateChanged && !e) && this.options.includeMetadataChanges === true;
    }
    Nu(t2) {
      t2 = xu.fromInitialDocuments(t2.query, t2.docs, t2.mutatedKeys, t2.fromCache), this.Su = true, this.vu.next(t2);
    }
  };
  var Qu = class {
    constructor(t2) {
      this.key = t2;
    }
  };
  var ju = class {
    constructor(t2) {
      this.key = t2;
    }
  };
  var Wu = class {
    constructor(t2, e) {
      this.query = t2, this.Uu = e, this.qu = null, this.current = false, this.Ku = Yn(), this.mutatedKeys = Yn(), this.Gu = nn(t2), this.Qu = new Du(this.Gu);
    }
    get ju() {
      return this.Uu;
    }
    Wu(t2, e) {
      const n = e ? e.zu : new Cu(), s = e ? e.Qu : this.Qu;
      let i = e ? e.mutatedKeys : this.mutatedKeys, r = s, o = false;
      const u = this.query.limitType === "F" && s.size === this.query.limit ? s.last() : null, a = this.query.limitType === "L" && s.size === this.query.limit ? s.first() : null;
      if (t2.inorderTraversal((t3, e2) => {
        const c = s.get(t3), h = tn(this.query, e2) ? e2 : null, l2 = !!c && this.mutatedKeys.has(c.key), f = !!h && (h.hasLocalMutations || this.mutatedKeys.has(h.key) && h.hasCommittedMutations);
        let d = false;
        if (c && h) {
          c.data.isEqual(h.data) ? l2 !== f && (n.track({
            type: 3,
            doc: h
          }), d = true) : this.Hu(c, h) || (n.track({
            type: 2,
            doc: h
          }), d = true, (u && this.Gu(h, u) > 0 || a && this.Gu(h, a) < 0) && (o = true));
        } else
          !c && h ? (n.track({
            type: 0,
            doc: h
          }), d = true) : c && !h && (n.track({
            type: 1,
            doc: c
          }), d = true, (u || a) && (o = true));
        d && (h ? (r = r.add(h), i = f ? i.add(t3) : i.delete(t3)) : (r = r.delete(t3), i = i.delete(t3)));
      }), this.query.limit !== null)
        for (; r.size > this.query.limit; ) {
          const t3 = this.query.limitType === "F" ? r.last() : r.first();
          r = r.delete(t3.key), i = i.delete(t3.key), n.track({
            type: 1,
            doc: t3
          });
        }
      return {
        Qu: r,
        zu: n,
        ii: o,
        mutatedKeys: i
      };
    }
    Hu(t2, e) {
      return t2.hasLocalMutations && e.hasCommittedMutations && !e.hasLocalMutations;
    }
    applyChanges(t2, e, n) {
      const s = this.Qu;
      this.Qu = t2.Qu, this.mutatedKeys = t2.mutatedKeys;
      const i = t2.zu.Au();
      i.sort((t3, e2) => function(t4, e3) {
        const n2 = (t5) => {
          switch (t5) {
            case 0:
              return 1;
            case 2:
            case 3:
              return 2;
            case 1:
              return 0;
            default:
              return L2();
          }
        };
        return n2(t4) - n2(e3);
      }(t3.type, e2.type) || this.Gu(t3.doc, e2.doc)), this.Ju(n);
      const r = e ? this.Yu() : [], o = this.Ku.size === 0 && this.current ? 1 : 0, u = o !== this.qu;
      if (this.qu = o, i.length !== 0 || u) {
        return {
          snapshot: new xu(this.query, t2.Qu, s, i, t2.mutatedKeys, o === 0, u, false),
          Xu: r
        };
      }
      return {
        Xu: r
      };
    }
    Pu(t2) {
      return this.current && t2 === "Offline" ? (this.current = false, this.applyChanges({
        Qu: this.Qu,
        zu: new Cu(),
        mutatedKeys: this.mutatedKeys,
        ii: false
      }, false)) : {
        Xu: []
      };
    }
    Zu(t2) {
      return !this.Uu.has(t2) && (!!this.Qu.has(t2) && !this.Qu.get(t2).hasLocalMutations);
    }
    Ju(t2) {
      t2 && (t2.addedDocuments.forEach((t3) => this.Uu = this.Uu.add(t3)), t2.modifiedDocuments.forEach((t3) => {
      }), t2.removedDocuments.forEach((t3) => this.Uu = this.Uu.delete(t3)), this.current = t2.current);
    }
    Yu() {
      if (!this.current)
        return [];
      const t2 = this.Ku;
      this.Ku = Yn(), this.Qu.forEach((t3) => {
        this.Zu(t3.key) && (this.Ku = this.Ku.add(t3.key));
      });
      const e = [];
      return t2.forEach((t3) => {
        this.Ku.has(t3) || e.push(new ju(t3));
      }), this.Ku.forEach((n) => {
        t2.has(n) || e.push(new Qu(n));
      }), e;
    }
    ta(t2) {
      this.Uu = t2._i, this.Ku = Yn();
      const e = this.Wu(t2.documents);
      return this.applyChanges(e, true);
    }
    ea() {
      return xu.fromInitialDocuments(this.query, this.Qu, this.mutatedKeys, this.qu === 0);
    }
  };
  var zu = class {
    constructor(t2, e, n) {
      this.query = t2, this.targetId = e, this.view = n;
    }
  };
  var Hu = class {
    constructor(t2) {
      this.key = t2, this.na = false;
    }
  };
  var Ju = class {
    constructor(t2, e, n, s, i, r) {
      this.localStore = t2, this.remoteStore = e, this.eventManager = n, this.sharedClientState = s, this.currentUser = i, this.maxConcurrentLimboResolutions = r, this.sa = {}, this.ia = new Kn((t3) => Xe(t3), Ye), this.ra = /* @__PURE__ */ new Map(), this.oa = /* @__PURE__ */ new Set(), this.ua = new fe(xt.comparator), this.aa = /* @__PURE__ */ new Map(), this.ca = new Io(), this.ha = {}, this.la = /* @__PURE__ */ new Map(), this.fa = br.yn(), this.onlineState = "Unknown", this.da = void 0;
    }
    get isPrimaryClient() {
      return this.da === true;
    }
  };
  async function Yu(t2, e) {
    const n = Pa(t2);
    let s, i;
    const r = n.ia.get(e);
    if (r)
      s = r.targetId, n.sharedClientState.addLocalQueryTarget(s), i = r.view.ea();
    else {
      const t3 = await co(n.localStore, He(e));
      n.isPrimaryClient && nu(n.remoteStore, t3);
      const r2 = n.sharedClientState.addLocalQueryTarget(t3.targetId);
      s = t3.targetId, i = await Xu(n, e, s, r2 === "current");
    }
    return i;
  }
  async function Xu(t2, e, n, s) {
    t2._a = (e2, n2, s2) => async function(t3, e3, n3, s3) {
      let i2 = e3.view.Wu(n3);
      i2.ii && (i2 = await lo(t3.localStore, e3.query, false).then(({ documents: t4 }) => e3.view.Wu(t4, i2)));
      const r2 = s3 && s3.targetChanges.get(e3.targetId), o2 = e3.view.applyChanges(i2, t3.isPrimaryClient, r2);
      return la2(t3, e3.targetId, o2.Xu), o2.snapshot;
    }(t2, e2, n2, s2);
    const i = await lo(t2.localStore, e, true), r = new Wu(e, i._i), o = r.Wu(i.documents), u = es.createSynthesizedTargetChangeForCurrentChange(n, s && t2.onlineState !== "Offline"), a = r.applyChanges(o, t2.isPrimaryClient, u);
    la2(t2, n, a.Xu);
    const c = new zu(e, n, r);
    return t2.ia.set(e, c), t2.ra.has(n) ? t2.ra.get(n).push(e) : t2.ra.set(n, [e]), a.snapshot;
  }
  async function Zu(t2, e) {
    const n = K2(t2), s = n.ia.get(e), i = n.ra.get(s.targetId);
    if (i.length > 1)
      return n.ra.set(s.targetId, i.filter((t3) => !Ye(t3, e))), void n.ia.delete(e);
    if (n.isPrimaryClient) {
      n.sharedClientState.removeLocalQueryTarget(s.targetId);
      n.sharedClientState.isActiveQueryTarget(s.targetId) || await ho(n.localStore, s.targetId, false).then(() => {
        n.sharedClientState.clearQueryState(s.targetId), su(n.remoteStore, s.targetId), ca(n, s.targetId);
      }).catch(Dr);
    } else
      ca(n, s.targetId), await ho(n.localStore, s.targetId, true);
  }
  async function ea2(t2, e) {
    const n = K2(t2);
    try {
      const t3 = await oo(n.localStore, e);
      e.targetChanges.forEach((t4, e2) => {
        const s = n.aa.get(e2);
        s && (U2(t4.addedDocuments.size + t4.modifiedDocuments.size + t4.removedDocuments.size <= 1), t4.addedDocuments.size > 0 ? s.na = true : t4.modifiedDocuments.size > 0 ? U2(s.na) : t4.removedDocuments.size > 0 && (U2(s.na), s.na = false));
      }), await _a(n, t3, e);
    } catch (t3) {
      await Dr(t3);
    }
  }
  function na2(t2, e, n) {
    const s = K2(t2);
    if (s.isPrimaryClient && n === 0 || !s.isPrimaryClient && n === 1) {
      const t3 = [];
      s.ia.forEach((n2, s2) => {
        const i = s2.view.Pu(e);
        i.snapshot && t3.push(i.snapshot);
      }), function(t4, e2) {
        const n2 = K2(t4);
        n2.onlineState = e2;
        let s2 = false;
        n2.queries.forEach((t5, n3) => {
          for (const t6 of n3.listeners)
            t6.Pu(e2) && (s2 = true);
        }), s2 && Bu(n2);
      }(s.eventManager, e), t3.length && s.sa.zo(t3), s.onlineState = e, s.isPrimaryClient && s.sharedClientState.setOnlineState(e);
    }
  }
  async function sa2(t2, e, n) {
    const s = K2(t2);
    s.sharedClientState.updateQueryState(e, "rejected", n);
    const i = s.aa.get(e), r = i && i.key;
    if (r) {
      let t3 = new fe(xt.comparator);
      t3 = t3.insert(r, ne.newNoDocument(r, ct.min()));
      const n2 = Yn().add(r), i2 = new ts(ct.min(), /* @__PURE__ */ new Map(), new we(rt), t3, n2);
      await ea2(s, i2), s.ua = s.ua.remove(r), s.aa.delete(e), da2(s);
    } else
      await ho(s.localStore, e, false).then(() => ca(s, e, n)).catch(Dr);
  }
  function ca(t2, e, n = null) {
    t2.sharedClientState.removeLocalQueryTarget(e);
    for (const s of t2.ra.get(e))
      t2.ia.delete(s), n && t2.sa.wa(s, n);
    if (t2.ra.delete(e), t2.isPrimaryClient) {
      t2.ca.vi(e).forEach((e2) => {
        t2.ca.containsKey(e2) || ha2(t2, e2);
      });
    }
  }
  function ha2(t2, e) {
    t2.oa.delete(e.path.canonicalString());
    const n = t2.ua.get(e);
    n !== null && (su(t2.remoteStore, n), t2.ua = t2.ua.remove(e), t2.aa.delete(n), da2(t2));
  }
  function la2(t2, e, n) {
    for (const s of n)
      if (s instanceof Qu)
        t2.ca.addReference(s.key, e), fa2(t2, s);
      else if (s instanceof ju) {
        O2("SyncEngine", "Document no longer in limbo: " + s.key), t2.ca.removeReference(s.key, e);
        t2.ca.containsKey(s.key) || ha2(t2, s.key);
      } else
        L2();
  }
  function fa2(t2, e) {
    const n = e.key, s = n.path.canonicalString();
    t2.ua.get(n) || t2.oa.has(s) || (O2("SyncEngine", "New document in limbo: " + n), t2.oa.add(s), da2(t2));
  }
  function da2(t2) {
    for (; t2.oa.size > 0 && t2.ua.size < t2.maxConcurrentLimboResolutions; ) {
      const e = t2.oa.values().next().value;
      t2.oa.delete(e);
      const n = new xt(_t.fromString(e)), s = t2.fa.next();
      t2.aa.set(s, new Hu(n)), t2.ua = t2.ua.insert(n, s), nu(t2.remoteStore, new Ni(He(Ke(n.path)), s, 2, nt.A));
    }
  }
  async function _a(t2, e, n) {
    const s = K2(t2), i = [], r = [], o = [];
    s.ia.isEmpty() || (s.ia.forEach((t3, u) => {
      o.push(s._a(u, e, n).then((t4) => {
        if (t4) {
          s.isPrimaryClient && s.sharedClientState.updateQueryState(u.targetId, t4.fromCache ? "not-current" : "current"), i.push(t4);
          const e2 = Zr.Ys(u.targetId, t4);
          r.push(e2);
        }
      }));
    }), await Promise.all(o), s.sa.zo(i), await async function(t3, e2) {
      const n2 = K2(t3);
      try {
        await n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (t4) => yi.forEach(e2, (e3) => yi.forEach(e3.Hs, (s2) => n2.persistence.referenceDelegate.addReference(t4, e3.targetId, s2)).next(() => yi.forEach(e3.Js, (s2) => n2.persistence.referenceDelegate.removeReference(t4, e3.targetId, s2)))));
      } catch (t4) {
        if (!Ai(t4))
          throw t4;
        O2("LocalStore", "Failed to update sequence numbers: " + t4);
      }
      for (const t4 of e2) {
        const e3 = t4.targetId;
        if (!t4.fromCache) {
          const t5 = n2.ui.get(e3), s2 = t5.snapshotVersion, i2 = t5.withLastLimboFreeSnapshotVersion(s2);
          n2.ui = n2.ui.insert(e3, i2);
        }
      }
    }(s.localStore, r));
  }
  async function wa(t2, e) {
    const n = K2(t2);
    if (!n.currentUser.isEqual(e)) {
      O2("SyncEngine", "User change. New user:", e.toKey());
      const t3 = await so(n.localStore, e);
      n.currentUser = e, function(t4, e2) {
        t4.la.forEach((t5) => {
          t5.forEach((t6) => {
            t6.reject(new Q2(G.CANCELLED, e2));
          });
        }), t4.la.clear();
      }(n, "'waitForPendingWrites' promise is rejected due to a user change."), n.sharedClientState.handleUserChange(e, t3.removedBatchIds, t3.addedBatchIds), await _a(n, t3.di);
    }
  }
  function ma2(t2, e) {
    const n = K2(t2), s = n.aa.get(e);
    if (s && s.na)
      return Yn().add(s.key);
    {
      let t3 = Yn();
      const s2 = n.ra.get(e);
      if (!s2)
        return t3;
      for (const e2 of s2) {
        const s3 = n.ia.get(e2);
        t3 = t3.unionWith(s3.view.ju);
      }
      return t3;
    }
  }
  function Pa(t2) {
    const e = K2(t2);
    return e.remoteStore.remoteSyncer.applyRemoteEvent = ea2.bind(null, e), e.remoteStore.remoteSyncer.getRemoteKeysForTarget = ma2.bind(null, e), e.remoteStore.remoteSyncer.rejectListen = sa2.bind(null, e), e.sa.zo = Fu.bind(null, e.eventManager), e.sa.wa = $u.bind(null, e.eventManager), e;
  }
  var Sa2 = class {
    constructor() {
      this.synchronizeTabs = false;
    }
    async initialize(t2) {
      this.M = jo(t2.databaseInfo.databaseId), this.sharedClientState = this.ga(t2), this.persistence = this.ya(t2), await this.persistence.start(), this.gcScheduler = this.pa(t2), this.localStore = this.Ia(t2);
    }
    pa(t2) {
      return null;
    }
    Ia(t2) {
      return no(this.persistence, new to(), t2.initialUser, this.M);
    }
    ya(t2) {
      return new Po(vo.Yi, this.M);
    }
    ga(t2) {
      return new $o();
    }
    async terminate() {
      this.gcScheduler && this.gcScheduler.stop(), await this.sharedClientState.shutdown(), await this.persistence.shutdown();
    }
  };
  var xa2 = class {
    async initialize(t2, e) {
      this.localStore || (this.localStore = t2.localStore, this.sharedClientState = t2.sharedClientState, this.datastore = this.createDatastore(e), this.remoteStore = this.createRemoteStore(e), this.eventManager = this.createEventManager(e), this.syncEngine = this.createSyncEngine(e, !t2.synchronizeTabs), this.sharedClientState.onlineStateHandler = (t3) => na2(this.syncEngine, t3, 1), this.remoteStore.remoteSyncer.handleCredentialChange = wa.bind(null, this.syncEngine), await bu(this.remoteStore, this.syncEngine.isPrimaryClient));
    }
    createEventManager(t2) {
      return new ku();
    }
    createDatastore(t2) {
      const e = jo(t2.databaseInfo.databaseId), n = (s = t2.databaseInfo, new Ko(s));
      var s;
      return function(t3, e2, n2, s2) {
        return new Yo(t3, e2, n2, s2);
      }(t2.authCredentials, t2.appCheckCredentials, n, e);
    }
    createRemoteStore(t2) {
      return e = this.localStore, n = this.datastore, s = t2.asyncQueue, i = (t3) => na2(this.syncEngine, t3, 0), r = Lo.vt() ? new Lo() : new Bo(), new Zo(e, n, s, i, r);
      var e, n, s, i, r;
    }
    createSyncEngine(t2, e) {
      return function(t3, e2, n, s, i, r, o) {
        const u = new Ju(t3, e2, n, s, i, r);
        return o && (u.da = true), u;
      }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, t2.initialUser, t2.maxConcurrentLimboResolutions, e);
    }
    terminate() {
      return async function(t2) {
        const e = K2(t2);
        O2("RemoteStore", "RemoteStore shutting down."), e.wu.add(5), await eu(e), e.gu.shutdown(), e.yu.set("Unknown");
      }(this.remoteStore);
    }
  };
  var ka2 = class {
    constructor(t2) {
      this.observer = t2, this.muted = false;
    }
    next(t2) {
      this.observer.next && this.Ea(this.observer.next, t2);
    }
    error(t2) {
      this.observer.error ? this.Ea(this.observer.error, t2) : console.error("Uncaught Error in snapshot listener:", t2);
    }
    Aa() {
      this.muted = true;
    }
    Ea(t2, e) {
      this.muted || setTimeout(() => {
        this.muted || t2(e);
      }, 0);
    }
  };
  var $a2 = class {
    constructor(t2, e, n, s) {
      this.authCredentials = t2, this.appCheckCredentials = e, this.asyncQueue = n, this.databaseInfo = s, this.user = C2.UNAUTHENTICATED, this.clientId = it.R(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, async (t3) => {
        O2("FirestoreClient", "Received user=", t3.uid), await this.authCredentialListener(t3), this.user = t3;
      }), this.appCheckCredentials.start(n, (t3) => (O2("FirestoreClient", "Received new app check token=", t3), this.appCheckCredentialListener(t3, this.user)));
    }
    async getConfiguration() {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100
      };
    }
    setCredentialChangeListener(t2) {
      this.authCredentialListener = t2;
    }
    setAppCheckTokenChangeListener(t2) {
      this.appCheckCredentialListener = t2;
    }
    verifyNotTerminated() {
      if (this.asyncQueue.isShuttingDown)
        throw new Q2(G.FAILED_PRECONDITION, "The client has already been terminated.");
    }
    terminate() {
      this.asyncQueue.enterRestrictedMode();
      const t2 = new j();
      return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async () => {
        try {
          this.onlineComponents && await this.onlineComponents.terminate(), this.offlineComponents && await this.offlineComponents.terminate(), this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), t2.resolve();
        } catch (e) {
          const n = Su(e, "Failed to shutdown persistence");
          t2.reject(n);
        }
      }), t2.promise;
    }
  };
  async function Ba(t2, e) {
    t2.asyncQueue.verifyOperationInProgress(), O2("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = await t2.getConfiguration();
    await e.initialize(n);
    let s = n.initialUser;
    t2.setCredentialChangeListener(async (t3) => {
      s.isEqual(t3) || (await so(e.localStore, t3), s = t3);
    }), e.persistence.setDatabaseDeletedListener(() => t2.terminate()), t2.offlineComponents = e;
  }
  async function La2(t2, e) {
    t2.asyncQueue.verifyOperationInProgress();
    const n = await Ua2(t2);
    O2("FirestoreClient", "Initializing OnlineComponentProvider");
    const s = await t2.getConfiguration();
    await e.initialize(n, s), t2.setCredentialChangeListener((t3) => Ru(e.remoteStore, t3)), t2.setAppCheckTokenChangeListener((t3, n2) => Ru(e.remoteStore, n2)), t2.onlineComponents = e;
  }
  async function Ua2(t2) {
    return t2.offlineComponents || (O2("FirestoreClient", "Using default OfflineComponentProvider"), await Ba(t2, new Sa2())), t2.offlineComponents;
  }
  async function qa2(t2) {
    return t2.onlineComponents || (O2("FirestoreClient", "Using default OnlineComponentProvider"), await La2(t2, new xa2())), t2.onlineComponents;
  }
  async function Wa2(t2) {
    const e = await qa2(t2), n = e.eventManager;
    return n.onListen = Yu.bind(null, e.syncEngine), n.onUnlisten = Zu.bind(null, e.syncEngine), n;
  }
  function Za2(t2, e, n = {}) {
    const s = new j();
    return t2.asyncQueue.enqueueAndForget(async () => function(t3, e2, n2, s2, i) {
      const r = new ka2({
        next: (n3) => {
          e2.enqueueAndForget(() => Ou(t3, o)), n3.fromCache && s2.source === "server" ? i.reject(new Q2(G.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n3);
        },
        error: (t4) => i.reject(t4)
      }), o = new Lu(n2, r, {
        includeMetadataChanges: true,
        ku: true
      });
      return Mu(t3, o);
    }(await Wa2(t2), t2.asyncQueue, e, n, s)), s.promise;
  }
  var ic2 = /* @__PURE__ */ new Map();
  function rc2(t2, e, n) {
    if (!n)
      throw new Q2(G.INVALID_ARGUMENT, `Function ${t2}() cannot be called with an empty ${e}.`);
  }
  function oc2(t2, e, n, s) {
    if (e === true && s === true)
      throw new Q2(G.INVALID_ARGUMENT, `${t2} and ${n} cannot be used together.`);
  }
  function ac2(t2) {
    if (xt.isDocumentKey(t2))
      throw new Q2(G.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${t2} has ${t2.length}.`);
  }
  function cc2(t2) {
    if (t2 === void 0)
      return "undefined";
    if (t2 === null)
      return "null";
    if (typeof t2 == "string")
      return t2.length > 20 && (t2 = `${t2.substring(0, 20)}...`), JSON.stringify(t2);
    if (typeof t2 == "number" || typeof t2 == "boolean")
      return "" + t2;
    if (typeof t2 == "object") {
      if (t2 instanceof Array)
        return "an array";
      {
        const e = function(t3) {
          if (t3.constructor)
            return t3.constructor.name;
          return null;
        }(t2);
        return e ? `a custom ${e} object` : "an object";
      }
    }
    return typeof t2 == "function" ? "a function" : L2();
  }
  function hc2(t2, e) {
    if ("_delegate" in t2 && (t2 = t2._delegate), !(t2 instanceof e)) {
      if (e.name === t2.constructor.name)
        throw new Q2(G.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
      {
        const n = cc2(t2);
        throw new Q2(G.INVALID_ARGUMENT, `Expected type '${e.name}', but it was: ${n}`);
      }
    }
    return t2;
  }
  var fc2 = class {
    constructor(t2) {
      var e;
      if (t2.host === void 0) {
        if (t2.ssl !== void 0)
          throw new Q2(G.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
        this.host = "firestore.googleapis.com", this.ssl = true;
      } else
        this.host = t2.host, this.ssl = (e = t2.ssl) === null || e === void 0 || e;
      if (this.credentials = t2.credentials, this.ignoreUndefinedProperties = !!t2.ignoreUndefinedProperties, t2.cacheSizeBytes === void 0)
        this.cacheSizeBytes = 41943040;
      else {
        if (t2.cacheSizeBytes !== -1 && t2.cacheSizeBytes < 1048576)
          throw new Q2(G.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
        this.cacheSizeBytes = t2.cacheSizeBytes;
      }
      this.experimentalForceLongPolling = !!t2.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t2.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t2.useFetchStreams, oc2("experimentalForceLongPolling", t2.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t2.experimentalAutoDetectLongPolling);
    }
    isEqual(t2) {
      return this.host === t2.host && this.ssl === t2.ssl && this.credentials === t2.credentials && this.cacheSizeBytes === t2.cacheSizeBytes && this.experimentalForceLongPolling === t2.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t2.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t2.ignoreUndefinedProperties && this.useFetchStreams === t2.useFetchStreams;
    }
  };
  var dc2 = class {
    constructor(t2, e, n) {
      this._authCredentials = e, this._appCheckCredentials = n, this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new fc2({}), this._settingsFrozen = false, t2 instanceof vt ? this._databaseId = t2 : (this._app = t2, this._databaseId = function(t3) {
        if (!Object.prototype.hasOwnProperty.apply(t3.options, ["projectId"]))
          throw new Q2(G.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
        return new vt(t3.options.projectId);
      }(t2));
    }
    get app() {
      if (!this._app)
        throw new Q2(G.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
      return this._app;
    }
    get _initialized() {
      return this._settingsFrozen;
    }
    get _terminated() {
      return this._terminateTask !== void 0;
    }
    _setSettings(t2) {
      if (this._settingsFrozen)
        throw new Q2(G.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
      this._settings = new fc2(t2), t2.credentials !== void 0 && (this._authCredentials = function(t3) {
        if (!t3)
          return new z2();
        switch (t3.type) {
          case "gapi":
            const e = t3.client;
            return U2(!(typeof e != "object" || e === null || !e.auth || !e.auth.getAuthHeaderValueForFirstParty)), new X2(e, t3.sessionIndex || "0", t3.iamToken || null);
          case "provider":
            return t3.client;
          default:
            throw new Q2(G.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
        }
      }(t2.credentials));
    }
    _getSettings() {
      return this._settings;
    }
    _freezeSettings() {
      return this._settingsFrozen = true, this._settings;
    }
    _delete() {
      return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
    }
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings
      };
    }
    _terminate() {
      return function(t2) {
        const e = ic2.get(t2);
        e && (O2("ComponentProvider", "Removing Datastore"), ic2.delete(t2), e.terminate());
      }(this), Promise.resolve();
    }
  };
  var wc2 = class {
    constructor(t2, e, n) {
      this.converter = e, this._key = n, this.type = "document", this.firestore = t2;
    }
    get _path() {
      return this._key.path;
    }
    get id() {
      return this._key.path.lastSegment();
    }
    get path() {
      return this._key.path.canonicalString();
    }
    get parent() {
      return new gc2(this.firestore, this.converter, this._key.path.popLast());
    }
    withConverter(t2) {
      return new wc2(this.firestore, t2, this._key);
    }
  };
  var mc2 = class {
    constructor(t2, e, n) {
      this.converter = e, this._query = n, this.type = "query", this.firestore = t2;
    }
    withConverter(t2) {
      return new mc2(this.firestore, t2, this._query);
    }
  };
  var gc2 = class extends mc2 {
    constructor(t2, e, n) {
      super(t2, e, Ke(n)), this._path = n, this.type = "collection";
    }
    get id() {
      return this._query.path.lastSegment();
    }
    get path() {
      return this._query.path.canonicalString();
    }
    get parent() {
      const t2 = this._path.popLast();
      return t2.isEmpty() ? null : new wc2(this.firestore, null, new xt(t2));
    }
    withConverter(t2) {
      return new gc2(this.firestore, t2, this._path);
    }
  };
  function yc2(t2, e, ...n) {
    if (t2 = getModularInstance(t2), rc2("collection", "path", e), t2 instanceof dc2) {
      const s = _t.fromString(e, ...n);
      return ac2(s), new gc2(t2, null, s);
    }
    {
      if (!(t2 instanceof wc2 || t2 instanceof gc2))
        throw new Q2(G.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const s = t2._path.child(_t.fromString(e, ...n));
      return ac2(s), new gc2(t2.firestore, null, s);
    }
  }
  var Ac2 = class {
    constructor() {
      this.Fa = Promise.resolve(), this.$a = [], this.Ba = false, this.La = [], this.Ua = null, this.qa = false, this.Ka = false, this.Ga = [], this.No = new Wo(this, "async_queue_retry"), this.Qa = () => {
        const t3 = Qo();
        t3 && O2("AsyncQueue", "Visibility state changed to " + t3.visibilityState), this.No.Po();
      };
      const t2 = Qo();
      t2 && typeof t2.addEventListener == "function" && t2.addEventListener("visibilitychange", this.Qa);
    }
    get isShuttingDown() {
      return this.Ba;
    }
    enqueueAndForget(t2) {
      this.enqueue(t2);
    }
    enqueueAndForgetEvenWhileRestricted(t2) {
      this.ja(), this.Wa(t2);
    }
    enterRestrictedMode(t2) {
      if (!this.Ba) {
        this.Ba = true, this.Ka = t2 || false;
        const e = Qo();
        e && typeof e.removeEventListener == "function" && e.removeEventListener("visibilitychange", this.Qa);
      }
    }
    enqueue(t2) {
      if (this.ja(), this.Ba)
        return new Promise(() => {
        });
      const e = new j();
      return this.Wa(() => this.Ba && this.Ka ? Promise.resolve() : (t2().then(e.resolve, e.reject), e.promise)).then(() => e.promise);
    }
    enqueueRetryable(t2) {
      this.enqueueAndForget(() => (this.$a.push(t2), this.za()));
    }
    async za() {
      if (this.$a.length !== 0) {
        try {
          await this.$a[0](), this.$a.shift(), this.No.reset();
        } catch (t2) {
          if (!Ai(t2))
            throw t2;
          O2("AsyncQueue", "Operation failed with retryable error: " + t2);
        }
        this.$a.length > 0 && this.No.Ro(() => this.za());
      }
    }
    Wa(t2) {
      const e = this.Fa.then(() => (this.qa = true, t2().catch((t3) => {
        this.Ua = t3, this.qa = false;
        const e2 = function(t4) {
          let e3 = t4.message || "";
          t4.stack && (e3 = t4.stack.includes(t4.message) ? t4.stack : t4.message + "\n" + t4.stack);
          return e3;
        }(t3);
        throw F2("INTERNAL UNHANDLED ERROR: ", e2), t3;
      }).then((t3) => (this.qa = false, t3))));
      return this.Fa = e, e;
    }
    enqueueAfterDelay(t2, e, n) {
      this.ja(), this.Ga.indexOf(t2) > -1 && (e = 0);
      const s = vu.createAndSchedule(this, t2, e, n, (t3) => this.Ha(t3));
      return this.La.push(s), s;
    }
    ja() {
      this.Ua && L2();
    }
    verifyOperationInProgress() {
    }
    async Ja() {
      let t2;
      do {
        t2 = this.Fa, await t2;
      } while (t2 !== this.Fa);
    }
    Ya(t2) {
      for (const e of this.La)
        if (e.timerId === t2)
          return true;
      return false;
    }
    Xa(t2) {
      return this.Ja().then(() => {
        this.La.sort((t3, e) => t3.targetTimeMs - e.targetTimeMs);
        for (const e of this.La)
          if (e.skipDelay(), t2 !== "all" && e.timerId === t2)
            break;
        return this.Ja();
      });
    }
    Za(t2) {
      this.Ga.push(t2);
    }
    Ha(t2) {
      const e = this.La.indexOf(t2);
      this.La.splice(e, 1);
    }
  };
  var Vc2 = class extends dc2 {
    constructor(t2, e, n) {
      super(t2, e, n), this.type = "firestore", this._queue = new Ac2(), this._persistenceKey = "name" in t2 ? t2.name : "[DEFAULT]";
    }
    _terminate() {
      return this._firestoreClient || Cc2(this), this._firestoreClient.terminate();
    }
  };
  function Sc2(e = getApp()) {
    return _getProvider(e, "firestore").getImmediate();
  }
  function Dc2(t2) {
    return t2._firestoreClient || Cc2(t2), t2._firestoreClient.verifyNotTerminated(), t2._firestoreClient;
  }
  function Cc2(t2) {
    var e;
    const n = t2._freezeSettings(), s = function(t3, e2, n2, s2) {
      return new Vt(t3, e2, n2, s2.host, s2.ssl, s2.experimentalForceLongPolling, s2.experimentalAutoDetectLongPolling, s2.useFetchStreams);
    }(t2._databaseId, ((e = t2._app) === null || e === void 0 ? void 0 : e.options.appId) || "", t2._persistenceKey, n);
    t2._firestoreClient = new $a2(t2._authCredentials, t2._appCheckCredentials, t2._queue, s);
  }
  var Kc2 = class {
    constructor(...t2) {
      for (let e = 0; e < t2.length; ++e)
        if (t2[e].length === 0)
          throw new Q2(G.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
      this._internalPath = new mt(t2);
    }
    isEqual(t2) {
      return this._internalPath.isEqual(t2._internalPath);
    }
  };
  var Qc2 = class {
    constructor(t2) {
      this._byteString = t2;
    }
    static fromBase64String(t2) {
      try {
        return new Qc2(pt.fromBase64String(t2));
      } catch (t3) {
        throw new Q2(G.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + t3);
      }
    }
    static fromUint8Array(t2) {
      return new Qc2(pt.fromUint8Array(t2));
    }
    toBase64() {
      return this._byteString.toBase64();
    }
    toUint8Array() {
      return this._byteString.toUint8Array();
    }
    toString() {
      return "Bytes(base64: " + this.toBase64() + ")";
    }
    isEqual(t2) {
      return this._byteString.isEqual(t2._byteString);
    }
  };
  var Wc2 = class {
    constructor(t2, e) {
      if (!isFinite(t2) || t2 < -90 || t2 > 90)
        throw new Q2(G.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + t2);
      if (!isFinite(e) || e < -180 || e > 180)
        throw new Q2(G.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + e);
      this._lat = t2, this._long = e;
    }
    get latitude() {
      return this._lat;
    }
    get longitude() {
      return this._long;
    }
    isEqual(t2) {
      return this._lat === t2._lat && this._long === t2._long;
    }
    toJSON() {
      return {
        latitude: this._lat,
        longitude: this._long
      };
    }
    _compareTo(t2) {
      return rt(this._lat, t2._lat) || rt(this._long, t2._long);
    }
  };
  var mh = new RegExp("[~\\*/\\[\\]]");
  function gh(t2, e, n) {
    if (e.search(mh) >= 0)
      throw yh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`, t2, false, void 0, n);
    try {
      return new Kc2(...e.split("."))._internalPath;
    } catch (s) {
      throw yh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`, t2, false, void 0, n);
    }
  }
  function yh(t2, e, n, s, i) {
    const r = s && !s.isEmpty(), o = i !== void 0;
    let u = `Function ${e}() called with invalid data`;
    n && (u += " (via `toFirestore()`)"), u += ". ";
    let a = "";
    return (r || o) && (a += " (found", r && (a += ` in field ${s}`), o && (a += ` in document ${i}`), a += ")"), new Q2(G.INVALID_ARGUMENT, u + t2 + a);
  }
  var Ih = class {
    constructor(t2, e, n, s, i) {
      this._firestore = t2, this._userDataWriter = e, this._key = n, this._document = s, this._converter = i;
    }
    get id() {
      return this._key.path.lastSegment();
    }
    get ref() {
      return new wc2(this._firestore, this._converter, this._key);
    }
    exists() {
      return this._document !== null;
    }
    data() {
      if (this._document) {
        if (this._converter) {
          const t2 = new Th(this._firestore, this._userDataWriter, this._key, this._document, null);
          return this._converter.fromFirestore(t2);
        }
        return this._userDataWriter.convertValue(this._document.data.value);
      }
    }
    get(t2) {
      if (this._document) {
        const e = this._document.data.field(Eh("DocumentSnapshot.get", t2));
        if (e !== null)
          return this._userDataWriter.convertValue(e);
      }
    }
  };
  var Th = class extends Ih {
    data() {
      return super.data();
    }
  };
  function Eh(t2, e) {
    return typeof e == "string" ? gh(t2, e) : e instanceof Kc2 ? e._internalPath : e._delegate._internalPath;
  }
  var Ah = class {
    constructor(t2, e) {
      this.hasPendingWrites = t2, this.fromCache = e;
    }
    isEqual(t2) {
      return this.hasPendingWrites === t2.hasPendingWrites && this.fromCache === t2.fromCache;
    }
  };
  var Rh = class extends Ih {
    constructor(t2, e, n, s, i, r) {
      super(t2, e, n, s, r), this._firestore = t2, this._firestoreImpl = t2, this.metadata = i;
    }
    exists() {
      return super.exists();
    }
    data(t2 = {}) {
      if (this._document) {
        if (this._converter) {
          const e = new bh(this._firestore, this._userDataWriter, this._key, this._document, this.metadata, null);
          return this._converter.fromFirestore(e, t2);
        }
        return this._userDataWriter.convertValue(this._document.data.value, t2.serverTimestamps);
      }
    }
    get(t2, e = {}) {
      if (this._document) {
        const n = this._document.data.field(Eh("DocumentSnapshot.get", t2));
        if (n !== null)
          return this._userDataWriter.convertValue(n, e.serverTimestamps);
      }
    }
  };
  var bh = class extends Rh {
    data(t2 = {}) {
      return super.data(t2);
    }
  };
  var Ph = class {
    constructor(t2, e, n, s) {
      this._firestore = t2, this._userDataWriter = e, this._snapshot = s, this.metadata = new Ah(s.hasPendingWrites, s.fromCache), this.query = n;
    }
    get docs() {
      const t2 = [];
      return this.forEach((e) => t2.push(e)), t2;
    }
    get size() {
      return this._snapshot.docs.size;
    }
    get empty() {
      return this.size === 0;
    }
    forEach(t2, e) {
      this._snapshot.docs.forEach((n) => {
        t2.call(e, new bh(this._firestore, this._userDataWriter, n.key, n, new Ah(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
      });
    }
    docChanges(t2 = {}) {
      const e = !!t2.includeMetadataChanges;
      if (e && this._snapshot.excludesMetadataChanges)
        throw new Q2(G.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
      return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === e || (this._cachedChanges = function(t3, e2) {
        if (t3._snapshot.oldDocs.isEmpty()) {
          let e3 = 0;
          return t3._snapshot.docChanges.map((n) => ({
            type: "added",
            doc: new bh(t3._firestore, t3._userDataWriter, n.doc.key, n.doc, new Ah(t3._snapshot.mutatedKeys.has(n.doc.key), t3._snapshot.fromCache), t3.query.converter),
            oldIndex: -1,
            newIndex: e3++
          }));
        }
        {
          let n = t3._snapshot.oldDocs;
          return t3._snapshot.docChanges.filter((t4) => e2 || t4.type !== 3).map((e3) => {
            const s = new bh(t3._firestore, t3._userDataWriter, e3.doc.key, e3.doc, new Ah(t3._snapshot.mutatedKeys.has(e3.doc.key), t3._snapshot.fromCache), t3.query.converter);
            let i = -1, r = -1;
            return e3.type !== 0 && (i = n.indexOf(e3.doc.key), n = n.delete(e3.doc.key)), e3.type !== 1 && (n = n.add(e3.doc), r = n.indexOf(e3.doc.key)), {
              type: Vh(e3.type),
              doc: s,
              oldIndex: i,
              newIndex: r
            };
          });
        }
      }(this, e), this._cachedChangesIncludeMetadataChanges = e), this._cachedChanges;
    }
  };
  function Vh(t2) {
    switch (t2) {
      case 0:
        return "added";
      case 2:
      case 3:
        return "modified";
      case 1:
        return "removed";
      default:
        return L2();
    }
  }
  function Sh(t2) {
    if (t2.limitType === "L" && t2.explicitOrderBy.length === 0)
      throw new Q2(G.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
  }
  var Jh = class {
    convertValue(t2, e = "none") {
      switch (Mt(t2)) {
        case 0:
          return null;
        case 1:
          return t2.booleanValue;
        case 2:
          return Et(t2.integerValue || t2.doubleValue);
        case 3:
          return this.convertTimestamp(t2.timestampValue);
        case 4:
          return this.convertServerTimestamp(t2, e);
        case 5:
          return t2.stringValue;
        case 6:
          return this.convertBytes(At(t2.bytesValue));
        case 7:
          return this.convertReference(t2.referenceValue);
        case 8:
          return this.convertGeoPoint(t2.geoPointValue);
        case 9:
          return this.convertArray(t2.arrayValue, e);
        case 10:
          return this.convertObject(t2.mapValue, e);
        default:
          throw L2();
      }
    }
    convertObject(t2, e) {
      const n = {};
      return lt(t2.fields, (t3, s) => {
        n[t3] = this.convertValue(s, e);
      }), n;
    }
    convertGeoPoint(t2) {
      return new Wc2(Et(t2.latitude), Et(t2.longitude));
    }
    convertArray(t2, e) {
      return (t2.values || []).map((t3) => this.convertValue(t3, e));
    }
    convertServerTimestamp(t2, e) {
      switch (e) {
        case "previous":
          const n = bt(t2);
          return n == null ? null : this.convertValue(n, e);
        case "estimate":
          return this.convertTimestamp(Pt(t2));
        default:
          return null;
      }
    }
    convertTimestamp(t2) {
      const e = Tt(t2);
      return new at(e.seconds, e.nanos);
    }
    convertDocumentKey(t2, e) {
      const n = _t.fromString(t2);
      U2(Ks(n));
      const s = new vt(n.get(1), n.get(3)), i = new xt(n.popFirst(5));
      return s.isEqual(e) || F2(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), i;
    }
  };
  var nl = class extends Jh {
    constructor(t2) {
      super(), this.firestore = t2;
    }
    convertBytes(t2) {
      return new Qc2(t2);
    }
    convertReference(t2) {
      const e = this.convertDocumentKey(t2, this.firestore._databaseId);
      return new wc2(this.firestore, null, e);
    }
  };
  function rl(t2) {
    t2 = hc2(t2, mc2);
    const e = hc2(t2.firestore, Vc2), n = Dc2(e), s = new nl(e);
    return Sh(t2._query), Za2(n, t2._query).then((n2) => new Ph(e, s, t2, n2));
  }
  !function(t2, e = true) {
    !function(t3) {
      x2 = t3;
    }(SDK_VERSION), _registerComponent(new Component("firestore", (t3, { options: n }) => {
      const s = t3.getProvider("app").getImmediate(), i = new Vc2(s, new J2(t3.getProvider("auth-internal")), new tt(t3.getProvider("app-check-internal")));
      return n = Object.assign({
        useFetchStreams: e
      }, n), i._setSettings(n), i;
    }, "PUBLIC")), registerVersion(D2, "3.4.9", t2), registerVersion(D2, "3.4.9", "esm2017");
  }();

  // src/index.js
  var firebaseConfig = {
    apiKey: "AIzaSyCbMamMISViMpNtw4JXQGqn-J5VxUMyMKs",
    authDomain: "firstpage-f9dde.firebaseapp.com",
    projectId: "firstpage-f9dde",
    storageBucket: "firstpage-f9dde.appspot.com",
    messagingSenderId: "120347697336",
    appId: "1:120347697336:web:e96e3d451ea24e34b6d44d"
  };
  var app = initializeApp(firebaseConfig);
  var db2 = Sc2();
  var colUsers = yc2(db2, "users");
  rl(colUsers).then((snapshot) => {
    console.log(snapshot.docs);
  });
})();
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/