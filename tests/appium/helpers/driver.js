const { remote } = require('webdriverio');
const path = require('path');

const APPIUM_HOST = process.env.APPIUM_HOST || 'localhost';
const APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723');
const APP_PATH = process.env.APP_PATH || path.join(__dirname, '../app/app-debug.apk');

async function createAppiumDriver() {
  const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'TruthGuard_Test',
    'appium:app': path.resolve(APP_PATH),
    'appium:appPackage': 'com.truthcheck',
    'appium:appActivity': 'com.truthcheck.MainActivity',
    'appium:noReset': false,
    'appium:newCommandTimeout': 60,
    'appium:autoGrantPermissions': true,
  };
  const driver = await remote({
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    capabilities,
    logLevel: 'error',
  });
  return driver;
}

async function findByText(driver, text, timeout = 10000) {
  return await driver.$(`android=new UiSelector().text("${text}")`);
}

async function findById(driver, id, timeout = 10000) {
  return await driver.$(`~${id}`);
}

async function findByClass(driver, className) {
  return await driver.$(`android=new UiSelector().className("${className}")`);
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function isDisplayed(element) {
  try { return await element.isDisplayed(); } catch { return false; }
}

async function tapElement(driver, selector) {
  const el = await driver.$(selector);
  await el.click();
}

async function typeText(driver, selector, text) {
  const el = await driver.$(selector);
  await el.clearValue();
  await el.setValue(text);
}

async function scrollDown(driver) {
  await driver.execute('mobile: scroll', { direction: 'down' });
}

module.exports = {
  createAppiumDriver, findByText, findById, findByClass,
  sleep, isDisplayed, tapElement, typeText, scrollDown
};
