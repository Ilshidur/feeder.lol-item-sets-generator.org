import path from 'path';

export default {
  port: process.env.PORT || 3000,

  rootPath: path.normalize('../../'),

  key: {
    riot: process.env.KEY_RIOT || 'NO_KEY',
    championgg: process.env.KEY_CHAMPIONGG || 'NO_KEY',
  }
};
