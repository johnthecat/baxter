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

    //TODO delete
    class Test {
        constructor() {
            this.id = 1;

            this.name = 'Tom';
            this.surname = 'Jarvis';

            this.fullName = () => {
                return this.name + ' ' + this.surname;
            };

            this.array = [1, 2 ,3 ,4, 5, 6, 7, 8];
        }
    }

    function scope() {
        let test = new Test();

        lib.watch(test);

        test.name = 'John';
        test.surname = 'Dorian';

        lib.dispose(test);
    }

    function bench(times) {
        if (!times) {

            return;
        }

        for(let i = 0; i < 1000; i++) {
            scope();
        }

        bench(--times);
    }

    function perf(times = 5) {
        let t0 = performance.now();
        bench(times);
        let t1 = performance.now();
        console.log("Perf for " + times  + ': ' + (t1 - t0) + " milliseconds.")
    }

    browserContext['perf'] = perf;
    //browserContext['test'] = lib.watch(new Test());

    //lib.eventStream.on('update', (changes) => console.log('update', changes.uid, ': ', changes.value));

})('baxter', baxter, window);
