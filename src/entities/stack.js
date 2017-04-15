/**
 * @class Stack
 */
class Stack {
    constructor() {
        this._queue = new Map();
    }

    get size() {
        return this._queue.size;
    }

    /**
     * @name Stack#add
     * @param {String} uid
     * @param {Promise} promise
     */
    add(uid, promise) {
        this._queue.set(uid, promise);
    }

    /**
     * @name Stack#delete
     * @param {String} uid
     * @returns {Boolean}
     */
    delete(uid) {
        return this._queue.delete(uid);
    }

    /**
     * @name Stack#getDependencies
     * @param {Array.<String>} dependencies
     */
    getDependencies(dependencies) {
        return dependencies.map((dependency) => {
            return this._queue.get(dependency);
        });
    }
}

export default Stack;
