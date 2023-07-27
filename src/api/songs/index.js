const SongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "Song",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    await server.route(routes(songsHandler));
  },
};
