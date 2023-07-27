const InvariantError = require("../../exceptions/InvariantError");
const { SongPayloadSchema } = require("./schema");

const SongsValidator = {
  validateSongPayload: (payload) => {
    const { error, value } = SongPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
    return value;
  },
};

module.exports = SongsValidator;
