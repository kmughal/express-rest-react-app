const mongodb = require("mongodb");
const bcryptjs = require("bcryptjs");

let client = null;
require('dotenv').config();

const getDb = async collectionName => {
	if (client === null)
		client = await mongodb.connect(process.env.MONGODB || 'mongodb://127.0.0.1:27017/test', {
			useNewUrlParser: true
		});

	const db = await client.db();
	const collection = await db.collection(collectionName);
	return collection;
};

const createTestUserIfNotPresent = async () => {
	const userCollection = await getDb("users");
	const searchUser = await userCollection.findOne({ email: "test@gmail.com" });
	if (searchUser !== null) {
		searchUser.password = '123456';
		return searchUser;
	}
	const hashedPassword = await bcryptjs.hash("123456", 12);
	const user = await userCollection.insertOne({
		email: "test@gmail.com",
		password: hashedPassword,
		posts: [],
		status: "dummy account",
		name: "test account"
	});
	user.password = '123456';
	return user;
};

const deleteTestUser = async () => {
	const userCollection = await getDb("user");
	await userCollection.deleteOne({ email: "test@gmail.com" });
};

exports.deleteTestUser = deleteTestUser;
exports.createTestUserIfNotPresent = createTestUserIfNotPresent;
