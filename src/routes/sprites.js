var router = require('express').Router();

router.get('/', function (req, res, next) {
  res.send('What the hell are you doing here ?');
});

module.exports = router;
