class ExportPlaylistsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async postExportPlaylistsByIdHandler(request, h) {
    this._validator.validateExportPlaylistsPayload(request.payload);
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;

    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._playlistsService.getDetailPlaylistById(
      playlistId,
      credentialId
    );

    const message = JSON.stringify({
      userId: credentialId,
      playlistId,
      targetEmail,
    });

    await this._producerService.sendMessage(`export:playlist`, message);

    return h
      .response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
      })
      .code(201);
  }
}

module.exports = ExportPlaylistsHandler;
