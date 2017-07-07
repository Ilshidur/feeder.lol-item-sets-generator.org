import express from 'express';
import leagueTips from 'league-tooltips';
import config from '../config';

const router = express.Router();

router.use(leagueTips(config.key.riot, leagueTips.REGIONS.EUROPE_WEST, {
  fileName: 'league-tips.min.js',
  cors: {
    origin: 'https://lol-item-sets-generator.org',
    methods: 'GET',
    headers: 'Content-Type'
  },
  cache: {
    TTL: 60 * 60 * 48, // 48 hours
    redis: {
      host: 'localhost',
      port: 6379,
      prefix: 'league-tooltips-demo_'
    }
  }
}));

router.get('/', (req, res, next) => {
  res.send('Tooltips.');
});

export default router;
