import Baxter from './baxter';

((name, constructor, browserContext) => {
    let lib = new constructor();

    if (browserContext) {
        browserContext[name] = lib;
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = lib;
        }
        exports[name] = lib;
    }

})('baxter', Baxter, window);
