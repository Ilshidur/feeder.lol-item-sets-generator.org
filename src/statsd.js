import Lynx from 'lynx';
import config from './config';

const metrics = new Lynx(config.statsd.host, config.statsd.port);

let generationDurationTimer = null;

function registerGeneration() {
  metrics.increment('lol-item-sets-generator.builds_generation.count');
}

function setChampionsCount(championsCount) {
  metrics.set('lol-item-sets-generator.generation.champions', championsCount);
}

function setItemsCount(championsCount) {
  metrics.set('lol-item-sets-generator.generation.items', championsCount);
}

function startGenerationTimer() {
  generationDurationTimer = metrics.createTimer('lol-item-sets-generator.generation.duration');
}

function stopGenerationTimer() {
  if (generationDurationTimer) {
    generationDurationTimer.stop();
    generationDurationTimer = null;
  }
}

export {
  registerGeneration,
  setChampionsCount,
  setItemsCount,
  startGenerationTimer,
  stopGenerationTimer,
};
