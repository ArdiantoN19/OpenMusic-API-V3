const AWS = require("aws-sdk");

class S3StorageService {
  constructor() {
    this._S3 = new AWS.S3({
      endpoint: process.env.ENDPOINT_LOCALSTACK,
    });
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: +new Date() + meta.filename,
      Body: file._data, // buffer
      ContentType: meta.headers["content-type"],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Location);
      });
    });
  }
}

module.exports = S3StorageService;
