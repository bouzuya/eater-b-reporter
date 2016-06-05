import * as assert from 'power-assert';
import { test as testOriginal } from 'eater/runner';

const test = <T, U>(
  message: string,
  callback: (context?: T) => U | Promise<U>,
  options?: {
    before: () => T | Promise<T>;
    after: (context?: T, result?: U) => void | Promise<void>;
  }
): void => {
  const before = options ? options.before : (): T => void 0;
  const after = options ? options.after : (): void => void 0;
  testOriginal(message, (resolve, reject): void => {
    Promise
      .resolve()
      .then(before)
      .then(context => {
        return Promise
          .resolve(context)
          .then(callback)
          .then(result => {
            return Promise
              .resolve()
              .then(() => after(context, result)); // through after error
          }, error => {
            return Promise
              .resolve()
              .then(() => after(context, void 0))
              .then(() => Promise.reject(error)); // through after error
          });
      })
      .then(resolve, reject);
  });
};

export { test, assert };
