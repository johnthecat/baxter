/**
 * @name LibraryError
 */
class LibraryError extends Error {
    constructor(message) {
        super();

        this.message = '[Twin.js]: ' + message;
    }
}

export default LibraryError;
