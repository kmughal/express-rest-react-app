const redis = require("redis");
const url = process.env.REDIS_SERVER || "redis://localhost:6379";
const { promisify } = require("util");
let client = null;

const createRedisClient = () => {
	if (client === null) {
		client = redis.createClient(url);
	}
	client.set = promisify(client.set);
	client.get = promisify(client.get);

	return client;
};

exports.createRedisClient = createRedisClient;
