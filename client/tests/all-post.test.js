const puppeteer = require("puppeteer");

test("add two numbers" , async () => {
  expect(2).toEqual(2);
  const browser = await puppeteer.launch({});
  const page = browser.newPage();
  
})