const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbumLike(userId, albumId) {
    await this.verifyNewUserAlbumLikes(userId, albumId);

    const id = `UAL-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES($1, $2, $3)",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Gagal menyukai album");
    }

    await this._cacheService.delete(`userAlbumLikes:${albumId}`);
  }

  async verifyNewUserAlbumLikes(userId, albumId) {
    const query = {
      text: "SELECT user_id, album_id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError("Gagal menghapus like dari album");
    }

    await this._cacheService.delete(`userAlbumLikes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    const keyCache = `userAlbumLikes:${albumId}`;
    try {
      let result = await this._cacheService.get(keyCache);
      result = JSON.parse(result);

      return { result, cache: "cache" };
    } catch (error) {
      const query = {
        text: "SELECT count(*) as total_likes FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      let result = await this._pool.query(query);
      result = Number(result.rows[0].total_likes);

      await this._cacheService.set(keyCache, JSON.stringify(result));

      return { result, cache: "" };
    }
  }
}

module.exports = UserAlbumLikesService;
