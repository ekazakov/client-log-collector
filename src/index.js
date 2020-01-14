const { isEmpty } = require('lodash');

class Collector {
    storage = [];
    intervalHandler = null;
    lock = Promise.resolve(null);

    constructor() {
        this.intervalHandler = setInterval(this.onInterval, 100);
    }

    onInterval = () => {
        if (!isEmpty(this.storage)) {
            this.send();
        }
    };

    put(item) {
        this.storage.push(item);

        if (this.storage.length > 10) {
            this.send();
        }
    }

    async send() {
        await this.lock;
        this.lock = new Promise(resolve => {
            setTimeout(() => {
                resolve([...this.storage]);
            });
        });

        this.clearStorage();
    }

    clearStorage() {
        this.storage.length = 0;
    }
}

module.exports = Collector;
