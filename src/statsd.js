import Lynx from 'lynx';
import config from './config';

const metrics = new Lynx(config.statsd.host, config.statsd.port, {
  scope: 'lol-item-sets-genrator',
});

let generationDurationTimer = null;

function registerGeneration() {
  if (config.statsd.enabled) {
    metrics.increment('generations_count');
  }
}

function setChampionsCount(championsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_champions', championsCount);
  }
}

function setItemsCount(itemsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_items', itemsCount);
  }
}

function setBuildsCount(buildsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_items', buildsCount);
  }
}

function startGenerationTimer() {
  if (config.statsd.enabled) {
    generationDurationTimer = metrics.createTimer('generation_duration');
  }
}

function stopGenerationTimer() {
  if (config.statsd.enabled && generationDurationTimer) {
    generationDurationTimer.stop();
    generationDurationTimer = null;
  }
}

// TODO: Call 'close' :
// https://github.com/dscape/lynx/blob/master/lib/lynx.js#L482

export {
  registerGeneration,
  setChampionsCount,
  setItemsCount,
  setBuildsCount,
  startGenerationTimer,
  stopGenerationTimer,
};
