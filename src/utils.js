import fs from 'fs-extra';
import zipFolder from 'zip-folder';
import del from 'delete';
import path from 'path';
import config from './config';

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
  zipFolder(
    path.join(outputFolder, config.path.sets.saveFolderTmp),
    path.join(outputFolder, config.path.sets.zipFileName),
    (err) => {
      del.sync(path.join(outputFolder, config.path.sets.saveFolderTmp));
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
});

export { saveFile, zipItems };
