const fs = require("fs");

const helpers = {
  responseAlbum: ({ id, name, year }) => {
    return { id, name, year };
  },
  responseDetailAlbum: ({ id, name, year, cover }) => ({
    id,
    name,
    year,
    coverUrl: cover,
  }),
  responseSongs: ({ id, title, performer }) => {
    return { id, title, performer };
  },
  responseSongDetail: ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    album_id,
  }) => {
    return {
      id,
      title,
      year,
      performer,
      genre,
      duration,
      albumId: album_id,
    };
  },
  responseSongByQueryParams: (...args) => {
    const argument = args[0];
    const title = argument?.title?.toLowerCase();
    const performer = argument?.performer?.toLowerCase();
    const likeQuery = (arg) => {
      return `%${arg}%`;
    };

    if (title && performer) {
      return {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) like $1 AND LOWER(performer) like $2",
        values: [likeQuery(title), likeQuery(performer)],
      };
    }
    if (title) {
      return {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) like $1",
        values: [likeQuery(title)],
      };
    }
    if (performer) {
      return {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(performer) like $1",
        values: [likeQuery(performer)],
      };
    }
    return {
      text: "SELECT id, title, performer FROM songs",
    };
  },
  responsePlaylistSongActivitiesByIdPlaylist: ({
    playlist,
    songs,
    activities,
  }) => {
    const { id, username } = playlist;
    const responseSongs = (songId) => {
      const dataSong = songs?.find((song) => {
        return song?.id.toLowerCase().includes(songId.toLowerCase());
      });
      return dataSong.title;
    };
    const responseActivities = activities?.map((songActivity) => ({
      username,
      title: responseSongs(songActivity?.song_id),
      action: songActivity?.action,
      time: songActivity?.time,
    }));
    const result = { playlistId: id, activities: [...responseActivities] };
    return result;
  },
  getCurrentYear: () => {
    return new Date().getFullYear();
  },
  verifyNewDirectory: (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  },
};

module.exports = helpers;
