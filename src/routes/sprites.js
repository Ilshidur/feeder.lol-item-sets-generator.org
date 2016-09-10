import express from 'express';
import path from 'path';
import config from '../config';
import { outputErr } from '../log';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('What the hell are you doing here ?');
});

router.get('/sprite.css', (req, res, next) => {
  var options = {
    // root: path.join(config.path.sprites.outputFolder, config.path.sprites.spritesheetFolder),
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  console.log(path.join(config.path.rootPath, config.path.sprites.outputFolder, config.path.sprites.spritesheetFolder, config.path.sprites.stylesheetName));
  res.sendFile(path.join(config.path.rootPath, config.path.sprites.outputFolder, config.path.sprites.spritesheetFolder, config.path.sprites.stylesheetName), options, function (err) {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

router.get('/sprite.png', (req, res, next) => {
  var options = {
    // root: path.join(config.path.sprites.outputFolder, config.path.sprites.spritesheetFolder),
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile(path.join(config.path.sprites.outputFolder, config.path.sprites.spritesheetFolder, config.path.sprites.spritesheetName), options, function (err) {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

export default router;
