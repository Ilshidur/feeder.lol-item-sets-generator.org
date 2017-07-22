import mongoose from 'mongoose';
import config from './config';
import { outputErr } from './log';

mongoose.Promise = global.Promise;

async function connectMongo () {
  await mongoose.connect(config.mongo.uri, config.mongo.options);
}

async function disconnectMongo () {
  await mongoose.disconnect();
}

function findAndUpdateMongoDocument (doc, query, newData) {
  return new Promise((resolve, reject) => {
    doc.findOneAndUpdate(query, newData, { upsert: true }, (err, doc) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });
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

export { connectMongo, disconnectMongo, findAndUpdateMongoDocument, saveMongoDocument };
