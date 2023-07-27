const { Redis } = require("ioredis");

class CacheService {
  constructor() {
    this._client = new Redis();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, "EX", expirationInSecond);
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache tidak ditemukan");

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
