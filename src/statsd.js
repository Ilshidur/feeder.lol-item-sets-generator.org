import Lynx from 'lynx';
import config from './config';

const metrics = new Lynx(config.statsd.host, config.statsd.port, {
  scope: config.statsd.scope,
  on_error: (err) => {
    console.error(err.message);
  },
});

let generationDurationTimer = null;

function registerGeneration() {
  if (config.statsd.enabled) {
    metrics.increment('generations_count');
    console.log('Incremented generations_count to statsd.');
  }
}

function setRiotChampionsCount(championsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_riot_champions', championsCount);
    console.log(`Sent generation_riot_champions to statsd ${championsCount}.`);
  }
}

function setRiotItemsCount(itemsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_riot_items', itemsCount);
    console.log(`Sent generation_riot_items to statsd ${itemsCount}.`);
  }
}

function setGeneratedBuildsCount(buildsCount) {
  if (config.statsd.enabled) {
    metrics.count('generation_generated_builds', buildsCount);
    console.log(`Sent generation_generated_builds to statsd ${buildsCount}.`);
  }
}

function startGenerationTimer() {
  if (config.statsd.enabled) {
    generationDurationTimer = metrics.createTimer('generation_duration');
    console.log('Started generation_duration statsd timer.');
  }
}

function stopGenerationTimer() {
  if (config.statsd.enabled && generationDurationTimer) {
    generationDurationTimer.stop();
    generationDurationTimer = null;
    console.log('Stopped generation_duration statsd timer.');
  }
}

function close() {
  metrics.close();
}

export {
  registerGeneration,
  setRiotChampionsCount,
  setRiotItemsCount,
  setGeneratedBuildsCount,
  startGenerationTimer,
  stopGenerationTimer,
  close,
};
