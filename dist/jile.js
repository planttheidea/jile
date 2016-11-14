(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("hash-it"), require("inline-style-prefixer"));
	else if(typeof define === 'function' && define.amd)
		define("jile", ["hash-it", "inline-style-prefixer"], factory);
	else if(typeof exports === 'object')
		exports["jile"] = factory(require("hash-it"), require("inline-style-prefixer"));
	else
		root["jile"] = factory(root["hashIt"], root["Prefixer"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_13__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(2);
	
	var _isPlainObject = __webpack_require__(3);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _general = __webpack_require__(8);
	
	var _prefix = __webpack_require__(12);
	
	var _Jile = __webpack_require__(14);
	
	var _rules = __webpack_require__(16);
	
	var _stylesheet = __webpack_require__(69);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * create jile stylesheet based on styles and passedOptions, and
	 * return an object with the metadata properties
	 *
	 * @param {Object} styles
	 * @param {Object} passedOptions
	 * @param {boolean} passedOptions.autoMount
	 * @returns {Object}
	 */
	
	
	// external dependencies
	var jile = function jile() {
	  var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var passedOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	  if (!(0, _isPlainObject2.default)(styles)) {
	    throw new TypeError('Styles passed need to be a plain object.');
	  }
	
	  if (!(0, _isPlainObject2.default)(passedOptions)) {
	    throw new TypeError('Options passed need to be a plain object.');
	  }
	
	  var options = (0, _general.getCleanOptions)(passedOptions);
	  var flattenedStyles = (0, _rules.getRules)(styles, options);
	
	  var _getCssAndSelectorMap = (0, _stylesheet.getCssAndSelectorMap)(flattenedStyles, options),
	      css = _getCssAndSelectorMap.css,
	      selectorMap = _getCssAndSelectorMap.selectorMap;
	
	  var tagObject = (0, _Jile.manageTagMetadataObject)(css, selectorMap, options);
	
	  if (options.autoMount) {
	    tagObject.add();
	  }
	
	  return tagObject;
	};
	
	/**
	 * pass-through to setPrefixer method
	 *
	 * @params {Array<*>} args
	 * @returns {*}
	 */
	
	
	// processing methods
	
	
	// utils
	// polyfills
	jile.setPrefixerOptions = function () {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  return _prefix.setPrefixerOptions.apply(undefined, args);
	};
	
	exports.default = jile;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/* Blob.js
	 * A Blob implementation.
	 * 2014-07-24
	 *
	 * By Eli Grey, http://eligrey.com
	 * By Devin Samarin, https://github.com/dsamarin
	 * License: X11/MIT
	 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
	 */
	
	/*global self, unescape */
	/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
	  plusplus: true */
	
	/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */
	
	(function (view) {
		"use strict";
	
		view.URL = view.URL || view.webkitURL;
	
		if (view.Blob && view.URL) {
			try {
				new Blob;
				return;
			} catch (e) {}
		}
	
		// Internally we use a BlobBuilder implementation to base Blob off of
		// in order to support older browsers that only have BlobBuilder
		var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function(view) {
			var
				  get_class = function(object) {
					return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
				}
				, FakeBlobBuilder = function BlobBuilder() {
					this.data = [];
				}
				, FakeBlob = function Blob(data, type, encoding) {
					this.data = data;
					this.size = data.length;
					this.type = type;
					this.encoding = encoding;
				}
				, FBB_proto = FakeBlobBuilder.prototype
				, FB_proto = FakeBlob.prototype
				, FileReaderSync = view.FileReaderSync
				, FileException = function(type) {
					this.code = this[this.name = type];
				}
				, file_ex_codes = (
					  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
					+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
				).split(" ")
				, file_ex_code = file_ex_codes.length
				, real_URL = view.URL || view.webkitURL || view
				, real_create_object_URL = real_URL.createObjectURL
				, real_revoke_object_URL = real_URL.revokeObjectURL
				, URL = real_URL
				, btoa = view.btoa
				, atob = view.atob
	
				, ArrayBuffer = view.ArrayBuffer
				, Uint8Array = view.Uint8Array
	
				, origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/
			;
			FakeBlob.fake = FB_proto.fake = true;
			while (file_ex_code--) {
				FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
			}
			// Polyfill URL
			if (!real_URL.createObjectURL) {
				URL = view.URL = function(uri) {
					var
						  uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
						, uri_origin
					;
					uri_info.href = uri;
					if (!("origin" in uri_info)) {
						if (uri_info.protocol.toLowerCase() === "data:") {
							uri_info.origin = null;
						} else {
							uri_origin = uri.match(origin);
							uri_info.origin = uri_origin && uri_origin[1];
						}
					}
					return uri_info;
				};
			}
			URL.createObjectURL = function(blob) {
				var
					  type = blob.type
					, data_URI_header
				;
				if (type === null) {
					type = "application/octet-stream";
				}
				if (blob instanceof FakeBlob) {
					data_URI_header = "data:" + type;
					if (blob.encoding === "base64") {
						return data_URI_header + ";base64," + blob.data;
					} else if (blob.encoding === "URI") {
						return data_URI_header + "," + decodeURIComponent(blob.data);
					} if (btoa) {
						return data_URI_header + ";base64," + btoa(blob.data);
					} else {
						return data_URI_header + "," + encodeURIComponent(blob.data);
					}
				} else if (real_create_object_URL) {
					return real_create_object_URL.call(real_URL, blob);
				}
			};
			URL.revokeObjectURL = function(object_URL) {
				if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
					real_revoke_object_URL.call(real_URL, object_URL);
				}
			};
			FBB_proto.append = function(data/*, endings*/) {
				var bb = this.data;
				// decode data to a binary string
				if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
					var
						  str = ""
						, buf = new Uint8Array(data)
						, i = 0
						, buf_len = buf.length
					;
					for (; i < buf_len; i++) {
						str += String.fromCharCode(buf[i]);
					}
					bb.push(str);
				} else if (get_class(data) === "Blob" || get_class(data) === "File") {
					if (FileReaderSync) {
						var fr = new FileReaderSync;
						bb.push(fr.readAsBinaryString(data));
					} else {
						// async FileReader won't work as BlobBuilder is sync
						throw new FileException("NOT_READABLE_ERR");
					}
				} else if (data instanceof FakeBlob) {
					if (data.encoding === "base64" && atob) {
						bb.push(atob(data.data));
					} else if (data.encoding === "URI") {
						bb.push(decodeURIComponent(data.data));
					} else if (data.encoding === "raw") {
						bb.push(data.data);
					}
				} else {
					if (typeof data !== "string") {
						data += ""; // convert unsupported types to strings
					}
					// decode UTF-16 to binary string
					bb.push(unescape(encodeURIComponent(data)));
				}
			};
			FBB_proto.getBlob = function(type) {
				if (!arguments.length) {
					type = null;
				}
				return new FakeBlob(this.data.join(""), type, "raw");
			};
			FBB_proto.toString = function() {
				return "[object BlobBuilder]";
			};
			FB_proto.slice = function(start, end, type) {
				var args = arguments.length;
				if (args < 3) {
					type = null;
				}
				return new FakeBlob(
					  this.data.slice(start, args > 1 ? end : this.data.length)
					, type
					, this.encoding
				);
			};
			FB_proto.toString = function() {
				return "[object Blob]";
			};
			FB_proto.close = function() {
				this.size = 0;
				delete this.data;
			};
			return FakeBlobBuilder;
		}(view));
	
		view.Blob = function(blobParts, options) {
			var type = options ? (options.type || "") : "";
			var builder = new BlobBuilder();
			if (blobParts) {
				for (var i = 0, len = blobParts.length; i < len; i++) {
					if (Uint8Array && blobParts[i] instanceof Uint8Array) {
						builder.append(blobParts[i].buffer);
					}
					else {
						builder.append(blobParts[i]);
					}
				}
			}
			var blob = builder.getBlob(type);
			if (!blob.slice && blob.webkitSlice) {
				blob.slice = blob.webkitSlice;
			}
			return blob;
		};
	
		var getPrototypeOf = Object.getPrototypeOf || function(object) {
			return object.__proto__;
		};
		view.Blob.prototype = getPrototypeOf(new view.Blob());
	}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    getPrototype = __webpack_require__(5),
	    isObjectLike = __webpack_require__(7);
	
	/** `Object#toString` result references. */
	var objectTag = '[object Object]';
	
	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);
	
	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
	    return false;
	  }
	  var proto = getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString.call(Ctor) == objectCtorString;
	}
	
	module.exports = isPlainObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;
	
	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}
	
	module.exports = objectToString;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var overArg = __webpack_require__(6);
	
	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);
	
	module.exports = getPrototype;


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}
	
	module.exports = overArg;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toKebabCase = exports.getHashedValue = exports.getHashedSelector = exports.getGeneratedJileId = exports.getCleanOptions = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // external dependencies
	
	
	// constants
	
	
	var _hashIt = __webpack_require__(9);
	
	var _hashIt2 = _interopRequireDefault(_hashIt);
	
	var _isUndefined = __webpack_require__(10);
	
	var _isUndefined2 = _interopRequireDefault(_isUndefined);
	
	var _constants = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	/**
	 * coalesce the options with default options and the generated id
	 *
	 * @param {Object} options
	 * @returns {{autoMount: boolean, hashSelectors: boolean, id: string, minify: boolean}}
	 */
	var getCleanOptions = function getCleanOptions() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  return _extends({}, _constants.DEFAULT_OPTIONS, options, {
	    id: getGeneratedJileId(options.id)
	  });
	};
	
	var idCounter = 0;
	
	/**
	 * return the id passed or a generated one based on counter
	 *
	 * @param {string} id
	 * @returns {string}
	 */
	var getGeneratedJileId = function getGeneratedJileId(id) {
	  return !(0, _isUndefined2.default)(id) ? id : 'jile-stylesheet-' + idCounter++;
	};
	
	/**
	 * get the hashed key
	 *
	 * @param {string} key
	 * @param {string} id
	 * @returns {string}
	 */
	var getHashedValue = function getHashedValue(key, id) {
	  var hashedValue = (0, _hashIt2.default)(key + '-' + id);
	
	  return 'jile__' + key + '__' + hashedValue;
	};
	
	/**
	 * hash the selector, and add it to the hashmap if it does not exist
	 *
	 * @param {string} originalSelector
	 * @param {string} id
	 * @returns {string}
	 */
	var getHashedSelector = function getHashedSelector(originalSelector, id) {
	  var noHashValueMap = {},
	      globalSelectorCounter = 0,
	      selectorMap = {},
	      cleanSelector = void 0,
	      mappedSelector = void 0,
	      hashedSelector = void 0,
	      key = void 0;
	
	  var selector = originalSelector.replace(_constants.GLOBAL_SELECTOR_REGEXP, function (match, value) {
	    key = 'global__' + globalSelectorCounter;
	
	    (0, _constants.assign)(noHashValueMap, _defineProperty({}, key, value));
	
	    globalSelectorCounter++;
	
	    return key;
	  }).replace(_constants.HASH_SELECTOR_REGEXP, function (match, value) {
	    cleanSelector = match.replace(value, '');
	    mappedSelector = selectorMap[cleanSelector];
	    hashedSelector = mappedSelector || getHashedValue(cleanSelector, id);
	
	    if (!mappedSelector) {
	      (0, _constants.assign)(selectorMap, _defineProperty({}, cleanSelector, hashedSelector));
	    }
	
	    return '' + value + hashedSelector;
	  }).replace(_constants.GLOBAL_REPLACEMENT_REGEXP, function (match) {
	    return noHashValueMap[match];
	  });
	
	  return {
	    selector: selector,
	    selectorMap: selectorMap
	  };
	};
	
	/**
	 * convert camelcase string to kebab case
	 *
	 * @param {string} string
	 * @returns {string}
	 */
	var toKebabCase = function toKebabCase(string) {
	  // opera has precursor of capital O, so handle that scenario
	  if (string.charAt(0) === 'O') {
	    string = 'o' + string.slice(1);
	  }
	
	  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	};
	
	exports.getCleanOptions = getCleanOptions;
	exports.getGeneratedJileId = getGeneratedJileId;
	exports.getHashedSelector = getHashedSelector;
	exports.getHashedValue = getHashedValue;
	exports.toKebabCase = toKebabCase;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is `undefined`.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
	 * @example
	 *
	 * _.isUndefined(void 0);
	 * // => true
	 *
	 * _.isUndefined(null);
	 * // => false
	 */
	function isUndefined(value) {
	  return value === undefined;
	}
	
	module.exports = isUndefined;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	// object methods
	var assign = Object.assign;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var keys = Object.keys;
	
	// environment
	var IS_PRODUCTION = ("development") === 'production';
	
	// options
	var DEFAULT_OPTIONS = {
	  autoMount: true,
	  hashSelectors: true,
	  minify: IS_PRODUCTION,
	  sourceMap: !IS_PRODUCTION
	};
	var OPTIONS_KEYS = [].concat(_toConsumableArray(keys(DEFAULT_OPTIONS)), ['id']);
	
	// properties that can have unitless values
	var UNITLESS_PROPERTIES = ['column-count', 'columnCount', 'columns', 'counter-increment', 'counter-reset', 'counterIncrement', 'counterReset', 'flex-grow', 'flex-shrink', 'flexGrow', 'flexShrink', 'font-weight', 'fontWeight', 'line-height', 'lineHeight', 'opacity', 'order', 'pitch-range', 'pitchRange', 'richness', 'stress', 'volume', 'z-index', 'zIndex'];
	
	// regexp objects
	var FONT_FACE_REGEXP = /@font-face/;
	var GLOBAL_REPLACEMENT_REGEXP = /global__([0-9]+)/;
	var GLOBAL_SELECTOR_REGEXP = /:global\((.*?)\)/;
	var HASH_SELECTOR_REGEXP = /(\.|#)([_a-zA-Z][_a-zA-z0-9-]+)/g;
	var JILE_HASH_REGEXP = /jile__(.*)__([0-9]+)/;
	var KEYFRAMES_REGEXP = /@keyframes/;
	var KEYFRAMES_FOLLOWED_BY_NAME_REGEXP = /(@keyframes\s+)(\w+)/;
	var MEDIA_QUERY_REGEXP = /@media/;
	var PAGE_REGEXP = /@page/;
	
	// types of selector
	var FONT_FACE_TYPE = 'FONT_FACE';
	var KEYFRAMES_TYPE = 'KEYFRAME';
	var MEDIA_QUERY_TYPE = 'MEDIA_QUERY';
	var PAGE_TYPE = 'PAGE';
	var STANDARD_TYPE = 'STANDARD';
	
	exports.assign = assign;
	exports.getOwnPropertyNames = getOwnPropertyNames;
	exports.keys = keys;
	exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
	exports.IS_PRODUCTION = IS_PRODUCTION;
	exports.OPTIONS_KEYS = OPTIONS_KEYS;
	exports.UNITLESS_PROPERTIES = UNITLESS_PROPERTIES;
	exports.FONT_FACE_REGEXP = FONT_FACE_REGEXP;
	exports.GLOBAL_REPLACEMENT_REGEXP = GLOBAL_REPLACEMENT_REGEXP;
	exports.GLOBAL_SELECTOR_REGEXP = GLOBAL_SELECTOR_REGEXP;
	exports.HASH_SELECTOR_REGEXP = HASH_SELECTOR_REGEXP;
	exports.JILE_HASH_REGEXP = JILE_HASH_REGEXP;
	exports.KEYFRAMES_REGEXP = KEYFRAMES_REGEXP;
	exports.KEYFRAMES_FOLLOWED_BY_NAME_REGEXP = KEYFRAMES_FOLLOWED_BY_NAME_REGEXP;
	exports.MEDIA_QUERY_REGEXP = MEDIA_QUERY_REGEXP;
	exports.PAGE_REGEXP = PAGE_REGEXP;
	exports.FONT_FACE_TYPE = FONT_FACE_TYPE;
	exports.KEYFRAMES_TYPE = KEYFRAMES_TYPE;
	exports.MEDIA_QUERY_TYPE = MEDIA_QUERY_TYPE;
	exports.PAGE_TYPE = PAGE_TYPE;
	exports.STANDARD_TYPE = STANDARD_TYPE;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.setPrefixerOptions = exports.prefix = exports.getKeyframesPrefix = undefined;
	
	var _inlineStylePrefixer = __webpack_require__(13);
	
	var _inlineStylePrefixer2 = _interopRequireDefault(_inlineStylePrefixer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixer = new _inlineStylePrefixer2.default();
	
	/**
	 * get the prefixed keyframes value for the
	 * prefixer's userAgent
	 *
	 * @returns {string}
	 */
	// external dependencies
	var getKeyframesPrefix = function getKeyframesPrefix() {
	  return prefixer.prefixedKeyframes;
	};
	
	/**
	 * get styles with vendor-prefixed values
	 *
	 * @param {object} styles
	 * @returns {object}
	 */
	var prefix = function prefix(styles) {
	  return prefixer.prefix(styles);
	};
	
	/**
	 * set the prefixer based on userAgent and
	 * options passed
	 *
	 * @param {object} options={}
	 * @param {boolean} [options.keepUnprefixed]
	 * @param {string} [options.userAgent]
	 */
	var setPrefixerOptions = function setPrefixerOptions() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	  prefixer = new _inlineStylePrefixer2.default(options);
	};
	
	exports.getKeyframesPrefix = getKeyframesPrefix;
	exports.prefix = prefix;
	exports.setPrefixerOptions = setPrefixerOptions;

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.manageTagMetadataObject = exports.getOriginalOptions = exports.getInternalOptionKey = exports.Jile = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _constants = __webpack_require__(11);
	
	var _dom = __webpack_require__(15);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // utils
	
	
	var jileMap = {};
	
	/**
	 * get the key used internally to store options
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	var getInternalOptionKey = function getInternalOptionKey(key) {
	  return '_' + key;
	};
	
	/**
	 * get the original options passed
	 *
	 * @param {Jile} jileObject
	 * @returns {Object}
	 */
	var getOriginalOptions = function getOriginalOptions(jileObject) {
	  return _constants.OPTIONS_KEYS.reduce(function (options, key) {
	    return (0, _constants.assign)(options, _defineProperty({}, key, jileObject[getInternalOptionKey(key)]));
	  }, {});
	};
	
	/**
	 * create or update the jile tag and return the metadata object
	 *
	 * @param {string} css
	 * @param {Object} selectors
	 * @param {Object} options
	 * @param {string} options.id
	 * @returns {Object}
	 */
	var manageTagMetadataObject = function manageTagMetadataObject(css, selectors, options) {
	  var id = options.id;
	
	
	  var cachedJile = jileMap[id];
	
	  if (cachedJile) {
	    cachedJile.css = css;
	    cachedJile.tag.textContent = css;
	
	    return cachedJile;
	  }
	
	  var tag = (0, _dom.getPopulatedTag)(css, id, options);
	  var jileProperties = {
	    css: css,
	    selectors: selectors,
	    tag: tag
	  };
	
	  return new Jile(jileProperties, options);
	};
	
	var Jile = function () {
	  function Jile(_ref, options) {
	    var _this = this;
	
	    var css = _ref.css,
	        selectors = _ref.selectors,
	        tag = _ref.tag;
	
	    _classCallCheck(this, Jile);
	
	    (0, _constants.keys)(options).forEach(function (option) {
	      Object.defineProperty(_this, getInternalOptionKey(option), {
	        configurable: false,
	        enumerable: false,
	        value: options[option],
	        writable: false
	      });
	    });
	
	    this.css = css;
	    this.selectors = selectors;
	    this.tag = tag;
	  }
	
	  /**
	   * add the tag to the DOM if it is not already there
	   */
	
	
	  _createClass(Jile, [{
	    key: 'add',
	    value: function add() {
	      if (!this.isMounted()) {
	        document.head.appendChild(this.tag);
	      }
	    }
	
	    /**
	     * remove the tag from the DOM and from cache
	     */
	
	  }, {
	    key: 'delete',
	    value: function _delete() {
	      if (this.isMounted()) {
	        this.remove();
	      }
	
	      if (jileMap[this._id]) {
	        delete jileMap[this._id];
	      }
	    }
	
	    /**
	     * is the tag currently in the DOM
	     *
	     * @returns {boolean}
	     */
	
	  }, {
	    key: 'isMounted',
	    value: function isMounted() {
	      return !!document.getElementById(this._id);
	    }
	
	    /**
	     * remove the tag from the DOM if it is there
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove() {
	      if (this.isMounted()) {
	        document.head.removeChild(this.tag);
	      }
	    }
	  }]);
	
	  return Jile;
	}();
	
	exports.Jile = Jile;
	exports.getInternalOptionKey = getInternalOptionKey;
	exports.getOriginalOptions = getOriginalOptions;
	exports.manageTagMetadataObject = manageTagMetadataObject;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * get the new tag with the textContent set to the css string passed
	 *
	 * @param {string} css
	 * @param {string} id
	 * @param {Object} sourceMap
	 * @returns {HTMLElement}
	 */
	var getPopulatedTag = function getPopulatedTag(css, id, _ref) {
	  var sourceMap = _ref.sourceMap;
	
	  if (!window || !document) {
	    return null;
	  }
	
	  if (sourceMap) {
	    var blob = new window.Blob([css], {
	      type: 'text/css'
	    });
	
	    var link = document.createElement('link');
	
	    link.rel = 'stylesheet';
	    link.id = id;
	    link.href = URL.createObjectURL(blob);
	
	    return link;
	  }
	
	  var style = document.createElement('style');
	
	  // old webkit hack
	  style.appendChild(document.createTextNode(''));
	
	  style.id = id;
	  style.textContent = css;
	
	  return style;
	};
	
	exports.getPopulatedTag = getPopulatedTag;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getRules = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // utils
	
	
	var _rules = __webpack_require__(17);
	
	/**
	 * get the rules based on the options passed, specifying a starting roo
	 *
	 * @param {Object} styles
	 * @param {Object} options
	 * @returns {Object}
	 */
	var getRules = function getRules(styles, options) {
	  return (0, _rules.getFlattenedRules)(styles, _extends({}, options, {
	    root: ''
	  }));
	};
	
	exports.getRules = getRules;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getSortedKeys = exports.getRuleType = exports.getOnlyPopulatedRules = exports.getMediaQueryRules = exports.getKeyframeRules = exports.getKeyframesPrefixedDeclarataion = exports.getFullKey = exports.getFlattenedRules = exports.getCleanRules = exports.getChildAnimationName = exports.getAnimationName = exports.keyframes = undefined;
	
	var _isNaN = __webpack_require__(18);
	
	var _isNaN2 = _interopRequireDefault(_isNaN);
	
	var _isPlainObject = __webpack_require__(3);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _merge5 = __webpack_require__(20);
	
	var _merge6 = _interopRequireDefault(_merge5);
	
	var _general = __webpack_require__(8);
	
	var _is = __webpack_require__(68);
	
	var _prefix = __webpack_require__(12);
	
	var _constants = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // external dependencies
	
	
	// utils
	
	
	// constants
	
	
	var keyframes = {};
	
	/**
	 * replace animation name with hashed value from
	 * keyframesMap
	 *
	 * @param {string} string
	 * @param {string} fieldToTest
	 * @param {Object} keyframesMap=keyframes
	 * @returns {string}
	 */
	var getChildAnimationName = function getChildAnimationName(string, fieldToTest) {
	  var keyframesMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : keyframes;
	
	  /**
	   * if its already been hashed before, just return it
	   */
	  if ((0, _is.isType)(_constants.JILE_HASH_REGEXP, string)) {
	    return string;
	  }
	
	  var regexp = new RegExp(fieldToTest);
	
	  return string.replace(regexp, function (value) {
	    return keyframesMap[value] || value;
	  });
	};
	
	/**
	 * get the cleaned animationName for the given object
	 *
	 * @param {Object} object
	 * @param {string} property
	 * @param {Object} keyframesMap=keyframes
	 * @returns {Object}
	 */
	var getAnimationName = function getAnimationName(object, property) {
	  var keyframesMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : keyframes;
	
	  for (var keyframe in keyframesMap) {
	    var animation = getChildAnimationName(object[property], keyframe, keyframesMap);
	
	    if (object[property] !== animation) {
	      object = (0, _constants.assign)(object, {
	        animation: animation
	      });
	
	      break;
	    }
	  }
	
	  return object;
	};
	
	/**
	 * merge prefixes values with rules object
	 *
	 * @param {Object} rules
	 * @returns {Object}
	 */
	var getCleanRules = function getCleanRules(rules) {
	  var cleanRules = (0, _constants.getOwnPropertyNames)(rules).reduce(function (cleanValues, key) {
	    if (!(0, _isPlainObject2.default)(rules[key])) {
	      return (0, _constants.assign)(cleanValues, _defineProperty({}, key, rules[key]));
	    }
	
	    return cleanValues;
	  }, {});
	
	  return (0, _prefix.prefix)(cleanRules);
	};
	
	/**
	 * get the complete key based on parent
	 * selectors (root) and key itself
	 *
	 * @param {string} root
	 * @param {string} key
	 * @returns {string}
	 */
	var getFullKey = function getFullKey(root, key) {
	  return '' + root + key.replace('&', '');
	};
	
	/**
	 * get the keyframes prefix name
	 * 
	 * @param {string} key
	 * @param {string} id
	 * @returns {string}
	 */
	var getKeyframesPrefixedDeclarataion = function getKeyframesPrefixedDeclarataion(key, id) {
	  var keyframesPrefixedValue = '@' + (0, _prefix.getKeyframesPrefix)();
	
	  var cleanKey = void 0;
	
	  return key.replace(_constants.KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, function (value, matchedProperty) {
	    cleanKey = value.replace(matchedProperty, '');
	
	    keyframes[cleanKey] = (0, _general.getHashedValue)(cleanKey, id);
	
	    return value;
	  }).replace(_constants.KEYFRAMES_REGEXP, function () {
	    return keyframesPrefixedValue;
	  });
	};
	
	/**
	 * merge keyframe with list of rules, prefixing
	 * all values in increment declarations
	 *
	 * @param {string} key
	 * @param {Object} value
	 * @param {string} id
	 * @returns {Object}
	 */
	var getKeyframeRules = function getKeyframeRules(key, value, _ref) {
	  var id = _ref.id;
	
	  var prefixedDeclaration = getKeyframesPrefixedDeclarataion(key, id);
	
	  var keyframeRules = (0, _constants.getOwnPropertyNames)(value).reduce(function (cleanValues, valueKey) {
	    if (valueKey !== 'from' && valueKey !== 'to' && (0, _isNaN2.default)(parseInt(valueKey, 10))) {
	      throw new Error('The increment entered for the KEYFRAMES_REGEXP declaration is invalid, entries must either ' + 'be "from", "to", or a percentage.');
	    }
	
	    return (0, _merge6.default)(cleanValues, _defineProperty({}, valueKey, (0, _prefix.prefix)(value[valueKey])));
	  }, {});
	
	  return _defineProperty({}, prefixedDeclaration, keyframeRules);
	};
	
	/**
	 * get the media query (recursively, if applicable) style rules
	 *
	 * @param {Object} value
	 * @param {boolean} hashSelectors
	 * @param {string} id
	 * @param {string} root=''
	 * @returns {Object}
	 */
	var getMediaQueryRules = function getMediaQueryRules(value, _ref3) {
	  var hashSelectors = _ref3.hashSelectors,
	      id = _ref3.id,
	      _ref3$root = _ref3.root,
	      root = _ref3$root === undefined ? '' : _ref3$root;
	
	  var styles = !root ? value : _defineProperty({}, root, value);
	  var newOptions = {
	    hashSelectors: hashSelectors,
	    id: id,
	    root: ''
	  };
	
	  return getFlattenedRules(styles, newOptions);
	};
	
	/**
	 * get the type of rule passed
	 *
	 * @param {string} key
	 * @returns {string}
	 */
	var getRuleType = function getRuleType(key) {
	  if ((0, _is.isType)(_constants.MEDIA_QUERY_REGEXP, key)) {
	    return _constants.MEDIA_QUERY_TYPE;
	  }
	
	  if ((0, _is.isType)(_constants.KEYFRAMES_REGEXP, key)) {
	    return _constants.KEYFRAMES_TYPE;
	  }
	
	  if ((0, _is.isType)(_constants.PAGE_REGEXP, key)) {
	    return _constants.PAGE_TYPE;
	  }
	
	  return _constants.STANDARD_TYPE;
	};
	
	/**
	 * get the keys sorted by the keyframes being first
	 *
	 * @param {Object} object
	 * @returns {Array<string>}
	 */
	var getSortedKeys = function getSortedKeys(object) {
	  return (0, _constants.getOwnPropertyNames)(object).sort(function (previousValue, currentValue) {
	    if ((0, _is.isType)(_constants.KEYFRAMES_REGEXP, previousValue) || (0, _is.isType)(_constants.FONT_FACE_REGEXP, previousValue)) {
	      return -1;
	    }
	
	    if ((0, _is.isType)(_constants.KEYFRAMES_REGEXP, currentValue) || (0, _is.isType)(_constants.FONT_FACE_REGEXP, currentValue)) {
	      return 1;
	    }
	
	    return 0;
	  });
	};
	
	/**
	 * get the standard rules for the object, as they are not an @ declaration
	 * 
	 * @param {Object} rules
	 * @param {Object} child
	 * @param {string} key
	 * @param {boolean} hashSelectors
	 * @param {string} id
	 * @param {string} root
	 * @returns {Object}
	 */
	var getStandardRules = function getStandardRules(rules, child, key, _ref5) {
	  var hashSelectors = _ref5.hashSelectors,
	      id = _ref5.id,
	      root = _ref5.root;
	
	  var isKeyNestedProperty = (0, _is.isNestedProperty)(key);
	  var isChildObject = (0, _isPlainObject2.default)(child);
	
	  if (!isKeyNestedProperty && !isChildObject) {
	    return rules;
	  }
	
	  var fullKey = getFullKey(root, key);
	
	  var newRules = (0, _merge6.default)(rules, _defineProperty({}, fullKey, getCleanRules(child)));
	
	  if (!isChildObject) {
	    return newRules;
	  }
	
	  return (0, _constants.getOwnPropertyNames)(child).reduce(function (rulesAcc, childKey) {
	    if ((0, _isPlainObject2.default)(child[childKey])) {
	      var _fullKey = getFullKey(root, key);
	      var childRules = getFlattenedRules(child, {
	        hashSelectors: hashSelectors,
	        id: id,
	        root: _fullKey
	      });
	
	      return (0, _merge6.default)(rulesAcc, childRules);
	    }
	
	    return rulesAcc;
	  }, newRules);
	};
	
	/**
	 * remove all empty rules
	 *
	 * @param {Object} rules
	 * @returns {Object}
	 */
	var getOnlyPopulatedRules = function getOnlyPopulatedRules(rules) {
	  return (0, _constants.getOwnPropertyNames)(rules).reduce(function (finalRules, key) {
	    var value = rules[key];
	
	    if (!(0, _constants.getOwnPropertyNames)(value).length) {
	      return finalRules;
	    }
	
	    return (0, _constants.assign)(finalRules, _defineProperty({}, key, value));
	  }, {});
	};
	
	/**
	 * get the rules in a flattened format
	 * 
	 * @param {Object} styles
	 * @param {{hashSelectors: boolean, id: string, root: string}} options
	 * @returns {Object}
	 */
	var getFlattenedRules = function getFlattenedRules(styles, options) {
	  var hashSelectors = options.hashSelectors,
	      _options$root = options.root,
	      root = _options$root === undefined ? '' : _options$root;
	
	
	  var flattenedRules = getSortedKeys(styles).reduce(function (rules, key) {
	    var child = styles[key];
	
	    if (hashSelectors) {
	      if (child.hasOwnProperty('animation')) {
	        child = getAnimationName(child, 'animation');
	      }
	
	      if (child.hasOwnProperty('animationName')) {
	        child = getAnimationName(child, 'animationName');
	      }
	    }
	
	    switch (getRuleType(key)) {
	      case _constants.MEDIA_QUERY_TYPE:
	        return (0, _merge6.default)(rules, _defineProperty({}, key, getMediaQueryRules(child, options)));
	
	      case _constants.KEYFRAMES_TYPE:
	        return (0, _merge6.default)(rules, getKeyframeRules(key, child, options));
	
	      case _constants.PAGE_TYPE:
	        if (root !== '') {
	          throw new Error('@page declarations must be top-level, as they cannot be scoped.');
	        }
	
	        return (0, _merge6.default)(rules, _defineProperty({}, key, getCleanRules(child)));
	
	      default:
	        return getStandardRules(rules, child, key, options);
	    }
	  }, {});
	
	  return getOnlyPopulatedRules(flattenedRules);
	};
	
	exports.keyframes = keyframes;
	exports.getAnimationName = getAnimationName;
	exports.getChildAnimationName = getChildAnimationName;
	exports.getCleanRules = getCleanRules;
	exports.getFlattenedRules = getFlattenedRules;
	exports.getFullKey = getFullKey;
	exports.getKeyframesPrefixedDeclarataion = getKeyframesPrefixedDeclarataion;
	exports.getKeyframeRules = getKeyframeRules;
	exports.getMediaQueryRules = getMediaQueryRules;
	exports.getOnlyPopulatedRules = getOnlyPopulatedRules;
	exports.getRuleType = getRuleType;
	exports.getSortedKeys = getSortedKeys;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isNumber = __webpack_require__(19);
	
	/**
	 * Checks if `value` is `NaN`.
	 *
	 * **Note:** This method is based on
	 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
	 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
	 * `undefined` and other non-number values.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 * @example
	 *
	 * _.isNaN(NaN);
	 * // => true
	 *
	 * _.isNaN(new Number(NaN));
	 * // => true
	 *
	 * isNaN(undefined);
	 * // => true
	 *
	 * _.isNaN(undefined);
	 * // => false
	 */
	function isNaN(value) {
	  // An `NaN` primitive is the only value that is not equal to itself.
	  // Perform the `toStringTag` check first to avoid errors with some
	  // ActiveX objects in IE.
	  return isNumber(value) && value != +value;
	}
	
	module.exports = isNaN;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    isObjectLike = __webpack_require__(7);
	
	/** `Object#toString` result references. */
	var numberTag = '[object Number]';
	
	/**
	 * Checks if `value` is classified as a `Number` primitive or object.
	 *
	 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
	 * classified as numbers, use the `_.isFinite` method.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
	 * @example
	 *
	 * _.isNumber(3);
	 * // => true
	 *
	 * _.isNumber(Number.MIN_VALUE);
	 * // => true
	 *
	 * _.isNumber(Infinity);
	 * // => true
	 *
	 * _.isNumber('3');
	 * // => false
	 */
	function isNumber(value) {
	  return typeof value == 'number' ||
	    (isObjectLike(value) && baseGetTag(value) == numberTag);
	}
	
	module.exports = isNumber;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var baseMerge = __webpack_require__(21),
	    createAssigner = __webpack_require__(61);
	
	/**
	 * This method is like `_.assign` except that it recursively merges own and
	 * inherited enumerable string keyed properties of source objects into the
	 * destination object. Source properties that resolve to `undefined` are
	 * skipped if a destination value exists. Array and plain object properties
	 * are merged recursively. Other objects and value types are overridden by
	 * assignment. Source objects are applied from left to right. Subsequent
	 * sources overwrite property assignments of previous sources.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var object = {
	 *   'a': [{ 'b': 2 }, { 'd': 4 }]
	 * };
	 *
	 * var other = {
	 *   'a': [{ 'c': 3 }, { 'e': 5 }]
	 * };
	 *
	 * _.merge(object, other);
	 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
	 */
	var merge = createAssigner(function(object, source, srcIndex) {
	  baseMerge(object, source, srcIndex);
	});
	
	module.exports = merge;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Stack = __webpack_require__(22),
	    assignMergeValue = __webpack_require__(30),
	    baseFor = __webpack_require__(34),
	    baseMergeDeep = __webpack_require__(36),
	    isObject = __webpack_require__(47),
	    keysIn = __webpack_require__(60);
	
	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  baseFor(source, function(srcValue, key) {
	    if (isObject(srcValue)) {
	      stack || (stack = new Stack);
	      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
	        : undefined;
	
	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      assignMergeValue(object, key, newValue);
	    }
	  }, keysIn);
	}
	
	module.exports = baseMerge;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var listCacheClear = __webpack_require__(23),
	    listCacheDelete = __webpack_require__(24),
	    listCacheGet = __webpack_require__(27),
	    listCacheHas = __webpack_require__(28),
	    listCacheSet = __webpack_require__(29);
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	module.exports = ListCache;


/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}
	
	module.exports = listCacheClear;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(25);
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype;
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}
	
	module.exports = listCacheDelete;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(26);
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	module.exports = assocIndexOf;


/***/ },
/* 26 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(25);
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	module.exports = listCacheGet;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(25);
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	module.exports = listCacheHas;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var assocIndexOf = __webpack_require__(25);
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	module.exports = listCacheSet;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(31),
	    eq = __webpack_require__(26);
	
	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignMergeValue;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var defineProperty = __webpack_require__(32);
	
	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}
	
	module.exports = baseAssignValue;


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(33);
	
	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());
	
	module.exports = defineProperty;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}
	
	module.exports = getValue;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(35);
	
	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;
	
	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var assignMergeValue = __webpack_require__(30),
	    cloneBuffer = __webpack_require__(37),
	    cloneTypedArray = __webpack_require__(41),
	    copyArray = __webpack_require__(44),
	    initCloneObject = __webpack_require__(45),
	    isArguments = __webpack_require__(49),
	    isArray = __webpack_require__(50),
	    isArrayLikeObject = __webpack_require__(51),
	    isBuffer = __webpack_require__(55),
	    isFunction = __webpack_require__(53),
	    isObject = __webpack_require__(47),
	    isPlainObject = __webpack_require__(3),
	    isTypedArray = __webpack_require__(56),
	    toPlainObject = __webpack_require__(57);
	
	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = object[key],
	      srcValue = source[key],
	      stacked = stack.get(srcValue);
	
	  if (stacked) {
	    assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;
	
	  var isCommon = newValue === undefined;
	
	  if (isCommon) {
	    var isArr = isArray(srcValue),
	        isBuff = !isArr && isBuffer(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
	
	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject(objValue)) {
	        newValue = copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      newValue = objValue;
	      if (isArguments(objValue)) {
	        newValue = toPlainObject(objValue);
	      }
	      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
	        newValue = initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  assignMergeValue(object, key, newValue);
	}
	
	module.exports = baseMergeDeep;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(39);
	
	/** Detect free variable `exports`. */
	var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
	
	/** Detect free variable `module`. */
	var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
	
	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;
	
	/** Built-in value references. */
	var Buffer = moduleExports ? root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;
	
	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	
	  buffer.copy(result);
	  return result;
	}
	
	module.exports = cloneBuffer;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38)(module)))

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var freeGlobal = __webpack_require__(40);
	
	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();
	
	module.exports = root;


