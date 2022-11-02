import puppeteer from "puppeteer";

(async () => {
  let browser = await puppeteer.launch({ headless: false });
  let page = await browser.newPage();
  await page.goto("https://arrow.com/en/products", {
    waitUntil: "load",
    timeout: 0,
  });
  await page.screenshot({ path: "hello.png" });

  //get all the sub category links
  let productSubCategories = await page.evaluate(() => {
    return [
      ...document.querySelectorAll(".CategoryListings-subItems-item"),
    ].map((item) => item.href);
  });
  //visit each category
  for (let productSubCategory of productSubCategories) {
    await page.goto(productSubCategory, { waitUntil: "load", timeout: 0 });
    //get data
    let { productNames, stocks } = await page.evaluate(() => {
      let productNames = [
        ...document.querySelectorAll(".SearchResults-productName"),
      ].map((name) => name.textContent.trim());
      let stocks = [
        ...document.querySelectorAll(".SearchResults-column--stock"),
      ].map((stock) => stock.textContent.trim().split(" ")[0].trim());
      let manufacturers = [
        ...document.querySelectorAll(".SearchResults-productManufacturer"),
      ].map((manufacturer) => manufacturer.textContent.trim());
    });
    let category = document.querySelector(".u-middle").textContent;
    let VoltageRatings = [
      ...document.querySelectorAll(".SearchResults-feature-monitor-type"),
    ]
      .map((voltage) => voltage.textContent)
      .filter((rating) => rating.match(/V/));
  }
})();
