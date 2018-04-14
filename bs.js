// To run this script use this command
// node bs.js yourBSUserName yourBSKey

const webdriver = require('selenium-webdriver');
const test = require('./bs_test.js');

// Input capabilities
const iPhone = {
  'browserName': 'iPhone',
  'device': 'iPhone 7',
  'realMobile': 'true',
  'os_version': '10.3',
  'browserstack.user': process.argv[2],
  'browserstack.key': process.argv[3]
};

const android = {
  'browserName': 'android',
  'device': 'Samsung Galaxy S8',
  'realMobile': 'true',
  'os_version': '7.0',
  'browserstack.user': process.argv[2],
  'browserstack.key': process.argv[3]
};

const desktopFF = {
  'browserName': 'Firefox',
  'browser_version': '59.0',
  'os': 'Windows',
  'os_version': '10',
  'resolution': '1024x768',
  'browserstack.user': process.argv[2],
  'browserstack.key': process.argv[3]
};

const desktopEdge = {
  'browserName': 'Edge',
  'browser_version': '16.0',
  'os': 'Windows',
  'os_version': '10',
  'resolution': '1024x768',
  'browserstack.user': process.argv[2],
  'browserstack.key': process.argv[3]
};

const desktopIE = {
  'browserName': 'IE',
  'browser_version': '11.0',
  'os': 'Windows',
  'os_version': '10',
  'resolution': '1024x768',
  'browserstack.user': process.argv[2],
  'browserstack.key': process.argv[3]
};

const iPhoneDriver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(iPhone)
  .build();

const androidDriver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(android)
  .build();

const desktopFFDriver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(desktopFF)
  .build();

const desktopEdgeDriver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(desktopEdge)
  .build();

const desktopIEDriver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(desktopIE)
  .build();

test.runTest(iPhoneDriver);
test.runTest(androidDriver);
test.runTest(desktopFFDriver);
test.runTest(desktopEdgeDriver);
test.runTest(desktopIEDriver);
