class UsersHandler {
  constructor(service, validator) {
    this._usersService = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this._usersService.addUser({
      username,
      password,
      fullname,
    });
    return h
      .response({
        status: "success",
        data: { userId },
      })
      .code(201);
  }
}

module.exports = UsersHandler;
