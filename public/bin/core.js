(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.async = global.async || {})));
}(this, (function (exports) { 'use strict';

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
function overRest$1(func, start, transform) {
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

// Lodash rest function without function.toString()
// remappings
function rest(func, start) {
    return overRest$1(func, start, identity);
}

var initialParams = function (fn) {
    return rest(function (args /*..., callback*/) {
        var callback = args.pop();
        fn.call(this, args, callback);
    });
};

function applyEach$1(eachfn) {
    return rest(function (fns, args) {
        var go = initialParams(function (args, callback) {
            var that = this;
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat(cb));
            }, callback);
        });
        if (args.length) {
            return go.apply(this, args);
        } else {
            return go;
        }
    });
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol$1 = root.Symbol;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

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

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

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

// A temporary value used to identify if the loop should be broken.
// See #1064, #1293
var breakLoop = {};

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

function once(fn) {
    return function () {
        if (fn === null) return;
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;

var getIterator = function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
};

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

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

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

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

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports$1 && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

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

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$3.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? { value: coll[i], key: i } : null;
    };
}

function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done) return null;
        i++;
        return { value: item.value, key: i };
    };
}

function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? { value: obj[key], key: key } : null;
    };
}

function iterator(coll) {
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }

    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}

function onlyOnce(fn) {
    return function () {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}

function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        var done = false;
        var running = 0;

        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            } else if (value === breakLoop || done && running <= 0) {
                done = true;
                return callback(null);
            } else {
                replenish();
            }
        }

        function replenish() {
            while (running < limit && !done) {
                var elem = nextElem();
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
        }

        replenish();
    };
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name eachOfLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachOfLimit(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, iteratee, callback);
}

function doLimit(fn, limit) {
    return function (iterable, iteratee, callback) {
        return fn(iterable, limit, iteratee, callback);
    };
}

// eachOf implementation optimized for array-likes
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }

    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if (++completed === length || value === breakLoop) {
            callback(null);
        }
    }

    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}

// a generic version of eachOf which can handle array, object, and iterator cases.
var eachOfGeneric = doLimit(eachOfLimit, Infinity);

/**
 * Like [`each`]{@link module:Collections.each}, except that it passes the key (or index) as the second argument
 * to the iteratee.
 *
 * @name eachOf
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEachOf
 * @category Collection
 * @see [async.each]{@link module:Collections.each}
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The `key` is the item's key, or index in the case of an
 * array. The iteratee is passed a `callback(err)` which must be called once it
 * has completed. If no error has occurred, the callback should be run without
 * arguments or with an explicit `null` argument. Invoked with
 * (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
 * var configs = {};
 *
 * async.forEachOf(obj, function (value, key, callback) {
 *     fs.readFile(__dirname + value, "utf8", function (err, data) {
 *         if (err) return callback(err);
 *         try {
 *             configs[key] = JSON.parse(data);
 *         } catch (e) {
 *             return callback(e);
 *         }
 *         callback();
 *     });
 * }, function (err) {
 *     if (err) console.error(err.message);
 *     // configs is now a map of JSON data
 *     doSomethingWith(configs);
 * });
 */
var eachOf = function (coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, iteratee, callback);
};

function doParallel(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOf, obj, iteratee, callback);
    };
}

function _asyncMap(eachfn, arr, iteratee, callback) {
    callback = callback || noop;
    arr = arr || [];
    var results = [];
    var counter = 0;

    eachfn(arr, function (value, _, callback) {
        var index = counter++;
        iteratee(value, function (err, v) {
            results[index] = v;
            callback(err);
        });
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callback
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 *
 * Note, that since this function applies the `iteratee` to each item in
 * parallel, there is no guarantee that the `iteratee` functions will complete
 * in order. However, the results array will be in the same order as the
 * original `coll`.
 *
 * If `map` is passed an Object, the results will be an Array.  The results
 * will roughly be in the order of the original Objects' keys (but this can
 * vary across JavaScript engines)
 *
 * @name map
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an Array of the
 * transformed items from the `coll`. Invoked with (err, results).
 * @example
 *
 * async.map(['file1','file2','file3'], fs.stat, function(err, results) {
 *     // results is now an array of stats for each file
 * });
 */
var map = doParallel(_asyncMap);

/**
 * Applies the provided arguments to each function in the array, calling
 * `callback` after all functions have completed. If you only provide the first
 * argument, `fns`, then it will return a function which lets you pass in the
 * arguments as if it were a single function call. If more arguments are
 * provided, `callback` is required while `args` is still optional.
 *
 * @name applyEach
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions
 * to all call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument, `fns`, is provided, it will
 * return a function which lets you pass in the arguments as if it were a single
 * function call. The signature is `(..args, callback)`. If invoked with any
 * arguments, `callback` is required.
 * @example
 *
 * async.applyEach([enableSearch, updateSchema], 'bucket', callback);
 *
 * // partial application example:
 * async.each(
 *     buckets,
 *     async.applyEach([enableSearch, updateSchema]),
 *     callback
 * );
 */
var applyEach = applyEach$1(map);

function doParallelLimit(fn) {
    return function (obj, limit, iteratee, callback) {
        return fn(_eachOfLimit(limit), obj, iteratee, callback);
    };
}

/**
 * The same as [`map`]{@link module:Collections.map} but runs a maximum of `limit` async operations at a time.
 *
 * @name mapLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a transformed
 * item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapLimit = doParallelLimit(_asyncMap);

/**
 * The same as [`map`]{@link module:Collections.map} but runs only a single async operation at a time.
 *
 * @name mapSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed item. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Results is an array of the
 * transformed items from the `coll`. Invoked with (err, results).
 */
var mapSeries = doLimit(mapLimit, 1);

/**
 * The same as [`applyEach`]{@link module:ControlFlow.applyEach} but runs only a single async operation at a time.
 *
 * @name applyEachSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.applyEach]{@link module:ControlFlow.applyEach}
 * @category Control Flow
 * @param {Array|Iterable|Object} fns - A collection of asynchronous functions to all
 * call with the same arguments
 * @param {...*} [args] - any number of separate arguments to pass to the
 * function.
 * @param {Function} [callback] - the final argument should be the callback,
 * called when all functions have completed processing.
 * @returns {Function} - If only the first argument is provided, it will return
 * a function which lets you pass in the arguments as if it were a single
 * function call.
 */
var applyEachSeries = applyEach$1(mapSeries);

/**
 * Creates a continuation function with some arguments already applied.
 *
 * Useful as a shorthand when combined with other control flow functions. Any
 * arguments passed to the returned function are added to the arguments
 * originally passed to apply.
 *
 * @name apply
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to. Invokes with (arguments...).
 * @param {...*} arguments... - Any number of arguments to automatically apply
 * when the continuation is called.
 * @example
 *
 * // using apply
 * async.parallel([
 *     async.apply(fs.writeFile, 'testfile1', 'test1'),
 *     async.apply(fs.writeFile, 'testfile2', 'test2')
 * ]);
 *
 *
 * // the same process without using apply
 * async.parallel([
 *     function(callback) {
 *         fs.writeFile('testfile1', 'test1', callback);
 *     },
 *     function(callback) {
 *         fs.writeFile('testfile2', 'test2', callback);
 *     }
 * ]);
 *
 * // It's possible to pass any number of additional arguments when calling the
 * // continuation:
 *
 * node> var fn = async.apply(sys.puts, 'one');
 * node> fn('two', 'three');
 * one
 * two
 * three
 */
var apply$2 = rest(function (fn, args) {
    return rest(function (callArgs) {
        return fn.apply(null, args.concat(callArgs));
    });
});

/**
 * Take a sync function and make it async, passing its return value to a
 * callback. This is useful for plugging sync functions into a waterfall,
 * series, or other async functions. Any arguments passed to the generated
 * function will be passed to the wrapped function (except for the final
 * callback argument). Errors thrown will be passed to the callback.
 *
 * If the function passed to `asyncify` returns a Promise, that promises's
 * resolved/rejected state will be used to call the callback, rather than simply
 * the synchronous return value.
 *
 * This also means you can asyncify ES2016 `async` functions.
 *
 * @name asyncify
 * @static
 * @memberOf module:Utils
 * @method
 * @alias wrapSync
 * @category Util
 * @param {Function} func - The synchronous function to convert to an
 * asynchronous function.
 * @returns {Function} An asynchronous wrapper of the `func`. To be invoked with
 * (callback).
 * @example
 *
 * // passing a regular synchronous function
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(JSON.parse),
 *     function (data, next) {
 *         // data is the result of parsing the text.
 *         // If there was a parsing error, it would have been caught.
 *     }
 * ], callback);
 *
 * // passing a function returning a promise
 * async.waterfall([
 *     async.apply(fs.readFile, filename, "utf8"),
 *     async.asyncify(function (contents) {
 *         return db.model.create(contents);
 *     }),
 *     function (model, next) {
 *         // `model` is the instantiated model object.
 *         // If there was an error, this function would be skipped.
 *     }
 * ], callback);
 *
 * // es6 example
 * var q = async.queue(async.asyncify(async function(file) {
 *     var intermediateStep = await processFile(file);
 *     return await somePromise(intermediateStep)
 * }));
 *
 * q.push(files);
 */
function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function (value) {
                callback(null, value);
            }, function (err) {
                callback(err.message ? err : new Error(err));
            });
        } else {
            callback(null, result);
        }
    });
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

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

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * Determines the best order for running the functions in `tasks`, based on
 * their requirements. Each function can optionally depend on other functions
 * being completed first, and each function is run as soon as its requirements
 * are satisfied.
 *
 * If any of the functions pass an error to their callback, the `auto` sequence
 * will stop. Further tasks will not execute (so any other functions depending
 * on it will not run), and the main `callback` is immediately called with the
 * error.
 *
 * Functions also receive an object containing the results of functions which
 * have completed so far as the first argument, if they have dependencies. If a
 * task function has no dependencies, it will only be passed a callback.
 *
 * @name auto
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object} tasks - An object. Each of its properties is either a
 * function or an array of requirements, with the function itself the last item
 * in the array. The object's key of a property serves as the name of the task
 * defined by that property, i.e. can be used when specifying requirements for
 * other tasks. The function receives one or two arguments:
 * * a `results` object, containing the results of the previously executed
 *   functions, only passed if the task has any dependencies,
 * * a `callback(err, result)` function, which must be called when finished,
 *   passing an `error` (which can be `null`) and the result of the function's
 *   execution.
 * @param {number} [concurrency=Infinity] - An optional `integer` for
 * determining the maximum number of tasks that can be run in parallel. By
 * default, as many as possible.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback. Results are always returned; however, if an
 * error occurs, no further `tasks` will be performed, and the results object
 * will only contain partial results. Invoked with (err, results).
 * @returns undefined
 * @example
 *
 * async.auto({
 *     // this function will just be passed a callback
 *     readData: async.apply(fs.readFile, 'data.txt', 'utf-8'),
 *     showData: ['readData', function(results, cb) {
 *         // results.readData is the file's contents
 *         // ...
 *     }]
 * }, callback);
 *
 * async.auto({
 *     get_data: function(callback) {
 *         console.log('in get_data');
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         console.log('in make_folder');
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: ['get_data', 'make_folder', function(results, callback) {
 *         console.log('in write_file', JSON.stringify(results));
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(results, callback) {
 *         console.log('in email_link', JSON.stringify(results));
 *         // once the file is written let's email a link to it...
 *         // results.write_file contains the filename returned by write_file.
 *         callback(null, {'file':results.write_file, 'email':'user@example.com'});
 *     }]
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('results = ', results);
 * });
 */
var auto = function (tasks, concurrency, callback) {
    if (typeof concurrency === 'function') {
        // concurrency is optional, shift the args.
        callback = concurrency;
        concurrency = null;
    }
    callback = once(callback || noop);
    var keys$$1 = keys(tasks);
    var numTasks = keys$$1.length;
    if (!numTasks) {
        return callback(null);
    }
    if (!concurrency) {
        concurrency = numTasks;
    }

    var results = {};
    var runningTasks = 0;
    var hasError = false;

    var listeners = Object.create(null);

    var readyTasks = [];

    // for cycle detection:
    var readyToCheck = []; // tasks that have been identified as reachable
    // without the possibility of returning to an ancestor task
    var uncheckedDependencies = {};

    baseForOwn(tasks, function (task, key) {
        if (!isArray(task)) {
            // no dependencies
            enqueueTask(key, [task]);
            readyToCheck.push(key);
            return;
        }

        var dependencies = task.slice(0, task.length - 1);
        var remainingDependencies = dependencies.length;
        if (remainingDependencies === 0) {
            enqueueTask(key, task);
            readyToCheck.push(key);
            return;
        }
        uncheckedDependencies[key] = remainingDependencies;

        arrayEach(dependencies, function (dependencyName) {
            if (!tasks[dependencyName]) {
                throw new Error('async.auto task `' + key + '` has a non-existent dependency `' + dependencyName + '` in ' + dependencies.join(', '));
            }
            addListener(dependencyName, function () {
                remainingDependencies--;
                if (remainingDependencies === 0) {
                    enqueueTask(key, task);
                }
            });
        });
    });

    checkForDeadlocks();
    processQueue();

    function enqueueTask(key, task) {
        readyTasks.push(function () {
            runTask(key, task);
        });
    }

    function processQueue() {
        if (readyTasks.length === 0 && runningTasks === 0) {
            return callback(null, results);
        }
        while (readyTasks.length && runningTasks < concurrency) {
            var run = readyTasks.shift();
            run();
        }
    }

    function addListener(taskName, fn) {
        var taskListeners = listeners[taskName];
        if (!taskListeners) {
            taskListeners = listeners[taskName] = [];
        }

        taskListeners.push(fn);
    }

    function taskComplete(taskName) {
        var taskListeners = listeners[taskName] || [];
        arrayEach(taskListeners, function (fn) {
            fn();
        });
        processQueue();
    }

    function runTask(key, task) {
        if (hasError) return;

        var taskCallback = onlyOnce(rest(function (err, args) {
            runningTasks--;
            if (args.length <= 1) {
                args = args[0];
            }
            if (err) {
                var safeResults = {};
                baseForOwn(results, function (val, rkey) {
                    safeResults[rkey] = val;
                });
                safeResults[key] = args;
                hasError = true;
                listeners = Object.create(null);

                callback(err, safeResults);
            } else {
                results[key] = args;
                taskComplete(key);
            }
        }));

        runningTasks++;
        var taskFn = task[task.length - 1];
        if (task.length > 1) {
            taskFn(results, taskCallback);
        } else {
            taskFn(taskCallback);
        }
    }

    function checkForDeadlocks() {
        // Kahn's algorithm
        // https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
        // http://connalle.blogspot.com/2013/10/topological-sortingkahn-algorithm.html
        var currentTask;
        var counter = 0;
        while (readyToCheck.length) {
            currentTask = readyToCheck.pop();
            counter++;
            arrayEach(getDependents(currentTask), function (dependent) {
                if (--uncheckedDependencies[dependent] === 0) {
                    readyToCheck.push(dependent);
                }
            });
        }

        if (counter !== numTasks) {
            throw new Error('async.auto cannot execute tasks due to a recursive dependency');
        }
    }

    function getDependents(taskName) {
        var result = [];
        baseForOwn(tasks, function (task, key) {
            if (isArray(task) && baseIndexOf(task, taskName, 0) >= 0) {
                result.push(key);
            }
        });
        return result;
    }
};

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined;
var symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff';
var rsComboMarksRange = '\\u0300-\\u036f';
var reComboHalfMarksRange = '\\ufe20-\\ufe2f';
var rsComboSymbolsRange = '\\u20d0-\\u20ff';
var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
var rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff';
var rsComboMarksRange$1 = '\\u0300-\\u036f';
var reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f';
var rsComboSymbolsRange$1 = '\\u20d0-\\u20ff';
var rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
var rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange$1 + ']';
var rsCombo = '[' + rsComboRange$1 + ']';
var rsFitz = '\\ud83c[\\udffb-\\udfff]';
var rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
var rsNonAstral = '[^' + rsAstralRange$1 + ']';
var rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';
var rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';
var rsZWJ$1 = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?';
var rsOptVar = '[' + rsVarRange$1 + ']?';
var rsOptJoin = '(?:' + rsZWJ$1 + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*';
var rsSeq = rsOptVar + reOptMod + rsOptJoin;
var rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /(=.+)?(\s*)$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

function parseParams(func) {
    func = func.toString().replace(STRIP_COMMENTS, '');
    func = func.match(FN_ARGS)[2].replace(' ', '');
    func = func ? func.split(FN_ARG_SPLIT) : [];
    func = func.map(function (arg) {
        return trim(arg.replace(FN_ARG, ''));
    });
    return func;
}

/**
 * A dependency-injected version of the [async.auto]{@link module:ControlFlow.auto} function. Dependent
 * tasks are specified as parameters to the function, after the usual callback
 * parameter, with the parameter names matching the names of the tasks it
 * depends on. This can provide even more readable task graphs which can be
 * easier to maintain.
 *
 * If a final callback is specified, the task results are similarly injected,
 * specified as named parameters after the initial error parameter.
 *
 * The autoInject function is purely syntactic sugar and its semantics are
 * otherwise equivalent to [async.auto]{@link module:ControlFlow.auto}.
 *
 * @name autoInject
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.auto]{@link module:ControlFlow.auto}
 * @category Control Flow
 * @param {Object} tasks - An object, each of whose properties is a function of
 * the form 'func([dependencies...], callback). The object's key of a property
 * serves as the name of the task defined by that property, i.e. can be used
 * when specifying requirements for other tasks.
 * * The `callback` parameter is a `callback(err, result)` which must be called
 *   when finished, passing an `error` (which can be `null`) and the result of
 *   the function's execution. The remaining parameters name other tasks on
 *   which the task is dependent, and the results from those tasks are the
 *   arguments of those parameters.
 * @param {Function} [callback] - An optional callback which is called when all
 * the tasks have been completed. It receives the `err` argument if any `tasks`
 * pass an error to their callback, and a `results` object with any completed
 * task results, similar to `auto`.
 * @example
 *
 * //  The example from `auto` can be rewritten as follows:
 * async.autoInject({
 *     get_data: function(callback) {
 *         // async code to get some data
 *         callback(null, 'data', 'converted to array');
 *     },
 *     make_folder: function(callback) {
 *         // async code to create a directory to store a file in
 *         // this is run at the same time as getting the data
 *         callback(null, 'folder');
 *     },
 *     write_file: function(get_data, make_folder, callback) {
 *         // once there is some data and the directory exists,
 *         // write the data to a file in the directory
 *         callback(null, 'filename');
 *     },
 *     email_link: function(write_file, callback) {
 *         // once the file is written let's email a link to it...
 *         // write_file contains the filename returned by write_file.
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 *
 * // If you are using a JS minifier that mangles parameter names, `autoInject`
 * // will not work with plain functions, since the parameter names will be
 * // collapsed to a single letter identifier.  To work around this, you can
 * // explicitly specify the names of the parameters your task function needs
 * // in an array, similar to Angular.js dependency injection.
 *
 * // This still has an advantage over plain `auto`, since the results a task
 * // depends on are still spread into arguments.
 * async.autoInject({
 *     //...
 *     write_file: ['get_data', 'make_folder', function(get_data, make_folder, callback) {
 *         callback(null, 'filename');
 *     }],
 *     email_link: ['write_file', function(write_file, callback) {
 *         callback(null, {'file':write_file, 'email':'user@example.com'});
 *     }]
 *     //...
 * }, function(err, results) {
 *     console.log('err = ', err);
 *     console.log('email_link = ', results.email_link);
 * });
 */
function autoInject(tasks, callback) {
    var newTasks = {};

    baseForOwn(tasks, function (taskFn, key) {
        var params;

        if (isArray(taskFn)) {
            params = taskFn.slice(0, -1);
            taskFn = taskFn[taskFn.length - 1];

            newTasks[key] = params.concat(params.length > 0 ? newTask : taskFn);
        } else if (taskFn.length === 1) {
            // no dependencies, use the function as-is
            newTasks[key] = taskFn;
        } else {
            params = parseParams(taskFn);
            if (taskFn.length === 0 && params.length === 0) {
                throw new Error("autoInject task functions require explicit parameters.");
            }

            params.pop();

            newTasks[key] = params.concat(newTask);
        }

        function newTask(results, taskCb) {
            var newArgs = arrayMap(params, function (name) {
                return results[name];
            });
            newArgs.push(taskCb);
            taskFn.apply(null, newArgs);
        }
    });

    auto(newTasks, callback);
}

var hasSetImmediate = typeof setImmediate === 'function' && setImmediate;
var hasNextTick = typeof process === 'object' && typeof process.nextTick === 'function';

function fallback(fn) {
    setTimeout(fn, 0);
}

function wrap(defer) {
    return rest(function (fn, args) {
        defer(function () {
            fn.apply(null, args);
        });
    });
}

var _defer;

if (hasSetImmediate) {
    _defer = setImmediate;
} else if (hasNextTick) {
    _defer = process.nextTick;
} else {
    _defer = fallback;
}

var setImmediate$1 = wrap(_defer);

// Simple doubly linked list (https://en.wikipedia.org/wiki/Doubly_linked_list) implementation
// used for queues. This implementation assumes that the node provided by the user can be modified
// to adjust the next and last properties. We implement only the minimal functionality
// for queue support.
function DLL() {
    this.head = this.tail = null;
    this.length = 0;
}

function setInitial(dll, node) {
    dll.length = 1;
    dll.head = dll.tail = node;
}

DLL.prototype.removeLink = function (node) {
    if (node.prev) node.prev.next = node.next;else this.head = node.next;
    if (node.next) node.next.prev = node.prev;else this.tail = node.prev;

    node.prev = node.next = null;
    this.length -= 1;
    return node;
};

DLL.prototype.empty = DLL;

DLL.prototype.insertAfter = function (node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    if (node.next) node.next.prev = newNode;else this.tail = newNode;
    node.next = newNode;
    this.length += 1;
};

DLL.prototype.insertBefore = function (node, newNode) {
    newNode.prev = node.prev;
    newNode.next = node;
    if (node.prev) node.prev.next = newNode;else this.head = newNode;
    node.prev = newNode;
    this.length += 1;
};

DLL.prototype.unshift = function (node) {
    if (this.head) this.insertBefore(this.head, node);else setInitial(this, node);
};

DLL.prototype.push = function (node) {
    if (this.tail) this.insertAfter(this.tail, node);else setInitial(this, node);
};

DLL.prototype.shift = function () {
    return this.head && this.removeLink(this.head);
};

DLL.prototype.pop = function () {
    return this.tail && this.removeLink(this.tail);
};

function queue(worker, concurrency, payload) {
    if (concurrency == null) {
        concurrency = 1;
    } else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0 && q.idle()) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                callback: callback || noop
            };

            if (insertAtFront) {
                q._tasks.unshift(item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    }

    function _next(tasks) {
        return rest(function (args) {
            workers -= 1;

            for (var i = 0, l = tasks.length; i < l; i++) {
                var task = tasks[i];
                var index = baseIndexOf(workersList, task, 0);
                if (index >= 0) {
                    workersList.splice(index);
                }

                task.callback.apply(task, args);

                if (args[0] != null) {
                    q.error(args[0], task.data);
                }
            }

            if (workers <= q.concurrency - q.buffer) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }
            q.process();
        });
    }

    var workers = 0;
    var workersList = [];
    var isProcessing = false;
    var q = {
        _tasks: new DLL(),
        concurrency: concurrency,
        payload: payload,
        saturated: noop,
        unsaturated: noop,
        buffer: concurrency / 4,
        empty: noop,
        drain: noop,
        error: noop,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(data, false, callback);
        },
        kill: function () {
            q.drain = noop;
            q._tasks.empty();
        },
        unshift: function (data, callback) {
            _insert(data, true, callback);
        },
        process: function () {
            // Avoid trying to start too many processing operations. This can occur
            // when callbacks resolve synchronously (#1267).
            if (isProcessing) {
                return;
            }
            isProcessing = true;
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var tasks = [],
                    data = [];
                var l = q._tasks.length;
                if (q.payload) l = Math.min(l, q.payload);
                for (var i = 0; i < l; i++) {
                    var node = q._tasks.shift();
                    tasks.push(node);
                    data.push(node.data);
                }

                if (q._tasks.length === 0) {
                    q.empty();
                }
                workers += 1;
                workersList.push(tasks[0]);

                if (workers === q.concurrency) {
                    q.saturated();
                }

                var cb = onlyOnce(_next(tasks));
                worker(data, cb);
            }
            isProcessing = false;
        },
        length: function () {
            return q._tasks.length;
        },
        running: function () {
            return workers;
        },
        workersList: function () {
            return workersList;
        },
        idle: function () {
            return q._tasks.length + workers === 0;
        },
        pause: function () {
            q.paused = true;
        },
        resume: function () {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            setImmediate$1(q.process);
        }
    };
    return q;
}

/**
 * A cargo of tasks for the worker function to complete. Cargo inherits all of
 * the same methods and event callbacks as [`queue`]{@link module:ControlFlow.queue}.
 * @typedef {Object} CargoObject
 * @memberOf module:ControlFlow
 * @property {Function} length - A function returning the number of items
 * waiting to be processed. Invoke like `cargo.length()`.
 * @property {number} payload - An `integer` for determining how many tasks
 * should be process per round. This property can be changed after a `cargo` is
 * created to alter the payload on-the-fly.
 * @property {Function} push - Adds `task` to the `queue`. The callback is
 * called once the `worker` has finished processing the task. Instead of a
 * single task, an array of `tasks` can be submitted. The respective callback is
 * used for every task in the list. Invoke like `cargo.push(task, [callback])`.
 * @property {Function} saturated - A callback that is called when the
 * `queue.length()` hits the concurrency and further tasks will be queued.
 * @property {Function} empty - A callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - A callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke like `cargo.idle()`.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke like `cargo.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke like `cargo.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke like `cargo.kill()`.
 */

/**
 * Creates a `cargo` object with the specified payload. Tasks added to the
 * cargo will be processed altogether (up to the `payload` limit). If the
 * `worker` is in progress, the task is queued until it becomes available. Once
 * the `worker` has completed some tasks, each callback of those tasks is
 * called. Check out [these](https://camo.githubusercontent.com/6bbd36f4cf5b35a0f11a96dcd2e97711ffc2fb37/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130382f62626330636662302d356632392d313165322d393734662d3333393763363464633835382e676966) [animations](https://camo.githubusercontent.com/f4810e00e1c5f5f8addbe3e9f49064fd5d102699/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f313637363837312f36383130312f38346339323036362d356632392d313165322d383134662d3964336430323431336266642e676966)
 * for how `cargo` and `queue` work.
 *
 * While [`queue`]{@link module:ControlFlow.queue} passes only one task to one of a group of workers
 * at a time, cargo passes an array of tasks to a single worker, repeating
 * when the worker is finished.
 *
 * @name cargo
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing an array
 * of queued tasks, which must call its `callback(err)` argument when finished,
 * with an optional `err` argument. Invoked with `(tasks, callback)`.
 * @param {number} [payload=Infinity] - An optional `integer` for determining
 * how many tasks should be processed per round; if omitted, the default is
 * unlimited.
 * @returns {module:ControlFlow.CargoObject} A cargo object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the cargo and inner queue.
 * @example
 *
 * // create a cargo object with payload 2
 * var cargo = async.cargo(function(tasks, callback) {
 *     for (var i=0; i<tasks.length; i++) {
 *         console.log('hello ' + tasks[i].name);
 *     }
 *     callback();
 * }, 2);
 *
 * // add some items
 * cargo.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * cargo.push({name: 'bar'}, function(err) {
 *     console.log('finished processing bar');
 * });
 * cargo.push({name: 'baz'}, function(err) {
 *     console.log('finished processing baz');
 * });
 */
function cargo(worker, payload) {
  return queue(worker, 1, payload);
}

/**
 * The same as [`eachOf`]{@link module:Collections.eachOf} but runs only a single async operation at a time.
 *
 * @name eachOfSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.eachOf]{@link module:Collections.eachOf}
 * @alias forEachOfSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * `key` is the item's key, or index in the case of an array. The iteratee is
 * passed a `callback(err)` which must be called once it has completed. If no
 * error has occurred, the callback should be run without arguments or with an
 * explicit `null` argument. Invoked with (item, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. Invoked with (err).
 */
var eachOfSeries = doLimit(eachOfLimit, 1);

/**
 * Reduces `coll` into a single value using an async `iteratee` to return each
 * successive step. `memo` is the initial state of the reduction. This function
 * only operates in series.
 *
 * For performance reasons, it may make sense to split a call to this function
 * into a parallel map, and then use the normal `Array.prototype.reduce` on the
 * results. This function is for situations where each step in the reduction
 * needs to be async; if you can get the data before reducing it, then it's
 * probably a good idea to do so.
 *
 * @name reduce
 * @static
 * @memberOf module:Collections
 * @method
 * @alias inject
 * @alias foldl
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 * @example
 *
 * async.reduce([1,2,3], 0, function(memo, item, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         callback(null, memo + item)
 *     });
 * }, function(err, result) {
 *     // result is now equal to the last value of memo, which is 6
 * });
 */
function reduce(coll, memo, iteratee, callback) {
    callback = once(callback || noop);
    eachOfSeries(coll, function (x, i, callback) {
        iteratee(memo, x, function (err, v) {
            memo = v;
            callback(err);
        });
    }, function (err) {
        callback(err, memo);
    });
}

/**
 * Version of the compose function that is more natural to read. Each function
 * consumes the return value of the previous function. It is the equivalent of
 * [compose]{@link module:ControlFlow.compose} with the arguments reversed.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name seq
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.compose]{@link module:ControlFlow.compose}
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} a function that composes the `functions` in order
 * @example
 *
 * // Requires lodash (or underscore), express3 and dresende's orm2.
 * // Part of an app, that fetches cats of the logged user.
 * // This example uses `seq` function to avoid overnesting and error
 * // handling clutter.
 * app.get('/cats', function(request, response) {
 *     var User = request.models.User;
 *     async.seq(
 *         _.bind(User.get, User),  // 'User.get' has signature (id, callback(err, data))
 *         function(user, fn) {
 *             user.getCats(fn);      // 'getCats' has signature (callback(err, data))
 *         }
 *     )(req.session.user_id, function (err, cats) {
 *         if (err) {
 *             console.error(err);
 *             response.json({ status: 'error', message: err.message });
 *         } else {
 *             response.json({ status: 'ok', message: 'Cats found', data: cats });
 *         }
 *     });
 * });
 */
var seq$1 = rest(function seq(functions) {
    return rest(function (args) {
        var that = this;

        var cb = args[args.length - 1];
        if (typeof cb == 'function') {
            args.pop();
        } else {
            cb = noop;
        }

        reduce(functions, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat(rest(function (err, nextargs) {
                cb(err, nextargs);
            })));
        }, function (err, results) {
            cb.apply(that, [err].concat(results));
        });
    });
});

/**
 * Creates a function which is a composition of the passed asynchronous
 * functions. Each function consumes the return value of the function that
 * follows. Composing functions `f()`, `g()`, and `h()` would produce the result
 * of `f(g(h()))`, only this version uses callbacks to obtain the return values.
 *
 * Each function is executed with the `this` binding of the composed function.
 *
 * @name compose
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {...Function} functions - the asynchronous functions to compose
 * @returns {Function} an asynchronous function that is the composed
 * asynchronous `functions`
 * @example
 *
 * function add1(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n + 1);
 *     }, 10);
 * }
 *
 * function mul3(n, callback) {
 *     setTimeout(function () {
 *         callback(null, n * 3);
 *     }, 10);
 * }
 *
 * var add1mul3 = async.compose(mul3, add1);
 * add1mul3(4, function (err, result) {
 *     // result now equals 15
 * });
 */
var compose = rest(function (args) {
  return seq$1.apply(null, args.reverse());
});

function concat$1(eachfn, arr, fn, callback) {
    var result = [];
    eachfn(arr, function (x, index, cb) {
        fn(x, function (err, y) {
            result = result.concat(y || []);
            cb(err);
        });
    }, function (err) {
        callback(err, result);
    });
}

/**
 * Applies `iteratee` to each item in `coll`, concatenating the results. Returns
 * the concatenated list. The `iteratee`s are called in parallel, and the
 * results are concatenated as they return. There is no guarantee that the
 * results array will be returned in the original order of `coll` passed to the
 * `iteratee` function.
 *
 * @name concat
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 * @example
 *
 * async.concat(['dir1','dir2','dir3'], fs.readdir, function(err, files) {
 *     // files is now a list of filenames that exist in the 3 directories
 * });
 */
var concat = doParallel(concat$1);

function doSeries(fn) {
    return function (obj, iteratee, callback) {
        return fn(eachOfSeries, obj, iteratee, callback);
    };
}

/**
 * The same as [`concat`]{@link module:Collections.concat} but runs only a single async operation at a time.
 *
 * @name concatSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.concat]{@link module:Collections.concat}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, results)` which must be called once
 * it has completed with an error (which can be `null`) and an array of results.
 * Invoked with (item, callback).
 * @param {Function} [callback(err)] - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is an array
 * containing the concatenated results of the `iteratee` function. Invoked with
 * (err, results).
 */
var concatSeries = doSeries(concat$1);

/**
 * Returns a function that when called, calls-back with the values provided.
 * Useful as the first function in a [`waterfall`]{@link module:ControlFlow.waterfall}, or for plugging values in to
 * [`auto`]{@link module:ControlFlow.auto}.
 *
 * @name constant
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {...*} arguments... - Any number of arguments to automatically invoke
 * callback with.
 * @returns {Function} Returns a function that when invoked, automatically
 * invokes the callback with the previous given arguments.
 * @example
 *
 * async.waterfall([
 *     async.constant(42),
 *     function (value, next) {
 *         // value === 42
 *     },
 *     //...
 * ], callback);
 *
 * async.waterfall([
 *     async.constant(filename, "utf8"),
 *     fs.readFile,
 *     function (fileData, next) {
 *         //...
 *     }
 *     //...
 * ], callback);
 *
 * async.auto({
 *     hostname: async.constant("https://server.net/"),
 *     port: findFreePort,
 *     launchServer: ["hostname", "port", function (options, cb) {
 *         startServer(options, cb);
 *     }],
 *     //...
 * }, callback);
 */
var constant = rest(function (values) {
    var args = [null].concat(values);
    return initialParams(function (ignoredArgs, callback) {
        return callback.apply(this, args);
    });
});

function _createTester(check, getResult) {
    return function (eachfn, arr, iteratee, cb) {
        cb = cb || noop;
        var testPassed = false;
        var testResult;
        eachfn(arr, function (value, _, callback) {
            iteratee(value, function (err, result) {
                if (err) {
                    callback(err);
                } else if (check(result) && !testResult) {
                    testPassed = true;
                    testResult = getResult(true, value);
                    callback(null, breakLoop);
                } else {
                    callback();
                }
            });
        }, function (err) {
            if (err) {
                cb(err);
            } else {
                cb(null, testPassed ? testResult : getResult(false));
            }
        });
    };
}

function _findGetResult(v, x) {
    return x;
}

/**
 * Returns the first value in `coll` that passes an async truth test. The
 * `iteratee` is applied in parallel, meaning the first iteratee to return
 * `true` will fire the detect `callback` with that result. That means the
 * result might not be the first item in the original `coll` (in terms of order)
 * that passes the test.

 * If order within the original `coll` is important, then look at
 * [`detectSeries`]{@link module:Collections.detectSeries}.
 *
 * @name detect
 * @static
 * @memberOf module:Collections
 * @method
 * @alias find
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 * @example
 *
 * async.detect(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // result now equals the first file in the list that exists
 * });
 */
var detect = doParallel(_createTester(identity, _findGetResult));

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name detectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findLimit
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectLimit = doParallelLimit(_createTester(identity, _findGetResult));

/**
 * The same as [`detect`]{@link module:Collections.detect} but runs only a single async operation at a time.
 *
 * @name detectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.detect]{@link module:Collections.detect}
 * @alias findSeries
 * @category Collections
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, truthValue)` which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the `iteratee` functions have finished.
 * Result will be the first item in the array that passes the truth test
 * (iteratee) or the value `undefined` if none passed. Invoked with
 * (err, result).
 */
var detectSeries = doLimit(detectLimit, 1);

function consoleFunc(name) {
    return rest(function (fn, args) {
        fn.apply(null, args.concat(rest(function (err, args) {
            if (typeof console === 'object') {
                if (err) {
                    if (console.error) {
                        console.error(err);
                    }
                } else if (console[name]) {
                    arrayEach(args, function (x) {
                        console[name](x);
                    });
                }
            }
        })));
    });
}

/**
 * Logs the result of an `async` function to the `console` using `console.dir`
 * to display the properties of the resulting object. Only works in Node.js or
 * in browsers that support `console.dir` and `console.error` (such as FF and
 * Chrome). If multiple arguments are returned from the async function,
 * `console.dir` is called on each argument in order.
 *
 * @name dir
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, {hello: name});
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.dir(hello, 'world');
 * {hello: 'world'}
 */
var dir = consoleFunc('dir');

/**
 * The post-check version of [`during`]{@link module:ControlFlow.during}. To reflect the difference in
 * the order of operations, the arguments `test` and `fn` are switched.
 *
 * Also a version of [`doWhilst`]{@link module:ControlFlow.doWhilst} with asynchronous `test` function.
 * @name doDuring
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.during]{@link module:ControlFlow.during}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (...args, callback), where `...args` are the
 * non-error args from the previous callback of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error if one occured, otherwise `null`.
 */
function doDuring(fn, test, callback) {
    callback = onlyOnce(callback || noop);

    var next = rest(function (err, args) {
        if (err) return callback(err);
        args.push(check);
        test.apply(this, args);
    });

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    check(null, true);
}

/**
 * The post-check version of [`whilst`]{@link module:ControlFlow.whilst}. To reflect the difference in
 * the order of operations, the arguments `test` and `iteratee` are switched.
 *
 * `doWhilst` is to `whilst` as `do while` is to `while` in plain JavaScript.
 *
 * @name doWhilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} iteratee - A function which is called each time `test`
 * passes. The function is passed a `callback(err)`, which must be called once
 * it has completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `iteratee`. Invoked with the non-error callback results of 
 * `iteratee`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped.
 * `callback` will be passed an error and any arguments passed to the final
 * `iteratee`'s callback. Invoked with (err, [results]);
 */
function doWhilst(iteratee, test, callback) {
    callback = onlyOnce(callback || noop);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test.apply(this, args)) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Like ['doWhilst']{@link module:ControlFlow.doWhilst}, except the `test` is inverted. Note the
 * argument ordering differs from `until`.
 *
 * @name doUntil
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.doWhilst]{@link module:ControlFlow.doWhilst}
 * @category Control Flow
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} test - synchronous truth test to perform after each
 * execution of `fn`. Invoked with the non-error callback results of `fn`.
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function doUntil(fn, test, callback) {
    doWhilst(fn, function () {
        return !test.apply(this, arguments);
    }, callback);
}

/**
 * Like [`whilst`]{@link module:ControlFlow.whilst}, except the `test` is an asynchronous function that
 * is passed a callback in the form of `function (err, truth)`. If error is
 * passed to `test` or `fn`, the main callback is immediately called with the
 * value of the error.
 *
 * @name during
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - asynchronous truth test to perform before each
 * execution of `fn`. Invoked with (callback).
 * @param {Function} fn - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error, if one occured, otherwise `null`.
 * @example
 *
 * var count = 0;
 *
 * async.during(
 *     function (callback) {
 *         return callback(null, count < 5);
 *     },
 *     function (callback) {
 *         count++;
 *         setTimeout(callback, 1000);
 *     },
 *     function (err) {
 *         // 5 seconds have passed
 *     }
 * );
 */
function during(test, fn, callback) {
    callback = onlyOnce(callback || noop);

    function next(err) {
        if (err) return callback(err);
        test(check);
    }

    function check(err, truth) {
        if (err) return callback(err);
        if (!truth) return callback(null);
        fn(next);
    }

    test(check);
}

function _withoutIndex(iteratee) {
    return function (value, index, callback) {
        return iteratee(value, callback);
    };
}

/**
 * Applies the function `iteratee` to each item in `coll`, in parallel.
 * The `iteratee` is called with an item from the list, and a callback for when
 * it has finished. If the `iteratee` passes an error to its `callback`, the
 * main `callback` (for the `each` function) is immediately called with the
 * error.
 *
 * Note, that since this function applies `iteratee` to each item in parallel,
 * there is no guarantee that the iteratee functions will complete in order.
 *
 * @name each
 * @static
 * @memberOf module:Collections
 * @method
 * @alias forEach
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item
 * in `coll`. The iteratee is passed a `callback(err)` which must be called once
 * it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is not
 * passed to the iteratee. Invoked with (item, callback). If you need the index,
 * use `eachOf`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 * @example
 *
 * // assuming openFiles is an array of file names and saveFile is a function
 * // to save the modified contents of that file:
 *
 * async.each(openFiles, saveFile, function(err){
 *   // if any of the saves produced an error, err would equal that error
 * });
 *
 * // assuming openFiles is an array of file names
 * async.each(openFiles, function(file, callback) {
 *
 *     // Perform operation on file here.
 *     console.log('Processing file ' + file);
 *
 *     if( file.length > 32 ) {
 *       console.log('This file name is too long');
 *       callback('File name too long');
 *     } else {
 *       // Do work to process file here
 *       console.log('File processed');
 *       callback();
 *     }
 * }, function(err) {
 *     // if any of the file processing produced an error, err would equal that error
 *     if( err ) {
 *       // One of the iterations produced an error.
 *       // All processing will now stop.
 *       console.log('A file failed to process');
 *     } else {
 *       console.log('All files have been processed successfully');
 *     }
 * });
 */
function eachLimit(coll, iteratee, callback) {
  eachOf(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs a maximum of `limit` async operations at a time.
 *
 * @name eachLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each item in `coll`. The
 * iteratee is passed a `callback(err)` which must be called once it has
 * completed. If no error has occurred, the `callback` should be run without
 * arguments or with an explicit `null` argument. The array index is not passed
 * to the iteratee. Invoked with (item, callback). If you need the index, use
 * `eachOfLimit`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
function eachLimit$1(coll, limit, iteratee, callback) {
  _eachOfLimit(limit)(coll, _withoutIndex(iteratee), callback);
}

/**
 * The same as [`each`]{@link module:Collections.each} but runs only a single async operation at a time.
 *
 * @name eachSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.each]{@link module:Collections.each}
 * @alias forEachSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each
 * item in `coll`. The iteratee is passed a `callback(err)` which must be called
 * once it has completed. If no error has occurred, the `callback` should be run
 * without arguments or with an explicit `null` argument. The array index is
 * not passed to the iteratee. Invoked with (item, callback). If you need the
 * index, use `eachOfSeries`.
 * @param {Function} [callback] - A callback which is called when all
 * `iteratee` functions have finished, or an error occurs. Invoked with (err).
 */
var eachSeries = doLimit(eachLimit$1, 1);

/**
 * Wrap an async function and ensure it calls its callback on a later tick of
 * the event loop.  If the function already calls its callback on a next tick,
 * no extra deferral is added. This is useful for preventing stack overflows
 * (`RangeError: Maximum call stack size exceeded`) and generally keeping
 * [Zalgo](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony)
 * contained.
 *
 * @name ensureAsync
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - an async function, one that expects a node-style
 * callback as its last argument.
 * @returns {Function} Returns a wrapped function with the exact same call
 * signature as the function passed in.
 * @example
 *
 * function sometimesAsync(arg, callback) {
 *     if (cache[arg]) {
 *         return callback(null, cache[arg]); // this would be synchronous!!
 *     } else {
 *         doSomeIO(arg, callback); // this IO would be asynchronous
 *     }
 * }
 *
 * // this has a risk of stack overflows if many results are cached in a row
 * async.mapSeries(args, sometimesAsync, done);
 *
 * // this will defer sometimesAsync's callback if necessary,
 * // preventing stack overflows
 * async.mapSeries(args, async.ensureAsync(sometimesAsync), done);
 */
function ensureAsync(fn) {
    return initialParams(function (args, callback) {
        var sync = true;
        args.push(function () {
            var innerArgs = arguments;
            if (sync) {
                setImmediate$1(function () {
                    callback.apply(null, innerArgs);
                });
            } else {
                callback.apply(null, innerArgs);
            }
        });
        fn.apply(this, args);
        sync = false;
    });
}

function notId(v) {
    return !v;
}

/**
 * Returns `true` if every element in `coll` satisfies an async test. If any
 * iteratee call returns `false`, the main `callback` is immediately called.
 *
 * @name every
 * @static
 * @memberOf module:Collections
 * @method
 * @alias all
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 * @example
 *
 * async.every(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then every file exists
 * });
 */
var every = doParallel(_createTester(notId, notId));

/**
 * The same as [`every`]{@link module:Collections.every} but runs a maximum of `limit` async operations at a time.
 *
 * @name everyLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everyLimit = doParallelLimit(_createTester(notId, notId));

/**
 * The same as [`every`]{@link module:Collections.every} but runs only a single async operation at a time.
 *
 * @name everySeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.every]{@link module:Collections.every}
 * @alias allSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the
 * collection in parallel. The iteratee is passed a `callback(err, truthValue)`
 * which must be called with a  boolean argument once it has completed. Invoked
 * with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result will be either `true` or `false`
 * depending on the values of the async tests. Invoked with (err, result).
 */
var everySeries = doLimit(everyLimit, 1);

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

function filterArray(eachfn, arr, iteratee, callback) {
    var truthValues = new Array(arr.length);
    eachfn(arr, function (x, index, callback) {
        iteratee(x, function (err, v) {
            truthValues[index] = !!v;
            callback(err);
        });
    }, function (err) {
        if (err) return callback(err);
        var results = [];
        for (var i = 0; i < arr.length; i++) {
            if (truthValues[i]) results.push(arr[i]);
        }
        callback(null, results);
    });
}

function filterGeneric(eachfn, coll, iteratee, callback) {
    var results = [];
    eachfn(coll, function (x, index, callback) {
        iteratee(x, function (err, v) {
            if (err) {
                callback(err);
            } else {
                if (v) {
                    results.push({ index: index, value: x });
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, arrayMap(results.sort(function (a, b) {
                return a.index - b.index;
            }), baseProperty('value')));
        }
    });
}

function _filter(eachfn, coll, iteratee, callback) {
    var filter = isArrayLike(coll) ? filterArray : filterGeneric;
    filter(eachfn, coll, iteratee, callback || noop);
}

/**
 * Returns a new array of all the values in `coll` which pass an async truth
 * test. This operation is performed in parallel, but the results array will be
 * in the same order as the original.
 *
 * @name filter
 * @static
 * @memberOf module:Collections
 * @method
 * @alias select
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.filter(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of the existing files
 * });
 */
var filter = doParallel(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name filterLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var filterLimit = doParallelLimit(_filter);

/**
 * The same as [`filter`]{@link module:Collections.filter} but runs only a single async operation at a time.
 *
 * @name filterSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @alias selectSeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results)
 */
var filterSeries = doLimit(filterLimit, 1);

/**
 * Calls the asynchronous function `fn` with a callback parameter that allows it
 * to call itself again, in series, indefinitely.

 * If an error is passed to the
 * callback then `errback` is called with the error, and execution stops,
 * otherwise it will never be called.
 *
 * @name forever
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} fn - a function to call repeatedly. Invoked with (next).
 * @param {Function} [errback] - when `fn` passes an error to it's callback,
 * this function will be called, and execution stops. Invoked with (err).
 * @example
 *
 * async.forever(
 *     function(next) {
 *         // next is suitable for passing to things that need a callback(err [, whatever]);
 *         // it will result in this function being called again.
 *     },
 *     function(err) {
 *         // if next is called with a value in its first parameter, it will appear
 *         // in here as 'err', and execution will stop.
 *     }
 * );
 */
function forever(fn, errback) {
    var done = onlyOnce(errback || noop);
    var task = ensureAsync(fn);

    function next(err) {
        if (err) return done(err);
        task(next);
    }
    next();
}

/**
 * Logs the result of an `async` function to the `console`. Only works in
 * Node.js or in browsers that support `console.log` and `console.error` (such
 * as FF and Chrome). If multiple arguments are returned from the async
 * function, `console.log` is called on each argument in order.
 *
 * @name log
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} function - The function you want to eventually apply all
 * arguments to.
 * @param {...*} arguments... - Any number of arguments to apply to the function.
 * @example
 *
 * // in a module
 * var hello = function(name, callback) {
 *     setTimeout(function() {
 *         callback(null, 'hello ' + name);
 *     }, 1000);
 * };
 *
 * // in the node repl
 * node> async.log(hello, 'world');
 * 'hello world'
 */
var log = consoleFunc('log');

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name mapValuesLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
function mapValuesLimit(obj, limit, iteratee, callback) {
    callback = once(callback || noop);
    var newObj = {};
    eachOfLimit(obj, limit, function (val, key, next) {
        iteratee(val, key, function (err, result) {
            if (err) return next(err);
            newObj[key] = result;
            next();
        });
    }, function (err) {
        callback(err, newObj);
    });
}

/**
 * A relative of [`map`]{@link module:Collections.map}, designed for use with objects.
 *
 * Produces a new Object by mapping each value of `obj` through the `iteratee`
 * function. The `iteratee` is called each `value` and `key` from `obj` and a
 * callback for when it has finished processing. Each of these callbacks takes
 * two arguments: an `error`, and the transformed item from `obj`. If `iteratee`
 * passes an error to its callback, the main `callback` (for the `mapValues`
 * function) is immediately called with the error.
 *
 * Note, the order of the keys in the result is not guaranteed.  The keys will
 * be roughly in the order they complete, (but this is very engine-specific)
 *
 * @name mapValues
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value and key in
 * `coll`. The iteratee is passed a `callback(err, transformed)` which must be
 * called once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 * @example
 *
 * async.mapValues({
 *     f1: 'file1',
 *     f2: 'file2',
 *     f3: 'file3'
 * }, function (file, key, callback) {
 *   fs.stat(file, callback);
 * }, function(err, result) {
 *     // result is now a map of stats for each file, e.g.
 *     // {
 *     //     f1: [stats for file1],
 *     //     f2: [stats for file2],
 *     //     f3: [stats for file3]
 *     // }
 * });
 */

var mapValues = doLimit(mapValuesLimit, Infinity);

/**
 * The same as [`mapValues`]{@link module:Collections.mapValues} but runs only a single async operation at a time.
 *
 * @name mapValuesSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.mapValues]{@link module:Collections.mapValues}
 * @category Collection
 * @param {Object} obj - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each value in `obj`.
 * The iteratee is passed a `callback(err, transformed)` which must be called
 * once it has completed with an error (which can be `null`) and a
 * transformed value. Invoked with (value, key, callback).
 * @param {Function} [callback] - A callback which is called when all `iteratee`
 * functions have finished, or an error occurs. `result` is a new object consisting
 * of each key from `obj`, with each transformed value on the right-hand side.
 * Invoked with (err, result).
 */
var mapValuesSeries = doLimit(mapValuesLimit, 1);

function has(obj, key) {
    return key in obj;
}

/**
 * Caches the results of an `async` function. When creating a hash to store
 * function results against, the callback is omitted from the hash and an
 * optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key,
 * which may work reasonably if it is a string or a data type that converts to a
 * distinct string. Note that objects and arrays will not behave reasonably.
 * Neither will cases where the other arguments are significant. In such cases,
 * specify your own hash function.
 *
 * The cache of results is exposed as the `memo` property of the function
 * returned by `memoize`.
 *
 * @name memoize
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash
 * for storing results. It has all the arguments applied to it apart from the
 * callback, and must be synchronous.
 * @returns {Function} a memoized version of `fn`
 * @example
 *
 * var slow_fn = function(name, callback) {
 *     // do something
 *     callback(null, result);
 * };
 * var fn = async.memoize(slow_fn);
 *
 * // fn can now be used as if it were slow_fn
 * fn('some name', function() {
 *     // callback
 * });
 */
function memoize(fn, hasher) {
    var memo = Object.create(null);
    var queues = Object.create(null);
    hasher = hasher || identity;
    var memoized = initialParams(function memoized(args, callback) {
        var key = hasher.apply(null, args);
        if (has(memo, key)) {
            setImmediate$1(function () {
                callback.apply(null, memo[key]);
            });
        } else if (has(queues, key)) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            fn.apply(null, args.concat(rest(function (args) {
                memo[key] = args;
                var q = queues[key];
                delete queues[key];
                for (var i = 0, l = q.length; i < l; i++) {
                    q[i].apply(null, args);
                }
            })));
        }
    });
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}

/**
 * Calls `callback` on a later loop around the event loop. In Node.js this just
 * calls `setImmediate`.  In the browser it will use `setImmediate` if
 * available, otherwise `setTimeout(callback, 0)`, which means other higher
 * priority events may precede the execution of `callback`.
 *
 * This is used internally for browser-compatibility purposes.
 *
 * @name nextTick
 * @static
 * @memberOf module:Utils
 * @method
 * @alias setImmediate
 * @category Util
 * @param {Function} callback - The function to call on a later loop around
 * the event loop. Invoked with (args...).
 * @param {...*} args... - any number of additional arguments to pass to the
 * callback on the next tick.
 * @example
 *
 * var call_order = [];
 * async.nextTick(function() {
 *     call_order.push('two');
 *     // call_order now equals ['one','two']
 * });
 * call_order.push('one');
 *
 * async.setImmediate(function (a, b, c) {
 *     // a, b, and c equal 1, 2, and 3
 * }, 1, 2, 3);
 */
var _defer$1;

if (hasNextTick) {
    _defer$1 = process.nextTick;
} else if (hasSetImmediate) {
    _defer$1 = setImmediate;
} else {
    _defer$1 = fallback;
}

var nextTick = wrap(_defer$1);

function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};

    eachfn(tasks, function (task, key, callback) {
        task(rest(function (err, args) {
            if (args.length <= 1) {
                args = args[0];
            }
            results[key] = args;
            callback(err);
        }));
    }, function (err) {
        callback(err, results);
    });
}

/**
 * Run the `tasks` collection of functions in parallel, without waiting until
 * the previous function has completed. If any of the functions pass an error to
 * its callback, the main `callback` is immediately called with the value of the
 * error. Once the `tasks` have completed, the results are passed to the final
 * `callback` as an array.
 *
 * **Note:** `parallel` is about kicking-off I/O tasks in parallel, not about
 * parallel execution of code.  If your tasks do not use any timers or perform
 * any I/O, they will actually be executed in series.  Any synchronous setup
 * sections for each task will happen one after the other.  JavaScript remains
 * single-threaded.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 * results from {@link async.parallel}.
 *
 * @name parallel
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 * @example
 * async.parallel([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // the results array will equal ['one','two'] even though
 *     // the second function had a shorter timeout.
 * });
 *
 * // an example using an object instead of an array
 * async.parallel({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equals to: {one: 1, two: 2}
 * });
 */
function parallelLimit(tasks, callback) {
  _parallel(eachOf, tasks, callback);
}

/**
 * The same as [`parallel`]{@link module:ControlFlow.parallel} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name parallelLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.parallel]{@link module:ControlFlow.parallel}
 * @category Control Flow
 * @param {Array|Collection} tasks - A collection containing functions to run.
 * Each function is passed a `callback(err, result)` which it must call on
 * completion with an error `err` (which can be `null`) and an optional `result`
 * value.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed successfully. This function gets a results array
 * (or object) containing all the result arguments passed to the task callbacks.
 * Invoked with (err, results).
 */
function parallelLimit$1(tasks, limit, callback) {
  _parallel(_eachOfLimit(limit), tasks, callback);
}

/**
 * A queue of tasks for the worker function to complete.
 * @typedef {Object} QueueObject
 * @memberOf module:ControlFlow
 * @property {Function} length - a function returning the number of items
 * waiting to be processed. Invoke with `queue.length()`.
 * @property {boolean} started - a boolean indicating whether or not any
 * items have been pushed and processed by the queue.
 * @property {Function} running - a function returning the number of items
 * currently being processed. Invoke with `queue.running()`.
 * @property {Function} workersList - a function returning the array of items
 * currently being processed. Invoke with `queue.workersList()`.
 * @property {Function} idle - a function returning false if there are items
 * waiting or being processed, or true if not. Invoke with `queue.idle()`.
 * @property {number} concurrency - an integer for determining how many `worker`
 * functions should be run in parallel. This property can be changed after a
 * `queue` is created to alter the concurrency on-the-fly.
 * @property {Function} push - add a new task to the `queue`. Calls `callback`
 * once the `worker` has finished processing the task. Instead of a single task,
 * a `tasks` array can be submitted. The respective callback is used for every
 * task in the list. Invoke with `queue.push(task, [callback])`,
 * @property {Function} unshift - add a new task to the front of the `queue`.
 * Invoke with `queue.unshift(task, [callback])`.
 * @property {Function} saturated - a callback that is called when the number of
 * running workers hits the `concurrency` limit, and further tasks will be
 * queued.
 * @property {Function} unsaturated - a callback that is called when the number
 * of running workers is less than the `concurrency` & `buffer` limits, and
 * further tasks will not be queued.
 * @property {number} buffer - A minimum threshold buffer in order to say that
 * the `queue` is `unsaturated`.
 * @property {Function} empty - a callback that is called when the last item
 * from the `queue` is given to a `worker`.
 * @property {Function} drain - a callback that is called when the last item
 * from the `queue` has returned from the `worker`.
 * @property {Function} error - a callback that is called when a task errors.
 * Has the signature `function(error, task)`.
 * @property {boolean} paused - a boolean for determining whether the queue is
 * in a paused state.
 * @property {Function} pause - a function that pauses the processing of tasks
 * until `resume()` is called. Invoke with `queue.pause()`.
 * @property {Function} resume - a function that resumes the processing of
 * queued tasks when the queue is paused. Invoke with `queue.resume()`.
 * @property {Function} kill - a function that removes the `drain` callback and
 * empties remaining tasks from the queue forcing it to go idle. Invoke with `queue.kill()`.
 */

/**
 * Creates a `queue` object with the specified `concurrency`. Tasks added to the
 * `queue` are processed in parallel (up to the `concurrency` limit). If all
 * `worker`s are in progress, the task is queued until one becomes available.
 * Once a `worker` completes a `task`, that `task`'s callback is called.
 *
 * @name queue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} [concurrency=1] - An `integer` for determining how many
 * `worker` functions should be run in parallel.  If omitted, the concurrency
 * defaults to `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A queue object to manage the tasks. Callbacks can
 * attached as certain properties to listen for specific events during the
 * lifecycle of the queue.
 * @example
 *
 * // create a queue object with concurrency 2
 * var q = async.queue(function(task, callback) {
 *     console.log('hello ' + task.name);
 *     callback();
 * }, 2);
 *
 * // assign a callback
 * q.drain = function() {
 *     console.log('all items have been processed');
 * };
 *
 * // add some items to the queue
 * q.push({name: 'foo'}, function(err) {
 *     console.log('finished processing foo');
 * });
 * q.push({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 *
 * // add some items to the queue (batch-wise)
 * q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
 *     console.log('finished processing item');
 * });
 *
 * // add some items to the front of the queue
 * q.unshift({name: 'bar'}, function (err) {
 *     console.log('finished processing bar');
 * });
 */
var queue$1 = function (worker, concurrency) {
  return queue(function (items, cb) {
    worker(items[0], cb);
  }, concurrency, 1);
};

/**
 * The same as [async.queue]{@link module:ControlFlow.queue} only tasks are assigned a priority and
 * completed in ascending priority order.
 *
 * @name priorityQueue
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.queue]{@link module:ControlFlow.queue}
 * @category Control Flow
 * @param {Function} worker - An asynchronous function for processing a queued
 * task, which must call its `callback(err)` argument when finished, with an
 * optional `error` as an argument.  If you want to handle errors from an
 * individual task, pass a callback to `q.push()`. Invoked with
 * (task, callback).
 * @param {number} concurrency - An `integer` for determining how many `worker`
 * functions should be run in parallel.  If omitted, the concurrency defaults to
 * `1`.  If the concurrency is `0`, an error is thrown.
 * @returns {module:ControlFlow.QueueObject} A priorityQueue object to manage the tasks. There are two
 * differences between `queue` and `priorityQueue` objects:
 * * `push(task, priority, [callback])` - `priority` should be a number. If an
 *   array of `tasks` is given, all tasks will be assigned the same priority.
 * * The `unshift` method was removed.
 */
var priorityQueue = function (worker, concurrency) {
    // Start with a normal queue
    var q = queue$1(worker, concurrency);

    // Override push to accept second parameter representing priority
    q.push = function (data, priority, callback) {
        if (callback == null) callback = noop;
        if (typeof callback !== 'function') {
            throw new Error('task callback must be a function');
        }
        q.started = true;
        if (!isArray(data)) {
            data = [data];
        }
        if (data.length === 0) {
            // call drain immediately if there are no tasks
            return setImmediate$1(function () {
                q.drain();
            });
        }

        priority = priority || 0;
        var nextNode = q._tasks.head;
        while (nextNode && priority >= nextNode.priority) {
            nextNode = nextNode.next;
        }

        for (var i = 0, l = data.length; i < l; i++) {
            var item = {
                data: data[i],
                priority: priority,
                callback: callback
            };

            if (nextNode) {
                q._tasks.insertBefore(nextNode, item);
            } else {
                q._tasks.push(item);
            }
        }
        setImmediate$1(q.process);
    };

    // Remove unshift function
    delete q.unshift;

    return q;
};

/**
 * Runs the `tasks` array of functions in parallel, without waiting until the
 * previous function has completed. Once any of the `tasks` complete or pass an
 * error to its callback, the main `callback` is immediately called. It's
 * equivalent to `Promise.race()`.
 *
 * @name race
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array containing functions to run. Each function
 * is passed a `callback(err, result)` which it must call on completion with an
 * error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} callback - A callback to run once any of the functions have
 * completed. This function gets an error or result from the first function that
 * completed. Invoked with (err, result).
 * @returns undefined
 * @example
 *
 * async.race([
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ],
 * // main callback
 * function(err, result) {
 *     // the result will be equal to 'two' as it finishes earlier
 * });
 */
function race(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new TypeError('First argument to race must be an array of functions'));
    if (!tasks.length) return callback();
    for (var i = 0, l = tasks.length; i < l; i++) {
        tasks[i](callback);
    }
}

var slice = Array.prototype.slice;

/**
 * Same as [`reduce`]{@link module:Collections.reduce}, only operates on `array` in reverse order.
 *
 * @name reduceRight
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reduce]{@link module:Collections.reduce}
 * @alias foldr
 * @category Collection
 * @param {Array} array - A collection to iterate over.
 * @param {*} memo - The initial state of the reduction.
 * @param {Function} iteratee - A function applied to each item in the
 * array to produce the next step in the reduction. The `iteratee` is passed a
 * `callback(err, reduction)` which accepts an optional error as its first
 * argument, and the state of the reduction as the second. If an error is
 * passed to the callback, the reduction is stopped and the main `callback` is
 * immediately called with the error. Invoked with (memo, item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the reduced value. Invoked with
 * (err, result).
 */
function reduceRight(array, memo, iteratee, callback) {
  var reversed = slice.call(array).reverse();
  reduce(reversed, memo, iteratee, callback);
}

/**
 * Wraps the function in another function that always returns data even when it
 * errors.
 *
 * The object returned has either the property `error` or `value`.
 *
 * @name reflect
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} fn - The function you want to wrap
 * @returns {Function} - A function that always passes null to it's callback as
 * the error. The second argument to the callback will be an `object` with
 * either an `error` or a `value` property.
 * @example
 *
 * async.parallel([
 *     async.reflect(function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff but error ...
 *         callback('bad stuff happened');
 *     }),
 *     async.reflect(function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     })
 * ],
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = 'bad stuff happened'
 *     // results[2].value = 'two'
 * });
 */
function reflect(fn) {
    return initialParams(function reflectOn(args, reflectCallback) {
        args.push(rest(function callback(err, cbArgs) {
            if (err) {
                reflectCallback(null, {
                    error: err
                });
            } else {
                var value = null;
                if (cbArgs.length === 1) {
                    value = cbArgs[0];
                } else if (cbArgs.length > 1) {
                    value = cbArgs;
                }
                reflectCallback(null, {
                    value: value
                });
            }
        }));

        return fn.apply(this, args);
    });
}

function reject$1(eachfn, arr, iteratee, callback) {
    _filter(eachfn, arr, function (value, cb) {
        iteratee(value, function (err, v) {
            cb(err, !v);
        });
    }, callback);
}

/**
 * The opposite of [`filter`]{@link module:Collections.filter}. Removes values that pass an `async` truth test.
 *
 * @name reject
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.filter]{@link module:Collections.filter}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 * @example
 *
 * async.reject(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, results) {
 *     // results now equals an array of missing files
 *     createFiles(results);
 * });
 */
var reject = doParallel(reject$1);

/**
 * A helper function that wraps an array or an object of functions with reflect.
 *
 * @name reflectAll
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.reflect]{@link module:Utils.reflect}
 * @category Util
 * @param {Array} tasks - The array of functions to wrap in `async.reflect`.
 * @returns {Array} Returns an array of functions, each function wrapped in
 * `async.reflect`
 * @example
 *
 * let tasks = [
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     function(callback) {
 *         // do some more stuff but error ...
 *         callback(new Error('bad stuff happened'));
 *     },
 *     function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'two');
 *         }, 100);
 *     }
 * ];
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results[0].value = 'one'
 *     // results[1].error = Error('bad stuff happened')
 *     // results[2].value = 'two'
 * });
 *
 * // an example using an object instead of an array
 * let tasks = {
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'one');
 *         }, 200);
 *     },
 *     two: function(callback) {
 *         callback('two');
 *     },
 *     three: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 'three');
 *         }, 100);
 *     }
 * };
 *
 * async.parallel(async.reflectAll(tasks),
 * // optional callback
 * function(err, results) {
 *     // values
 *     // results.one.value = 'one'
 *     // results.two.error = 'two'
 *     // results.three.value = 'three'
 * });
 */
function reflectAll(tasks) {
    var results;
    if (isArray(tasks)) {
        results = arrayMap(tasks, reflect);
    } else {
        results = {};
        baseForOwn(tasks, function (task, key) {
            results[key] = reflect.call(this, task);
        });
    }
    return results;
}

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name rejectLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectLimit = doParallelLimit(reject$1);

/**
 * The same as [`reject`]{@link module:Collections.reject} but runs only a single async operation at a time.
 *
 * @name rejectSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.reject]{@link module:Collections.reject}
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in `coll`.
 * The `iteratee` is passed a `callback(err, truthValue)`, which must be called
 * with a boolean argument once it has completed. Invoked with (item, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Invoked with (err, results).
 */
var rejectSeries = doLimit(rejectLimit, 1);

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

/**
 * Attempts to get a successful response from `task` no more than `times` times
 * before returning an error. If the task is successful, the `callback` will be
 * passed the result of the successful task. If all attempts fail, the callback
 * will be passed the error and result (if any) of the final attempt.
 *
 * @name retry
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - Can be either an
 * object with `times` and `interval` or a number.
 * * `times` - The number of attempts to make before giving up.  The default
 *   is `5`.
 * * `interval` - The time to wait between retries, in milliseconds.  The
 *   default is `0`. The interval may also be specified as a function of the
 *   retry count (see example).
 * * `errorFilter` - An optional synchronous function that is invoked on
 *   erroneous result. If it returns `true` the retry attempts will continue;
 *   if the function returns `false` the retry flow is aborted with the current
 *   attempt's error and result being returned to the final callback.
 *   Invoked with (err).
 * * If `opts` is a number, the number specifies the number of times to retry,
 *   with the default interval of `0`.
 * @param {Function} task - A function which receives two arguments: (1) a
 * `callback(err, result)` which must be called when finished, passing `err`
 * (which can be `null`) and the `result` of the function's execution, and (2)
 * a `results` object, containing the results of the previously executed
 * functions (if nested inside another control flow). Invoked with
 * (callback, results).
 * @param {Function} [callback] - An optional callback which is called when the
 * task has succeeded, or after the final failed attempt. It receives the `err`
 * and `result` arguments of the last attempt at completing the `task`. Invoked
 * with (err, results).
 * @example
 *
 * // The `retry` function can be used as a stand-alone control flow by passing
 * // a callback, as shown below:
 *
 * // try calling apiMethod 3 times
 * async.retry(3, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 3 times, waiting 200 ms between each retry
 * async.retry({times: 3, interval: 200}, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod 10 times with exponential backoff
 * // (i.e. intervals of 100, 200, 400, 800, 1600, ... milliseconds)
 * async.retry({
 *   times: 10,
 *   interval: function(retryCount) {
 *     return 50 * Math.pow(2, retryCount);
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod the default 5 times no delay between each retry
 * async.retry(apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // try calling apiMethod only when error condition satisfies, all other
 * // errors will abort the retry control flow and return to final callback
 * async.retry({
 *   errorFilter: function(err) {
 *     return err.message === 'Temporary error'; // only retry on a specific error
 *   }
 * }, apiMethod, function(err, result) {
 *     // do something with the result
 * });
 *
 * // It can also be embedded within other control flow functions to retry
 * // individual methods that are not as reliable, like this:
 * async.auto({
 *     users: api.getUsers.bind(api),
 *     payments: async.retry(3, api.getPayments.bind(api))
 * }, function(err, results) {
 *     // do something with the results
 * });
 *
 */
function retry(opts, task, callback) {
    var DEFAULT_TIMES = 5;
    var DEFAULT_INTERVAL = 0;

    var options = {
        times: DEFAULT_TIMES,
        intervalFunc: constant$1(DEFAULT_INTERVAL)
    };

    function parseTimes(acc, t) {
        if (typeof t === 'object') {
            acc.times = +t.times || DEFAULT_TIMES;

            acc.intervalFunc = typeof t.interval === 'function' ? t.interval : constant$1(+t.interval || DEFAULT_INTERVAL);

            acc.errorFilter = t.errorFilter;
        } else if (typeof t === 'number' || typeof t === 'string') {
            acc.times = +t || DEFAULT_TIMES;
        } else {
            throw new Error("Invalid arguments for async.retry");
        }
    }

    if (arguments.length < 3 && typeof opts === 'function') {
        callback = task || noop;
        task = opts;
    } else {
        parseTimes(options, opts);
        callback = callback || noop;
    }

    if (typeof task !== 'function') {
        throw new Error("Invalid arguments for async.retry");
    }

    var attempt = 1;
    function retryAttempt() {
        task(function (err) {
            if (err && attempt++ < options.times && (typeof options.errorFilter != 'function' || options.errorFilter(err))) {
                setTimeout(retryAttempt, options.intervalFunc(attempt));
            } else {
                callback.apply(null, arguments);
            }
        });
    }

    retryAttempt();
}

/**
 * A close relative of [`retry`]{@link module:ControlFlow.retry}.  This method wraps a task and makes it
 * retryable, rather than immediately calling it with retries.
 *
 * @name retryable
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.retry]{@link module:ControlFlow.retry}
 * @category Control Flow
 * @param {Object|number} [opts = {times: 5, interval: 0}| 5] - optional
 * options, exactly the same as from `retry`
 * @param {Function} task - the asynchronous function to wrap
 * @returns {Functions} The wrapped function, which when invoked, will retry on
 * an error, based on the parameters specified in `opts`.
 * @example
 *
 * async.auto({
 *     dep1: async.retryable(3, getFromFlakyService),
 *     process: ["dep1", async.retryable(3, function (results, cb) {
 *         maybeProcessData(results.dep1, cb);
 *     })]
 * }, callback);
 */
var retryable = function (opts, task) {
    if (!task) {
        task = opts;
        opts = null;
    }
    return initialParams(function (args, callback) {
        function taskFn(cb) {
            task.apply(null, args.concat(cb));
        }

        if (opts) retry(opts, taskFn, callback);else retry(taskFn, callback);
    });
};

/**
 * Run the functions in the `tasks` collection in series, each one running once
 * the previous function has completed. If any functions in the series pass an
 * error to its callback, no more functions are run, and `callback` is
 * immediately called with the value of the error. Otherwise, `callback`
 * receives an array of results when `tasks` have completed.
 *
 * It is also possible to use an object instead of an array. Each property will
 * be run as a function, and the results will be passed to the final `callback`
 * as an object instead of an array. This can be a more readable way of handling
 *  results from {@link async.series}.
 *
 * **Note** that while many implementations preserve the order of object
 * properties, the [ECMAScript Language Specification](http://www.ecma-international.org/ecma-262/5.1/#sec-8.6)
 * explicitly states that
 *
 * > The mechanics and order of enumerating the properties is not specified.
 *
 * So if you rely on the order in which your series of functions are executed,
 * and want this to work on all platforms, consider using an array.
 *
 * @name series
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array|Iterable|Object} tasks - A collection containing functions to run, each
 * function is passed a `callback(err, result)` it must call on completion with
 * an error `err` (which can be `null`) and an optional `result` value.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This function gets a results array (or object)
 * containing all the result arguments passed to the `task` callbacks. Invoked
 * with (err, result).
 * @example
 * async.series([
 *     function(callback) {
 *         // do some stuff ...
 *         callback(null, 'one');
 *     },
 *     function(callback) {
 *         // do some more stuff ...
 *         callback(null, 'two');
 *     }
 * ],
 * // optional callback
 * function(err, results) {
 *     // results is now equal to ['one', 'two']
 * });
 *
 * async.series({
 *     one: function(callback) {
 *         setTimeout(function() {
 *             callback(null, 1);
 *         }, 200);
 *     },
 *     two: function(callback){
 *         setTimeout(function() {
 *             callback(null, 2);
 *         }, 100);
 *     }
 * }, function(err, results) {
 *     // results is now equal to: {one: 1, two: 2}
 * });
 */
function series(tasks, callback) {
  _parallel(eachOfSeries, tasks, callback);
}

/**
 * Returns `true` if at least one element in the `coll` satisfies an async test.
 * If any iteratee call returns `true`, the main `callback` is immediately
 * called.
 *
 * @name some
 * @static
 * @memberOf module:Collections
 * @method
 * @alias any
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 * @example
 *
 * async.some(['file1','file2','file3'], function(filePath, callback) {
 *     fs.access(filePath, function(err) {
 *         callback(null, !err)
 *     });
 * }, function(err, result) {
 *     // if result is true then at least one of the files exists
 * });
 */
var some = doParallel(_createTester(Boolean, identity));

/**
 * The same as [`some`]{@link module:Collections.some} but runs a maximum of `limit` async operations at a time.
 *
 * @name someLimit
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anyLimit
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someLimit = doParallelLimit(_createTester(Boolean, identity));

/**
 * The same as [`some`]{@link module:Collections.some} but runs only a single async operation at a time.
 *
 * @name someSeries
 * @static
 * @memberOf module:Collections
 * @method
 * @see [async.some]{@link module:Collections.some}
 * @alias anySeries
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A truth test to apply to each item in the array
 * in parallel. The iteratee is passed a `callback(err, truthValue)` which must
 * be called with a boolean argument once it has completed. Invoked with
 * (item, callback).
 * @param {Function} [callback] - A callback which is called as soon as any
 * iteratee returns `true`, or after all the iteratee functions have finished.
 * Result will be either `true` or `false` depending on the values of the async
 * tests. Invoked with (err, result).
 */
var someSeries = doLimit(someLimit, 1);

/**
 * Sorts a list by the results of running each `coll` value through an async
 * `iteratee`.
 *
 * @name sortBy
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {Function} iteratee - A function to apply to each item in `coll`.
 * The iteratee is passed a `callback(err, sortValue)` which must be called once
 * it has completed with an error (which can be `null`) and a value to use as
 * the sort criteria. Invoked with (item, callback).
 * @param {Function} callback - A callback which is called after all the
 * `iteratee` functions have finished, or an error occurs. Results is the items
 * from the original `coll` sorted by the values returned by the `iteratee`
 * calls. Invoked with (err, results).
 * @example
 *
 * async.sortBy(['file1','file2','file3'], function(file, callback) {
 *     fs.stat(file, function(err, stats) {
 *         callback(err, stats.mtime);
 *     });
 * }, function(err, results) {
 *     // results is now the original array of files sorted by
 *     // modified date
 * });
 *
 * // By modifying the callback parameter the
 * // sorting order can be influenced:
 *
 * // ascending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x);
 * }, function(err,result) {
 *     // result callback
 * });
 *
 * // descending order
 * async.sortBy([1,9,3,5], function(x, callback) {
 *     callback(null, x*-1);    //<- x*-1 instead of x, turns the order around
 * }, function(err,result) {
 *     // result callback
 * });
 */
function sortBy(coll, iteratee, callback) {
    map(coll, function (x, callback) {
        iteratee(x, function (err, criteria) {
            if (err) return callback(err);
            callback(null, { value: x, criteria: criteria });
        });
    }, function (err, results) {
        if (err) return callback(err);
        callback(null, arrayMap(results.sort(comparator), baseProperty('value')));
    });

    function comparator(left, right) {
        var a = left.criteria,
            b = right.criteria;
        return a < b ? -1 : a > b ? 1 : 0;
    }
}

/**
 * Sets a time limit on an asynchronous function. If the function does not call
 * its callback within the specified milliseconds, it will be called with a
 * timeout error. The code property for the error object will be `'ETIMEDOUT'`.
 *
 * @name timeout
 * @static
 * @memberOf module:Utils
 * @method
 * @category Util
 * @param {Function} asyncFn - The asynchronous function you want to set the
 * time limit.
 * @param {number} milliseconds - The specified time limit.
 * @param {*} [info] - Any variable you want attached (`string`, `object`, etc)
 * to timeout Error for more information..
 * @returns {Function} Returns a wrapped function that can be used with any of
 * the control flow functions. Invoke this function with the same
 * parameters as you would `asyncFunc`.
 * @example
 *
 * function myFunction(foo, callback) {
 *     doAsyncTask(foo, function(err, data) {
 *         // handle errors
 *         if (err) return callback(err);
 *
 *         // do some stuff ...
 *
 *         // return processed data
 *         return callback(null, data);
 *     });
 * }
 *
 * var wrapped = async.timeout(myFunction, 1000);
 *
 * // call `wrapped` as you would `myFunction`
 * wrapped({ bar: 'bar' }, function(err, data) {
 *     // if `myFunction` takes < 1000 ms to execute, `err`
 *     // and `data` will have their expected values
 *
 *     // else `err` will be an Error with the code 'ETIMEDOUT'
 * });
 */
function timeout(asyncFn, milliseconds, info) {
    var originalCallback, timer;
    var timedOut = false;

    function injectedCallback() {
        if (!timedOut) {
            originalCallback.apply(null, arguments);
            clearTimeout(timer);
        }
    }

    function timeoutCallback() {
        var name = asyncFn.name || 'anonymous';
        var error = new Error('Callback function "' + name + '" timed out.');
        error.code = 'ETIMEDOUT';
        if (info) {
            error.info = info;
        }
        timedOut = true;
        originalCallback(error);
    }

    return initialParams(function (args, origCallback) {
        originalCallback = origCallback;
        // setup timer and call original function
        timer = setTimeout(timeoutCallback, milliseconds);
        asyncFn.apply(null, args.concat(injectedCallback));
    });
}

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil;
var nativeMax$1 = Math.max;

/**
 * The base implementation of `_.range` and `_.rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
function baseRange(start, end, step, fromRight) {
  var index = -1,
      length = nativeMax$1(nativeCeil((end - start) / (step || 1)), 0),
      result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}

/**
 * The same as [times]{@link module:ControlFlow.times} but runs a maximum of `limit` async operations at a
 * time.
 *
 * @name timesLimit
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} count - The number of times to run the function.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see [async.map]{@link module:Collections.map}.
 */
function timeLimit(count, limit, iteratee, callback) {
  mapLimit(baseRange(0, count, 1), limit, iteratee, callback);
}

/**
 * Calls the `iteratee` function `n` times, and accumulates results in the same
 * manner you would use with [map]{@link module:Collections.map}.
 *
 * @name times
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.map]{@link module:Collections.map}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 * @example
 *
 * // Pretend this is some complicated async factory
 * var createUser = function(id, callback) {
 *     callback(null, {
 *         id: 'user' + id
 *     });
 * };
 *
 * // generate 5 users
 * async.times(5, function(n, next) {
 *     createUser(n, function(err, user) {
 *         next(err, user);
 *     });
 * }, function(err, users) {
 *     // we should now have 5 users
 * });
 */
var times = doLimit(timeLimit, Infinity);

/**
 * The same as [times]{@link module:ControlFlow.times} but runs only a single async operation at a time.
 *
 * @name timesSeries
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.times]{@link module:ControlFlow.times}
 * @category Control Flow
 * @param {number} n - The number of times to run the function.
 * @param {Function} iteratee - The function to call `n` times. Invoked with the
 * iteration index and a callback (n, next).
 * @param {Function} callback - see {@link module:Collections.map}.
 */
var timesSeries = doLimit(timeLimit, 1);

/**
 * A relative of `reduce`.  Takes an Object or Array, and iterates over each
 * element in series, each step potentially mutating an `accumulator` value.
 * The type of the accumulator defaults to the type of collection passed in.
 *
 * @name transform
 * @static
 * @memberOf module:Collections
 * @method
 * @category Collection
 * @param {Array|Iterable|Object} coll - A collection to iterate over.
 * @param {*} [accumulator] - The initial state of the transform.  If omitted,
 * it will default to an empty Object or Array, depending on the type of `coll`
 * @param {Function} iteratee - A function applied to each item in the
 * collection that potentially modifies the accumulator. The `iteratee` is
 * passed a `callback(err)` which accepts an optional error as its first
 * argument. If an error is passed to the callback, the transform is stopped
 * and the main `callback` is immediately called with the error.
 * Invoked with (accumulator, item, key, callback).
 * @param {Function} [callback] - A callback which is called after all the
 * `iteratee` functions have finished. Result is the transformed accumulator.
 * Invoked with (err, result).
 * @example
 *
 * async.transform([1,2,3], function(acc, item, index, callback) {
 *     // pointless async:
 *     process.nextTick(function() {
 *         acc.push(item * 2)
 *         callback(null)
 *     });
 * }, function(err, result) {
 *     // result is now equal to [2, 4, 6]
 * });
 *
 * @example
 *
 * async.transform({a: 1, b: 2, c: 3}, function (obj, val, key, callback) {
 *     setImmediate(function () {
 *         obj[key] = val * 2;
 *         callback();
 *     })
 * }, function (err, result) {
 *     // result is equal to {a: 2, b: 4, c: 6}
 * })
 */
function transform(coll, accumulator, iteratee, callback) {
    if (arguments.length === 3) {
        callback = iteratee;
        iteratee = accumulator;
        accumulator = isArray(coll) ? [] : {};
    }
    callback = once(callback || noop);

    eachOf(coll, function (v, k, cb) {
        iteratee(accumulator, v, k, cb);
    }, function (err) {
        callback(err, accumulator);
    });
}

/**
 * Undoes a [memoize]{@link module:Utils.memoize}d function, reverting it to the original,
 * unmemoized form. Handy for testing.
 *
 * @name unmemoize
 * @static
 * @memberOf module:Utils
 * @method
 * @see [async.memoize]{@link module:Utils.memoize}
 * @category Util
 * @param {Function} fn - the memoized function
 * @returns {Function} a function that calls the original unmemoized function
 */
function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}

/**
 * Repeatedly call `iteratee`, while `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs.
 *
 * @name whilst
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `iteratee`. Invoked with ().
 * @param {Function} iteratee - A function which is called each time `test` passes.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has failed and repeated execution of `iteratee` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `iteratee`'s
 * callback. Invoked with (err, [results]);
 * @returns undefined
 * @example
 *
 * var count = 0;
 * async.whilst(
 *     function() { return count < 5; },
 *     function(callback) {
 *         count++;
 *         setTimeout(function() {
 *             callback(null, count);
 *         }, 1000);
 *     },
 *     function (err, n) {
 *         // 5 seconds have passed, n = 5
 *     }
 * );
 */
function whilst(test, iteratee, callback) {
    callback = onlyOnce(callback || noop);
    if (!test()) return callback(null);
    var next = rest(function (err, args) {
        if (err) return callback(err);
        if (test()) return iteratee(next);
        callback.apply(null, [null].concat(args));
    });
    iteratee(next);
}

/**
 * Repeatedly call `fn` until `test` returns `true`. Calls `callback` when
 * stopped, or an error occurs. `callback` will be passed an error and any
 * arguments passed to the final `fn`'s callback.
 *
 * The inverse of [whilst]{@link module:ControlFlow.whilst}.
 *
 * @name until
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @see [async.whilst]{@link module:ControlFlow.whilst}
 * @category Control Flow
 * @param {Function} test - synchronous truth test to perform before each
 * execution of `fn`. Invoked with ().
 * @param {Function} fn - A function which is called each time `test` fails.
 * The function is passed a `callback(err)`, which must be called once it has
 * completed with an optional `err` argument. Invoked with (callback).
 * @param {Function} [callback] - A callback which is called after the test
 * function has passed and repeated execution of `fn` has stopped. `callback`
 * will be passed an error and any arguments passed to the final `fn`'s
 * callback. Invoked with (err, [results]);
 */
function until(test, fn, callback) {
    whilst(function () {
        return !test.apply(this, arguments);
    }, fn, callback);
}

/**
 * Runs the `tasks` array of functions in series, each passing their results to
 * the next in the array. However, if any of the `tasks` pass an error to their
 * own callback, the next function is not executed, and the main `callback` is
 * immediately called with the error.
 *
 * @name waterfall
 * @static
 * @memberOf module:ControlFlow
 * @method
 * @category Control Flow
 * @param {Array} tasks - An array of functions to run, each function is passed
 * a `callback(err, result1, result2, ...)` it must call on completion. The
 * first argument is an error (which can be `null`) and any further arguments
 * will be passed as arguments in order to the next task.
 * @param {Function} [callback] - An optional callback to run once all the
 * functions have completed. This will be passed the results of the last task's
 * callback. Invoked with (err, [results]).
 * @returns undefined
 * @example
 *
 * async.waterfall([
 *     function(callback) {
 *         callback(null, 'one', 'two');
 *     },
 *     function(arg1, arg2, callback) {
 *         // arg1 now equals 'one' and arg2 now equals 'two'
 *         callback(null, 'three');
 *     },
 *     function(arg1, callback) {
 *         // arg1 now equals 'three'
 *         callback(null, 'done');
 *     }
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 *
 * // Or, with named functions:
 * async.waterfall([
 *     myFirstFunction,
 *     mySecondFunction,
 *     myLastFunction,
 * ], function (err, result) {
 *     // result now equals 'done'
 * });
 * function myFirstFunction(callback) {
 *     callback(null, 'one', 'two');
 * }
 * function mySecondFunction(arg1, arg2, callback) {
 *     // arg1 now equals 'one' and arg2 now equals 'two'
 *     callback(null, 'three');
 * }
 * function myLastFunction(arg1, callback) {
 *     // arg1 now equals 'three'
 *     callback(null, 'done');
 * }
 */
var waterfall = function (tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;

    function nextTask(args) {
        if (taskIndex === tasks.length) {
            return callback.apply(null, [null].concat(args));
        }

        var taskCallback = onlyOnce(rest(function (err, args) {
            if (err) {
                return callback.apply(null, [err].concat(args));
            }
            nextTask(args);
        }));

        args.push(taskCallback);

        var task = tasks[taskIndex++];
        task.apply(null, args);
    }

    nextTask([]);
};

/**
 * Async is a utility module which provides straight-forward, powerful functions
 * for working with asynchronous JavaScript. Although originally designed for
 * use with [Node.js](http://nodejs.org) and installable via
 * `npm install --save async`, it can also be used directly in the browser.
 * @module async
 */

/**
 * A collection of `async` functions for manipulating collections, such as
 * arrays and objects.
 * @module Collections
 */

/**
 * A collection of `async` functions for controlling the flow through a script.
 * @module ControlFlow
 */

/**
 * A collection of `async` utility functions.
 * @module Utils
 */
var index = {
  applyEach: applyEach,
  applyEachSeries: applyEachSeries,
  apply: apply$2,
  asyncify: asyncify,
  auto: auto,
  autoInject: autoInject,
  cargo: cargo,
  compose: compose,
  concat: concat,
  concatSeries: concatSeries,
  constant: constant,
  detect: detect,
  detectLimit: detectLimit,
  detectSeries: detectSeries,
  dir: dir,
  doDuring: doDuring,
  doUntil: doUntil,
  doWhilst: doWhilst,
  during: during,
  each: eachLimit,
  eachLimit: eachLimit$1,
  eachOf: eachOf,
  eachOfLimit: eachOfLimit,
  eachOfSeries: eachOfSeries,
  eachSeries: eachSeries,
  ensureAsync: ensureAsync,
  every: every,
  everyLimit: everyLimit,
  everySeries: everySeries,
  filter: filter,
  filterLimit: filterLimit,
  filterSeries: filterSeries,
  forever: forever,
  log: log,
  map: map,
  mapLimit: mapLimit,
  mapSeries: mapSeries,
  mapValues: mapValues,
  mapValuesLimit: mapValuesLimit,
  mapValuesSeries: mapValuesSeries,
  memoize: memoize,
  nextTick: nextTick,
  parallel: parallelLimit,
  parallelLimit: parallelLimit$1,
  priorityQueue: priorityQueue,
  queue: queue$1,
  race: race,
  reduce: reduce,
  reduceRight: reduceRight,
  reflect: reflect,
  reflectAll: reflectAll,
  reject: reject,
  rejectLimit: rejectLimit,
  rejectSeries: rejectSeries,
  retry: retry,
  retryable: retryable,
  seq: seq$1,
  series: series,
  setImmediate: setImmediate$1,
  some: some,
  someLimit: someLimit,
  someSeries: someSeries,
  sortBy: sortBy,
  timeout: timeout,
  times: times,
  timesLimit: timeLimit,
  timesSeries: timesSeries,
  transform: transform,
  unmemoize: unmemoize,
  until: until,
  waterfall: waterfall,
  whilst: whilst,

  // aliases
  all: every,
  any: some,
  forEach: eachLimit,
  forEachSeries: eachSeries,
  forEachLimit: eachLimit$1,
  forEachOf: eachOf,
  forEachOfSeries: eachOfSeries,
  forEachOfLimit: eachOfLimit,
  inject: reduce,
  foldl: reduce,
  foldr: reduceRight,
  select: filter,
  selectLimit: filterLimit,
  selectSeries: filterSeries,
  wrapSync: asyncify
};

exports['default'] = index;
exports.applyEach = applyEach;
exports.applyEachSeries = applyEachSeries;
exports.apply = apply$2;
exports.asyncify = asyncify;
exports.auto = auto;
exports.autoInject = autoInject;
exports.cargo = cargo;
exports.compose = compose;
exports.concat = concat;
exports.concatSeries = concatSeries;
exports.constant = constant;
exports.detect = detect;
exports.detectLimit = detectLimit;
exports.detectSeries = detectSeries;
exports.dir = dir;
exports.doDuring = doDuring;
exports.doUntil = doUntil;
exports.doWhilst = doWhilst;
exports.during = during;
exports.each = eachLimit;
exports.eachLimit = eachLimit$1;
exports.eachOf = eachOf;
exports.eachOfLimit = eachOfLimit;
exports.eachOfSeries = eachOfSeries;
exports.eachSeries = eachSeries;
exports.ensureAsync = ensureAsync;
exports.every = every;
exports.everyLimit = everyLimit;
exports.everySeries = everySeries;
exports.filter = filter;
exports.filterLimit = filterLimit;
exports.filterSeries = filterSeries;
exports.forever = forever;
exports.log = log;
exports.map = map;
exports.mapLimit = mapLimit;
exports.mapSeries = mapSeries;
exports.mapValues = mapValues;
exports.mapValuesLimit = mapValuesLimit;
exports.mapValuesSeries = mapValuesSeries;
exports.memoize = memoize;
exports.nextTick = nextTick;
exports.parallel = parallelLimit;
exports.parallelLimit = parallelLimit$1;
exports.priorityQueue = priorityQueue;
exports.queue = queue$1;
exports.race = race;
exports.reduce = reduce;
exports.reduceRight = reduceRight;
exports.reflect = reflect;
exports.reflectAll = reflectAll;
exports.reject = reject;
exports.rejectLimit = rejectLimit;
exports.rejectSeries = rejectSeries;
exports.retry = retry;
exports.retryable = retryable;
exports.seq = seq$1;
exports.series = series;
exports.setImmediate = setImmediate$1;
exports.some = some;
exports.someLimit = someLimit;
exports.someSeries = someSeries;
exports.sortBy = sortBy;
exports.timeout = timeout;
exports.times = times;
exports.timesLimit = timeLimit;
exports.timesSeries = timesSeries;
exports.transform = transform;
exports.unmemoize = unmemoize;
exports.until = until;
exports.waterfall = waterfall;
exports.whilst = whilst;
exports.all = every;
exports.allLimit = everyLimit;
exports.allSeries = everySeries;
exports.any = some;
exports.anyLimit = someLimit;
exports.anySeries = someSeries;
exports.find = detect;
exports.findLimit = detectLimit;
exports.findSeries = detectSeries;
exports.forEach = eachLimit;
exports.forEachSeries = eachSeries;
exports.forEachLimit = eachLimit$1;
exports.forEachOf = eachOf;
exports.forEachOfSeries = eachOfSeries;
exports.forEachOfLimit = eachOfLimit;
exports.inject = reduce;
exports.foldl = reduce;
exports.foldr = reduceRight;
exports.select = filter;
exports.selectLimit = filterLimit;
exports.selectSeries = filterSeries;
exports.wrapSync = asyncify;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/async/dist/async.js","/../../node_modules/async/dist")
},{"b55mWE":4,"buffer":3}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js","/../../node_modules/gulp-browserify/node_modules/base64-js/lib")
},{"b55mWE":4,"buffer":3}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/buffer/index.js","/../../node_modules/gulp-browserify/node_modules/buffer")
},{"b55mWE":4,"base64-js":2,"buffer":3,"ieee754":6}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/gulp-browserify/node_modules/process/browser.js","/../../node_modules/gulp-browserify/node_modules/process")
},{"b55mWE":4,"buffer":3}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Generated by CoffeeScript 1.10.0
module.exports = {
  100: 'Continue',
  101: 'Switching Protocols',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Large',
  415: 'Unsupported Media Type',
  416: 'Requested Range not Satisfiable',
  417: 'Expectation Failed',
  422: 'Unprocessable Entity',
  424: 'Failed Dependency',
  429: 'Too Many Requests',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not Supported',
  507: 'Insufficient Storage',
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  UNPROCESSABLE_ENTITY: 422,
  FAILED_DEPENDENCY: 424,
  TOO_MANY_REQUESTS: 429,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  INSUFFICIENT_STORAGE: 507
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/http-status/lib/index.js","/../../node_modules/http-status/lib")
},{"b55mWE":4,"buffer":3}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"b55mWE":4,"buffer":3}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/underscore/underscore.js","/../../node_modules/underscore")
},{"b55mWE":4,"buffer":3}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.iframe_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Team
    ) {
		
		
		
		
	console.log('controller go')
	console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

	


		 columnDefs.push(
			{ field: 'username' ,resizable: true},
			{ field: 'password' ,resizable: true},
			{ field: 'email' ,resizable: true},
			{ field: 'firstName' ,resizable: true},
			{ field: 'lastName' ,resizable: true},
			{ field: 'team' ,resizable: true},
			{ field: 'group' ,resizable: true},
			{ field: 'trello_doing_id' ,resizable: true},
			{ field: 'score' ,resizable: true},
			{ field: 'bonus' ,resizable: true},
			{ field: 'leave_start' ,resizable: true},
			{ field: 'leave_taken' ,resizable: true},
			{ field: 'number_days_leave' ,resizable: true}
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: true,
			enableCellEditOnFocus: true,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post

			var myArray = []
			var key = colDef.field;
			var obj = {};
			obj[key] = newValue;
			myArray.push(obj);
				var query = {'id':rowEntity._id};
						Team.update(query, 	obj
								
								, function(err, affected, resp) {


								
								
						})
			  });
				},
		};

		 console.log('getData')	
			Team.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
					/*
					for (var key in teamx[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
					*/
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/iframe/iframe-controller.js","/../components/iframe")
},{"b55mWE":4,"buffer":3}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.iFrame = function() {
  return {
   controller: 'iframe_controller',
    templateUrl: './components/iframe/iframe-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/iframe/iframe-directive.js","/../components/iframe")
},{"b55mWE":4,"buffer":3}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.boardCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {



    $scope.team = ["Zahid", "Tom", "Fay", "Mark", "Darren", "Lacey", "David"];
	  $scope.chart_title="Leader Board"
	$scope.labels= $scope.team
    
		$scope.removeTally = function(id) {
			Tallys.remove({id:id})
		}
		  Tallys.query({}, function(team) {
			_.each(team, function(row) {
				//$scope.removeTally(row._id)
				})	
			})	
			
			
 trello.auth()
 
 
 
 
 
    var series_a = []
	_series = [];
	__series = [];
	
	$scope.series = [];

		_.each($scope.team, function(member) {
       _series[member] = []
    })
	
	
	var plot_graph = function() {

    var _data = []
	 var _series = []
		_.each($scope.team, function(member) {
        _series[member] = []
    })
	

	
   
	
    Tallys.query({}, function(tallys) {
		
		tallys.sort(function(a, b){
		return a.date + b.date;
		});

		
        _.each(tallys, function(row) {			
			
            for (var member in _series) {
                if (_series.hasOwnProperty(member)) {
				if(row.name){
                    if (row.name.toLowerCase() == member.toLowerCase()) {
                        _series[member].push({
                            x: row.date,
                            y: row.points
                        })
                    }
					}
                }
			
            }


        })
		

    })
	
	
	

    for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            _data.push(_series[member]);
        }
    }
	
	$scope.data=_data
	
	}
  
  for (var member in _series) {
        if (_series.hasOwnProperty(member)) {
            __series.push(member);
        }
    }
	
	$scope.series= __series
  

 
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
		
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'day',
                unitStepSize: 1,
                time: {
                    displayFormats: {
                        'day': 'MMM DD'
                    }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0
	$scope.loadMoreShots = function(count,display_data) {

		angular.forEach(display_data, function(list, index) {
						
		get_trello_board.get_data(list)

				   .then(function() {
					  count++
				if(display_data.length==count+1){
	
				   $scope.listscores()
					 plot_graph()
				}

				   });
				   
	})

};

	
	
        //trello.auth()
$scope.loadMoreShots(0,$rootScope['team'])

setInterval(function(){$scope.loadMoreShots(0,$rootScope['team']); }, 1 *250 * 1000);


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
            console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		
			$scope.lists = []
			
				
	$scope.listscores = function() {	
		$scope._lists = []
		   Team.query({}, function(team) {
				_.each(team, function(row) {
								list=[]
								list.title = row.name
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope._lists.push(list)
				})
				$scope.lists=$scope._lists
				
		})
		
	}

		
			
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/dashboard-controller.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.deadCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,kiosk_activity
    ) {


	 $scope.machine_types = [];
	
	 

	 

  $scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

  $scope.machine_types = ['apple', 'orange', 'pear', 'naartjie'];

  // selected fruits
  $scope.machine_types_selection = ['apple', 'pear'];

  // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(type) {
    var idx = $scope.machine_types_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.machine_types_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.machine_types_selection.push(type);
	  
			
			
			plot_graph()
    }
  }; 

  $scope.changedCatValue = function(category) {
						 
 }  


  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

  // toggle selection for a given fruit by name
  $scope.toggleCatSelection = function toggleSelection(type) {
    var idx = $scope.category_selection.indexOf(type);

    // is currently selected
    if (idx > -1) {
      $scope.category_selection.splice(idx, 1);
	  plot_graph()
    }

    // is newly selected
    else {
      $scope.category_selection.push(type);
	  
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
			
			plot_graph()
    }
  }; 

    
  $scope.changedCatValue = function(category) {
						 
 }

    $scope.data = []
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var plot_graph = function() {
	
			$scope.data=[]
			$scope.series=[]
			$scope._series=[]
		
		 kiosk_activity.async_all($scope.category_selection).then(function(data) { //2. so you can use .then()
		 
		 		console.log('data',data)
	$scope.listscores(data.data['off_today'])
	$scope.listslivecores(data.data['on_today'])	
				
				
			})				
	}

    plot_graph() 
		$scope.live_lists = []
	
		$scope.listslivecores = function(list) {	
		console.log('list',list)
		 
				_.each(list, function(row) {
					
					console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.live_lists.push(list)
				})
		
		
	}
		$scope.lists=[]
	$scope.listscores = function(list) {	
		console.log('list',list)
		 
				_.each(list, function(row) {
					
					//console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}

				
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/dead-controller.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.downtimeCtrl = function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,kiosk_activity
    ) {


console.log('controller load')

var REFERENCE = moment(); // fixed just for testing, use moment();
 $scope.TODAY = REFERENCE.clone().startOf('day');
	$scope.YESTERDAY = REFERENCE.clone().subtract(0, 'days').startOf('day');
	$scope.A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');



   	$scope.datePicker=[];
	$scope.datePicker.date = {startDate: $scope.A_WEEK_OLD._d, endDate: $scope.TODAY._d};


$scope.machine_types = [];
$scope.type="all";
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   


$scope.machinesx=$scope.kiosk = $routeParams.kiosk ||["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	plot_graph('type')

})	
	  
$scope.$watch('daterangepicker.dates', function() {
console.log('daterangepicker')
	plot_graph()
})

	  

$scope.$watch('machine', function() {

			
			plot_graph('machine')	
})
  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];

  // selected fruits
  $scope.category_selection = [];

 

 
var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="Machine activity"

    var series_a = []
	
	var firstTime=true
	
	
	
	
	
	var plot_graph = function(mode) {
	$scope.data=[];
	$scope.series=[];
	$scope.day_series=[];
	$scope._series=[];
	$scope.week_day_series=[];
	
	if(!mode){
	$scope.machinesx=[]	
}	


$scope.categories=[]

		 kiosk_activity.async_all($scope.categories,$scope.machine_types,$scope.datePicker.date).then(function(data) { //2. so you can use .then()
		 				
				_.each(data.data['kiosk_list'], function(data) {
					//if(firstTime==true){
					
					
					
					if(($scope.type=="all") || ($scope.type==data.type && mode!="machine")){
						//$scope.machine_types=[]
						
						$scope.machinesx.push(data.kiosk)
					}
					//}
						
					if($scope.type=="all" ||$scope.type==data.type){
								if($scope.machine=="all" ||$scope.machine==data.kiosk){
										$scope._series[data.kiosk] = []
										$scope.week_day_series[data.kiosk] = []
										
								}
					}
						 				 
				})	
	 
			_.each(data.data['machine_types'], function(data) {
				if(firstTime==true){
					$scope.machine_types.push(data.machine_type)
					}
				
				})	
				
				firstTime=false
				 $scope.categories=[]
				
					_.each(data.data['categories'], function(data) {
					
					 $scope.categories.push(data.category)
				})	
				
				  _.each(data.data['all'], function(row) {
					  
						if($scope._series[row.kiosk]){
							$scope._series[row.kiosk].push({
								x: row.date,
								y: row.count
							})
							}
							
							
				})
				$scope.week_days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
				
				_.each( $scope.week_days, function(day_of_week) {
				  _.each(data.data['week_day'], function(row) {
					  
						if($scope.week_day_series[row.kiosk] && (row.kiosk==$scope.machine || $scope.machine=="all")){
							
							
								if(row.date==day_of_week){								
									$scope.week_day_series[row.kiosk].push(	row.count)
								}
							
						}
							
						})	
							
				})

				  for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {
						
							$scope.series.push(member);
						}
					}

					for (var member in $scope._series) {
						if ($scope._series.hasOwnProperty(member)) {

							$scope.data.push($scope._series[member]);
						}
					}	

				
_data=[]
					for (var member in $scope.week_day_series) {
					
						if ($scope.week_day_series.hasOwnProperty(member)) {
						$scope.day_series.push(member);

							_data.push( $scope.week_day_series[member])
							
						}
					}

  					$scope.day_labels = $scope.week_days;
					$scope.day_data = _data
					
			})				
	}

		
$scope.day_onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.day_datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
   
	

  
  
  

    $scope.onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
	tension:0,
	 bezierCurve: false,
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'hour',
				
                unitStepSize: 0.05,
                  time: {
        displayFormats: {
           'day': 'MMM DD'
        }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
           // console.log('start screensaver')
           // screen_saver_loop.start_screen_saver();
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
		//console.log('list',list)
		 
				_.each(list, function(row) {
					
					//console.log(row)
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}

	 kiosk_activity.comments_all().then(function(data) { //2. so you can use .then()
	 
	  satisfact_pie(data)
	 })
	
		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				var series_a=[]
				var labels=[]
			
					$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				_.each(comments.data['satisfaction_tally'] , function( row) {
				
			
			if($scope.kiosks.indexOf(row.kiosk)==-1){
				$scope.kiosks.push(row.kiosk)
					series_a[row.kiosk]=[]
				$scope[row.kiosk]=[]
				labels[row.kiosk]=[]
				
				
			}
				
			
				
		
			
				series_a[row.kiosk].push( Math.round(row.count ))
				labels[row.kiosk].push( row.satisfaction )
				
				
				
				console.log(labels)
				})
			
				_.each($scope.kiosks , function( kiosk, i) {
					
					$scope.pie_labels[i] = labels[kiosk];
					$scope.datax[i] = series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: false },
										tooltips: {
													enabled: true,
													mode: 'single',
													callbacks: {
														
														label: function(tooltipItems, data) { 
														
														var label =data.labels[tooltipItems.index]
															return label+ " " + data.datasets[0].data[tooltipItems.index] + '';
															
														}	
												
													}
										}
					}
		})

				
				
				
		}		
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/downtime-controller.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.kiosk_activity = function ($http) {

	
  return {
    async_categories: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/downtime.php');  //1. this returns promise
    },
	 async_all: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
	
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/downtime-services.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.feedbackCtrl =    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,feedback
    ) {


var REFERENCE = moment(); // fixed just for testing, use moment();
$scope.TODAY = REFERENCE.clone().startOf('day');
$scope.YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
$scope.A_WEEK_OLD = REFERENCE.clone().subtract(2, 'days').startOf('day');
$scope.datePicker=[];
$scope.datePicker.date = {startDate: $scope.A_WEEK_OLD._d, endDate: $scope.TODAY._d};
$scope.machine_types = [];
$scope.type="INTERPRETATION-KIOSK";
$scope.feedback=[];
$scope.changedValue = function(type) {
			$scope.data=[]
			$scope.series=[]
			$scope.category=[]
			$scope.type=type
			plot_graph()			 
 }   

$scope.selected="all";
$scope.changeMachine = function(machine) {
			
			$scope.feedback=[];
			$scope.data=[];
			$scope.series=[];
			$scope.category=[];
			$scope.selected=machine;
			
			plot_graph(machine)	;		 
 }   




$scope.machinesx=["all"]
$scope.filterCondition = {
        machine: 'neq'
}
$scope.$watch('type', function(type) {
$scope.machinesx=["all"]
	//plot_graph('type')

})	
	  
$scope.$watch('datePicker', function() {
plot_graph();
})
	  


  // selected fruits
  $scope.machine_types_selection = [];



  $scope.categories = [];
  $scope.category_selection = [];

 

 
	var _data=[];
    $scope.data = []
	$scope.day_data=[]
    $scope.team = [];
	$scope.labels= $scope.team
  $scope.chart_title="KIOSK FEEDBACK"

    var series_a = []
	
	var firstTime=true
	
	$scope.satisfaction_count=0
				satisfied=[]
				satisfied.push("satisfied")
				satisfied.push("very satisfied")
	
	
	var plot_graph = function(mode) {
	$scope.data=[];
	$scope.series=[];
	$scope.day_series=[];
	$scope._series=[];
	$scope.week_day_series=[];
	
	if(!mode){
	$scope.machinesx=[]	
}	


$scope.categories=[]

		 feedback.feedback($scope.categories,$scope.datePicker.date).then(function(data) { //2. so you 
		 		
				  		$scope.machinesx.push("OVERALL SATISFACTION")
				_.each(data.data['kiosk_list'], function(data) {
					if($scope.type=="INTERPRETATION-KIOSK" && firstTime==true){
					mode="OVERALL SATISFACTION"
						$scope.machinesx.push(data.kiosk)
					}
												 
				})	
				firstTime=false
			
				
				_.each(data.data['all'], function(data) {
					if(data.description !="" && data.kiosk==$scope.selected){
					$scope.feedback.push(data)
					console.log(data.description)
					}
								 
				})
				
			satisfact_pie(data) 
			if(mode=="OVERALL SATISFACTION"){
			overall_satisfact_pie(data) 
			}

			})				
	}

		
$scope.day_onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.day_datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
   
	

  
  
  

    $scope.onClick = function(points, evt) {
       // console.log(points, evt);
    };
    $scope.datasetOverride = [{
        yAxisID: 'y-axis-1'
    }];
    $scope.options = {
	tension:0,
	 bezierCurve: false,
        scales: {
            xAxes: [{
                type: 'time',
                unit: 'hour',
				
                unitStepSize: 0.05,
                  time: {
        displayFormats: {
           'day': 'MMM DD'
        }
                }
            }],
            yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
	
	var count = 0


        //  $scope.kiosk = app_settings.kiosk || "null"
        // $scope.call_to_action = app_settings.call_to_action
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
           // screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
          
        }

     
		$scope.lists = []
		
	$scope.listscores = function(list) {	
	
		 
				_.each(list, function(row) {
					
					
								list=[]
								list.title = row.kiosk
								list.average = row.penalty
								list.age = (10-1/(row.penalty)*10 ).toFixed(0)
								list.tint = row.penalty / 100
								list.card_count = row.card_count
								list.points = row.score  //(row.card_count / (row.penalty + 1)).toFixed(1)	
							$scope.lists.push(list)
				})
		
		
	}
	
		  function overall_satisfact_pie(comments) {
     
               $scope.kiosks=[]
			   $scope.kiosks.push("OVERALL SATISFACTION")
				$scope.machine = "OVERALL SATISFACTION"
				$scope.series_a=[]
				$scope.labels=[]
				$scope.series_a["OVERALL SATISFACTION"]=[]
				$scope.labels["OVERALL SATISFACTION"]=[]
				$scope.satisfaction_tally=0
				$scope.satisfaction_count=0
			_.each(comments.data['overall_satisfaction'] , function( row) {
$scope.satisfaction_tally+=Math.round(row.count )

				$scope.series_a["OVERALL SATISFACTION"].push( Math.round(row.count ))
				$scope.labels["OVERALL SATISFACTION"].push( row.satisfaction )
				
				
				
				if(satisfied.indexOf(row.satisfaction)!=-1)
				{
					$scope.satisfaction_count+=Math.round(row.count )
				}

					$scope.pie_labels.push( $scope.labels["OVERALL SATISFACTION"]);
					$scope.pie_data.push($scope.series_a["OVERALL SATISFACTION"]);

				
		})		
						
			$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
			}


		
	  function satisfact_pie(comments) {
     
               
				
				
				 $scope.kiosks=[]
				$scope.series_a=[]
			$scope.labels=[]
			
				$scope.pie_labels=[]
				$scope.pie_data=[]
				$scope.pie_options=[]
				$scope.datax=[]
				$scope.satisfaction_count=0
				$scope.satisfaction_tally=0
				
			_.each(comments.data['satisfaction_tally'] , function( row) {
		
				if($scope.kiosks.indexOf(row.kiosk)==-1){
					if($scope.selected.indexOf(row.kiosk)!=-1){
						
						
						
						$scope.kiosks.push(row.kiosk)
						console.log('cats')
						$scope.series_a[row.kiosk]=[]
						$scope[row.kiosk]=[]
						$scope.labels[row.kiosk]=[]
					}
				}
				
				if($scope.selected.indexOf(row.kiosk)!=-1){
				$scope.series_a[row.kiosk].push( Math.round(row.count ))
				$scope.labels[row.kiosk].push( row.satisfaction )
				if(satisfied.indexOf(row.satisfaction)!=-1)
						{
						
							$scope.satisfaction_count+=Math.round(row.count )
						}
				$scope.satisfaction_tally+=Math.round(row.count )
				$scope.percentage=Math.round(($scope.satisfaction_count/$scope.satisfaction_tally)*100)
						
				}
				
			

				})
			
			
				
				
				
				_.each($scope.kiosks , function( kiosk, i) {
				
		
					$scope.machine = kiosk
					$scope.pie_labels[i] = $scope.labels[kiosk];
					$scope.pie_data[i] = $scope.series_a[kiosk];
					$scope.pie_options[i] = { legend: { display: true },
										tooltips: {
													enabled: true,
													mode: 'single',
													callbacks: {
														
														label: function(tooltipItems, data) { 
														
														var label =data.labels[tooltipItems.index]
															return label+ " " + data.datasets[0].data[tooltipItems.index] + '';
															
														}	
												
													}
										}
					}
		})

				
				
				
		}		
	
}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/feedback-controller.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.feedback =function ($http) {

  return {
    async_categories: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/downtime.php');  //1. this returns promise
    },
	 async_all: function(categories,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_logs.php?categories='+JSON.stringify(categories)+'&machine_types='+JSON.stringify(machine_types)+'&dates='+JSON.stringify(dates));  //1. this returns promise
    },
	
	
		 feedback: function(categories,machine_types,dates) {
	 var categories=categories||""
	 var dates=dates||""
	 var machine_types=machine_types||""
	
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    },
	 comments_all: function() {
      return $http.get('http://www.markpajak.co.uk/mark/kiosk-feedback/all_comments.php');  //1. this returns promise
    }
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/feedback-services.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.satisfaction =    function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop, $location, $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,feedback
    ) {


		 feedback.feedback($scope.categories,$scope.datePicker.date).then(function(data) { //2. so you 
		 		

				_.each(data.data['satisfaction_tally'], function(data) {
				
				console.log(data)
				
				}) 
	
	
})

}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/machine-monitor/satisfaction-controller.js","/../components/machine-monitor")
},{"b55mWE":4,"buffer":3}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.member_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline,$mdEditDialog
		,Leave,delete_leave_by_id
    ) {

$scope.me=$routeParams.member

$me_Data=[]

      Leave.query({}, function(team) {
            _.each(team, function(row,index) {
          
			
			
            })
        })


Team.query({}, function(team) {
            _.each(team, function(team,i) {
			
			if(team.username.toLowerCase()==$scope.me.toLowerCase()){
			console.log(team)
			
			
			number_days_leave_taken = 0
			
			function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

team.leave_taken = sortByKey(team.leave_taken, 'leave_start');

			
		 _.each(team.leave_taken, function(leave,w) {
	var leave_count=0
	if(leave._type=="Full Day"){
	leave_count=1
	}
	if(leave._type=="Half Day"){
	leave_count=0.5
	}
			 if(leave.start_date>=team.leave_start && leave.end_date<=team.leave_year_end){
				number_days_leave_taken+=(leave.weekday_duration)*leave_count
				team.leave_taken[w].tally=(team.number_days_leave-number_days_leave_taken)*leave_count
			 }
			 else
			{
			
				console.log(leave.start_date>=team.leave_start )
				console.log('leave.start_date'+leave.start_date )
				console.log('row.leave_start'+team.leave_start )
				
				console.log(leave.end_date<=team.leave_year_end)
				console.log('leave.end_date'+leave.end_date )
				console.log('row.leave_year_end'+team.leave_year_end )
					 
			}
	
		 })
		team.number_days_leave_remaining=team.number_days_leave-number_days_leave_taken
			
			
			$scope.me_Data=team
			}
			
})
 })


   $scope.removeLeave = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */

 // var promise = $mdEditDialog.small({

    //modelValue: dessert.comment,
    //placeholder: 'Add a comment',
   // save: function (input) {
//	event.target.innerHTML=input.$modelValue
	
	
	console.log(dessert)
	delete_leave_by_id._delete(dessert._id)
	/*
			var query = {'id':dessert._id};
			Team.update(query, {
					[event.target.attributes[0].nodeValue]:new Date(input.$modelValue)
					}, function(err, affected, resp) {
					console.log(resp)
			})
			*/
  /*
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  */
  }
  
  

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/member/member-controller.js","/../components/member")
},{"b55mWE":4,"buffer":3}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.analyser_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope,Weekly_donations,Weekly_welcomedesk,Monthly_products_sold_online,Weekly_visits, Monthly_products_published,Monthly_welcomedesk,Monthly_donations,Monthly_visits,Weekly_retail_sales,Monthly_turnstiles,Monthly_retail_sales,Monthly_teg, make_a_pie,make_a_line_chart,weekly_data_table_columns,monthly_data_table_columns,grid_ui_settings,data_table_reload,table_security
    ) {
		
		$scope.interval="Weekly"
		$scope.running=false

		$scope.museums=[]
		$scope.selected_museums=[]		
		
		$scope.chart_class = "col-md-12 col-lg-12 col-sm-12 pull-right"
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"		
		$scope.show_all_Button=false
		
		$scope.table_heading = $scope.range+" donations"
		$scope.pie_date = "Apr 2017"
		
		$scope.start_date=new Date("04/01/2017")
		$scope.end_date=new Date("03/31/2018")
		
				var columnDefs= []
		$scope.filter_pie=[]
		columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
		
		)
	
			
		$scope.windup=function(sales,gallery_visits,welcome,products,orders,team,visits,gates){
		

		
		columnDefs=columnDefs.concat($scope.axis_range.build($scope,$scope.start_date,$scope.end_date))	
			
								
					_.each(visits,function(row){
							if(row.museum!=""){	
								$scope._rows.push(row)
								if(row.museum.indexOf('%')==-1){
									if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}	
									if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
									$scope.data_rows.push(row)
								}
							}
					})
				
			
				
				
				
						_.each(gallery_visits,function(row){
					
							if(row.museum!=""){
								$scope._rows.push(row)
								if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
								
								if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
									
									$scope.data_rows.push(row)
							
								
							}	
						})
				
				
					_.each(sales,function(row){
						console.log('sales',sales)
					if(row.museum!=""){
						if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
						$scope._rows.push(row)
					    $scope.data_rows.push(row)
							
						
					}
			
				})
				
				_.each(team,function(row){
						console.log('team',team)
					if(row.museum!=""){
						$scope._rows.push(row)
						if(row.stat=="Donations"){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							console.log("Donations")
							$scope.data_rows.push(row)
							
						}
					}
			
				})
				
					_.each(gates,function(row){
						console.log('gates',gates)
					if(row.museum!=""){
						$scope._rows.push(row)
						//if(row.stat=="Donations"){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							console.log("Donations")
							$scope.data_rows.push(row)
							
						//}
					}
			
				})
				
		
				_.each(welcome,function(row){
					console.log('welcome',welcome)
					if(row.museum!=""){
						$scope._rows.push(row)
						
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
						
							$scope.data_rows.push(row)
							
						
					}
			
				})
				
					_.each(products,function(row){
						console.log('products',products)
					if(row.museum!=""){
						$scope._rows.push(row)
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							$scope.data_rows.push(row)
							
						
					}
			
				})
				console.log('chart_stats',$scope.chart_stats)
				
					_.each(orders,function(row){
						console.log('orders',orders)
					if(row.museum!=""){
						$scope._rows.push(row)
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if($scope.chart_stats.indexOf(row.stat)==-1){$scope.chart_stats.push(row.stat)}
							$scope.data_rows.push(row)
							
						
					}
			
				})
					
				
				
			
			$scope.gridOptions.data=$scope._rows;

			$scope.axis_threshhold=50
				$scope.toggleSelection_stats = function (fruitName) {
					var idx = $scope.selected_chart_stats.indexOf(fruitName);

					// Is currently selected
					if (idx > -1) {
					  $scope.selected_chart_stats.splice(idx, 1);
					}

					// Is newly selected
					else {
					  $scope.selected_chart_stats.push(fruitName);
					}
				
						make_a_line_chart.build($scope,columnDefs,"museum")
		  };
			$scope.toggleSelection = function (fruitName) {
					var idxx = $scope.selected_museums.indexOf(fruitName);

					// Is currently selected
					if (idxx > -1) {
					  $scope.selected_museums.splice(idxx, 1);
					}

					// Is newly selected
					else {
					  $scope.selected_museums.push(fruitName);
					}
				
					make_a_line_chart.build($scope,columnDefs,"museum")
		  };
			
			
			
		
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',		name: "Museum",width:150, pinnedLeft:true, enableColumnMoving:false  }
					
			)
					columnDefs=columnDefs.concat($scope.axis_range.build($scope,$scope.start_date,$scope.end_date))
					
					
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
					
			});
	
			$scope.running=false
		}	
		
		$scope.$watch("interval", function(newValue, oldValue) {
			
		
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false

		$scope.rows=[]
		$scope.data_rows=[]
		$scope._rows=[]
		$scope.chart_stats=[]
		$scope.selected_chart_stats=[]
		$('input').attr('checked',false)	
			
			$scope.running=true
			if($scope.interval=="Weekly"){
				$scope.axis_range=weekly_data_table_columns
				Weekly_visits.query({}, function(visits) {
					
					Weekly_retail_sales.query({}, function(sales) {
					
							Weekly_welcomedesk.query({}, function(welcome) {
							
							
							Weekly_donations.query({}, function(donations) {
					
								$scope.windup(sales,"",welcome,"","",donations,visits,"")	
			})
			})
			})
			})
			}
			else
			{
				
				$scope.axis_range=monthly_data_table_columns	
				$scope.windup($scope.sales,$scope.gallery_visits,$scope.welcome,$scope.products,$scope.orders,$scope.team,$scope.visits,$scope.gates)
				
					
			}
		});
			Monthly_retail_sales.query({}, function(sales) {
					$scope.sales=sales
				Monthly_teg.query({}, function(gallery_visits) {
					$scope.gallery_visits=gallery_visits
					Monthly_welcomedesk.query({}, function(welcome) {
						$scope.welcome=welcome
						Monthly_products_published.query({}, function(products) {
							$scope.products=products
							Monthly_products_sold_online.query({}, function(orders) {
								$scope.orders=orders
								Monthly_donations.query({}, function(team) {
									$scope.team=team
									Monthly_visits.query({}, function(visits) {
										$scope.visits=visits
										Monthly_turnstiles.query({}, function(gates) {
										$scope.gates=gates
											
										})
									})
								})
							})
						})
					})	
				})
			})		
	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/analyser/analyser-controller.js","/../components/performance/analyser")
},{"b55mWE":4,"buffer":3}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.dashboard_controller = function($route,$scope ) {
		
$scope.dashboard = true
		

}



}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/dashboard-controllers.js","/../components/performance")
},{"b55mWE":4,"buffer":3}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_donations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_donations,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,data_table_reload,table_security
    ) {
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"	
					$scope.chart_heading = "Donations  by month"
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly donations"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
	
			
			$scope.museums  =[]
			$scope.selected_chart_stats=["Donations"]
			
			
			Monthly_donations.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
						if(row.museum!=""){
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							
					$scope._rows.push(row)
					if(row.stat=="Donations"){
						console.log("Donations")
						$scope.data_rows.push(row)
						
					}
			}
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(	{ field: 'museum',		name: "Museum",width: "100", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "100", pinnedLeft:true}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/donations/monthly-donations-controller.js","/../components/performance/donations")
},{"b55mWE":4,"buffer":3}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.donations_performance_form =  function($scope, $http, $q,  
          Raw_donations,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
		$scope.extraQuery = { "donation_box_no":"#"}

    // function definition
	
	  $scope.Raw_donations=Raw_donations
	 
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_donations({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					donation_box_amount: visit_form.donation_box_amount.value,
					donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"donation_box_no":visit_form.donation_box_no,"exact":true};
			
			Raw_donations.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_donations.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
			
							visit_form.donation_box_amount.value=""
							visit_form.donation_box_no.value=""
							visit_form.no_envelopes.value=""
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('donations_performance_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/donations/performance-form-controller.js","/../components/performance/donations")
},{"b55mWE":4,"buffer":3}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.raw_donations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_donations,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_donations
		$rootScope.featured_collection=Raw_donations
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","donation_box_no":"#"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_box_amount' ,resizable: true ,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'donation_box_no' ,resizable: true},
			
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/donations/raw-donations-controller.js","/../components/performance/donations")
},{"b55mWE":4,"buffer":3}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_donations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_donations,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 90, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_donations.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="donations"){
					
						console.log("donations")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/donations/yearly-donations-controller.js","/../components/performance/donations")
},{"b55mWE":4,"buffer":3}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_events,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = "Monthly event figues"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
		
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

	
			$scope.museums  =[]
			$scope.selected_chart_stats=[]
			$scope.chart_stats=[]
			$scope.selected_museums=[]
			
			$scope.get_data=function(event_type){
			console.log('get_data')
			Monthly_events.query({"event_type":event_type}, function(team) {
		
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
					if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						if($scope.chart_stats.indexOf(row.museum)==-1){$scope.chart_stats.push(row.stat)}
						if($scope.selected_chart_stats.indexOf(row.museum)==-1){$scope.selected_chart_stats.push(row.stat)}
					$scope._rows.push(row)
					
					if(row.museum.indexOf('%')==-1){
					if($scope.selected_museums.indexOf(row.museum)==-1){$scope.selected_museums.push(row.museum)}	
						$scope.data_rows.push(row)
						
					}
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
									
			
			
			});
	
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
						$scope.get_data(item)
			}
		})	
		}
		
			$scope.options_list=[]
			$scope.session_type="OFF SITE"
			option=[]
			option.name="OFF SITE"
			option.value="OFF SITE"
			$scope.options_list.push(option)
			option=[]
			option.name="ON SITE"
			option.value="ON SITE"
			$scope.options_list.push(option)
			$scope.get_data("OFF SITE")
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/events/monthly-events-controller.js","/../components/performance/events")
},{"b55mWE":4,"buffer":3}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_events_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_events,data_table_reload,Emu_events,get_table_data,Community_groups
    ) {

$scope.scope = $scope;
$scope.events = [];
$scope.selected_event=[]
$scope.museums=[]
	$scope.extraQuery = { "on_site_off_site":"#"}

			
			
 
$scope.$watch('event', function (newValue) {

		
		if(newValue){
		
					visit_form.date_value.value= moment(newValue.startDate).format('YYYY-MM-DD');
					visit_form.date_value_end.value=moment(newValue.endDate).format('YYYY-MM-DD');
					
					if(newValue.venue){
					
						newValue.venue=newValue.venue.replace("M Shed","M-SHED")
						newValue.venue=newValue.venue.replace("Bristol Museum & Art Gallery","BMAG")
						newValue.venue=newValue.venue.replace("Georgian House","GEORGIAN-HOUSE")
						newValue.venue=newValue.venue.replace("The Red Lodge Museum","RED-LODGE")
						newValue.venue=newValue.venue.replace("Bristol Archives","BRISTOL-ARCHIVES")
						newValue.venue=newValue.venue.replace("Kings Weston Roman Villa","ROMAN-VILLA")
						newValue.venue=newValue.venue.replace("Blaise Castle House Museum","BLAISE")
						$scope.selected_museum=newValue.venue
					}
					
			}
})


$scope.museums.push({value:"BMAG",name:'Bristol Museum & Art Gallery'});
$scope.museums.push({value:"M-SHED",name:'M Shed'});		
$scope.museums.push({value:"GEORGIAN-HOUSE",name:'The Georgian House Museum'});	
$scope.museums.push({value:"RED-LODGE",name:'The Red Lodge'});				
$scope.museums.push({value:"BLAISE",name:'Blaise Museum'});
$scope.museums.push({value:"BRISTOL-ARCHIVES",name:'Bristol Archives'});
$scope.museums.push({value:"ROMAN-VILLA",name:'Kings Weston Roman Villas'});	
		

	 Community_groups.query({}, function(groups) {
 
		past_community=[]
		_.each(	groups	, function(group) {
			
			_group=[]
			_group.name=group
			_group.value=group
			past_community.push(_group)
			
		})
		
		$scope.community_groups =past_community
		$scope.community_groups.push({name:'add new group'})
	
	});

 
	 Emu_events.getData().then(function(response){
	 
			past_events=[]
			_.each(response,function(event){

					if(new Date(event.startDate)<=new Date() && event.type!="Facilities"  && event.type!="Poster - Digital Signage" ){
						past_events.push(event)
						console.log('past event',event)
					}
			})
			$scope.events =past_events
			$scope.events.push({name:'add new event'})
		
	 });

 
    $scope.add = function (newValue) {
		
        var obj = {};
        obj.name = newValue;
        obj.value = newValue.name;
        $scope.events.push(obj);
        $scope.event = obj;
        $scope.newValue = '';
		
    }
	 $scope.add_community = function (newValue) {
		  
      
         var obj = {};
        obj.name = newValue;
        obj.value = newValue.name;
        $scope.community_groups.push(obj);
        $scope.community_group = obj;
        $scope.newValue = '';
     
		
    }
	
	
	
 
    // function definition
	 $scope.form_name="Bristol Culture activities"
	 $scope.age_groups=[]
	 $scope.target_groups=[]
	  $scope.selection = [];
	  $scope.on_site_off_site="";
	 // Fruits
	$scope.target_groups.push({name:'Black, Asian, and minority ethnic (BAME)'});
	$scope.target_groups.push({name:'Disability'});
	$scope.target_groups.push({name:'Lesbian, Gay, Bisexual, and Transgrender (LGBT)'});
	$scope.target_groups.push({name:'Children and Young People (CYP)'});
	$scope.target_groups.push({name:'Older People'});
	$scope.target_groups.push({name:'Socio-economically disadvantaged group'}); 
	$scope.target_groups.push({name:'Faith/Religion'});
	$scope.target_groups.push({name:' Health/Wellbeing'});

 

 $scope.deleteUser = function toggleSelection(userToEdit) {
 
   var idx = $scope.age_groups.indexOf(userToEdit);
  if (idx > -1) {
      $scope.age_groups.splice(idx, 1);
    }
 
 }
 
 
 
 $scope.toggleSelection = function(target_group) {
    var idx = $scope.selection.indexOf(target_group);

    // Is currently selected
    if (idx > -1) {
      $scope.selection.splice(idx, 1);
    }

    // Is newly selected
    else {
      $scope.selection.push(target_group);
    }
  };
  
  
	 $scope.addCount=function() {
	 
		 var age_group={ name: visit_form.age_group.value,
					count: visit_form.count.value
		}
		console.log("clear age group")
		visit_form.age_group.value=""
		visit_form.count.value=""
		$scope.age_groups.push(age_group)
	 }
	 
	 	 $scope.addtarget_groups=function() {
	 
		 var target_groups={ name: visit_form.target_group.value
					
		}
	
		$scope.target_groups.push(target_groups)
		visit_form.age_group.value=""
		visit_form.count.value=""
		 $scope.$apply()
	 }
	
	
	
	
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_events({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			
			age_groups: $scope.age_groups,
			on_site_off_site: visit_form.on_site_off_site.value,
			target_groups:$scope.selection,
			event_name: $('#event_name').find("option:selected").text(),
			age_group: visit_form.age_group.value,
			event_lead: visit_form.event_lead.value,
			community_group: $('#community_group').find("option:selected").text(),
		

			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			date_value_end:visit_form.date_value_end.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			
			
			var query = {'museum_id':visit_form.museum.value,
				         "date_value":visit_form.date_value.value,
						 "on_site_off_site": visit_form.on_site_off_site.value,
						  "exact":true
						};
			
			Raw_events.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure for that date - are you sure you want to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_events.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)		
							visit_form.on_site_off_site.value=""
							$scope.age_groups=[]
							$scope.selection=[]
							visit_form.event_name.value=""
							visit_form.community_group=""
							visit_form.count.value=""
							visit_form.age_group.value=""
							visit_form.comments.value=""
							visit_form.date_value.value=""
							visit_form.event_lead.value=""
							
							
							visit_form.date_value_end.value=""
						

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/events/performance-form-controller.js","/../components/performance/events")
},{"b55mWE":4,"buffer":3}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_events,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
		$scope.table_class="col-md-12 col-lg-12col-sm-12 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_events
		$rootScope.featured_collection=Raw_events
		$rootScope.canEdit_table=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "on_site_off_site":"#"}
		var columnDefs= []
	  $scope.moused = function(){console.log("moused over");}

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:100},
			{ field: 'date_value' ,name: "Week beginning",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:90},
			{ field: 'on_site_off_site',name: "Site" ,resizable: true,width:100},
			{ field: 'event_lead',name: "Event Lead" ,resizable: true,width:140},		
			{ field: 'event_name',name: "Name of Event" ,resizable: true,width:250},	
			{ field: 'community_group',name: "Community Group" ,resizable: true,width:250},	
			
			
			{ field: 'under_5',name: "Under 5s" ,resizable: true,width:100,Editable:false},	
			{ field: '_5_15',name: "5 - 15" ,resizable: true,width:100,Editable:false},	
			{ field: '_16_over',name: "Adults 16+" ,resizable: true,width:100,Editable:false},	
			
			
			{ field: 'count',name: "Total" ,resizable: true,width:100,Editable:false},	
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
				get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/events/raw-events-controller.js","/../components/performance/events")
},{"b55mWE":4,"buffer":3}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_events_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_events,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_events.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="count"){
					
						console.log("count")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","count")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'on_off_site',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:80, pinnedLeft:true, enableColumnMoving:false  }
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","count")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/events/yearly-events-controller.js","/../components/performance/events")
},{"b55mWE":4,"buffer":3}],28:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_exhibitions_pwyt_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_exhibitions_pwyt,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
			
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly total"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "250", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "250", pinnedLeft:true}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Monthly_exhibitions_pwyt.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
					if(row.stat=="Donations"){
						console.log("Donations")
						$scope.data_rows.push(row)
						
					}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","donation_box_amount")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watch('end_date', function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: "250"},
								{ field: 'stat',		name: "Statistic",width: "250"}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"donation_box_amount")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/exhibitions-pwyt/monthly-donations-controller.js","/../components/performance/exhibitions-pwyt")
},{"b55mWE":4,"buffer":3}],29:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.exhibitions_pwyt_performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_exhibitions_pwyt,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
$scope.extraQuery = { "donation_box_no":"#"}
    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_exhibitions_pwyt({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			donation_box_amount: visit_form.donation_box_amount.value,
			donation_box_no: visit_form.donation_box_no.value,
			no_envelopes: visit_form.no_envelopes.value,
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"donation_box_no":visit_form.donation_box_no,"exact":true};
			
			Raw_exhibitions_pwyt.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_exhibitions_pwyt.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							 visit_form.donation_box_amount.value=""
							visit_form.donation_box_no.value=""
							visit_form.no_envelopes.value=""
			
			
			
							   get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)	
							

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/exhibitions-pwyt/performance-form-controller.js","/../components/performance/exhibitions-pwyt")
},{"b55mWE":4,"buffer":3}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_exhibitions_pwyt_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_exhibitions_pwyt,data_table_reload,get_table_data,grid_ui_settings ,	table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_exhibitions_pwyt
		$rootScope.featured_collection=Raw_exhibitions_pwyt
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.extraQuery = { "donation_box_no":"#"}

		/*

			total_sales: { type: Number},
			non_vat_sales: { type: Number},
			net_sales: { type: Number},
			no_transactions: { type: Number},
		*/			

$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"130"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'donation_box_amount' ,resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'donation_box_no' ,resizable: true},
			{ field: 'no_envelopes' ,resizable: true},
			//{ field: 'non_vat_sales' ,resizable: true},
			//{ field: 'net_sales' ,resizable: true},
			//{ field: 'no_transactions' ,resizable: true},
			//{ field: 'average_transaction' ,resizable: true},
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			
				
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/exhibitions-pwyt/raw-donations-controller.js","/../components/performance/exhibitions-pwyt")
},{"b55mWE":4,"buffer":3}],31:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.exhibitions_summary_controller = function(monthly_data_table_columns,$route,$scope, $http, $q, $routeParams, $location,$rootScope,Emu_events,grid_ui_settings)
     {
		
	
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-6 col-lg-62 col-sm-5"
			$scope.table_heading = "Monthly event figues"
			$scope.chart_heading = "Data  by month"
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			$scope.filter_pieSelected=[]
		
			
			
			build_report = function(){
			
			$scope.filter_pie=[]
			
			columnDefs.push(
				{ field: 'name',		name: "Name",width:150, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'venue',		name: "Venue",width:90, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'event_space',		name: "Gallery",width:90, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'startDate',		name: "Start",width:100, pinnedLeft:true, enableColumnMoving:false },
				{ field: 'endDate',		name: "End",width:100, pinnedLeft:true, enableColumnMoving:false }
			)

			 Emu_events.getData().then(function(response){
	
							$scope._rows=[]
						  $scope.options_list = [];
							_.each(response,function(event){
								if(event.type=="Exhibition" && new Date(event.startDate)>=$scope.start_date ){	
										$scope.options_list.push(event)
										$scope._rows.push(event)
										console.log(event)
								}
							})

							$scope.gridOptions.data=$scope._rows;
							$scope.gridOptions.columnDefs=columnDefs
			 });

		

			}	
			
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					build_report()		
			
			
			});


			
}







}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/exhibitions/exhibitions-summary-controller.js","/../components/performance/exhibitions")
},{"b55mWE":4,"buffer":3}],32:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_teg,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly TEG stats"
		$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.chart_heading= "Gallery visits by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 80, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 100}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			columnDefs.enableFiltering=false
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		
			$scope.museums  =[]
			$scope.selected_chart_stats=["TEG visits"]
		
		
			Monthly_teg.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
						if(row.museum!=""){
							$scope._rows.push(row)
							if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
							if(row.stat=="gallery_visits"){
							
								console.log("gallery_visits")
								$scope.data_rows.push(row)
						
							}
					}
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					columnDefs.enableFiltering=false
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gallery-visits/monthly-teg-controller.js","/../components/performance/gallery-visits")
},{"b55mWE":4,"buffer":3}],33:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.teg_performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_teg,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_teg({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					value: visit_form.no_visits.value,
					//donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Raw_teg.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_teg.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  visit_form.no_visits.value=""
							 
								get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gallery-visits/performance-form-controller.js","/../components/performance/gallery-visits")
},{"b55mWE":4,"buffer":3}],34:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_teg,data_table_reload,get_table_data,grid_ui_settings ,$rootScope,table_security
    ) {
		
		$scope.table_class="col-md-10 col-lg-10 col-sm-10 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_teg
		$rootScope.featured_collection=Raw_teg
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'value'  ,name: "Visitors",resizable: true},
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
		)
			
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gallery-visits/raw-teg-controller.js","/../components/performance/gallery-visits")
},{"b55mWE":4,"buffer":3}],35:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.weekly_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Weekly_teg,make_a_pie,make_a_line_chart,weekly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Weekly TEG stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width: "70", pinnedLeft:true},
			{ field: 'stat',		name: "Statistic",width: "50", pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(weekly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			Weekly_teg.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="gallery_visits"){
						console.log("gallery_visits")
						$scope.data_rows.push(row)
						
					}
					}
			
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				for (week = 0; week < moment().isoWeeksInYear(); week++) { 
							
						$scope.filter_pie.push({value:week+" "+year,name:week+" "+year})
				}	
				
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
				$scope.$watch('end_date', function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: "250"},
								{ field: 'stat',		name: "Statistic",width: "250"}
					)
					columnDefs=columnDefs.concat(weekly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gallery-visits/weekly-teg-controller.js","/../components/performance/gallery-visits")
},{"b55mWE":4,"buffer":3}],36:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_teg_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_teg,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly TEG stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 90, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_teg.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="gallery_visits"){
					
						console.log("gallery_visits")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gallery-visits/yearly-teg-controller.js","/../components/performance/gallery-visits")
},{"b55mWE":4,"buffer":3}],37:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_all_giftaid_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_all_giftaid,grid_ui_settings,table_security
    ) {
		
		
		
	

		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=false
		$scope.table_heading = "All combined gift aid"

		 columnDefs.push(
			{ field: 'museum' ,name: "Museum",width: "150", pinnedLeft:true},
			//{ field: 'stat' ,name: "Statistic",width: "180"},
			{ field: 'Apr 2017',name: "Apr 17",width: "80"},
			{ field: 'May 2017',name: "May 17",width: "80"},
			{ field: 'Jun 2017',name: "Jun 17",width: "80"},
			{ field: 'Jul 2017' ,name: "Jul 17",width: "80"},
			{ field: 'Aug 2017',name: "Aug 17",width: "80"},
			{ field: 'Sep 2017' ,name: "Sep 17",width: "80"},
			{ field: 'Oct 2017' ,name: "Oct 17",width: "80"},
			{ field: 'Nov 2017' ,name: "Nov 17",width: "80"},
			{ field: 'Dec 2017' ,name: "Dec 17",width: "80"},
			{ field: 'Jan 2018',name: "Jan 18",width: "80"},
			{ field: 'Feb 2018' ,name: "Feb 18",width: "80"},
			{ field: 'Mar 2018' ,name: "Mar 18",width: "80"}
			
			)
			
	$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		 console.log('getData')	
			Monthly_all_giftaid.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gift-aid/monthly-allgiftaid-controller.js","/../components/performance/gift-aid")
},{"b55mWE":4,"buffer":3}],38:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_giftaid_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_giftaid,grid_ui_settings,table_security
    ) {
		
		
		
		
	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=false
		

		 columnDefs.push(
					{ field: 'museum' ,name: "Museum",width: "150", pinnedLeft:true},
			//{ field: 'stat' ,name: "Statistic",width: "180"},
			{ field: 'Apr 2017',name: "Apr 17",width: "80"},
			{ field: 'May 2017',name: "May 17",width: "80"},
			{ field: 'Jun 2017',name: "Jun 17",width: "80"},
			{ field: 'Jul 2017' ,name: "Jul 17",width: "80"},
			{ field: 'Aug 2017',name: "Aug 17",width: "80"},
			{ field: 'Sep 2017' ,name: "Sep 17",width: "80"},
			{ field: 'Oct 2017' ,name: "Oct 17",width: "80"},
			{ field: 'Nov 2017' ,name: "Nov 17",width: "80"},
			{ field: 'Dec 2017' ,name: "Dec 17",width: "80"},
			{ field: 'Jan 2018',name: "Jan 18",width: "80"},
			{ field: 'Feb 2018' ,name: "Feb 18",width: "80"},
			{ field: 'Mar 2018' ,name: "Mar 18",width: "80"}
			
			)
			
	$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		 console.log('getData')	
			Monthly_giftaid.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gift-aid/monthly-giftaid-controller.js","/../components/performance/gift-aid")
},{"b55mWE":4,"buffer":3}],39:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_giftaid_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_giftaid,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_giftaid({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			amount: visit_form.amount.value,
			no_envelopes: visit_form.no_envelopes.value,
		
			
			
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Raw_giftaid.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_giftaid.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  visit_form.reset()
							 
							 get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gift-aid/performance-form-controller.js","/../components/performance/gift-aid")
},{"b55mWE":4,"buffer":3}],40:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_giftaid_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_giftaid,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.featured_collection=Raw_giftaid
		$rootScope.featured_collection=Raw_giftaid
		var columnDefs= []
		$rootScope.canEdit_table=true

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'amount' ,resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'no_envelopes' ,resizable: true},

			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
				get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/gift-aid/raw-giftaid-controller.js","/../components/performance/gift-aid")
},{"b55mWE":4,"buffer":3}],41:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.age_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Age_learning,make_a_pie
    ) {
		
		
		
		//$scope.show_all_Button=true
	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

		 columnDefs.push(
			{ field: 'museum' ,name: "Museum",width: "150"},
			{ field: 'age_group' ,name: "Age Group",width: "250"},
			//{ field: 'stat' ,name: "Statistic",width: "180"},
			
			{ field: '2017 total_sessions',name: "No. sessions [2017]",width: "150"},
			{ field: '2017 total_children',name: "No. children [2017]",width: "150"},
			{ field: '2017 total_teachers',name: "No. teachers [2017]",width: "150"},
			{ field: '2017 total_income',name: "Income [2017]",width: "150"}
			
		
			
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
   
			  });
				},
		};

		 console.log('getData')	
			Age_learning.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					//console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			$scope.filter_pie=[]
			$scope.filter_pie.push({value:"2017 total_children",name:"No. children"})
			$scope.filter_pie.push({value:"2017 total_sessions",name:"No. sessions"})
			$scope.filter_pie.push({value:"2017 total_teachers",name:"No. teachers"})
			$scope.filter_pieSelected = $scope.filter_pie[0].name; 
			make_a_pie.build($scope,"2017 total_children","age_group")
		
			$scope.changedValue = function(item){       
					make_a_pie.build($scope,item,"age_group")
			}
		
		})	
	

		
				 

	
$scope.chart_title="Age groups"



		
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/learning/age-learning-controller.js","/../components/performance/learning")
},{"b55mWE":4,"buffer":3}],42:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_learning,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = "Monthly event figues"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			var columnDefs= []
			$scope.filter_pie=[]
			
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'session_type',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:180, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'stat',		name: "Statistic",width:80, pinnedLeft:true, enableColumnMoving:false  }		
			)
			
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			$scope.options_list=[]
			$scope.session_type="INDEPENDENT"
			option=[]
			option.name="INDEPENDENT"
			option.value="INDEPENDENT"
			$scope.options_list.push(option)
			option=[]
			option.name="FACILITATED"
			option.value="FACILITATED"
			$scope.options_list.push(option)
				
		
			$scope.get_data=function(session_type){
			console.log('get_data')
			Monthly_learning.query({"session_type":session_type}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
					$scope._rows.push(row)
					if(row.stat=="age_group"){	
					$scope.data_rows.push(row)
				}					
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			
		
			make_a_line_chart.build($scope,columnDefs,"age_group")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
			columnDefs=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'session_type',		name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'age_group',		name: "Age Group",width:180, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'stat',		name: "Statistic",width:80, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"age_group")
									
			
			
			});
	
			
		})	
		
		}
		
			$scope.get_data("FACILITATED")

			
			$scope.changedValue = function(item){ 
					console.log('filter')		
					$scope.get_data(item)
			}
		
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/learning/monthly-learning-controller.js","/../components/performance/learning")
},{"b55mWE":4,"buffer":3}],43:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_learning_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_learning,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
	$scope.extraQuery = { "session_type":"#", "age_group":"#"}
    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_learning({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			total_sessions: visit_form.total_sessions.value,
			total_children: visit_form.total_children.value,
			total_teachers: visit_form.total_teachers.value,
			total_income: visit_form.total_income.value,
			age_group: visit_form.age_group.value,
			session_type:encodeURI(visit_form.session_type.value),
		
			
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			date_value_end:visit_form.date_value_end.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,
				        "date_value":visit_form.date_value.value,
						  "session_type":visit_form.session_type.value,
						    "age_group":encodeURI(visit_form.age_group.value),
							"exact":true
						};
			
			Raw_learning.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure for that date - are you sure you want to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_learning.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							 get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
								visit_form.total_sessions.value=""
								visit_form.total_children.value=""
								visit_form.total_teachers.value=""
								visit_form.total_income.value=""
								visit_form.age_group.value=""
								//visit_form.session_type.value=""
								visit_form.session_type.comments.value=""
			
	

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/learning/performance-form-controller.js","/../components/performance/learning")
},{"b55mWE":4,"buffer":3}],44:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_learning,data_table_reload,AuthService,grid_ui_settings,get_table_data,table_security
    ) {
		
	
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_learning
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$rootScope.featured_collection=Raw_learning
		$rootScope.canEdit_table=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		
		$scope.extraQuery = { "session_type":"#", "age_group":"#"}
		
	

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:90},
			{ field: 'session_type' ,name: "Type",resizable: true,width:90},
			
			{ field: 'date_value' ,name: "Week beginning",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\'',width:90},
			{ field: 'age_group',name: "Age" ,resizable: true,width:200},
			{ field: 'total_sessions',name: "No. sessions" ,resizable: true,width:100},
			{ field: 'total_children',name: "No. children" ,resizable: true,width:100},
			{ field: 'total_teachers' ,name: "No. teachers",resizable: true,width:100},
			{ field: 'total_income' ,name: "Total income",resizable: true,width:100,cellFilter:'currency:"&pound;" : 2'},
		
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			)
			
				$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/learning/raw-learning-controller.js","/../components/performance/learning")
},{"b55mWE":4,"buffer":3}],45:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_learning_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_learning,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly Income stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:95, pinnedLeft:true, enableColumnMoving:false  },
			{ field: 'session_type',		name: "Type",width:95, pinnedLeft:true, enableColumnMoving:false  }
			//{ field: 'stat',	name: "Stat",width:80, pinnedLeft:true }
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
		 
		 
		 
		 session_type="INDEPENDENT"
		 
		 
		 
			Yearly_learning.query({"session_type":session_type}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					//if(row.stat=="count"){
					
						console.log("count")
						$scope.data_rows.push(row)
						
					//}
					}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
					{ field: 'museum',name: "Museum",width:95, pinnedLeft:true, enableColumnMoving:false  },
					{ field: 'session_type',name: "Type",width:80, pinnedLeft:true, enableColumnMoving:false  }
					//{ field: 'stat',name: "Stat",width:75, pinnedLeft:true }
			
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/learning/yearly-learning-controller.js","/../components/performance/learning")
},{"b55mWE":4,"buffer":3}],46:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_operations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_operations,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Monthly Operation stats"
		$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.chart_heading= "Visits by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 80, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 100}
					
			)
		$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			columnDefs.enableFiltering=false
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Monthly_operations.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
						if(row.museum!=""){
							$scope._rows.push(row)
							
							if(row.stat=="Visits"){
								console.log("visits")
								$scope.data_rows.push(row)
							}
					}
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","Visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					columnDefs.enableFiltering=false
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/operations/monthly-operations-controller.js","/../components/performance/operations")
},{"b55mWE":4,"buffer":3}],47:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_operations_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_operations,data_table_reload
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_operations({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
				//DEPARTMENTAL VARIABLES	
					
					no_complaints:visit_form.no_complaints.value,
					health_and_safety_forms: visit_form.health_and_safety_forms.value,
					
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value};
			
			Raw_operations.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			//if(visits.length>0) {
			
			
			//if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_operations.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			//} else {
				// Do nothing!
			//}
			
			
		//	}
			//else
			//{			
						//save(kpis)
			//}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  visit_form.reset()
							 
							   data_table_reload.setDate(kpis.date_value);

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/operations/performance-form-controller.js","/../components/performance/operations")
},{"b55mWE":4,"buffer":3}],48:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_operations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_operations,data_table_reload,get_table_data,grid_ui_settings ,$rootScope,table_security
    ) {
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-6 full-height"
		$scope.show_all_Button=true
		$scope.featured_collection=Raw_operations
		$rootScope.featured_collection=Raw_operations
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'no_complaints' ,name: "no_complaints",resizable: true,width:"150"},
			{ field: 'health_and_safety_forms' ,name: "health_and_safety_forms",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'value'  ,name: "Visitors",resizable: true,cellFilter: 'currency:"£" : 5' },
			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
		)
			
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}			








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/operations/raw-operations-controller.js","/../components/performance/operations")
},{"b55mWE":4,"buffer":3}],49:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_operations_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_operations,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly Operation stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 90, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_operations.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					//if(row.stat=="visits"){
					
						console.log("visits")
						$scope.data_rows.push(row)
						
					//}
					}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/operations/yearly-operations-controller.js","/../components/performance/operations")
},{"b55mWE":4,"buffer":3}],50:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
		
				exports.dateSelect = function() {
  return {
	  
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/date_select.html'
  }
  }

		
		exports.pieChart = function() {
  return {
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/pie_chart.html'
  }
  }

		exports.lineChart = function() {
  return {
  // controller: 'giftaid_performance_form',
         templateUrl: './shared/templates/line_chart.html'
  }
  }	
  			exports.learningDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/retail/dashboard.html'
  }
	}

	exports.learningFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/learning/kpi-form-and-data.html'
  }
  }
	
		exports.rawLearning = function() {
  return {
   controller: 'raw_learning_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
exports.yearlyLearning = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		
		exports.recordLearning = function() {
  return {
   controller: 'record_learning_controller',
      templateUrl: './components/performance/learning/kpi-form.html'
  }
	}
	
		exports.monthlyLearning = function() {
  return {
   controller: 'monthly_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	
			
		
		
		exports.ageLearning = function() {
  return {
   controller: 'age_learning_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	

			exports.retailDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/retail/dashboard.html'
  }
	}	
	
				exports.exhibitionspwytDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/exhibitions-pwyt/dashboard.html'
  }
	}
		
		
			exports.learningDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/learning/dashboard.html'
  }
	}	

			exports.visitsDashboard = function() {
  return {
 controller: 'dashboard_controller',
    templateUrl: './components/performance/visits/dashboard.html'
  }
	}	
	
				exports.donationsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/donations/dashboard.html'
  }
	}	
	
		
		
exports.welcomedeskFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/welcome-desk/kpi-form-and-data.html'
  }
}
	
exports.rawWelcomedesk = function() {
  return {
   controller: 'raw_welcomedesk_controller',
     templateUrl: './shared/templates/data_table.html'
  }
}
	
						exports.welcomedeskDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/welcome-desk/dashboard.html'
  }
	}	
	

	
exports.recordWelcomedesk = function() {
  return {
   controller: 'record_welcomedesk_controller',
      templateUrl: './components/performance/welcome-desk/kpi-form.html'
  }
}
exports.yearlyWelcomedesk = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'yearly_welcomedesk_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}	
	
exports.monthlyWelcomedesk = function() {
  return {
   controller: 'monthly_welcomedesk_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}	

exports.rawVisits = function() {
 return {
     controller: 'raw_visitor_numbers_controller',
     templateUrl: './shared/templates/data_table.html'
  }
}
	
exports.monthlyVisits = function() {
  return {
   controller: 'monthly_visitor_numbers_controller',
   templateUrl: './shared/templates/data_table.html'
  }
}
	

				exports.yearlyVisits = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_visitor_numbers_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
exports.giftaidFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/gift-aid/kpi-form-and-data.html'
  }
 }
	
		exports.rawGiftaid = function() {
  return {
   controller: 'raw_giftaid_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
	

	
	
		
		exports.recordGiftaid = function() {
  return {
   controller: 'record_giftaid_controller',
      templateUrl: './components/performance/gift-aid/kpi-form.html'
  }
	}
	
			exports.monthlyAllgiftaid = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'monthly_all_giftaid_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyGiftaid = function() {
  return {
    restrict: "E",
    scope: {},
   controller: 'monthly_giftaid_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
					exports.yearlyDonations = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_donations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.rawDonations = function() {
  return {
   controller: 'raw_donations_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyDonations = function() {
  return {
   controller: 'monthly_donations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
	exports.rawTurnstiles = function() {
  return {
   controller: 'raw_turnstiles_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyTurnstiles = function() {
  return {
   controller: 'monthly_turnstiles_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	

	exports.recordDonations = function() {
  return {
   controller: 'donations_performance_form',
    templateUrl: './components/performance/donations/kpi-form.html'
  }
}
exports.donationsFormdata = function() {
  return {

   templateUrl: './components/performance/donations/kpi-form-and-data.html'
  }
}

	
exports.kpiForm = function() {
  return {
   controller: 'visits_form',
    templateUrl: './components/performance/visits/kpi-form.html'
  }
}



exports.visitsFormdata = function() {
  return {

   templateUrl: './components/performance/visits/kpi-form-and-data.html'
  }
}

exports.retailFormdata = function() {
  return {
  
    templateUrl: './components/performance/retail/kpi-form-and-data.html'
  }
}


exports.retailKpiform = function() {
  return {
   controller: 'retail_performance_form',
    templateUrl: './components/performance/retail/kpi-form.html'
  }
}

					exports.yearlyRetailsales = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_retail_sales_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}

	exports.rawRetailsales = function() {
  return {
   controller: 'raw_retail_sales_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyRetailsales = function() {
  return {
   controller: 'monthly_retail_sales_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
	
	
	exports.exhibitionspwytFormdata = function() {
  return {
  
    templateUrl: './components/performance/exhibitions-pwyt/kpi-form-and-data.html'
  }
}


exports.recordExhibitionspwyt  = function() {
  return {
   controller: 'exhibitions_pwyt_performance_form',
    templateUrl: './components/performance/exhibitions-pwyt/kpi-form.html'
  }
}

		exports.monthlyExhibitionspwyt = function() {
  return {
   controller: 'monthly_exhibitions_pwyt_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}

	exports.rawExhibitionspwyt = function() {
  return {
   controller: 'raw_exhibitions_pwyt_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}

	
	
		exports.tegFormdata = function() {
  return {
  
    templateUrl: './components/performance/gallery-visits/kpi-form-and-data.html'
  }
}


exports.recordTeg  = function() {
  return {
   controller: 'teg_performance_form',
    templateUrl: './components/performance/gallery-visits/kpi-form.html'
  }
}

	

	exports.rawTeg = function() {
  return {
   controller: 'raw_teg_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		exports.monthlyTeg = function() {
  return {
	  
   controller: 'monthly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.yearlyTeg = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
			exports.weeklyTeg = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'weekly_teg_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
				exports.tegDashboard = function() {
  return {
     controller: 'dashboard_controller',
    templateUrl: './components/performance/gallery-visits/dashboard.html'
  }
	}
			
		exports.yearlyEvents = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_events_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
		
		exports.monthlyEvents = function() {
  return {
   controller: 'monthly_events_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
	
			exports.eventsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/events/kpi-form-and-data.html'
  }
  }
	
		exports.rawEvents = function() {
  return {
   controller: 'raw_events_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
		exports.recordEvents = function() {
  return {
   controller: 'record_events_controller',
      templateUrl: './components/performance/events/kpi-form.html'
  }
	}
	
	exports.eventsDashboard = function() {
  return {
     controller: 'dashboard_controller',
    templateUrl: './components/performance/events/dashboard.html'
  }
	}
	
	
		exports.monthlyOperations = function() {
  return {
   controller: 'monthly_operations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}	
	
			exports.operationsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/performance/operations/kpi-form-and-data.html'
  }
  }
	
		exports.rawOperations = function() {
  return {
   controller: 'raw_operations_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
	
		
		exports.recordOperations = function() {
  return {
   controller: 'record_operations_controller',
      templateUrl: './components/performance/operations/kpi-form.html'
  }
	}
	

				exports.yearlyOperations = function() {
  return {
	    restrict: "E",
    scope: {},
   controller: 'yearly_operations_controller',
   templateUrl: './shared/templates/data_table.html'
  }
	}
					exports.operationsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/operations/dashboard.html'
  }
	}	
	

	
						exports.exhibitionsDashboard = function() {
  return {
   controller: 'dashboard_controller',
    templateUrl: './components/performance/exhibitions/dashboard.html'
  }
	}	
	
exports.giftaidDashboard = function() {
  return {
    controller: 'dashboard_controller',
    templateUrl: './components/performance/gift-aid/dashboard.html'
  }
	}	
		
	
			
	exports.exhibitionsSummary = function() {
  return {
   controller: 'exhibitions_summary_controller',
  templateUrl: './shared/templates/data_table.html'
  }
	}
	
	
						exports.analyserDashboard = function() {
  return {
    controller: 'analyser_controller',
    templateUrl: './components/performance/analyser/dashboard.html'
  }
	}	
	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/performance-directive.js","/../components/performance")
},{"b55mWE":4,"buffer":3}],51:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_retail_sales,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
	    console.log('controller go')
		$scope.start_date=new Date("01/04/2017")
		$scope.end_date=new Date("01/04/2018")
		$scope.table_heading = "Monthly retail sales"
		$scope.chart_heading = "Data  by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.filter_pie=[]
		$rootScope.canEdit_table=false
		
		 columnDefs.push(
		 
			{ field: 'museum' ,name: "Museum",width: "40", pinnedLeft:true},
			{ field: 'stat' ,name: "Statistic",width: "60", pinnedLeft:true}
			
			)
	
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		

		
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);	
		

		$scope.museums  =[]
		$scope.selected_chart_stats=["Net sales"]
			
			
			Monthly_retail_sales.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){
					$scope._rows.push(row)
						if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						$scope.data_rows.push(row)
					
				}
			
				})
			
			$scope.gridOptions.data=$scope._rows;
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
								//(scope,columnDefs,data_values,label_values)
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
						{ field: 'museum' ,name: "Museum",width: "150", pinnedLeft:true},
						{ field: 'stat' ,name: "Statistic",width: "180", pinnedLeft:true}			
						)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/retail/monthly-retail-sales-controller.js","/../components/performance/retail")
},{"b55mWE":4,"buffer":3}],52:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.retail_performance_form =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Retail_sales,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Retail_sales({
				museum_id:visit_form.museum.value,				  
				kpi_type: "visits",	
				
				//DEPARTMENTAL VARIABLES	
				total_sales: visit_form.total_sales.value,
				non_vat_sales: visit_form.non_vat_sales.value,
				//net_sales: visit_form.net_sales.value,
				no_transactions: visit_form.no_transactions.value,
				
				date_logged:new Date(),	
				date_value:visit_form.date_value.value,
				comments:"",			
				logger_user_name: $scope.user.username
            });
			

			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Retail_sales.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + JSON.stringify(visits[0]) + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Retail_sales.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
						
							get_table_data.getData(moment(new Date(visit_form.date_value.value)).subtract({'months':1})._d,$scope)
								visit_form.total_sales.value=""
							visit_form.non_vat_sales.value=""
							visit_form.no_transactions.value=""
							//data_table_reload.setDate(kpis.date_value);
							    alert(message);

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/retail/performance-form-controller.js","/../components/performance/retail")
},{"b55mWE":4,"buffer":3}],53:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Retail_sales,data_table_reload,AuthService,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-6 full-height"
		$scope.featured_collection=Retail_sales
		$rootScope.featured_collection=Retail_sales
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data='__data'
		var columnDefs= []
		$rootScope.canEdit_table=true

		
		
		
		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"70"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''},
			{ field: 'total_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'non_vat_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'net_sales' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'no_transactions' ,resizable: true},
			{ field: 'average_transaction' ,resizable: true,cellFilter: 'currency:"&pound;" : 2'},
			{ field: 'comments' ,name: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,name: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)



}











}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/retail/raw-retail-sales-controller.js","/../components/performance/retail")
},{"b55mWE":4,"buffer":3}],54:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_retail_sales_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_retail_sales,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 90, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_retail_sales.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="visits"){
					
						console.log("visits")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/retail/yearly-retail-sales-controller.js","/../components/performance/retail")
},{"b55mWE":4,"buffer":3}],55:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_turnstiles_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_turnstiles,grid_ui_settings,table_security
    ) {
		
		
		
		
	console.log('controller go')
	//console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$rootScope.canEdit_table=false
		

		 columnDefs.push(
			{ field: 'exhibition' ,name: "Exhibition",width: "150", pinnedLeft:true},
			{ field: 'Apr 2017',name: "Apr 17",width: "100"},
			{ field: 'May 2017',name: "May 17",width: "100"},
			{ field: 'Jun 2017',name: "Jun 17",width: "100"},
			{ field: 'Jul 2017' ,name: "Jul 17",width: "100"},
			{ field: 'Aug 2017',name: "Aug 17",width: "100"},
			{ field: 'Sep 2017' ,name: "Sep 17",width: "100"},
			{ field: 'Oct 2017' ,name: "Oct 17",width: "100"},
			{ field: 'Nov 2017' ,name: "Nov 17",width: "100"},
			{ field: 'Dec 2017' ,name: "Dec 17",width: "100"},
			{ field: 'Jan 2018',name: "Jan 18",width: "100"},
			{ field: 'Feb 2018' ,name: "Feb 18",width: "100"},
			{ field: 'Mar 2018' ,name: "Mar 18",width: "100"}
			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);	

		 console.log('getData')	
			Monthly_turnstiles.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/turnstiles/monthly-turnstiles-controller.js","/../components/performance/turnstiles")
},{"b55mWE":4,"buffer":3}],56:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_turnstiles_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, day_turnstiles,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		

		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.featured_collection=day_turnstiles
		$rootScope.featured_collection=day_turnstiles
		$scope.show_all_Button=true
		$scope.extraQuery = { "museum_id":"#"}
		
		var columnDefs= []
		

		columnDefs.push(
		    { field: 'museum_id' ,name: "Museum",resizable: true},
			{ field: 'exhibition' ,name: "Exhibition",resizable: true},
			{ field: 'date_value' ,value: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'yyyy/MM/dd \''},
			{ field: 'visits' ,name: "Visits",resizable: true}

		)
			
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);			
		get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/turnstiles/raw-turnstiles-controller.js","/../components/performance/turnstiles")
},{"b55mWE":4,"buffer":3}],57:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_visitor_numbers_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_visits,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
			$scope.table_heading = "Monthly visitor figues"
			$scope.chart_heading = "Data  by month"
			$scope.pie_date = "Apr 2017"
			$rootScope.canEdit_table=false
			$scope.gridOptions=[]
			$scope.gridOptions.data=[]
			$scope.selected_museums  =[]
			$scope.selected_chart_stats=["Visits"]
				
			var columnDefs= []
		
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',		name: "Museum",width:150, pinnedLeft:true, enableColumnMoving:false  }
					
			)
			
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);

		
			Monthly_visits.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){	
				
				if($scope.selected_museums.indexOf(row.museum)==-1){$scope.selected_museums.push(row.museum)}
					$scope._rows.push(row)
					
					if(row.museum.indexOf('%')==-1){
						
						$scope.data_rows.push(row)
						
					}
				}
		
				})
			
		
			$scope.gridOptions.data=$scope._rows;
			
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
	
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
			{ field: 'museum',		name: "Museum",width:150, pinnedLeft:true, enableColumnMoving:false  }
					
			)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
	
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/visits/monthly-visits-controller.js","/../components/performance/visits")
},{"b55mWE":4,"buffer":3}],58:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_visitor_numbers_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_visits,data_table_reload,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,get_table_data,table_security
    ) {
		
		
		$scope.table_class="col-md-6 col-lg-6 col-sm-1 full-height"
		$scope.featured_collection=Raw_visits
		$rootScope.featured_collection=Raw_visits
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data='__data'
		var columnDefs= []
		$rootScope.canEdit_table=true

		columnDefs.push(
		
			{ field: 'museum_id' ,name: "Museum",resizable: true,enableFiltering: true,},
			{ field: 'kpi_type' ,name: "kpi",resizable: true,visible:false},
			{ field: 'value' ,resizable: true},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''},
			{ field: 'comments' ,name: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,name: "Logged by",resizable: true,visible:true},
			{ field: 'date_logged', name: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yyyy HH:mm\'',visible:false}
		)
			
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		
		get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


	



}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/visits/raw-visits-controller.js","/../components/performance/visits")
},{"b55mWE":4,"buffer":3}],59:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.visits_form =  function($scope, $http, $q, $routeParams, $location
          ,Raw_visits,data_table_reload,get_table_data
    ) {
		 
		 $scope.visitor_groups=[] 
		 
		 
		  $scope.deleteUser = function toggleSelection(userToEdit) {
				  visit_form.no_visits.value=0
				  
				   var idx = $scope.visitor_groups.indexOf(userToEdit);
				  if (idx > -1) {
					  $scope.visitor_groups.splice(idx, 1);
					}
					_.each($scope.visitor_groups,function(no_visits){
					visit_form.no_visits.value= parseInt(visit_form.no_visits.value)+ parseInt(no_visits.count)
						
						})
 
 }
		 
		 $scope.addCount=function() {
					visit_form.no_visits.value=0
					var visitor_groups={ name: visit_form.visitor_groups.value,
					count: visit_form.count.value
		}
		
		$scope.visitor_groups.push(visitor_groups)
		
		_.each($scope.visitor_groups,function(no_visits){
		  visit_form.no_visits.value= parseInt(visit_form.no_visits.value)+ parseInt(no_visits.count)
		
		})
		
		
		
		
	 }

 $scope.onSubmit=function() {
		

			
		
		    var kpis = new Raw_visits({
					museum_id:visit_form.museum.value,				  
					kpi_type: "visits",	
					
					//DEPARTMENTAL VARIABLES	
					value: visit_form.no_visits.value,
					visitor_groups: $scope.visitor_groups,
					date_logged:new Date(),	
					date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Raw_visits.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + visits[0].value + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_visits.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            

	 
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							
							   visit_form.no_visits.value=""
							 
							  	get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
								  alert(message);

						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/visits/visits-form-controller.js","/../components/performance/visits")
},{"b55mWE":4,"buffer":3}],60:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_visitor_numbers_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_visits,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 90, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2016")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_visits.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					if(row.stat=="visits"){
					
						console.log("visits")
						$scope.data_rows.push(row)
						
					}}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/visits/yearly-visits-controller.js","/../components/performance/visits")
},{"b55mWE":4,"buffer":3}],61:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.monthly_welcomedesk_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Monthly_welcomedesk,make_a_pie,make_a_line_chart,monthly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		
		
		
			$scope.chart_class = "col-md-8 col-lg-8 col-sm-5 pull-right"
			$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
	    console.log('controller go')
		$scope.start_date=new Date("01/04/2017")
		$scope.end_date=new Date("01/04/2018")
		$scope.table_heading = "Monthly data"
		$scope.chart_heading = "Data  by month"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		$scope.filter_pie=[]
		$rootScope.canEdit_table=false
		
		 columnDefs.push(
		 
			{ field: 'museum' ,name: "Museum",width: "40", pinnedLeft:true},
			{ field: 'stat' ,name: "Statistic",width: "160", pinnedLeft:true}
			
			)
	
			columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		

		
		$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);	
		

		$scope.museums  =[]
		$scope.selected_chart_stats=["Net sales"]
			
			
			Monthly_welcomedesk.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				$scope.data_rows=[]
				_.each(team,function(row){
				if(row.museum!=""){
					$scope._rows.push(row)
						if($scope.museums.indexOf(row.museum)==-1){$scope.museums.push(row.museum)}
						$scope.data_rows.push(row)
					
				}
			
				})
			
			$scope.gridOptions.data=$scope._rows;
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum")
								//(scope,columnDefs,data_values,label_values)
				$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push(
						{ field: 'museum' ,name: "Museum",width: "150", pinnedLeft:true},
						{ field: 'stat' ,name: "Statistic",width: "180", pinnedLeft:true}			
						)
					columnDefs=columnDefs.concat(monthly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum")
			
			
			
			});
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/welcome-desk/monthly-welcomedesk-controller.js","/../components/performance/welcome-desk")
},{"b55mWE":4,"buffer":3}],62:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_welcomedesk_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope,Raw_welcomedesk,data_table_reload,grid_ui_settings ,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;

    // function definition
 $scope.onSubmit=function() {
		

		
		    var kpis = new Raw_welcomedesk({
            museum_id:visit_form.museum.value,				  
			kpi_type: "visits",	
			
		//DEPARTMENTAL VARIABLES	
			cash: visit_form.cash.value,
			card: visit_form.card.value,
			no_transactions: visit_form.no_transactions.value,
			no_giftaid_envelopes: visit_form.no_giftaid_envelopes.value,			  
			giftaid_amount: visit_form.giftaid_amount.value,			 
	
			
			date_logged:new Date(),	
			date_value:visit_form.date_value.value,
			comments:visit_form.comments.value,			
			logger_user_name: $scope.user.username
            });
			
			var query = {'museum_id':visit_form.museum.value,"date_value":visit_form.date_value.value,"exact":true};
			
			Raw_welcomedesk.query(query, function(visits) {
				console.log('Raw_visits',visits.length)
			if(visits.length>0) {
			
			
			if (confirm("we already have a figure of " + JSON.stringify(visits[0]) + " for that date - are you sure you wnt to overwrite it ?")) {
			
				_.each(	visits	, function(visit) {
				
				  Raw_welcomedesk.remove({
						id: visit._id
					}, function() {
					  console.log('removed old data')
					});
					})
						save(kpis)
				// Save it!
			} else {
				// Do nothing!
			}
			
			
			}
			else
			{			
						save(kpis)
			}
			})	
			
            
		
	function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
			visit_form.cash.value=""
		visit_form.card.value=""
			visit_form.no_transactions.value=""
		visit_form.no_giftaid_envelopes.value=""		  
			giftaid_amount: visit_form.giftaid_amount.value=""			 
							 
								get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


						})
						

}	

    }
	
	}
 

 

	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/welcome-desk/performance-form-controller.js","/../components/performance/welcome-desk")
},{"b55mWE":4,"buffer":3}],63:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.raw_welcomedesk_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Raw_welcomedesk,data_table_reload,get_table_data,grid_ui_settings ,table_security
    ) {
		
		$scope.show_all_Button=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.featured_collection=Raw_welcomedesk
		$rootScope.featured_collection=Raw_welcomedesk
		var columnDefs= []
		$rootScope.canEdit_table=true
		$scope.show_all_Button=true
	  

		 columnDefs.push(
			{ field: 'museum_id' ,name: "Museum",resizable: true,width:"150"},
			{ field: 'date_value' ,name: "Date",resizable: true ,type: 'date', cellFilter: 'date:\'dd/MM/yy\''},
			{ field: 'cash' ,name: "Cash",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'card' ,name: "Card",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'no_transactions' ,name: "No. of transactions",resizable: true},
			{ field: 'no_giftaid_envelopes' ,name: "No. of gift aid envelopes",resizable: true},
			{ field: 'giftaid_amount' ,name: "Gift aid amount",resizable: true,cellFilter:'currency:"&pound;" : 2'},
			{ field: 'total' ,name: "Total",resizable: true},
			{ field: 'total_inc_giftaid' ,name: "Total inc. gift aid",resizable: true},
			{ field: 'comments' ,name: "Comments",value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)


			
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/welcome-desk/raw-welcomedesk-controller.js","/../components/performance/welcome-desk")
},{"b55mWE":4,"buffer":3}],64:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.yearly_welcomedesk_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Yearly_welcomedesk,make_a_pie,make_a_line_chart,yearly_data_table_columns,grid_ui_settings,table_security
    ) {
		
		$scope.table_class="col-md-4 col-lg-4 col-sm-5"
		$scope.monthWeek='month'
		$scope.show_all_Button=false
		console.log('controller go')
		$scope.table_heading = "Yearly stats"
		$scope.pie_date = "Apr 2017"
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$rootScope.canEdit_table=false
		var columnDefs= []
			$scope.filter_pie=[]
			columnDefs.push(
			{ field: 'museum',	name: "Museum",width: 90, pinnedLeft:true},
			{ field: 'stat',	name: "Statistic",width: 150, pinnedLeft:true}
					
			)
			$scope.start_date=new Date("01/04/2017")
			$scope.end_date=new Date("01/04/2018")
			columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
			console.log('columnDefs',columnDefs)		
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
		 console.log('getData')	
			Yearly_welcomedesk.query({}, function(team) {
				$scope.rows=[]
				$scope.data_rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					if(row.museum!=""){
					$scope._rows.push(row)
					//if(row.stat=="visits"){
					
						console.log("visits")
						$scope.data_rows.push(row)
						
					//}
					}
			
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
			
			_.each([2016,2017],function(year){
				_.each(moment.monthsShort(),function(month){				
						$scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
					
				})
			})
			make_a_pie.build($scope,"Apr 2017","museum")
			make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			$scope.changedValue = function(item){ 
					$scope.pie_date=item			
					make_a_pie.build($scope,item,"museum")
			}
			$scope.$watchGroup(['end_date','start_date'], function(newValue, oldValue) {
  
					columnDefs=[]
					columnDefs.push({ field: 'museum',		name: "Museum",width: 90},
								{ field: 'stat',		name: "Statistic",width: 90}
					)
					columnDefs=columnDefs.concat(yearly_data_table_columns.build($scope,$scope.start_date,$scope.end_date))
					$scope.gridOptions.columnDefs=columnDefs
					make_a_line_chart.build($scope,columnDefs,"museum","gallery_visits")
			
			
			
			});
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/performance/welcome-desk/yearly-welcomedesk-controller.js","/../components/performance/welcome-desk")
},{"b55mWE":4,"buffer":3}],65:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_bookings_controller =  function($scope, $http, $q,  
          Resources,Bookings,data_table_reload,get_table_data,timeline_functions,$routeParams
    ) {

//$scope.setDate = data_table_reload.setDate;

	if($routeParams.mode=="rooms")
	{
		var mode = "room"
		var mode_name = "ROOM BOOKING"
		$scope.name_of_form = mode_name 
	}
	else
	{
		var mode = "equipment"
		var mode_name = "EQUIPMENT BOOKING"
		$scope.name_of_form = "Select Equipment"

	}




			$scope.extraQuery = { "museum_id":"#"}

	  $scope.rooms=[]
	  $scope.Resources=Resources
	  console.log('user', $scope.user)
		var query = {'name':"#",'type':mode,'exact':false};
				
		Resources.query(query, function(rooms) {
					
				
				  _.each(rooms, function(room){					  
				  var _room = []
				  _room.name=room.name
					$scope.rooms.push(_room)
				  })

		})	
			
			$scope.selected_room=""			
			$scope.room_change = function(room) {
				//Your logic
			  $scope.selected_room=room.name
			}
				 
 $scope.onSubmit=function() {
		
			

var event_to_add=	{
													  id : new Date().getUTCMilliseconds(),
													  name :visit_form.name.value,
													 internal_external :visit_form.type_radios.value,														  
													  showimage :"",
													  image :"",
													  start_date : new Date(visit_form.start_date.value),
													  end_date :  new Date(visit_form.end_date.value),	
													  notes  :visit_form.comments.value,	
													 }
			
		    var kpis = new Bookings({
					
					//DEPARTMENTAL VARIABLES	
					start_date: new Date(visit_form.start_date.value),	
					end_date: new Date(visit_form.end_date.value),	
					group:$scope.selected_room,	
					_type: mode_name,	
					className:"GREEN",	
					 internal_external :visit_form.type_radios.value,	
					name:visit_form.name.value,		
					notes:visit_form.comments.value,	
					showimage :"",
					content: timeline_functions.event_html(event_to_add),	
					image :"",

					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
					
            });
			
				
													
                          
			
			var query = {
			
						'name': visit_form.name.value,	
						'_type':mode_name,
						'group':visit_form.room.value,
						'start_date':visit_form.start_date.value,
						'end_date':visit_form.end_date.value
						
						};
			
			Bookings.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		
						save(kpis)
			
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
							visit_form.name.value=""
							visit_form.group.value=""
							visit_form.start_date.value=""
							visit_form.end_date.value=""
							//visit_form._type.value=""
							
							
	
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/bookings/form-controller.js","/../components/resource-bookings/bookings")
},{"b55mWE":4,"buffer":3}],66:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.raw_bookings_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Bookings,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		

if($routeParams.mode=="rooms"){
var mode = "room"
var mode_name = "ROOM BOOKING"
}
else
{
var mode = "equipment"
var mode_name = "EQUIPMENT BOOKING"


}
		  
		$scope.show_all_Button=true
		$scope.table_class = "col-md-12 col-lg-12 col-sm-5"
		$scope.featured_collection=Bookings
		$rootScope.featured_collection=Bookings
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","_type":mode_name}
		$scope.rooms=[]
		
		
		
		
		var columnDefs= []
		
console.log('$location.path',$location.path())
		$rootScope.canEdit_table=true
		
		if(	$scope.user.approve_room_bookings==true && $location.path()=="/bookings/rooms"	||  $scope.user.approve_equipment_bookings==true && $location.path()=="/bookings/equipment"
		) 
		{
			columnDefs.push(
								{ field: 'approved' ,  allowCellFocus: true, type: 'boolean',value: "Approved",resizable: true,visible:true,width:"80",cellTemplate: "<div class='ui-grid-cell-contents'>{{row.entity.approved==true ? 'approved' : 'pending'}}</div>"}
							)
							
		}

		columnDefs.push(
			{ field: 'group' ,name: mode,resizable: true,width:"150"},
			{ field: 'name' ,name: "Name",resizable: true,width:"150"},
			{ field: 'internal_external' ,name: "Type",resizable: true,width:"150"},
			{ field: 'start_date' ,name: "From",type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',resizable: true,width:"150"},	
			{ field: 'end_date' ,name: "Until",resizable: true,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',width:"150"},
			

		  
		  
		  
			{ field: 'comments' ,value: "comments",resizable: true,visible:true,width:"150"},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:true,width:"150"},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:true}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/bookings/raw-bookings-controller.js","/../components/resource-bookings/bookings")
},{"b55mWE":4,"buffer":3}],67:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){






	exports.roomsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/resource-bookings/rooms/kpi-form-and-data.html'
  }
  }
	
		exports.rawRooms = function() {
  return {
   controller: 'raw_rooms_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordRooms = function() {
  return {
  controller: 'record_rooms_controller',
      templateUrl: './components/resource-bookings/rooms/kpi-form.html'
  }
	}
	
	
	
		exports.equipmentFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/resource-bookings/equipment/kpi-form-and-data.html'
  }
  }
	
		exports.rawEquipment = function() {
  return {
   controller: 'raw_equipment_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordEquipment = function() {
  return {
  controller: 'record_equipment_controller',
      templateUrl: './components/resource-bookings/equipment/kpi-form.html'
  }
	}
	
	
			exports.bookingsFormdata = function() {
  return {
  // controller: 'giftaid_performance_form',
      templateUrl: './components/resource-bookings/bookings/kpi-form-and-data.html'
  }
  }
	
		exports.rawBookings = function() {
  return {
   controller: 'raw_bookings_controller',
     templateUrl: './shared/templates/data_table.html'
  }
	}
		exports.recordBookings = function() {
  return {
  controller: 'record_bookings_controller',
      templateUrl: './components/resource-bookings/bookings/kpi-form.html'
  }
	}



}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/directive.js","/../components/resource-bookings")
},{"b55mWE":4,"buffer":3}],68:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_equipment_controller =  function($scope, $http, $q,  
          Resources,data_table_reload,get_table_data,AuthService
    ) {

//$scope.setDate = data_table_reload.setDate;
			$scope.extraQuery = { "museum_id":"#",'type':"equipment"}
$scope.haspermissions=false
   			 AuthService.isLoggedIn().then(function(user){
		
			
						$scope.user=user
						$scope.isloggedin=true			
						if(	user.data.group=="ADMIN"){$scope.haspermissions=true}
						if(	user.data.group=="AV"){$scope.haspermissions=true}
						if(	user.data.group=="EXHIBITIONS"){$scope.haspermissions=true}
						if(	user.data.group=="DIGITAL"){$scope.haspermissions=true}

						main_function(timeline_mode)
			
	  })
	
	  $scope.Resources=Resources
	 
 $scope.onSubmit=function() {
		


		
		    var kpis = new Resources({
					name:visit_form.asset_name.value+ " ("+ visit_form.asset_type.value+") " + visit_form.asset_no.value,
					asset_name:visit_form.asset_name.value,	
					asset_type:visit_form.asset_type.value,
					asset_no:visit_form.asset_no.value,
					label_location:visit_form.label_location.value,	
					label_notes:visit_form.label_notes.value,
					serial_no:visit_form.serial_no.value,
					model_no:visit_form.model_no.value,	
					location:visit_form.location.value,	
					description:visit_form.description.value,						

					
					type: "equipment",	
				//DEPARTMENTAL VARIABLES	
					//donation_box_amount: visit_form.donation_box_amount.value,
					//donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'name':visit_form.asset_name.value,'type':"equipment",'exact':false};
			
			Resources.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		
						save(kpis)
			
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
			
									visit_form.room_name.value=""
									visit_form.asset_no.value=""
									visit_form.label_location.value=""	
									visit_form.label_notes.value=""
									visit_form.serial_no.value=""
									visit_form.model_no.value=""	
									visit_form.location.value=""
									visit_form.description.value=""		
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/equipment/form-controller.js","/../components/resource-bookings/equipment")
},{"b55mWE":4,"buffer":3}],69:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.raw_equipment_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Resources,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Resources
		$rootScope.featured_collection=Resources
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","type":"equipment"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
		 
		 	{ field: 'asset_no' ,name: "asset_no",resizable: true,width:"150"},	
			{ field: 'asset_type' ,name: "Type",resizable: true,width:"150"},	
			{ field: 'asset_name' ,name: "Device",resizable: true,width:"150"},			
			{ field: 'description' ,name: "description",resizable: true,width:"150"},	
			{ field: 'location' ,name: "location",resizable: true,width:"150"},
			
			{ field: 'model_no' ,name: "model_no",resizable: true,width:"150"},
			{ field: 'serial_no' ,name: "serial_no",resizable: true,width:"150"},
			{ field: 'label_location' ,name: "label_location",resizable: true,width:"150"},
			{ field: 'label_notes' ,name: "label_notes",resizable: true,width:"150"},

			{ field: 'comments' ,value: "comments",resizable: true,visible:false},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			
			
			
			
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/equipment/raw-equipment-controller.js","/../components/resource-bookings/equipment")
},{"b55mWE":4,"buffer":3}],70:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.record_rooms_controller =  function($scope, $http, $q,  
          Resources,data_table_reload,get_table_data
    ) {

//$scope.setDate = data_table_reload.setDate;
			$scope.extraQuery = { "museum_id":"#"}

    // function definition
	
	  $scope.Resources=Resources
	  
	  
	  
	  
	 
 $scope.onSubmit=function() {
		
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
		
		    var kpis = new Resources({
					name:visit_form.room_name.value,				  
					type: "room",	
					asset_no: guid(),
				//DEPARTMENTAL VARIABLES	
					//donation_box_amount: visit_form.donation_box_amount.value,
					//donation_box_no: visit_form.donation_box_no.value,
					//no_envelopes: visit_form.no_envelopes.value,
					
					date_logged:new Date(),	
					//date_value:visit_form.date_value.value,
					comments:visit_form.comments.value,			
					logger_user_name: $scope.user.username
            });
			
			var query = {'name':visit_form.room_name.value,'type':"room",'exact':false};
			
			Resources.query(query, function(visits) {
				  $scope.$emit('form_submit');
				console.log('Raw_visits',visits.length)
				$scope.results=visits
		
						save(kpis)
			
			})	
			
            
		
	

	

    }
		function save(kpis){

	kpis.$save(function(err, user) {
		
						if(err) console.log(err)
						 var  message = "data saved successfully";
							  message+= "\n ";
							  //message+= " "+ data + " added to " + museum;
							  alert(message);
							  get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)			
							$scope.message="data saved successfully";
			
							visit_form.room_name.value=""
							
							 
							 
						})
						

}
	
	$( document ).ready(function() {
     $scope.$emit('record_rooms_form');
	 $scope.savex=function(kpis) {
			save(kpis)
	 }
	
});
	

	
	}
 

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/rooms/form-controller.js","/../components/resource-bookings/rooms")
},{"b55mWE":4,"buffer":3}],71:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.raw_rooms_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Resources,data_table_reload,get_table_data,grid_ui_settings,make_a_pie,make_a_line_chart,monthly_data_table_columns,table_security
    ) {
		
		
		$scope.show_all_Button=true
		$scope.featured_collection=Resources
		$rootScope.featured_collection=Resources
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.extraQuery = { "museum_id":"#","type":"room"}
		
		var columnDefs= []
		

		$rootScope.canEdit_table=true
		 columnDefs.push(
			{ field: 'name' ,name: "Room",resizable: true,width:"150"},			
			
			{ field: 'comments' ,value: "comments",resizable: true,visible:true},
			{ field: 'logger_user_name' ,value: "Logged by",resizable: true,visible:false},
			{ field: 'date_logged', value: "Date logged" ,type: 'date', cellFilter: 'date:\'dd/MM/yy HH:mm\'',visible:false}
			)
			
			$scope.gridOptions = grid_ui_settings.monthly(   columnDefs,$scope);
			
			get_table_data.getData(moment(new Date()).subtract({'months':1})._d,$scope)
			
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/rooms/raw-rooms-controller.js","/../components/resource-bookings/rooms")
},{"b55mWE":4,"buffer":3}],72:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_resources_controller=     function($compile,  $scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello,timeline_bookings_functions, get_trello_board, date_calc, Todos, Timeline, Bookings,Team, kiosk_activity,timeline_functions_resources,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate,Raw_visits,timeline_visitor_figures_functions,timeline_install_functions, $timeout,timeline_exhibitions_functions
    ) {
		
		$scope.locked=[]
		$scope.locked.add_item = false
		$scope.locked['true']={status:" locked",value:false}
		$scope.locked['false']={status:" unlocked",value:true}
		$scope.average_install_length = 0
		$scope.password=false
		$scope.lockstatus=false
		$scope.average_derig_length = 0
		$rootScope.addednames=[]
		$rootScope.track_groups=[]
		$rootScope.added_track_groups=[]
		$rootScope.datePicker=[];
		$scope.isloggedin=false	
		$scope.isloggedin=false	
	    $scope.timeline_track = Timeline 
		$scope.haspermissions=false
		
		
		
	 $scope.init = function(timeline_mode)
	
  {
   console.log('timeline_mode',timeline_mode)
	 setTimeout(function() {
	 
				$scope.timeline_track = Bookings 
			
			
				  AuthService.isLoggedIn().then(function(user){
		
			
			$scope.user=user
			$scope.isloggedin=true			
			if(	user.data.group=="ADMIN"){$scope.haspermissions=true}
			if(	user.data.group=="COMMERCIAL"){$scope.haspermissions=true}
			if(	user.data.group=="DIGITAL"){$scope.haspermissions=true}
			main_function(timeline_mode)
			
	  })
	   
	  	setTimeout(function() {
		
			if($scope.isloggedin==false){
				main_function(timeline_mode)
			} 
		
        }, 1500);

  })
}

	  

main_function = function(timeline_mode){



	 timeline_track = Bookings 
			$scope.filter_pie=[]
			$scope.filter_pie.push({value:"2017 total_children",name:"No. children"})
			$scope.filter_pie.push({value:"2017 total_sessions",name:"No. sessions"})
			$scope.filter_pie.push({value:"2017 total_teachers",name:"No. teachers"})
			$scope.filter_pieSelected = $scope.filter_pie[0].name; 
			$scope.plot_graph =null;
			$rootScope.datePicker.date = {startDate:null, endDate: null};
			
			$scope.dateRangeOptions = {
				
				
					locale : {
						format : 'DD/MM/YYYY'
					},
					//TIMELINE EVENT HANDLERS					
					eventHandlers : {
						
										'apply.daterangepicker' : function() {  
										   date=$rootScope.datePicker.date
											days=timeline_functions_resources.days(moment(date.startDate),moment(date.endDate))
							colour="red"				
											
										 
										   	if(moment(date.startDate).isValid()){ //true
										
										var event_to_add=	{		  id :  $scope.selected_id,
																	  name :$scope.selected_item,
																	  showimage :"",
																	  image :"",
																	  className:colour||"",
																	  start_date :moment(date.startDate).format("MMM Do"),
																	  end_date : moment(date.endDate).format("MMM Do")|| "",
																	  notes  :$rootScope.selected_notes + "(" +days+" days)" ,
																	  days :days
															}
										
										
										html=timeline_functions_resources.event_html(event_to_add)
												
										var options={id:$scope.selected_timeline_id,className:colour||"",content:html,start:moment(date.startDate)._d,end:moment(date.endDate)._d,start_date:moment(date.startDate)._d,end_date:moment(date.endDate)._d}
												
										timeline_track.update({
												id: $scope.selected_id,				
												}, options);				
												console.log('updatedItem',options)
												timeline_functions_resources.updateItem(options)
												
								
									
										}}				
						}
        }

				$scope.$watch('selected_notes', function(selected_note) {
				
					timeline_functions_resources.event_edited($scope,selected_note)
				
				})
			
		
			
			$scope.$watch('selected_item', function(selected_item) {

			//if( !$scope.locked.add_item){	
			
			date=$rootScope.datePicker.date
			days=timeline_functions_resources.days(moment(date.startDate),moment(date.endDate))
			$scope.selected_start = moment(date.startDate ).format("MMM Do")
					$scope.selected_end = moment(date.endDate).format("MMM Do")
					
			if(moment(date.startDate).isValid()){ //true
											
			var event_to_add=	{
									id :  $scope.selected_id,
									name :$scope.selected_item,
									showimage :"",
									image :"",
									start_date :moment(date.startDate).format("MMM Do"),
									end_date : moment(date.endDate).format("MMM Do")|| "",
									notes  :$rootScope.selected_notes ,
									days :days
								}
			
					html=timeline_functions_resources.event_html(event_to_add)
					var options={id:$scope.selected_timeline_id,content:html,name:selected_item,start:moment(date.startDate)._d,end:moment(date.endDate)._d,}
					timeline_track.update({
					id: $scope.selected_id,				
					}, options);				
					
					timeline_functions_resources.updateItem(options)
			}
			
			//}
		//	else
			//{
			//	console.log('not logged in')
			//}
			
			})
	 
			$scope.$watch('stack', function(stack) {
		
		
					 if(typeof(stack)!="undefined"){
						 
						   options={stack:stack}
							timeline_functions_resources.updateOptions(options)
					  }
		  
		
		  
			})

		
		
			//END EVENT HANDLERS

		
			$scope.editing = [];
			$scope.timeline = Timeline.query();


			
			
			$scope.removeTimeline = function(id) {
				timeline_track .remove({
					id: id
				})
			}
	
		
				
				
		   timeline_track.query({}, function(team) {
				_.each(team, function(row,index) {
			
			 
			 var timeline = $scope.timeline[index];
			 if(timeline.group=="Bristol Archives"){
				 timeline_track .remove({
					id: timeline._id
				}, function() {
				   // $scope.timeline.splice(index, 1);
				});
				}
				
				})
			})
		
	
        $scope.save = function() {
		
            if (!$scope.newTimeline || $scope.newTimeline.length < 1) return;
            var timeline = new timeline_track({
                name: $scope.newTimeline,
                completed: false
            });

            timeline.$save(function() {
		
                $scope.timeline.push(timeline);
                $scope.newTimeline = ''; // clear textbox
            });
        }

        $scope.update = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.update({
                id: timeline._id
            }, timeline);
            $scope.editing[index] = false;
        }

        $scope.edit = function(index) {
            $scope.editing[index] = angular.copy($scope.timeline[index]);
        }

        $scope.cancel = function(index) {
            $scope.timeline[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        }

        $scope.remove = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.remove({
                id: timeline._id
            }, function() {
                $scope.timeline.splice(index, 1);
            });
        }

        $scope.datePicker = "";
        $scope.datePicker.date = {
            startDate: null,
            endDate: null
        };
        $scope.machine_types = [];
        $scope.type = "all";


		$scope.changedValue = function(place) {
        
		 $rootScope.filter_pieSelected=place
       
	   }

        $scope.machinesx = ["all"]
        $scope.filterCondition = {
            machine: 'neq'
        }
        $scope.$watch('type', function(type) {
            $scope.machinesx = ["all"]


        })

  

            // selected fruits
        $scope.machine_types_selection = [];



        $scope.categories = [];

        // selected fruits
        $scope.category_selection = [];



/*
        var _data = [];
        $scope.data = []
        $scope.day_data = []
        $scope.team = [];
        $scope.labels = $scope.team
        $scope.chart_title = "Machine activity"
*/

            var groups = new vis.DataSet();
            var dates = new vis.DataSet();
			var second_dates = new vis.DataSet();
            var all_groups = []
            var i = 0

      

			install_days_tally = 0
			install_instance_tally=0 
			derig_tally = 0
			derig_days_tally=0
			$scope.total_install_derig=install_days_tally+derig_days_tally
			$scope.average_install_length=Math.round(install_days_tally/install_instance_tally)
			$scope.average_derig_length=Math.round(derig_days_tally/derig_tally)
			
			var container = document.getElementById('example-timeline');
            timeline = new vis.Timeline(container);
			 $rootScope.timeline=	timeline
			
			date={content:"STARTER"  ,
					group:"STARTER",
					group_id:"STARTER",
					id:"STARTER",
					name:"STARTER"  ,
					event_type:"STARTER",
					track:"STARTER",
					order: "STARTER",
					subgroup: "STARTER",
					start:new Date(),
					end:new Date(),
					//className 	:	"orange"
					}
	
			//VIS ERRORS IF INITIALISED WITH AN EMPTY START DATE
			timeline_functions_resources.setup( $scope.timeline_track ,$rootScope.groups, new vis.DataSet(date))
			
			
			
			$scope.add_exhibitions= function(){						
					timeline_functions_resources.populate_timeline_track_method_b($rootScope,timeline_exhibitions_functions,timeline_track)
			}
			
			$scope.add_installs_derigs= function(){				
					timeline_functions_resources.populate_timeline_track($rootScope,Timeline,timeline_install_functions,timeline_track)	
			}
			
			$scope.team_leave= function(){
					timeline_functions_resources.populate_timeline_track_method_b($rootScope,timeline_leave_functions,timeline_track)				
			}
			
			$scope.visitor_figures= function(){							
					timeline_functions_resources.populate_timeline_track($rootScope,Raw_visits,timeline_visitor_figures_functions,timeline_track)
			}
			
			
			$scope.Resources= function(){							
					timeline_functions_resources.populate_timeline_track($rootScope,Bookings,timeline_bookings_functions,timeline_track)
			}
			
			
			$scope.shopify= function(){	

					$rootScope.timeline_mode=timeline_mode			
					timeline_functions_resources.populate_timeline_track($rootScope,Shopify_aggregate,timeline_shopify_functions,timeline_track)
			}
				
			$scope.loans= function(){							
					timeline_functions_resources.populate_timeline_track_method_b($rootScope,timeline_loans_functions,timeline_track)
			}
			
			$scope.learning_bookings= function(){							
					timeline_functions_resources.populate_timeline_track_method_b($rootScope,timeline_learning_functions,timeline_track)
			}
			
			
			$scope.timeline_googlesheets_functions= function(data_settings){
			
					var groups =$rootScope.groups
					$rootScope.timeline.setGroups(groups);
					timeline_googlesheets_functions.get_events(data_settings)
				  		  
			}
			
			
			//$scope.shopify() //NB for some reason need this to appear for unlogged in users otherwise text wont load in directives

			
					timeline_track = Bookings
					$scope.Resources()

	
	var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')

	   Timeline_data.query({}, function(data) {
				
				_.each(data, function(data_settings) {
					console.log('data_settings',data_settings)
					$scope.timeline_googlesheets_functions(data_settings)
				})
		
		timeline_functions_resources.update_andCompile()	
		
		})

	

		

    // check if there is query in url
    // and fire search in case its value is not empty

	$scope.$watch('track_groups|filter:{selected:true}', function (nv) {
		
					var selection = nv.map(function (track_groups) {
					
					  return track_groups.track;
					});
					$scope.selected_tracks=selection
					timeline_functions_resources.changeTracks(selection)
					//$( ".draggable,.iconbar" ).css({ 'top':'0px' });
  }, true);
  
	
$scope.$watch('groups|filter:{selected:true}', function (nv) {
	
					var selection = nv.map(function (group) {
					  return group.content;
					});
					timeline_functions_resources.changeGroups(selection)
					$( ".draggable,.iconbar" ).css({ 'top':'0px' });
	
  }, true);

	
	

			
	
      
			
		$scope.exportCSV= function(){
			
				data_to_export=$rootScope.timeline.itemsData.getDataSet()
				
				visibles=$rootScope.timeline.getVisibleItems()
				events=[]
				
				  _.each(data_to_export._data, function(event,index) {
				
				  if(visibles.indexOf(event.id)!=-1){
				  console.log("in")
				  var _event ={  
								 id			:event.id,
								 name		:event.name,
								 start_date	:moment(event.start).format("DD/MM/YYYY"),
								 end_date	:moment(event.end).format("DD/MM/YYYY"),
								 event_type	:event.track
							   
								}
					 events.push(_event)
						}
				  
				   
				  
				  })
						
				timeline_functions_resources.export_JSON_to_CSV(events, "Timeline dates", true)
	}
	

				
			
			
			
		
		
			
		

		       
            $scope.list1 = {
                title: 'PROVISIONAL DATE'
            };
            $scope.list2 = {
                title: 'Meeting'
            };
            $scope.list3 = {
                title: 'Event'
            };

            $scope.onDropComplete = function(data, evt) {
                // console.log("drop success, data:", data);
            }
			
		


       // })

    };
	
	
	} 
 
exports.BasicDemoCtrl=   function ($mdDialog,$scope, $http, $q, $routeParams, $location

    ) {
	


 var originatorEv;

    this.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

    this.notificationsEnabled = false;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };

    this.redial = function() {
    };

    this.checkVoicemail = function() {
      // This never happens.
    };
  }
  
  

exports.add_timeline_items_controller=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions_resources,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
	
	$scope.unlocked=false
	$scope.$watch('locked', function (locked) {
		
		$scope.locked=locked
  })
  }
  
  exports.add_timeline_info_box=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions_resources,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
		


  }
  

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/timeline-resources-controller.js","/../components/resource-bookings")
},{"b55mWE":4,"buffer":3}],73:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.timeline_functions_resources = function ( $templateCache,$compile,$http,Bookings,$rootScope,$timeout) {
	

  
  return {
  
  timeline_track: Bookings,
  
		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
	
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:    value.track,
										order		    :    value.order,										
										event_type		:	 value.event_type,
										content			:    value.group_name,
										event_typeSORT	:    content,
										
										selected         : value.select_group 
									})
					console.log(_groups)
				}
				}
			})

		
			return _groups		

		},
	
		update_andCompile: function(item) {
			
			var self = this
			
				setTimeout(function() {
			 	$compile($("timeline-databar"))($rootScope);
			 }, 1700);
			setTimeout(function() {
			
				
		
						unique_groups=[]
						added_ids=[]
						_.each($rootScope.groups, function(group){
							if(added_ids.indexOf(group.id)==-1){
							added_ids.push(group.id)
							unique_groups.push(group)
							}
						})
						
						var groups = new vis.DataSet(unique_groups);
	
						var list = groups.get({
								filter: function(item) {								
									return (item.selected == true);
								}
						})	
						
						self.enable_event_drop(timeline_track,timeline_track)
						$rootScope.timeline.redraw()
			
            }, 2000);
			 
			
		},	
		
		populate_timeline_track: function(rootScope,dataset,dataset_functions,timeline_track) {
			 
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
				  
					dataset.query({}, function(datax) {
						self.add_events_loop(rootScope,datax,dataset_functions,timeline_track)
						self.update_andCompile()
					})
					
		},
		
	


		populate_timeline_track_method_b: function(rootScope,data_functions,timeline_track) {
			
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
			  
				  data_functions.get_events().then(function(datax) {					  
					self.add_events_loop(rootScope,datax,data_functions,timeline_track)
					})
		
		},
		 
		add_events_loop: function(rootScope,datax,dataset_functions,timeline_track) {
	
				var self = this
				dataset_functions.add_events(datax, function(public_dates){
							 rootScope.leave_groups = self.loadgroups(public_dates)
							_.each(rootScope.leave_groups, function(_group) {
								rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								if($rootScope.timeline.itemsData){
								rootScope.timeline.itemsData.getDataSet().add(date)
								}
							})
							//rootScope.timeline.itemsData.on("update", function(){self.update_andCompile()})
							rootScope.timeline.fit({},function(){
										self.update_andCompile()
							})//needed due to angular wierdness with directives
				})
	
	
		},
		 
		 
		
			
		export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
					  
						//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
						var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
						//console.log('arrData',arrData)
						var CSV = '';    
						//Set Report title in first row or line
						
						CSV += ReportTitle + '\r\n\n';

						//This condition will generate the Label/Header
						if (ShowLabel) {
							var row = "";
							
							//This loop will extract the label from 1st index of on array
							for (var index in arrData[0]) {
								// console.log('row += index',row += index)
								//Now convert each value to string and comma-seprated
								row += index + ',';
							}

							row = row.slice(0, -1);
							
							//append Label row with line break
							CSV += row + '\r\n';
						}
						
						//1st loop is to extract each row
						for (var i = 0; i < arrData.length; i++) {
							var row = "";
							
							//2nd loop will extract each column and convert it in string comma-seprated
							for (var index in arrData[i]) {
								row += '"' + arrData[i][index] + '",';
							}

							row.slice(0, row.length - 1);
							
							//add a line break after each row
							CSV += row + '\r\n';
						}

						if (CSV == '') {        
							alert("Invalid data");
							return;
						}   
						
						//Generate a file name
						var fileName = "MyReport_";
						//this will remove the blank-spaces from the title and replace it with an underscore
						fileName += ReportTitle.replace(/ /g,"_");   
						
						//Initialize file format you want csv or xls
						var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
						
						// Now the little tricky part.
						// you can use either>> window.open(uri);
						// but this will not work in some browsers
						// or you will not get the correct file extension    
						
						//this trick will generate a temp <a /> tag
						var link = document.createElement("a");    
						link.href = uri;
						
						//set the visibility hidden so it will not effect on your web-layout
						link.style = "visibility:hidden";
						link.download = fileName + ".csv";
						
						//this part will append the anchor tag and remove it after automatic click
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);


},
  
  
     prettyConfirm: function (title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            },

           prettyPrompt: function (title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            },
			
			
	

            logEvent:function(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            },
  
  enable_event_drop:function(event){
		var self = this
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {
					
							event.preventDefault()

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                          
                            time=(timeline.getEventProperties(event).time)
							group=(timeline.getEventProperties(event).group)
							track=(timeline.getEventProperties(event).track)
							
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add a provisional date', 'Name:',"", function(value) {
                            if (value) {
                               	add_item(group,group,time,value,"blue",30,ui.draggable[0].innerHTML,track)
							}
							})
							}
							else if(ui.draggable[0].innerHTML=="INSTALL" ||ui.draggable[0].innerHTML=="DERIG" )
							{
								add_item(group,group,time,ui.draggable[0].innerHTML,"red",7,ui.draggable[0].innerHTML,track)
							}
							else
							{
								add_item(group,$rootScope.filter_pieSelected,time,ui.draggable[0].innerHTML,"orange",1,"PROVISIONAL DATE",track)
							}
							
							function add_item(dropped_group,group,time,value,colour,days,type,track)
							{
									
									
									 console.log('add_item')
									 date_dropped=(moment(time).startOf('day')._d)
									
									 
									
									var id = ui.draggable[0].id
									var dateDroppedOn =time
									target_date = time
									_days=self.days(moment(time).startOf('day')._d,moment(time).add(days, 'days')._d)
									
									var event_to_add=	
									{
															id : id,
															name : value,
															showimage :"",
															image :"",
															start_date :moment(time).startOf('day').format("MMM Do"),
															end_date :moment(time).add(days, 'days').format("MMM Do"),
															notes  :"",
															days :_days
									}
									
									
									var new_date = 
									{
									
															content: self.event_html(event_to_add),
															name:value,
															group: dropped_group,
															dropped_group:dropped_group,
															date_logged: new Date(),	
															className:colour||"",
															_type:track,
															start_date: new Date(moment(date_dropped).startOf('day')._d),
															end_date: new Date (moment(date_dropped).add(days, 'days')._d),
															days:_days

									}
									
									console.log('save')
									
								
									
									var _timeline = new Bookings(new_date)
										.$save(function(_item) 
										{
										

											new_date.start =_item.start_date
											new_date.end = _item.end_date
											new_date._id = _item._id
											new_date._type=_item._type,
											timeline.itemsData.getDataSet().add(new_date)
											
											setTimeout(function() {
											
													$(ui.draggable[0]).show()
													self.add_group_to_timeline(new_date)
											
											}, 1 * 1000);

											
										});
							
							
							}
                        }



                    }
                })
				},
	  
	  unlock: function(unlock){
		
                        
								timeline.setOptions({'editable':unlock,'selectable': unlock });
								timeline.options.editable=true
			
							
		  	
	  
	  },
	
	   



   add_group_to_timeline: function(new_group){
//TO DO
console.log('add_group_to_timeline')
				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get()
				
				_.some(list, function(lookup_group){
			
					if(new_group.dropped_group==lookup_group.id){
						console.log('copy this ',lookup_group)
						var _new_group=lookup_group
						_new_group.track=new_group.track
						//_new_group.id=new_group.group
						_new_group.content=new_group.content
						//list=list.concat(_new_group)
				
									
						return true;
					}
				})
			//timeline.setGroups(list);
			//this.enable_event_drop()	
			
				this.update_andCompile()
			
		
				},  
				
			   changeTracks: function(selection)
			   {
console.log('changeTracks selection',selection)
						var groups = new vis.DataSet($rootScope.groups);
						var group = new vis.DataSet( $rootScope.leave_groups);
						var list =groups.get({
								filter: function(item) {
									
									return (  selection.indexOf(item.track)!=-1);
								}
							})
							
						timeline.setGroups(list);
						this.update_andCompile()					
						this.enable_event_drop()
				
				},  
				
				changeGroups: function(selection)
				{

					var groups = new vis.DataSet($rootScope.groups);
					//var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.content)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},
  
  
  days: function (start,end){
  
				var a = moment(start);
				var b = moment(end);
				return b.diff(a,'days');
  
  },
  
  	
  
   		 event_html: function(event_to_add){
		 
		 
			var  id = event_to_add.id
		 	var  name = event_to_add.name
			var  className = event_to_add.className
		 	var  showimage = event_to_add.showimage
		 	var  image = event_to_add.image
		 	var  start_date = event_to_add.start_date
		 	var  end_date = event_to_add.end_date
		 	var  notes  = event_to_add.notes ||""
		 	var  days = event_to_add.days
			var  description =event_to_add.description ||""
		 
			var notes=notes ||""
			var image=image ||""
	
			var showimage=showimage ||""
			
			var htmlContent= "<timeline-databar     className='" + className + "' description='" + description + "' description='" + description + "' id='" + id + "' name='" + name + "' image='" + image + "' showimage='" + showimage + "' startdate='" + start_date + "' enddate='" + end_date + "' notes='" + notes + "' days='" + days + "'></timeline-databar>"; //'<timeline-databar></timeline-databar>'
		
			return htmlContent

			},
			
		selected_data:	 function (event) {
				
							var self=this
							selected_timeline_id=event.items[0]
							 if(selected_timeline_id)
							 {
							 
										selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
										$rootScope.selected_timeline_id=selected_timeline_id
										$rootScope.selected_item=selected_item.name
										$rootScope.selected_type=selected_item._type
										if(selected_item.days>0)
										{
												$rootScope.selected_days=" - " +selected_item.days + " days"
										}
										$rootScope.selected_id=selected_item._id
										$rootScope.selected_notes=selected_item.notes
										$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
							
							
							}
					

           },
		   
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	
	event_edited: function(scope,selected_note){

	console.log('event_edited')
	
	//latest attempt to fix mem leak 
	//mooved from controller
	
	
			var self = this
	
			if( scope.locked.add_item){	
					date=$rootScope.datePicker.date
					days=self.days(moment(date.startDate),moment(date.endDate))
					scope.selected_start = moment(date.startDate ).format("MMM Do")
					scope.selected_end = moment(date.endDate).format("MMM Do")
					if(moment(date.startDate).isValid()){ //true
								
									var event_to_add=	{
														  id :  scope.selected_id,
														  name :scope.selected_item,
														  showimage :"",
														  image :"",
														  start_date :moment(date.startDate).format("MMM Do"),
														  end_date : moment(date.endDate).format("MMM Do")|| "",
														  notes  :$rootScope.selected_notes ,
														  days :days
														}
				
					
					//THIS CAUSES A REFRESH OF THE TIMELINE DIRECTIVE (GOOD)
					html=self.event_html(event_to_add)
					var options={id:scope.selected_timeline_id,content:html,notes:selected_note,start:moment(date.startDate)._d,end:moment(date.endDate)._d}
					self.timeline_track.update({
								id: scope.selected_id			
								}, options, function(){self.updateItem(options) });
				
				}
				}
				else
				{
				console.log('timeline locked')
				}
	
	
	
	
	},
	
	
	
	
	
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
			if(timeline.itemsData){
				timeline.itemsData.getDataSet().update(options)
				
				this.update_andCompile()
				
			}
		
		}
	
			
	},
	
    setup: function( Timeline,groups,dates,isloggedin) {
		
		var self=this
		

         var options = {
					min: new Date(2014, 0, 1),                // lower limit of visible range
					max: new Date(2022, 0, 1),                // upper limit of visible range
					zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
					zoomMax: 1000 * 60 * 60 * 24 * 31 * 500 ,    // about six months in milliseconds
                    width: '100%',
					maxHeight:"900px",
					moveable:true,
					itemsAlwaysDraggable:true,
					snap: function (date, scale, step) {
						return date;
							},
					stack:false,
					orientation:{"axis":"top"},
					selectable: true,  
                    editable: false,  
					groupOrder:'order',					
                    onMove: function(item, callback) {
					
							$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}

							days=self.days(moment(item.start),moment(item.end))
							$rootScope.selected_days = days
							if(moment(item.start).isValid()){ //true
							
									
									var event_to_add=	{
									
															  id : item._id,
															  name : item.name,
															  showimage :"",
															  image :"",
															  className		:	item.className,
															  group: item.group,
															  start_date : moment(item.start).startOf('day').format("MMM Do"),
															  end_date : moment(item.end).startOf('day').format("MMM Do"),
															  notes  :item.notes ,
															  days :days
															
														}
									

								//NB DIFFERENT IDS FOR Timeline and Timeline vis vs mongo
								html=self.event_html(event_to_add)
								var options={ id:item.id,
												group: item.group,
												content:html,
												notes:event_to_add.notes,
												start:moment(item.start)._d,
												// className		:	 item.approved == false ? "red" : "blue",
												end:moment(item.end)._d,
												start_date:moment(item.start)._d,
												end_date:moment(item.end)._d
												}
								self.timeline_track.update({
								id:  item._id				
								}, options, function(){self.updateItem(options) });
								
								
								
								
								
								
								
									
								callback(item);
								
							}
							else
							{
							console.log('invalid date')
									callback(item);
								
							}
									
								

                    },
                    onUpdate: function(item, callback) {

                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                //callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
									if(moment(item.start).isValid()){ //true
										
								var event_to_add=	{
								
													  id : item.id,
													  name :value,
													  showimage :"",
													  image :"",
													  start_date :item.start,
													  end_date : item.end,
													  notes  :item.notes ,
													  days :days
													  
													}
									
									
                                var _timeline = new self.timeline_track({
                                    content:  self.event_html(event_to_add),
									name: item.name,
                                    group: item.group,
                                    start_date: item.start,
                                    end_date: item.end,
									days:self.days(item.start,item.end)

                                })
                               
                               self.timeline_track.update({
                                    id: item._id
                                }, _timeline);
                               
				
									var _options={id:item._id,content:self.event_html(event_to_add),start:moment(event_to_add.startDate)._d,end:moment(event_to_add.endDate)._d,start_date:moment(event_to_add.startDate)._d,end_date:moment(event_to_add.endDate)._d}
						
									self.updateItem(_options, function(){
										self.update_andCompile()
									})									

								 callback(item);
							}
										else
										{
										console.log('invalid date')
										}							
                            } else {
                                callback(null); // cancel updating the item
                            }
                        });

                    },
                    onAdd: function(item, callback) {


                        self.prettyPrompt('Add note', 'Add some notes to this date:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted new item
								
								days=self.days(item.start, moment(item.start).add(5, 'days'))
							


								
								var event_to_add=	{id : item.id,
													  name :value,
													  showimage :"",
													  image :"",
													  start_date :item.start,
													  end_date :  moment(item.start).add(5, 'days'),
													  notes  :"" ,
													 days :days}
													
                                var _timeline = new self.timeline_track({
                                        content: self.event_html(event_to_add),
										name:value,
										date_logged: new Date(),	
                                        group: item.group,
										_type:"note",
                                        start_date: item.start,
										 end_date:   moment(item.start).add(1, 'days'),
										className:"green"
                                       // end_date: moment(item.start).add(5, 'days'),
										//days:self.days(item.start, moment(item.start).add(5, 'days'))

                                    })
									    .$save(function(_item) {
                                    new_date.start =_item.start_date
                                    new_date.end = _item.end_date
                                    new_date._id = _item._id
									new_date._type=ui.draggable[0].innerHTML,
                                    timeline.itemsData.getDataSet().add(new_date)
									
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
										console.log('bread')
										
                                    }, 1 * 1000);

                                });
					
                            } else {
                                callback(null); // cancel item creation
                            }
                        })


                    },
                    onRemove: function(item, callback) {

                        if (item._id) {
                            self.timeline_track.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };


  
  
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				

				 $rootScope.timeline.setOptions(options);
				 
				 $rootScope.timeline.on('select', function (properties) {
						console.log('timeline selected')
						self.selected_data( properties)

				});
				
			   $rootScope.timeline.setItems(dates);
				$rootScope.timeline.fit()
				
				
				
							
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
				//event.preventDefault()
                   // self.logEvent(event, properties);
                });

			
			self.enable_event_drop()
			$compile($("timeline-databar"))($rootScope);

			
              
    }
	 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/resource-bookings/timeline-resources-services.js","/../components/resource-bookings")
},{"b55mWE":4,"buffer":3}],74:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.shopify_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
	
		  AuthService.isLoggedIn().then(function(user){
			$scope.isloggedin=true	
			//$scope.lockstatus=true
			//$scope.unlock=true
			//timeline_functions.unlock(true)
			$scope.report_running=true
	  })
	console.log('controller go')
	  $scope.logging=true
	$scope.data_number=7
	
	$scope.generate_order_forms=false
	$scope.update_product_types=true
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.gridOptions.columnDefs = [   ]
		$scope.gridOptions = {
			columnDefs: [
			{ field: 'product_type' ,resizable: true},
			{ field: 'price' ,resizable: true},
			{ field: 'sales_value' ,resizable: true},
			{ field: 'name' ,resizable: true},
			{ field: 'count' ,resizable: true},
			{ field: 'inventory_quantity' ,resizable: true},
			{ field: 'order_status' ,resizable: true},
			{ field: 'sku' ,resizable: true},
			{ field: 'barcode' ,resizable: true},
			{ field: 'vendor' ,resizable: true},
			{ field: 'date_report_run' ,resizable: true}
			],
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: true,
			enableCellEditOnFocus: true,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

			});
			}
		};
	
var options = []
$scope.optionset = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-$scope.data_number, 'days').format()
	options.title = "last_"+$scope.data_number+"_days"
$scope.optionset.push(options)	

	
$scope.save_to_sheets=false

$scope.$watch('data_number', function(data_number) {
	
$scope.optionset = []
	var options = []
	options.google_sheet_id='1UlDQNS6dTvQWlQs090HRrSoR49k0Th-ElxCaxTMleA0'
	options.created_at_min =  moment(new Date()).add(-data_number, 'days').format()
	options.title = "last_"+data_number+"_days"
	console.log('options.created_at_min',options.created_at_min)
$scope.optionset.push(options)

})
$scope.runShopify = function(selected_set,shop){

$scope._rows=[]
$scope.report_running=false
$scope.selected_set=selected_set
$scope.optionset[selected_set].save_to_sheets=$scope.save_to_sheets
$scope.optionset[selected_set].update_product_types=$scope.update_product_types
$scope.optionset[selected_set].generate_order_forms=$scope.generate_order_forms


$scope.optionset[selected_set].shop=shop
console.log($scope.optionset[selected_set])


		
		 shopify_app.getData($scope.optionset[selected_set],function(team){
				
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
	
					
							
				})
				$scope.logging=false
			$scope.rows=$scope._rows
			$scope.gridOptions.data=$scope.rows;
			$(window).resize()
			$scope.report_running=true
		})	
}
}				



exports.shopify_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]
  
  

/*
	log_messages.query({}, function(messages) {
	
			log_messages.query({}, function(team) {
				_.each(team, function(row,index) {
						$scope.messages[0]=	row.username+" "+row.date+" "+row.message
		
				})
			})	
			
	})
	*/

}


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/



}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/shopify/shopify-controller.js","/../components/shopify")
},{"b55mWE":4,"buffer":3}],75:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.shopifyStatus = function() {
  return {
   controller: 'shopify_controller',
    templateUrl: './components/shopify/shopify-page.html'
  }
	}
	
	
		exports.shopifyButtons = function() {
  return {
   controller: 'shopify_buttons',
    templateUrl: './components/shopify/shopify-buttons.html'
  }
	}
	
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/shopify/shopify-directive.js","/../components/shopify")
},{"b55mWE":4,"buffer":3}],76:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.TallyController =  function($scope, Tallys) {


    $scope.editing = [];
    $scope.tallys = Tallys.query();

	
	
	
	
    $scope.save = function() {
        if (!$scope.newTally || $scope.newTally.length < 1) return;
        var tally = new Tallys({
            name: $scope.newTally,
            completed: false
        });

        tally.$save(function() {
            $scope.tallys.push(tally);
            $scope.newTally = ''; // clear textbox
        });
    }

    $scope.update = function(index) {
        var tally = $scope.todos[index];
        Tallys.update({
            id: tally._id
        }, tally);
        $scope.editing[index] = false;
    }

    $scope.edit = function(index) {
        $scope.editing[index] = angular.copy($scope.tallys[index]);
    }

    $scope.cancel = function(index) {
        $scope.tallys[index] = angular.copy($scope.editing[index]);
        $scope.editing[index] = false;
    }

    $scope.remove = function(index) {
        var tally = $scope.tallys[index];
        Tallys.remove({
            id: tally._id
        }, function() {
            $scope.tallys.splice(index, 1);
        });
    }
}
exports.TodoDetailCtrl =   function($scope, $routeParams, Todos, $location) {

    $scope.todo = Todos.get({
        id: $routeParams.id
    });

    $scope.remove = function() {
        Todos.remove({
            id: $scope.todo._id
        }, function() {
            $location.url('/');
        });
    }
}
exports.trello =   function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {


        trello.auth()
		
		$scope.removeTeam = function(id) {
			Team.remove({id:id})
		}
		  Team.query({}, function(team) {
			_.each(team, function(row) {
				$scope.removeTeam(row._id)
				})	
			})	

	
	
		
				
        
        kiosk_path = $routeParams.kiosk
            //  screensaver = app_settings.screensaver //services
        screensaver = ""
        $scope.start_screen_saver = function() {
            screen_saver_loop.start_screen_saver()

        };
        $scope.functionThatReturnsStyle = function() {
            // return app_functons.functionThatReturnsStyle($routeParams.kiosk)

        };
        $scope.changeheadingcolor = function() {
            // return app_functons.changeheadingcolor($routeParams.kiosk)

        };
        if ($rootScope.screensaver_on != true) {
            console.log('start screensaver')
            screen_saver_loop.start_screen_saver();
        }

        console.log($routeParams.view)

        var display_data = $rootScope[$routeParams.view]




        $scope.lists = []
        loadMoreShots = function(display_data) {

            angular.forEach(display_data, function(list, index) {


                var promise = get_trello_board.get_data(list)
				
				.then(function(response) {
					cards=response.response
					console.log('cards',cards)
                    list._cards = []
                    tally = 0
                    card_count = 0

                    angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points = (card_count / (list.average/1 + 1)).toFixed(2)
					console.log('card_count',card_count)
					console.log('list.average ',list.average )
					console.log('list.average ',(list.average + 1))
					console.log('list.points ',list.points)	
						
								 // (card_count / (list.average + 1)).toFixed(1)	
					
					var team = new Team({
					  name: list.title,
					  score:list.points,
					   card_count:card_count,
					  bonus:"",
					  penalty:list.average 
					});
					 team.$save(function() {                       
                        $scope.team.push(team);
                    });
					
                    var tally = new Tallys({
                        name: list.title,
                        date: new Date(),
                        points: list.points
                    });
                    $scope.tallys = Tallys.query();


                    tally.$save(function() {
                        console.log(tally)
                        $scope.tallys.push(tally);
                        $scope.newTodo = ''; // clear textbox
                    });


                    $scope.lists.push(list)
                })

            })
        }

        loadMoreShots(display_data)


        detect_dragging.drag_handler()
        $scope.go = function(path) {

            if ($rootScope.isDragging == false) {
                if (path > 0) {
                    $location.path("id/" + path + "/" + $routeParams.kiosk);
                    detect_dragging.drag_handler()
                } else {
                    //$location.path(path + "/" + $routeParams.kiosk);
                }
            }
        };


        $scope.pageClass = 'page-contact';

        $scope.save = function() {
            if (!$scope.newTally || $scope.newTally.length < 1) return;
            var tally = new Tallys({
                name: $scope.newTally,
                date: new Date()
            });

            tally.$save(function() {
               
                $scope.todos.push(tally);
                $scope.newTodo = ''; // clear textbox
            });
        }
    }
	
	
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/app-controllers.js","/../components/team")
},{"b55mWE":4,"buffer":3}],77:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.form_to_trellox =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team
    ) {



        trello.auth()
		
		console.log($rootScope.team)
		
		boards=[]
		
		 angular.forEach($rootScope.team, function(team,i) {
				 board={
				  "name": team.title,
				  "value": team.id
				  }
				 boards.push(board)
		 })
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  name: "",
	  file:"",
	  list_id:"",
	  description:""
    };
    vm.options = {
      formState: {
        awesomeIsForced: false
      }
    };
    
    vm.fields = [
     /*
	  {

                            type: 'radio',
                            key: 'satisfaction',							
                            templateOptions: {
                              label: "Explain the problem",  
                                
                                options: [
									 {
										"name": "very satisfied",
										"value": "very satisfied"
									  },
									  {
										"name": "satisfied",
										"value": "satisfied"
									  },
									  {
										"name": "neither satisfied nor disatisfied",
										"value": "neither satisfied nor disatisfied"
									  },
									  {
										"name": "disatisfied",
										"value": "disatisfied"
									  },
									  {
									  
										"name": "very disatisfied",
										"value": "very disatisfied"
									  }
                                ]
							}
	  },
	  */
	  {
        key: 'list_id',
        type: 'select',
        templateOptions:{
            label: 'Post to board',
            options: boards,
             }
		
		},
	  {
        key: 'name',
        type: 'textarea',
        templateOptions: {
          label: 'Task',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	  {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          label: 'Description',
          placeholder: 'This will be the card description',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
	    {
        key: 'file',
        type: 'file',
        templateOptions: {
          label: 'File',
          placeholder: 'This will be the card name',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
/*
      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
		
      },
	  
      {
        key: 'whyNot',
        type: 'textarea',
        expressionProperties: {
          'templateOptions.placeholder': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad... It really is awesome! Wasn\'t that cool?';
            } else {
              return 'Type in here... I dare you';
            }
          },
          'templateOptions.disabled': 'formState.awesomeIsForced'
        },
        hideExpression: 'model.awesome',
        templateOptions: {
          label: 'Why Not?',
          placeholder: 'Type in here... I dare you'
        },
        watcher: {
          listener: function(field, newValue, oldValue, formScope, stopWatching) {
            if (newValue) {
              stopWatching();
              formScope.model.awesome = true;
			  formScope.model.satisfaction = undefined;
			  formScope.model.kiosk=app_settings.kiosk;
              formScope.model.whyNot = undefined;
              field.hideExpression = null;
              formScope.options.formState.awesomeIsForced = true;
            }
          }
        }
      },
	  */
     
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
    ];
// Setup
var TOKEN = "";
var KEY = "";
var CARD = "";
var FILE = "";
    // function definition
    function onSubmit() {
	
		formData=(vm.model);
		var myList = formData.list_id;
		var creationSuccess = function(data) {
		  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
		
		if( exampleInputFile.files[0]){
				var formData = new FormData();

				  formData.append("token", Trello.token());
				  formData.append("key", Trello.key());

				formData.append("file", exampleInputFile.files[0]);
				console.log(formData)
				var request = new XMLHttpRequest();
				 request.open("POST", "https://api.trello.com/1/cards/" + data.id + "/attachments");
				  request.send(formData);
		
		vm.options.resetModel()		
		};
		}
			var error = function(err) {
		console.log(err.responseText)
		};
		
		var newCard = {
		  name: formData.name, 
		  file: formData.file, 
		  desc: formData.description,
		  // Place this card at the top of our list 
		  idList: myList,
		  pos: 'top'
		};
		console.log('Trello',Trello)
		Trello.post('/cards/', newCard, creationSuccess,error);  
		var trellokey=formData.key
var trelloroken=formData.token
	


    }  
 }
 
 

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/form-controller.js","/../components/team")
},{"b55mWE":4,"buffer":3}],78:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.leave_controller =  function($scope, $http, $q, $routeParams, $location,
          $rootScope, date_calc, Tallys,Team,Timeline
		,Leave
    ) {



  $scope.override=true
  $scope.ids_to_delete=[]
		
	function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
    if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
    if (a_start <= b_end   && b_end   <= a_end) return true; // b ends in a
    if (b_start <  a_start && a_end   <  b_end) return true; // a in b
    return false;
}
		
		$scope.datePicker=[];
		$scope.datePicker.date = {startDate: "", endDate: ""};
		$scope.dateRange = {
            startDate: null,
            endDate: null
        };
		check_dates=function(viewValue){
		 
		 var overlap = []
						if(viewValue!=""){
							Team.query({}, function(team) {
						_.each(team, function(_team,i) {
						
						_.each(_team.leave_taken, function(leave,i) {
							
							 
								
							
							StartDate1=		new Date(leave.start_date)
							EndDate1=		new Date(leave.end_date)
							StartDate2=		new Date($scope.datePicker.date.startDate._d)
							EndDate2=		new Date($scope.datePicker.date.endDate._d)
						
							
							if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
										
										
											overlap.type = leave._type
											overlap.name = leave.name
											overlap.id = leave._id
											overlap.group = moment(StartDate1).format("MMM Do YYYY")  +"-"+moment(EndDate1).format("MMM Do YYYY") 
											$scope.overlapalert.push(overlap)
										
							if(viewValue==_team._id){
							console.log('will be overwritten'+leave._id)
								$scope.ids_to_delete.push(overlap.id)
							 }
							
									
							 }
							 
							  })
							 
						   })
						   })
						   }
    }
		$scope.overlapalert=[]

		$scope.dateRangeOptions = {
        locale : {
            format : 'DD/MM/YYYY'
        },
        eventHandlers : {
            'apply.daterangepicker' : function() {  
      
				console.log("checking Dates"); 
$scope.overlapalert=[]
        Timeline.query({}, function(team) {
		
		
            _.each(team, function(row,index) {

		var timeline=(row);
		if(!row.end_date){row.end_date=row.start_date}
		
		StartDate1=		new Date(timeline.start_date)
		EndDate1=		new Date(timeline.end_date)
		
		StartDate2=		new Date($scope.datePicker.date.startDate._d)
		EndDate2=		new Date($scope.datePicker.date.endDate._d)
	
		
		
		if(dateRangeOverlaps(StartDate1, EndDate1, StartDate2, EndDate2)==true){
					console.log(row)
					var overlap = []
						overlap.type = row._type
						overlap.name = row.name
						overlap.group = row.group
						
						$scope.overlapalert.push(overlap)
		}
		

	
			
            })
        })				
				
            }
        }
    };
	
	
		
		boards=[]
		leave_type=[]
		leave_type.push({"name": "Full Day","value": "Full Day"})
		leave_type.push({"name": "Half Day","value":"Half Day"})
		leave_type.push({"name": "Flexi PM","value":"Flexi PM"})
		leave_type.push({"name": "Flexi AM","value":"Flexi AM"})
		leave_type.push({"name": "Flexi Day","value":"Flexi Day"})
		
		
		 Team.query({}, function(team) {
            _.each(team, function(team,i) {
		
				 board={
				  "name": team.username,
				  "value": team._id
				  }
				 boards.push(board)
		 })
		  })
		
		  check_names = function () {
				console.log('check names')
			
 
			}
		   $scope.override_button = function () {
				console.log('override')
				$scope.override=false
 
			}
		
 $scope.form_to_trello = function (  ) {
 
    var vm = this;
    // funcation assignment
    vm.onSubmit = onSubmit;

    // variable assignment
    vm.author = { // optionally fill in your info below :-)
      name: '#',
      url: '#' // a link to your twitter/github/blog/whatever
    };
    vm.exampleTitle = 'Introduction';
    vm.env = {
      angularVersion: angular.version.full
    };

    vm.model = {
	  username: "",
	  notes:"",
	  team:"",
	  start_date:"",
	  end_date:"",
	  _type:""
    };
 
    vm.fields = [
  
  
	  {
        key: 'username',
        type: 'select',
	 expressionProperties : {
       'templateOptions.onChange': function($viewValue, $modelValue, $scope) {
	   
	   
	  check_dates($viewValue)
	   
	   
       }},
        templateOptions:{
            label: 'Name',
            options: boards,
             }
		
		},
		  {
        key: '_type',
        type: 'select',
        templateOptions:{
            label: 'Type',
            options: leave_type,
             }
		
		},
	   
 
	  {
        key: 'notes',
        type: 'textarea',
        templateOptions: {
          label: 'Notes',
          placeholder: '',
          description: ''
        },
    
      }

  
    ];

	
	
    // function definition
    function onSubmit() {

		formData=(vm.model);
			console.log(formData)
		
		formData.start_date = moment($scope.datePicker.date.startDate._d).startOf('day')
		formData.end_date = moment($scope.datePicker.date.endDate._d)
		
		var leave = new Leave(formData);
		
	
			 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
					
						if(_team._id==formData.username){
							
							leave.team_member= _team._id
							
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( $scope.ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											leave.$save(function(resp) {
													console.log('response',resp) 
													team[i].leave_taken.push(resp._id);
										
								
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
							
							
		 vm.options.resetModel()
		// $scope.datePicker.date=[]
		 $scope.overlapalert=[]
		 
						
           
            });
						}
				})
			})
	
			

   
	

    }  
 }
 
 

	
	}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/leave-controller.js","/../components/team")
},{"b55mWE":4,"buffer":3}],79:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog
    ) {



  $scope.rows = [];
  
  $scope.counter = 0;
  
  $scope.addRow = function() {
   var team = new Team({
                name:  $scope.counter
            });
			
	 team.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
  
  
     Team.query({}, function(team) {
	  _.each(team, function(row,index) {
		  
		
		  
		number_days_leave_taken = 0
		 _.each(row.leave_taken, function(leave) {
	
			 if(leave.start_date>=row.leave_start && leave.end_date<=row.leave_year_end){
				number_days_leave_taken+=leave.weekday_duration
			 }
			 else
			{
	
					 
			}
		 })
		row.number_days_leave_remaining=row.number_days_leave-number_days_leave_taken
		  
		$scope.rows.push(row)
		 $scope.counter++;
	 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

  /* 
   * messages is commented out because there is a bug currently
   * with ngRepeat and ngMessages were the messages are always
   * displayed even if the error property on the ngModelController
   * is not set, I've included it anyway so you get the idea
   */
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = event.target.attributes[0].nodeValue;
myArray.push(obj);
   
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Team.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/team/team-controller.js","/../components/team")
},{"b55mWE":4,"buffer":3}],80:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var async = require('async')

exports.tech_support_controller = function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope,  trello, tech_get_trello_board, date_calc,Tech_support
    ) {
	$scope.rows=[]
	$scope._rows=[]
	//http://ui-grid.info/docs/#/tutorial/201_editable
	Tech_support.query({}, function(team) {


	
					async.forEach(team, function(row, callback2) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
						//get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope._rows.push(row)
							$scope.counter++;
							callback()							
					//})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope._rows;
						})
						
					})	
		var lists = []
		var list = []
		list.id="5710a18fc2c7adc11a382e94"
			lists.push(list)
		var list = []
		list.id="57c6f2715e4ad081f42204ec"
			lists.push(list)
		var list = []
		list.id="57558712bec1ad7712beb29e"
			lists.push(list)
		
		trello.auth() 				
					
	$scope.gridOptions=[]
	$scope.gridOptions.columnDefs = [   ]
	$scope.gridOptions = {
	columnDefs: [
	{ field: 'list' ,resizable: true},
	{ field: 'date_created' ,type:'date'}, 	
	{ field: 'last_updated' ,type:'date'}, 	
	{ field: 'name' , width: "450",height:"50",resizable: true},   
	{ field: 'weekday_duration' ,displayName: 'Age',type:'number'}, 
	{ field: 'category' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'AV' ,value:'AV'},	 
      { id:'TECHNICIANS',value:'TECHNICIANS'},
	  { id:'ELECTRICIAN',value:'ELECTRICIAN'},
	   { id:'CONSERVATORS',value:'CONSERVATORS'},
	  { id:'EXTERNAL',value:'EXTERNAL'},
	  { id:'UNASSIGNED',value:'UNASSIGNED'}
	
    ] },
	{ field: 'type' , enableCellEdit: true,enableFiltering: true,editableCellTemplate: 'ui-grid/dropdownEditor',editDropdownOptionsArray: [
      { id:'SOFTWARE' ,value:'SOFTWARE'},	 
      { id:'HARDWARE',value:'HARDWARE'},
	  { id:'CONTENT',value:'CONTENT'},
	  { id:'WEAR',value:'WEAR'},
	
    ] },
	    { field: 'difficulty' ,resizable: true,type:'number'},  
	    { field: 'aknowledged',type:'date' ,resizable: true},  
		 { field: 'resolution' ,resizable: true}  
	],
	
	enableGridMenu: true,
	enableSelectAll: true,
	enableCellSelection: true,
	enableCellEditOnFocus: true,
	exporterCsvFilename: 'myFile.csv',
	exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	onRegisterApi: function(gridApi){
	vm.gridApi = gridApi;

	},
	pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
            // pageSizes: list of available page sizes.
            pageSizes: [250, 500, 1000], 
            //pageSize: currently selected page size. 
            pageSize: 250,
            //totalServerItems: Total items are on the server. 
            totalServerItems: 0,
            //currentPage: the uhm... current page.
            currentPage: 1
        },
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post

		var myArray = []
			var key = colDef.field;
			var obj = {};
			obj[key] = newValue;
			myArray.push(obj);
				var query = {'id':rowEntity._id};
	var query = {'id':rowEntity._id};
			Tech_support.update(query, 	obj
					
					, function(err, affected, resp) {

var comment_text = [colDef.field] + ": " + newValue
					var data = {text:comment_text}
				
					Trello.post("cards/"+rowEntity._id+"/actions/comments",data)
					
					
			})
  });
    },
	
  };
  
 
		
	get_list = function (row,cb) {
	
		//card might have been moved to done!
		var query = {'id':row.id};
		Trello.get("cards/"+row.id+"?fields=idList,dateLastActivity", function(card) {
		console.log('got card')
		Trello.get("lists/"+card.idList+"?fields=name", function(list) {
		console.log('got list')
		
							row.editable = true
							//if(row.name!="Done"){
							$scope.rows.push(row)
							$scope.counter++;
		
			Tech_support.update(query, {
					list:list.name,
					last_updated:card.dateLastActivity
					},cb())	
		 })
		 
		 })
		 
	 
	 }



		$scope.rows = []
		$scope.column_headings=[]
		
	tech_get_trello_board.get_data(lists, function() {

				console.log('updated latest lists from trello',lists)
				Tech_support.query({}, function(team) {
console.log(team)
					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
				
				
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					//get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope._rows.push(row)
							$scope.counter++;
							callback()							
					//})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope._rows;
						})
						
						})
						
						})
					
}







}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/tech-support-controller.js","/../components/tech-support")
},{"async":1,"b55mWE":4,"buffer":3}],81:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.techSupport = function() {
  return {
   controller: 'tech_support_controller',
    templateUrl: './components/tech-support/tech-support-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/tech-support-directive.js","/../components/tech-support")
},{"b55mWE":4,"buffer":3}],82:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var async = require('async')
exports.tech_get_trello_board = function (date_calc,$http,Tech_support) {	

	var self = this
    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
	

	
	
    trello.get_data = function (listx,cb) {
		console.log('trello.get_data')
		var self = this
		var lists = listx.length
		var count = 0
		
		
	 async.forEach(listx, function(list, callback2) { 
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			list_id=list.id
		   Trello.get("lists/"+list.id+"/cards", function(cards) {
			console.log('get list data')		
					var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
				 async.forEach(cards, function(card, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
       
	   
	   	//calculate date created
					idBoard = card.id;
						
console.log('trello card',card)
					support_card = {
						id:card.id,
						name: card.name,
						list_id:card.idList,
						last_updated:card.dateLastActivity,
						tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
						dateLastActivity: card.dateLastActivity,
						link:card.shortUrl,
						date_created:new Date(1000*parseInt(idBoard.substring(0,8),16))
					}
					
					

				
	   
					Tech_support.update({id:card.id}, support_card,callback())

					}, function(err) {
						if (err) return next(err);
						console.log('done updating mongo')
							callback2()	
					});
	
		});	
				}, function(err) {
						if (err) return next(err);
					console.log('all done ')	
				cb()
					});		


    };


		

    return trello;

}


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/trello-services.js","/../components/tech-support")
},{"async":1,"b55mWE":4,"buffer":3}],83:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_settings_controller =  function($scope, $http, $q, $routeParams, $location,
        screen_saver_loop,  $rootScope, detect_dragging, trello, get_trello_board, date_calc, Todos, Tallys,Team,Timeline,$mdEditDialog,Timeline_data
    ) {



  $scope.rows = [];
   $scope.column_headings = []

  $scope.counter = 0;
  
  $scope.addRow = function() {
   var data_row = new Timeline_data({
                name:  $scope.counter
            });
			
	 data_row.$save(function() {
		
               
            });
  
    $scope.rows.push('Row ' + $scope.counter);
    $scope.counter++;
  }
   Timeline_data.query({}, function(data) {
  _.each(data, function(data_settings,index) {

		  Timeline_data.remove({
               // id: data_settings._id
            });
		
	})	
		})	  
  
  		var data_settings = new Timeline_data({ 
					type:"text",
					data_feed_url:"https://www.gov.uk/bank-holidays.json",
					googlesheet_name:"england-and-wales",
					track:"public holidays",
					group:"public holidays",
					use_moment:false,
					value_column:"title",
					title_column:"title",
					events_sub_child:"events",
					start_column:"date",
					group_id:"public holidays"+"public holidays",
					date_column:"date"
		})
	//data_settings.$save();
		
			var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')
	
	
	
	
	var data_settings = new Timeline_data({ 
					type:"numerical",
					data_feed_url:"http://museums.bristol.gov.uk/sync/data/stats.JSON",
					googlesheet_name:"stats",
					track:"emu stats",
					use_moment:false,
					value_column:"value",
					group_column:"module",
					group_id:"module",
					group_id_column:"module",
					date_column:"date",
					subgroup_column:"action",
					start_column:"start_date",
					end_column:"end_date",
					val_1:0,
					val_2:10,
					val_3:100,
					val_4:500,
					val_5:1000,
					val_6:2000,
					val_7:3000,
					val_8:4000,
					val_9:5000,
					val_10:10000
	})
 //data_settings.$save();
  
  	
	
		var data_settings = new Timeline_data({ 
					type:"numerical",
					use_moment:true,
					googlesheet_id:"1ENJ87VM90o15jcZ1yavlVf7F1fg4xePoluyrm2uWlgE",
					googlesheet_name:"pivot",
					track:"Shopify",
					group:"Shopify",
					group_id:"Shopify",
					value_column:"value",
					date_column:"date",
					val_1:0,
					val_2:300,
					val_3:600,
					val_4:900,
					val_5:1100,
					val_6:1200,
					val_7:1400,
					val_8:1500,
					val_9:2000,
					val_10:3000
	})
	//data_settings.$save();
	 
	 	
		var data_settings = new Timeline_data({ 
					type:"text",
					googlesheet_id:"1VsSxPQ6rGrP3FWdveX3wwdUlnB1t_Sk2NG6aE0kX92M",
					googlesheet_name:"Sheet1",
					use_moment:false,
					track:"Arts and Events",
					colour:"green",
					title_column:"Event_Title",
					start_column:"Event_Start",
					group_column:"Event_Location",
					end_column:"Event_End",
					value_column:"value",
					subgroup_column:"name",
					date_column:"date"
	})
	data_settings.$save();
  
     Timeline_data.query({}, function(team) {
		 
		   for (var key in team[0]) {
			   
			var dont_shows=[
			"__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
		   ]
			
			   if(dont_shows.indexOf(key)==-1){
				$scope.column_headings.push(key)
			   }				
			}	
			
		  _.each(team, function(row,index) {  
			$scope.rows.push(row)
			 $scope.counter++;
		 })
	 })
	 
	 
   $scope.editComment = function (event, dessert) {
  // if auto selection is enabled you will want to stop the event
  // from propagating and selecting the row
  event.stopPropagation();

console.log(event)
  
	var myArray = []
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
 
 
  var promise = $mdEditDialog.small({

    modelValue: dessert.comment,
    placeholder: 'Add a comment',
    save: function (input) {
	event.target.innerHTML=input.$modelValue
			var query = {'id':dessert._id};
			Timeline_data.update(query, {
					myArray:input.$modelValue
					}, function(err, affected, resp) {
					console.log(resp)
					console.log(err)
			})
    },
    targetEvent: event,
    validators: {
      'md-maxlength': 30
    }
  });
  promise.then(function (ctrl) {
    var input = ctrl.getInput();

    input.$viewChangeListeners.push(function () {
      input.$setValidity('test', input.$modelValue !== 'test');
    });
  });
  }
  }

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline-settings/timeline-settings-controller.js","/../components/timeline-settings")
},{"b55mWE":4,"buffer":3}],84:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_bookings_functions  =  function (timeline_functions,$http,Timeline,$rootScope,$location) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
						
console.log('Current route name: ' + $location.path());
					
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( $rootScope.added_track_groups.indexOf("ROOM BOOKING")==-1 &&  $location.path()=="/room-hire")
											{
													$rootScope.added_track_groups.push("ROOM BOOKING")														
													$rootScope.track_groups.push({"track":"ROOM BOOKING","selected":true})
											}
											if( $rootScope.added_track_groups.indexOf("EQUIPMENT BOOKING")==-1&&  $location.path()=="/equipment-timeline")
											{
													$rootScope.added_track_groups.push("EQUIPMENT BOOKING")														
													$rootScope.track_groups.push({"track":"EQUIPMENT BOOKING","selected":true})
											}
													
													
												console.log('BOOKINGS EVENTS',eventss)
												$.each(eventss, function( index, data ) {
													
																data.days=timeline_functions.days(data.start_date,data.end_date)
																var end_date
																if ( data.group != "") {
																	if( data.start_date!=""){
																	if(typeof(data.end_date)!="undefined"){
																			end_date=(moment(data.end_date).format("MMM Do YY"))
																	}
																	if(data._type=="ROOM BOOKING"){
																			install_instance_tally++
																			install_days_tally +=data.days
																	}
																	else if(data._type=="DERIG"){
																			derig_tally++						
																			derig_days_tally +=data.days
																	  }
																	if($rootScope.added_track_groups.indexOf(data._type)==-1){	
																	
																			$rootScope.added_track_groups.push(data._type)
																	
																	}
																		
																		var event_to_add=	{
																								  id : data._id,
																								  name :data.name,
																								  showimage :"",
																								  image :"",
																								  className		:	 data.approved == false ? "red" : "blue",
																								  start_date :moment(data.start_date).format("MMM Do"),
																								  end_date :end_date ||"",
																								  notes  :data.notes ,
																								  approved  :data.approved ,
																								  days :data.days
																							}
																							
																							console.log('event_to_add',event_to_add)
																								 
																			 //if($rootScope.isloggedin==true){
																		visevents.add({
																						_id: data._id,
																						className:event_to_add.className,
																						select_group :false,
																						name:data.name,
																						
																						_type:data._type,
																						track:data._type,
																						content: timeline_functions.event_html(event_to_add),
																						group: data.group,
																						order:data._type,
																						notes: data.notes,
																						approved: data.approved,
																						//title:data.notes,
																						start: data.start_date,
																						days:data.days,
																						end: data.end_date 
																					})
																			//}
																	}
																}
																							
														
																		
															
																	
												})
														
														
													
													
										  					
										console.log('visevents',visevents)
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-bookings-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],85:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_controller=     function($compile,  $scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello,timeline_bookings_functions, get_trello_board, date_calc, Todos, Timeline, Bookings,Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate,Raw_visits,timeline_visitor_figures_functions,timeline_install_functions, $timeout,timeline_exhibitions_functions
    ) {
		
		$scope.locked=[]
		$scope.locked.add_item = false
		$scope.locked['true']={status:" locked",value:false}
		$scope.locked['false']={status:" unlocked",value:true}
		$scope.average_install_length = 0
		$scope.password=false
		$scope.lockstatus=false
		$scope.average_derig_length = 0
		$rootScope.addednames=[]
		$rootScope.track_groups=[]
		$rootScope.added_track_groups=[]
		$rootScope.datePicker=[];
		$scope.isloggedin=false	
		$scope.isloggedin=false	
	    $scope.timeline_track = Timeline 
		
		
		$rootScope.installmodels=[]				
		$rootScope.installmodels.push({"name":"painting","selected":false,"icon":"picture"})
		$rootScope.installmodels.push({"name":"graphics","selected":false,"icon":"tint"})
		$rootScope.installmodels.push({"name":"av","selected":false,"icon":"volume-up"})
		$rootScope.installmodels.push({"name":"build","selected":false,"icon":"wrench"})
		$rootScope.installmodels.push({"name":"objects","selected":false,"icon":"tower"})
		$scope.haspermissions=false
	
	 $scope.init = function(timeline_mode)
  {
	 setTimeout(function() {
	 
			(timeline_mode=="room-hire")	? $scope.timeline_track = Bookings :  $scope.timeline_track = Timeline 
			
			
			 AuthService.isLoggedIn().then(function(user){
		
			
						$scope.user=user
						$scope.isloggedin=true			
						if(	user.data.group=="ADMIN"){$scope.haspermissions=true}
						if(	user.data.group=="EXHIBITIONS"){$scope.haspermissions=true}
						if(	user.data.group=="DIGITAL"){$scope.haspermissions=true}

			main_function(timeline_mode)
			
	  })
	   
	  	setTimeout(function() {
		
			if($scope.isloggedin==false){
				main_function(timeline_mode)
			} 
		
        }, 2000);

  })
}

	  

main_function = function(timeline_mode){



	if(timeline_mode=="room-hire" ){ timeline_track = Bookings } else{  timeline_track = Timeline }

			$scope.filter_pie=[]
			$scope.filter_pie.push({value:"2017 total_children",name:"No. children"})
			$scope.filter_pie.push({value:"2017 total_sessions",name:"No. sessions"})
			$scope.filter_pie.push({value:"2017 total_teachers",name:"No. teachers"})
			$scope.filter_pieSelected = $scope.filter_pie[0].name; 
			$scope.plot_graph =null;
			$rootScope.datePicker.date = {startDate:null, endDate: null};
			
			$scope.dateRangeOptions = {
				
				
					locale : {
						format : 'DD/MM/YYYY'
					},
					//TIMELINE EVENT HANDLERS					
					eventHandlers : {
						
										'apply.daterangepicker' : function() {  
										   date=$rootScope.datePicker.date
											days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
											
											
										 
										   	if(moment(date.startDate).isValid()){ //true
										
										var event_to_add=	{id :  $scope.selected_id,
																				  name :$scope.selected_item,
																				  showimage :"",
																				  image :"",
																				  start_date :moment(date.startDate).format("MMM Do"),
																				  end_date : moment(date.endDate).format("MMM Do")|| "",
																				  notes  :$rootScope.selected_notes + "(" +days+" days)" ,			
																				 
																				 install_features:$rootScope.installmodels,
																				 days :days}
										
										
										html=timeline_functions.event_html(event_to_add)
												
										var options={id:$scope.selected_timeline_id,content:html,install_features:$rootScope.installmodels, start:moment(date.startDate)._d,end:moment(date.endDate)._d,start_date:moment(date.startDate)._d,end_date:moment(date.endDate)._d}
												
										timeline_track.update({
												id: $scope.selected_id,				
												}, options);				
												console.log('updatedItem',options)
												timeline_functions.updateItem(options)
												
								
									
										}}				
						}
        }

				$scope.$watch('selected_notes', function(selected_note) {
				console.log('selected_notes edited',selected_note)
						timeline_functions.event_edited($scope,selected_note)
				
				})
				$scope.$watch('selected_approved', function(selected_approved) {
				console.log('selected_approved edited',selected_approved)
						timeline_functions.event_edited($scope,selected_approved)
				
				})
		
				

			
			$scope.$watch('selected_item', function(selected_item) {

			if(timeline.options.editable==true){	
			
			date=$rootScope.datePicker.date
			days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			$scope.selected_start = moment(date.startDate ).format("MMM Do")
			$scope.selected_end = moment(date.endDate).format("MMM Do")
					
			if(moment(date.startDate).isValid()){ //true
											
			var event_to_add=	{id :  $scope.selected_id,
													  name :$scope.selected_item,
													  showimage :"",
													  image :"",
													  start_date :moment(date.startDate).format("MMM Do"),
													  end_date : moment(date.endDate).format("MMM Do")|| "",
													  notes  :$rootScope.selected_notes ,
													  
													 days :days}
			
					html=timeline_functions.event_html(event_to_add)
					
					var options={id:$scope.selected_timeline_id,content:html,name:selected_item,start:moment(date.startDate)._d,end:moment(date.endDate)._d,}
					timeline_track.update({
					id: $scope.selected_id,				
					}, options);	
					
					console.log('called by selected_item') 
					
					timeline_functions.updateItem(options)
			}
			
			}
		//	else
			//{
			//	console.log('not logged in')
			//}
			
			})
	 
			$scope.$watch('stack', function(stack) {
		
		
					 if(typeof(stack)!="undefined"){
						 
						   options={stack:stack}
							timeline_functions.updateOptions(options)
					  }
		  
		
		  
			})

		
		
			//END EVENT HANDLERS

		
			$scope.editing = [];
			$scope.timeline = Timeline.query();


			
			
			$scope.removeTimeline = function(id) {
				timeline_track .remove({
					id: id
				})
			}
	
		
				
				
		   timeline_track.query({}, function(team) {
				_.each(team, function(row,index) {
			
			 
			 var timeline = $scope.timeline[index];
			 if(timeline.group=="Bristol Archives"){
				 timeline_track .remove({
					id: timeline._id
				}, function() {
				   // $scope.timeline.splice(index, 1);
				});
				}
				
				})
			})
		
	
        $scope.save = function() {
		
            if (!$scope.newTimeline || $scope.newTimeline.length < 1) return;
            var timeline = new timeline_track({
                name: $scope.newTimeline,
                completed: false
            });

            timeline.$save(function() {
		
                $scope.timeline.push(timeline);
                $scope.newTimeline = ''; // clear textbox
            });
        }

        $scope.update = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.update({
                id: timeline._id
            }, timeline);
            $scope.editing[index] = false;
        }

        $scope.edit = function(index) {
            $scope.editing[index] = angular.copy($scope.timeline[index]);
        }

        $scope.cancel = function(index) {
            $scope.timeline[index] = angular.copy($scope.editing[index]);
            $scope.editing[index] = false;
        }

        $scope.remove = function(index) {
            var timeline = $scope.timeline[index];
            timeline_track.remove({
                id: timeline._id
            }, function() {
                $scope.timeline.splice(index, 1);
            });
        }

        $scope.datePicker = "";
        $scope.datePicker.date = {
            startDate: null,
            endDate: null
        };
        $scope.machine_types = [];
        $scope.type = "all";


		$scope.changedValue = function(place) {
        
		 $rootScope.filter_pieSelected=place
       
	   }

        $scope.machinesx = ["all"]
        $scope.filterCondition = {
            machine: 'neq'
        }
        $scope.$watch('type', function(type) {
            $scope.machinesx = ["all"]


        })

  

            // selected fruits
        $scope.machine_types_selection = [];



        $scope.categories = [];

        // selected fruits
        $scope.category_selection = [];



/*
        var _data = [];
        $scope.data = []
        $scope.day_data = []
        $scope.team = [];
        $scope.labels = $scope.team
        $scope.chart_title = "Machine activity"
*/

            var groups = new vis.DataSet();
            var dates = new vis.DataSet();
			var second_dates = new vis.DataSet();
            var all_groups = []
            var i = 0

      

			install_days_tally = 0
			install_instance_tally=0 
			derig_tally = 0
			derig_days_tally=0
			$scope.total_install_derig=install_days_tally+derig_days_tally
			$scope.average_install_length=Math.round(install_days_tally/install_instance_tally)
			$scope.average_derig_length=Math.round(derig_days_tally/derig_tally)
			
			var container = document.getElementById('example-timeline');
            timeline = new vis.Timeline(container);
			 $rootScope.timeline=	timeline
			
			date={content:"STARTER"  ,
					group:"STARTER",
					group_id:"STARTER",
					id:"STARTER",
					name:"STARTER"  ,
					event_type:"STARTER",
					track:"STARTER",
					order: "STARTER",
					subgroup: "STARTER",
					start:new Date(),
					end:new Date(),
					//className 	:	"orange"
					}
	
			//VIS ERRORS IF INITIALISED WITH AN EMPTY START DATE
			timeline_functions.setup( $scope.timeline_track ,$rootScope.groups, new vis.DataSet(date))
			
			
			
			$scope.add_exhibitions= function(){						
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_exhibitions_functions,timeline_track)
			}
			
			$scope.add_installs_derigs= function(){				
					timeline_functions.populate_timeline_track($rootScope,Timeline,timeline_install_functions,timeline_track)	
			}
			
			$scope.team_leave= function(){
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_leave_functions,timeline_track)				
			}
			
			$scope.visitor_figures= function(){							
					timeline_functions.populate_timeline_track($rootScope,Raw_visits,timeline_visitor_figures_functions,timeline_track)
			}
			
			
				$scope.bookings= function(){							
					timeline_functions.populate_timeline_track($rootScope,Bookings,timeline_bookings_functions,timeline_track)
			}
			
			
			$scope.shopify= function(){							
					timeline_functions.populate_timeline_track($rootScope,Shopify_aggregate,timeline_shopify_functions,timeline_track)
			}
				
			$scope.loans= function(){							
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_loans_functions,timeline_track)
			}
			
			$scope.learning_bookings= function(){							
					timeline_functions.populate_timeline_track_method_b($rootScope,timeline_learning_functions,timeline_track)
			}
			
			
			$scope.timeline_googlesheets_functions= function(data_settings){
			
					var groups =$rootScope.groups
					$rootScope.timeline.setGroups(groups);
					timeline_googlesheets_functions.get_events(data_settings)
				  		  
			}
			
			
			$scope.shopify() //NB for some reason need this to appear for unlogged in users otherwise text wont load in directives
			
			
			//WE'll do some routing here - might need to put it in a better place one day
			
			
			if(timeline_mode=="room-hire"){
				
		
			
					timeline_track = Bookings
					$scope.bookings()
			
			}
			else
			{
			timeline_track = Timeline
			if( $scope.isloggedin){	
			
			
					$scope.add_installs_derigs()
					$scope.team_leave()
					$scope.visitor_figures()
					$scope.learning_bookings()
					$scope.loans()
					

			}			
			
			$scope.add_exhibitions()
			}
		
	
	var checked_event_types=[]
											checked_event_types.push('Tour')
											checked_event_types.push('Walk')
											checked_event_types.push('Rides')
											checked_event_types.push('Tours')
											checked_event_types.push('Talk')
											checked_event_types.push('Lecture')
											checked_event_types.push('Special Event')
											checked_event_types.push('Event')
											checked_event_types.push('Family')

	   Timeline_data.query({}, function(data) {
				
				_.each(data, function(data_settings) {
					console.log('data_settings',data_settings)
					$scope.timeline_googlesheets_functions(data_settings)
				})
		
		timeline_functions.update_andCompile()	
		
		})

	

    // check if there is query in url
    // and fire search in case its value is not empty
		 $scope.$watch('installmodels|filter:{selected:true}', function (nv) {
						timeline_functions.event_edited($scope)

		}, true);
	
	
	
	$scope.$watch('track_groups|filter:{selected:true}', function (nv) {
		
					var selection = nv.map(function (track_groups) {
					
					  return track_groups.track;
					});
					$scope.selected_tracks=selection
					timeline_functions.changeTracks(selection)
					//$( ".draggable,.iconbar" ).css({ 'top':'0px' });
  }, true);
  
	
$scope.$watch('groups|filter:{selected:true}', function (nv) {
	
					var selection = nv.map(function (group) {
					  return group.content;
					});
					timeline_functions.changeGroups(selection)
					$( ".draggable,.iconbar" ).css({ 'top':'0px' });
	
}, true);

	


			
	
      
			
		$scope.exportCSV= function(){
			
				data_to_export=$rootScope.timeline.itemsData.getDataSet()
				
				visibles=$rootScope.timeline.getVisibleItems()
				events=[]
				
				  _.each(data_to_export._data, function(event,index) {
				
				  if(visibles.indexOf(event.id)!=-1){
				  console.log("in")
				  var _event ={  
								 id			:event.id,
								 name		:event.name,
								 start_date	:moment(event.start).format("DD/MM/YYYY"),
								 end_date	:moment(event.end).format("DD/MM/YYYY"),
								 event_type	:event.track
							   
								}
					 events.push(_event)
						}
				  
				   
				  
				  })
						
				timeline_functions.export_JSON_to_CSV(events, "Timeline dates", true)
	}
	

				
			
			
			
		
		
			
		

		       
            $scope.list1 = {
                title: 'PROVISIONAL DATE'
            };
            $scope.list2 = {
                title: 'INSTALL'
            };
            $scope.list3 = {
                title: 'DERIG'
            };

            $scope.onDropComplete = function(data, evt) {
                // console.log("drop success, data:", data);
            }
			
		


       // })

    };
	
	
	} 
 
exports.BasicDemoCtrl=   function ($mdDialog,$scope, $http, $q, $routeParams, $location

    ) {
	


 var originatorEv;

    this.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

    this.notificationsEnabled = false;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };

    this.redial = function() {
    };

    this.checkVoicemail = function() {
      // This never happens.
    };
  }
  
  

exports.add_timeline_items_controller=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
	
	$scope.unlocked=false
	$scope.$watch('locked', function (locked) {
		
		$scope.locked=locked
  })
  }
  
  exports.add_timeline_info_box=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {
		

 



 }
  

  

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-controller.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],86:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.timeLine = function() {
  return {
   controller: 'timeline_controller',
    templateUrl: './components/timeline/timeline-page.html'
  }
	}


	exports.timelineBookings = function() {
  return {
 controller: 'timeline_resources_controller',
   templateUrl: './components/timeline/timeline-page.html'
  }
  }


	
		exports.timelineMenu = function() {
  return {
   controller: 'BasicDemoCtrl',
    templateUrl: './components/timeline/menu.html'
  }
	}
	
			exports.addtimelineItems = function() {
  return {
   controller: 'add_timeline_items_controller',
    templateUrl: './components/timeline/add-items-block.html'
  }
	}
	
		
exports.timelineInfobox = function() {
  return {
   controller: 'add_timeline_info_box',
    templateUrl: './components/timeline/info-box.html'
  }
	}
	
	
	exports.timelineDatabar= function( $compile ) {
 
 return{
	restrict: 'E',
	
	 link: function($scope, $el) {
	
		
      var script = document.createElement('script');
	  
      script.text = "$(function() {;"
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').hide();"
	  script.text +=" $('#miniicon'+ '"+ $scope.id +"').show();"
	  script.text +=" $('#timeline'+ '"+ $scope.id +"').mouseover(function() {"; 
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').show();"; 
	  script.text +=" $('#miniicon'+ '"+ $scope.id +"').hide();"
      script.text +="});"; 
	  script.text +=" $('#timeline'+ '"+ $scope.id +"').mouseout(function() {"; 
	  script.text +=" $('#infobutton'+ '"+ $scope.id +"').hide();"; 
	  script.text +=" $('#miniicon'+ '"+ $scope.id +"').show();"; 
      script.text +="});"; 
	  script.text +="$('#infobutton'+ '"+ $scope.id +"').on('click', function(event){ "
	  script.text +=" $('#infobox_name').text('').append('" + $scope.name  +"'); "; 
	  script.text +=" $('#infobox_description').text('').append('" + $scope.description  +"');"; 
	  script.text +="});});"
		 	 
      $el.append(script);
  
    },

      templateUrl: './components/timeline/timeline-item.html',
	  scope: {
					startdate: "@",
					id: "@",
					enddate: "@",
					name: "@",
					description: "@",
					image: "@",
					showimage: "@",
					notes: "@",		 
					days: "@",
					painting:"@",
					av:"@",
					build:"@",
					objects:"@",
					graphics:"@"

		}
    }
	}
	

	
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-directive.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],87:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_exhibitions_functions =  function (timeline_functions,$http,Timeline,$rootScope,$routeParams) {


  return {
  
 get_events: function() {
      return $http.get('/assets/data/events.JSON');  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
		
			  var visevents = new vis.DataSet();
			    var groups = new vis.DataSet()
									var self=this
		
		var checked_event_types=[]
			
			if($("#add_emu_exhibitions").is(':checked')){
				
				checked_event_types.push('Exhibition')
				checked_event_types.push('Gallery')
				
			}
		
			
			//if($("#whats_on").is(':checked')){
				checked_event_types.push('Family')
				checked_event_types.push('Tour')
				checked_event_types.push('Walk')
				checked_event_types.push('Rides')
				checked_event_types.push('Tours')
				checked_event_types.push('Talk')
				checked_event_types.push('Lecture')
				checked_event_types.push('Special Event')
				checked_event_types.push('Event')
				
			//}
	
								
					
																	
				$.each(eventss.data.events, function( index, event ) {	
											
											if( event.startDate!=""){
												
											//if( checked_event_types.indexOf(event.type)>=0){	
											if( event.type=="Exhibition"||event.type=="Gallery" || event.type=="Gallery Refurbishment"){
											var end_date=new Date(event.endDate)
											
											if(event.endDate==""||event.endDate==event.startDate){
										
											var end_date=new Date(event.startDate)
											//end_date.setDate(end_date.getDate() + 1)
										
											}
											var group =	"NA"
											if( event.type=="Exhibition"||event.type=="Gallery" || event.type=="Gallery Refurbishment"){
											 group =	event.event_space||"NA" 
											if(event.venue=="Bristol Museum & Art Gallery")venue_pic= 176421 
											if(event.venue=="Red Lodge Museum" )venue_pic=  37235
											if(event.venue=="Georgian House" )venue_pic= 189420 
											if(event.venue=="Bristol Archives" )venue_pic= 217822 
											if(event.venue=="M Shed" )venue_pic= 206079 
											 
											
											
											group_name="<table><tr><td><b>"+event.event_space+"</b><br></br>"
											group_name+=event.venue+"</td><td>"
											group_name+=	'<img  class="pull-right" src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+venue_pic+'&height=50&format=jpeg" />'
											group_name+="</td></tr></table>"
											 
											}
											else{
												 group =	event.type ||"NA"
											}
													
												var eventimages = false
												if(event.images[0]){
												eventimages=event.images[0].irn
												}
												
												var event_to_add = {}
												
										
												
												var event_to_add=	{id : event.ID,
													  name :event.name,
													  showimage :true&&event.images[0],
													  image :eventimages,
													  start_date :event.startDate,
													  end_date :event.endDate,
													  notes  :"",
													  description  :event.description,
													 days: ""
													 }
												
												
												var htmlContent =  timeline_functions.event_html(event_to_add)
													if( 	$rootScope.added_track_groups.indexOf(event.venue)==-1){
												$rootScope.added_track_groups.push(event.venue)														
													$rootScope.track_groups.push({"track":event.venue})
													}
													select_group = true
													if($routeParams.track){
													select_group = false
													if($routeParams.track=="Arts and Events"){
													//select_group = true
													}
													}
													
													if(event.startDate){ //timeline errors if no start date
													visevents.add({
																		group		:	group, 
																		ID:event.ID,
																		group_name		:	group_name, 
																		select_group :select_group,
																		title		:	event.name,
																		name:event.name,
																		type		: "background",

																		content		:	htmlContent,
																		order:event.venue+event.event_space,
																		track:event.venue,
																		start		:	new Date(event.startDate), 
																		end			:	event.endDate, 
																		className 	:	"green",
																		event_type  :   "WHATS ON"
																		})
														}
																		
											}
											}

			  })
			   
							//NB STARTER						
					  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-exhibitions-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],88:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_googlesheets_functions =  function (timeline_functions,$http,Timeline,$rootScope,$routeParams) {

  return {
	  
	  get_events: function(data_settings) {
	  var self = this
	  
	   if(data_settings.data_feed_url){
		   
	  return $http.get(data_settings.data_feed_url).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
		else
		{
		 
	  return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id="+data_settings.googlesheet_id).then(function(datax) {
					
						self.add_events(data_settings,datax, function(public_dates){
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							_.each($rootScope.leave_groups, function(_group) {
								$rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
		}
   },
  
  	add_events: function (data_settings,eventss, fn){
	
							
									var visevents = new vis.DataSet();
									var self=this
									var today = new Date()
								
												$.each(eventss.data[data_settings.googlesheet_name].events || eventss.data[data_settings.googlesheet_name], function( index, event ) {	
												//$.each(eventss.data['england-and-wales'].events, function( index, event ) {	
													if($rootScope.added_track_groups.indexOf(data_settings.track)==-1){	
														$rootScope.added_track_groups.push(data_settings.track)	
														$rootScope.track_groups.push({"track":data_settings.track})
													}
												
												if(data_settings.type=="numerical"){
												
												scale_class="";	
												
										
												
												if(event[data_settings.value_column] >data_settings.val_1 && event[data_settings.value_column]<=data_settings.val_2){scale_class="scale_01"}
												
												if(event[data_settings.value_column] >data_settings.val_2 && event[data_settings.value_column]<=data_settings.val_3){scale_class="scale_02"}
												
												if(event[data_settings.value_column] >data_settings.val_3 && event[data_settings.value_column]<=data_settings.val_4){scale_class="scale_03"}
												
												if(event[data_settings.value_column] >data_settings.val_4 && event[data_settings.value_column]<=data_settings.val_5){scale_class="scale_05"}

												if(event[data_settings.value_column] >data_settings.val_5 && event[data_settings.value_column]<=data_settings.val_6){scale_class="scale_06"}
												
												if(event[data_settings.value_column] >data_settings.val_6 && event[data_settings.value_column]<=data_settings.val_7){scale_class="scale_07"}
												
												if(event[data_settings.value_column] >data_settings.val_7 &&event[data_settings.value_column]<=data_settings.val_8){scale_class="scale_08"}
												if(event[data_settings.value_column] >data_settings.val_8 && event[data_settings.value_column]<=data_settings.val_9){scale_class="scale_09"}
													if(event[data_settings.value_column] >data_settings.val_9 && event[data_settings.value_column]<=data_settings.val_10){scale_class="scale_09"}
												if(event[data_settings.value_column] >data_settings.val_10){scale_class="scale_10"}
																						
													
													
													if(data_settings.use_moment==true){
													
													start_date=moment(event[data_settings.date_column])._d
													end_date=moment(event[data_settings.date_column])._d
													end_date.setDate(end_date.getDate() + 1)
													
													}
													else
													{
														
													start_date=event[data_settings.start_column]
													end_date=event[data_settings.end_column]
													
														
													}
																								
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}
														
														visevents.add( {content:"" ,
																		select_group:select_group,
																		group:event[data_settings.group_column]|| data_settings.group,
																		group_id:event[data_settings.group_id_column]||data_settings.track ,
																		name:event[data_settings.value_column].toFixed(2),
																		title:event[data_settings.value_column].toFixed(2),
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		subgroup: event[data_settings.subgroup_column],
																		start:start_date,
																		end:end_date,
																		className 	:	scale_class
																		})
													
														
														
												}
												
												else
													
												{
													
														
													if(data_settings.use_moment==true){
														start_date=moment(event[data_settings.date_column])._d
														end_date=moment(event[data_settings.date_column])._d
														end_date.setDate(end_date.getDate() + 1)
													}else
													{
													start_date=new Date(event[data_settings.start_column])
													//end_date=new Date(start_date) //required e.g. art and events
													var end_date=new Date(start_date).setDate( start_date.getDate() + 1);
													
													end_date=new Date(start_date) //required e.g. art and events
													end_date.setDate( start_date.getDate() + 1);
													}
													
													
													
												
													
									var event_image=false
											var event_image_irn
											if(event.images){
											if(event.images[0]){
												event_image=true
												event_image_irn=event.images[0].irn
												}
											}
												
													var htmlContent =  self.event_html(event[data_settings.title_column],event_image,event_image_irn,start_date,end_date)
												
													select_group = false
													if($routeParams.track){
													select_group = false
													if($routeParams.track==data_settings.track){
													select_group = true
													}
													}  
													
													
													//if(!data_settings.checked_event_types || (event[data_settings.group_column]!="" && data_settings.checked_event_types.indexOf(event[data_settings.group_column])!=-1 && new Date(event[data_settings.start_column]))){
												
														this_event={content:htmlContent ,
																		select_group:select_group,
																		group_id:event[data_settings.group_column]+data_settings.track || data_settings.track,
																		name:event[data_settings.title_column] ||"NA"  ,
																		title:event[data_settings.title_column] ||"NA"  ,
																		event_type:data_settings.track,
																		track:data_settings.track,
																		order: data_settings.track,
																		type:data_settings.event_type ||"",
																		start:start_date,
																		className :data_settings.colour
																		}
																		
														
														if(data_settings.subgroup_column!=""){
															this_event.subgroup=event[data_settings.subgroup_column]
														}
														if(data_settings.group!=""){
															this_event.group=data_settings.group
														}
														if(data_settings.group_column){
															this_event.group= event[data_settings.group_column]
														}
														
														
														
														
														//if(data_settings.end_column){
															this_event.end=end_date
													//}
														if(this_event.start && this_event.group )	{		
														visevents.add(this_event)
														}
														else{
															console.log('no start or group',this_event)
														}
														
														
												//}
												}
													})
									
										return	fn(visevents)

		},
		
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-googlesheets-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],89:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_install_functions =  function (timeline_functions,$http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("Shopify product types")==-1){
												$rootScope.added_track_groups.push("Shopify product types")														
													$rootScope.track_groups.push({"track":"Shopify product types"})
													}
												console.log('INSTALL EVENTS',eventss)
												$.each(eventss, function( index, data ) {
													
																data.days=timeline_functions.days(data.start_date,data.end_date)
																var end_date
																if ( data.group != "") {
																	if( data.start_date!=""){
																if(typeof(data.end_date)!="undefined"){
																			end_date=(moment(data.end_date).format("MMM Do YY"))
																	}
																	if(data._type=="INSTALL"){
																			install_instance_tally++
																			install_days_tally +=data.days
																	}
																	else if(data._type=="DERIG"){
																			derig_tally++						
																			derig_days_tally +=data.days
																	  }
																	if($rootScope.added_track_groups.indexOf(data._type)==-1){	
																	
																			$rootScope.added_track_groups.push(data._type)
																	
																	}
																		
																			var event_to_add={
																								  id : data._id,
																								  name :data.name,
																								  showimage :"",
																								  image :"",
																								  start_date :moment(data.start_date).format("MMM Do"),
																								  end_date :end_date ||"",
																								  notes  :data.notes ,
																								  days :data.days,
																								  install_features:data.install_features		
																							}
																								 
																	


																				visevents.add({
																						_id: data._id,
																						className:data.className,
																						select_group :false,
																						name:data.name,
																						_type:data._type,
																						track:data._type,
																						content: timeline_functions.event_html(event_to_add),
																						group: data.group||"NA",
																						order:data._type,
																						notes: data.notes,
																						//title:data.notes,
																						start: data.start_date,
																						days:data.days,
																						install_features:data.install_features,																					
																						end: data.end_date 
																					})
																			//}
																	}
																}
																							
														
																		
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-installs-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],90:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_learning_functions = function ($http,Timeline,$rootScope) {
	
	

  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/~brlsmp4/learning/scripts/php/api/api.php?table=bookings"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("school visits")==-1){
												$rootScope.added_track_groups.push("school visits")														
													$rootScope.track_groups.push({"track":"school visits"})
													}
												console.log('eventss',eventss)
												$.each(eventss.data, function( index, event ) {	
																	end_date=new Date(event.event_date) 
																	end_date.setDate( end_date.getDate() + 1);
														if(	event.school_name!=""){											
														visevents.add( {content:event.school_name  ,
																		name:event.school_name  ,
																		group:event.site,
																		group_id:event.site+"school visits",
																		//id:event.id,
																		event_type:"public holidays",
																		track:"school visits",
																		order: "school visits",
																		className:"orange",
																		start:event.event_date,
																		end:end_date,
																		subgroup:"na",
																		notes 	:	event.booking_form_info
																		})
																		}
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-learning-bookings-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],91:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_leave_functions =  function ($http,Timeline,$rootScope) {

  return {
  
     get_eventss: function() {
      return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id=1v69qKCc-8FYx8VuKPZMr1QkTMfJsh7qZTZJ7q7o3YTg");  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									  var visevents = new vis.DataSet();
									var self=this
									


							
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
										
												
												$.each(eventss.data.tally, function( index, leave_record ) {	
																						
															if(leave_record.NAME!=oldName){
																	if(name.start_date!=""){
																	
																			names.push(name)
																			name=[]
																	}
																			oldName =leave_record.NAME
																			lastfrom_date=leave_record.DATE
																			 mylastfrom_date = new Date(leave_record.DATE);
																			name.start_date= new Date(leave_record.DATE);
																			name.name=leave_record.NAME
																			name.group=leave_record.TYPE
																			
																			
																			var end_date = new Date(lastfrom_date);
																			end_date.setDate(end_date.getDate() + 1);
																			name.end_date=end_date
																	
															}else
															{			
																														
														
															    //where dates are consecutive
																if(new Date(mylastfrom_date) - new Date(leave_record.DATE)==-86400000)	{
																	 mylastfrom_date = new Date(leave_record.DATE);
																	 
																	name.end_date=new Date(leave_record.DATE) 
																	name.end_date.setDate( name.end_date.getDate() + 1);
																}
																else{
																
																names.push(name)
																name=[]	
																name.name=leave_record.NAME
																name.group=leave_record.TYPE
																name.start_date=new Date(leave_record.DATE)	
																var non_consecutive_end_date = new Date(leave_record.DATE);
																name.end_date=non_consecutive_end_date.setDate( non_consecutive_end_date.getDate() + 1);
																
																
																}
	
																	
															}
																				
																
												})
										  

												$.each(names, function( index, value ) {
												
											
											
											
												if(value.name!=""){
													if(value.start_date){
														
														
												/*
												if($("#av_leave").is(':checked') && value.group=="CONTENT DESIGN" ||
												$("#user_research_leave").is(':checked') && value.group=="USER RESEARCH"  ||
												$("#digital_manager_leave").is(':checked') && value.group=="MANAGER"  ||
												$("#digitisation_leave").is(':checked') && value.group=="DIGITISATION"  ||
												$("#technicians_leave").is(':checked') && value.group=="TECHNICIAN"  
												){		
												*/
													if( 	$rootScope.added_track_groups.indexOf("leave")==-1){	
													 $rootScope.added_track_groups.push("leave")	
												$rootScope.track_groups.push({"track":"leave"})
													}
														visevents.add( {content:value.name  ,
																		group:value.group,
																		group_id:value.group+"leave",
																		id:value.id,
																		name:value.name  ,
																		event_type:"leave",
																		track:"leave",
																		order: "leave",
																		subgroup: value.name,
																		start:value.start_date,
																		end:value.end_date,
																		className 	:	"orange"
																		})
																	
														
												//}
														}
														}
														})
													
													
										  					
										
										return	fn(visevents)
									
								
									
								
												
								
		
		
		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
   get_events: function() {
      return $http.get('/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	/*
    setup: function(Timeline,groups,dates) {
	var self=this
	
   function prettyConfirm(title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            }

            function prettyPrompt(title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            }
			
			 function selected_data(event) {
			
			
						$rootScope.selected_t_id=event.items[0]
						$rootScope.selected =timeline.itemsData.getDataSet().get(event.items[0])
						$rootScope.selected_item=$rootScope.selected.name
						$rootScope.selected_notes=$rootScope.selected.notes
						$rootScope.datePicker.date={startDate:new Date($rootScope.selected.start),endDate:new Date ($rootScope.selected.end)}
						$rootScope.selected_id=$rootScope.selected._id
					
	
            }

            function logEvent(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            }
        

  var container = document.getElementById('example-timeline');
  
  		 function loadgroups(items){
	
			var _groups=[]
			var addednames=[]
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, addednames)==-1){
					addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group=="Temporary Exhibition Gallery"){ content="M SHED: "+value.group}
					if( value.group=="Window on Bristol"){ content="M SHED: "+value.group}
					if( value.group=="First Floor Foyer"){ content="M SHED: "+value.group}
					
					 _groups.push({
										id			:	value.group,
										display		:	'shown',
										event_type	:	value.event_type,
										content		:   content,
										event_typeSORT	: content
									})
				}
				}
			})

			
			return _groups		

		}
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				


                timeline = new vis.Timeline(container);
				groups=loadgroups(dates)
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
               // timeline.setGroups(groups);
				$rootScope.changeGroups=function(selected){
				
					var selection = []
					selection=$rootScope.myGroup.selected
				
					var list = groups.get({
						filter: function(item) {
							return (item.id in selection && selection[item.id]==item.id);
						}
					})
						timeline.setGroups(list);
						enable_event_drop()
				}
						
				var list = groups.get({
						filter: function(item) {
							return (item.display == "shown");
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				timeline.on('select', function (properties) {
						selected_data( properties)

				});
										
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
                    logEvent(event, properties);
                });

			enable_event_drop=function(event){
		
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                            event.preventDefault()
                          time=(timeline.getEventProperties(event).time)
						group=(timeline.getEventProperties(event).group)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
                            if (value) {
                               	add_item(group,time,value,"blue",30)
							}
							})
							}
							else
							{
								add_item(group,time,ui.draggable[0].innerHTML,"red",7)
							}
							
							function add_item(group,time,value,colour,days){
							 date_dropped=(moment(time).startOf('day')._d)
							
                            var id = ui.draggable[0].id
                            var dateDroppedOn =time
                            target_date = time
							
                            var new_date = {
                                content: value,
								name:value,
                                group: group,
                                className:colour||"",
                                start_date: new Date(moment(date_dropped).startOf('day')._d),
                                end_date: new Date (moment(date_dropped).add(days, 'days')._d)

                            }
                            var _timeline = new Timeline(new_date)
                                .$save(function(_item) {
                                    new_date.start = new Date(_item.start_date)
									type:ui.draggable[0].innerHTML,
                                    new_date.end = new Date(_item.end_date)
                                    new_date._id = _item._id

                                    timeline.itemsData.getDataSet().add(new_date)
									console.log(new_date)
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
                                    }, 1 * 1000);

                                });
							
							
							}
                        }



                    }
                })
				}
				enable_event_drop()
              
    }
	*/ 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-leave-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],92:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_loans_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										var today = new Date()
												var names=[];
												var name=[];
												var lastname="";
												var start_date="";
												var start_date="";
												var oldName="";
												var lastfrom_date="";
												var lastto_date="";
												var mylastfrom_date
												var currentStartDate;
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("loans")==-1){
												$rootScope.added_track_groups.push("loans")														
													$rootScope.track_groups.push({"track":"loans"})
													}
												console.log('eventss',eventss)
												$.each(eventss.data, function( index, event ) {	
																	start_date=new Date(event.start_date)
																	end_date=new Date(event.end_date) 																	
																	end_date.setDate( end_date.getDate() + 1);
														if(	event.title!="" && start_date!=""){											
														visevents.add( {content:event.title  ,
																		name:event.title  ,
																		group:event.direction,
																		//id:event.id,
																		event_type:"loans",
																		track:"loans",
																		order: "loans",
																		className:"green",
																		start:start_date,
																		end:end_date,
																		subgroup:"na",
																		notes 	:	event.event_type
																		})
																		}
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-loans-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],93:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.timeline_functions = function ( $templateCache,$compile,$http,Timeline,Bookings,$rootScope,$timeout) {
	

  
  return {
  
  timeline_track: Timeline,
  
  
  		

  
		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
	
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:    value.track,
										order		    :    value.order,
										event_type		:	 value.event_type,
										content			:    value.group_name,
										event_typeSORT	:    content,
										selected         : value.select_group 
									})
					console.log(_groups)
				}
				}
			})

			console.log(_groups)
			return _groups		

		},
	
		update_andCompile: function(item) {
			
			var self = this
			
			$compile($("timeline-databar"))($rootScope);
			
			console.log('update_andCompile') //MEMORY LEAK WARNING
			
			setTimeout(function() {
			
						
						unique_groups=[]
						added_ids=[]
						_.each($rootScope.groups, function(group){
							if(added_ids.indexOf(group.id)==-1){
							added_ids.push(group.id)
							unique_groups.push(group)
							}
						})
						
						var groups = new vis.DataSet(unique_groups);
	
						var list = groups.get({
								filter: function(item) {								
									return (item.selected == true);
								}
						})	
						
						self.enable_event_drop(timeline_track,timeline_track)
						$rootScope.timeline.redraw()
			
             }, 500);
			 
			
		},	
		
		populate_timeline_track: function(rootScope,dataset,dataset_functions,timeline_track) {
			 
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
				  
					dataset.query({}, function(datax) {
						self.add_events_loop(rootScope,datax,dataset_functions,timeline_track)
						console.log('called by populate_timeline_track')
						self.update_andCompile()
					})
					
		},
		
	


		populate_timeline_track_method_b: function(rootScope,data_functions,timeline_track) {
			
				 var self = this
				 $rootScope.groups = $rootScope.groups || []
				 var groups =rootScope.groups
				  rootScope.timeline.setGroups(groups);
			  
				  data_functions.get_events().then(function(datax) {					  
					self.add_events_loop(rootScope,datax,data_functions,timeline_track)
					})
		
		},
		 
		add_events_loop: function(rootScope,datax,dataset_functions,timeline_track) {
	
				var self = this
				dataset_functions.add_events(datax, function(public_dates){
							 rootScope.leave_groups = self.loadgroups(public_dates)
							_.each(rootScope.leave_groups, function(_group) {
								rootScope.groups.push(_group)
							})
							 _.each(public_dates._data, function(date) {
								if($rootScope.timeline.itemsData){
								rootScope.timeline.itemsData.getDataSet().add(date)
								}
							})
							//rootScope.timeline.itemsData.on("update", function(){self.update_andCompile()})
							rootScope.timeline.fit({},function(){
										console.log('called by add_events_loop')
										self.update_andCompile()
							})//needed due to angular wierdness with directives
				})
	
	
		},
		 
		 
		
			
		export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
					  
						//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
						var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
						//console.log('arrData',arrData)
						var CSV = '';    
						//Set Report title in first row or line
						
						CSV += ReportTitle + '\r\n\n';

						//This condition will generate the Label/Header
						if (ShowLabel) {
							var row = "";
							
							//This loop will extract the label from 1st index of on array
							for (var index in arrData[0]) {
								// console.log('row += index',row += index)
								//Now convert each value to string and comma-seprated
								row += index + ',';
							}

							row = row.slice(0, -1);
							
							//append Label row with line break
							CSV += row + '\r\n';
						}
						
						//1st loop is to extract each row
						for (var i = 0; i < arrData.length; i++) {
							var row = "";
							
							//2nd loop will extract each column and convert it in string comma-seprated
							for (var index in arrData[i]) {
								row += '"' + arrData[i][index] + '",';
							}

							row.slice(0, row.length - 1);
							
							//add a line break after each row
							CSV += row + '\r\n';
						}

						if (CSV == '') {        
							alert("Invalid data");
							return;
						}   
						
						//Generate a file name
						var fileName = "MyReport_";
						//this will remove the blank-spaces from the title and replace it with an underscore
						fileName += ReportTitle.replace(/ /g,"_");   
						
						//Initialize file format you want csv or xls
						var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
						
						// Now the little tricky part.
						// you can use either>> window.open(uri);
						// but this will not work in some browsers
						// or you will not get the correct file extension    
						
						//this trick will generate a temp <a /> tag
						var link = document.createElement("a");    
						link.href = uri;
						
						//set the visibility hidden so it will not effect on your web-layout
						link.style = "visibility:hidden";
						link.download = fileName + ".csv";
						
						//this part will append the anchor tag and remove it after automatic click
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);


},
  
  
     prettyConfirm: function (title, text, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55"
                }, callback);
            },

           prettyPrompt: function (title, text, inputValue, callback) {
                swal({
                    title: title,
                    text: text,
                    type: 'input',
                    showCancelButton: true,
                    inputValue: inputValue
                }, callback);
            },
			
			
	

            logEvent:function(event, properties) {
                var log = document.getElementById('log');
                var msg = document.createElement('div');
                //msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
                  //  'properties=' + JSON.stringify(properties);
               // log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
            },
  
  enable_event_drop:function(event){
		var self = this
                $(".vis-group").droppable({
                    accept: '.date_add',
                    drop: function(event, ui) {
					
							event.preventDefault()

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 50);
                          
                            time=(timeline.getEventProperties(event).time)
							group=(timeline.getEventProperties(event).group)
							
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add a provisional date', 'Name:',"", function(value) {
                            if (value) {
                               	add_item(group,group,time,value,"blue",30,ui.draggable[0].innerHTML)
							}
							})
							}
							else if(ui.draggable[0].innerHTML=="INSTALL" ||ui.draggable[0].innerHTML=="DERIG" )
							{
								add_item(group,group,time,ui.draggable[0].innerHTML,"red",7,ui.draggable[0].innerHTML)
							}
							else
							{
								add_item(group,$rootScope.filter_pieSelected,time,"placeholder","orange",1,"PROVISIONAL DATE")
							}
							
							function add_item(dropped_group,group,time,value,colour,days,type)
							{
									
									
									 console.log('add_item')
									 date_dropped=(moment(time).startOf('day')._d)
									
									 
									
									var id = ui.draggable[0].id
									var dateDroppedOn =time
									target_date = time
									_days=self.days(moment(time).startOf('day')._d,moment(time).add(days, 'days')._d)
									
									var event_to_add=	
									{
															id : id,
															name : value,
															showimage :"",
															image :"",
															start_date :moment(time).startOf('day').format("MMM Do"),
															end_date :moment(time).add(days, 'days').format("MMM Do"),
															notes  :"",
															days :_days
									}
									
									
									var new_date = 
									{
									
															content: self.event_html(event_to_add),
															name:value,
															group: group,
															dropped_group:dropped_group,
															date_logged: new Date(),	
															className:colour||"",
															_type:type,
															start_date: new Date(moment(date_dropped).startOf('day')._d),
															end_date: new Date (moment(date_dropped).add(days, 'days')._d),
															days:_days

									}
									
									console.log('save')
									
								
									
									var _timeline = new Timeline(new_date)
										.$save(function(_item) {
										

											new_date.start =_item.start_date
											new_date.end = _item.end_date
											new_date._id = _item._id
											new_date._type=_item._type,
											timeline.itemsData.getDataSet().add(new_date)
											
											setTimeout(function() {
												$(ui.draggable[0]).show()
												
											self.add_group_to_timeline(new_date)
											}, 1 * 500);

										});
							
							
							}
                        }



                    }
                })
				},
	  
	  unlock: function(unlock){
		
                        
								timeline.setOptions({'editable':unlock,'selectable': unlock });
								timeline.options.editable=true
			
							
		  	
	  
	  },
	
	   



   add_group_to_timeline: function(new_group){
//TO DO

				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get()
				
				_.some(list, function(lookup_group){
			
					if(new_group.dropped_group==lookup_group.id){
						console.log('copy this ',lookup_group)
						var _new_group=lookup_group
						_new_group.track=new_group.track
						//_new_group.id=new_group.group
						_new_group.content=new_group.content
						//list=list.concat(_new_group)
				
									
						return true;
					}
				})
			//timeline.setGroups(list);
			//this.enable_event_drop()	
			console.log('called by add_group_to_timeline')
				this.update_andCompile()
			
		
				},  
				
			   changeTracks: function(selection)
			   {
console.log('changeTracks selection',selection)
						var groups = new vis.DataSet($rootScope.groups);
						var group = new vis.DataSet( $rootScope.leave_groups);
						var list =groups.get({
								filter: function(item) {
									
									return (  selection.indexOf(item.track)!=-1);
								}
							})
							
						timeline.setGroups(list);
						console.log('called by changeTracks')
						this.update_andCompile()					
						this.enable_event_drop()
				
				},  
				
				changeGroups: function(selection)
				{

					var groups = new vis.DataSet($rootScope.groups);
					//var group = new vis.DataSet( $rootScope.leave_groups);
					var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.content)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},
  
  
  days: function (start,end){
  
				var a = moment(start);
				var b = moment(end);
				return b.diff(a,'days');
  
  },
  
  	
  
   		 event_html: function(event_to_add){
		 
		 
			var  id = event_to_add.id
		 	var  name = event_to_add.name
		 	var  showimage = event_to_add.showimage
		 	var  image = event_to_add.image
		 	var  start_date = event_to_add.start_date
		 	var  end_date = event_to_add.end_date
		 	var  notes  = event_to_add.notes ||""
		 	var  days = event_to_add.days
			var  description =event_to_add.description ||""

			 var  av=false,build=false,painting=false,objects =false,graphics =false
			 
			 _.each(event_to_add.install_features, function(feature){
			 
						if(feature.selected==true){
						
								if(feature.name=="av"){av=true}
								if(feature.name=="build"){build=true}
								if(feature.name=="painting"){painting=true}
								if(feature.name=="graphics"){graphics=true}
								if(feature.name=="objects"){objects=true}
					
						}
			 })
		 

		 
			var notes=notes ||""
			var image=image ||""
	
			var showimage=showimage ||""
			
			var htmlContent= "<timeline-databar     graphics='" + graphics + "' objects='" + objects + "'  painting='" + painting + "' build='" + build + "'  av='" + av + "'  description='" + description + "' description='" + description + "' id='" + id + "' name='" + name + "' image='" + image + "' showimage='" + showimage + "' startdate='" + start_date + "' enddate='" + end_date + "' notes='" + notes + "' days='" + days + "'></timeline-databar>"; //'<timeline-databar></timeline-databar>'
		
			return htmlContent

			},
			
		selected_data:	 function (event) {
				
							var self=this
							selected_timeline_id=event.items[0]
							 if(selected_timeline_id)
							 {
							 
										selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
										$rootScope.selected_timeline_id=selected_timeline_id
										$rootScope.selected_item=selected_item.name
										$rootScope.selected_type=selected_item._type
										
									
										
										
										_.each($rootScope.installmodels,  function(feature,i){
												$rootScope.installmodels[i].selected=false
										})
											
										if(selected_item.install_features){
										_.each(selected_item.install_features,  function(feature){
										if (feature.selected==true){
											console.log(feature.name + " is selected in the model")
												_.each($rootScope.installmodels,  function(_feature,i){
												console.log("checking " + _feature)
														if (_feature.name==feature.name){
															console.log($rootScope.installmodels[i].name + " is selected on the info box" +_feature.name)
															console.log("switching on " +$rootScope.installmodels[i] )
															$rootScope.installmodels[i].selected=true
														}
												})
										}
										})
										}
									
										
										
										
										
										
										if(selected_item.days>0)
										{
												$rootScope.selected_days=" - " +selected_item.days + " days"
										}
										$rootScope.selected_id=selected_item._id
										$rootScope.selected_notes=selected_item.notes
										$rootScope.selected_approved=selected_item.approved
										$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
							
							
							}
					

           },
		   
   get_events: function() {
      return $http.get('/assets/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	
	event_edited: function(scope){

	console.log('event_edited')
	
	//latest attempt to fix mem leak 
	//mooved from controller
	
	
			var self = this
	
			if( scope.locked.add_item){	
					date=$rootScope.datePicker.date
					days=self.days(moment(date.startDate),moment(date.endDate))
					scope.selected_start = moment(date.startDate ).format("MMM Do")
					scope.selected_end = moment(date.endDate).format("MMM Do")

					if(moment(date.startDate).isValid()){ //true
								
									var event_to_add=	{
														  id :  scope.selected_id,
														  name :scope.selected_item,
														  showimage :"",
														  image :"",
														  start_date :moment(date.startDate).format("MMM Do"),
														  end_date : moment(date.endDate).format("MMM Do")|| "",
														  notes  :$rootScope.selected_notes ,
														  approved  :$rootScope.selected_approved ,
														  days :days,
														  install_features:scope.installmodels
														}
				
					
					//THIS CAUSES A REFRESH OF THE TIMELINE DIRECTIVE (GOOD)
					html=self.event_html(event_to_add)
					var options={id:scope.selected_timeline_id,content:html,approved:$rootScope.selected_approved,notes:$rootScope.selected_note,start:moment(date.startDate)._d,end:moment(date.endDate)._d, install_features:scope.installmodels}
					self.timeline_track.update({
								id: scope.selected_id			
								}, options, function(){
								console.log('called by event_edited')
								self.updateItem(options)

								});
				
				}
				}
				else
				{
				console.log('timeline locked')
				}
	
	
	
	
	},
	
	
	
	
	
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
			if(timeline.itemsData){
				timeline.itemsData.getDataSet().update(options)
					console.log('called by updateItem')
				this.update_andCompile()
				
			}
		
		}
	
			
	},
	
    setup: function( Timeline,groups,dates,isloggedin) {
		
		var self=this
		

         var options = {
					min: new Date(2014, 0, 1),                // lower limit of visible range
					max: new Date(2022, 0, 1),                // upper limit of visible range
					zoomMin: 1000 * 60 * 60 * 24,             // one day in milliseconds
					zoomMax: 1000 * 60 * 60 * 24 * 31 * 500 ,    // about six months in milliseconds
                    width: '100%',
					maxHeight:"900px",
					moveable:true,
					itemsAlwaysDraggable:true,
					snap: function (date, scale, step) {
						return date;
							},
					stack:false,
					orientation:{"axis":"top"},
					selectable: true,  
                    editable: false,  
					groupOrder:'order',					
                    onMove: function(item, callback) {
					console.log('onmove called')
							$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}

							days=self.days(moment(item.start),moment(item.end))
							$rootScope.selected_days = days
							if(moment(item.start).isValid()){ //true
							
									
									var event_to_add=	{
									
															  id : item._id,
															  name : item.name,
															  showimage :"",
															  image :"",
															  group: item.group,
															  start_date : moment(item.start).startOf('day').format("MMM Do"),
															  end_date : moment(item.end).startOf('day').format("MMM Do"),
															  notes  :item.notes ,
															  days :days,
															   install_features:$rootScope.installmodels
															
														}
									

								//NB DIFFERENT IDS FOR Timeline and Timeline vis vs mongo
								html=self.event_html(event_to_add)
								var options={ id:item.id,
												group: item.group,
												content:html,
												notes:event_to_add.notes,
												start:moment(item.start)._d,
												end:moment(item.end)._d,
												start_date:moment(item.start)._d,
												end_date:moment(item.end)._d,
												install_features:$rootScope.installmodels
												}
								self.timeline_track.update({
								id:  item._id				
								}, options, function(){
								console.log('called by setup') 
								self.updateItem(options) });
								
								
								
								
								
								
								
									
								callback(item);
								
							}
							else
							{
							console.log('invalid date')
									callback(item);
								
							}
									
								

                    },
                    onUpdate: function(item, callback) {
					console.log('on update called')
                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                //callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
									if(moment(item.start).isValid()){ //true
										
									var event_to_add=	{
														  id : item.id,
														  name :value,
														  showimage :"",
														  image :"",
														  start_date :item.start,
														  end_date : item.end,
														  notes  :item.notes,
														  days :days													  
														}
										
										
									var _timeline = new self.timeline_track({
										content:  self.event_html(event_to_add),
										name: item.name,
										group: item.group,
										start_date: item.start,
										end_date: item.end,
										days:self.days(item.start,item.end)

									})
								   
								   self.timeline_track.update({
										id: item._id
									}, _timeline);
								   
									
										//$rootScope.timeline.itemsData.on("update", function(){
										
										var _options={id:item._id,content:self.event_html(event_to_add),start:moment(event_to_add.startDate)._d,end:moment(event_to_add.endDate)._d,start_date:moment(event_to_add.startDate)._d,end_date:moment(event_to_add.endDate)._d}
							console.log('called by event_edited')
										self.updateItem(_options, function(){
												console.log('called by onUpdate')
											self.update_andCompile()
										})									
										
										//})
										
									
									
									 callback(item);
							}
										else
										{
										console.log('invalid date')
										}							
                            } else {
                                callback(null); // cancel updating the item
                            }
                        });

                    },
                    onAdd: function(item, callback) {
console.log('on add called')

                        self.prettyPrompt('Add note', 'Add some notes to this date:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted new item
								
								days=self.days(item.start, moment(item.start).add(5, 'days'))
							


								
								var event_to_add=	{id : item.id,
													  name :value,
													  showimage :"",
													  image :"",
													  start_date :item.start,
													  end_date :  moment(item.start).add(5, 'days'),
													  notes  :"" ,
													 days :days}
													
                                var _timeline = new self.timeline_track({
                                        content: self.event_html(event_to_add),
										name:value,
										date_logged: new Date(),	
                                        group: item.group,
										_type:"note",
                                        start_date: item.start,
										 end_date:   moment(item.start).add(1, 'days'),
										className:"green"
                                       // end_date: moment(item.start).add(5, 'days'),
										//days:self.days(item.start, moment(item.start).add(5, 'days'))

                                    })
									    .$save(function(_item) {
                                    new_date.start =_item.start_date
                                    new_date.end = _item.end_date
                                    new_date._id = _item._id
									new_date._type=ui.draggable[0].innerHTML,
                                    timeline.itemsData.getDataSet().add(new_date)
									
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
										console.log('bread')
										
                                    }, 1 * 500);

                                });
					
                            } else {
                                callback(null); // cancel item creation
                            }
                        })


                    },
                    onRemove: function(item, callback) {

                        if (item._id) {
                            self.timeline_track.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };


  
  
		var self = this
		
			$("body").keydown(function(e) {
			 // e.preventDefault();
        //e.returnValue = false;
				  if(e.keyCode == 37) { // left
					move( 0.2);
				  }
				  else if(e.keyCode == 39) { // right
					move(-0.2); 
				  }
				  else if(e.keyCode == 38) { // right
					zoom(-0.2); 
				  }
				  else if(e.keyCode == 40) { // right
					zoom(0.2); 
					
					    return false;
				  }
				});
				
				

				 $rootScope.timeline.setOptions(options);
				 console.log('adding select event handler')
				 $rootScope.timeline.off('select').on('select', function (properties) {
						console.log('timeline selected')
						self.selected_data( properties)

				});
				
			   $rootScope.timeline.setItems(dates);
				//$rootScope.timeline.fit()
				
				
				
							
			move=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   - interval * percentage
				});
			}

  
			zoom=function(percentage) {
				var range = this.timeline.getWindow();
				var interval = range.end - range.start;
				this.timeline.setWindow({
					start: range.start.valueOf() - interval * percentage,
					end:   range.end.valueOf()   + interval * percentage
				});
			}

			// attach events to the navigation buttons
			zoomIn=function () { this.zoom(-0.2); }
			zoomOut=function () {  this.zoom( 0.2); }
			moveLeft=function () {  this.move( 0.2); }
			moveRight=function () {  this.move(-0.2); }

                dates.on('*', function(event, properties) {
				//event.preventDefault()
                   // self.logEvent(event, properties);
                });

			
			self.enable_event_drop()
			$compile($("timeline-databar"))($rootScope);

			
              
    }
	 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],94:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_shopify_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
		 /*
		 'https://www.googleapis.com/calendar/v3/calendars/en.uk#holiday@group.v.calendar.google.com/events?key=AIzaSyDi8arJr4JvnETpZVylXUVpxZDyBHNkQyk';
				  */
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("Shopify product types")==-1){
												$rootScope.added_track_groups.push("Shopify product types")														
													$rootScope.track_groups.push({"track":"Shopify product types"})
													}
												//console.log('shop products',eventss)
												$.each(eventss, function( index, event ) {	
													//console.log('shop event',event)
												
															scale_class="";	
												
										
												var val_1 = 0
												var val_2 =2
												var val_3 =4
												var val_4 =6
												var val_5 =8
												var val_6  = 10
												var val_7 = 20
												var val_8 = 30
												var val_9 = 40												
												var val_10 = 50
												
												var count = "count"
												

												if(event[count] >val_1 && event[count]<=val_2){scale_class="scale_01"}												
												if(event[count] >val_2 && event[count]<=val_3){scale_class="scale_02"}												
												if(event[count] >val_3 && event[count]<=val_4){scale_class="scale_03"}											
												if(event[count] >val_4 && event[count]<=val_5){scale_class="scale_05"}
												if(event[count] >val_5 && event[count]<=val_6){scale_class="scale_06"}												
												if(event[count] >val_6 && event[count]<=val_7){scale_class="scale_07"}												
												if(event[count] >val_7 &&event[count]<=val_8){scale_class="scale_08"}
												if(event[count] >val_8 && event[count]<=val_9){scale_class="scale_09"}
												if(event[count] >val_9 && event[count]<=val_10){scale_class="scale_09"}
												if(event[count] >val_10){scale_class="scale_10"}
																						
													
													
													
																
																	var start_date=new Date(event._id.month+"/"+event._id.day+"/"+event._id.year)
																	var end_date=new Date(start_date)
																	end_date.setDate( end_date.getDate() + 1);
																
																
																var shopEvent =  {content:"",
																			title:event.count  ,
																			name:event.count  ,
																			group:event._id.type,
																			track:"Shopify product types",
																			order: "Shopify product types",
																			className:scale_class,
																			start:start_date,
																			end:end_date
																		}
																		
														visevents.add( shopEvent)
																		
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-shopify-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],95:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_visitor_figures_functions =  function ($http,Timeline,$rootScope) {


  return {
  
     get_events: function() {
		 
	
				  
		 	 var SheetToJSONServiceURL = "http://emudev-app1/team/digital/projects/scripts/php/emu/loans.php?start_date=2014-01-01"
			 
			 
			 console.log(SheetToJSONServiceURL)
			 
      return $http.get(SheetToJSONServiceURL);  //1. this returns promise
    },
  
  
  
  	add_events: function (eventss, fn){
	
								
									var visevents = new vis.DataSet();
									var self=this
										
												
												tempdates=[]
											if( 	$rootScope.added_track_groups.indexOf("visitor figures")==-1){
												$rootScope.added_track_groups.push("visitor figures")														
													$rootScope.track_groups.push({"track":"visitor figures"})
													}
												//console.log('visitor figures',eventss)
												$.each(eventss, function( index, event ) {	
													//console.log('visitor figures',event)
												
															scale_class="";	
												
										
												var val_1 = 0
												var val_2 =100
												var val_3 =200
												var val_4 =300
												var val_5 =400
												var val_6  = 500
												var val_7 = 1000
												var val_8 = 2000
												var val_9 = 3000												
												var val_10 = 4000
												
												var count = "value"
												

												if(event[count] >val_1 && event[count]<=val_2){scale_class="scale_01"}												
												if(event[count] >val_2 && event[count]<=val_3){scale_class="scale_02"}												
												if(event[count] >val_3 && event[count]<=val_4){scale_class="scale_03"}											
												if(event[count] >val_4 && event[count]<=val_5){scale_class="scale_05"}
												if(event[count] >val_5 && event[count]<=val_6){scale_class="scale_06"}												
												if(event[count] >val_6 && event[count]<=val_7){scale_class="scale_07"}												
												if(event[count] >val_7 &&event[count]<=val_8){scale_class="scale_08"}
												if(event[count] >val_8 && event[count]<=val_9){scale_class="scale_09"}
												if(event[count] >val_9 && event[count]<=val_10){scale_class="scale_09"}
												if(event[count] >val_10){scale_class="scale_10"}
																						
													
													
													
																
																	var start_date=new Date(event.date_value)
																	var end_date=new Date(start_date)
																	end_date.setDate( end_date.getDate() + 1);
																
																
																var shopEvent =  {content:"",
																			title:"visitor count "+event.value  ,
																			name:event.museum_id+ " visitors"  ,
																			group:event.museum_id,
																			track:"visitor figures",
																			order: "museum",
																			className:scale_class,
																			start:start_date,
																			end:end_date
																		}
//console.log('shopEvent',shopEvent)																		
														visevents.add( shopEvent)
																		
															
																	
												})
														
														
													
													
										  					
										
										return	fn(visevents)

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																htmlContent+=name
																htmlContent+='</div>';
																htmlContent+="<span> ";
																htmlContent+=start_date+ "-" + end_date;
																htmlContent+="<span>";
																htmlContent+="<p>"+notes
																
																if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}													
													htmlContent+= '</div>'
													
			return htmlContent

			},
  
	
	updateOptions: function(options){

		timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		options.id=$rootScope.selected_t_id
		timeline.itemsData.getDataSet().update(options)
		
				
	},
	
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-visitor-figures-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],96:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.turnstiles_controller = function(log_messages,$scope, AuthService,$http, $q, $routeParams, $location,$rootScope, turnstile_app
    ) {
	

$scope.operation_in_progress=false
$scope.settings=[]
$scope.test_ticket=""
 $scope.venue =$routeParams.venue
$scope.settings.venue=$routeParams.venue
$scope.command="G2:01"


$scope.open_turnstile = function(){
$scope.settings.ticket=$scope.test_ticket
$scope.settings.venue=$scope.venue
$scope.settings.command=$scope.command

			$scope.operation_in_progress=true
			turnstile_app.openGates($scope.settings,function(team){
			$scope.operation_in_progress=false
		})
}


				
	}


exports.turnstiles_buttons = function(log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
$scope.report_running=true
  $scope.title1 = 'Button';
  $scope.title4 = 'Warn';
  $scope.isDisabled = true;

  $scope.googleUrl = 'http://google.com';
  $scope.messages=[]
  
  


	log_messages.query({}, function(messages) {

})

}


exports.turnstiles_test = function(turnstile_app,check_com_port,check_ticket_database,check_ticket_file,shopify_app_test,log_messages,$scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
	
$scope.test_results = []
$scope.settings=[]




	
		$scope.gridOptions=[]
		
		$scope.gridOptions.columnDefs = [   ]
		$scope.gridOptions = {
			columnDefs: [
			{ field: 'test' },
			{ field: 'result',type:'text' },
			{ field: 'notes',type:'text'}
			],
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: true,
			enableCellEditOnFocus: true,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			data:$scope.test_results,
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			$scope.gridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

			});
			}
		};
		
			//TEST SHOPIFY CONNECTION
			var options = []
			options[0]=[]
			options[0].shop="MSHED"
			options[1]=[]
			options[1].shop="BMAG"
		var i=0
			_.each(options, function(option) {
			i++
			test_result = {test:i+'/6: connect to '+option.shop+' shopify',result:'FAIL'}
			shopify_app_test.query(option, function(result) {
				test_result={test:i+'/6: connect to '+option.shop+' shopify',result:'OK',notes:result.count +" orders found"}	
				i++
				if(result.count>0){
					$scope.test_results.push(test_result	)
				}
			}, function( error ){
					test_result = {test:i+'/6: connect to '+option.shop+' shopify',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			})
			
			test_result = {test:'3/6: connect to ticket file',result:'FAIL'}
			check_ticket_file.query({}, function(result) {
			
				//if(result.count>0){
				test_result={test:'3/6:connect to ticket file',result:'OK',notes:result.count +" tickets found"}
					$scope.test_results.push(test_result)
				//}
			}, function( error ){
					test_result = {test:'2/6:connect to ticket file',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			
			test_result = {test:'3/6:connect to ticket database',result:'FAIL'}
			check_ticket_database.query({},function(result) {
			
				
				test_result={test:'4/6: connect to ticket database',result:'OK',notes:result}
				$scope.test_results.push(test_result)
				
			},
				  //error
				  function( error ){
					test_result = {test:'4/6: connect to ticket database',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					})
			
			
			check_com_port.query({},
				  function( value ){	
					test_result = {test:'5/6: can open COM port',result:'OK'}
					$scope.test_results.push(test_result)
					},
				  //error
				  function( error ){
					test_result = {test:'5/6: can open COM port',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					}
				  
			   )
			  $scope.settings.command="test"
			   $scope.settings.ticket=""
			  turnstile_app.openGates($scope.settings,
				  function( value ){	
					test_result = {test:'6/6: can send OPEN command',result:'OK',notes:value}
					$scope.settings.command="G2:01"
					$scope.test_results.push(test_result)
					},
				  //error
				  function( error ){
					test_result = {test:'6/6: can send OPEN command',result:'FAIL',notes:error}
					$scope.test_results.push(test_result)
					}
				  
			   )
					
	

}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/turnstiles/turnstiles-controller.js","/../components/turnstiles")
},{"b55mWE":4,"buffer":3}],97:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.turnstilesController = function() {
  return {
   controller: 'turnstiles_controller',
    templateUrl: './components/turnstiles/turnstiles-page.html'
  }
	}
	
	
		exports.turnstilesButtons = function() {
  return {
   controller: 'turnstiles_buttons',
    templateUrl: './components/turnstiles/turnstiles-buttons.html'
  }
	}
	
			exports.turnstilesTest = function() {
  return {
   controller: 'turnstiles_test',
    templateUrl: './components/turnstiles/turnstiles-test.html'
  }
	}
	
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/turnstiles/turnstiles-directive.js","/../components/turnstiles")
},{"b55mWE":4,"buffer":3}],98:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.users_controller = function($route,$scope, $http, $q, $routeParams, $location,$rootScope, Team
    ) {
		
		
		
		
	console.log('controller go')
	console.log($route.routes)
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		var columnDefs= []
		

	


		 columnDefs.push(
			{ field: 'username' ,resizable: true},
			//{ field: 'password' ,resizable: true},
			{ field: 'email' ,resizable: true},
			{ field: 'firstName' ,resizable: true},
			{ field: 'lastName' ,resizable: true},
			{ field: 'team' ,resizable: true},
			{ field: 'group' ,resizable: true},
			{ field: 'add_rooms' ,  allowCellFocus: true, type: 'boolean',value: "add_rooms",resizable: true,visible:true,width:"100"},
			{ field: 'add_equipment' ,  allowCellFocus: true, type: 'boolean',value: "add_equipment",resizable: true,visible:true,width:"100"},
			{ field: 'add_room_bookings' ,  allowCellFocus: true, type: 'boolean',value: "add_room_bookings",resizable: true,visible:true,width:"100"},
			
			{ field: 'approve_room_bookings' ,  allowCellFocus: true, type: 'boolean',value: "approve_room_bookings",resizable: true,visible:true,width:"100"},
			{ field: 'approve_equipment_bookings' ,  allowCellFocus: true, type: 'boolean',value: "approve_equipment_bookings",resizable: true,visible:true,width:"100"},
			{ field: 'add_equipment_bookings' ,  allowCellFocus: true, type: 'boolean',value: "add_equipment_bookings",resizable: true,visible:true,width:"100"}
	
			)
			
			$scope.gridOptions = {
			columnDefs:columnDefs,
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: true,
			enableCellEditOnFocus: true,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			vm.gridApi = gridApi;
			},
			pagingOptions: { // no more in v3.0.+, use paginationPageSizes, paginationPageSize
			// pageSizes: list of available page sizes.
			pageSizes: [250, 500, 1000], 
			//pageSize: currently selected page size. 
			pageSize: 250,
			//totalServerItems: Total items are on the server. 
			totalServerItems: 0,
			//currentPage: the uhm... current page.
			currentPage: 1
			},
			exporterPdfDefaultStyle: {fontSize: 9},
			exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
			exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
			exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
			exporterPdfFooter: function ( currentPage, pageCount ) {
			return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
			},
			exporterPdfCustomFormatter: function ( docDefinition ) {
			docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
			docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
			return docDefinition;
			},exporterPdfOrientation: 'portrait',
			exporterPdfPageSize: 'LETTER',
			exporterPdfMaxGridWidth: 500,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	    onRegisterApi: function(gridApi){
      $scope.gridApi = gridApi;
	    gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post

			var myArray = []
			var key = colDef.field;
			var obj = {};
			obj[key] = newValue;
			myArray.push(obj);
				var query = {'id':rowEntity._id};
						Team.update(query, 	obj
								
								, function(err, affected, resp) {


								
								
						})
			  });
				},
		};

		 console.log('getData')	
			Team.query({}, function(team) {
				$scope.rows=[]
				$scope._rows=[]
				_.each(team,function(row){
					console.log(row)
					$scope._rows.push(row)
					/*
					for (var key in teamx[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
					*/
					
							
				})
			
			$scope.gridOptions.data=$scope._rows;
		})	
}				








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/user-admin/users-controller.js","/../components/user-admin")
},{"b55mWE":4,"buffer":3}],99:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.userAdmin = function() {
  return {
   controller: 'users_controller',
    templateUrl: './components/user-admin/users-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/user-admin/users-directive.js","/../components/user-admin")
},{"b55mWE":4,"buffer":3}],100:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.ProductDetailsController = function($location, $scope, $routeParams, $http) {

  var encoped = encodeURIComponent($routeParams.id);
  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      $scope.product = data.product;
    });
  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};


exports.RadioController = function($location, $scope, $routeParams, $http) {

  $scope.formData = {};
   $scope.monthWeek = "month"
};




}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/controllers.js","/controllers")
},{"b55mWE":4,"buffer":3}],101:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	
exports.NavController = function($location,AuthService,$scope,$http) {

  $scope.user="not logged in"
  $scope.$location = $location;
 function sortFunction(a, b) {
    if (a.value === b.value) {
        return 0;
    }
    else {
        return (a.value < b.value) ? -1 : 1;
    }
}

default_permissions = [{
						add_rooms:false,
						add_equipment:false,
						approve_room_bookings:false,
						approve_equipment_bookings:false
						
						}
						]







$scope.user_groups = []
$scope.user_groups['AV']=[]
$scope.user_groups['ADMIN']=[]
$scope.user_groups['RETAIL']=[]
$scope.user_groups['DIGITAL']=[]
$scope.user_groups['STAFF']=[]
$scope.user_groups['DEFAULT']=[]
$scope.user_groups['DEVELOPMENT']=[]	   
$scope.user_groups['LEARNING']=[]	
$scope.user_groups['EXHIBITIONS']=[]	
$scope.user_groups['OPERATIONS']=[]
$scope.user_groups['COMMERCIAL']=[]
	
var timeline = {link:"timeline",value:"Timeline"}
var dead ={link:"dead",value:"Downtime"}
var activity = {link:"activity",value:"Machine Activity"}
var feedback = {link:"feedback",value:"Kiosk feedback"}
var tech_support = {link:"tech-support",value:"Tech-support"}
var shopify = {link:"shopify_app",value:"Shopify"}
var users = {link:"users",value:"ADMIN: Users"}
var doom = {link:"doom",value:"DOOM!"}

var analyser = {link:"analyser",value:"Performance analyser (BETA)"}


var rooms = {link:"rooms",value:"Add rooms"}
var equipment = {link:"equipment",value:"Add equipment"}
var equipment_bookings = {link:"bookings/equipment",value:"Equipment booking"}
var room_bookings = {link:"bookings/rooms",value:"Room booking"}
var room_hire = {link:"room-hire",value:"Room booking timeline"}
var equipment_booking_timeline = {link:"equipment-timeline",value:"Equipment booking timeline"}



var performance = {link:"record-visitor-numbers",value:"VISITS: Record visitor figures"}
var record_retail_sales = {link:"record-retail-sales",value:"RETAIL:Record retail sales"}
var raw_retail_sales = {link:"raw-retail-sales",value:"RETAIL:Raw retail sales"}
var monthly_retail_sales = {link:"monthly-retail-sales",value:"RETAIL: Monthly retail sales"}



var record_donations = {link:"record-donations",value:"DONATIONS: Record donations"}
var donations = {link:"raw-donations",value:"DONATIONS: Raw donation data"}
var monthly_donations = {link:"monthly-donations",value:"DONATIONS: Monthly donations"}

var record_operations = {link:"record-operations",value:"OPERATIONS: Record operations"}
var operations = {link:"raw-operations",value:"OPERATIONS: Raw operations data"}
var monthly_operations = {link:"monthly-operations",value:"OPERATIONS: Monthly operations"}

var record_events = {link:"record-events",value:"EVENTS: Record events"}
var events = {link:"raw-events",value:"EVENTS: Raw events data"}
var monthly_events = {link:"monthly-events",value:"EVENTS: Monthly events"}

var record_teg = {link:"record-teg",value:"EXHIBITIONS: Record TEG figures"}
var teg = {link:"raw-teg",value:"EXHIBITIONS: Raw TEG figures"}
var monthly_teg = {link:"monthly-teg",value:"EXHIBITIONS: Monthly TEG figures"}

 var record_exhibitions_pwyt = {link:"record-exhibitions-pwyt",value:"EXHIBITIONS: Record Pay What you think"}
 var exhibitions_pwyt_monthly = {link:"monthly-exhibitions-pwyt",value:"EXHIBITIONS: Monthly Pay What you think"}
 var raw_exhibitions_pwyt = {link:"raw-exhibitions-pwyt",value:"EXHIBITIONS: Pay What you think data"}
  var exhibitions_summary = {link:"exhibitions-summary",value:"EXHIBITIONS: summary"}
 
 
 var record_learning = {link:"record-learning",value:"LEARNING: Record learning"}
var learning = {link:"raw-learning",value:"LEARNING:Raw learning data"}
var monthly_learning = {link:"monthly-learning",value:"LEARNING:Monthly learning"}

 
var raw_visits = {link:"raw-visits",value:"VISITS: Raw visits data"}
var monthly_visits = {link:"monthly-visits",value:"VISITS:Monthly visits"}



var record_giftaid = {link:"record-giftaid",value:"DONATIONS: Record gift aid"}
var raw_giftaid = {link:"raw-giftaid",value:"DONATIONS: Raw gift aid"}
var monthly_giftaid = {link:"monthly-giftaid",value:"DONATIONS: Monthly gift aid"}

var raw_turnstiles = {link:"raw-turnstiles",value:"EXHIBITIONS: turnstiles raw data"}
var monthly_turnstiles = {link:"monthly-turnstiles",value:"EXHIBITIONS: turnstiles Monthly"}

var record_welcomedesk = {link:"record-welcomedesk",value:"DONATIONS: Record Welcome desk"}
var raw_welcomedesk = {link:"raw-welcomedesk",value:"DONATIONS: Raw Welcome desk"}
var monthly_welcomedesk = {link:"monthly-welcomedesk",value:"DONATIONS: Monthly Welcome desk"}







var resources=[]

resources.push(rooms)
resources.push(equipment)
resources.push(equipment_bookings)
resources.push(room_bookings)
resources.push(room_hire)
resources.push(equipment_booking_timeline)



var performance_data=[]
performance_data.push(room_hire)

$scope.user_groups['COMMERCIAL'].views=[]
$scope.user_groups['COMMERCIAL'].enter_data=[]
$scope.user_groups['COMMERCIAL'].resources=[]
$scope.user_groups['COMMERCIAL'].permissions=default_permissions

$scope.user_groups['COMMERCIAL'].resources=resources
$scope.user_groups['COMMERCIAL'].performance=performance_data




var enter_data=[]
//enter_data.push(performance)
//enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_events)




var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
//performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
//performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(monthly_welcomedesk)
performance_data.push(raw_welcomedesk)

performance_data.push(events)
performance_data.push(monthly_events)

$scope.user_groups['DEVELOPMENT'].permissions=default_permissions
$scope.user_groups['DEVELOPMENT'].views=[]
$scope.user_groups['DEVELOPMENT'].enter_data=[]
$scope.user_groups['DEVELOPMENT'].resources=[]


$scope.user_groups['DEVELOPMENT'].views.push(timeline)
$scope.user_groups['DEVELOPMENT'].views.push(analyser)



$scope.user_groups['DEVELOPMENT'].enter_data=enter_data
$scope.user_groups['DEVELOPMENT'].performance=performance_data




 
var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(raw_welcomedesk)
performance_data.push(monthly_welcomedesk)

performance_data.push(learning)
performance_data.push(monthly_learning)

performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_summary)



performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)

performance_data=performance_data.sort()


$scope.user_groups['ADMIN'].views=[]
$scope.user_groups['ADMIN'].enter_data=[]
$scope.user_groups['ADMIN'].resources=[]
$scope.user_groups['ADMIN'].permissions=default_permissions



$scope.user_groups['ADMIN'].views.push(room_hire)
$scope.user_groups['ADMIN'].views.push(timeline)
$scope.user_groups['ADMIN'].views.push(analyser)
$scope.user_groups['ADMIN'].views.push(dead)
$scope.user_groups['ADMIN'].views.push(activity)
$scope.user_groups['ADMIN'].views.push(feedback)
$scope.user_groups['ADMIN'].views.push(tech_support)
$scope.user_groups['ADMIN'].views.push(shopify)
$scope.user_groups['ADMIN'].views.push(users)

$scope.user_groups['ADMIN'].enter_data=enter_data
$scope.user_groups['ADMIN'].performance=performance_data
$scope.user_groups['ADMIN'].resources=resources

var enter_data=[]

enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(monthly_learning)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(exhibitions_summary)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)

$scope.user_groups['EXHIBITIONS'].views=[]
$scope.user_groups['EXHIBITIONS'].enter_data=[]
$scope.user_groups['EXHIBITIONS'].resources=[]
$scope.user_groups['EXHIBITIONS'].permissions=default_permissions



$scope.user_groups['EXHIBITIONS'].views.push(timeline)
$scope.user_groups['EXHIBITIONS'].views.push(analyser)
$scope.user_groups['EXHIBITIONS'].performance=performance_data
$scope.user_groups['EXHIBITIONS'].views.push(room_hire)
$scope.user_groups['EXHIBITIONS'].resources=resources


var enter_data=[]
enter_data.push(record_learning)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(raw_visits)


performance_data.push(learning)
performance_data.push(monthly_learning)
performance_data.push(events)
performance_data.push(monthly_events)



$scope.user_groups['LEARNING'].views=[]
$scope.user_groups['LEARNING'].enter_data=[]
$scope.user_groups['LEARNING'].resources=[]
$scope.user_groups['LEARNING'].permissions=default_permissions

$scope.user_groups['LEARNING'].views.push(timeline)
$scope.user_groups['LEARNING'].views.push(analyser)

$scope.user_groups['LEARNING'].enter_data=enter_data
$scope.user_groups['LEARNING'].performance=performance_data
$scope.user_groups['LEARNING'].views.push(room_hire)

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_welcomedesk)
enter_data.push(record_learning)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_teg)
enter_data.push(record_events)
enter_data.push(record_operations)


enter_data=enter_data.sort()

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)

performance_data.push(teg)
performance_data.push(monthly_teg)
performance_data.push(events)

performance_data=performance_data.sort()


$scope.user_groups['AV'].views=[]
$scope.user_groups['AV'].enter_data=[]
$scope.user_groups['AV'].resources=[]

$scope.user_groups['AV'].views.push(room_hire)
$scope.user_groups['AV'].views.push(timeline)
$scope.user_groups['AV'].views.push(analyser)
$scope.user_groups['AV'].views.push(dead)
$scope.user_groups['AV'].views.push(activity)
$scope.user_groups['AV'].views.push(feedback)
$scope.user_groups['AV'].views.push(tech_support)


$scope.user_groups['AV'].enter_data=enter_data
$scope.user_groups['AV'].performance=performance_data
$scope.user_groups['AV'].resources=resources
$scope.user_groups['AV'].permissions= [	]


var enter_data=[]
enter_data.push(performance)
enter_data.push(record_retail_sales)
enter_data.push(record_donations)
enter_data.push(record_giftaid)
enter_data.push(record_events)


var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)
performance_data.push(raw_turnstiles)
performance_data.push(monthly_turnstiles)
performance_data.push(raw_giftaid)
performance_data.push(monthly_giftaid)
performance_data.push(monthly_donations)
performance_data.push(donations)
performance_data.push(monthly_welcomedesk)
performance_data.push(events)
performance_data.push(monthly_events)





$scope.user_groups['DIGITAL'].views=[]
$scope.user_groups['DIGITAL'].enter_data=[]
$scope.user_groups['DIGITAL'].resources=[]
$scope.user_groups['DIGITAL'].permissions=default_permissions

$scope.user_groups['DIGITAL'].views.push(timeline)
$scope.user_groups['DIGITAL'].views.push(analyser)
$scope.user_groups['DIGITAL'].views.push(dead)
$scope.user_groups['DIGITAL'].views.push(activity)
$scope.user_groups['DIGITAL'].views.push(tech_support)
$scope.user_groups['DIGITAL'].views.push(shopify)

$scope.user_groups['DIGITAL'].enter_data=enter_data
$scope.user_groups['DIGITAL'].performance=performance_data
$scope.user_groups['DIGITAL'].resources=[]
$scope.user_groups['DIGITAL'].resources=resources

var performance_data=[]
 var enter_data=[]
  


$scope.user_groups['DEFAULT'].views=[]
$scope.user_groups['DEFAULT'].enter_data=[]
$scope.user_groups['DEFAULT'].resources=[]
$scope.user_groups['DEFAULT'].permissions=default_permissions

$scope.user_groups['DEFAULT'].views.push(timeline) 
$scope.user_groups['DEFAULT'].views.push(analyser)
$scope.user_groups['DEFAULT'].views.push(monthly_visits)
$scope.user_groups['DEFAULT'].views.push(monthly_turnstiles) 
$scope.user_groups['DEFAULT'].performance=performance_data
$scope.user_groups['DEFAULT'].enter_data=enter_data

var enter_data=[]
enter_data.push(performance)
enter_data.push(record_exhibitions_pwyt)
enter_data.push(record_events)
enter_data.push(record_teg)


performance_data.push(teg)

var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)


$scope.user_groups['STAFF'].views=[]
$scope.user_groups['STAFF'].enter_data=[]
$scope.user_groups['STAFF'].resources=[]
$scope.user_groups['STAFF'].permissions=default_permissions


$scope.user_groups['STAFF'].views.push(timeline) 
$scope.user_groups['STAFF'].views.push(analyser) 


$scope.user_groups['STAFF'].enter_data=enter_data
$scope.user_groups['STAFF'].performance=performance_data





var performance_data=[]
performance_data.push(raw_visits)
performance_data.push(monthly_visits)
performance_data.push(monthly_retail_sales)
performance_data.push(monthly_turnstiles)
performance_data.push(monthly_donations)
performance_data.push(raw_exhibitions_pwyt)
performance_data.push(exhibitions_pwyt_monthly)
performance_data.push(monthly_teg)
performance_data.push(events)
performance_data.push(monthly_events)
performance_data.push(operations)
performance_data.push(monthly_operations)
performance_data.push(monthly_welcomedesk)


enter_data.push(record_teg)
enter_data.push(record_operations)
enter_data.push(record_exhibitions_pwyt)

$scope.user_groups['OPERATIONS'].views=[]
$scope.user_groups['OPERATIONS'].enter_data=[]
$scope.user_groups['OPERATIONS'].resources=[]
$scope.user_groups['OPERATIONS'].permissions=default_permissions

$scope.user_groups['OPERATIONS'].views.push(timeline) 
$scope.user_groups['OPERATIONS'].views.push(room_hire) 
$scope.user_groups['OPERATIONS'].views.push(analyser) 

$scope.user_groups['OPERATIONS'].enter_data=enter_data
$scope.user_groups['OPERATIONS'].performance=performance_data

$scope.user_groups['OPERATIONS'].resources=[]
$scope.user_groups['OPERATIONS'].resources=resources







var enter_data=[]
enter_data.push(record_retail_sales)
enter_data.push(record_events)

var performance_data=[]
performance_data.push(monthly_visits)
performance_data.push(raw_retail_sales)
performance_data.push(monthly_retail_sales)



$scope.user_groups['RETAIL'].views=[]
$scope.user_groups['RETAIL'].enter_data=[]
$scope.user_groups['RETAIL'].resources=[]
$scope.user_groups['RETAIL'].performance=[]
$scope.user_groups['RETAIL'].permissions=default_permissions

$scope.user_groups['RETAIL'].views.push(timeline)

$scope.user_groups['RETAIL'].enter_data=enter_data
$scope.user_groups['RETAIL'].performance=performance_data
	  
	  
  AuthService.isLoggedIn().then(function(user){
	 
	  if(user.data.group){
		 // console.log("user",user.data)
		
		
		user.data.permissions= $scope.user_groups[user.data.group].permissions  
		user.data.views= $scope.user_groups[user.data.group].views
		user.data.views=user.data.views.sort(sortFunction);
		
		user.data.resources= $scope.user_groups[user.data.group].resources
	    user.data.resources= user.data.resources.sort(sortFunction);
	   
	   
		
	   user.data.performance= $scope.user_groups[user.data.group].performance
	   user.data.performance= user.data.performance.sort(sortFunction);
	   
	   user.data.enter_data= $scope.user_groups[user.data.group].enter_data	   
	   user.data.enter_data=user.data.enter_data.sort(sortFunction);
	  
	  if(user.data.lastName.toLowerCase()=="pace"){
		  
		 user.data.views.push(doom)
	  }
	  
	  }
	  else{
		user.data.views= $scope.user_groups['DEFAULT'].views  
		  
	  }
	//  console.log(user)
	  $scope.user=(user.data)
  
  })
 
  
  
  
       
    
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/navbar-controller.js","/controllers")
},{"b55mWE":4,"buffer":3}],102:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

	exports.userMenu = function() {
  return {
    controller: 'NavController',
    templateUrl: './shared/templates/user_menu.html'
  }
	}
	
	
		exports.optionSelect = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/option_select.html'
  }
	}
	exports.radioSelect = function() {
  return {
   controller: 'RadioController',
    templateUrl: './shared/templates/radio_select.html'
  }
	}
	
	
		exports.optionSelect2 = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/option_select2.html'
  }
	}



	exports.checkBox = function() {
  return {
   // controller: 'NavController',
    templateUrl: './shared/templates/checkbox.html',
	 replace: true,
        scope: {
            ngModel : '='
			
        },
  }
	}
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/directives/directives.js","/directives")
},{"b55mWE":4,"buffer":3}],103:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';
/* app */
var underscore = angular.module('underscore', []);
var _ = require('underscore');


underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
 
 
var controllers = require('../shared/controllers/controllers');
var dead_controllers = require('../components/machine-monitor/dead-controller');

var nav_controller = require('../shared/controllers/navbar-controller');
var tech_support_controller = require('../components/tech-support/tech-support-controller');


//RESOURCE BOOKING
var  rooms_controller = require('../components/resource-bookings/rooms/raw-rooms-controller');
var  record_rooms_controller = require('../components/resource-bookings/rooms/form-controller');
var  equipment_controller = require('../components/resource-bookings/equipment/raw-equipment-controller');
var  record_equipment_controller = require('../components/resource-bookings/equipment/form-controller');
var  record_bookings_controller = require('../components/resource-bookings/bookings/form-controller');
var  bookings_controller = require('../components/resource-bookings/bookings/raw-bookings-controller');
var  timeline_bookings_services = require('../components/timeline/timeline-bookings-services');
var  timeline_functions_resources = require('../components/resource-bookings/timeline-resources-services');
var  timeline_resources_controller = require('../components/resource-bookings/timeline-resources-controller');








var dashboard_controllers = require('../components/machine-monitor/dashboard-controller');
var feedback_controllers = require('../components/machine-monitor/feedback-controller');
var satisfaction_controllers = require('../components/machine-monitor/satisfaction-controller');


var downtime_controllers = require('../components/machine-monitor/downtime-controller');


var performance_dashboard_controllers = require('../components/performance/dashboard-controllers');

var analyser_controller = require('../components/performance/analyser/analyser-controller');

var raw_visitor_numbers_controller = require('../components/performance/visits/raw-visits-controller');
var monthly_visitor_numbers_controller = require('../components/performance/visits/monthly-visits-controller');
var yearly_visitor_numbers_controller = require('../components/performance/visits/yearly-visits-controller');
var raw_turnstiles_controller = require('../components/performance/turnstiles/raw-turnstiles-controller');
var monthly_turnstiles_controller = require('../components/performance/turnstiles/monthly-turnstiles-controller');


var yearly_retail_sales_controller = require('../components/performance/retail/yearly-retail-sales-controller');
var monthly_retail_sales_controller = require('../components/performance/retail/monthly-retail-sales-controller');
var raw_retail_sales_controller = require('../components/performance/retail/raw-retail-sales-controller');

var yearly_donations_controller = require('../components/performance/donations/yearly-donations-controller');
var monthly_donations_controller = require('../components/performance/donations/monthly-donations-controller');
var raw_donations_controller = require('../components/performance/donations/raw-donations-controller');
var donations_performance_form = require('../components/performance/donations/performance-form-controller');


var yearly_operations_controller = require('../components/performance/operations/yearly-operations-controller');
var monthly_operationss_controller = require('../components/performance/operations/monthly-operations-controller');
var raw_operations_controller = require('../components/performance/operations/raw-operations-controller');
var operations_performance_form = require('../components/performance/operations/performance-form-controller');



var monthly_exhibitions_pwyt_controller = require('../components/performance/exhibitions-pwyt/monthly-donations-controller');
var raw_exhibitions_pwyt_controller = require('../components/performance/exhibitions-pwyt/raw-donations-controller');
var exhibitions_pwyt_performance_form = require('../components/performance/exhibitions-pwyt/performance-form-controller');

var monthly_giftaid_controller = require('../components/performance/gift-aid/monthly-giftaid-controller');
var monthly_all_giftaid_controller = require('../components/performance/gift-aid/monthly-allgiftaid-controller');
var raw_giftaid_controller = require('../components/performance/gift-aid/raw-giftaid-controller');
var giftaid_performance_form = require('../components/performance/gift-aid/performance-form-controller');

var yearly_welcomedesk_controller = require('../components/performance/welcome-desk/yearly-welcomedesk-controller');
var monthly_welcomedesk_controller = require('../components/performance/welcome-desk/monthly-welcomedesk-controller');
var raw_welcomedesk_controller = require('../components/performance/welcome-desk/raw-welcomedesk-controller');
var welcomedesk_performance_form = require('../components/performance/welcome-desk/performance-form-controller');

var yearly_events_controller = require('../components/performance/events/yearly-events-controller');
var monthly_events_controller = require('../components/performance/events/monthly-events-controller');
var raw_events_controller = require('../components/performance/events/raw-events-controller');
var events_performance_form = require('../components/performance/events/performance-form-controller');


var yearly_teg_controller = require('../components/performance/gallery-visits/yearly-teg-controller');
var weekly_teg_controller = require('../components/performance/gallery-visits/weekly-teg-controller');
var monthly_teg_controller = require('../components/performance/gallery-visits/monthly-teg-controller');
var raw_teg_controller = require('../components/performance/gallery-visits/raw-teg-controller');
var teg_performance_form = require('../components/performance/gallery-visits/performance-form-controller');

var yearly_learning_controller = require('../components/performance/learning/yearly-learning-controller');
var monthly_learning_controller = require('../components/performance/learning/monthly-learning-controller');
var age_learning_controller = require('../components/performance/learning/age-learning-controller');

var raw_learning_controller = require('../components/performance/learning/raw-learning-controller');
var learning_performance_form = require('../components/performance/learning/performance-form-controller');


var exhibitions_summary_controllers =  require('../components/performance/exhibitions/exhibitions-summary-controller');

var app_controllers = require('../components/team/app-controllers');
var leave_controllers = require('../components/team/leave-controller');
var team_controllers = require('../components/team/team-controller');
var member_controllers = require('../components/member/member-controller');
var form_controllers = require('../components/team/form-controller');
var timeline_controllers = require('../components/timeline/timeline-controller');
var shopify_controllers = require('../components/shopify/shopify-controller');
//var performance_controller = require('../components/performance/performance-controller');
var performance_form = require('../components/performance/visits/visits-form-controller');
var retail_performance_form = require('../components/performance/retail/performance-form-controller');


var timeline_settings_controller = require('../components/timeline-settings/timeline-settings-controller');
var users_controller = require('../components/user-admin/users-controller');
var iframe_controller = require('../components/iframe/iframe-controller');
var turnstiles_controller = require('../components/turnstiles/turnstiles-controller');


var directives = require('../shared/directives/directives');
var tech_support_directives = require('../components/tech-support/tech-support-directive');
var users_directives = require('../components/user-admin/users-directive');
var timeline_directives = require('../components/timeline/timeline-directive');
var shopify_directives = require('../components/shopify/shopify-directive');
var performance_directives = require('../components/performance/performance-directive');
var iframe_directives = require('../components/iframe/iframe-directive');
var turnstiles_directives = require('../components/turnstiles/turnstiles-directive');
var resources_directives = require('../components/resource-bookings/directive');





var data_services = require('../shared/services/data-services');
var app_services = require('../shared/services/app-services');

var timeline_services = require('../components/timeline/timeline-services');
var timeline_leave_services = require('../components/timeline/timeline-leave-services');
var timeline_shopify_functions = require('../components/timeline/timeline-shopify-services');
var timeline_install_functions = require('../components/timeline/timeline-installs-services');
var timeline_exhibitions_functions = require('../components/timeline/timeline-exhibitions-services');
var timeline_visitor_figures_functions = require('../components/timeline/timeline-visitor-figures-services');
var timeline_googlesheets_functions = require('../components/timeline/timeline-googlesheets-services');
var timeline_learning_services = require('../components/timeline/timeline-learning-bookings-services');
var timeline_loans_services = require('../components/timeline/timeline-loans-services');
var tech_trello_services = require('../components/tech-support/trello-services');

var downtime_services = require('../components/machine-monitor/downtime-services');
var feedback_services = require('../components/machine-monitor/feedback-services');




	var app =  angular.module('app', [
		'ng',
	
		'ngRoute',
		'ngAnimate',		
		'ngResource',
		'ngSanitize',//,
		'angularUtils.directives.dirPagination',
		'underscore',//,
		'ngScrollbar',
		'ngMaterial',		
		'angularGrid',
		"ngSanitize",
		'formly', 
		'formlyBootstrap',
		"chart.js",
		'daterangepicker',
		'ngDragDrop',
		'md.data.table',
		'ui.router'	,
		'ui.grid','ui.bootstrap', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns','ui.grid.pinning',
		 'ui.grid.autoResize','ngMessages', 'material.svgAssetsCache',	'moment-picker'
		])
		
	
	

_.each(yearly_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_events_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(events_performance_form, function(controller, name) {
  app.controller(name, controller);
});






_.each(controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(feedback_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(satisfaction_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(operations_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_operations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_operationss_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_operations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(giftaid_performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_all_giftaid_controller, function(controller, name) {
  app.controller(name, controller);
});





_.each(monthly_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(yearly_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_welcomedesk_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(welcomedesk_performance_form, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(age_learning_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_exhibitions_pwyt_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_exhibitions_pwyt_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(exhibitions_pwyt_performance_form, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(weekly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_teg_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_teg_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(teg_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(raw_learning_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(learning_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(exhibitions_summary_controllers, function(controller, name) {
  app.controller(name, controller);
});




_.each(dead_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(nav_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(tech_support_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(record_bookings_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(bookings_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(record_equipment_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(equipment_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(record_rooms_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(rooms_controller, function(controller, name) {
  app.controller(name, controller);
});



_.each(downtime_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(performance_dashboard_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(analyser_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(raw_turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_visitor_numbers_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(yearly_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(monthly_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_retail_sales_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(yearly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_donations_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(donations_performance_form, function(controller, name) {
  app.controller(name, controller);
});

_.each(monthly_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(raw_events_controller, function(controller, name) {
  app.controller(name, controller);
});
_.each(events_performance_form, function(controller, name) {
  app.controller(name, controller);
});




_.each(monthly_turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});




_.each(app_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(leave_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(team_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(member_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(users_controller, function(controller, name) {
  app.controller(name, controller);
});

_.each(iframe_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(turnstiles_controller, function(controller, name) {
  app.controller(name, controller);
});


_.each(form_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(timeline_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(shopify_controllers, function(controller, name) {
  app.controller(name, controller);
});


_.each(performance_form, function(controller, name) {
  app.controller(name, controller);
});
_.each(retail_performance_form, function(controller, name) {
  app.controller(name, controller);
});





_.each(timeline_settings_controller, function(controller, name) {
  app.controller(name, controller);
});








 _.each(directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(tech_support_directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(users_directives, function(directive, name) {
  app.directive(name, directive);
});



 _.each(timeline_directives, function(directive, name) {
  app.directive(name, directive);
});

 _.each(shopify_directives, function(directive, name) {
  app.directive(name, directive);
});

 _.each(performance_directives, function(directive, name) {
  app.directive(name, directive);
});


 _.each(iframe_directives, function(directive, name) {
  app.directive(name, directive);
});
 _.each(turnstiles_directives, function(directive, name) {
  app.directive(name, directive);
});


 _.each(resources_directives, function(directive, name) {
  app.directive(name, directive);
});


_.each(data_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(app_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(downtime_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(feedback_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_leave_services, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_shopify_functions, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_install_functions, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_exhibitions_functions, function(factory, name) {
  app.factory(name, factory);
});


_.each(timeline_resources_controller, function(factory, name) {
  app.controller(name, factory);
});



_.each(timeline_functions_resources, function(factory, name) {
  app.factory(name, factory);
});

_.each(timeline_bookings_services, function(factory, name) {
  app.factory(name, factory);
});



_.each(timeline_visitor_figures_functions, function(factory, name) {
  app.factory(name, factory);
});



_.each(timeline_googlesheets_functions, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_learning_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(timeline_loans_services, function(factory, name) {
  app.factory(name, factory);
});
_.each(tech_trello_services, function(factory, name) {
  app.factory(name, factory);
});


app.filter('orderByDayNumber', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});

app.filter('mapGender', function() {
  var genderHash = {
    1: 'male',
    2: 'female'
  };
})



app.config(function config(formlyConfigProvider) {


  formlyConfigProvider.setType([
  {
    name: 'radio',
	overwriteOk:true,
    templateUrl: 'views/formly-radio.html'
  },
  {
    name: 'button',
    templateUrl: '<button ng-click="options.templateOptions">{{options.label}}</button>'
  }
]);

 app.config(function($mdIconProvider) {
    $mdIconProvider
      .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
      .iconSet("social", 'img/icons/sets/social-icons.svg', 24);
  })

  formlyConfigProvider.setType({
    name: 'input',
	overwriteOk:true,
    template: '<input class="form-control_CHEESE" ng-model="model[options.key]">',
    wrapper: ['helper', 'bootstrapLabel', 'bootstrapHasError']
  });
  

  
  formlyConfigProvider.setType({
    name: 'file',
     templateUrl: 'views/formly-file.html'
  });

});
/*
this breaks the timeline
app.config([
    "$routeProvider",
    "$httpProvider",
    function($routeProvider, $httpProvider){
        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    }
]);

*/
app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
  //$locationProvider.html5Mode(true).hashPrefix('!');
}]);


app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false); //prevents the Possibly unhandled rejection errror
}]);

       
app.config(['$stateProvider','$routeProvider', function ($stateProvider,$routeProvider) {
         

             $routeProvider.when('/-:view', {
              templateUrl: '../components/team/trello.html',
              controller: 'trello'
            })
			/*
			 .when('/', {
              templateUrl: '../components/machine-monitor/dashboard.html',
              controller: 'boardCtrl'
           })
		   */
		    .when('/downtime/:kiosk', {
              templateUrl: '../components/machine-monitor/downtime.html',
              controller: 'downtimeCtrl'
           })
		     .when('/downtime', {
              templateUrl: '../components/machine-monitor/downtime.html',
              controller: 'downtimeCtrl'
           })
		   .when('/activity', {
              templateUrl: '../components/machine-monitor/downtime.html',
              controller: 'downtimeCtrl'
           })
		   
		    .when('/feedback', {
              templateUrl: '../components/machine-monitor/feedback.html',
              controller: 'feedbackCtrl'
           })
		   
		      .when('/satisfaction', {
              templateUrl: '../components/machine-monitor/satisfaction.html',
              controller: 'satisfaction'
           })
		   
		   .when('/open_badges', {
              templateUrl: '../views/open_badges.html',
              controller: 'open_badgesCtrl'
           })
		   
		     .when('/dead', {
              templateUrl: '../components/machine-monitor/dead.html',
              controller: 'deadCtrl'
           })
		   
		       .when('/people', {
              templateUrl: '../views/people.html',
              controller: 'peoplecounter'
           })
		   
		    .when('/todo', {
              templateUrl: '../components/machine-monitor/page-feedback.html',
              controller: 'form_to_trellox'
           })
		     .when('/timeline', {
              template: '<time-line  timeline_mode="Timeline" ng-init="init(\'timeline\')"  ></time-line>'
			  
           })
		    .when('/timeline_settings', {
              templateUrl: '../components/timeline-settings/timeline-settings-page.html',
              controller: 'timeline_settings_controller'
           })
		    .when('/room-hire', {
              template: '<timeline-bookings timeline_mode="Bookings" ng-init="init(\'room-hire\')"  ></timeline-bookings>'
			  
           })
		   
		     .when('/equipment-timeline', {
              template: '<timeline-bookings timeline_mode="Bookings" ng-init="init(\'equipment-booking\')"  ></timeline-bookings>'
			  
           })
		   
		   .when('/timeline/:track', {
              template: '<time-line></time-line>'
           })
			 .when('/leave/:team', {
              templateUrl: '../components/team/leave-page.html',
              controller: 'leave_controller'
           })
		   	 .when('/team/:team', {
              templateUrl: '../components/team/team-page.html',
              controller: 'team_controller'
           })
		   
		   .when('/tech-support', {
               template: '<tech-support></tech-support>'
           })
		   
		    .when('/users', {
               template: '<user-admin></user-admin>'
           })
		   
		     .when('/shopify_app', {
               template: '<shopify-status></shopify-status>'
           })
		   
		      .when('/doom', {
               template: '<i-frame></i-frame>'
           })
		      .when('/turnstiles', {
               template: '<turnstiles-controller></turnstiles-controller>'
           })
	
	//PERFORMANCE		   
		   .when('/record-visitor-numbers', {
                template: '<visits-formdata></visits-formdata>'
           })
	   
		     .when('/record-visitor-numbers/:kpi', {
               template: '<performance-panel></performance-panel>'
           })
		   
		    .when('/record-operations', {
               template: '<operations-formdata></operations-formdata>'
           })
		   
		   .when('/monthly-operations', {
               template: '<operations-dashboard></operations-dashboard>'
           })
		   .when('/raw-operations', {
               template: '<raw-operations></raw-operations>'
           })
		  
		  .when('/record-retail-sales', {
               template: '<retail-formdata></retail-formdata>'
           })
		   
		   .when('/monthly-retail-sales', {
               template: '<retail-dashboard></retail-dashboard>'
           })
		   .when('/raw-retail-sales', {
               template: '<raw-retailsales></raw-retailsales>'
           })
		   
		   
		   
		    .when('/record-exhibitions-pwyt', {
               template: '<exhibitionspwyt-formdata></exhibitionspwyt-formdata>'
           })
		   
		   .when('/monthly-exhibitions-pwyt', {
               template: '<exhibitionspwyt-dashboard></exhibitionspwyt-dashboard>'
           })
		   .when('/raw-exhibitions-pwyt', {
               template: '<raw-exhibitionspwyt></raw-exhibitionspwyt>'
           })
		   
		   
		   
		   

		   .when('/raw-visits', {
               template: '<raw-visits></raw-visits>'
           })
		   
			.when('/monthly-visits', {
               template: '<visits-dashboard></visits-dashboard>'
           })
		   
		   
		   
		   
		   
		//PERFORMANCE	LEARNING	    
		    	   .when('/record-learning', {
               template: '<learning-Formdata></learning-Formdata>'
           })
		   
		   
		   	   .when('/raw-learning', {
               template: '<raw-learning></raw-learning>'
           })
		   
			.when('/monthly-learning', {
              template: '<learning-dashboard></learning-dashboard>'
           })
	//PERFORMANCE	DONATIONS	    
		    	   .when('/record-giftaid', {
               template: '<giftaid-Formdata></giftaid-Formdata>'
           })
		   
		   	.when('/age-learning', {
               template: '<learning-dashboard></learning-dashboard>'
           })
	//PERFORMANCE	DONATIONS	    
		    	   .when('/record-giftaid', {
               template: '<giftaid-Formdata></giftaid-Formdata>'
           })
		   
		   
		   
		   	   .when('/raw-giftaid', {
               template: '<raw-giftaid></raw-giftaid>'
           })
		   
			.when('/monthly-giftaid', {
               template: '<giftaid-dashboard></giftaid-dashboard>'
           })
		   
		    	   .when('/record-donations', {
               template: '<donations-Formdata></donations-Formdata>'
           })
		   
		   
		   	   .when('/raw-donations', {
               template: '<raw-donations></raw-donations>'
           })
		   
			.when('/monthly-donations', {
               template: '<donations-dashboard></donations-dashboard>'
           })
		   
		   
		   
		   .when('/record-events', {
               template: '<events-Formdata></events-Formdata>'
           })
		   
		   
		   	.when('/raw-events', {
               template: '<raw-events></raw-events>'
           })
		   
			.when('/monthly-events', {
               template: '<events-dashboard></events-dashboard>'
           })
		   
		   
		   	.when('/record-welcomedesk', {
               template: '<welcomedesk-Formdata></welcomedesk-Formdata>'
           })
		   
		   
		   .when('/raw-welcomedesk', {
               template: '<raw-welcomedesk></raw-welcomedesk>'
           })
		   
			.when('/monthly-welcomedesk', {
               template: '<welcomedesk-dashboard></welcomedesk-dashboard>'
           })
		   
		   	   
			.when('/monthly-teg', {
               template: '<teg-dashboard></teg-dashboard>'
           })
		   
		   	 .when('/record-teg', {
               template: '<teg-Formdata></teg-Formdata>'
           })
		   
		   
		   	.when('/raw-teg', {
               template: '<raw-teg></raw-teg>'
           })
		   
		   
			.when('/exhibitions-summary', {
               template: '<exhibitions-dashboard></exhibitions-dashboard>'
           })
		   
		   .when('/analyser', {
               template: '<analyser-dashboard></analyser-dashboard>'
           })
		   

		    .when('/raw-turnstiles', {
               template: '<raw-turnstiles></raw-turnstiles>'
           })
		   
			.when('/monthly-turnstiles', {
               template: '<monthly-turnstiles></monthly-turnstiles>'
           })
		   
		 //RESOURCE BOOKING 

		  .when('/rooms', {
               template: '<rooms-Formdata></rooms-Formdata>'
           })
		   
			.when('/equipment', {
               template: '<equipment-Formdata></equipment-Formdata>'
           })
		   
			.when('/bookings/:mode', {
               template: '<bookings-Formdata></bookings-Formdata>'
          })


		    .when('/turnstiles/:venue', {
               template: '<turnstiles-controller></turnstiles-controller>'
           })
		      .when('/tech-support:token', {
              templateUrl: '../components/tech-support/tech-support-page.html',
              controller: 'tech_support_controller'
           })
		  
		  
		  
			.when('/me/:member', {
              templateUrl: '../components/member/member-page.html',
              controller: 'member_controller',
			  data: {
				//authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
				}
           })
		   
		    // .otherwise({redirectTo : 'timeline'    })
		   
		   
          
        }])

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_7e76be69.js","/")
},{"../components/iframe/iframe-controller":8,"../components/iframe/iframe-directive":9,"../components/machine-monitor/dashboard-controller":10,"../components/machine-monitor/dead-controller":11,"../components/machine-monitor/downtime-controller":12,"../components/machine-monitor/downtime-services":13,"../components/machine-monitor/feedback-controller":14,"../components/machine-monitor/feedback-services":15,"../components/machine-monitor/satisfaction-controller":16,"../components/member/member-controller":17,"../components/performance/analyser/analyser-controller":18,"../components/performance/dashboard-controllers":19,"../components/performance/donations/monthly-donations-controller":20,"../components/performance/donations/performance-form-controller":21,"../components/performance/donations/raw-donations-controller":22,"../components/performance/donations/yearly-donations-controller":23,"../components/performance/events/monthly-events-controller":24,"../components/performance/events/performance-form-controller":25,"../components/performance/events/raw-events-controller":26,"../components/performance/events/yearly-events-controller":27,"../components/performance/exhibitions-pwyt/monthly-donations-controller":28,"../components/performance/exhibitions-pwyt/performance-form-controller":29,"../components/performance/exhibitions-pwyt/raw-donations-controller":30,"../components/performance/exhibitions/exhibitions-summary-controller":31,"../components/performance/gallery-visits/monthly-teg-controller":32,"../components/performance/gallery-visits/performance-form-controller":33,"../components/performance/gallery-visits/raw-teg-controller":34,"../components/performance/gallery-visits/weekly-teg-controller":35,"../components/performance/gallery-visits/yearly-teg-controller":36,"../components/performance/gift-aid/monthly-allgiftaid-controller":37,"../components/performance/gift-aid/monthly-giftaid-controller":38,"../components/performance/gift-aid/performance-form-controller":39,"../components/performance/gift-aid/raw-giftaid-controller":40,"../components/performance/learning/age-learning-controller":41,"../components/performance/learning/monthly-learning-controller":42,"../components/performance/learning/performance-form-controller":43,"../components/performance/learning/raw-learning-controller":44,"../components/performance/learning/yearly-learning-controller":45,"../components/performance/operations/monthly-operations-controller":46,"../components/performance/operations/performance-form-controller":47,"../components/performance/operations/raw-operations-controller":48,"../components/performance/operations/yearly-operations-controller":49,"../components/performance/performance-directive":50,"../components/performance/retail/monthly-retail-sales-controller":51,"../components/performance/retail/performance-form-controller":52,"../components/performance/retail/raw-retail-sales-controller":53,"../components/performance/retail/yearly-retail-sales-controller":54,"../components/performance/turnstiles/monthly-turnstiles-controller":55,"../components/performance/turnstiles/raw-turnstiles-controller":56,"../components/performance/visits/monthly-visits-controller":57,"../components/performance/visits/raw-visits-controller":58,"../components/performance/visits/visits-form-controller":59,"../components/performance/visits/yearly-visits-controller":60,"../components/performance/welcome-desk/monthly-welcomedesk-controller":61,"../components/performance/welcome-desk/performance-form-controller":62,"../components/performance/welcome-desk/raw-welcomedesk-controller":63,"../components/performance/welcome-desk/yearly-welcomedesk-controller":64,"../components/resource-bookings/bookings/form-controller":65,"../components/resource-bookings/bookings/raw-bookings-controller":66,"../components/resource-bookings/directive":67,"../components/resource-bookings/equipment/form-controller":68,"../components/resource-bookings/equipment/raw-equipment-controller":69,"../components/resource-bookings/rooms/form-controller":70,"../components/resource-bookings/rooms/raw-rooms-controller":71,"../components/resource-bookings/timeline-resources-controller":72,"../components/resource-bookings/timeline-resources-services":73,"../components/shopify/shopify-controller":74,"../components/shopify/shopify-directive":75,"../components/team/app-controllers":76,"../components/team/form-controller":77,"../components/team/leave-controller":78,"../components/team/team-controller":79,"../components/tech-support/tech-support-controller":80,"../components/tech-support/tech-support-directive":81,"../components/tech-support/trello-services":82,"../components/timeline-settings/timeline-settings-controller":83,"../components/timeline/timeline-bookings-services":84,"../components/timeline/timeline-controller":85,"../components/timeline/timeline-directive":86,"../components/timeline/timeline-exhibitions-services":87,"../components/timeline/timeline-googlesheets-services":88,"../components/timeline/timeline-installs-services":89,"../components/timeline/timeline-learning-bookings-services":90,"../components/timeline/timeline-leave-services":91,"../components/timeline/timeline-loans-services":92,"../components/timeline/timeline-services":93,"../components/timeline/timeline-shopify-services":94,"../components/timeline/timeline-visitor-figures-services":95,"../components/turnstiles/turnstiles-controller":96,"../components/turnstiles/turnstiles-directive":97,"../components/user-admin/users-controller":98,"../components/user-admin/users-directive":99,"../shared/controllers/controllers":100,"../shared/controllers/navbar-controller":101,"../shared/directives/directives":102,"../shared/services/app-services":104,"../shared/services/data-services":105,"b55mWE":4,"buffer":3,"underscore":7}],104:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.data_table_reload = function() {	


  var date= moment().startOf( 'day')._d
  
  
  function getDate() {
    return date;
  }
  function setDate(newDate) {
    date = newDate;
  }
  return {
    getDate: getDate,
    setDate: setDate,
  }
		

}

exports.table_security = function(AuthService,$rootScope) {	

		$rootScope.pageOptions = { isView : false};
		$rootScope.canEdit = function () { return $rootScope.pageOptions.isView; };
		$rootScope.isloggedin=false	
		  AuthService.isLoggedIn().then(function(user){
			if($rootScope.canEdit_table==true){
				$rootScope.pageOptions = { isView : true};
			}
			
			$rootScope.isloggedin=true
	    })
	return this	

}

exports.get_table_data = function($rootScope,data_table_reload) {	



var self = this
var array = {};
var myScope


			array.getData= function(filterdate,$scope){
			console.log('getData')
			console.log('filterdate',filterdate)
			if($scope){
			myScope=$scope
			}
					if(filterdate){
					console.log('all dates after',filterdate)
							console.log(filterdate)
							var filter_month = moment().month()
							console.log('filter_month',filter_month)
							filterdate=moment(filterdate)._d
							
					}
					else
					{
						
						
							var filter_month = moment().month()
							filterdate=moment(new Date()).subtract({'years': 1})
							filterdate=moment(filterdate)._d
							console.log('all dates after',filterdate)
					
					}
					
							var query = {'museum_id':"#","date_value":moment(filterdate).format("YYYY-MM-DD"),"exact":false};
							
							if($scope.extraQuery){
								_.extend(query, $scope.extraQuery)
							}
							 
							 console.log('query',query)
							 
							$rootScope.featured_collection.query(query, function(team) {
							$scope.rows=[]
							$scope._rows=[]
							
							console.log('filtering ' + team.length + " results")
							
							
							_.each(team,function(row){
							
							if(filterdate){
									var data_month = moment(row.date_value).month()
																		
									
								if(moment(row.date_value)._d>=moment(filterdate)._d  && row.museum_id!=""){					
									
									$scope._rows.push(row)
									
								}
							}
							else
							{
								console.log('displaying all data')
								$scope._rows.push(row)
							
							}
								
										
							})

						 $scope.gridOptions.data.length = 0;
						  angular.forEach( $scope._rows, function( row ) {
							$scope.gridOptions.data.push( row );
						  });
						  
						  
						  	$scope.$watch(function () {
			
			return data_table_reload.getDate();


			},
			
		   function (value) {
		 
		   
		   }
		);
						
					})	
					
			$rootScope.alldata=function (val) {
					console.log('filter by date')	
						
						if (val=="month"){
						
							console.log('show month data')
							var date = new Date(), y = date.getFullYear(), m = date.getMonth();
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay);
							array.getData(firstDay,myScope)
						}
						else if (val)
						{
								console.log('show month data')
							var date = new Date(val), y = date.getFullYear(val), m = date.getMonth(val);
							console.log('filtering on month', m)
							var firstDay = new Date(y, m, 1);
							var lastDay = new Date(y, m + 1, 0);
							firstDay = moment(firstDay)._d;
							array.getData(firstDay,myScope)	

						}
						else 
						{
							console.log('show all data')
							array.getData("",myScope)		

						}


			}

			}
			
			
		
		
   return array;
}

exports.grid_ui_settings = function(AuthService) {	

var array = {};

array.monthly= function(columns,scope) {	

	scope.isloggedin=false	
	
		  AuthService.isLoggedIn().then(function(user){
				
		scope.isloggedin=true
			
			
	  })


return {	
			columnDefs:columns,
			enableFiltering:true,
			enableCellEdit:true,
			cellEditableCondition: scope.canEdit ,			
			enableGridMenu: true,
			enableSelectAll: true,
			enableCellSelection: false,
			enableCellEditOnFocus: false,
			exporterCsvFilename: 'myFile.csv',
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function(gridApi){
			scope.gridApi = gridApi;

	    gridApi.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
    //Do your REST call here via $http.get or $http.post
			if(scope.isloggedin!=true) alert('you\'ll need to log in to make these changes')
			var update = []
			var key1 = colDef.field;
			var obj1 = {};
			obj1[key1] = newValue;
			
			update.push(obj1);
			
			var key2 = "logger_user_name";
			var obj2 = {};
			obj2[key2] = scope.user.username;
			
			update.push(obj2);
			
			var key3 = "date_logged";
			var obj3 = {};
			obj3[key3] =new Date();
			
			update.push(obj3);
			setupArray = _.extend(obj1, obj2);
			setupArray = _.extend(setupArray, obj3);
			
				var query = {'id':rowEntity._id};
						scope.featured_collection.update(query, 	setupArray
								
								, function(err, affected, resp) {


								
								
						})
			  });
				}
}

}
		
   return array;
}

exports.weekly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()
  

  
  
	for (year = start; year <= end; year++) { 
			for (week = 0; week < moment().isoWeeksInYear(); week++) { 
			
			axisDate= moment().day("Monday").year(year)
					
			if(axisDate._d>=moment(start_date) && axisDate._d<=moment(end_date)){
			console.log(moment(start_date))
				columns.push({ field: axisDate.week(week).format('DD/MM/YY'),name:axisDate.week(week).format('DD/MM/YY'),width: "80"})
			}
		}
			
			}
	   


			return columns

	};
	

    return array;

}
exports.yearly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()

	for (year = start; year <= end; year++) { 


		
						
									var financial_yesr_text = ["last","this"]
									_.each(financial_yesr_text,function(financial_yer_text){
									
			
												var financial_year_display=""
												if(financial_yer_text=="this"){
												financial_year_display=	year+"-"+((year+1).toString().substring(2))
												}
												else
												{
												financial_year_display=	(year-1)+"-"+(year.toString().substring(2))	
												}

									columns.push({ field:financial_year_display,	
									name: financial_year_display,width:  "80"})
									
									scope.filter_pie.push({value:financial_year_display,
														name:financial_year_display
														})
											
										
									})
									
							
}
	return columns




		

	};
	

    return array;

}

exports.monthly_data_table_columns = function() {	
		

var array = {};


array.build  = function (scope,start_date,end_date) {
  
  var columns = []
  
  start=moment(start_date).year()
  end=moment(end_date).year()

	for (year = start; year <= end; year++) { 

			_.each(moment.monthsShort(),function(month){	
			
				columns.push({ field: month+" "+year,	name: month+" "+year.toString().substring(2),width: "80"})
				scope.filter_pie.push({value:month+" "+year,name:month+" "+year})
			})

	   
}

			return columns

	};
	

    return array;

}

exports.make_a_line_chart = function() {	
		

var line = {};


line.build  = function (scope,columnDefs,data_values,label_values) {
  

  var statistics_to_plot = []
  if ( typeof scope.selected_chart_stats != 'string' ) {
	  console.log('statistics_to_plot',statistics_to_plot)
	  statistics_to_plot =scope.selected_chart_stats
	  } 
  else
  {
	  statistics_to_plot.push(scope.selected_chart_stats)
	  
  }
  		scope.series_a=[]
							
							
							
							var line_data=scope._rows
							if(scope.data_rows.length>0){
								   console.log('go line_data' )
								line_data=scope.data_rows
								
							}

	scope.line_series=[]

	var axis_decider
	
  _.each(statistics_to_plot, function(label_value){
						  axis_decider = 0	
					  scope.line_labels=[]	
	
							_.each(line_data, function(row) {
								

							if(scope.selected_museums && scope.selected_museums.indexOf(row[data_values])==-1) return; //museum filter
								
								_.each(columnDefs , function(column) {						
									if(scope.line_labels.indexOf(column.name)==-1){
										scope.line_labels.push(column.name)
									}	
									line_chart_series_labels =row[data_values]+" "+ label_value
					
									if(scope.line_series.indexOf(line_chart_series_labels)==-1){
										line_data[line_chart_series_labels]=[]
										scope.line_series.push(line_chart_series_labels);
									}
									console.log('axis_decider',axis_decider)

											
									
									if(row.stat==label_value){
									if(axis_decider<=row[column.field]) {axis_decider=row[column.field]	}
										line_data[line_chart_series_labels].push(row[column.field]);
									
									
									
									}
								
								})	
											
							})
												
								
								if(axis_decider>scope.axis_threshhold){
												line_data[line_chart_series_labels].yAxisID= 'A'
												console.log('A')												
											}
											 else
											 {	
														console.log('B')										 
												line_data[line_chart_series_labels].yAxisID= 'B'
												//line_data[line_chart_series_labels].lineTension= 0												
											 }
								
 
 
   
	

 })
 
 
 scope.line_data = []
  _.each(scope.line_series , function(data_set) {
	

	
	  scope.line_data.push(line_data[data_set]) 
  })
 scope.datasetOverride = [{ yAxisID: 'A' }, { yAxisID: 'B' }];
  scope.line_options= {
         
		   scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
       /*
	   ticks: {
          max: 1,
          min: 0
        }
		*/
      }]
    },
		 
		 legend: {
            display: true
         },
         tooltips: {
            enabled: true
         },
		  scaleFontColor: "#8a6666",
		  fillColor: "#E7EDF0", strokeColor: "#A9C4D2"
    }

scope.colors =["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"]

    };
	

    return line;

}

exports.make_a_pie = function($rootScope) {	
		

var pie = {};


pie.build  = function (scope,data_values,label_values) {
   console.log('go')
							scope.series_a=[]
							scope.pie_data=[]
							scope.pie_labels=[]
							var line_data=scope._rows
							if(scope.data_rows.length>0){
								   console.log('go line_data' )
								line_data=scope.data_rows
								
							}
							
							
							_.each(line_data, function(row) {
								if(row[data_values]>0){
										scope.series_a.push(row[data_values] )
										
										if(scope.pie_labels.indexOf(row[label_values])==-1){
											scope.pie_labels.push(row[label_values]);
									scope.pie_data.push(scope.series_a);
										}
										
								}
								
							})		

					
scope.labels = scope.pie_labels
scope.data = scope.series_a
  scope.options= {
         legend: {
            display: true
         },
         tooltips: {
            enabled: true
         }
    }

scope.colors =["#023fa5", "#7d87b9", "#bec1d4", "#d6bcc0", "#bb7784", "#8e063b", "#4a6fe3", "#8595e1", "#b5bbe3", "#e6afb9", "#e07b91", "#d33f6a", "#11c638", "#8dd593", "#c6dec7", "#ead3c6", "#f0b98d", "#ef9708", "#0fcfc0", "#9cded6", "#d5eae7", "#f3e1eb", "#f6c4e1", "#f79cd4"]

    };
	

    return pie;

}






exports.date_calc = function($http) {	
		

var date_calc = {};

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date(2008,01,12);
var secondDate = new Date();

date_calc.diffDays  = function (firstDate) {
var firstDate = new Date(firstDate);
         return secondDate.getMonth() - firstDate.getMonth()
       + (12 * (secondDate.getFullYear() - firstDate.getFullYear()));

    };
	

    return date_calc;

}


    
exports.trello = function($http) {	

	

			var trello = {};
			trello.auth = function () {
		
				var authenticationSuccess = function() { 
				console.log("sucessful authentication");
				var token = Trello.token();
				window.location.replace(decodeURIComponent(window.location.hash));
				console.log("Successful authentication");
				};
					var authenticationFailure = function() {alert("Failed authentication"); };

					 Trello.authorize({
					  type: 'redirect',
					  name: 'Bristol Culture Trello Monitor',
					  scope: {
						read: 'true',
						write: 'true' },
					  expiration: 'never',
					  success: authenticationSuccess,
					  error: authenticationFailure
					});
				

			};
			return trello;

}

exports.get_trello_board = function (Team,Tallys,date_calc,$http,$rootScope) {	


    var urlBase =  'https://trello.com/b/GHES2npy/tarantulas.json';
    var trello = []
	var trello_data=[]
    trello.get_data = function (listx) {
	
		//all lists	return  Trello.get("boards/56051e0244bb2e4efc9e6e97/lists", function(cards) {
			
		 return Trello.get("lists/"+listx.id+"/cards", function(cards) {
		 var list = []
			
					list._cards = []
                    tally = 0
                    card_count = 0
					
					
		   angular.forEach(cards, function(card, index) {
                        card_count++

                        card_to_print = {
                            name: card.name,
                            tint: 1 - date_calc.diffDays(card.dateLastActivity) / 10,
                            age: date_calc.diffDays(card.dateLastActivity).toString(),
                            dateLastActivity: card.dateLastActivity
                        }
                        tally += date_calc.diffDays(card.dateLastActivity)


                        list._cards.push(card_to_print)

                    });
				


                    list.average = (tally / card_count).toFixed(2)
                    list.tint = list.average / 100
                    list.card_count = card_count
                    list.points =  (card_count / (list.average/1 + 1)).toFixed(2)
					

					  Team.query({}, function(_team) {
							_.each(_team, function(row) {
								if(row.name==listx.title){
									
									   var tally = new Tallys({
										name: listx.title,
										date: new Date(),
										points: list.points
									});
									//$scope.tallys = Tallys.query();


									tally.$save();
					
					
										var team = Team.get({ id:row._id });
											  team.name= list.title
											  team.score=list.points
											  team.card_count=  list.card_count
											  team.bonus=""
											  teampenalty=list.average 
										$id = row._id;
										 Team.update({ id:$id }, team);
										$rootScope.message="update"	
								}
									
								});
						});
		 
		 console.log('end of service')
		 }).then(
			function (response){
				return response
				
			}
		 )
				
			

    };


		

    return trello;

}



exports.detect_dragging= function($rootScope) {


	
var detect_dragging=[]
 $rootScope.isDragging = false;
var currentPos = [];
detect_dragging.drag_handler= function(){
 $('md-content').on('mousedown', function (evt) {

   currentPos = [evt.pageX, evt.pageY]

 $('md-content').on('mousemove', function handler(evt) {

    currentPos=[evt.pageX, evt.pageY];
    $('#content-scroller').off('mousemove', handler);

  });

 $('md-content').on('mouseup', function handler(evt) {
	
    if(evt.pageX+ evt.pageY==currentPos[0]+currentPos[1]){
			console.log('clicking')
       $rootScope.isDragging = false;
	}
    else
	{
      $rootScope.isDragging = true;
		console.log('dragging')
	}
 $('md-content').off('mouseup', handler);
 
  });

});
}

/* App Module */

  return detect_dragging

}


exports.screen_saver_loop=function($rootScope,$location,$interval,Team) {

	



				//NB make sure any views called int he screensaver dont contain the screensaver service!
				 var sharedService = {};
				 

	var team_list=[]
	var support_list=[]
	var roadmap_list=[]
		var list=[]
	list.title="BMAG DIGITAL SUPPORT"
	list.id="56051e0244bb2e4efc9e6e99"	  
    support_list.push(list)
	
	var list=[]
	list.title="MSHED DIGITAL SUPPORT"
	list.id="562667caadda958dad274f22"	  
    support_list.push(list)
	
	var list=[]
	list.title="ZAHID"
	list.id="5257d4e719e0ee3b5800009c"	  
    team_list.push(list)
	
	var list=[]
	list.title="DARREN"
	list.id="55cdc7672fff3ffc946f6e94"	  
    team_list.push(list)
	
	var list=[]
	list.title="TOM"
	list.id="563234399bfcf125dc06f03b"	  
    team_list.push(list)	
		
		
	var list=[]
	list.title="LACEY"
	list.id="57f3b32311fbe4f9966de748"	  
    team_list.push(list)	

		
	var list=[]
	list.title="FAY"
	list.id="53344421ba92789d64cf8f99"	  
    team_list.push(list)
	
		var list=[]
	list.title="MARK"
	list.id="5790fb082acddb2d98c04826"	  
    team_list.push(list)
	
	var list=[]
	list.title="DAVID"
	list.id="52c3f521160978433b073a9b"	  
    team_list.push(list)
	
	
	
	
	var list=[]
	list.title="Q3"
	list.id="5763ca5d82c12dc42e874e0a"	  
   	  
    roadmap_list.push(list)
	
	var list=[]
	list.title="Q4"
	list.id="5763ca6c8981e9d4c9da0e23"	  
   


   roadmap_list.push(list)
	

	$rootScope.team=team_list
	$rootScope.support=support_list
	$rootScope.roadmap=roadmap_list
	
				 var currentView= ['/a/team','/a/support','/a/roadmap','/board']
				  $rootScope.i = 0
				 var timer
				 
				function switchview(i){
					
						 var videoElement = $('iframe').contents().find("video").get(0)
					
						if(!audioplayer ){var audioplayer=""}
						 var audioElement_not_playing = audioplayer.paused
						 

				if  ((!videoElement || videoElement.paused) && !audioplayer|| audioplayer.paused==true) {
					
			
						
						$rootScope.updateInterval 
						console.log(i)
						if(i>=screensaver.length){i=0;$rootScope.i=0}
						//app_start_log(kiosk,"SCREENSAVER")						
						$location.path( currentView[$rootScope.i])
						$rootScope.i++
					}
					else{
						
						console.log('video playing..cancel')
					}
					
						

				}

				//	$interval.cancel(timer);

				  sharedService.start_screen_saver = function() {
					
			
					  $interval.cancel($rootScope.timer );
					
					if($location.path()!="/screen_saver_images"){	
							$rootScope.screensaver_on=true
						
							$rootScope.timer = $interval(function() { switchview( $rootScope.i) }, 5   * 60*   1000)
					}
					
				  
				  };

				  sharedService.screensaverOff = function() {
						$rootScope.screensaver_on=false
					   $interval.cancel($rootScope.timer );
					   console.log('screensaver off')
					  
				
				   
				  };

				  return sharedService;
}
  
  



}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/services/app-services.js","/services")
},{"b55mWE":4,"buffer":3}],105:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var status = require('http-status');
         
  exports.Monthly_products_published =  function($resource){
	  
	  
	return $resource('/shopify_product/monthly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
           
  exports.Monthly_products_sold_online =  function($resource){
	  
	  
	return $resource('/shopify_transactions/monthly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Yearly_learning =  function($resource){
	  
	return $resource('/learning/total/:session_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
    

	

  } 
exports.Yearly_operations =  function($resource){
	  
	return $resource('/operations/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Monthly_operations  =  function($resource){
	  
	  
	return $resource('/operations/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
          exports.Yearly_visits =  function($resource){
	  
	return $resource('/kpi_aggregate/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
exports.Monthly_visits =  function($resource){
	  
	  
	return $resource('/kpi_aggregate/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
  
  exports.Weekly_visits =  function($resource){
	  
	  
	return $resource('/kpi_aggregate/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
    exports.Yearly_events =  function($resource){
	  
	  
	return $resource('/events/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  exports.Monthly_events =  function($resource){
	  
	  
	return $resource('/events/all/:event_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
  exports.Yearly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
    

	

  } 
  
    exports.Monthly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
  
  }
  
  
    exports.Weekly_welcomedesk =  function($resource){
	  
	return $resource('/welcomedesk/weekly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
  
  }
  
  
      exports.Monthly_exhibitions_pwyt =  function($resource){
	  
	return $resource('/exhibitions_pwyt/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
        exports.Monthly_teg =  function($resource){
	  
	return $resource('/gallery_visits/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
          exports.Yearly_teg =  function($resource){
	  
	return $resource('/gallery_visits/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
          exports.Weekly_teg =  function($resource){
	  
	return $resource('/gallery_visits/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Yearly_retail_sales =  function($resource){
	  
	return $resource('/retail_sales/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  exports.Monthly_retail_sales =  function($resource){
	  
	return $resource('/retail_sales/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Weekly_retail_sales =  function($resource){
	  
	  
	return $resource('/retail_sales/week',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
  
        exports.Monthly_all_giftaid =  function($resource){
	  
	  
	return $resource('/allgiftaid/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
      exports.Monthly_giftaid =  function($resource){
	  
	  
	return $resource('/giftaid/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
         exports.Yearly_donations =  function($resource){
	  
	return $resource('/donations/total',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
    exports.Monthly_donations =  function($resource){
	  
	  
	return $resource('/donations/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
     exports.Weekly_donations =  function($resource){
	  
	  
	return $resource('/donations/weekly',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
      exports.Monthly_learning =  function($resource){
	  
	  
	return $resource('/learning/all/:session_type',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
	  }   
      exports.Age_learning =  function($resource){
	  
	  
	return $resource('/learning/age',{ }, {
		openGates: {method:'GET', isArray: true}
			
  }); 

  } 

    exports.Monthly_turnstiles =  function($resource){
	  
	  
	return $resource('/turnstiles_logging/all',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  } 
      exports.turnstile_app =  function($resource){
	  
	  
	return $resource('/open_turnstile',{ }, {
		openGates: {method:'GET', isArray: true}
			
  });
       

  }
  
  
  exports.Raw_events =  function($resource){
	 
		 
            return $resource('/events/:id/:museum_id/:date_value/:on_site_off_site/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   exports.Raw_welcomedesk =  function($resource){
	 
	
	
		
            return $resource('/welcomedesk/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
       exports.Resources =  function($resource){
	 
		 
            return $resource('/resources/:id/:name/:type/:date_value/:exact/:museum_id', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			  'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
      exports.Bookings =  function($resource){

		 
            return $resource('/bookings/:id/:group/:start_date/:end_date/:_type', null,
			{ 
			  'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			  'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
     exports.Raw_operations =  function($resource){
	 
		 
            return $resource('/operations/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
    exports.Raw_teg =  function($resource){
	 
		 
            return $resource('/gallery_visits/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   //PERFORMACE 
   
    exports.day_turnstiles =  function($resource){
	 
		 
            return $resource('/turnstiles_logging/daily', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 exports.Raw_turnstiles =  function($resource){
	 
		 
            return $resource('/turnstiles_logging/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
 //PERFORMACE 
 exports.Raw_visits =  function($resource){
	 
	 
		 
            return $resource('/raw_visits/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
   //PERFORMACE 
 exports.Raw_giftaid =  function($resource){
	 
		 
            return $resource('/giftaid/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 exports.Retail_sales =  function($resource){
	 
		 
            return $resource('/retail_sales/:id/:museum_id/:date_value/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
 
 
   exports.Raw_exhibitions_pwyt =  function($resource){
	 
		 
            return $resource('/exhibitions_pwyt/:id/:museum_id/:date_value/:donation_box_no/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
  exports.Raw_donations =  function($resource){
	 
		 
            return $resource('/donations/:id/:museum_id/:date_value/:donation_box_no/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
   
  exports.Raw_learning =  function($resource){
	 
		 
            return $resource('/learning/:id/:museum_id/:date_value/:session_type/:age_group/:exact', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
  
  
      exports.check_com_port =  function($resource){
	  
		 
          return $resource('/check_com_port/test', null,
		  { 'get':    {method:'GET', isArray: true} , // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray: true} ,// get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
   
      exports.check_ticket_database =  function($resource){
	  
		 
          return $resource('/check_ticket_database/test', null,
		  { 'get':    {method:'GET', isArray: true} , // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray: true} ,// get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
   exports.check_ticket_file =  function($resource){
	  
		 
          return $resource('/check_ticket_file/test', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET'}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
 
  
 exports.shopify_app_test =  function($resource){
	  
		 
          return $resource('/shopify_product_status_app/test', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET'}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }


   exports.shopify_app =  function($resource){
	  
	  
	   return $resource('/shopify_product_status_app',{ }, {
    getData: {method:'GET', isArray: true}
  });
       

  }
  
exports.AuthService = function($http) {

   var currentUser;

  return {
    login: function() { },
    logout: function() {  },
    isLoggedIn: function() {
        return $http.get('/user_data')	
	},
    currentUser: function() { 
	$http.get('/user_data').then(function(result){
			currentUser = result;
		});
	}
   
  };

};



exports.Tallys = function($resource){
	

          return $resource('/tallys/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.Timeline =  function($resource){
		
		 
          return $resource('/timeline/:id', null, {
            'update': { method:'PUT' }
          });
 }
 
 exports.delete_leave_by_id = function(Team,$rootScope){
 
 
 var delete_leave_by_id = {};
 
 
 delete_leave_by_id._delete  = function(leave_id){
 
 ids_to_delete=[]
 ids_to_delete.push(leave_id)
 
 		 Team.query({}, function(team) {
				_.each(team, function(_team,i) {
		
												console.log ('before',team[i].leave_taken)
												new_leave=[]
											new_ids=[]	
											_.each(team[i].leave_taken, function(leave_me,index) {
											
													if( ids_to_delete.indexOf(leave_me._id)==-1 && new_ids.indexOf(leave_me._id)==-1){
														new_leave.push(leave_me	)	
														new_ids.push(	leave_me._id)													
													 }
												
											})
							
											team[i].leave_taken=new_leave
											
											console.log ('after',team[i].leave_taken)
							
											Team.update({
											id:_team._id,				
											}, team[i]);
											
											$rootScope.me_Data=team[i]
							
							
		
		 
						
           
        
						
				})
			})
 
 
 }
 
  return delete_leave_by_id;
 }
 
   exports.Community_groups =  function($resource){
	  
		 
          return $resource('/events/community_groups', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
 
  exports.Tech_support =  function($resource){
	  
		 
          return $resource('/tech_support/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
    exports.log_messages =  function($resource){
	  
		 
          return $resource('/logging_messages/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
 exports.Leave =  function($resource){
	  
		 
          return $resource('/leave/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });

  }
  
  
  exports.Shopify_aggregate =  function($resource){
		
			 
          return $resource('/shopify_aggregate/:id', null,
		  { 'get':    {method:'GET'}  // get individual record
	
          });
}
  
   exports.Timeline_data =  function($resource){
		
			 
          return $resource('/timeline_data_settings/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}
  
 exports.Timeline =  function($resource){
		
			 
          return $resource('/timeline/:id', null,
		  { 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
}


 exports.Emu_events =  function($http){
		
		   var  all,events = [];
    var getData = function() {
	console.log('getting events')
        return $http.get('/assets/data/events.JSON')
        .then(function(response) {
          return response.data.events
        });
    }
    return {
        getData: getData 
    };
		  
		  
		  var events = [];
			
	$http.get('/assets/data/events.JSON')
    .then(function(response) {
      events = response;
    }); 
          
	  return {events: events};	  
;
}
		
 exports.Team =  function($resource){
	 
		 
          return $resource('/team/:id', null,
			{ 'get':    {method:'GET'},  // get individual record
			  'save':   {method:'POST'}, // create record
			  'query':  {method:'GET', isArray:true}, // get list all records
			  'remove': {method:'DELETE'}, // remove record
			    'update': { method:'PUT' },
			  'delete': {method:'DELETE'} // same, remove record
          });
 }
 
  exports.Todos =  function($resource){
        
        
          return $resource('/todos/:id', null, {
            'update': { method:'PUT' }
          });
  }
		
		
	
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/services/data-services.js","/services")
},{"b55mWE":4,"buffer":3,"http-status":5}]},{},[103])