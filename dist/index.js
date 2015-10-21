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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _baxter = __webpack_require__(1);
	
	var _baxter2 = _interopRequireDefault(_baxter);
	
	(function (name, constructor, browserContext) {
	    var lib = new constructor();
	
	    if (browserContext) {
	        browserContext[name] = lib;
	    } else if (true) {
	        if (typeof module !== 'undefined' && module.exports) {
	            exports = module.exports = lib;
	        }
	        exports[name] = lib;
	    }
	
	    //TODO delete
	
	    var Test = function Test() {
	        var _this = this;
	
	        _classCallCheck(this, Test);
	
	        this.id = 1;
	
	        this.name = 'Tom';
	        this.surname = 'Jarvis';
	
	        this.fullName = function () {
	            return _this.name + ' ' + _this.surname;
	        };
	
	        this.array = [1, 2, 3, 4, 5, 6, 7, 8];
	    };
	
	    function scope() {
	        var test = new Test();
	
	        lib.watch(test);
	    }
	
	    function bench() {
	        console.time('bench');
	        for (var i = 0; i < 10000; i++) {
	            scope();
	        }
	        console.timeEnd('bench');
	    }
	
	    browserContext['bench'] = bench;
	    browserContext['test'] = lib.watch(new Test());
	
	    lib.eventStream.on('update', function (changes) {
	        return console.log('update', changes);
	    });
	})('baxter', _baxter2['default'], window);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _servicesEvent = __webpack_require__(2);
	
	var _servicesEvent2 = _interopRequireDefault(_servicesEvent);
	
	var _entitiesError = __webpack_require__(3);
	
	var _entitiesError2 = _interopRequireDefault(_entitiesError);
	
	/**
	 * TODO: clear event service stack
	 * TODO: global storage for computed variables
	 * TODO: handle exceptions inside computed
	 * TODO: add array tracking
	 * TODO: clear code
	 * TODO: documentation
	 * TODO: unit-tests
	 * TODO: performance tests
	 * TODO: plugin handler
	 * TODO: simple template engine as plugin (like in knockout.js)
	 */
	
	var ObservableArray = (function (_Array) {
	    _inherits(ObservableArray, _Array);
	
	    function ObservableArray(eventService, values) {
	        _classCallCheck(this, ObservableArray);
	
	        _get(Object.getPrototypeOf(ObservableArray.prototype), 'constructor', this).call(this);
	        Object.assign(this, values);
	        this.length = values.length;
	        this.eventStream = eventService;
	    }
	
	    /**
	     * @class Baxter
	     * @description Main class, provides library as it self.
	     */
	
	    _createClass(ObservableArray, [{
	        key: 'push',
	        value: function push(value) {
	            var index = _get(Object.getPrototypeOf(ObservableArray.prototype), 'push', this).call(this, value);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'push',
	                changed: this[index]
	            });
	
	            return index;
	        }
	    }, {
	        key: 'shift',
	        value: function shift() {
	            var deletedValue = _get(Object.getPrototypeOf(ObservableArray.prototype), 'shift', this).call(this);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'shift',
	                changed: deletedValue
	            });
	
	            return deletedValue;
	        }
	    }, {
	        key: 'pop',
	        value: function pop() {
	            var lastValue = _get(Object.getPrototypeOf(ObservableArray.prototype), 'pop', this).call(this);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'pop',
	                changed: lastValue
	            });
	
	            return lastValue;
	        }
	    }, {
	        key: 'unshift',
	        value: function unshift() {
	            for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
	                values[_key] = arguments[_key];
	            }
	
	            var mergedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'unshift', this).apply(this, values);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'unshift',
	                changed: values
	            });
	
	            return mergedArray;
	        }
	    }, {
	        key: 'reverse',
	        value: function reverse() {
	            var reversedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'reverse', this).call(this);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'reverse',
	                changed: reversedArray
	            });
	
	            return reversedArray;
	        }
	    }, {
	        key: 'sort',
	        value: function sort(sortFunction) {
	            var sortedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'sort', this).call(this, sortFunction);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'sort',
	                changed: sortedArray
	            });
	
	            return sortedArray;
	        }
	    }, {
	        key: 'splice',
	        value: function splice() {
	            for (var _len2 = arguments.length, arguments = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                arguments[_key2] = arguments[_key2];
	            }
	
	            var splicedArray = _get(Object.getPrototypeOf(ObservableArray.prototype), 'splice', this).apply(this, arguments);
	
	            this.eventStream.post('update', {
	                uid: uid,
	                owner: owner,
	                key: key,
	                value: this,
	                type: 'splice',
	                changed: splicedArray
	            });
	
	            return splicedArray;
	        }
	    }]);
	
	    return ObservableArray;
	})(Array);
	
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
	         * @name Baxter.callstack
	         * @type {Map}
	         */
	        this.callstack = new Map();
	
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
	            createObjectUID: function createObjectUID(object) {
	                var uid = UID++;
	
	                object['__uid__'] = uid;
	
	                return uid;
	            },
	
	            getUIDByObject: function getUIDByObject(object) {
	                if (!object['__uid__']) {
	                    return _this.utils.createObjectUID(object);
	                }
	
	                return object['__uid__'];
	            },
	
	            createKeyUID: function createKeyUID(owner, key) {
	                return _this.utils.getUIDByObject(owner) + ':' + key;
	            }
	        };
	
	        function debounce(func, wait) {
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
	
	        var handler = debounce(function () {
	            _this.eventStream.post('will-change-all');
	        }, 20);
	
	        this.eventStream.on('will-change', handler);
	    }
	
	    /**
	     * @name Baxter.subscribe
	     * @param {Object} owner
	     * @param {String} key
	     * @param {Function} subscriber
	     * @throws {LibraryError}
	     */
	
	    _createClass(Baxter, [{
	        key: 'subscribe',
	        value: function subscribe(owner, key, subscriber) {
	            if (!owner || !key || !subscriber) {
	                throw new _entitiesError2['default']('can\'t subscribe variable without owner, key or callback function.');
	            }
	            var uid = this.utils.createKeyUID(owner, key);
	
	            this.eventStream.on('update', function (config) {
	                if (config.uid === uid) {
	                    subscriber(config.value, config.oldValue);
	                }
	            });
	        }
	
	        /**
	         * @name Baxter.resolve
	         * @param {Set} dependencies
	         * @returns {Promise}
	         */
	    }, {
	        key: 'resolve',
	        value: function resolve(dependencies) {
	            var result = new Set();
	
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;
	
	            try {
	                for (var _iterator = dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var dependency = _step.value;
	
	                    result.add(this.callstack.get(dependency));
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
	         * @param {Function} computed
	         * @param {Function} callback
	         * @returns {*}
	         */
	    }, {
	        key: 'getDependencies',
	        value: function getDependencies(computed, callback) {
	            this.eventStream.on('get', callback);
	            var computingResult = computed();
	            this.eventStream.off('get', callback);
	
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
	            var _this2 = this;
	
	            var uid = this.utils.createKeyUID(owner, key);
	            var handler = function handler(resolve) {
	                _this2.callstack['delete'](uid);
	                if (!_this2.callstack.size) {
	                    _this2.eventStream.post('change-complete');
	                }
	                resolve();
	            };
	
	            this.eventStream.post('will-change', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });
	
	            this.callstack.set(uid, new Promise(function (resolve) {
	                /**
	                 * When will change chain is complete, then resolve
	                 */
	                _this2.eventStream.once('will-change-all', function () {
	                    var resolveResult = callback();
	                    if (resolveResult instanceof Promise) {
	                        resolveResult.then(function () {
	                            handler(resolve);
	                        });
	                    } else {
	                        handler(resolve);
	                    }
	                });
	            }));
	        }
	
	        /**
	         * @name Baxter.observable
	         * @param {Object} owner
	         * @param {String} key
	         * @param {*} initialValue
	         * @returns {*} value
	         */
	    }, {
	        key: 'observable',
	        value: function observable(owner, key, initialValue) {
	            var _this3 = this;
	
	            var value = initialValue;
	            var uid = this.utils.createKeyUID(owner, key);
	
	            this.eventStream.post('registered', {
	                uid: uid,
	                owner: owner,
	                key: key
	            });
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                set: function set(newValue) {
	                    if (newValue === value) {
	                        return false;
	                    }
	
	                    _this3.addToStack(owner, key, function () {
	                        var oldValue = value;
	
	                        value = newValue;
	
	                        _this3.eventStream.post('update', {
	                            uid: uid,
	                            owner: owner,
	                            key: key,
	                            value: value,
	                            oldValue: oldValue
	                        });
	                    });
	                },
	
	                get: function get() {
	                    _this3.eventStream.post('get', {
	                        uid: uid,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });
	                    return value;
	                }
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
	
	            var value = undefined;
	            var oldValue = undefined;
	            var isComputing = false;
	            var computedUID = this.utils.createKeyUID(owner, key);
	            var dependencies = new Set();
	            var handleObservable = function handleObservable(handledValue) {
	                if (handledValue.uid === computedUID) {
	                    throw new _entitiesError2['default']('Circular dependencies detected on ' + key + ' value.');
	                }
	
	                dependencies.add(_this4.utils.createKeyUID(handledValue.owner, handledValue.key));
	
	                var handleChange = function handleChange() {
	                    /**
	                     * Add resolve to global stack
	                     */
	                    _this4.addToStack(owner, key, function () {
	                        return _this4.resolve(dependencies).then(function () {
	                            oldValue = value;
	                            value = computedObservable.call(owner);
	
	                            return value;
	                        }).then(function (value) {
	                            isComputing = false;
	
	                            if (oldValue === value) {
	                                return false;
	                            }
	
	                            _this4.eventStream.post('update', {
	                                uid: computedUID,
	                                owner: owner,
	                                key: key,
	                                value: value,
	                                oldValue: oldValue
	                            });
	                        });
	                    });
	                };
	
	                /**
	                 * Event listen: One of dependency will resolve later
	                 */
	                _this4.eventStream.on('will-change', function (willChange) {
	                    /**
	                     * Don't change anything if value if not current handled or variable is computing now
	                     */
	                    if (willChange.uid !== handledValue.uid || isComputing) {
	                        return false;
	                    }
	
	                    handleChange();
	
	                    isComputing = true;
	                });
	            };
	
	            this.eventStream.post('registered', {
	                uid: computedUID,
	                owner: owner,
	                key: key
	            });
	
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
	
	            value = this.getDependencies(computedObservable, handleObservable);
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: function get() {
	                    _this4.eventStream.post('get', {
	                        uid: computedUID,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });
	
	                    return value;
	                },
	                set: function set(value) {
	                    if (value === value) {
	                        return;
	                    }
	                    throw new _entitiesError2['default']('you can\'t set value to computed');
	                }
	            });
	
	            return value;
	        }
	    }, {
	        key: 'array',
	        value: function array(owner, key, initialValues) {
	            var uid = this.utils.createKeyUID(owner, key);
	
	            //TODO: track dependencies
	
	            var observableArray = new ObservableArray(this.eventStream, initialValues);
	
	            owner[key] = observableArray;
	
	            Object.defineProperty(owner, key, {
	                configurable: true,
	                get: function get() {
	                    return observableArray;
	                },
	                set: function set(value) {
	                    baxter.eventStream.post('update', {
	                        uid: uid,
	                        owner: owner,
	                        key: key,
	                        value: value
	                    });
	
	                    return value;
	                }
	            });
	
	            return observableArray;
	        }
	
	        /**
	         * @name Baxter.watch
	         * @param {Object} object
	         */
	    }, {
	        key: 'watch',
	        value: function watch(object) {
	            for (var _key3 in object) {
	                if (!object.hasOwnProperty(_key3)) {
	                    continue;
	                }
	
	                var value = object[_key3];
	                if (typeof value === 'function') {
	                    this.computed(object, _key3, value);
	                } else if (Object.prototype.toString.call(value) === '[object Array]') {
	                    this.array(object, _key3, value);
	                } else {
	                    this.observable(object, _key3, value);
	                }
	            }
	
	            return object;
	        }
	    }]);
	
	    return Baxter;
	})();
	
	exports['default'] = Baxter;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * @class EventService
	 */
	
	var EventService = (function () {
	    function EventService(defaultContext) {
	        _classCallCheck(this, EventService);
	
	        this.channels = new Map();
	
	        this.context = defaultContext || this;
	    }
	
	    /**
	     * @name EventService.on
	     * @param {string} event - Event name
	     * @param {function} handler - Callback function with data as argument
	     */
	
	    _createClass(EventService, [{
	        key: "on",
	        value: function on(event, handler) {
	            if (!event || !handler) {
	                throw new Error("Can't init event listener: no parameters given");
	            }
	
	            if (!this.channels.has(event)) {
	                this.channels.set(event, new Set());
	            }
	
	            this.channels.get(event).add(handler);
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
	
	            if (!this.channels.has(event)) {
	                this.channels.set(event, new Set());
	            }
	
	            function handlerWrapper(data) {
	                that.off(event, handlerWrapper);
	                return handler(data);
	            }
	
	            this.channels.get(event).add(handlerWrapper);
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
	                return this.channels["delete"](event);
	            }
	
	            var eventHandlers = this.channels.get(event);
	
	            eventHandlers["delete"](handlerToDelete);
	
	            if (!eventHandlers.size) {
	                this.channels["delete"](event);
	            }
	        }
	
	        /**
	         * @name EventService.post
	         * @param {string} event
	         * @param {*} data
	         * @returns {Promise}
	         */
	    }, {
	        key: "post",
	        value: function post(event, data) {
	            var _this = this;
	
	            if (!event) {
	                throw new Error("Can't post undefined event");
	            }
	
	            if (!this.channels.has(event)) {
	                return new Promise(function (resolve) {
	                    return resolve();
	                });
	            }
	
	            if (event !== 'system:all') {
	                this.post('system:all', {
	                    event: event,
	                    data: data
	                });
	            }
	
	            return new Promise(function (resolve) {
	                var _iteratorNormalCompletion = true;
	                var _didIteratorError = false;
	                var _iteratorError = undefined;
	
	                try {
	                    for (var _iterator = _this.channels.get(event).values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                        var handler = _step.value;
	
	                        handler.call(_this.context, data);
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
	
	                resolve();
	            });
	        }
	    }, {
	        key: "all",
	        value: function all(handler) {
	            var _this2 = this;
	
	            this.on('system:all', function (data) {
	                handler.call(_this2.context, data);
	            });
	        }
	    }]);
	
	    return EventService;
	})();
	
	exports["default"] = EventService;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var LibraryError = function LibraryError(message) {
	    _classCallCheck(this, LibraryError);
	
	    return new Error('[Twin.js]: ' + message);
	};
	
	exports['default'] = LibraryError;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjZiMzJmMDUxZWU2MDE0NGMzZTQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9iYXh0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7bUNDdENtQixDQUFVOzs7O0FBRTdCLEVBQUMsVUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBSztBQUNwQyxTQUFJLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDOztBQUU1QixTQUFJLGNBQWMsRUFBRTtBQUNoQix1QkFBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUM5QixNQUFNLElBQUksSUFBOEIsRUFBRTtBQUN2QyxhQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0FBQ2pELG9CQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7VUFDbEM7QUFDRCxnQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztNQUN2Qjs7OztTQUdLLElBQUksR0FDSyxTQURULElBQUksR0FDUTs7OytCQURaLElBQUk7O0FBRUYsYUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRVosYUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7QUFDbEIsYUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENB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SUFBSSxDQUFDLENBQUM7Y0FDcEMsQ0FBQyxDQUFDO1VBQ047OztZQTFHQyxZQUFZOzs7c0JBNkdILFlBQVk7Ozs7Ozs7Ozs7Ozs7S0NoSHJCLFlBQVksR0FDSCxTQURULFlBQVksQ0FDRixPQUFPLEVBQUU7MkJBRG5CLFlBQVk7O0FBRVYsWUFBTyxJQUFJLEtBQUssQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUM7RUFDN0M7O3NCQUdVLFlBQVkiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDI2YjMyZjA1MWVlNjAxNDRjM2U0XG4gKiovIiwiaW1wb3J0IEJheHRlciBmcm9tICcuL2JheHRlcic7XG5cbigobmFtZSwgY29uc3RydWN0b3IsIGJyb3dzZXJDb250ZXh0KSA9PiB7XG4gICAgbGV0IGxpYiA9IG5ldyBjb25zdHJ1Y3RvcigpO1xuXG4gICAgaWYgKGJyb3dzZXJDb250ZXh0KSB7XG4gICAgICAgIGJyb3dzZXJDb250ZXh0W25hbWVdID0gbGliO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbGliO1xuICAgICAgICB9XG4gICAgICAgIGV4cG9ydHNbbmFtZV0gPSBsaWI7XG4gICAgfVxuXG4gICAgLy9UT0RPIGRlbGV0ZVxuICAgIGNsYXNzIFRlc3Qge1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSAxO1xuXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAnVG9tJztcbiAgICAgICAgICAgIHRoaXMuc3VybmFtZSA9ICdKYXJ2aXMnO1xuXG4gICAgICAgICAgICB0aGlzLmZ1bGxOYW1lID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyAnICcgKyB0aGlzLnN1cm5hbWU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLmFycmF5ID0gWzEsIDIgLDMgLDQsIDUsIDYsIDcsIDhdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NvcGUoKSB7XG4gICAgICAgIGxldCB0ZXN0ID0gbmV3IFRlc3QoKTtcblxuICAgICAgICBsaWIud2F0Y2godGVzdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYmVuY2goKSB7XG4gICAgICAgIGNvbnNvbGUudGltZSgnYmVuY2gnKTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IDEwMDAwOyBpKyspIHtcbiAgICAgICAgICAgIHNjb3BlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS50aW1lRW5kKCdiZW5jaCcpO1xuICAgIH1cblxuICAgIGJyb3dzZXJDb250ZXh0WydiZW5jaCddID0gYmVuY2g7XG4gICAgYnJvd3NlckNvbnRleHRbJ3Rlc3QnXSA9IGxpYi53YXRjaChuZXcgVGVzdCgpKTtcblxuICAgIGxpYi5ldmVudFN0cmVhbS5vbigndXBkYXRlJywgKGNoYW5nZXMpID0+IGNvbnNvbGUubG9nKCd1cGRhdGUnLCBjaGFuZ2VzKSk7XG5cbn0pKCdiYXh0ZXInLCBCYXh0ZXIsIHdpbmRvdyk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiAuL3NyYy9pbmRleC5qc1xuICoqLyIsImltcG9ydCBFdmVudFNlcnZpY2UgZnJvbSAnLi9zZXJ2aWNlcy9ldmVudCc7XG5pbXBvcnQgTGlicmFyeUVycm9yIGZyb20gJy4vZW50aXRpZXMvZXJyb3InO1xuXG4vKipcbiAqIFRPRE86IGNsZWFyIGV2ZW50IHNlcnZpY2Ugc3RhY2tcbiAqIFRPRE86IGdsb2JhbCBzdG9yYWdlIGZvciBjb21wdXRlZCB2YXJpYWJsZXNcbiAqIFRPRE86IGhhbmRsZSBleGNlcHRpb25zIGluc2lkZSBjb21wdXRlZFxuICogVE9ETzogYWRkIGFycmF5IHRyYWNraW5nXG4gKiBUT0RPOiBjbGVhciBjb2RlXG4gKiBUT0RPOiBkb2N1bWVudGF0aW9uXG4gKiBUT0RPOiB1bml0LXRlc3RzXG4gKiBUT0RPOiBwZXJmb3JtYW5jZSB0ZXN0c1xuICogVE9ETzogcGx1Z2luIGhhbmRsZXJcbiAqIFRPRE86IHNpbXBsZSB0ZW1wbGF0ZSBlbmdpbmUgYXMgcGx1Z2luIChsaWtlIGluIGtub2Nrb3V0LmpzKVxuICovXG5cblxuY2xhc3MgT2JzZXJ2YWJsZUFycmF5IGV4dGVuZHMgQXJyYXkge1xuICAgIGNvbnN0cnVjdG9yKGV2ZW50U2VydmljZSwgdmFsdWVzKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcywgdmFsdWVzKTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB2YWx1ZXMubGVuZ3RoO1xuICAgICAgICB0aGlzLmV2ZW50U3RyZWFtID0gZXZlbnRTZXJ2aWNlO1xuICAgIH1cblxuICAgIHB1c2godmFsdWUpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gc3VwZXIucHVzaCh2YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMsXG4gICAgICAgICAgICB0eXBlOiAncHVzaCcsXG4gICAgICAgICAgICBjaGFuZ2VkOiB0aGlzW2luZGV4XVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgc2hpZnQoKSB7XG4gICAgICAgIGxldCBkZWxldGVkVmFsdWUgPSBzdXBlci5zaGlmdCgpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgndXBkYXRlJywge1xuICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLFxuICAgICAgICAgICAgdHlwZTogJ3NoaWZ0JyxcbiAgICAgICAgICAgIGNoYW5nZWQ6IGRlbGV0ZWRWYWx1ZVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGVsZXRlZFZhbHVlO1xuICAgIH1cblxuICAgIHBvcCgpIHtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IHN1cGVyLnBvcCgpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgndXBkYXRlJywge1xuICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLFxuICAgICAgICAgICAgdHlwZTogJ3BvcCcsXG4gICAgICAgICAgICBjaGFuZ2VkOiBsYXN0VmFsdWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGxhc3RWYWx1ZTtcbiAgICB9XG5cbiAgICB1bnNoaWZ0KC4uLnZhbHVlcykge1xuICAgICAgICBsZXQgbWVyZ2VkQXJyYXkgPSBzdXBlci51bnNoaWZ0LmFwcGx5KHRoaXMsIHZhbHVlcyk7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMsXG4gICAgICAgICAgICB0eXBlOiAndW5zaGlmdCcsXG4gICAgICAgICAgICBjaGFuZ2VkOiB2YWx1ZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlZEFycmF5O1xuICAgIH1cblxuICAgIHJldmVyc2UoKSB7XG4gICAgICAgIGxldCByZXZlcnNlZEFycmF5ID0gc3VwZXIucmV2ZXJzZSgpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgndXBkYXRlJywge1xuICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgIHZhbHVlOiB0aGlzLFxuICAgICAgICAgICAgdHlwZTogJ3JldmVyc2UnLFxuICAgICAgICAgICAgY2hhbmdlZDogcmV2ZXJzZWRBcnJheVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmV2ZXJzZWRBcnJheTtcbiAgICB9XG5cbiAgICBzb3J0KHNvcnRGdW5jdGlvbikge1xuICAgICAgICBsZXQgc29ydGVkQXJyYXkgPSBzdXBlci5zb3J0KHNvcnRGdW5jdGlvbik7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMsXG4gICAgICAgICAgICB0eXBlOiAnc29ydCcsXG4gICAgICAgICAgICBjaGFuZ2VkOiBzb3J0ZWRBcnJheVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc29ydGVkQXJyYXk7XG4gICAgfVxuXG4gICAgc3BsaWNlKC4uLmFyZ3VtZW50cykge1xuICAgICAgICBsZXQgc3BsaWNlZEFycmF5ID0gc3VwZXIuc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICB1aWQ6IHVpZCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMsXG4gICAgICAgICAgICB0eXBlOiAnc3BsaWNlJyxcbiAgICAgICAgICAgIGNoYW5nZWQ6IHNwbGljZWRBcnJheVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3BsaWNlZEFycmF5O1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzcyBCYXh0ZXJcbiAqIEBkZXNjcmlwdGlvbiBNYWluIGNsYXNzLCBwcm92aWRlcyBsaWJyYXJ5IGFzIGl0IHNlbGYuXG4gKi9cbmNsYXNzIEJheHRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQmFzaWMgdW5pcXVlIGlkLCBvdGhlciB1aWRzIGFyZSBpbmNyZW1lbnRlZCBmcm9tIHRoaXNcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIGxldCBVSUQgPSAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmFtZSBCYXh0ZXIuY2FsbHN0YWNrXG4gICAgICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNhbGxzdGFjayA9IG5ldyBNYXAoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5hbWUgQmF4dGVyLmV2ZW50U3RyZWFtXG4gICAgICAgICAqIEB0eXBlIHtFdmVudFNlcnZpY2V9XG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBQcm92aWRlcyBldmVudHMgc2VydmljZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbSA9IG5ldyBFdmVudFNlcnZpY2UodGhpcyk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuYW1lIEJheHRlci51dGlsc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51dGlscyA9IHtcbiAgICAgICAgICAgIGNyZWF0ZU9iamVjdFVJRDogKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB1aWQgPSBVSUQrKztcblxuICAgICAgICAgICAgICAgIG9iamVjdFsnX191aWRfXyddID0gdWlkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpZDtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFVJREJ5T2JqZWN0OiAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFvYmplY3RbJ19fdWlkX18nXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51dGlscy5jcmVhdGVPYmplY3RVSUQob2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0WydfX3VpZF9fJ11cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGNyZWF0ZUtleVVJRDogKG93bmVyLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy51dGlscy5nZXRVSURCeU9iamVjdChvd25lcikgKyAnOicgKyBrZXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICAgICAgICAgICAgdmFyIHRpbWVvdXQ7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBsYXRlciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZnVuYygpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGhhbmRsZXIgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLnBvc3QoJ3dpbGwtY2hhbmdlLWFsbCcpO1xuICAgICAgICB9LCAyMCk7XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5vbignd2lsbC1jaGFuZ2UnLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuc3Vic2NyaWJlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG93bmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZXJcbiAgICAgKiBAdGhyb3dzIHtMaWJyYXJ5RXJyb3J9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKG93bmVyLCBrZXksIHN1YnNjcmliZXIpIHtcbiAgICAgICAgaWYgKCFvd25lciB8fCAha2V5IHx8ICFzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCdjYW5cXCd0IHN1YnNjcmliZSB2YXJpYWJsZSB3aXRob3V0IG93bmVyLCBrZXkgb3IgY2FsbGJhY2sgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub24oJ3VwZGF0ZScsIChjb25maWcpID0+IHtcbiAgICAgICAgICAgIGlmIChjb25maWcudWlkID09PSB1aWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyKGNvbmZpZy52YWx1ZSwgY29uZmlnLm9sZFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLnJlc29sdmVcbiAgICAgKiBAcGFyYW0ge1NldH0gZGVwZW5kZW5jaWVzXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICovXG4gICAgcmVzb2x2ZShkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IG5ldyBTZXQoKTtcblxuICAgICAgICBmb3IgKGxldCBkZXBlbmRlbmN5IG9mIGRlcGVuZGVuY2llcykge1xuICAgICAgICAgICAgcmVzdWx0LmFkZCh0aGlzLmNhbGxzdGFjay5nZXQoZGVwZW5kZW5jeSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHJlc3VsdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQG5hbWUgQmF4dGVyLmdldERlcGVuZGVuY2llc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXB1dGVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXREZXBlbmRlbmNpZXMoY29tcHV0ZWQsIGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub24oJ2dldCcsIGNhbGxiYWNrKTtcbiAgICAgICAgbGV0IGNvbXB1dGluZ1Jlc3VsdCA9IGNvbXB1dGVkKCk7XG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub2ZmKCdnZXQnLCBjYWxsYmFjayk7XG5cbiAgICAgICAgcmV0dXJuIGNvbXB1dGluZ1Jlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuYWRkVG9TdGFja1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIGFkZFRvU3RhY2sob3duZXIsIGtleSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuICAgICAgICBsZXQgaGFuZGxlciA9IChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbGxzdGFjay5kZWxldGUodWlkKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5jYWxsc3RhY2suc2l6ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgnY2hhbmdlLWNvbXBsZXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd3aWxsLWNoYW5nZScsIHtcbiAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jYWxsc3RhY2suc2V0KHVpZCwgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogV2hlbiB3aWxsIGNoYW5nZSBjaGFpbiBpcyBjb21wbGV0ZSwgdGhlbiByZXNvbHZlXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ub25jZSgnd2lsbC1jaGFuZ2UtYWxsJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXNvbHZlUmVzdWx0ID0gY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzb2x2ZVJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZVJlc3VsdC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIocmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIub2JzZXJ2YWJsZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvd25lclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0geyp9IGluaXRpYWxWYWx1ZVxuICAgICAqIEByZXR1cm5zIHsqfSB2YWx1ZVxuICAgICAqL1xuICAgIG9ic2VydmFibGUob3duZXIsIGtleSwgaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGluaXRpYWxWYWx1ZTtcbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuXG4gICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgncmVnaXN0ZXJlZCcsIHtcbiAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG93bmVyLCBrZXksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHNldDogKG5ld1ZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVG9TdGFjayhvd25lciwga2V5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgb2xkVmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50U3RyZWFtLnBvc3QoJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkOiB1aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IG93bmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIuY29tcHV0ZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3duZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcHV0ZWRPYnNlcnZhYmxlXG4gICAgICogQHBhcmFtIHtTZXR8TWFwfEFycmF5fSBbdXNlckRlcGVuZGVuY2llc11cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBjb21wdXRlZChvd25lciwga2V5LCBjb21wdXRlZE9ic2VydmFibGUsIHVzZXJEZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICBsZXQgb2xkVmFsdWU7XG4gICAgICAgIGxldCBpc0NvbXB1dGluZyA9IGZhbHNlO1xuICAgICAgICBsZXQgY29tcHV0ZWRVSUQgPSB0aGlzLnV0aWxzLmNyZWF0ZUtleVVJRChvd25lciwga2V5KTtcbiAgICAgICAgbGV0IGRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgbGV0IGhhbmRsZU9ic2VydmFibGUgPSAoaGFuZGxlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlZFZhbHVlLnVpZCA9PT0gY29tcHV0ZWRVSUQpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCdDaXJjdWxhciBkZXBlbmRlbmNpZXMgZGV0ZWN0ZWQgb24gJyArIGtleSArICcgdmFsdWUuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlcGVuZGVuY2llcy5hZGQodGhpcy51dGlscy5jcmVhdGVLZXlVSUQoaGFuZGxlZFZhbHVlLm93bmVyLCBoYW5kbGVkVmFsdWUua2V5KSk7XG5cbiAgICAgICAgICAgIGxldCBoYW5kbGVDaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQWRkIHJlc29sdmUgdG8gZ2xvYmFsIHN0YWNrXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUb1N0YWNrKG93bmVyLCBrZXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVzb2x2ZShkZXBlbmRlbmNpZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbXB1dGVkT2JzZXJ2YWJsZS5jYWxsKG93bmVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXB1dGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogY29tcHV0ZWRVSUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkVmFsdWU6IG9sZFZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXZlbnQgbGlzdGVuOiBPbmUgb2YgZGVwZW5kZW5jeSB3aWxsIHJlc29sdmUgbGF0ZXJcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5vbignd2lsbC1jaGFuZ2UnLCAod2lsbENoYW5nZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIERvbid0IGNoYW5nZSBhbnl0aGluZyBpZiB2YWx1ZSBpZiBub3QgY3VycmVudCBoYW5kbGVkIG9yIHZhcmlhYmxlIGlzIGNvbXB1dGluZyBub3dcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICBpZiAod2lsbENoYW5nZS51aWQgIT09IGhhbmRsZWRWYWx1ZS51aWQgfHwgaXNDb21wdXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhhbmRsZUNoYW5nZSgpO1xuXG4gICAgICAgICAgICAgICAgaXNDb21wdXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5ldmVudFN0cmVhbS5wb3N0KCdyZWdpc3RlcmVkJywge1xuICAgICAgICAgICAgdWlkOiBjb21wdXRlZFVJRCxcbiAgICAgICAgICAgIG93bmVyOiBvd25lcixcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHVzZXJEZXBlbmRlbmNpZXMpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB1c2VyRGVwZW5kZW5jeSBvZiB1c2VyRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlT2JzZXJ2YWJsZSh1c2VyRGVwZW5kZW5jeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0RGVwZW5kZW5jaWVzKGNvbXB1dGVkT2JzZXJ2YWJsZSwgaGFuZGxlT2JzZXJ2YWJsZSk7XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG93bmVyLCBrZXksIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRTdHJlYW0ucG9zdCgnZ2V0Jywge1xuICAgICAgICAgICAgICAgICAgICB1aWQ6IGNvbXB1dGVkVUlELFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTGlicmFyeUVycm9yKCd5b3UgY2FuXFwndCBzZXQgdmFsdWUgdG8gY29tcHV0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGFycmF5KG93bmVyLCBrZXksIGluaXRpYWxWYWx1ZXMpIHtcbiAgICAgICAgbGV0IHVpZCA9IHRoaXMudXRpbHMuY3JlYXRlS2V5VUlEKG93bmVyLCBrZXkpO1xuXG4gICAgICAgIC8vVE9ETzogdHJhY2sgZGVwZW5kZW5jaWVzXG5cbiAgICAgICAgbGV0IG9ic2VydmFibGVBcnJheSA9IG5ldyBPYnNlcnZhYmxlQXJyYXkodGhpcy5ldmVudFN0cmVhbSwgaW5pdGlhbFZhbHVlcyk7XG5cbiAgICAgICAgb3duZXJba2V5XSA9IG9ic2VydmFibGVBcnJheTtcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob3duZXIsIGtleSwge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9ic2VydmFibGVBcnJheTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGJheHRlci5ldmVudFN0cmVhbS5wb3N0KCd1cGRhdGUnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVpZDogdWlkLFxuICAgICAgICAgICAgICAgICAgICBvd25lcjogb3duZXIsXG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVBcnJheTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBCYXh0ZXIud2F0Y2hcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAgICovXG4gICAgd2F0Y2gob2JqZWN0KSB7XG4gICAgICAgIGZvciAobGV0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIGlmICghb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlZChvYmplY3QsIGtleSwgdmFsdWUpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5KG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub2JzZXJ2YWJsZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJheHRlcjtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2JheHRlci5qc1xuICoqLyIsIi8qKlxuICogQGNsYXNzIEV2ZW50U2VydmljZVxuICovXG5jbGFzcyBFdmVudFNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKGRlZmF1bHRDb250ZXh0KSB7XG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gZGVmYXVsdENvbnRleHQgfHwgdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgLSBFdmVudCBuYW1lXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggZGF0YSBhcyBhcmd1bWVudFxuICAgICAqL1xuICAgIG9uKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICAgIGlmICghZXZlbnQgfHwgIWhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGluaXQgZXZlbnQgbGlzdGVuZXI6IG5vIHBhcmFtZXRlcnMgZ2l2ZW5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY2hhbm5lbHMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVscy5zZXQoZXZlbnQsIG5ldyBTZXQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5uZWxzLmdldChldmVudCkuYWRkKGhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBuYW1lIEV2ZW50U2VydmljZS5vbmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxuICAgICAqL1xuICAgIG9uY2UoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKCFldmVudCB8fCAhaGFuZGxlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgaW5pdCBldmVudCBsaXN0ZW5lcjogbm8gcGFyYW1ldGVycyBnaXZlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgICAgICBpZiAoIXRoaXMuY2hhbm5lbHMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgdGhpcy5jaGFubmVscy5zZXQoZXZlbnQsIG5ldyBTZXQoKSk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVyV3JhcHBlcihkYXRhKSB7XG4gICAgICAgICAgICB0aGF0Lm9mZihldmVudCwgaGFuZGxlcldyYXBwZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXIoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoYW5uZWxzLmdldChldmVudCkuYWRkKGhhbmRsZXJXcmFwcGVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2Uub2ZmXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW2hhbmRsZXJUb0RlbGV0ZV1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBvZmYoZXZlbnQsIGhhbmRsZXJUb0RlbGV0ZSkge1xuICAgICAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgZXZlbnQgbGlzdGVuZXI6IG5vIGV2ZW50XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFoYW5kbGVyVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWxzLmRlbGV0ZShldmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZXZlbnRIYW5kbGVycyA9IHRoaXMuY2hhbm5lbHMuZ2V0KGV2ZW50KTtcblxuICAgICAgICBldmVudEhhbmRsZXJzLmRlbGV0ZShoYW5kbGVyVG9EZWxldGUpO1xuXG4gICAgICAgIGlmICghZXZlbnRIYW5kbGVycy5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxzLmRlbGV0ZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbmFtZSBFdmVudFNlcnZpY2UucG9zdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHBvc3QoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgaWYgKCFldmVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcG9zdCB1bmRlZmluZWQgZXZlbnRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY2hhbm5lbHMuaGFzKGV2ZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50ICE9PSAnc3lzdGVtOmFsbCcpIHtcbiAgICAgICAgICAgIHRoaXMucG9zdCgnc3lzdGVtOmFsbCcsIHtcbiAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGhhbmRsZXIgb2YgdGhpcy5jaGFubmVscy5nZXQoZXZlbnQpLnZhbHVlcygpKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMuY29udGV4dCwgZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFsbChoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMub24oJ3N5c3RlbTphbGwnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMuY29udGV4dCwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRTZXJ2aWNlO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL3NlcnZpY2VzL2V2ZW50LmpzXG4gKiovIiwiY2xhc3MgTGlicmFyeUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ1tUd2luLmpzXTogJyArIG1lc3NhZ2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGlicmFyeUVycm9yO1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIC4vc3JjL2VudGl0aWVzL2Vycm9yLmpzXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==