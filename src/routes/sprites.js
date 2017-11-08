import express from 'express';
import path from 'path';
import config from '../config';
import { outputErr } from '../log';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('What the hell are you doing here ?');
});

router.get('/sprite.css', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile(path.join(
    config.rootPath,
    config.path.sprites.outputFolder,
    config.path.sprites.spritesheetFolder,
    config.path.sprites.stylesheetName.champions,
  ), options, (err) => {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

router.get('/sprite.png', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile(path.join(
    config.rootPath,
    config.path.sprites.outputFolder,
    config.path.sprites.spritesheetFolder,
    config.path.sprites.spritesheetName.champions,
  ), options, (err) => {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

router.get('/champions.png', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile(path.join(
    config.rootPath,
    config.path.sprites.outputFolder,
    config.path.sprites.spritesheetFolder,
    config.path.sprites.spritesheetName.champions,
  ), options, (err) => {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

router.get('/items.css', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile(path.join(
    config.rootPath,
    config.path.sprites.outputFolder,
    config.path.sprites.spritesheetFolder,
    config.path.sprites.stylesheetName.items,
  ), options, (err) => {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});
router.get('/items.png', (req, res) => {
  const options = {
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile(path.join(
    config.rootPath,
    config.path.sprites.outputFolder,
    config.path.sprites.spritesheetFolder,
    config.path.sprites.spritesheetName.items,
  ), options, (err) => {
    if (err) {
      outputErr(err);
      res.status(err.status).end();
    }
  });
});

export default router;
