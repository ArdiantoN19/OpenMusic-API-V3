class CollaborationsHandler {
  constructor(
    collaborationsService,
    usersService,
    playlistsService,
    validator
  ) {
    this._collaborationsService = collaborationsService;
    this._usersService = usersService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(
      playlistId,
      userId
    );

    return h
      .response({
        status: "success",
        data: { collaborationId },
      })
      .code(201);
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return h
      .response({
        status: "success",
        message: "collaborator berhasil dihapus",
      })
      .code(200);
  }
}

module.exports = CollaborationsHandler;
