const InvariantError = require("../../exceptions/InvariantError");
const { UsersPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const { error } = UsersPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

module.exports = UsersValidator;
