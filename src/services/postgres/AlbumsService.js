const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const helpers = require("../../helpers");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO albums (id, name, year, created_at, updated_at) values ($1, $2, $3, $4, $4) RETURNING id",
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  async getAlbums() {
    const query = "SELECT * FROM albums";
    const result = await this._pool.query(query);
    return result.rows.map(helpers.responseAlbum);
  }

  async getDetailAlbumsById(id) {
    const query = {
      text: "SELECT * FROM albums where id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return result.rows.map(helpers.responseDetailAlbum)[0];
  }

  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal mengubah album, id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Gagal menghapus album, id tidak ditemukan");
    }
  }

  async editCoverAlbums(albumId, cover) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2",
      values: [cover, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("Gagal menambahkan cover, id tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
