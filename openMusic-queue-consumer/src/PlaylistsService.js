const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: "SELECT id, name FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: "SELECT s.id, s.title, s.performer FROM playlist_songs ps LEFT JOIN songs s ON ps.song_id = s.id WHERE ps.playlist_id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
