class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);
    return h
      .response({
        status: "success",
        data: { songId },
      })
      .code(201);
  }

  async getSongsHandler(request, h) {
    const songs = await this._service.getSongs(request.query);
    return h
      .response({
        status: "success",
        data: { songs },
      })
      .code(200);
  }

  async getDetailSongByIdHandler(request, h) {
    const { id } = request.params;
    const song = await this._service.getDetailSongById(id);
    return h
      .response({
        status: "success",
        data: { song },
      })
      .code(200);
  }

  async putSongByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateSongPayload(request.payload);

    await this._service.updateSongById(id, request.payload);
    return h
      .response({
        status: "success",
        message: "Berhasil mengubah song",
      })
      .code(200);
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteSongById(id);
    return h
      .response({
        status: "success",
        message: "Berhasil menghapus song",
      })
      .code(200);
  }
}

module.exports = SongsHandler;
