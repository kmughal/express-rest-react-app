const puppeteer = require("puppeteer");

exports.CustomPage = class CustomPage {
	constructor(page) {
		this.page = page;
	}

	static async buildPage() {
		const newBrowser = await puppeteer.launch({ headless: true , args : ['--no-sandbox']});
		const newPage = await newBrowser.newPage();
		const self = new CustomPage(newPage);

		return new Proxy(self, {
			get: function(target, property) {
				return newBrowser[property] || target[property] || newPage[property];
			}
		});
	}

	async getSignInButtonText() {
		return await this.page.$eval(
			".top-action a:nth-child(2)",
			el => el.innerHTML
		);
	}

	async redirectToSignInPageAndGetUrl() {
		await this.page.click(".top-action a:nth-child(2)");
		const url = await this.page.url();
		return url;
	}

	async login(email, password) {
		await this.page.click(".top-action a");

		await this.page.waitFor("#email");
		await this.page.type("#email", email);
		await this.page.type("#password", password);
		await this.page.click(".action-buttons button");
		await this.page.waitFor(".all-posts");

		const url = await this.page.url();
		return url;
	}

	async signout(email, password) {
		await this.page.click(".top-action a");
		await this.page.type("#email", email);
		await this.page.type("#password", password);
		await this.page.click(".action-buttons button");
		await this.page.waitFor(".all-posts");
		await this.page.click(".top-action a");
		await this.page.waitFor(".logout-message");
		const url = await this.page.url();
		return url;
	}
};
