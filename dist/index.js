/******/ (function(modules) { // webpackBootstrap
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

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _baxter = __webpack_require__(1);
	
	var _baxter2 = _interopRequireDefault(_baxter);
	
	(function (name, lib, browserContext) {
	    if (browserContext) {
	        browserContext[name] = lib;
	    } else if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = lib;
	        }
	        exports[name] = lib;
	    }
	})('baxter', _baxter2['default'], window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _servicesEvent = __webpack_require__(2);
	
	var _servicesEvent2 = _interopRequireDefault(_servicesEvent);
	
	var _entitiesError = __webpack_require__(3);
	
	var _entitiesError2 = _interopRequireDefault(_entitiesError);
	
	/**
	 * @class Baxter
	 * @description Main class, provides library as it self.
	 */
	
	var Baxter = (function () {
	    function Baxter() {
	        var _this = this;
	
	        _classCallCheck(this, Baxter);
	
	        /**
	         * @description Basic unique id, other uids are incremented from this
	         * @type {number}
	         */
	        var UID = 1;
	
	        /**
	         * @name Baxter._callstack
	         * @type {Map}
	         */
	        this._callstack = new Map();
	
	        /**
	         * @name Baxter._variables
	         * @type {Map}
	         */
	        this._variables = new Map();
	
	        /**
	         * @name Baxter.eventStream
	         * @type {EventService}
	         * @description Provides events service
	         */
	        this.eventStream = new _servicesEvent2['default'](this);
	
	        /**
	         * @name Baxter.utils
	         * @type {Object}
	         */
	        this.utils = {
	            /**
	             * @name Baxter.utils.createObjectUID
	             * @param object
	             * @returns {number}
	             */
	            createObjectUID: function createObjectUID(object) {
	                var uid = UID++;
	
	                Object.defineProperty(object, '__uid__', {
	                    enumerable: false,
	                    value: uid
	                });
	
	                return uid;
	            },
	
	            /**
	             * @name Baxter.utils.getUIDByObject
	             * @param object
	             * @returns {*}
	             */
	            getUIDByObject: function getUIDByObject(object) {
	                if (!object['__uid__']) {
	                    return _this.utils.createObjectUID(object);
	                }
	
	                return object['__uid__'];
	            },
	
	            /**
	             * @name Baxter.utils.createKeyUID
	             * @param owner
	             * @param key
	             * @returns {string}
	             */
	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            },
	
	            /**
	             * @name Baxter.utils.debounce
	             * @param {Function} func
	             * @param {Number} wait
	             * @returns {Function} debounced function
	             */
	            debounce: function debounce(func, wait) {
	                var timeout;
	                return function () {
	                    var later = function later() {
	                        func();
	                        timeout = null;
	                    };
	                    clearTimeout(timeout);
	                    timeout = setTimeout(later, wait);
	                };
	            }
	        };
	
	        this._watchers = {
	            variable: {
	                get: function get(config) {
	                    var value = config.getValue();
	
	                    _this.postEvent('get', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: value
	                    });
	                    return value;
	                },
	                set: function set(config, newValue) {
	                    var oldValue = config.getValue();
	
	                    if (newValue === oldValue) {
	                        return false;
	                    }
	
	                    _this.postEvent('will-change', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key
	                    });
	
	                    config.setValue(newValue);
	
	                    _this.postEvent('update', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: newValue,
	                        oldValue: oldValue
	                    });
	                }
	            },
	            computed: {
	                get: function get(config) {
	                    var value = config.getValue();
	
	                    _this.postEvent('get', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: value
	                    });
	
	                    return value;
	                },
	                set: function set(config, computedResult) {
	                    var oldValue = config.getValue();
	
	                    if (!config.isComputing()) {
	                        throw new _entitiesError2['default']('you can\'t set value to computed');
	                    }
	
	                    if (computedResult === oldValue) {
	                        return false;
	                    }
	
	                    config.setIsComputing(false);
	                    config.setValue(computedResult);
	
	                    _this.postEvent('update', {
	                        uid: config.uid,
	                        owner: config.owner,
	                        key: config.key,
	                        value: computedResult,
	                        oldValue: oldValue
	                    });
	                }
	            }
	        };
	
	        this.subscribeEvent('will-change', this.utils.debounce(function () {
	            return _this.postEvent('will-change-all');
	        }, 0));
	    }
	
	    /**
	     * @name Baxter.createClosure
	     * @param {Function} func
	     * @param {*} config
	     * @returns {Function}
	     */
	
	    _createClass(Baxter, [{
	        key: 'createClosure',
	        value: function createClosure(func, config) {
	            return function (data) {
	                return func(config, data);
	            };
	        }
	
	        /**
	         * @name Baxter.subscribeEvent
	         * @param {String} eventType
	         * @param {Function} subscriber
	         * @param {Boolean} [once]
	         */
	    }, {
	        key: 'subscribeEvent',
	        value: function subscribeEvent(eventType, subscriber) {
	            var _this2 = this;
	
	            var once = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	            if (typeof eventType !== 'string') {
	                throw new _entitiesError2['default']('subscribeEvent: eventType is not defined.');
	            }
	
	            if (typeof subscriber !== 'function') {
	                throw new _entitiesError2['default']('subscribeEvent: subscriber function is not defined.');
	            }
	
	            if (once) {
	                this.eventStream.once(eventType, subscriber);
	            } else {
	                this.eventStream.on(eventType, subscriber);
	
	                return {
	                    dispose: function dispose() {
	                        return _this2.eventStream.off(eventType, subscriber);
	                    }
	                };
	            }
	        }
	
	        /**
	         * @name Baxter.postEvent
	         * @param {String} eventType
	         * @param {*} [data]
	         */
	    }, {
	        key: 'postEvent',
	        value: function postEvent(eventType, data) {
	            if (typeof eventType !== 'string') {
	                throw new _entitiesError2['default']('postEvent: eventType is not defined.');
	            }
	
	            this.eventStream.post(eventType, data);
	        }
	
	        /**
	         * @name Baxter.subscribe
	         * @param {Object} owner
	         * @param {String} key
	         * @param {Function} subscriber
	         * @param {String} [eventType]
	         * @param {Boolean} [once]
	         * @throws {BaxterError}
	         */
	    }, {
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            var eventType = arguments.length <= 3 || arguments[3] === undefined ? 'update' : arguments[3];
	            var once = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
	            if (!owner || !key || !subscriber) {
	                throw new _entitiesError2['default']('subscribe: can\'t subscribe variable without owner, key or callback function.');
	            }
	            var uid = this.utils.createKeyUID(owner, key);
	            var availableEvents = ['will-change', 'update'];
	            var eventToListen = availableEvents.indexOf(eventType) !== -1 && eventType;
	            var eventHandler = function eventHandler(config) {
	                if (config.uid === uid) {
	                    subscriber(config.value, config.oldValue);
	                }
	            };
	
	            if (!eventToListen) {
	                throw new _entitiesError2['default']('subscribe: listening ' + eventType + ' event is not accepted.');
	            }
	
	            return this.subscribeEvent(eventToListen, eventHandler, once);
	        }
	
	        /**
	         * @name Baxter.resolve
	         * @param {Set|Array} dependencies
	         * @returns {Promise}
	         */
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            if (!(Symbol.iterator in dependencies)) {
	                throw new _entitiesError2['default']('resolve: dependencies are not iterable.');
	            }
	
	            var result = new Set();
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var dependency = _step.value;
	
	                    result.add(this._callstack.get(dependency));
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator['return']) {
	                        _iterator['return']();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	
	            return Promise.all(result);
	        }
	
	        /**
	         * @name Baxter.getDependencies
	         * @param {Object} context
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {*} Result of computing
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(context, computed, callback) {
	            if (!context || !computed || !callback) {
	                throw new _entitiesError2['default']('getDependencies: there is no context, computed function or callback.');
	            }
	
	            var listener = this.subscribeEvent('get', callback);
	            var computingResult = computed.call(context);
	
	            listener.dispose();
	
	            return computingResult;
	        }
	
	        /**
	         * @name Baxter.addToStack
	         * @param {Object} owner
	         * @param {String} key
	         * @param {Function} callback
	         */
	    }, {
	        key: 'addToStack',
	        value: function addToStack(owner, key, callback) {
	            var _this3 = this;
	
	            var uid = this.utils.createKeyUID(owner, key);
	
	            this.postEvent('will-change', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });
	
	            this._callstack.set(uid, new Promise(function (resolve) {
	                _this3.subscribeEvent('will-change-all', function () {
	                    resolve(callback());
	                }, true);
	            }).then(function () {
	                _this3._callstack['delete'](uid);
	                if (!_this3._callstack.size) {
	                    _this3.postEvent('change-complete');
	                }
	            }));
	        }
	
	        /**
	         * @name Baxter.variable
	         * @param {Object} owner
	         * @param {String} key
	         * @param {*} [initialValue]
	         * @returns {*} initialValue
	         */
	    }, {
	        key: 'variable',
	        value: function variable(owner, key, initialValue) {
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('variable: owner object in not defined.');
	            }
	            if (typeof key !== 'string') {
	                throw new _entitiesError2['default']('variable: key string in not defined.');
	            }
	
	            var value = initialValue;
	            var uid = this.utils.createKeyUID(owner, key);
	            var utils = {
	                getValue: function getValue() {
	                    return value;
	                },
	                setValue: function setValue(newValue) {
	                    return value = newValue;
	                }
	            };
	
	            if (this._variables.has(uid)) {
	                return initialValue;
	            }
	
	            this._variables.set(uid, new Set());
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.variable.get, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    getValue: utils.getValue
	                }),
	                set: this.createClosure(this._watchers.variable.set, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    setValue: utils.setValue,
	                    getValue: utils.getValue
	                })
	            });
	
	            return value;
	        }
	
	        /**
	         * @name Baxter.computed
	         * @param {Object} owner
	         * @param {String} key
	         * @param {Function} computedObservable
	         * @param {Set|Map|Array} [userDependencies]
	         * @returns {*}
	         */
	    }, {
	        key: 'computed',
	        value: function computed(owner, key, computedObservable, userDependencies) {
	            var _this4 = this;
	
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('computed: owner object in not defined.');
	            }
	
	            if (typeof key !== 'string') {
	                throw new _entitiesError2['default']('computed: key string in not defined.');
	            }
	
	            if (typeof computedObservable !== 'function') {
	                throw new _entitiesError2['default']('computed: computedObservable function in not defined.');
	            }
	
	            if (this._variables.has(uid)) {
	                return computedObservable;
	            }
	
	            var latestValue = undefined;
	            var previousValue = undefined;
	            var _isComputing = false;
	            var dependencies = new Set();
	            var handlers = new Set();
	            var uid = this.utils.createKeyUID(owner, key);
	            var utils = {
	                getValue: function getValue() {
	                    return latestValue;
	                },
	                setValue: function setValue(newValue) {
	                    return latestValue = newValue;
	                },
	                setIsComputing: function setIsComputing(value) {
	                    return _isComputing = value;
	                },
	                isComputing: function isComputing() {
	                    return _isComputing;
	                }
	            };
	
	            this._variables.set(uid, handlers);
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: this.createClosure(this._watchers.computed.get, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    getValue: utils.getValue
	                }),
	                set: this.createClosure(this._watchers.computed.set, {
	                    uid: uid,
	                    owner: owner,
	                    key: key,
	                    setValue: utils.setValue,
	                    getValue: utils.getValue,
	                    isComputing: utils.isComputing,
	                    setIsComputing: utils.setIsComputing
	                })
	            });
	
	            var handleObservable = function handleObservable(handledValue) {
	                dependencies.add(handledValue.uid);
	
	                var subscriber = _this4.subscribe(handledValue.owner, handledValue.key, function () {
	                    if (_isComputing) {
	                        return false;
	                    }
	
	                    _isComputing = true;
	
	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            previousValue = latestValue;
	                            return computedObservable.call(owner);
	                        }).then(function (value) {
	                            owner[key] = value;
	                        })['catch'](function () {
	                            owner[key] = undefined;
	                        });
	                    });
	                }, 'will-change');
	
	                handlers.add(subscriber);
	            };
	
	            if (Symbol.iterator in Object(userDependencies)) {
	                var _iteratorNormalCompletion2 = true;
	                var _didIteratorError2 = false;
	                var _iteratorError2 = undefined;
	
	                try {
	                    for (var _iterator2 = userDependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	                        var userDependency = _step2.value;
	
	                        handleObservable(userDependency);
	                    }
	                } catch (err) {
	                    _didIteratorError2 = true;
	                    _iteratorError2 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	                            _iterator2['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError2) {
	                            throw _iteratorError2;
	                        }
	                    }
	                }
	            }
	
	            var calculatedValue = this.getDependencies(owner, computedObservable, handleObservable);
	            if (calculatedValue instanceof Promise) {
	                calculatedValue.then(function (result) {
	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            _isComputing = true;
	                            owner[key] = result;
	                        });
	                    });
	                });
	            } else {
	                _isComputing = true;
	                owner[key] = calculatedValue;
	            }
	
	            return latestValue;
	        }
	
	        /**
	         * @name Baxter.watch
	         * @param {Object} object
	         */
	    }, {
	        key: 'watch',
	        value: function watch(object) {
	            if (typeof object !== 'object') {
	                throw new _entitiesError2['default']('watch: object is not defined.');
	            }
	
	            var computedVariables = [];
	
	            for (var key in object) {
	                if (!object.hasOwnProperty(key)) {
	                    continue;
	                }
	
	                var value = object[key];
	                if (typeof value === 'function') {
	                    computedVariables.push({
	                        owner: object,
	                        key: key,
	                        value: value
	                    });
	                } else {
	                    this.variable(object, key, value);
	                }
	            }
	
	            for (var index = 0, computedLength = computedVariables.length; index < computedLength; index++) {
	                var computed = computedVariables[index];
	                this.computed(computed.owner, computed.key, computed.value);
	            }
	
	            return object;
	        }
	
	        /**
	         * @name Baxter.dispose
	         * @param {Object} owner
	         * @param {String} [key]
	         */
	    }, {
	        key: 'dispose',
	        value: function dispose(owner, key) {
	            if (typeof owner !== 'object') {
	                throw new _entitiesError2['default']('Dispose: object is not defined.');
	            }
	
	            if (!key) {
	                var _iteratorNormalCompletion3 = true;
	                var _didIteratorError3 = false;
	                var _iteratorError3 = undefined;
	
	                try {
	                    for (var _iterator3 = Object.keys(owner)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	                        var field = _step3.value;
	
	                        var uid = this.utils.createKeyUID(owner, field);
	                        var handlers = this._variables.get(uid);
	
	                        if (!handlers) {
	                            continue;
	                        }
	
	                        var _iteratorNormalCompletion4 = true;
	                        var _didIteratorError4 = false;
	                        var _iteratorError4 = undefined;
	
	                        try {
	                            for (var _iterator4 = handlers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	                                var handler = _step4.value;
	
	                                handler.dispose();
	                                delete owner[field];
	                            }
	                        } catch (err) {
	                            _didIteratorError4 = true;
	                            _iteratorError4 = err;
	                        } finally {
	                            try {
	                                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
	                                    _iterator4['return']();
	                                }
	                            } finally {
	                                if (_didIteratorError4) {
	                                    throw _iteratorError4;
	                                }
	                            }
	                        }
	
	                        this._variables['delete'](uid);
	                    }
	                } catch (err) {
	                    _didIteratorError3 = true;
	                    _iteratorError3 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                            _iterator3['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError3) {
	                            throw _iteratorError3;
	                        }
	                    }
	                }
	            } else {
	                var uid = this.utils.createKeyUID(owner, key);
	                var handlers = this._variables.get(uid);
	
	                if (!handlers) {
	                    return;
	                }
	
	                var _iteratorNormalCompletion5 = true;
	                var _didIteratorError5 = false;
	                var _iteratorError5 = undefined;
	
	                try {
	                    for (var _iterator5 = handlers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	                        var handler = _step5.value;
	
	                        handler.dispose();
	                        delete owner[key];
	                    }
	                } catch (err) {
	                    _didIteratorError5 = true;
	                    _iteratorError5 = err;
	                } finally {
	                    try {
	                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
	                            _iterator5['return']();
	                        }
	                    } finally {
	                        if (_didIteratorError5) {
	                            throw _iteratorError5;
	                        }
	                    }
	                }
	
	                this._variables['delete'](uid);
	            }
	        }
	    }]);
	
	    return Baxter;
	})();
	
	exports['default'] = new Baxter();
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * @class EventService
	 */
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var EventService = (function () {
	    function EventService(defaultContext) {
	        _classCallCheck(this, EventService);
	
	        /**
	         * @name EventService.channels
	         * @type {Object}
	         */
	        this.channels = {};
	
	        /**
	         * @name EventService.context
	         * @type {Object}
	         */
	        this.context = defaultContext || this;
	    }
	
	    /**
	     * @name EventService.getEvent
	     * @param {String} event
	     * @returns {Set}
	     */
	
	    _createClass(EventService, [{
	        key: "getEvent",
	        value: function getEvent(event) {
	            if (!(event in this.channels)) {
	                return this.channels[event] = new Set();
	            }
	
	            return this.channels[event];
	        }
	
	        /**
	         * @name EventService.on
	         * @param {string} event - Event name
	         * @param {function} handler - Callback function with data as argument
	         */
	    }, {
	        key: "on",
	        value: function on(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }
	
	            this.getEvent(event).add(handler);
	        }
	
	        /**
	         * @name EventService.once
	         * @param {string} event
	         * @param {function} handler
	         */
	    }, {
	        key: "once",
	        value: function once(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }
	
	            var that = this;
	
	            this.getEvent(event).add(handlerWrapper);
	
	            function handlerWrapper(data) {
	                that.off(event, handlerWrapper);
	                return handler(data);
	            }
	        }
	
	        /**
	         * @name EventService.off
	         * @param {string} event
	         * @param {function} [handlerToDelete]
	         * @returns {boolean}
	         */
	    }, {
	        key: "off",
	        value: function off(event, handlerToDelete) {
	            if (!event) {
	                throw new Error("Can't remove event listener: no event");
	            }
	
	            if (!handlerToDelete) {
	                return delete this.channels[event];
	            }
	
	            var eventHandlers = this.channels[event];
	
	            eventHandlers["delete"](handlerToDelete);
	
	            if (!eventHandlers.size) {
	                delete this.channels[event];
	            }
	        }
	
	        /**
	         * @name EventService.post
	         * @param {string} event
	         * @param {*} data
	         */
	    }, {
	        key: "post",
	        value: function post(event, data) {
	            if (!event) {
	                throw new Error("Can't post undefined event");
	            }
	
	            if (!(event in this.channels)) {
	                return false;
	            }
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = this.channels[event][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var handler = _step.value;
	
	                    handler.call(this.context, data);
	                }
	            } catch (err) {
	                _didIteratorError = true;
	                _iteratorError = err;
	            } finally {
	                try {
	                    if (!_iteratorNormalCompletion && _iterator["return"]) {
	                        _iterator["return"]();
	                    }
	                } finally {
	                    if (_didIteratorError) {
	                        throw _iteratorError;
	                    }
	                }
	            }
	        }
	    }]);
	
	    return EventService;
	})();
	
	exports["default"] = EventService;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * @name BaxterError
	 */
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var BaxterError = (function (_Error) {
	    _inherits(BaxterError, _Error);
	
	    function BaxterError(message) {
	        _classCallCheck(this, BaxterError);
	
	        _get(Object.getPrototypeOf(BaxterError.prototype), 'constructor', this).call(this);
	
	        this.message = '[Baxter.js]: ' + message;
	    }
	
	    return BaxterError;
	})(Error);
	
	exports['default'] = BaxterError;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2QwOTFhN2FhZDhlY2YyYmI0YWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7bUNDdENtQixDQUFVOzs7O0FBRTdCLEVBQUMsVUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBSztBQUM1QixTQUFJLGNBQWMsRUFBRTtBQUNoQix1QkFBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUM5QixNQUFNLElBQUksSUFBOEIsRUFBRTtBQUN2QyxhQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ2pELG9CQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7VUFDbEM7QUFDRCxnQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUN2QjtFQUNKLEVBQUUsUUFBUSx1QkFBVSxNQUFNLENBQUMsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQ1hILENBQWtCOzs7OzBDQUNuQixDQUFrQjs7Ozs7Ozs7O0tBTXBDLE1BQU07QUFDRyxjQURULE1BQU0sR0FDTTs7OytCQURaLE1BQU07Ozs7OztBQU1KLGFBQUksR0FBRyxHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTVosYUFBSSxDQUFDLFVBQVUsR0FB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QyxlQUFlLENBQUMsQ0FBQzs7QUFFdEMsaUJBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQ3JCLHdCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Y0FDL0I7VUFDSjs7Ozs7Ozs7O2dCQU9HLGNBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtBQUNkLGlCQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1IsdUJBQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztjQUNqRDs7QUFFRCxpQkFBSSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDM0Isd0JBQU8sS0FBSyxDQUFDO2NBQ2hCOzs7Ozs7O0FBRUQsc0NBQW9CLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLDhIQUFFO3lCQUFqQyxPQUFPOztBQUNaLDRCQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7a0JBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7VUFDSjs7O1lBeEdDLFlBQVk7OztzQkEyR0gsWUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQzNHckIsV0FBVztlQUFYLFdBQVc7O0FBQ0YsY0FEVCxXQUFXLENBQ0QsT0FBTyxFQUFFOytCQURuQixXQUFXOztBQUVULG9DQUZGLFdBQVcsNkNBRUQ7O0FBRVIsYUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFlLEdBQUcsT0FBTyxDQUFDO01BQzVDOztZQUxDLFdBQVc7SUFBUyxLQUFLOztzQkFRaEIsV0FBVyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgM2QwOTFhN2FhZDhlY2YyYmI0YWRcbiAqKi8iLCJpbXBvcnQgYmF4dGVyIGZyb20gJy4vYmF4dGVyJztcblxuKChuYW1lLCBsaWIsIGJyb3dzZXJDb250ZXh0KSA9PiB7XG4gICAgaWYgKGJyb3dzZXJDb250ZXh0KSB7XG4gICAgICAgIGJyb3dzZXJDb250ZXh0W25hbWVdID0gbGliO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbGliO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHNbbmFtZV0gPSBsaWI7XG4gICAgfVxufSkoJ2JheHRlcicsIGJheHRlciwgd2luZG93KTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2luZGV4LmpzXG4gKiovIiwiaW1wb3J0IEV2ZW50U2VydmljZSBmcm9tICcuL3NlcnZpY2VzL2V2ZW50JztcbmltcG9ydCBCYXh0ZXJFcnJvciBmcm9tICcuL2VudGl0aWVzL2Vycm9yJztcblxuLyoqXG4gKiBAY2xhc3MgQmF4dGVyXG4gKiBAZGVzY3JpcHRpb24gTWFpbiBjbGFzcywgcHJvdmlkZXMgbGlicmFyeSBhcyBpdCBzZWxmLlxuICovXG5jbGFzcyBCYXh0ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIEJhc2ljIHVuaXF1ZSBpZCwgb3RoZXIgdWlkcyBhcmUgaW5jcmVtZW50ZWQgZnJvbSB0aGlzXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICBsZXQgVUlEID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLl9jYWxsc3RhY2tcbiAgICAgICAgICogQHR5cGUge01hcH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NhbGxzdGFjayA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLl92YXJpYWJsZXNcbiAgICAgICAgICogQHR5cGUge01hcH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3ZhcmlhYmxlcyA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLmV2ZW50U3RyZWFtXG4gICAgICAgICAqIEB0eXBlIHtFdmVudFNlcnZpY2V9XG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBQcm92aWRlcyBldmVudHMgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbSA9IG5ldyBFdmVudFNlcnZpY2UodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlci51dGlsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51dGlscyA9IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmNyZWF0ZU9iamVjdFVJRFxuICAgICAgICAgICAgICogQHBhcmFtIG9iamVjdFxuICAgICAgICAgICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlT2JqZWN0VUlEOiAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVpZCA9IFVJRCsrO1xuXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgJ19fdWlkX18nLCB7XG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdWlkXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdWlkO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBAbmFtZSBCYXh0ZXIudXRpbHMuZ2V0VUlEQnlPYmplY3RcbiAgICAgICAgICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBnZXRVSURCeU9iamVjdDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghb2JqZWN0WydfX3VpZF9fJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudXRpbHMuY3JlYXRlT2JqZWN0VUlEKG9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdFsnX191aWRfXyddXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEBuYW1lIEJheHRlci51dGlscy5jcmVhdGVLZXlVSURcbiAgICAgICAgICAgICAqIEBwYXJhbSBvd25lclxuICAgICAgICAgICAgICogQHBhcmFtIGtleVxuICAgICAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY3JlYXRlS2V5VUlEOiAob3duZXIsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnV0aWxzLmdldFVJREJ5T2JqZWN0KG93bmVyKSArICc6JyArIGtleTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQG5hbWUgQmF4dGVyLnV0aWxzLmRlYm91bmNlXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jXG4gICAgICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gd2FpdFxuICAgICAgICAgICAgICogQHJldHVybnMge0Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZGVib3VuY2U6IChmdW5jLCB3YWl0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5fd2F0Y2hlcnMgPSB7XG4gICAgICAgICAgICB2YXJpYWJsZToge1xuICAgICAgICAgICAgICAgIGdldDogKGNvbmZpZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBjb25maWcuZ2V0VmFsdWUoKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IGNvbmZpZy5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGNvbmZpZy5rZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogKGNvbmZpZywgbmV3VmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gY29uZmlnLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3dpbGwtY2hhbmdlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiBjb25maWcudWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IGNvbmZpZy5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogY29uZmlnLmtleVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWcuc2V0VmFsdWUobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCd1cGRhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogY29uZmlnLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleTogY29uZmlnLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbmV3VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXB1dGVkOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoY29uZmlnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNvbmZpZy5nZXRWYWx1ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zdEV2ZW50KCdnZXQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbmZpZy51aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogY29uZmlnLm93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBjb25maWcua2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogKGNvbmZpZywgY29tcHV0ZWRSZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZFZhbHVlID0gY29uZmlnLmdldFZhbHVlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb25maWcuaXNDb21wdXRpbmcoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCd5b3UgY2FuXFwndCBzZXQgdmFsdWUgdG8gY29tcHV0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wdXRlZFJlc3VsdCA9PT0gb2xkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5zZXRJc0NvbXB1dGluZyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5zZXRWYWx1ZShjb21wdXRlZFJlc3VsdCk7XG5cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3RFdmVudCgndXBkYXRlJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiBjb25maWcudWlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IGNvbmZpZy5vd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleTogY29uZmlnLmtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBjb21wdXRlZFJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWx1ZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpYmVFdmVudCgnd2lsbC1jaGFuZ2UnLCB0aGlzLnV0aWxzLmRlYm91bmNlKCgpID0+IHRoaXMucG9zdEV2ZW50KCd3aWxsLWNoYW5nZS1hbGwnKSwgMCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5jcmVhdGVDbG9zdXJlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY1xuICAgICAqIEBwYXJhbSB7Kn0gY29uZmlnXG4gICAgICogQHJldHVybnMge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIGNyZWF0ZUNsb3N1cmUoZnVuYywgY29uZmlnKSB7XG4gICAgICAgIHJldHVybiAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmMoY29uZmlnLCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5zdWJzY3JpYmVFdmVudFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmVyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbb25jZV1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVFdmVudChldmVudFR5cGUsIHN1YnNjcmliZXIsIG9uY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodHlwZW9mIGV2ZW50VHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcignc3Vic2NyaWJlRXZlbnQ6IGV2ZW50VHlwZSBpcyBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3Vic2NyaWJlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdzdWJzY3JpYmVFdmVudDogc3Vic2NyaWJlciBmdW5jdGlvbiBpcyBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLm9uY2UoZXZlbnRUeXBlLCBzdWJzY3JpYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub24oZXZlbnRUeXBlLCBzdWJzY3JpYmVyKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkaXNwb3NlOiAoKSA9PiB0aGlzLmV2ZW50U3RyZWFtLm9mZihldmVudFR5cGUsIHN1YnNjcmliZXIpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIucG9zdEV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50VHlwZVxuICAgICAqIEBwYXJhbSB7Kn0gW2RhdGFdXG4gICAgICovXG4gICAgcG9zdEV2ZW50KGV2ZW50VHlwZSwgZGF0YSkge1xuICAgICAgICBpZiAodHlwZW9mIGV2ZW50VHlwZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcigncG9zdEV2ZW50OiBldmVudFR5cGUgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLnBvc3QoZXZlbnRUeXBlLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuc3Vic2NyaWJlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50VHlwZV1cbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlXVxuICAgICAqIEB0aHJvd3Mge0JheHRlckVycm9yfVxuICAgICAqL1xuICAgIHN1YnNjcmliZShvd25lciwga2V5LCBzdWJzY3JpYmVyLCBldmVudFR5cGUgPSAndXBkYXRlJywgb25jZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghb3duZXIgfHwgIWtleSB8fCAhc3Vic2NyaWJlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdzdWJzY3JpYmU6IGNhblxcJ3Qgc3Vic2NyaWJlIHZhcmlhYmxlIHdpdGhvdXQgb3duZXIsIGtleSBvciBjYWxsYmFjayBmdW5jdGlvbi4nKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG4gICAgICAgIGxldCBhdmFpbGFibGVFdmVudHMgPSBbJ3dpbGwtY2hhbmdlJywgJ3VwZGF0ZSddO1xuICAgICAgICBsZXQgZXZlbnRUb0xpc3RlbiA9IGF2YWlsYWJsZUV2ZW50cy5pbmRleE9mKGV2ZW50VHlwZSkgIT09IC0xICYmIGV2ZW50VHlwZTtcbiAgICAgICAgbGV0IGV2ZW50SGFuZGxlciA9IChjb25maWcpID0+IHtcbiAgICAgICAgICAgIGlmIChjb25maWcudWlkID09PSB1aWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyKGNvbmZpZy52YWx1ZSwgY29uZmlnLm9sZFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWV2ZW50VG9MaXN0ZW4pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcignc3Vic2NyaWJlOiBsaXN0ZW5pbmcgJyArIGV2ZW50VHlwZSArICcgZXZlbnQgaXMgbm90IGFjY2VwdGVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaWJlRXZlbnQoZXZlbnRUb0xpc3RlbiwgZXZlbnRIYW5kbGVyLCBvbmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIucmVzb2x2ZVxuICAgICAqIEBwYXJhbSB7U2V0fEFycmF5fSBkZXBlbmRlbmNpZXNcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICByZXNvbHZlKGRlcGVuZGVuY2llcykge1xuICAgICAgICBpZiAoIShTeW1ib2wuaXRlcmF0b3IgaW4gZGVwZW5kZW5jaWVzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdyZXNvbHZlOiBkZXBlbmRlbmNpZXMgYXJlIG5vdCBpdGVyYWJsZS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXN1bHQgPSBuZXcgU2V0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgZGVwZW5kZW5jeSBvZiBkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgIHJlc3VsdC5hZGQodGhpcy5fY2FsbHN0YWNrLmdldChkZXBlbmRlbmN5KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVzdWx0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuZ2V0RGVwZW5kZW5jaWVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRleHRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wdXRlZFxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICogQHJldHVybnMgeyp9IFJlc3VsdCBvZiBjb21wdXRpbmdcbiAgICAgKi9cbiAgICBnZXREZXBlbmRlbmNpZXMoY29udGV4dCwgY29tcHV0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY29udGV4dCB8fCAhY29tcHV0ZWQgfHwgIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ2dldERlcGVuZGVuY2llczogdGhlcmUgaXMgbm8gY29udGV4dCwgY29tcHV0ZWQgZnVuY3Rpb24gb3IgY2FsbGJhY2suJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGlzdGVuZXIgPSB0aGlzLnN1YnNjcmliZUV2ZW50KCdnZXQnLCBjYWxsYmFjayk7XG4gICAgICAgIGxldCBjb21wdXRpbmdSZXN1bHQgPSBjb21wdXRlZC5jYWxsKGNvbnRleHQpO1xuXG4gICAgICAgIGxpc3RlbmVyLmRpc3Bvc2UoKTtcblxuICAgICAgICByZXR1cm4gY29tcHV0aW5nUmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci5hZGRUb1N0YWNrXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgYWRkVG9TdGFjayhvd25lciwga2V5LCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGtleSk7XG5cbiAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ3dpbGwtY2hhbmdlJywge1xuICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLl9jYWxsc3RhY2suc2V0KHVpZCwgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlRXZlbnQoJ3dpbGwtY2hhbmdlLWFsbCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGNhbGxiYWNrKCkpO1xuICAgICAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbHN0YWNrLmRlbGV0ZSh1aWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY2FsbHN0YWNrLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0RXZlbnQoJ2NoYW5nZS1jb21wbGV0ZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIudmFyaWFibGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHsqfSBbaW5pdGlhbFZhbHVlXVxuICAgICAqIEByZXR1cm5zIHsqfSBpbml0aWFsVmFsdWVcbiAgICAgKi9cbiAgICB2YXJpYWJsZShvd25lciwga2V5LCBpbml0aWFsVmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvd25lciAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcigndmFyaWFibGU6IG93bmVyIG9iamVjdCBpbiBub3QgZGVmaW5lZC4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcigndmFyaWFibGU6IGtleSBzdHJpbmcgaW4gbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBpbml0aWFsVmFsdWU7XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcbiAgICAgICAgbGV0IHV0aWxzID0ge1xuICAgICAgICAgICAgZ2V0VmFsdWU6ICgpID0+IHZhbHVlLFxuICAgICAgICAgICAgc2V0VmFsdWU6IChuZXdWYWx1ZSkgPT4gdmFsdWUgPSBuZXdWYWx1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLl92YXJpYWJsZXMuaGFzKHVpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBpbml0aWFsVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl92YXJpYWJsZXMuc2V0KHVpZCwgbmV3IFNldCgpKTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3duZXIsIGtleSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0OiB0aGlzLmNyZWF0ZUNsb3N1cmUodGhpcy5fd2F0Y2hlcnMudmFyaWFibGUuZ2V0LCB7XG4gICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICBnZXRWYWx1ZTogdXRpbHMuZ2V0VmFsdWVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBzZXQ6IHRoaXMuY3JlYXRlQ2xvc3VyZSh0aGlzLl93YXRjaGVycy52YXJpYWJsZS5zZXQsIHtcbiAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHNldFZhbHVlOiB1dGlscy5zZXRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgZ2V0VmFsdWU6IHV0aWxzLmdldFZhbHVlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLmNvbXB1dGVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkT2JzZXJ2YWJsZVxuICAgICAqIEBwYXJhbSB7U2V0fE1hcHxBcnJheX0gW3VzZXJEZXBlbmRlbmNpZXNdXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgY29tcHV0ZWQob3duZXIsIGtleSwgY29tcHV0ZWRPYnNlcnZhYmxlLCB1c2VyRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3duZXIgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ2NvbXB1dGVkOiBvd25lciBvYmplY3QgaW4gbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBCYXh0ZXJFcnJvcignY29tcHV0ZWQ6IGtleSBzdHJpbmcgaW4gbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGNvbXB1dGVkT2JzZXJ2YWJsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdjb21wdXRlZDogY29tcHV0ZWRPYnNlcnZhYmxlIGZ1bmN0aW9uIGluIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX3ZhcmlhYmxlcy5oYXModWlkKSkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbXB1dGVkT2JzZXJ2YWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBsYXRlc3RWYWx1ZTtcbiAgICAgICAgbGV0IHByZXZpb3VzVmFsdWU7XG4gICAgICAgIGxldCBpc0NvbXB1dGluZyA9IGZhbHNlO1xuICAgICAgICBsZXQgZGVwZW5kZW5jaWVzID0gbmV3IFNldCgpO1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGxldCB1aWQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcbiAgICAgICAgbGV0IHV0aWxzID0ge1xuICAgICAgICAgICAgZ2V0VmFsdWU6ICgpID0+IGxhdGVzdFZhbHVlLFxuICAgICAgICAgICAgc2V0VmFsdWU6IChuZXdWYWx1ZSkgPT4gbGF0ZXN0VmFsdWUgPSBuZXdWYWx1ZSxcbiAgICAgICAgICAgIHNldElzQ29tcHV0aW5nOiAodmFsdWUpID0+IGlzQ29tcHV0aW5nID0gdmFsdWUsXG4gICAgICAgICAgICBpc0NvbXB1dGluZzogKCkgPT4gaXNDb21wdXRpbmdcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl92YXJpYWJsZXMuc2V0KHVpZCwgaGFuZGxlcnMpO1xuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvd25lciwga2V5LCB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IHRoaXMuY3JlYXRlQ2xvc3VyZSh0aGlzLl93YXRjaGVycy5jb21wdXRlZC5nZXQsIHtcbiAgICAgICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWU6IHV0aWxzLmdldFZhbHVlXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNldDogdGhpcy5jcmVhdGVDbG9zdXJlKHRoaXMuX3dhdGNoZXJzLmNvbXB1dGVkLnNldCwge1xuICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZTogdXRpbHMuc2V0VmFsdWUsXG4gICAgICAgICAgICAgICAgZ2V0VmFsdWU6IHV0aWxzLmdldFZhbHVlLFxuICAgICAgICAgICAgICAgIGlzQ29tcHV0aW5nOiB1dGlscy5pc0NvbXB1dGluZyxcbiAgICAgICAgICAgICAgICBzZXRJc0NvbXB1dGluZzogdXRpbHMuc2V0SXNDb21wdXRpbmdcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBoYW5kbGVPYnNlcnZhYmxlID0gKGhhbmRsZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgZGVwZW5kZW5jaWVzLmFkZChoYW5kbGVkVmFsdWUudWlkKTtcblxuICAgICAgICAgICAgbGV0IHN1YnNjcmliZXIgPSB0aGlzLnN1YnNjcmliZShoYW5kbGVkVmFsdWUub3duZXIsIGhhbmRsZWRWYWx1ZS5rZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNDb21wdXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlzQ29tcHV0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkVG9TdGFjayhvd25lciwga2V5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc29sdmUoZGVwZW5kZW5jaWVzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzVmFsdWUgPSBsYXRlc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29tcHV0ZWRPYnNlcnZhYmxlLmNhbGwob3duZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sICd3aWxsLWNoYW5nZScpO1xuXG4gICAgICAgICAgICBoYW5kbGVycy5hZGQoc3Vic2NyaWJlcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodXNlckRlcGVuZGVuY2llcykpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHVzZXJEZXBlbmRlbmN5IG9mIHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVPYnNlcnZhYmxlKHVzZXJEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYWxjdWxhdGVkVmFsdWUgPSB0aGlzLmdldERlcGVuZGVuY2llcyhvd25lciwgY29tcHV0ZWRPYnNlcnZhYmxlLCBoYW5kbGVPYnNlcnZhYmxlKTtcbiAgICAgICAgaWYgKGNhbGN1bGF0ZWRWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgIGNhbGN1bGF0ZWRWYWx1ZS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU3RhY2sob3duZXIsIGtleSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGRlcGVuZGVuY2llcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXJba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpc0NvbXB1dGluZyA9IHRydWU7XG4gICAgICAgICAgICBvd25lcltrZXldID0gY2FsY3VsYXRlZFZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhdGVzdFZhbHVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEJheHRlci53YXRjaFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgICAgKi9cbiAgICB3YXRjaChvYmplY3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmplY3QgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgQmF4dGVyRXJyb3IoJ3dhdGNoOiBvYmplY3QgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29tcHV0ZWRWYXJpYWJsZXMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoIW9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFyaWFibGVzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBvd25lcjogb2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgY29tcHV0ZWRMZW5ndGggPSBjb21wdXRlZFZhcmlhYmxlcy5sZW5ndGg7IGluZGV4IDwgY29tcHV0ZWRMZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGxldCBjb21wdXRlZCA9IGNvbXB1dGVkVmFyaWFibGVzW2luZGV4XTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZWQoY29tcHV0ZWQub3duZXIsIGNvbXB1dGVkLmtleSwgY29tcHV0ZWQudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuZGlzcG9zZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBba2V5XVxuICAgICAqL1xuICAgIGRpc3Bvc2Uob3duZXIsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIG93bmVyICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEJheHRlckVycm9yKCdEaXNwb3NlOiBvYmplY3QgaXMgbm90IGRlZmluZWQuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgZm9yIChsZXQgZmllbGQgb2YgKE9iamVjdC5rZXlzKG93bmVyKSkpIHtcbiAgICAgICAgICAgICAgICBsZXQgdWlkID0gdGhpcy51dGlscy5jcmVhdGVLZXlVSUQob3duZXIsIGZpZWxkKTtcbiAgICAgICAgICAgICAgICBsZXQgaGFuZGxlcnMgPSB0aGlzLl92YXJpYWJsZXMuZ2V0KHVpZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgaGFuZGxlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvd25lcltmaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fdmFyaWFibGVzLmRlbGV0ZSh1aWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuICAgICAgICAgICAgbGV0IGhhbmRsZXJzID0gdGhpcy5fdmFyaWFibGVzLmdldCh1aWQpO1xuXG4gICAgICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIGhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5kaXNwb3NlKCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG93bmVyW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX3ZhcmlhYmxlcy5kZWxldGUodWlkKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEJheHRlcigpO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvYmF4dGVyLmpzXG4gKiovIiwiLyoqXG4gKiBAY2xhc3MgRXZlbnRTZXJ2aWNlXG4gKi9cbmNsYXNzIEV2ZW50U2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoZGVmYXVsdENvbnRleHQpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5jaGFubmVsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jaGFubmVscyA9IHt9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuY29udGV4dFxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gZGVmYXVsdENvbnRleHQgfHwgdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UuZ2V0RXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAgICAgKiBAcmV0dXJucyB7U2V0fVxuICAgICAqL1xuICAgIGdldEV2ZW50KGV2ZW50KSB7XG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF0gPSBuZXcgU2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgRXZlbnRTZXJ2aWNlLm9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IC0gRXZlbnQgbmFtZVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIGRhdGEgYXMgYXJndW1lbnRcbiAgICAgKi9cbiAgICBvbihldmVudCwgaGFuZGxlcikge1xuICAgICAgICBpZiAoIWV2ZW50IHx8ICFoYW5kbGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBpbml0IGV2ZW50IGxpc3RlbmVyOiBubyBwYXJhbWV0ZXJzIGdpdmVuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRFdmVudChldmVudCkuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5vbmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuICAgICAqL1xuICAgIG9uY2UoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgaW5pdCBldmVudCBsaXN0ZW5lcjogbm8gcGFyYW1ldGVycyBnaXZlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLmdldEV2ZW50KGV2ZW50KS5hZGQoaGFuZGxlcldyYXBwZXIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZXJXcmFwcGVyKGRhdGEpIHtcbiAgICAgICAgICAgIHRoYXQub2ZmKGV2ZW50LCBoYW5kbGVyV3JhcHBlcik7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlcihkYXRhKTtcbiAgICAgICAgfVxuXG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub2ZmXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2hhbmRsZXJUb0RlbGV0ZV1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBvZmYoZXZlbnQsIGhhbmRsZXJUb0RlbGV0ZSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgZXZlbnQgbGlzdGVuZXI6IG5vIGV2ZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxldGUgdGhpcy5jaGFubmVsc1tldmVudF07XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZXZlbnRIYW5kbGVycyA9IHRoaXMuY2hhbm5lbHNbZXZlbnRdO1xuXG4gICAgICAgIGV2ZW50SGFuZGxlcnMuZGVsZXRlKGhhbmRsZXJUb0RlbGV0ZSk7XG5cbiAgICAgICAgaWYgKCFldmVudEhhbmRsZXJzLnNpemUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxzW2V2ZW50XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5wb3N0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHsqfSBkYXRhXG4gICAgICovXG4gICAgcG9zdChldmVudCwgZGF0YSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBwb3N0IHVuZGVmaW5lZCBldmVudFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghKGV2ZW50IGluIHRoaXMuY2hhbm5lbHMpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBoYW5kbGVyIG9mIHRoaXMuY2hhbm5lbHNbZXZlbnRdKSB7XG4gICAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcy5jb250ZXh0LCBkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogLi9zcmMvc2VydmljZXMvZXZlbnQuanNcbiAqKi8iLCIvKipcbiAqIEBuYW1lIEJheHRlckVycm9yXG4gKi9cbmNsYXNzIEJheHRlckVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnW0JheHRlci5qc106ICcgKyBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmF4dGVyRXJyb3I7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9lbnRpdGllcy9lcnJvci5qc1xuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=