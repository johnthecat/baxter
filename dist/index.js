/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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

	            var uid = this.utils.createKeyUID(owner, key);

	            if (this._variables.has(uid)) {
	                return initialValue;
	            }

	            var value = initialValue;
	            var utils = {
	                getValue: function getValue() {
	                    return value;
	                },
	                setValue: function setValue(newValue) {
	                    return value = newValue;
	                }
	            };

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

	            var uid = this.utils.createKeyUID(owner, key);

	            if (this._variables.has(uid)) {
	                return computedObservable;
	            }

	            var latestValue = undefined;
	            var previousValue = undefined;
	            var _isComputing = false;
	            var dependencies = new Set();
	            var handlers = new Set();
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