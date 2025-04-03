const NodeCache = require('node-cache');
const config = require('../config/config');

class CacheService {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: config.CACHE_TTL,
            checkperiod: config.CACHE_TTL * 0.2,
            useClones: false
        });
    }

    // Get data from cache
    get(key) {
        return this.cache.get(key);
    }

    // Set data in cache
    set(key, data) {
        return this.cache.set(key, data);
    }

    // Delete data from cache
    del(key) {
        return this.cache.del(key);
    }

    // Clear all cache
    flush() {
        return this.cache.flushAll();
    }

    // Get multiple items
    getMulti(keys) {
        return this.cache.mget(keys);
    }

    // Set multiple items
    setMulti(items) {
        return this.cache.mset(items);
    }

    // Check if key exists
    has(key) {
        return this.cache.has(key);
    }

    // Get cache statistics
    getStats() {
        return this.cache.getStats();
    }
}

module.exports = new CacheService();