/***/ },
/* 40 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
	
	module.exports = freeGlobal;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var cloneArrayBuffer = __webpack_require__(42);
	
	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}
	
	module.exports = cloneTypedArray;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var Uint8Array = __webpack_require__(43);
	
	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}
	
	module.exports = cloneArrayBuffer;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(39);
	
	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;
	
	module.exports = Uint8Array;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;
	
	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}
	
	module.exports = copyArray;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var baseCreate = __webpack_require__(46),
	    getPrototype = __webpack_require__(5),
	    isPrototype = __webpack_require__(48);
	
	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}
	
	module.exports = initCloneObject;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(47);
	
	/** Built-in value references. */
	var objectCreate = Object.create;
	
	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());
	
	module.exports = baseCreate;


/***/ },
/* 47 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(52),
	    isObjectLike = __webpack_require__(7);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(53),
	    isLength = __webpack_require__(54);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    isObject = __webpack_require__(47);
	
	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 54 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 55 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 56 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(58),
	    keysIn = __webpack_require__(60);
	
	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return copyObject(value, keysIn(value));
	}
	
	module.exports = toPlainObject;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(59),
	    baseAssignValue = __webpack_require__(31);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;
	
	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var baseAssignValue = __webpack_require__(31),
	    eq = __webpack_require__(26);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}
	
	module.exports = assignValue;


/***/ },
/* 60 */
/***/ function(module, exports) {

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = nativeKeysIn;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var baseRest = __webpack_require__(62),
	    isIterateeCall = __webpack_require__(67);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(63),
	    overRest = __webpack_require__(64),
	    setToString = __webpack_require__(66);
	
	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return setToString(overRest(func, start, identity), func + '');
	}
	
	module.exports = baseRest;


