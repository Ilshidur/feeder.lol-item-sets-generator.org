import mongoose from 'mongoose';
import config from './config';
import { outputErr } from './log';

function connectMongo () {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.mongo.uri, config.mongo.options);
  mongoose.connection.on('error', err => {
    outputErr(`MongoDB connection error : ${err}`);
    process.exit(-1);
  });
}

function disconnectMongo () {
  mongoose.disconnect();
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
