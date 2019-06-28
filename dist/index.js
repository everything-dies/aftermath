"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAftermath = void 0;

var _react = require("react");

var reducers = _interopRequireWildcard(require("./reducers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const useAftermath = (callback, options) => {
  const reference = (0, _react.useRef)();
  const getCurrent = (0, _react.useCallback)(() => reference.current, [reference]);
  const setCurrent = (0, _react.useCallback)(value => Object.assign(reference, {
    current: value
  }), [reference]);
  const [status, setStatus] = (0, _react.useState)({
    loading: false
  });
  const tracked = (0, _react.useCallback)((...params) => {
    const timestamp = window.performance.now();
    const output = callback(...params);
    const asynchronous = output instanceof Promise;

    const chain = promise => {
      const proxy = goal => (...args) => timestamp === getCurrent() && goal(...args);

      const succeed = response => {
        setStatus(reducers.succeed({
          response
        }));
        return Promise.resolve(response);
      };

      const fail = error => {
        const retry = () => tracked(...params);

        setStatus(reducers.fail({
          error,
          retry
        }));
        return Promise.reject(error);
      };

      return promise.then(proxy(succeed)).catch(proxy(fail));
    };

    setCurrent(timestamp);
    setStatus(reducers.start({
      loading: asynchronous
    }));
    return !asynchronous ? output : chain(output);
  }, [callback]);
  return [tracked, status];
};

exports.useAftermath = useAftermath;