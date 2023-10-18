const { Builder, By, until } = require("selenium-webdriver");

async function login(driver, email, password) {
  const signInEmail = By.id("signInEmail");
  const passwordElement = By.id("password");
  const loginButton = By.xpath(
    "//*[@id='app']/div/div/div/div/div/form/div[3]/div/button"
  );

  try {
    await driver.get("https://www.parkwhiz.com/account/");
    await driver.wait(until.elementLocated(signInEmail), 2000);
    await driver.findElement(signInEmail).sendKeys(email);
    await driver.findElement(passwordElement).sendKeys(password);
    await driver.findElement(loginButton).click();
    await driver.wait(
      until.urlContains("https://www.parkwhiz.com/account/"),
      2000
    );
  } catch (error) {
    console.error("Error during login:", error);
  }
}

async function clickElementWithXPath(driver) {
  const skipThisSelector =
    '//*[@id="site-wrap"]/div[6]/div/div/div[2]/div/div[4]/div/form/div/div[2]/div[3]/a';

  try {
    const element = await driver.wait(
      until.elementLocated(By.xpath(skipThisSelector)),
      5000
    );
    await element.click();

    await driver.sleep(2000);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function searchOrder(driver, orderNumber) {
  try {
    let orderFound = false;
    let maxAttempts = 10;
    let attempts = 0;

    while (!orderFound && attempts < maxAttempts) {
      attempts++;

      const orderDivs = await driver.findElements(
        By.xpath(
          '//*[@id="app"]/div/div[2]/div/div[2]/div/div[2]/div[2]/div/div[1]/div[1]'
        )
      );

      for (let div of orderDivs) {
        try {
          const spanTextElement = await div.findElement(
            By.xpath(".//div[4]/span")
          );

          const spanText = await spanTextElement.getText();

          if (spanText === orderNumber) {
            const receiptLink = await div.findElement(
              By.xpath(
                `.//a[contains(@href, "/ticket/receipt/${orderNumber}?u=")]`
              )
            );
            await receiptLink.click();
            await driver.sleep(2000);

            const extractedData = await openReceipt(driver, orderNumber);

            console.log(`Extracted Data:`, extractedData);
            orderFound = true;

            break;
          }
        } catch (error) {
          console.error("Error during order search:", error);
        }
      }

      if (!orderFound) {
        const nextPageButton = await driver.findElement(
          By.xpath(
            `//*[@id="app"]/div/div[2]/div/div[2]/div/div[2]/div[3]/div/a[4]`
          )
        );
        if (nextPageButton) {
          await nextPageButton.click();
          await driver.wait(until.elementIsVisible(nextPageButton), 5000);
        } else {
          console.error(`Order number ${orderNumber} not found.`);

          break;
        }
      }
    }
    if (!orderFound) {
      console.error(
        `Order number ${orderNumber} not found after ${maxAttempts} attempts.`
      );
    }
  } catch (error) {
    console.error("Error during order search:", error);
  }
}

async function openReceipt(driver, orderNumber) {
  const myReceipt = By.xpath(
    `//a[contains(@href, "/ticket/receipt/${orderNumber}?u=")]`
  );
  try {
    const receiptElement = await driver.wait(
      until.elementLocated(myReceipt),
      10000
    );
    await receiptElement.click();

    const windowHandles = await driver.getAllWindowHandles();

    if (windowHandles.length > 1) {
      await driver.switchTo().window(windowHandles[windowHandles.length - 1]);
    }
  } catch (error) {
    console.error("Error while opening receipt:", error);
  }
}

async function extractParkingPassData(driver) {
  const eventNameSelector =
    '//*[@id="app"]/div/div[4]/div[1]/div[1]/div/div[2]/div[1]/div[2]';
  const venueSelector =
    '//*[@id="app"]/div/div[4]/div[1]/div[1]/div/div[2]/div[1]/div[1]';
  const parkingPassNumberSelector =
    '//*[@id="app"]/div/div[4]/div[1]/div[1]/div/div[2]/div[3]/strong';
  const eventDateSelector =
    '//*[@id="app"]/div/div[4]/div[1]/div[1]/div/div[2]/div[2]/div[1]/div[2]/span[1]';
  const priceSelector =
    '//*[@id="app"]/div/div[4]/div[2]/div[1]/div/div[3]/div[1]/div/div/div[2]';
  // const purchaseDateSelector =
  //   '//*[@id="app"]/div/div[4]/div[2]/div[1]/div/div[2]';
  const purchaseEmailSelector = '//*[@id="app"]/div/div[2]/h3/strong';
  const sectionSelector =
    '//*[@id="app"]/div/div[4]/div[1]/div[1]/div/div[1]/div/div/div/div/div[2]';

  function convertDateToISO(dateString) {
    // Extract month and day from the string
    let [_, month, day] = dateString.match(/(\w+) (\d+)/);
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let newDate = new Date(`${month} ${day}, ${year}`);

    if (newDate < currentDate) {
      year++;
    }

    newDate.setFullYear(year);
    return newDate.toISOString();
  }

  let eventName = await driver
    .findElement(By.xpath(eventNameSelector))
    .getText();
  let venue = await driver.findElement(By.xpath(venueSelector)).getText();
  let parkingPassNumber = await driver
    .findElement(By.xpath(parkingPassNumberSelector))
    .getText();
  let eventDate = await driver
    .findElement(By.xpath(eventDateSelector))
    .getText();
  let formattedEventDate = convertDateToISO(eventDate);

  let rawPrice = await driver.findElement(By.xpath(priceSelector)).getText();
  let cleanedPrice = parseFloat(rawPrice.replace("$", ""));
  let newPrice =
    cleanedPrice % 1 === 0
      ? cleanedPrice.toFixed(0)
      : cleanedPrice.toFixed(2).toString();
  // let purchaseDateFullString = await driver
  //   .findElement(By.xpath(purchaseDateSelector))
  //   .getText();
  // let dateConvert = /(\w+ \d+)/;
  // let dateMatch = purchaseDateFullString.match(dateConvert);

  // if (dateMatch && dateMatch[1]) {
  //   let dateStr = dateMatch[1];
  //   let purchaseDateObj = new Date(dateStr);
  //   formattedPurchaseDate = purchaseDateObj.toISOString();
  // }

  let purchaseEmail = await driver
    .findElement(By.xpath(purchaseEmailSelector))
    .getText();
  let section = await driver.findElement(By.xpath(sectionSelector)).getText();
  section = section.toUpperCase();

  return {
    purchaseEmail: purchaseEmail,
    eventName: eventName,
    venue: venue,
    parkingPassNumber: parkingPassNumber,
    eventDate: formattedEventDate,
    price: newPrice,
    section: section,
    // purchaseDate: formattedPurchaseDate,
  };
}

module.exports = {
  login,
  clickElementWithXPath,
  searchOrder,
  openReceipt,
  extractParkingPassData,
};