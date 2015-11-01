Baxter
======

### Reactive data updating with minimal additional layer

## Overview

Baxter creates reactive bindings without wrapping into functions.

## Features

* **Using ES6** - Library written in ES6 and compiled into ES5 by Babel. If you are using ES6 in your project - include library src and compile it with your bundle.
* **Easy to use** - The best interface is no interface. Use Baxter API only when constructing object, class instance or simple variable. After that just work with variables like always.
* **Dependency resolving** - Don't care about multiple recalculating of computed variable - Baxter tracks all dependencies and refreshes value only then it should.
* **Event driven architecture** - No dirty checking, no extra work when idle, Baxter works only when you really need it. You can easily listen events from Baxter and provide your own logic.
* **Correct async resolving** - If computed variable returns Promise, then field equals async call result, and all dependencies will wait until Promise get resolved.
* **Well optimized** - Each method is tested on performance.
* **Tiny weight** - Minified baxter size is only 10.5kb.

## Install

Bower:
```
bower install baxter --save
```

## Examples

Classic example:

```javascript
 class User {
   constructor() {
     this.surname = 'Dorian';
     this.name = 'John';
     this.age = 30;
     this.fullName = this.surname + ' ' + this.name;
     this.title = this.fullName + ' (' + this.age + ')';
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
     this.fullName = () => this.surname + ' ' + this.name;
     this.title = () => this.fullName + ' (' + this.age + ')';

     baxter.watch(this);
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

Class instances hasn't any difference between them, but:

```javascript
  user.name = 'Jack';
  user.age = 31;
  console.log(user.fullName) //Dorian John
  console.log(user.title) //Dorian John (30)

  // But

  reactiveUser.name = 'Jack';
  reactiveUser.age = 31;
  console.log(reactiveUser.fullName) //Dorian Jack
  console.log(reactiveUser.title) //Dorian Jack (31)
```

## API reference

### baxter.watch(object)

* **object** {Object} - any object or instance of class

```javascript
  class Doctor {
    constructor(name, surname) {
      this.name = 'name';
      this.surname = 'surname';
      this.fullName = () => this.name + ' ' + this.surname;
    }
  }

  let perryCox = baxter.watch(new Doctor('Perry', 'Cox'));
```
or

```javascript
  class Doctor {
    constructor(name, surname) {
      this.name = 'name';
      this.surname = 'surname';
      this.fullName = () => this.name + ' ' + this.surname;

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
      this.name = baxter.observable(this, 'name', name);
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
      this.type = baxter.observable(this, 'type', type);
      this.name = baxter.observable(this, 'name', name);

      // What page we need in async call
      this.page = baxter.observable(this, 'page', 1);

      // Sync call
      this.title = baxter.computed(this, 'title', () => 'Here is ' + this.type.replace('_', ' ') + ' ' + this.name);

      // Async call
      this.fullInfo = baxter.computed(this /* owner */, 'title' /* key */, () => fetch('/api/animal/' + this.type + '/' + this.name)
        .then((response) => {
         /**
          * "this.page" cannot be detected as dependency because of
          * async nature of function,
          * it's listed in the user dependencies
          */
          return response[this.page - 1];
        }); /* computed */, [
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
