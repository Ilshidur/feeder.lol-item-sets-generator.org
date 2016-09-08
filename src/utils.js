import fs from 'fs-extra';
import zipFolder from 'zip-folder';
import del from 'delete';
import path from 'path';
import config from './config';

const promisifyNodeClient = c => {
  Object.keys(c.methods).forEach(method => {
    c.methods[method + 'Async'] = (...args) => new Promise((resolve, reject) => {
      c.methods[method](...args, (data, response) => {
        resolve(data);
      });
    });
  });
};

const link = (protocol, api, route) => {
  return protocol + '://' + path.join(api, route);
};

const saveFile = (file, content) => new Promise((resolve, reject) => {
  const outputFolder = path.join(config.rootPath, config.path.sets.outputFolder);
  fs.outputFile(path.join(outputFolder, file), content, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

const zipItems = async () => new Promise((resolve, reject) => {
  const outputFolder = path.join(config.rootPath, config.path.sets.outputFolder);
  zipFolder(path.join(outputFolder, config.path.sets.saveFolderTmp), path.join(outputFolder, config.path.sets.zipFileName), (err) => {
    del.sync(path.join(outputFolder, config.path.sets.saveFolderTmp));
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

export { promisifyNodeClient, link, saveFile, zipItems };
