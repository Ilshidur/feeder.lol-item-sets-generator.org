import express from 'express';
// import leagueTips from 'league-tooltips';
import config from '../config';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Tooltips. In development.');
});

// router.use(leagueTips(config.key.riot, '/', { fileName: 'league-tips.min.js' }));

export default router;
