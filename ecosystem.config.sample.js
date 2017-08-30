module.exports = {

  apps: [

    {
      name: 'feeder.lol-item-sets-generator.org-app',
      script: 'dist/app.js',
      env: {
        KEY_RIOT: 'API_KEY',
      },
      env_development: {
        NODE_ENV: 'development',
        HOST: 'http://domain.tld',
        PORT: 9000,
      },
      env_production: {
        NODE_ENV: 'production',
        HOST: 'http://domain.tld',
        PORT: 9000,
        STATSD_HOST: 'localhost',
        STATSD_PORT: 8125,
        STATSD_SCOPE: 'lol-item-sets-generator',
        REDIS_PORT: 6379,
        REDIS_HOST: 'localhost',
        REDIS_TOOLTIPS_PREFIX: 'feeder.lol-item-sets-generator.org_',
      },
      args: ['--release'],
      watch: false,
      append_env_to_name: true,
    },
    {
      name: 'feeder.lol-item-sets-generator.org-worker',
      script: 'dist/worker.js',
      env: {
        CRON_GENERATOR: '0 */2 * * *', // Every 2 hours
        KEY_CHAMPIONGG: 'API_KEY',
        KEY_RIOT: 'API_KEY',
        REDIS_PORT: 6379,
        REDIS_HOST: 'localhost',
        REDIS_TOOLTIPS_PREFIX: 'feeder.lol-item-sets-generator.org-tooltips_',
        GENERATE_SPRITES: true,
      },
      env_development: {
        NODE_ENV: 'development',
        MONGO_URI: 'mongodb://localhost:27017/lol-item-sets-generator-org',
      },
      env_production: {
        NODE_ENV: 'production',
        MONGO_URI: 'mongodb://localhost:27017/lol-item-sets-generator-org',
        STATSD_HOST: 'localhost',
        STATSD_PORT: 8125,
        STATSD_SCOPE: 'lol-item-sets-generator',
      },
      args: ['--release'],
      watch: false,
      append_env_to_name: true,
    },

  ],

};
