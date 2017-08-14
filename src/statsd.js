import Lynx from 'lynx';
import dgram from 'dgram';
import config from './config';

const client = new Lynx(config.statsd.host, config.statsd.port, {
  socket: dgram.createSocket('udp4'),
  scope: config.statsd.scope,
  on_error: (err) => {
    console.error(err.message);
  },
});

let generationDurationTimer = null;

function registerGeneration() {
  if (config.statsd.enabled) {
    client.increment('generations_count', 1);
    console.log('Incremented generations_count to statsd.');
  }
}

function setRiotChampionsCount(championsCount) {
  if (config.statsd.enabled) {
    client.gauge('generation_riot_champions', championsCount, 1);
    console.log(`Sent generation_riot_champions to statsd ${championsCount}.`);
  }
}

function setRiotItemsCount(itemsCount) {
  if (config.statsd.enabled) {
    client.gauge('generation_riot_items', itemsCount, 1);
    console.log(`Sent generation_riot_items to statsd ${itemsCount}.`);
  }
}

function setGeneratedBuildsCount(buildsCount) {
  if (config.statsd.enabled) {
    client.gauge('generation_generated_builds', buildsCount, 1);
    console.log(`Sent generation_generated_builds to statsd ${buildsCount}.`);
  }
}

function startGenerationTimer() {
  if (config.statsd.enabled) {
    generationDurationTimer = client.createTimer('generation_duration', 1);
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
  client.close();
}

export {
  client,
  registerGeneration,
  setRiotChampionsCount,
  setRiotItemsCount,
  setGeneratedBuildsCount,
  startGenerationTimer,
  stopGenerationTimer,
  close,
};
