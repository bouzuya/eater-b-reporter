import { ChildProcess } from 'child_process';
import { red, green } from 'colo';
import * as setBlocking from 'set-blocking';
import { Reporter, TestName, SubTestName, ErrorMessage } from './reporter';
import { console } from './console';

class BReporter implements Reporter {
  // file = test (test.js)
  // test = sub test (test('sub-test', done => /* ... */))
  private totalFileNum: number;
  private failedFileNum: number;
  private succeedFileNum: number;
  private totalTestNum: number;
  private failedTestNum: number;
  private succeedTestNum: number;

  constructor() {
    // FIXME: workaround for https://github.com/nodejs/node/pull/6773
    setBlocking(true);

    this.totalFileNum = 0;
    this.failedFileNum = 0;
    this.succeedFileNum = 0;
    this.totalTestNum = 0;
    this.failedTestNum = 0;
    this.succeedTestNum = 0;
  }

  reportFileNumber(totalFileNum: number): void {
    // NOTE: this.totalFileNum = totalFileNum;
    console.log(`${totalFileNum} files`);
  }

  reportTestName(_: TestName): void {
    // do nothing
  }

  setChildProc(childProcess: ChildProcess): void {
    childProcess.stdout.pipe(process.stdout);
    // ignore child process's stderr
  }

  reportSubFailure(_testName: SubTestName, _fileName: TestName): void {
    this.totalTestNum += 1;
    this.failedTestNum += 1;
  }

  reportSubSuccess(_testName: SubTestName, _fileName: TestName): void {
    this.totalTestNum += 1;
    this.succeedTestNum += 1;
  }

  reportSubTestName(_testName: SubTestName, _fileName: TestName): void {
    // deprecated.
    // see: https://twitter.com/yosuke_furukawa/status/739004911707258881
  }

  reportFailure(_: TestName): void {
    this.totalFileNum += 1;
    this.failedFileNum += 1;
  }

  reportSuccess(fileName: TestName) {
    this.totalFileNum += 1;
    this.succeedFileNum += 1;

    console.log(`${green('✓ success: ')}${fileName}`);
  }

  reportFinish(
    hasError: boolean,
    errors: { [fileName: string]: ErrorMessage; }
  ): void {
    Object
      .keys(errors)
      .map(fileName => [fileName, errors[fileName]])
      .forEach(([fileName, errorMessage], index) => {
        console.log(`${red('✗ failure: ')}${fileName}`);
        console.log(errorMessage);
      });

    // assert this.totalFileNum === [totalFileNum in reportFileNumber];
    const totalFileNum = this.totalFileNum;
    // assert this.failedFileNum === Object.keys(errors).length;
    const failedFileNum = this.failedFileNum;
    // assert this.succeedFileNum === totalFileNum - failedFileNum;
    // const succeedFileNum = this.succeedFileNum; // unused
    const totalTestNum = this.totalTestNum;
    const failedTestNum = this.failedTestNum;
    // const succeedTestNum = this.succeedTestNum; // unused
    const summary = hasError
      ? red(
        `✗ ${failedFileNum} of ${totalFileNum} files` +
        `, ${failedTestNum} of ${totalTestNum} tests failed`
      )
      : green(`✓ ${totalFileNum} files ${totalTestNum} tests completed`);
    console.log(summary);
  }
}

export default BReporter;
