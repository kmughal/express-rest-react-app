const { expect } = require("chai");
const sinon = require("sinon");
const { AuthController } = require("../controller/auth-controller");
const { UserModel } = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ctrl = new AuthController();
let req = { body: { email: null } };
const res = {
	statusCode: -1,
	status: s => {
		res.statusCode = s;
		return res;
	},
	json: json => (res.result = json),
	result: null
};

describe("Auth controller", () => {
	describe("Sign in tests", () => {
		afterEach(() => {
			UserModel.findOne.restore && UserModel.findOne.restore();
			bcryptjs.compare.restore && bcryptjs.compare.restore();
		});
		it("should throw an error when database connection fails", done => {
			sinon.stub(UserModel, "findOne");
			UserModel.findOne.throws();
			ctrl
				.signin(req, res, e => e)
				.then(r => {
					expect(r).to.be.an("error");
					expect(r).to.have.property("statusCode", 500);
					done();
				})
				.catch(e => console.log(e));
		});
		it("should throw an error when user is not found", async () => {
			sinon.stub(UserModel, "findOne");
			UserModel.findOne.returns(false);

			const next = userNotFound => {
				return {
					statusCode: userNotFound.statusCode,
					message: userNotFound.message
				};
			};
			const actual = await ctrl.signin(req, res, next);
			expect(actual.statusCode).equals(404);
			expect(actual.message).to.be.equal("User not found");
		});

		it("should throw an error when password is invalid", async () => {
			req = { body: { email: "test@gmail.com", password: "hello" } };
			sinon.stub(UserModel, "findOne");
			UserModel.findOne.returns(true);

			sinon.stub(bcryptjs, "compare");
			bcryptjs.compare.returns(false);
			const next = e => {
				return {
					statusCode: e.statusCode,
					message: e.message
				};
			};

			const actual = await ctrl.signin(req, res, next);
			expect(actual.statusCode).equals(500);
			expect(actual.message).to.be.equal("Invalid password");
		});

		it("should return username and token for valid account", async () => {
			req = { body: { email: "test@gmail.com", password: "hello123" } };
			const token = Math.random().toString();
			const fakeUser = { name: "FAKE_USER", token };
			sinon.stub(UserModel, "findOne");
			UserModel.findOne.returns(fakeUser);
			sinon.stub(bcryptjs, "compare");
			bcryptjs.compare.returns(true);
			sinon.stub(jwt, "sign");
			jwt.sign.returns(token);
			const actual = await ctrl.signin(req, res, () => {});
			expect(res.statusCode).to.be.equal(200);
			expect(res.result).to.deep.equal(fakeUser);
		});
	});
});
