const helpers = require("../../helpers");

class PlaylistsHandler {
  constructor(
    playlistsService,
    playlistSongsService,
    playlistSongActivitiesService,
    songsService,
    playlistsValidator,
    playlistSongsValidator
  ) {
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._songsService = songsService;
    this._playlistsValidator = playlistsValidator;
    this._playlistSongsValidator = playlistSongsValidator;
  }

  async postPlaylistHandler(request, h) {
    this._playlistsValidator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });
    return h.response({ status: "success", data: { playlistId } }).code(201);
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);

    return h.response({ status: "success", data: { playlists } }).code(200);
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return h
      .response({ status: "success", message: "Playlist berhasil dihapus" })
      .code(200);
  }

  async postPlaylistSongByIdHandler(request, h) {
    this._playlistSongsValidator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = "add";

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistSongsService.addPlaylistSong(playlistId, songId);

    await this._playlistSongActivitiesService.addPlaylistSongActivity({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    return h
      .response({
        status: "success",
        message: "Song berhasil ditambahkan ke playlist",
      })
      .code(201);
  }

  async getPlaylistSongsByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistData = await this._playlistsService.getDetailPlaylistById(
      playlistId,
      credentialId
    );
    const playlistSongs = await this._playlistSongsService.getPlaylistSongs(
      playlistId
    );

    const playlist = { ...playlistData, songs: [...playlistSongs] };
    return h
      .response({
        status: "success",
        data: { playlist },
      })
      .code(200);
  }

  async deletePlaylistSongByIdHandler(request, h) {
    this._playlistSongsValidator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const action = "delete";

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

    await this._playlistSongActivitiesService.addPlaylistSongActivity({
      playlistId,
      songId,
      userId: credentialId,
      action,
    });

    return h
      .response({
        status: "success",
        message: "Song berhasil dihapus dari playlist",
      })
      .code(200);
  }

  async getPlaylistSongActivitiesByIdPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

    const playlist = await this._playlistsService.getDetailPlaylistById(
      playlistId,
      credentialId
    );
    const songs = await this._songsService.getSongs(request.query);
    const activities =
      await this._playlistSongActivitiesService.getPlaylistSongActivitiesById(
        playlistId
      );

    const result = helpers.responsePlaylistSongActivitiesByIdPlaylist({
      playlist,
      songs,
      activities,
    });

    return h
      .response({
        status: "success",
        data: { ...result },
      })
      .code(200);
  }
}

module.exports = PlaylistsHandler;
