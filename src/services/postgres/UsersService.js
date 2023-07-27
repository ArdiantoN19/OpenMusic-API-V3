require("dotenv").config();
const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const NotFoundError = require("../../exceptions/NotFoundError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);
    const userId = result.rows[0].id;

    if (!userId) throw new InvariantError("User gagal ditambahkan");
    return userId;
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return id;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) throw new NotFoundError("User tidak ditemukan");
  }
}

module.exports = UsersService;
