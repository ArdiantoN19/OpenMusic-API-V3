const InvariantError = require("../../exceptions/InvariantError");
const { AlbumPayloadSchema } = require("./schema");

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const { error, value } = AlbumPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
    return value;
  },
};

module.exports = AlbumsValidator;
