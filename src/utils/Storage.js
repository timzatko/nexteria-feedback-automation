class Storage {
    static set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        } else {
            value = value.toString();
        }

        localStorage.setItem(key, value);
    }

    static get(key) {
        return localStorage.getItem(key);
    }

    static clear() {
        localStorage.clear();
    }
}

export default Storage;
