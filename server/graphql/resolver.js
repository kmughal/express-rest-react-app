const bcryptjs = require("bcryptjs");
const { UserModel } = require("../models/user");
const { PostModel } = require("../models/post");
const validator = require("validator");
const jwt = require("jsonwebtoken");

exports.Root = {
	getPosts: async (_,req) => {
    
    if (!req.isAuth) throw new Error("Auth token is missing")
		const posts = await PostModel.find({});
		const result = posts.map(post => {
			return {
				title: post.title,
				content: post.content,
				image: post.image,
				_id: post._id
			};
		});
		console.log(result);
		return result;
	},

	createPost: async ({ title, content,imageUrl }, req) => {
    if (!req.isAuth) throw new Error("Auth token is missing");
		 
		if (validator.isEmpty(imageUrl)) {
			const missingImageFileError = new Error();
			missingImageFileError.statusCode = 422;
			missingImageFileError.message = "missing image!";
      //return next(missingImageFileError);
      throw missingImageFileError;
    }
    if (validator.isEmpty(title)) throw new Error("Title is empty");
    if (validator.isEmpty(content)) throw new Error("Content is empty");

		console.log(
			"request to add a new post, title:",
			title,
			" content:",
			content,
			" image path : ",
			imageUrl
		);
		const newPost = new PostModel({
			title,
			content,
			image: imageUrl,
      createdBy: req.userid,
      status : "active"
		});
		await newPost.save();
		const user = await UserModel.findById(req.userid);
		user.posts.push(newPost);
		await user.save();

		const posts = await PostModel.find({});
		// const io = IoFactory.get();
		// io.emit("posts", { action: "post-created", posts, newPost });

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
