const {
	createTestUserIfNotPresent,
	deleteTestUser
} = require("./factories/user-factory");

require("dotenv").config();

let page = null;

const { CustomPage } = require("./proxies");

beforeEach(async () => {
	page = await CustomPage.buildPage();
	await page.goto("http://localhost:3000");
});

afterEach(async () => await page.close());

test("when sign in, should redirects user to sign in page.", async done => {
	const signinPageUrl = await page.redirectToSignInPageAndGetUrl();
	expect(signinPageUrl).toMatch(/signin/gi);
	done();
});

// test("When login details are correct, should take user to all-post page.", async done => {
// 	let user = { email: "test@gmail.com", password: "123456" };
// 	if (process.env.NODE_ENV.toLowerCase() !== "ci") {
// 		user = await createTestUserIfNotPresent();
// 	}
// 	const url = await page.login(user.email, user.password);
// 	expect(url).toMatch(/all-posts/);

// 	await deleteTestUser();
// 	done();
// }, 30000);

// test("when user sign's out, user should be taken to sign in page.", async done => {
// 	let user = { email: "test@gmail.com", password: "123456" };
// 	if (process.env.NODE_ENV.toLowerCase() !== "ci") {
// 		user = await createTestUserIfNotPresent();
// 	}
// 	const url = await page.signout(user.email, user.password);
// 	expect(url).toMatch(/logout/);
// 	await deleteTestUser();
// 	done();
// }, 30000);
