class UploadsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postAlbumCoverByAlbumId(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    await this._albumsService.getDetailAlbumsById(id);

    this._validator.validateUploadImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.editCoverAlbums(id, fileLocation);
    return h
      .response({
        status: "success",
        message: "Sampul berhasil di unggah",
      })
      .code(201);
  }
}

module.exports = UploadsHandler;
