Baxter
======

Reactive data updating with minimal additional layer

## Overview

Baxter provides OORP without functional style.

## Features

* **Using ES6** - Library written in ES6 and compiled into ES5 by Babel. If you are using ES6 in your project - include library src and compile it with your bundle.
* **Easy to use** - The best interface is no interface. Use Baxter API only when constructing object, class instance or simple variable. After that just work with variables like always.
* **Dependency resolving** - Don't care about multiple recalculating of computed variable - Baxter tracks all dependencies and refreshes value only then it should.
* **Event driven architecture** - No dirty checking, no extra work when idle, Baxter works only when you really need it. You can easily listen events from Baxter and provide your own logic.
* **Correct async resolving** - If computed variable returns Promise, then field equals async call result, and all dependencies will wait until Promise get resolved.
* **Well optimized** - Each method is tested on performance.
* **Tiny weight** - Minified baxter size is only 11kb.



## Install

Bower:
```
bower install baxter --save
```



## Performance

There are some benchmark results for registering action (creating instance, track it and then dispose) and value change action (change variable and wait, until al dependencies will resolve)

**Hardware:** Macbook Pro middle 2015 - Core i5, 8Gb RAM


**Test class:**

```javascript
 class Test {
   constructor() {
     this.surname = 'Dorian';
     this.name = 'John';
     this.fullName = () => `${this.surname} ${this.name}`;

     baxter.watch(this);
   }
 }
```

| Browser    | Registration (ops/sec) | Changing ```Test.name``` (ops/sec) |
| -----------|------------------------| -----------------------------------|
| Chrome 49  | 27 000 - 34 000        | 400 000 - 600 000                  |
| Safari 9   | 41 000 - 44 000        | 380 000 - 415 000                  |
| Firefox 43 | 20 000 - 24 000        | 290 000 - 320 000                  |




## Examples

Classic example:

```javascript
 class User {
   constructor() {
     this.surname = 'Dorian';
     this.name = 'John';
     this.age = 30;
     this.fullName = `${this.surname} ${this.name}`;
     this.title = `${this.fullName} (${this.age})`;
   }
 }

 let user = new User();
 /**
  * {
  *    surname: 'Dorian',
  *    name: 'John',
  *    age: '30',
  *    fullName: 'Dorian John',
  *    title: 'Dorian John (30)',
  * }
  */
```

That's great, by this data is not reactive. Now let's try this:

```javascript
 class ReactiveUser {
   constructor() {
     this.surname = 'Dorian';
     this.name = 'John';
     this.age = 30;
     this.fullName = () => `${this.surname} ${this.name}`;
     this.title = () => `${this.fullName} (${this.age})`;

     baxter.watch(this);
   }
 }

 let reactiveUser = new ReactiveUser();
  /**
   * {
   *    surname: 'Dorian',
   *    name: 'John',
   *    age: '30',
   *    fullName: 'Dorian John',
   *    title: 'Dorian John (30)',
   * }
   */
```

After adding ```baxter.watch(this)``` data becomes reactive:
```javascript

  reactiveUser.name = 'Jack';
  reactiveUser.age = 31;
  console.log(reactiveUser.fullName) //Dorian Jack
  console.log(reactiveUser.title) //Dorian Jack (31)
```
But:

```javascript
  user.name = 'Jack';
  user.age = 31;
  console.log(user.fullName) //Dorian John
  console.log(user.title) //Dorian John (30)
```

Prototype is not changed at all:

```javascript
  class ProtoTest {
    constructor () {
      this.name = 'test';

      baxter.watch(this);
    }

    protoMethod() {
      return this.name;
    }
  }

  let protoTest = new ProtoTest();

  (typeof protoTest.protoMethod === 'function') //true
```



## API reference

### baxter.plugin(namespace, plugin)

* **namespace** {String} - name of your plugin
* **plugin** {*} - your plugin

```javascript
  baxter.plugin('somePlugin', () => alert('Hi, i\'m plugin!'));
  baxter.somePlugin(); //Will alert message
```

### baxter.watch(object)

* **object** {Object} - any object or instance of class

```javascript
  class Doctor {
    constructor(name, surname) {
      this.name = name;
      this.surname = surname;
      this.fullName = () => `${this.name} ${this.surname}`;
    }
  }

  let perryCox = baxter.watch(new Doctor('Perry', 'Cox'));
```
or

```javascript
  class Doctor {
    constructor(name, surname) {
      this.name = name;
      this.surname = surname;
      this.fullName = () => `${this.name} ${this.surname}`;

      baxter.watch(this); //You can call watch inside constructor
    }
  }

  let perryCox = new Doctor('Perry', 'Cox');
```

### baxter.variable(owner, key, initialValue)

* **owner** {Object} - context, where variable defines.
* **key** {String} - key of the variable.
* **initialValue** {*} - initial value of variable

```javascript
  class Raccoon {
    constructor(name) {
      this.name = baxter.variable(this, 'name', name);
    }
  }

  let raccoonDasha = new Raccoon('Dasha');

  console.log(racconDasha.name) //Dasha
```

### baxter.computed(owner, key, computed, userDependencies)

* **owner** {Object} - context, where variable defines.
* **key** {String} - key of the variable.
* **computed** {Function} - function, that return computed value.
* **userDependencies** {Array} - array of dependencies, that computed should track.
* **userDependencies.owner** {Object} - context, where variable defines.
* **userDependencies.key** {String} - key of the variable.

```javascript
  class Animal {
    constructor(type, name) {
      this.type = baxter.variable(this, 'type', type);
      this.name = baxter.variable(this, 'name', name);

      // What page we need in async call
      this.page = baxter.variable(this, 'page', 1);

      // Sync call
      this.title = baxter.computed(this, 'title', () => `Here is ${this.type.replace('_', ' ')} ${this.name}`);

      // Async call
      this.fullInfo = baxter.computed(this /* owner */, 'title' /* key */, () => fetch(`/api/animal/${this.type}/${this.name}`)
        .then((response) => {
         /**
          * "this.page" cannot be detected as dependency because of
          * async nature of function,
          * it's listed in the user dependencies
          */
          return response[this.page - 1];
        }) /* computed */, [
            {
                owner: this,
                key: 'page'
            }
        ] /* userDependencies */
      );
    }
  }

  let raccoonDasha = new Animal('raccoon', 'Dasha');

  console.log(raccoonDasha.title) // Here is raccoon Dasha
  console.log(raccoonDasha.fullInfo) // Promise, fetched to '/api/animal/raccoon/Dasha'

  raccoonDasha.type = 'happy_raccoon';

  console.log(raccoonDasha.title) //Here is happy raccoon Dasha
  console.log(raccoonDasha.fullInfo) //another Promise, fetched to '/api/animal/happy_raccoon/Dasha'

```
