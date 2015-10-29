### 0.1.2
#### Bug fixes
* Fixed bug, when computed function calls with wrong context.

#### Improvements
* Increased performance of computed variables registering 5x times.
* Now Baxter checks input data and throws error, if something wrong.
* Now Baxter checks that this variable already tracked.


### 0.1.1
#### Bug fixes
* Fixed some memory leaks

#### Improvements
* Increased performance 1.5x - 1.7x times
* New API method: `baxter.watch(object)`
* New API method: `baxter.dispose(object[, key])`
* Now you can choice which channel you want to subscribe (`baxter.subscribe(owner, key[, eventType])`). Default channel is `update`.
* Now you have special flag to call callback function in  `baxter.subscribe` only once (`baxter.subscribe(owner, key[, eventType, once])`).
* Now all methods calls eventService via proxy methods. This is another step toward the future system of plugins.
* Now there is no global stack of object uids. Now every modified object has own non-enumerable value `__uid__`
* Now baxter.js returns instance of class, instead of class.
* `EventService` class now uses `Object` for channels, instead of `Map`. It increases performance 2x times.


### 0.1.0
* First commit
