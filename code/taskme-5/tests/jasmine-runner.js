/* Copyright IBM Corp. 2017  All Rights Reserved.                    */

const path = require('path');
const Jasmine = require('jasmine');
const reporters = require('jasmine-reporters');
const app = require('../src/server/server');

const junitReporter = new reporters.JUnitXmlReporter({
  savePath: path.resolve(__dirname, 'reports/unit/'),
  consolidateAll: false,
});

const jrunner = new Jasmine();
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
jrunner.configureDefaultReporter({
  showColors: true,
});
jrunner.addReporter(junitReporter);
jrunner.loadConfig({
  spec_dir: './tests',
  spec_files: ['*.spec.js'],
  stopSpecOnExpectationFailure: false,
  random: false,
});

app.on('booted', () => {
  jrunner.execute();
});
