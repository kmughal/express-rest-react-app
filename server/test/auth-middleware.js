const { AuthMiddleware } = require("../middlewares/is-auth");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("Auth middleware", () => {

	it("should set req.Auth to false if no authorization header is present", () => {
		const req = {
			headers: []
		};

		const next = () => {};
		const res = {};
		AuthMiddleware(req, res, next);
		expect(req.isAuth).is.equal(false);
	});

	it("should throw an error if token is one word", () => {
		const req = {
			headers: []
		};

		req.headers["authorization"] = "DUMMYFAKESTRING";

		const next = () => {};
		const res = {};
		AuthMiddleware(req, res, next);
		expect(req.isAuth).is.equal(false);
	});

	it("should add the userid to request once a valid token is provided", () => {
		const req = {
			headers: []
		};

		req.headers["authorization"] =
			"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

		const next = () => {};
		const res = {};
		sinon.stub(jwt, "verify");
		jwt.verify.returns({ userid: -1 });
		AuthMiddleware(req, res, next);

    expect(req).to.have.property("userid");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
	});
});
