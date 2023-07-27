const InvariantError = require("../../exceptions/InvariantError");
const { UploadImageHeaderSchema } = require("./schema");

const UploadsValidator = {
  validateUploadImageHeaders: (payload) => {
    const { error } = UploadImageHeaderSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = UploadsValidator;
