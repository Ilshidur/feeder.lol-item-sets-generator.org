import Lynx from 'lynx';
import config from './config';

const metrics = new Lynx(config.statsd.host, config.statsd.port, {
  scope: 'lol-item-sets-genrator',
});

let generationDurationTimer = null;

function registerGeneration() {
  if (config.statsd.enabled) {
    metrics.increment('builds_generation.count');
  }
}

function setChampionsCount(championsCount) {
  if (config.statsd.enabled) {
    metrics.set('generation.champions', championsCount);
  }
}

function setItemsCount(itemsCount) {
  if (config.statsd.enabled) {
    metrics.set('generation.items', itemsCount);
  }
}

function setBuildsCount(buildsCount) {
  if (config.statsd.enabled) {
    metrics.set('generation.items', buildsCount);
  }
}

function startGenerationTimer() {
  if (config.statsd.enabled) {
    generationDurationTimer = metrics.createTimer('generation.duration');
  }
}

function stopGenerationTimer() {
  if (config.statsd.enabled && generationDurationTimer) {
    generationDurationTimer.stop();
    generationDurationTimer = null;
  }
}

export {
  registerGeneration,
  setChampionsCount,
  setItemsCount,
  setBuildsCount,
  startGenerationTimer,
  stopGenerationTimer,
};
