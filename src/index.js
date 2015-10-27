import baxter from './baxter';

((name, lib, browserContext) => {
    if (browserContext) {
        browserContext[name] = lib;
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = lib;
        }
        exports[name] = lib;
    }
})('baxter', baxter, window);
