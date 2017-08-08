import Lynx from 'lynx';
import config from './config';

const metrics = new Lynx(config.statsd.host, config.statsd.port);

let generationDurationTimer = null;

function registerGeneration() {
  if (config.statsd.enabled) {
    metrics.increment('lol-item-sets-generator.builds_generation.count');
  }
}

function setChampionsCount(championsCount) {
  if (config.statsd.enabled) {
    metrics.set('lol-item-sets-generator.generation.champions', championsCount);
  }
}

function setItemsCount(itemsCount) {
  if (config.statsd.enabled) {
    metrics.set('lol-item-sets-generator.generation.items', itemsCount);
  }
}

function setBuildsCount(buildsCount) {
  if (config.statsd.enabled) {
    metrics.set('lol-item-sets-generator.generation.items', buildsCount);
  }
}

function startGenerationTimer() {
  if (config.statsd.enabled) {
    generationDurationTimer = metrics.createTimer('lol-item-sets-generator.generation.duration');
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
