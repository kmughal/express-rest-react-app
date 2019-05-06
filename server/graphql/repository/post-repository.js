const { createRedisClient } = require("../../infrastructure/redis-client");
const { PostModel } = require("../../models/post");

const { deleteImage } = require("../../commons/file-helpers");

const ALL_POSTS = "ALL_POSTS";
const redisClient = createRedisClient();

exports.PostRepository = class PostRepository {
	
	static async save(id, title, content, imageUrl) {
		const post = await PostModel.findOne({ _id: id });

		post.title = title;
		post.content = content;

		if (post.image != imageUrl) {
			await deleteImage(post.image);
			post.image = imageUrl;
		}

		await post.save();
		redisClient.del(ALL_POSTS);

		const posts = await PostRepository.get();
		return posts;
	}

	static async get() {
		const cachedPosts = await redisClient.get(ALL_POSTS);
		console.log("from cache", cachedPosts);
		let posts = null;

		if (cachedPosts) posts = JSON.parse(cachedPosts);
		else {
			posts = await PostModel.find({});
			await redisClient.set(ALL_POSTS, JSON.stringify(posts));
		}

		const reducedPosts = posts.map(post => {
			return {
				title: post.title,
				content: post.content,
				image: post.image,
				_id: post._id
			};
		});
		return reducedPosts;
	}
};
