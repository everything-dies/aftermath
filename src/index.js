import { useRef, useState, useCallback } from 'react';

import * as reducers from './reducers';

export const useAftermath = (callback, options) => {
  const reference = useRef();
  const getCurrent = useCallback(() => reference.current, [reference]);
  const setCurrent = useCallback(
    value => Object.assign(reference, { current: value }),
    [reference]
  );
  const [status, setStatus] = useState({ loading: false });
  const tracked = useCallback(
    (...params) => {
      const timestamp = window.performance.now();
      const output = callback(...params);
      const asynchronous = output instanceof Promise;
      const chain = promise => {
        const proxy = goal => (...args) =>
          timestamp === getCurrent() && goal(...args);
        const succeed = response => {
          setStatus(reducers.succeed({ response }));

          return Promise.resolve(response);
        };
        const fail = error => {
          const retry = () => tracked(...params);

          setStatus(reducers.fail({ error, retry }));

          return Promise.reject(error);
        };

        return promise.then(proxy(succeed)).catch(proxy(fail));
      };

      setCurrent(timestamp);
      setStatus(reducers.start({ loading: asynchronous }));

      return !asynchronous ? output : chain(output);
    },
    [callback]
  );

  return [tracked, status];
};
