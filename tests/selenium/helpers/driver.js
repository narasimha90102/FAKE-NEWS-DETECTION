const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const HEADLESS = process.env.HEADLESS === 'true';

async function createDriver() {
  const options = new chrome.Options();
  if (HEADLESS) {
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1280,720');
  }
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });
  return driver;
}

async function navigateTo(driver, path = '') {
  await driver.get(`${BASE_URL}${path}`);
}

async function findElement(driver, selector, timeout = 5000) {
  return await driver.wait(until.elementLocated(By.css(selector)), timeout);
}

async function findById(driver, id, timeout = 5000) {
  return await driver.wait(until.elementLocated(By.id(id)), timeout);
}

async function typeIn(driver, selector, text) {
  const el = await findElement(driver, selector);
  await el.clear();
  await el.sendKeys(text);
}

async function clickOn(driver, selector) {
  const el = await findElement(driver, selector);
  await driver.executeScript('arguments[0].scrollIntoView(true)', el);
  await el.click();
}

async function waitForText(driver, selector, text, timeout = 5000) {
  const el = await findElement(driver, selector, timeout);
  await driver.wait(until.elementTextContains(el, text), timeout);
  return el;
}

async function getTitle(driver) {
  return await driver.getTitle();
}

async function isVisible(driver, selector) {
  try {
    const el = await driver.findElement(By.css(selector));
    return await el.isDisplayed();
  } catch { return false; }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

module.exports = {
  createDriver, navigateTo, findElement, findById,
  typeIn, clickOn, waitForText, getTitle, isVisible,
  sleep, By, until, Key, BASE_URL
};
