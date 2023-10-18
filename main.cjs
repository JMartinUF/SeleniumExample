// const { postToAirtable } = require("./airtableAPI.cjs");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const {
  login,
  clickElementWithXPath,
  searchOrder,
  openReceipt,
  extractParkingPassData,
} = require("./parkWhiz.cjs");


const { postToSkyBox } = require("./skyboxAPI.cjs");

async function main(email, password, orderNumber) {
  let response = {
    status: "error",
    message: "",
    data: null,
  };

  if (!email || !password || !orderNumber) {
    response.message = "Email, password, and order number are required.";
    console.error(response.message);
    return response;
  }

  let chromeOptions = new chrome.Options();
  chromeOptions.addArguments("--headless");
  chromeOptions.addArguments("--disable-gpu");
  chromeOptions.addArguments("--window-size=1920,1080");

  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer("http://localhost:4444")
    .setChromeOptions(chromeOptions)
    .build();

  try {
    await login(driver, email, password);
    await clickElementWithXPath(driver);
    await searchOrder(driver, orderNumber);
    await openReceipt(driver, orderNumber);

    let extractedData = await extractParkingPassData(driver);

    console.log(extractedData);
    await postToSkyBox(extractedData);
    await postToAirtable(extractedData);


    response.status = "success";
    response.message = "Data extracted and posted successfully.";
    response.data = extractedData;
  } catch (error) {
    console.error("Main Error:", error);
    response.message = "An error occurred during the process.";
  } finally {
    await driver.quit();
  }
  return response;
}

module.exports = {
  main,
};