const express = require("express");
const authRoutes = express.Router();
const { body } = require("express-validator/check");

const { AuthController } = require("../controller/auth-controller");

const ctrl = new AuthController();

authRoutes.post("/signin", ctrl.signin);
authRoutes.put(
	"/signup",
	[
		body("name")
			.trim()
			.not()
			.isEmpty()
			.isLength({ min: 5 })
			.withMessage("Name is not provided"),
		body("password")
			.trim()
			.isLength({ min: 3 })
			.withMessage("password length is not valid"),
		body("email")
			.trim()
			.isEmail()
			.withMessage("Not valid email address").normalizeEmail()
	],
	ctrl.signup
);

exports.authRoutes = authRoutes;
