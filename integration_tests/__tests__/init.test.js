/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { run } = require('../utils');
const { runHaul } = require('../runHaul');

const TEST_PROJECT_DIR = path.resolve(
  __dirname,
  '../../fixtures/react-native-clean'
);
const CONFIG_FILE_PATH = path.resolve(TEST_PROJECT_DIR, 'haul.config.js');
const GRADLE_PATH = path.resolve(TEST_PROJECT_DIR, 'android/app/build.gradle');
const ENTER_KEY = '\x0d';

beforeAll(() => run('yarn --mutex network', TEST_PROJECT_DIR));
afterEach(() => rimraf.sync(CONFIG_FILE_PATH));
beforeEach(() => rimraf.sync(CONFIG_FILE_PATH));
afterAll(() => run(`git checkout ${GRADLE_PATH}`));

test('init command on react-native project', done => {
  const haul = runHaul(TEST_PROJECT_DIR, ['init']);

  haul.stdout.on('data', () => {
    haul.stdin.write(ENTER_KEY);
  });

  haul.stdout.on('close', () => {
    try {
      const haulConfig = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      expect(haulConfig).toMatchSnapshot();
      done();
    } catch (error) {
      done.fail(error);
    }
  });
});
