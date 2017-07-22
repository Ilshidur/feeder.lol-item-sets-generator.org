import kue from 'kue';
import config from './config';

const queue = kue.createQueue({
  disableSearch: true,
  prefix: 'feeder.lol-item-sets-generator.org',
  redis: {
    port: config.redis.port,
    host: config.redis.host,
    // auth: 'password'
  },
});

export default queue;
