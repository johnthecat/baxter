let methods = [
    'push',
    'shift',
    'join',
    'concat',
    'pop',
    'unshift',
    'slice',
    'reverse',
    'sort',
    'splice'
];

let ObservableArray = function(uid, owner, key, eventStream, initialArray) {
    this.uid = uid;
    this.owner = owner;
    this.key = key;
    this.eventStream = eventStream;
};

for (let method of methods) {
    ObservableArray.prototype[method] = function() {
        let value = Array.prototype[method].apply(this, arguments);

        this.eventStream.post('update', {
            uid: this.uid,
            owner: this.owner,
            key: this.key,
            value: this
        });

        return value;
    }
}



export default ObservableArray;
