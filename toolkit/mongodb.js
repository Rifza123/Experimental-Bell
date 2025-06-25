import { MongoClient } from 'mongodb';

class MongoCollection {
  constructor(db, collection) {
    this._db = db;
    this._collection = db.collection(collection);
    this.collection = collection;
    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (prop in target._collection) return target._collection[prop];
      },
    });
  }

  async _ensureConnection() {
    if (!this._db?.client?.topology?.isConnected?.()) {
      console.warn(
        `[MongoCollection] Lost connection, attempting to reconnect...`
      );
      await this._db.client.connect();
    }
    this._collection = this._db.collection(this.collection);
  }

  async get(id) {
    await this._ensureConnection();
    try {
      let { data } = (await this._collection.findOne({ id })) || {};
      console.log('✅Done fetching data: ' + id);
      return data;
    } catch (err) {
      console.error(
        `Error fetching data (id: ${id}) in collection ${this.collection}:`,
        err
      );
      return undefined;
    }
  }

  async set(id, data) {
    await this._ensureConnection();
    try {
      let res = await this._collection.updateOne(
        { id },
        { $set: { data, id } },
        { upsert: true }
      );
      return res;
    } catch (err) {
      console.error(
        `Error saving data (id: ${id}) to collection ${this.collection}:`,
        err
      );
      return undefined;
    }
  }

  async delete(id) {
    await this._ensureConnection();
    return await this._collection.deleteOne({ id });
  }
}

export class Mongo {
  constructor(uri, options = {}, collections = []) {
    this.uri = uri;
    this.options = options;
    this.client = new MongoClient(uri, options);
    this.db = null;
    this._collections = collections;
  }

  async init() {
    await this.client.connect();
    this.db = this.client.db();
    for (const name of this._collections) {
      this[name] = new MongoCollection(this.db, name);
    }
    console.log('MongoDB connected');
    return this;
  }

  collection(name) {
    return new MongoCollection(this.db, name);
  }

  async close() {
    await this.client.close();
  }
}
