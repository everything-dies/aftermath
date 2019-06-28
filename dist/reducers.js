"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fail = exports.succeed = exports.start = void 0;

const getTime = () => ({
  timestamp: window.performance.now(),
  date: new Date()
});

const conclude = state => ({ ...state,
  end: getTime(),
  loading: false
});

const start = ({
  loading = true
}) => () => ({
  begin: getTime(),
  loading
});

exports.start = start;

const succeed = ({
  response
}) => state => conclude({ ...state,
  response
});

exports.succeed = succeed;

const fail = ({
  error,
  retry
}) => state => conclude({ ...state,
  error,
  retry
});

exports.fail = fail;