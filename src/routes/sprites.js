import express from 'express';

const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('What the hell are you doing here ?');
});

/*var Generator = require('league-sprites');
var spritesGenerator = new Generator({
  dataType: 'ChampionIcons',
  apiKey: 'API_KEY',
  region: 'euw',
  patch: undefined, // optional
  stylesheetFormat: 'css',
  downloadFolder: 'img/',
  spritePath: 'sprites/sprite.png',
  stylesheetPath: 'sprites/sprite.css',
  finalSpritesheetFolder: 'sprites/compressed/'
});

spritesGenerator.generate()
  .then(function () {
    console.log('Done !');
  })
  .catch(function (e) {
    console.error(e);
  });*/

export default router;
