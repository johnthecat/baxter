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

    //TODO delete
    class Test {
        constructor() {
            this.id = 1;

            this.name = 'Tom';
            this.surname = 'Jarvis';

            this.fullName = () => {
                return this.name + ' ' + this.surname;
            };

            this.async = () => {
                let name = this.name;
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(name + ' async');
                    }, 2000);
                });
            };

            this.depFromAsync = () => {
                return this.async + ' dependency!';
            };

            this.array = [1, 2 ,3 ,4, 5, 6, 7, 8];
        }
    }

    function scope() {
        let test = new Test();

        lib.watch(test);
    }

    function bench() {
        console.time('bench');
        for(let i = 0; i < 10000; i++) {
            scope();
        }
        console.timeEnd('bench');
    }

    browserContext['bench'] = bench;
    browserContext['test'] = lib.watch(new Test());

    lib.eventStream.on('update', (changes) => console.log('update', changes));

})('baxter', Baxter, window);
