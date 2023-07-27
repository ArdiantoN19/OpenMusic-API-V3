const ExportPlaylistsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (
    server,
    { producerService, playlistsService, validator }
  ) => {
    const exportPlaylistHandler = new ExportPlaylistsHandler(
      producerService,
      playlistsService,
      validator
    );
    await server.route(routes(exportPlaylistHandler));
  },
};
