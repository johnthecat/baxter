/**
 * @name BaxterError
 */
class BaxterError extends Error {
    constructor(message) {
        super();

        this.message = '[Baxter.js]: ' + message;
    }
}

export default BaxterError;
