const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSongsPayloadSchema } = require("./schema");

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongsPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = PlaylistSongsValidator;
