const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivity({ playlistId, songId, userId, action }) {
    const id = `playlist-song-activity-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongActivitiesById(id) {
    const query = {
      text: "SELECT psa.* FROM playlist_song_activities psa LEFT JOIN playlists p ON psa.playlist_id = p.id WHERE psa.playlist_id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
