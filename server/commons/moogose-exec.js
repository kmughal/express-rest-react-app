const mongoose = require("mongoose");
const { createRedisClient } = require("../infrastructure/redis-client");

const exec = mongoose.Query.prototype.exec;
const redisClient = createRedisClient();

mongoose.Query.prototype.enableCache = function() {
	this.cacheResults = true;
	return this;
};

mongoose.Query.prototype.disableCache = function() {
	this.cacheResults = false;
	return this;
};

mongoose.Query.prototype.exec = async function() {
	const enableCache = "cacheResults" in this;
	if (!enableCache) return exec.apply(this, arguments);

	// 1 create a unique key
	const collectionname = this.mongooseCollection.name;
	const queryOption = this.getQuery();
	const key = JSON.stringify(
		Object.assign({}, queryOption, { collection: collectionname })
	);

	// 2 check the value in redis if present then return from radis
	const cacheValueString = await redisClient.get(key);
	if (cacheValueString) {
		console.log("serving from cache");
		const cacheValue = JSON.parse(cacheValueString);

		return Array.isArray(cacheValue)
			? cacheValue.map(d => this.model(d))
			: this.model(cacheValue);
	}
	// 3 fall back to original version, run the query and store in cache.
	const result = await exec.apply(this, arguments);
	redisClient.set(key, JSON.stringify(result));
	return result;
};
