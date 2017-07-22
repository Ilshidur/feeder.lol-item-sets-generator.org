import config from './config';

const PROD = config.env === 'production';

// Not using 'import' because of a Babel bug that
// outputs errored ES5 code.
const KindredApi = require('kindred-api');

const api = new KindredApi.Kindred({
  key: config.key.riot,
  defaultRegion: KindredApi.REGIONS.NORTH_AMERICA,
  debug: !PROD,
  showKey: true,
  showHeaders: false,
  limits: PROD ? KindredApi.LIMITS.PROD : KindredApi.LIMITS.DEV,
  spread: false,
  retryOptions: {
    auto: true,
    numberOfRetriesBeforeBreak: 3
  },
  timeout: 5000
});

export default api;
