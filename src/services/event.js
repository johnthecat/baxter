/**
 * @class EventService
 */
class EventService {
    constructor(defaultContext) {
        this.channels = new Map();

        this.context = defaultContext || this;
    }

    /**
     * @name EventService.on
     * @param {string} event - Event name
     * @param {function} handler - Callback function with data as argument
     */
    on(event, handler) {
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
    once(event, handler) {
        if (!event || !handler) {
            throw new Error("Can't init event listener: no parameters given");
        }

        let that = this;

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
    off(event, handlerToDelete) {
        if (!event) {
            throw new Error("Can't remove event listener: no event");
        }

        if (!handlerToDelete) {
            return this.channels.delete(event);
        }

        let eventHandlers = this.channels.get(event);

        eventHandlers.delete(handlerToDelete);

        if (!eventHandlers.size) {
            this.channels.delete(event);
        }
    }

    /**
     * @name EventService.post
     * @param {string} event
     * @param {*} data
     * @returns {Promise}
     */
    post(event, data) {
        if (!event) {
            throw new Error("Can't post undefined event");
        }

        if (!this.channels.has(event)) {
            return new Promise((resolve) => resolve());
        }

        if (event !== 'system:all') {
            this.post('system:all', {
                event: event,
                data: data
            });
        }

        return new Promise((resolve) => {
            for (let handler of this.channels.get(event).values()) {
                handler.call(this.context, data);
            }
            resolve();
        });
    }

    all(handler) {
        this.on('system:all', (data) => {
            handler.call(this.context, data);
        });
    }
}

export default EventService;