const bcryptjs = require("bcryptjs");
const { UserModel } = require("../models/user");
const validator = require("validator");


exports.Root = {
	createUser: async (args, req) => {
		const { name, email, password } = args.registerUserRequest;
    if (!validator.isEmail(email)) throw new Error("Provided email is not valid");
    if (validator.isEmpty(name) || validator.isEmpty(password)) throw new Error("Some input was empty");
    
		const user = await UserModel.findOne({ email });
		if (user) {
			throw new Error("Email address is registered already");
		}
		const hashedPassword = await bcryptjs.hash(password, 12);
		const newUser = new UserModel({
			name,
			password: hashedPassword,
			email,
			status: "in-active"
		});

		await newUser.save();
    const result = {...newUser._doc , _id : newUser._id.toString()};
    return result;
	}
};
