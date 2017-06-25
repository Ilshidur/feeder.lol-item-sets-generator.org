import express from 'express';
import leagueTips from 'league-tooltips';
import config from '../config';

const router = express.Router();

router.use(leagueTips(config.key.riot, 'euw', {
  fileName: 'league-tips.min.js',
  protocol: 'https',
  cors: {
    origin: 'https://lol-item-sets-generator.org',
    methods: 'GET',
    headers: 'Content-Type'
  }
}));

router.get('/', (req, res, next) => {
  res.send('Tooltips.');
});

export default router;
