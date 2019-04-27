const express = require("express");
const postRoutes = express.Router();

const { body } = require("express-validator/check");

const { PostController } = require("../controller/posts-controller");

const ctrl = new PostController();

postRoutes.get("/", ctrl.get);

postRoutes.post(
	"/",
	[
		body("title")
			.trim()
			.isLength({ min: 5 })
			.withMessage("Title can not empty"),
		body("content")
			.trim()
			.isLength({ min: 5 })
			.withMessage("Content can not be empty")
	],
	ctrl.post
);

postRoutes.delete(
	"/",
	[
		body("id")
			.trim()
			.isLength({ min: 1 })
			.withMessage("Id not provided")
	],
	ctrl.deletePost
);

postRoutes.put("/", ctrl.editPost);

exports.postRoutes = postRoutes;
