const ERROR = {
    NO_INIT_PARAMETERS: `Can't init event listener: no parameters given`,
    NO_EVENT: `Event is undefined. Must be a String`
};

/**
 * @class EventService
 */
class EventService {
    constructor(customContext) {
        /**
         * @name EventService._channels
         * @type {Object}
         * @private
         */
        this._channels = {};

        /**
         * @name EventService.context
         * @type {Object}
         */
        this.context = customContext || this;
    }

    /**
     * @name EventService.getEvent
     * @param {String} event
     * @returns {Set}
     */
    getEvent(event) {
        if (!(event in this._channels)) {
            return this._channels[event] = new Set();
        }

        return this._channels[event];
    }

    /**
     * @name EventService.on
     * @param {String} event - Event name
     * @param {Function} handler - Callback function with data as argument
     */
    on(event, handler) {
        if (!event || !handler) {
            throw new Error(ERROR.NO_INIT_PARAMETERS);
        }

        this.getEvent(event).add(handler);
    }

    /**
     * @name EventService.once
     * @param {String} event
     * @param {Function} handler
     */
    once(event, handler) {
        if (!event || !handler) {
            throw new Error(ERROR.NO_INIT_PARAMETERS);
        }

        let that = this;

        this.getEvent(event).add(handlerWrapper);

        function handlerWrapper(data) {
            that.off(event, handlerWrapper);
            return handler(data);
        }
    }

    /**
     * @name EventService.off
     * @param {String} event
     * @param {Function} [handlerToDelete]
     * @returns {Boolean}
     */
    off(event, handlerToDelete) {
        if (!event) {
            throw new Error(ERROR.NO_EVENT);
        }

        if (!handlerToDelete) {
            return delete this._channels[event];
        }

        let eventHandlers = this._channels[event];

        eventHandlers.delete(handlerToDelete);

        if (!eventHandlers.size) {
            delete this._channels[event];
        }
    }

    /**
     * @name EventService.post
     * @param {String} event
     * @param {*} data
     */
    post(event, data) {
        if (!event) {
            throw new Error(ERROR.NO_EVENT);
        }

        if (!(event in this._channels)) {
            return false;
        }

        let eventHandlers = Array.from(this._channels[event]);
        let index = 0, size = eventHandlers.length;

        for (index; index < size; index++) {
            eventHandlers[index].call(this.context, data);
        }
    }
}

export default EventService;
