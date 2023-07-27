const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const InvariantError = require("../../exceptions/InvariantError");

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    const collaborationId = result.rows[0].id;

    if (!collaborationId) {
      throw new InvariantError("Collaborator gagal ditambahkan");
    }

    return collaborationId;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Collaborator gagal dihapus");
    }
  }

  async verifyCollaboration(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = CollaborationsService;
