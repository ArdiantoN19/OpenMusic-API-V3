const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class PlaylistSongsService {
  constructor(songsService, playlistsService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._playlistsService = playlistsService;
  }

  async addPlaylistSong(playlistId, songId) {
    await this._playlistsService.verifyPlaylistId(playlistId);
    await this._songsService.getDetailSongById(songId);
    const id = `playlist_song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_songs (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Playlist song gagal ditambahkan");
    }
    return { id };
  }

  async getPlaylistSongs(playlistId) {
    const query = {
      text: "SELECT s.id, s.title, s.performer FROM playlist_songs ps LEFT JOIN songs s ON ps.song_id = s.id WHERE ps.playlist_id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistSong(playlistId, songId) {
    await this._playlistsService.verifyPlaylistId(playlistId);
    await this._songsService.getDetailSongById(songId);

    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Playlist song gagal dihapus");
    }
  }
}

module.exports = PlaylistSongsService;
