const jwt = require("jsonwebtoken");

exports.AuthMiddleware = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		const noAuthHeaderError = new Error("Auth token not provided");
		noAuthHeaderError.messages = ["missing auth token"];
		throw noAuthHeaderError;
	}

	const token = authorizationHeader.split(" ")[1];
	let decodedToken = null;
	try {
		decodedToken = jwt.verify(token, "some-key");
	} catch (e) {
		console.log(e);
		e.statusCode = 500;
		e.messages = ["Invalid token"];
		throw e;
	}

	if (!decodedToken) {
		const notAuthorizedTokenError = new Error("Not authorized");
		notAuthorizedTokenError.statusCode = 401;
		throw notAuthorizedTokenError;
	}

	req.userid = decodedToken.id;
	next();
};
