(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                }
            }));
        });
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback(null);
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        if (!keys.length) {
            return callback(null);
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (_keys(results).length === keys.length) {
                callback(null, results);
                callback = function () {};
            }
        });

        _each(keys, function (k) {
            var task = (tasks[k] instanceof Function) ? [tasks[k]]: tasks[k];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor !== Array) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (test()) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            if (!test()) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if(data.constructor !== Array) {
              data = [data];
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            }
        };
        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            push: function (data, callback) {
                if(data.constructor !== Array) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain) cargo.drain();
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                callback.apply(null, memo[key]);
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.compose = function (/* functions... */) {
        var fns = Array.prototype.reverse.call(arguments);
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/async/lib/async.js","/../../node_modules/async/lib")
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
},{"b55mWE":4,"buffer":3}],9:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],10:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],11:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],12:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],13:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],14:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],15:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.shopify_controller = function($scope, $http, $q, $routeParams, $location,$rootScope, shopify_app
    ) {
	console.log('controller go')
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

		 console.log('getData')	
		 shopify_app.getData(function(team){
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








}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/shopify/shopify-controller.js","/../components/shopify")
},{"b55mWE":4,"buffer":3}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.shopifyStatus = function() {
  return {
   controller: 'shopify_controller',
    templateUrl: './components/shopify/shopify-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/shopify/shopify-directive.js","/../components/shopify")
},{"b55mWE":4,"buffer":3}],18:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],19:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],20:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],21:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var async = require('async')

exports.tech_support_controller = function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope,  trello, tech_get_trello_board, date_calc,Tech_support
    ) {
	$scope.rows=[]
	$scope._rows=[]
	//http://ui-grid.info/docs/#/tutorial/201_editable
	Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}

	
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope.rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope.rows;
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
var key = "happyCount";
var obj = {};
obj[key] = newValue;
myArray.push(obj);
	var query = {'id':rowEntity._id};
			Tech_support.update(query, 	myArray
					
					, function(err, affected, resp) {

var comment_text = [colDef.field] + ": " + newValue
					var data = {text:comment_text}
				
					Trello.post("cards/"+rowEntity._id+"/actions/comments",data)
					
					
			})
  });
    },
	
  };
  
 
		
	get_list = function (id,list_id,cb) {
	
		//card might have been moved to done!
		var query = {'id':id};
		Trello.get("cards/"+id+"?fields=idList,dateLastActivity", function(card) {
		Trello.get("lists/"+card.idList+"?fields=name", function(list) {
			console.log(list.name+card.dateLastActivity)
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

				console.log('updated latest lists from trello')
				Tech_support.query({}, function(team) {

					for (var key in team[0]) {
						var dont_shows=[
						"_id","__v","_id","$get","$save","$query","$remove","$delete","toJSON","$update"
						]
						if(dont_shows.indexOf(key)==-1){
							$scope.column_headings.push(key)
						}				
					}
				
				
					async.forEach(team, function(row, callback) { //The second argument, `callback`, is the "task callback" for a specific `messageId`
					
					
					get_list(row.id,row.list_id, function() {						console.log('got list')
							row.editable = true
							$scope._rows.push(row)
							$scope.counter++;
							callback()							
					})	
					
					}, function(err) {
						if (err) return next(err);
						$scope.gridOptions.data=$scope._rows;
						})
						
						})
						
						})
					
}







}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/tech-support-controller.js","/../components/tech-support")
},{"async":1,"b55mWE":4,"buffer":3}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.techSupport = function() {
  return {
   controller: 'tech_support_controller',
    templateUrl: './components/tech-support/tech-support-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/tech-support/tech-support-directive.js","/../components/tech-support")
},{"b55mWE":4,"buffer":3}],24:[function(require,module,exports){
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
},{"async":1,"b55mWE":4,"buffer":3}],25:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.timeline_controller=     function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
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

$rootScope.datePicker.date = {startDate:null, endDate: null};
	  $scope.isloggedin=false	
	  AuthService.isLoggedIn().then(function(user){
			$scope.isloggedin=true	
			//$scope.lockstatus=true
			//$scope.unlock=true
			//timeline_functions.unlock(true)
	  })
	

	
	
