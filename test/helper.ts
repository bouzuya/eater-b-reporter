import * as assert from 'power-assert';
import { test as testOriginal } from 'eater/runner';

const test = (message: string, callback: <T>() => T | Promise<T>): void => {
  testOriginal(message, (resolve, reject): void => {
    Promise.resolve().then(callback).then(resolve, reject);
  });
};

export { test, assert };
