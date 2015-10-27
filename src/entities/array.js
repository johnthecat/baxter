class ObservableArray extends Array {
    constructor(uid, owner, key, eventService, values) {
        super();
        Object.assign(this, values);
        this.length = values.length;
        this.eventStream = eventService;
        this.owner = owner;
        this.key = key;
        this.uid = uid;
    }

    push(value) {
        let index = super.push(value);

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'push',
            changed: this[index]
        });

        return index;
    }

    shift() {
        let deletedValue = super.shift();

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'shift',
            changed: deletedValue
        });

        return deletedValue;
    }

    pop() {
        let lastValue = super.pop();

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'pop',
            changed: lastValue
        });

        return lastValue;
    }

    unshift(...values) {
        let mergedArray = super.unshift.apply(this, values);

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'unshift',
            changed: values
        });

        return mergedArray;
    }

    reverse() {
        let reversedArray = super.reverse();

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'reverse',
            changed: reversedArray
        });

        return reversedArray;
    }

    sort(sortFunction) {
        let sortedArray = super.sort(sortFunction);

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'sort',
            changed: sortedArray
        });

        return sortedArray;
    }

    splice(...arguments) {
        let splicedArray = super.splice.apply(this, arguments);

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this,
            type: 'splice',
            changed: splicedArray
        });

        return splicedArray;
    }
}

export default ObservableArray;
