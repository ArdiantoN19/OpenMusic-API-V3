const fs = require("fs");
const helpers = require("../../helpers");

class StorageService {
  constructor(directory) {
    this._directory = directory;
    helpers.verifyNewDirectory(directory);
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._directory}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (err) => reject(err));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }
}

module.exports = StorageService;
