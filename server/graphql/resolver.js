const bcryptjs = require("bcryptjs");
const { UserModel } = require("../models/user");
const { PostModel } = require("../models/post");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { deleteImage } = require("../commons/file-helpers");
const { PostRepository } = require("./repository/post-repository");

exports.Root = {
	deletePost: async (args, req) => {
		if (!req.isAuth)
			throw new Error("Auth token is required to delete a post!");
		const id = args.id;

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
		// const io = IoFactory.get();
		// io.emit("posts" , {action : "delete-post" , posts , post});
		return posts;
	},
	editPost: async (args, req) => {
		if (!req.isAuth) throw new Error("Auth token missing!");

		const { id, title, content, imageUrl } = args;
		const posts = await PostRepository.save(id, title, content, imageUrl);
		console.log(posts);
		return posts;
	},
	getPosts: async (_, req) => {
		if (!req.isAuth) throw new Error("Auth token is missing");
		const posts = await PostRepository.get();
		return posts;
	},

	createPost: async ({ title, content, imageUrl }, req) => {
		if (!req.isAuth) throw new Error("Auth token is missing");
		const posts = await PostRepository.addNewPost(
			req.userid,
			title,
			content,
			imageUrl
		);
		return posts;
	},
	signIn: async (args, req) => {
		const { email, password } = args;

		const user = await UserModel.findOne({ email });

		if (!user) {
			const userNotFOundError = new Error("User not found");
			userNotFOundError.statusCode = 404;
			userNotFOundError.messages = ["user not found"];
			throw userNotFOundError;
		}
		const passwordIsGood = await bcryptjs.compare(password, user.password);
		if (!passwordIsGood) {
			const invalidPasswordError = new Error("Invalid password");
			invalidPasswordError.statusCode = 500;
			invalidPasswordError.messages = ["invalid password"];
			throw invalidPasswordError;
		}

		const token = jwt.sign(
			{ name: user.name, id: String(user._id) },
			"some-key",
			{ expiresIn: "1h" }
		);

		return { name: user.name, token };
	},
	createUser: async (args, req) => {
		const { name, email, password } = args.registerUserRequest;
		if (!validator.isEmail(email))
			throw new Error("Provided email is not valid");
		if (validator.isEmpty(name) || validator.isEmpty(password))
			throw new Error("Some input was empty");

		const user = await UserModel.findOne({ email });
		if (user) {
			throw new Error("Email address is registered already");
		}

		const duplicatNameCheck = await UserModel.findOne({ name });
		if (duplicatNameCheck) throw new Error(`${name} is already registered!`);

		const hashedPassword = await bcryptjs.hash(password, 12);
		const newUser = new UserModel({
			name,
			password: hashedPassword,
			email,
			status: "in-active"
		});

		await newUser.save();
		const result = { ...newUser._doc, _id: newUser._id.toString() };
		return result;
	}
};
