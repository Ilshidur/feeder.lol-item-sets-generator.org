import config from './config';

const PROD = config.env === 'production';

// Not using 'import' because of a Babel bug that
// outputs errored ES5 code.
const { Kayn, REGIONS } = require('kayn');

const api = Kayn(config.key.riot)({
  region: REGIONS.EUROPE_WEST,
  locale: 'en_US',
  debugOptions: {
    isEnabled: !PROD,
    showKey: !PROD,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
  },
});

export default api;
