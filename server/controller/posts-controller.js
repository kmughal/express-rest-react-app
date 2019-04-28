const { validationResult } = require("express-validator/check");
const { PostModel } = require("../models/post");
const { deleteImage } = require("../commons/file-helpers");
const { UserModel } = require("../models/user");

const { IoFactory } = require("../infrastructure/io-factory");


let self = null;

class PostController {
	constructor() {
		self = this;
	}

	async get(req, res, next) {
		const posts = await PostModel.find({ createdBy: req.userid });
		res.status(200).json(posts);
	}

	async deletePost(req, res, next) {
		const id = req.body.id;

		if (!id) {
			return next(new Error("Post id not found"));
		}
		const post = await PostModel.findById(id);
		if (!post) {
			return next(new Error("No post found"));
		}
		const imagePath = post.image;
		deleteImage(imagePath)
			.then(v => v)
			.catch(e => console.log(e));
		await PostModel.deleteOne({ _id: id });
		const user = await UserModel.findById(req.userid);
		user.posts.pull(id);
		await user.save();
		const posts = await PostModel.find({});
		const io = IoFactory.get();
		io.emit("posts" , {action : "delete-post" , posts , post});
		res.json(posts);
	}

	async post(req, res, next) {
		if (req.body.id) return self.editPost(req, res, next);
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			const customError = new Error();
			customError.statusCode = 422;
			customError.messages = errors.array().map(e => e.msg);
			return next(customError);
		}
		const { title, content } = req.body;
		const image = req.file;
		console.log(image.path, "path");
		if (!image) {
			const missingImageFileError = new Error();
			missingImageFileError.statusCode = 422;
			missingImageFileError.message = "missing image!";
			return next(missingImageFileError);
		}
		console.log(
			"request to add a new post, title:",
			title,
			" content:",
			content,
			" image path : ",
			image.path
		);
		const newPost = new PostModel({
			title,
			content,
			image: image.path,
			createdBy: req.userid
		});
		await newPost.save();
		const user = await UserModel.findById(req.userid);
		user.posts.push(newPost);
		await user.save();
		
		const posts = await PostModel.find({});
		const io = IoFactory.get();
		io.emit("posts", { action: "post-created", posts, newPost });
		res.status(201).json(posts);
	}

	async editPost(req, res, next) {
		const id = req.body.id;

		const post = await PostModel.findOne({ _id: id });
		const updatedTitle = req.body.title,
			updatedContent = req.body.content;

		post.title = updatedTitle;
		post.content = updatedContent;

		const image = req.file;

		if (image) {
			await deleteImage(post.image);
			post.image = image.path;
		}
		await post.save();
		const user = await UserModel.findById(req.userid);

		const posts = await PostModel.find({});
		const io = IoFactory.get();
		io.emit("posts" , {action : "updated-post" , posts , post});
		return res.json(posts);
	}
}

exports.PostController = PostController;
