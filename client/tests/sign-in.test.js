const puppeteer = require("puppeteer");

const {
	createTestUserIfNotPresent,
	deleteTestUser
} = require("./factories/user-factory");

require("dotenv").config();

let browser = null;
let page = null;

beforeEach(async () => {
	browser = await puppeteer.launch({ headless: true });
	page = await browser.newPage();
	await page.goto("http://localhost:3000");
});

afterEach(async () => await browser.close());

test("should have a sign in hyperlink", async done => {
	const text = await page.$eval(
		".top-action a:nth-child(2)",
		el => el.innerHTML
	);
	expect(text).toEqual("Sign in");
	done();
});

test("clicking sign in redirects user to sign in page", async done => {
	await page.click(".top-action a:nth-child(2)");

	const signinPageUrl = await page.url();

	expect(signinPageUrl).toMatch(/signin/gi);
	done();
});

test("enter valid login details should sign in the user", async done => {

	await page.click(".top-action a");
	const user = await createTestUserIfNotPresent();

	await page.waitFor("#email");
	await page.type("#email", user.email);
	await page.type("#password", user.password);
	await page.click(".action-buttons button");
	await page.waitFor(".all-posts");

	const url = await page.url();
	expect(url).toMatch(/all-posts/);

	await deleteTestUser();
	done();
});

test("clicking sign out should take user to sign in page", async done => {

	await page.click(".top-action a");
	const user = await createTestUserIfNotPresent();

	await page.type("#email", user.email);
	await page.type("#password", user.password);
	await page.click(".action-buttons button");
	await page.waitFor(".all-posts");
	await page.click(".top-action a");
	await page.waitFor(".logout-message");
	const url = await page.url();

	expect(url).toMatch(/logout/);

	await deleteTestUser();
	done();
});
