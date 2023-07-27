require("dotenv").config();

const Hapi = require("@hapi/hapi");
const JWT = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const path = require("path");

// Albums
const albums = require("./api/albums");
const AlbumService = require("./services/postgres/AlbumsService");
const AlbumsValidator = require("./validation/albums");

// Exceptions
const ClientError = require("./exceptions/ClientError");

// Songs
const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validation/songs");

// Users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validation/users");

// Authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validation/authentications");
const TokenManager = require("./tokenize/TokenManager");

// Playlist
const playlists = require("./api/playlists");
const PlaylistsService = require("./services/postgres/PlaylistsService");
const PlaylistSongsService = require("./services/postgres/PlaylistSongsService");
const PlaylistsValidator = require("./validation/playlists");
const PlaylistSongsValidator = require("./validation/playlistSongs");

// Collaborations
const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validation/collaborations");

// PlaylistSongActivities
const PlaylistSongActivitiesService = require("./services/postgres/PlaylistSongActivities");

// Export Playlists
const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportPlaylistsValidator = require("./validation/exports");

// Uploads
const uploads = require("./api/uploads");
const UploadsValidator = require("./validation/uploads");
const StorageService = require("./services/storage/StorageService");
const UserAlbumLikesService = require("./services/postgres/UserAlbumLikes");
const S3StorageService = require("./services/storage/S3StorageService");

// Cache
const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const albumsService = new AlbumService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService(
    songsService,
    playlistsService
  );
  const playlistSongActivitiesService = new PlaylistSongActivitiesService();
  const storageService = process.env.AWS_BUCKET_NAME
    ? new S3StorageService()
    : new StorageService(path.resolve(__dirname, process.env.LOCAL_STORAGE));
  const cacheService = new CacheService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([JWT, Inert]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (payload) => ({
      isValid: true,
      credentials: {
        id: payload.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumsService,
        songsService,
        userAlbumLikesService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService,
        playlistSongActivitiesService,
        songsService,
        playlistsValidator: PlaylistsValidator,
        playlistSongsValidator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        usersService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportPlaylistsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        albumsService,
        storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // Penanganan error dari client
      if (response instanceof ClientError) {
        return h
          .response({
            status: "fail",
            message: response.message,
          })
          .code(response.statusCode);
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      console.log(response);
      return h
        .response({
          status: "error",
          message: "Maaf, terjadi kegagalan pada server kami",
        })
        .code(500);
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server sedang berjalan di ${server.info.uri}`);
};

init();
