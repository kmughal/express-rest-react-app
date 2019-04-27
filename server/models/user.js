const { Schema, model } = require("mongoose");

const UserModel = new Schema({
	name: { type: String, require: true },
	email: { type: String, required: true },
	password: { type: String, require: true },
	status: { type: String, require: true },
	posts: [
		{
			type: Schema.Types.ObjectId,
			ref: "Post"
		}
	]
});

exports.UserModel = model("User", UserModel);
