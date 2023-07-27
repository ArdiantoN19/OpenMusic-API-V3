const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists (id, name, owner) VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    const playlistId = result.rows[0].id;

    if (!playlistId) throw new InvariantError("Playlist gagal ditambahkan");
    return playlistId;
  }

  async getPlaylists(owner) {
    const query = {
      text: "SELECT p.id, p.name, u.username FROM playlists p LEFT JOIN users u ON p.owner = u.id LEFT JOIN collaborations c ON p.id = c.playlist_id WHERE p.owner = $1 OR c.user_id = $1 GROUP BY p.id, p.name, u.username",
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus, id tidak ditemukan");
    }
  }

  async getDetailPlaylistById(playlistId, owner) {
    const query = {
      text: "SELECT p.id, p.name, u.username FROM playlists p LEFT JOIN users u ON p.owner = u.id WHERE p.id = $1 OR p.owner = $2",
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError("Playlist tidak ditemukan");

    return result.rows[0];
  }

  async verifyPlaylistId(playlistId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      try {
        await this._collaborationsService.verifyCollaboration(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