/***/ },
/* 63 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(65);
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = overRest;


/***/ },
/* 65 */
/***/ function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ },
/* 66 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 67 */
/***/ function(module, exports) {

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}
	
	module.exports = stubFalse;


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isUnitlessProperty = exports.isType = exports.isNestedProperty = undefined;
	
	var _isPlainObject = __webpack_require__(3);
	
	var _isPlainObject2 = _interopRequireDefault(_isPlainObject);
	
	var _constants = __webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * based on key or value, return if the property is
	 * correclty nested, throwing an error when it is invalid
	 *
	 * @param {string} key
	 * @param {string|number|object} value
	 * @returns {boolean}
	 */
	// external dependencies
	var isNestedProperty = function isNestedProperty(key, value) {
	  var isCorrectNestedProperty = key.trim().charAt(0) === '&';
	
	  if (!isCorrectNestedProperty && (0, _isPlainObject2.default)(value)) {
	    throw new TypeError('You have passed a nested object for the key "' + key + '" but not provided an & ' + 'as the first character, which likely means you were trying to create a nested selector. Please ' + 'provide the & as in this example: "& .child-class".');
	  }
	
	  return isCorrectNestedProperty;
	};
	
	/**
	 * does the key match the regexp provided
	 *
	 * @param {RegExp} regexp
	 * @param {string} key
	 * @returns {boolean}
	 */
	
	
	// constants
	var isType = function isType(regexp, key) {
	  return regexp.test(key);
	};
	
	/**
	 * is the property a unitless property and does it have a numeric value
	 *
	 * @param {string} property
	 * @returns {boolean}
	 */
	var isUnitlessProperty = function isUnitlessProperty(property) {
	  return _constants.UNITLESS_PROPERTIES.indexOf(property) !== -1;
	};
	
	exports.isNestedProperty = isNestedProperty;
	exports.isType = isType;
	exports.isUnitlessProperty = isUnitlessProperty;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getCssAndSelectorMap = undefined;
	
	var _is = __webpack_require__(68);
	
	var _rules = __webpack_require__(17);
	
	var _stylesheet = __webpack_require__(70);
	
	var _constants = __webpack_require__(11);
	
	/**
	 * build text content for injected style tag,
	 * as well as its associated map of hashed selectors
	 *
	 * @param {Object} rules
	 * @param {Object} options
	 * @returns {{selectorMap: object, textContent: string}}
	 */
	
	
	// stylesheets
	// is
	var getCssAndSelectorMap = function getCssAndSelectorMap(rules, options) {
	  var selectors = (0, _constants.getOwnPropertyNames)(rules);
	
	  var selectorMap = {},
	      rule = void 0;
	
	  var css = selectors.reduce(function (cssString, selector) {
	    rule = rules[selector];
	
	    switch ((0, _rules.getRuleType)(selector)) {
	      case _constants.KEYFRAMES_TYPE:
	        return '' + cssString + (0, _stylesheet.getKeyframesBlock)(selector, rule, options, selectorMap);
	
	      case _constants.MEDIA_QUERY_TYPE:
	        var _getMediaQueryBlockAn = (0, _stylesheet.getMediaQueryBlockAndSelectorMap)(selector, rule, options),
	            mediaQueryBlock = _getMediaQueryBlockAn.css,
	            mediaQuerySelectorMap = _getMediaQueryBlockAn.selectorMap;
	
	        (0, _constants.assign)(selectorMap, mediaQuerySelectorMap);
	
	        return '' + cssString + mediaQueryBlock;
	
	      default:
	        var _getStandardBlockAndS = (0, _stylesheet.getStandardBlockAndSelectorMap)(selector, rule, options, (0, _is.isType)(_constants.FONT_FACE_REGEXP, selector)),
	            standardBlock = _getStandardBlockAndS.css,
	            standardSelectorMap = _getStandardBlockAndS.selectorMap;
	
	        (0, _constants.assign)(selectorMap, standardSelectorMap);
	
	        return '' + cssString + standardBlock;
	    }
	  }, '');
	
	  if (options.minify) {
	    css = (0, _stylesheet.minify)(css);
	  }
	
	  return {
	    css: css,
	    selectorMap: selectorMap
	  };
	};
	
	// constants {
	
	
	// rules
	exports.getCssAndSelectorMap = getCssAndSelectorMap;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sortKeyframesKeys = exports.shouldApplyPxSuffix = exports.minify = exports.getVendorPrefix = exports.getStandardBlockAndSelectorMap = exports.getNewline = exports.getMediaQueryBlockAndSelectorMap = exports.getKeyframesBlock = exports.getIndent = exports.getHashedKeyframesName = exports.buildPropertyValues = undefined;
	
	var _isNumber = __webpack_require__(19);
	
	var _isNumber2 = _interopRequireDefault(_isNumber);
	
	var _isString = __webpack_require__(71);
	
	var _isString2 = _interopRequireDefault(_isString);
	
	var _constants = __webpack_require__(11);
	
	var _general = __webpack_require__(8);
	
	var _is = __webpack_require__(68);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * return the appropriate number of spaces,
	 * used to indent the text
	 *
	 * @param {number} spaces=0
	 * @returns {string}
	 */
	
	
	// is
	var getIndent = function getIndent() {
	  var spaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	
	  if (_constants.IS_PRODUCTION) {
	    return '';
	  }
	
	  var spaceString = '';
	
	  for (; spaces--;) {
	    spaceString += ' ';
	  }
	
	  return spaceString;
	};
	
	/**
	 * return the appropriate number of newlines,
	 * used to indent the text
	 *
	 * @param {number} newlines=1
	 * @returns {string}
	 */
	
	
	// constants {
	// external dependencies
	var getNewline = function getNewline() {
	  var newlines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	
	  if (_constants.IS_PRODUCTION) {
	    return '';
	  }
	
	  var newlineString = '';
	
	  for (; newlines--;) {
	    newlineString += '\n';
	  }
	
	  return newlineString;
	};
	
	/**
	 * if prefixed, add leading dash to property
	 *
	 * @param {string} property
	 * @returns {string}
	 */
	var getVendorPrefix = function getVendorPrefix(property) {
	  var prefixedProperty = (0, _general.toKebabCase)(property);
	  var vendorPrefix = prefixedProperty.split('-')[0];
	
	  switch (vendorPrefix) {
	    case 'moz':
	    case 'ms':
	    case 'o':
	    case 'webkit':
	      return '-' + prefixedProperty;
	
	    default:
	      return prefixedProperty;
	  }
	};
	
	/**
	 * should the px suffix be applied to the value
	 *
	 * @param {string} property
	 * @param {*} value
	 * @returns {boolean}
	 */
	var shouldApplyPxSuffix = function shouldApplyPxSuffix(property, value) {
	  return (0, _isNumber2.default)(value) && value !== 0 && !(0, _is.isUnitlessProperty)(property);
	};
	
	/**
	 * build the property values, adding 'px' if it
	 * is a number and is not a unitless value
	 *
	 * @param {string} property
	 * @param {Object} rule
	 * @param {number} indent=2
	 * @returns {string}
	 */
	var buildPropertyValues = function buildPropertyValues(property, rule) {
	  var indent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
	
	  var prefixedProperty = getVendorPrefix(property);
	  var originalValue = rule[property];
	  var realValue = shouldApplyPxSuffix(property, originalValue) ? originalValue + 'px' : originalValue;
	
	  var leadingWhitespace = '' + getNewline() + getIndent(indent);
	  var ruleString = prefixedProperty + ': ' + realValue + ';';
	
	  return '' + leadingWhitespace + ruleString;
	};
	
	/**
	 * hash the keyframes name
	 *
	 * @param {string} selector
	 * @param {string} id
	 * @param {Object} selectorMap
	 * @returns {string}
	 */
	var getHashedKeyframesName = function getHashedKeyframesName(selector, id, selectorMap) {
	  var pureValue = void 0,
	      hashedValue = void 0,
	      mappedValue = void 0;
	
	  return selector.replace(_constants.KEYFRAMES_FOLLOWED_BY_NAME_REGEXP, function (value, matchedProperty) {
	    pureValue = value.replace(matchedProperty, '');
	    mappedValue = selectorMap[pureValue];
	    hashedValue = mappedValue || (0, _general.getHashedValue)(pureValue, id);
	
	    if (!mappedValue) {
	      selectorMap[pureValue] = hashedValue;
	    }
	
	    return '' + matchedProperty + hashedValue;
	  });
	};
	
	/**
	 * make sure that string values (from|to) are ordered
	 * correctly, or if percentages are used make sure
	 * they are ordered correctly
	 *
	 * @param {string} previousValue
	 * @param {string} currentValue
	 * @returns {number|boolean}
	 */
	var sortKeyframesKeys = function sortKeyframesKeys(previousValue, currentValue) {
	  if (previousValue === 'from' || currentValue === 'to') {
	    return -1;
	  }
	
	  if (previousValue === 'to' || currentValue === 'from') {
	    return 1;
	  }
	
	  var previousNumericValue = parseInt(previousValue, 10);
	  var currentNumericValue = parseInt(currentValue, 10);
	
	  return previousNumericValue > currentNumericValue;
	};
	
	var getUnhashedSelectorObject = function getUnhashedSelectorObject(selector) {
	  return {
	    selector: selector,
	    selectorMap: {}
	  };
	};
	
	/**
	 * build the text for the block of styles
	 * for @keyframes declaration
	 *
	 * @param {string} selector
	 * @param {Object} rule
	 * @param {Object} options
	 * @param {Object} selectorMap
	 * @returns {string}
	 */
	var getKeyframesBlock = function getKeyframesBlock(selector, rule, options, selectorMap) {
	  var hashSelectors = options.hashSelectors,
	      id = options.id;
	
	  var hashedSelector = hashSelectors ? getHashedKeyframesName(selector, id, selectorMap) : selector;
	
	  var textContent = getNewline();
	
	  textContent += hashedSelector + ' {';
	
	  var sortedNames = (0, _constants.getOwnPropertyNames)(rule).sort(sortKeyframesKeys);
	
	  var incrementValue = void 0;
	
	  sortedNames.forEach(function (increment) {
	    incrementValue = rule[increment];
	
	    textContent += getNewline() + getIndent(2);
	    textContent += increment + ' {';
	
	    (0, _constants.keys)(incrementValue).forEach(function (property) {
	      textContent += buildPropertyValues(property, incrementValue, 4);
	    });
	
	    textContent += getNewline() + getIndent(2);
	    textContent += '}';
	  });
	
	  textContent += getNewline();
	  textContent += '}';
	
	  return textContent;
	};
	
	/**
	 * build the text (recursively, if applicable) for the
	 * block of styles for @media declarations
	 *
	 * @param {string} selector
	 * @param {Object} rule
	 * @param {Object} options
	 * @param {number} indent=0
	 * @returns {string}
	 */
	var getMediaQueryBlockAndSelectorMap = function getMediaQueryBlockAndSelectorMap(selector, rule, options) {
	  var indent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	  var hashSelectors = options.hashSelectors,
	      id = options.id;
	
	
	  var css = getNewline() + getIndent(indent) + (selector + ' {'),
	      selectorMap = {};
	
	  (0, _constants.getOwnPropertyNames)(rule).forEach(function (subSelector) {
	    if ((0, _is.isType)(_constants.MEDIA_QUERY_REGEXP, subSelector)) {
	      var _getMediaQueryBlockAn = getMediaQueryBlockAndSelectorMap(subSelector, rule[subSelector], options, indent + 2),
	          subSelectorCss = _getMediaQueryBlockAn.css,
	          subSelectorMap = _getMediaQueryBlockAn.selectorMap;
	
	      (0, _constants.assign)(selectorMap, subSelectorMap);
	
	      css += subSelectorCss;
	    } else {
	      (function () {
	        var subSelectorBlock = rule[subSelector];
	
	        var _ref = hashSelectors ? (0, _general.getHashedSelector)(subSelector, id) : getUnhashedSelectorObject(subSelector),
	            hashedSelector = _ref.selector,
	            hashedSelectorMap = _ref.selectorMap;
	
	        (0, _constants.assign)(selectorMap, hashedSelectorMap);
	
	        css += getNewline() + getIndent(indent + 2);
	        css += hashedSelector + ' {';
	
	        (0, _constants.keys)(subSelectorBlock).forEach(function (property) {
	          css += buildPropertyValues(property, subSelectorBlock, indent + 4);
	        });
	
	        css += getNewline() + getIndent(indent + 2) + '}';
	      })();
	    }
	  });
	
	  css += getNewline() + getIndent(indent) + '}';
	
	  return {
	    css: css,
	    selectorMap: selectorMap
	  };
	};
	
	/**
	 * minify the css
	 *
	 * @param {string} css
	 * @returns {string}
	 */
	var minify = function minify(css) {
	  if (!(0, _isString2.default)(css)) {
	    throw new TypeError('CSS passed must be a string value.');
	  }
	
	  return css.trim().replace(/\/\*[\s\S]+?\*\//g, '').replace(/[\n\r]/g, '').replace(/\s*([:;,{}])\s*/g, '$1').replace(/\s+/g, ' ').replace(/;}/g, '}').replace(/\s+(!important)/g, '$1').replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3').replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4').replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1').replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2').replace(/([\s|:])[0]+px/g, '$10');
	};
	
	/**
	 * build the text for block of styles
	 * for a standard selector declaration
	 *
	 * @param {string} selector
	 * @param {Object} rule
	 * @param {Object} options
	 * @param {boolean} isSelectorFontFace
	 * @returns {string}
	 */
	var getStandardBlockAndSelectorMap = function getStandardBlockAndSelectorMap(selector, rule, options, isSelectorFontFace) {
	  var hashSelectors = options.hashSelectors,
	      id = options.id;
	
	  var _ref2 = hashSelectors ? (0, _general.getHashedSelector)(selector, id) : getUnhashedSelectorObject(selector),
	      hashedSelector = _ref2.selector,
	      hashedSelectorMap = _ref2.selectorMap;
	
	  var css = getNewline(),
	      selectorMap = {};
	
	  (0, _constants.assign)(selectorMap, hashedSelectorMap);
	
	  css += hashedSelector + ' {';
	
	  (0, _constants.keys)(rule).forEach(function (property) {
	    if (isSelectorFontFace && property === 'src') {
	      var matches = rule[property].match(/url\((.*?).eot(.*?)\)/);
	
	      if (matches && matches[1]) {
	        var fileName = matches[1].replace(/['"]/, '');
	
	        css += getNewline() + getIndent(2) + ('src: url(\'' + fileName + '.eot\');');
	      }
	    }
	
	    css += buildPropertyValues(property, rule, 2, isSelectorFontFace);
	  });
	
	  css += getNewline();
	  css += '}';
	
	  return {
	    css: css,
	    selectorMap: selectorMap
	  };
	};
	
	exports.buildPropertyValues = buildPropertyValues;
	exports.getHashedKeyframesName = getHashedKeyframesName;
	exports.getIndent = getIndent;
	exports.getKeyframesBlock = getKeyframesBlock;
	exports.getMediaQueryBlockAndSelectorMap = getMediaQueryBlockAndSelectorMap;
	exports.getNewline = getNewline;
	exports.getStandardBlockAndSelectorMap = getStandardBlockAndSelectorMap;
	exports.getVendorPrefix = getVendorPrefix;
	exports.minify = minify;
	exports.shouldApplyPxSuffix = shouldApplyPxSuffix;
	exports.sortKeyframesKeys = sortKeyframesKeys;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	var baseGetTag = __webpack_require__(4),
	    isArray = __webpack_require__(50),
	    isObjectLike = __webpack_require__(7);
	
	/** `Object#toString` result references. */
	var stringTag = '[object String]';
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
	}
	
	module.exports = isString;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=jile.js.map