import { ChildProcess } from 'child_process';

export type TestName = string; // TestName.js
export type SubTestName = string; // test(SubTestName, (done) => /* ... */);
export type ErrorMessage = string; // stderr output

export interface Reporter {
  reportFileNumber(num: number): void;

  reportTestName(name: TestName): void;

  setChildProc(child: ChildProcess): void;

  reportSubFailure(name: SubTestName, parent: TestName): void;

  reportSubSuccess(name: SubTestName, parent: TestName): void;

  // deprecated.
  // see: https://twitter.com/yosuke_furukawa/status/739004911707258881
  reportSubTestName(name: SubTestName, parent: TestName): void;

  reportFailure(name: TestName): void;

  reportSuccess(name: TestName): void;

  reportFinish(
    hasAnyError: boolean,
    errors: { [testName: string]: ErrorMessage; }
  ): void;
}
