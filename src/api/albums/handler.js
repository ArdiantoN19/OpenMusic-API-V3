class AlbumsHandler {
  constructor(albumsService, songsService, userAlbumLikesService, validator) {
    this._albumsService = albumsService;
    this._songsService = songsService;
    this._userAlbumLikesService = userAlbumLikesService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const albumId = await this._albumsService.addAlbum(request.payload);
    return h.response({ status: "success", data: { albumId } }).code(201);
  }

  async getDetailAlbumByIdHandler(request, h) {
    const { id } = request.params;

    const album = await this._albumsService.getDetailAlbumsById(id);
    const songs = await this._songsService.getSongsByAlbumId(id);
    return h
      .response({ status: "success", data: { album: { ...album, songs } } })
      .code(200);
  }

  async putAlbumByIdHandler(request, h) {
    const { id } = request.params;

    this._validator.validateAlbumPayload(request.payload);
    await this._albumsService.updateAlbumById(id, request.payload);
    return h
      .response({ status: "success", message: "Berhasil mengubah album" })
      .code(200);
  }

  async deleteAlbumHandler(request, h) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);
    return h
      .response({
        status: "success",
        message: "Berhasil menghapus album",
      })
      .code(200);
  }

  async postAlbumLikeByAlbumIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getDetailAlbumsById(albumId);
    await this._userAlbumLikesService.addAlbumLike(userId, albumId);
    return h
      .response({
        status: "success",
        message: "Berhasil menyukai album",
      })
      .code(201);
  }

  async deleteAlbumLikeByAlbumIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getDetailAlbumsById(albumId);
    await this._userAlbumLikesService.deleteAlbumLike(userId, albumId);
    return h
      .response({
        status: "success",
        message: "Berhasil menghapus like dari album",
      })
      .code(200);
  }

  async getAlbumLikesByAlbumIdHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumsService.getDetailAlbumsById(albumId);
    const { result, cache } = await this._userAlbumLikesService.getAlbumLikes(
      albumId
    );
    return h
      .response({
        status: "success",
        data: {
          likes: result,
        },
      })
      .header("X-Data-Source", cache || "")
      .code(200);
  }
}

module.exports = AlbumsHandler;
