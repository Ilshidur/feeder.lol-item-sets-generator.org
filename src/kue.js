import kue from 'kue';

const queue = kue.createQueue({
  prefix: 'feeder.lol-item-sets-generator.org',
  redis: {
    port: 6379,
    host: 'localhost',
    // auth: 'password'
  }
});

export default queue;
