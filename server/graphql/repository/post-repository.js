const validator = require("validator");

const { createRedisClient } = require("../../infrastructure/redis-client");
const { deleteImage } = require("../../commons/file-helpers");

const { PostModel } = require("../../models/post");
const { UserModel } = require("../../models/user");

const ALL_POSTS = "ALL_POSTS";
const redisClient = createRedisClient();

exports.PostRepository = class PostRepository {
	static async deletePost(postId, userId) {
		if (!postId) {
			return next(new Error("Post id not found"));
		}

		const post = await PostModel.findById(postId);
		if (!post) {
			return next(new Error("No post found"));
		}

		const imagePath = post.image;
		deleteImage(imagePath)
			.then(v => v)
			.catch(e => console.log(e));

		await PostModel.deleteOne({ _id: postId });

		const user = await UserModel.findById(userId);
		user.posts.pull(postId);
		await user.save();
		redisClient.del(ALL_POSTS);

		const posts = await PostRepository.get();
		return posts;
	}

	static async addNewPost(createdBy, title, content, imageUrl) {
		if (validator.isEmpty(imageUrl)) {
			const missingImageFileError = new Error();
			missingImageFileError.statusCode = 422;
			missingImageFileError.message = "missing image!";
			throw missingImageFileError;
		}
		if (validator.isEmpty(title)) throw new Error("Title is empty");
		if (validator.isEmpty(content)) throw new Error("Content is empty");

		const newPost = new PostModel({
			title,
			content,
			image: imageUrl,
			createdBy: createdBy,
			status: "active"
		});

		await newPost.save();
		const user = await UserModel.findById(createdBy);
		user.posts.push(newPost);
		await user.save();
		redisClient.del(ALL_POSTS);

		const posts = await PostRepository.get();
		return posts;
	}

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
