const mongoose = require("mongoose");

const PostModel = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, require: true },
		image: { type: String, require: true },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	},
	{ timestamps: true }
);

exports.PostModel = mongoose.model("post", PostModel);
