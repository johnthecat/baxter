class LibraryError {
    constructor(message) {
        return new Error('[Twin.js]: ' + message);
    }
}

export default LibraryError;