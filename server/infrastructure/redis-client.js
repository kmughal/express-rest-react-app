const redis = require("redis");
const url = process.env.REDIS_SERVER || "redis://127.0.0.1:6379";
const { promisify } = require("util");
let client = null;

const createRedisClient = () => {
	if (client === null) {
		client = redis.createClient(url);
		client.on("error", console.log);
	}
	client.set = promisify(client.set);
	client.get = promisify(client.get);
	client.hset = promisify(client.hset);
	client.hget = promisify(client.hget);

	return client;
};

exports.createRedisClient = createRedisClient;
