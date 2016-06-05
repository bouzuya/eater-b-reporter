import * as assert from 'power-assert';
import { test } from 'eater/runner';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

import ReporterType from '../src/index';
import { console as consoleType } from '../src/console';

test('1 of 2 files, 1 of 4 tests failed', resolve => {
  const sandbox = sinon.sandbox.create();
  const log = sandbox.stub();
  const Reporter: typeof ReporterType = proxyquire('../src/index', {
    './console': { console: { log } }
  }).default;

  const fileName1 = '.tmp/test/file1.js';
  const testName11 = 'test1-1';
  const testName12 = 'test1-2';
  const fileName2 = '.tmp/test/file2.js';
  const testName21 = 'test2-1';
  const testName22 = 'test2-2';

  const reporter = new Reporter();

  reporter.reportFileNumber(2);
  const reportFileNumber = log.getCall(log.callCount - 1).args[0];
  assert(reportFileNumber === '2 files');

  reporter.reportTestName(fileName1);

  // reporter.reportSubTestName(..., ...);

  reporter.reportSubSuccess(testName11, fileName1);
  reporter.reportSubFailure(testName12, fileName1);
  reporter.reportFailure(fileName1);

  reporter.reportSubSuccess(testName21, fileName2);
  reporter.reportSubSuccess(testName22, fileName2);
  reporter.reportSuccess(fileName2);
  const reportSuccess = log.getCall(log.callCount - 1).args[0];
  assert(reportSuccess.indexOf('✓ success: ') >= 0);
  assert(reportSuccess.indexOf(fileName2) >= 0);

  reporter.reportFinish(true, {
    [fileName1]: 'test1-2 OUT!!!'
  });
  const reportFinish1 = log.getCall(2).args[0];
  assert(reportFinish1.indexOf('✗ failure: ') >= 0);
  assert(reportFinish1.indexOf(fileName1) >= 0);
  const reportFinish2 = log.getCall(3).args[0];
  assert(reportFinish2.indexOf('test1-2 OUT!!!') >= 0);
  const reportFinishSummary = log.getCall(4).args[0];
  assert(reportFinishSummary.indexOf('1 of 2 files') >= 0);
  assert(reportFinishSummary.indexOf('1 of 4 tests failed') >= 0);

  resolve();
});

test('2 files 4 tests completed', resolve => {
  const sandbox = sinon.sandbox.create();
  const log = sandbox.stub();
  const Reporter: typeof ReporterType = proxyquire('../src/index', {
    './console': { console: { log } }
  }).default;

  const fileName1 = '.tmp/test/file1.js';
  const testName11 = 'test1-1';
  const testName12 = 'test1-2';
  const fileName2 = '.tmp/test/file2.js';
  const testName21 = 'test2-1';
  const testName22 = 'test2-2';

  const reporter = new Reporter();

  reporter.reportFileNumber(2);
  const reportFileNumber = log.getCall(log.callCount - 1).args[0];
  assert(reportFileNumber === '2 files');

  reporter.reportTestName(fileName1);

  // reporter.reportSubTestName(..., ...);

  reporter.reportSubSuccess(testName11, fileName1);
  reporter.reportSubSuccess(testName12, fileName1);
  reporter.reportSuccess(fileName1);
  const reportSuccess1 = log.getCall(log.callCount - 1).args[0];
  assert(reportSuccess1.indexOf('✓ success: ') >= 0);
  assert(reportSuccess1.indexOf(fileName1) >= 0);

  reporter.reportSubSuccess(testName21, fileName2);
  reporter.reportSubSuccess(testName22, fileName2);
  reporter.reportSuccess(fileName2);
  const reportSuccess2 = log.getCall(log.callCount - 1).args[0];
  assert(reportSuccess2.indexOf('✓ success: ') >= 0);
  assert(reportSuccess2.indexOf(fileName2) >= 0);

  reporter.reportFinish(false, {});
  const reportFinishSummary = log.getCall(3).args[0];
  assert(reportFinishSummary.indexOf('2 files') >= 0);
  assert(reportFinishSummary.indexOf('4 tests completed') >= 0);

  resolve();
});
