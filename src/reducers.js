const getTime = () => ({
  timestamp: window.performance.now(),
  date: new Date(),
});

const conclude = state => ({ ...state, end: getTime(), loading: false });

export const start = ({ loading = true }) => () => ({
  begin: getTime(),
  loading,
});

export const succeed = ({ response }) => state =>
  conclude({ ...state, response });

export const fail = ({ error, retry }) => state =>
  conclude({ ...state, error, retry });
