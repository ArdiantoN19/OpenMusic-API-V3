const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: (request, h) => handler.getDetailAlbumByIdHandler(request, h),
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: (request, h) => handler.putAlbumByIdHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: (request, h) => handler.deleteAlbumHandler(request, h),
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.postAlbumLikeByAlbumIdHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: (request, h) =>
      handler.deleteAlbumLikeByAlbumIdHandler(request, h),
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: (request, h) => handler.getAlbumLikesByAlbumIdHandler(request, h),
  },
];

module.exports = routes;
