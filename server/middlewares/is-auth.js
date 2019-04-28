const jwt = require("jsonwebtoken");

exports.AuthMiddleware = (req, res, next) => {
	const authorizationHeader = req.headers.authorization;
	if (!authorizationHeader) {
		// const noAuthHeaderError = new Error("Auth token not provided");
		// noAuthHeaderError.messages = ["missing auth token"];
		// throw noAuthHeaderError;
		req.isAuth = false;
		return next();
	}

	const token = authorizationHeader.split(" ")[1];
	let decodedToken = null;
	try {
		decodedToken = jwt.verify(token, "some-key");
	} catch (e) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		// const notAuthorizedTokenError = new Error("Not authorized");
		// notAuthorizedTokenError.statusCode = 401;
		// throw notAuthorizedTokenError;
		req.isAuth = false;
		return next();
	}
	req.isAuth = true;
	req.userid = decodedToken.id;
 console.log("auth token set")
	next();
};