$scope.dateRangeOptions = {
        locale : {
            format : 'DD/MM/YYYY'
        },
        eventHandlers : {
            'apply.daterangepicker' : function() {  
               date=$rootScope.datePicker.date
			   	days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
				
				
			   if(date){
			//if($rootScope.selected_t_id==event.items[0]){	
					html=timeline_functions.event_html($scope.selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",$rootScope.selected_notes + "(" +days+" days)" )
					var options={id:$scope.selected_timeline_id,content:html,start:moment(date.startDate)._d,end:moment(date.endDate)._d,start_date:moment(date.startDate)._d,end_date:moment(date.endDate)._d}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
		
			}}				
            }
        }

				$scope.$watch('selected_notes', function(selected_note) {

					date=$rootScope.datePicker.date
					days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			
					html=timeline_functions.event_html($scope.selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",selected_note,days)
					var options={id:$scope.selected_timeline_id,content:html,notes:selected_note}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
			})
			
		
			
			$scope.$watch('selected_item', function(selected_item) {

			date=$rootScope.datePicker.date
			days=timeline_functions.days(moment(date.startDate),moment(date.endDate))
			//if($rootScope.selected_t_id==event.items[0]){	
					html=timeline_functions.event_html(selected_item,"","",moment(date.startDate).format("MMM Do YYYY") , moment(date.endDate).format("MMM Do YYYY")|| "",$rootScope.selected_notes ,days)
					var options={id:$scope.selected_timeline_id,content:html,name:selected_item}
					Timeline.update({
					id: $scope.selected_id,				
					}, options);				
					timeline_functions.updateItem(options)
	
			})
	 
	$scope.$watch('stack', function(stack) {
		
		
		 if(typeof(stack)!="undefined"){
			 
			   options={stack:stack}
		timeline_functions.updateOptions(options)
		  }
        })

        $scope.editing = [];
        $scope.timeline = Timeline.query();


		
		
        $scope.removeTimeline = function(id) {
            Timeline.remove({
                id: id
            })
        }
        Timeline.query({}, function(team) {
            _.each(team, function(row,index) {
		
		 
		 var timeline = $scope.timeline[index];
		 if(timeline.group=="Bristol Archives"){
            Timeline.remove({
                id: timeline._id
            }, function() {
               // $scope.timeline.splice(index, 1);
            });
			}
			
            })
        })
		
	
        $scope.save = function() {
		
            if (!$scope.newTimeline || $scope.newTimeline.length < 1) return;
            var timeline = new Timeline({
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
            Timeline.update({
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
            Timeline.remove({
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
        $scope.changedValue = function(type) {
            $scope.data = []
            $scope.series = []
            $scope.category = []
            $scope.type = type
            plot_graph()
        }


        $scope.machinesx = ["all"]
        $scope.filterCondition = {
            machine: 'neq'
        }
        $scope.$watch('type', function(type) {
            $scope.machinesx = ["all"]


        })

  

        $scope.$watch('machine', function() {



            })
            // selected fruits
        $scope.machine_types_selection = [];



        $scope.categories = [];

        // selected fruits
        $scope.category_selection = [];




        var _data = [];
        $scope.data = []
        $scope.day_data = []
        $scope.team = [];
        $scope.labels = $scope.team
        $scope.chart_title = "Machine activity"

        var timeline

     

            var groups = new vis.DataSet();
            var dates = new vis.DataSet();
			var dates = new vis.DataSet();
			var second_dates = new vis.DataSet();
            var all_groups = []
            var i = 0

      

      install_days_tally = 0
	  install_instance_tally=0 
	  derig_tally = 0
	 derig_days_tally=0
            Timeline.query({}, function(team) {
			 
                _.each(team, function(data) {
				
				
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
						if( 	$rootScope.added_track_groups.indexOf(data._type)==-1){	
						
						 $rootScope.added_track_groups.push(data._type)
						  //	$rootScope.track_groups.push({"track":data._type})
						}
							
							
						   second_dates.add({
								_id: data._id,
								className:data.className,
								select_group :false,
								name:data.name,
								_type:data._type,
								track:data._type,
								content: timeline_functions.event_html(data.name,"","",moment(data.start_date).format("MMM Do YY") , end_date ||"",data.notes ,data.days),
								group: data.group||"NA",
								order:data._type,
								notes: data.notes,
								title:data.notes,
								start: data.start_date,
								days:data.days,
								end: data.end_date 
							})
						}
                    }
                })
			  timeline_functions.get_events().then(function(data) {
			  			
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
			
			   _.each(data.data, function(events) {
			   _.each(events, function(event) {
												
											//if( event.startDate!=""){
												
											//if( checked_event_types.indexOf(event.type)>=0){	
											if( event.type=="Exhibition"||event.type=="Gallery"){
											var end_date=new Date(event.endDate)
											
											if(event.endDate==""||event.endDate==event.startDate){
										
											var end_date=new Date(event.startDate)
											//end_date.setDate(end_date.getDate() + 1)
										
											}
											var group =	"NA"
											if( event.type=="Exhibition"||event.type=="Gallery"){
											 group =	event.event_space||"NA" 
											}
											else{
												 group =	event.type ||"NA"
											}
													
												var eventimages = false
												if(event.images[0]){
												eventimages=event.images[0].irn
												}
												var htmlContent =  timeline_functions.event_html(event.name,true&&event.images[0],eventimages,event.startDate,event.endDate)
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
													dates.add({
																		group		:	group, 
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
																		
											//}
											}

			  })
			    })
			
			_.each(second_dates._data, function(date) {
			dates.add(date)
			})
			$scope.total_install_derig=install_days_tally+derig_days_tally
			$scope.average_install_length=Math.round(install_days_tally/install_instance_tally)
			$scope.average_derig_length=Math.round(derig_days_tally/derig_tally)
				  timeline_functions.setup(Timeline,groups,dates)
				  
				

		$scope.team_leave()
	

	
	$scope.learning_bookings()
	$scope.loans()
	$scope.shopify()
	
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
	   })

	

		

	
	$scope.$watch('track_groups|filter:{selected:true}', function (nv) {
    var selection = nv.map(function (track_groups) {
      return track_groups.track;
    });
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
  

			
            })
			
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
	$scope.leaveChanged= function(leave){
				
		
	}
	

				
			$scope.team_leave= function(){
			
			if( $scope.isloggedin){
			
			console.log($scope.user)
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_leave_functions.get_eventss().then(function(data) {
					 
						timeline_leave_functions.add_leave(data, function(leave_dates){
							 
							 $rootScope.leave_groups = timeline_functions.loadgroups(leave_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							
							 _.each(leave_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
					
			}
			
			}
			
			$scope.shopify= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  Shopify_aggregate.query({}, function(datax) {
					
						timeline_shopify_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
			}
				$scope.loans= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_loans_functions.get_events().then(function(datax) {
					
						timeline_loans_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
			}
			
		
			
			
			$scope.timeline_googlesheets_functions= function(data_settings){
			
					var groups =$rootScope.groups
					$rootScope.timeline.setGroups(groups);
					timeline_googlesheets_functions.get_events(data_settings)
				  		  
			}
			
		
			
			
			$scope.learning_bookings= function(){
			
			 var groups =$rootScope.groups
			 
			  $rootScope.timeline.setGroups(groups);
			  
				  timeline_learning_functions.get_events().then(function(datax) {
					
						timeline_learning_functions.add_events(datax, function(public_dates){
							
							 $rootScope.leave_groups = timeline_functions.loadgroups(public_dates)
							 
						
						
							_.each($rootScope.leave_groups, function(_group) {
								
								$rootScope.groups.push(_group)
							})
							
							 console.log('$rootScope.groups',$rootScope.groups)
							 _.each(public_dates._data, function(date) {
								$rootScope.timeline.itemsData.getDataSet().add(date)
							})
						})
					})
			
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
			
		


        })

    };
	
	
	 
 
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
		console.log(locked)
		$scope.locked=locked
  })
  }
  
  exports.add_timeline_info_box=    function($scope, $http, $q, $routeParams, $location,
         $location, $rootScope, trello, get_trello_board, date_calc, Todos, Timeline, Team, kiosk_activity,timeline_functions,timeline_leave_functions,timeline_learning_functions,timeline_loans_functions,timeline_googlesheets_functions,Timeline_data,AuthService,timeline_shopify_functions,Shopify_aggregate
    ) {

  }
}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-controller.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.timeLine = function() {
  return {
   controller: 'timeline_controller',
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
	
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-directive.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],28:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],29:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

exports.timeline_leave_functions =  function ($http,Timeline,$rootScope) {

  return {
  
     get_eventss: function() {
      return $http.get("https://script.google.com/macros/s/AKfycbzij_r2bTK6fiWU-h29rglHktd8pwbLfrti82Or68TkEjEHrOc/exec?id=1v69qKCc-8FYx8VuKPZMr1QkTMfJsh7qZTZJ7q7o3YTg");  //1. this returns promise
    },
  
  
  
  	add_leave: function (eventss, fn){
	
								
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
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
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
},{"b55mWE":4,"buffer":3}],31:[function(require,module,exports){
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
},{"b55mWE":4,"buffer":3}],32:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){


exports.timeline_functions = function ($http,Timeline,$rootScope) {
	

  return {
  
  
  export_JSON_to_CSV: function(JSONData, ReportTitle, ShowLabel){
  
  
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    console.log('arrData',arrData)
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

                        if (!$('.already-dropped').length) {
                            $('body').addClass('already-dropped');
                            setTimeout(function() {
                                $('.already-dropped').removeClass('already-dropped');
                            }, 100);
                            event.preventDefault()
                            time=(timeline.getEventProperties(event).time)
							group=(timeline.getEventProperties(event).group)
							//type=(timeline.getEventProperties(event).type)
                            $(ui.draggable[0]).hide()
							
							if(ui.draggable[0].innerHTML=="PROVISIONAL DATE"){
                            self.prettyPrompt('Add item', 'Enter text content for new item:',"", function(value) {
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
							_days=self.days(moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d)
                            var new_date = {
                                content: self.event_html(value,"","",moment(date_dropped).startOf('day')._d,moment(date_dropped).add(days, 'days')._d, "",_days),
								name:value,
                                group: group,
                                className:colour||"",
								_type:ui.draggable[0].innerHTML,
                                start_date: new Date(moment(date_dropped).startOf('day')._d),
                                end_date: new Date (moment(date_dropped).add(days, 'days')._d),
								days:_days

                            }
                            var _timeline = new Timeline(new_date)
                                .$save(function(_item) {
                                    new_date.start =_item.start_date
                                    new_date.end = _item.end_date
                                    new_date._id = _item._id
									new_date._type=ui.draggable[0].innerHTML,
                                    timeline.itemsData.getDataSet().add(new_date)
									
                                    setTimeout(function() {
                                        $(ui.draggable[0]).show()
                                    }, 1 * 1000);

                                });
							
							
							}
                        }



                    }
                })
				},
	  
	  unlock: function(unlock){
		
                      if(timeline){    
								timeline.setOptions({'editable':unlock});
								}
			
							
		  	
	  
	  },
	  
	   	changeTracks: function(selection){

				var groups = new vis.DataSet($rootScope.groups);
				var group = new vis.DataSet( $rootScope.leave_groups);
				var list =groups.get({
						filter: function(item) {
							
							return (  selection.indexOf(item.track)!=-1);
						}
					})
					
						timeline.setGroups(list);
						
					
						this.enable_event_drop()
		
				},  
		changeGroups: function(selection){

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
  
  		  loadgroups: function(items){
	
			var _groups=[]
			var addednames=[]
			
			 _.each(items._data, function(value) {
			
			if(value.start_date!="0000-00-00" && value.end_date!="0000-00-00"&& value.start_date!="" &&value.end_date!=""&&value.project_name!=""){
				
				if($.inArray(value.group, $rootScope.addednames)==-1 ){
					$rootScope.addednames.push(value.group)
					//n.b. may be able to order groups when locatiobn hierarchy given in emu
					content=value.group ||"NA"
					if( value.group.toLowerCase()=="temporary exhibition gallery"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="window on bristol"){ content="<b>M SHED:</b> "+value.group}
					if( value.group.toLowerCase()=="first floor foyer"){ content="<b>M SHED:</b> "+value.group}
					 
					 _groups.push({
										id				:	value.group,
										//display		:	'shown',
										track			:value.track,
										order:value.order,
										event_type		:	value.event_type,
										content			:   content,
										event_typeSORT	: content,
										 selected: value.select_group 
									})
				}
				}
			})

			console.log(_groups)
			return _groups		

		},
  
   		 event_html: function(name,showimage,image,start_date,end_date,notes ,days){
			var notes=notes ||""
				var htmlContent = '<div class="titlediv" >'
																htmlContent+='<div class="title_heading">'
																	if(showimage){
																	htmlContent+='<div class="image_box">'
																	htmlContent+='<img src="http://museums.bristol.gov.uk/multimedia/entry.php?request=resource&irn='+image +'&height=50&format=jpeg" />'
																	htmlContent+='</div>'	
																}	
																htmlContent+=name
																	if(days>0 &&end_date){
																		//htmlContent+='<div class="days">'
																		htmlContent+=" - "+ days + " days"
																		//htmlContent+='</div>';
																}
																htmlContent+='</div>';
																
																htmlContent+="<span> ";
																htmlContent+=start_date 
																if(end_date) {htmlContent+= "-" + end_date};
																htmlContent+="<span>";
																htmlContent+= '</div>'
																htmlContent+='<div class="notes">'
																htmlContent+="<p>"+notes
																
																											
													htmlContent+= '</div>'
													
			return htmlContent

			},
				selected_data:	 function (event) {
			 var self=this
			 	console.log('get ID to update')
					selected_timeline_id=event.items[0]
			 if(selected_timeline_id){
			 //newly selected - get ID to update
				
			//fetch the timeline dataSetitem 
					selected_item =	timeline.itemsData.getDataSet().get(selected_timeline_id)
			//update the data entry form
			console.log(selected_item)
			
			$rootScope.selected_timeline_id=selected_timeline_id
			$rootScope.selected_item=selected_item.name
			$rootScope.selected_type=selected_item._type
			if(selected_item.days>0){
			$rootScope.selected_days=" - " +selected_item.days + " days"
			}
			$rootScope.selected_id=selected_item._id
			$rootScope.selected_notes=selected_item.notes
			console.log('startDate'+new Date(selected_item.start))
			$rootScope.datePicker.date={startDate:new Date(selected_item.start),endDate:new Date (selected_item.end)}
			
}
            },
   get_events: function() {
      return $http.get('http://museums.bristol.gov.uk/sync/data/events.JSON');  //1. this returns promise
    },
	
	updateOptions: function(options){

		$rootScope.timeline.setOptions(options)
			
				
	},
	updateItem: function(options){
		if(typeof(timeline)!="undefined"){
		timeline.itemsData.getDataSet().update(options)
		}
			
	},
	
    setup: function(Timeline,groups,dates) {
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
						
					//groupEditable:true,
					stack:false,
					orientation:{"axis":"top"},
                    editable: false,  
					 groupOrder:'order',					
                    onMove: function(item, callback) {
$rootScope.datePicker.date={startDate:new Date(item.start),endDate:new Date (item.end)}
                        var _timeline = new Timeline({
                          //  content: item.content,
							 content:  self.event_html(item.name,"","",item.start, item.end,item.notes ),
                            group: item.group,
                            start_date: item.start,
                            end_date: item.end,
                            _id: item._id
                        })
                       
                        Timeline.update({
                            id: item._id
                        }, _timeline);

                        callback(item);

                    },
                    onUpdate: function(item, callback) {

                        self.prettyPrompt('Update item', 'Edit items text:', item.content, function(value) {
                            if (value) {
                                item.content = value;
                                callback(item); // send back adjusted item

									days=self.days(item.start, item.end)
                                var _timeline = new Timeline({
                                    content:  self.event_html(value,"","",item.start, item.end,item.notes ,days),
									name: item.name,
                                    group: item.group,
                                    start_date: item.start,
                                    end_date: item.end,
									days:self.days(item.start,item.end)

                                })
                               
                                Timeline.update({
                                    id: item._id
                                }, _timeline);
                                callback(item);
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
																		
     
                                var _timeline = new Timeline({
                                        content: self.event_html(value,"","",item.start, moment(item.start).add(5, 'days'),"" ,days),
										name:value,
                                        group: item.group,
										type:"note",
                                        start_date: item.start,
										className:"green"
                                       // end_date: moment(item.start).add(5, 'days'),
										//days:self.days(item.start, moment(item.start).add(5, 'days'))

                                    })
                                    .$save(function(_item) {
                                       // item.end = new Date(_item.end_date)
                                        item._id = _item._id
										  editable: true,
                                        //callback(item);
                                        console.log('add');
                                    });
                            } else {
                                callback(null); // cancel item creation
                            }
                        })


                    },
                    onRemove: function(item, callback) {

                        if (item._id) {
                            Timeline.remove({
                                id: item._id
                            })
                            callback(item);
                        } else {
                            sweetAlert('you can\'t remove this item from here, sorry :)')
                            return false;

                        }
                    }
                };

  var container = document.getElementById('example-timeline');
  
  
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
				groups=self.loadgroups(dates)
				$rootScope.rawData=dates
				$rootScope.groups=groups
				var groups = new vis.DataSet(groups);
				
           
						
				var list = groups.get({
						filter: function(item) {
							return (item);
						}
				})
					
				timeline.setGroups(list);
					$rootScope.myGroup = {
					selected:{}
				};
				$rootScope.groups=list
			
		
				 
                timeline.setItems(dates);
                timeline.setOptions(options);
				timeline.fit()
				
				//self.changeGroups($rootScope.groups.selected)
				
				timeline.on('select', function (properties) {
						self.selected_data( properties)

				});
				
				
					$rootScope.timeline=timeline					
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
                    self.logEvent(event, properties);
                });

			
				self.enable_event_drop()
              
    }
	 
  };
}

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/timeline/timeline-services.js","/../components/timeline")
},{"b55mWE":4,"buffer":3}],33:[function(require,module,exports){
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
												console.log('shop products',eventss)
												$.each(eventss, function( index, event ) {	
													console.log('shop event',event)
												
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
console.log('shopEvent',shopEvent)																		
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
},{"b55mWE":4,"buffer":3}],34:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.users_controller = function($scope, $http, $q, $routeParams, $location,$rootScope, Team
    ) {
	console.log('controller go')
		$scope.gridOptions=[]
		$scope.gridOptions.data=[]
		$scope.gridOptions.columnDefs = [   ]
		$scope.gridOptions = {
			columnDefs: [
			{ field: 'username' ,resizable: true},
			{ field: 'password' ,resizable: true},
			{ field: 'email' ,resizable: true},
			{ field: 'firstName' ,resizable: true},
			{ field: 'lastName' ,resizable: true},
			{ field: 'team' ,resizable: true},
			{ field: 'trello_doing_id' ,resizable: true},
			{ field: 'score' ,resizable: true},
			{ field: 'bonus' ,resizable: true},
			{ field: 'leave_start' ,resizable: true},
			{ field: 'leave_taken' ,resizable: true},
			{ field: 'number_days_leave' ,resizable: true}
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


var key = colDef.field;
var obj = {};
obj[key] = newValue;



var query = {'id':rowEntity._id};

		
			
				var query = {'id':rowEntity._id};
			Team.update(query, 
			obj
					, function(err, affected, resp) {
					console.log(resp)
			})
			
			});
			}
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
},{"b55mWE":4,"buffer":3}],35:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	exports.userAdmin = function() {
  return {
   controller: 'users_controller',
    templateUrl: './components/user-admin/users-page.html'
  }
	}
	


}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../components/user-admin/users-directive.js","/../components/user-admin")
},{"b55mWE":4,"buffer":3}],36:[function(require,module,exports){
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






}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/controllers.js","/controllers")
},{"b55mWE":4,"buffer":3}],37:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
	
exports.NavController = function($location,AuthService,$scope,$http) {

  $scope.user="not logged in"
  AuthService.isLoggedIn().then(function(user){
	  $scope.user=(user.data)
  })
 $scope.$location = $location;
       
    
};

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/navbar-controller.js","/controllers")
},{"b55mWE":4,"buffer":3}],38:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

	exports.userMenu = function() {
  return {
    controller: 'NavController',
    templateUrl: './shared/templates/user_menu.html'
  }
	}
	

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/directives/directives.js","/directives")
},{"b55mWE":4,"buffer":3}],39:[function(require,module,exports){
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


var dashboard_controllers = require('../components/machine-monitor/dashboard-controller');
var feedback_controllers = require('../components/machine-monitor/feedback-controller');
var satisfaction_controllers = require('../components/machine-monitor/satisfaction-controller');


var downtime_controllers = require('../components/machine-monitor/downtime-controller');


var app_controllers = require('../components/team/app-controllers');
var leave_controllers = require('../components/team/leave-controller');
var team_controllers = require('../components/team/team-controller');
var member_controllers = require('../components/member/member-controller');
var form_controllers = require('../components/team/form-controller');
var timeline_controllers = require('../components/timeline/timeline-controller');
var shopify_controllers = require('../components/shopify/shopify-controller');
var timeline_settings_controller = require('../components/timeline-settings/timeline-settings-controller');
var users_controller = require('../components/user-admin/users-controller');

var directives = require('../shared/directives/directives');
var tech_support_directives = require('../components/tech-support/tech-support-directive');
var users_directives = require('../components/user-admin/users-directive');
var timeline_directives = require('../components/timeline/timeline-directive');
var shopify_directives = require('../components/shopify/shopify-directive');

var data_services = require('../shared/services/data-services');
var app_services = require('../shared/services/app-services');

var timeline_services = require('../components/timeline/timeline-services');
var timeline_leave_services = require('../components/timeline/timeline-leave-services');
var timeline_shopify_functions = require('../components/timeline/timeline-shopify-services');



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
		'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.edit','ui.grid.resizeColumns',
		 'ngMessages', 'material.svgAssetsCache'
		])
		
		
	
	
_.each(controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(feedback_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(satisfaction_controllers, function(controller, name) {
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


_.each(downtime_controllers, function(controller, name) {
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


_.each(form_controllers, function(controller, name) {
  app.controller(name, controller);
});
_.each(timeline_controllers, function(controller, name) {
  app.controller(name, controller);
});

_.each(shopify_controllers, function(controller, name) {
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


app.config(['$locationProvider', function($locationProvider) {
  $locationProvider.hashPrefix('');
  //$locationProvider.html5Mode(true).hashPrefix('!');
}]);


app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);

}).call(this,require("b55mWE"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_43aad758.js","/")
},{"../components/machine-monitor/dashboard-controller":8,"../components/machine-monitor/dead-controller":9,"../components/machine-monitor/downtime-controller":10,"../components/machine-monitor/downtime-services":11,"../components/machine-monitor/feedback-controller":12,"../components/machine-monitor/feedback-services":13,"../components/machine-monitor/satisfaction-controller":14,"../components/member/member-controller":15,"../components/shopify/shopify-controller":16,"../components/shopify/shopify-directive":17,"../components/team/app-controllers":18,"../components/team/form-controller":19,"../components/team/leave-controller":20,"../components/team/team-controller":21,"../components/tech-support/tech-support-controller":22,"../components/tech-support/tech-support-directive":23,"../components/tech-support/trello-services":24,"../components/timeline-settings/timeline-settings-controller":25,"../components/timeline/timeline-controller":26,"../components/timeline/timeline-directive":27,"../components/timeline/timeline-googlesheets-services":28,"../components/timeline/timeline-learning-bookings-services":29,"../components/timeline/timeline-leave-services":30,"../components/timeline/timeline-loans-services":31,"../components/timeline/timeline-services":32,"../components/timeline/timeline-shopify-services":33,"../components/user-admin/users-controller":34,"../components/user-admin/users-directive":35,"../shared/controllers/controllers":36,"../shared/controllers/navbar-controller":37,"../shared/directives/directives":38,"../shared/services/app-services":40,"../shared/services/data-services":41,"b55mWE":4,"buffer":3,"underscore":7}],40:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

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
},{"b55mWE":4,"buffer":3}],41:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var status = require('http-status');


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
},{"b55mWE":4,"buffer":3,"http-status":5}]},{},[39])