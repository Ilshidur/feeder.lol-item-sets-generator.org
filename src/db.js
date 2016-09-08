import mongoose from 'mongoose';
import config from './config';
import { outputErr } from './log';

function connectMongo () {
  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', err => {
    outputErr(`MongoDB connection error : ${err}`);
    process.exit(-1);
  });
}

function disconnectMongo () {
  mongoose.disconnect();
}

function saveMongoDocument (doc) {
  return new Promise((resolve, reject) => {
    doc.save(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export { connectMongo, disconnectMongo, saveMongoDocument };
