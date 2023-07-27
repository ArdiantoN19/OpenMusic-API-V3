# OpenMusic API V2 - Hapi JS

## Endpoint

### Pengelolaan Data Album

### Menambahkan data album

- /albums (POST)

#### Request Body

```json
{
  "name": "Viva la Vida", --> (required)
  "year": 2008 --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "albumId": "album-Mk8AnmCp210PwT6B"
  }
}
```

### Mendapatkan album berdasarkan id

- /albums/{id} (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "year": 2008,
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        },
        {
          "id": "song-poax5Oy7L8WKllqw",
          "title": "Centimeteries of London",
          "performer": "Coldplay"
        },
        {
          "id": "song-Qalokam7L8WKf74l",
          "title": "Lost!",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

### Mengubah album berdasarkan id album

- /albums/{id} (PUT)

#### Request Body

```json
{
  "name": "Viva la Vida", --> (required)
  "year": 2008 --> (required)
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Berhasil mengubah album"
}
```

### Menghapus album berdasarkan id

- /albums/{id} (DELETE)

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Berhasil menghapus album"
}
```

### Pengelolaan Data Song

### Menambahkan lagu

- /songs (POST)

#### Request Body

```json
{
  "title": "Life in Technicolor", --> (required)
  "year": 2008, --> (required)
  "genre": "Pop", --> (required)
  "performer": "Coldplay", --> (required)
  "duration": 180,
  "albumId": "album-Mk8AnmCp210PwT6B"
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "songId": "song-Qbax5Oy7L8WKf74l"
  }
}
```

### Mendapatkan seluruh lagu

- /songs (GET)
- /songs?title={songTitle} (GET)
- /songs?performer={songPerformer} (GET)
- /songs?title={songTitle}&performer={songPerformer} (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      },
      {
        "id": "song-poax5Oy7L8WKllqw",
        "title": "Centimeteries of London",
        "performer": "Coldplay"
      },
      {
        "id": "song-Qalokam7L8WKf74l",
        "title": "Lost!",
        "performer": "Coldplay"
      }
    ]
  }
}
```

### Mendapatkan lagu berdasarkan id

- /songs/{id} (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "song": {
      "id": "song-Qbax5Oy7L8WKf74l",
      "title": "Life in Technicolor",
      "year": 2008,
      "performer": "Coldplay",
      "genre": "Indie",
      "duration": 120,
      "albumId": "album-Mk8AnmCp210PwT6B"
    }
  }
}
```

### Mengubah lagu berdasarkan id lagu

- /songs/{id} (PUT)

#### Request Body

```json
{
  "title": "Life in Technicolor Update", --> (required)
  "year": 2008, --> (required)
  "genre": "Pop", --> (required)
  "performer": "Coldplay", --> (required)
  "duration": 180,
  "albumId": "album-Mk8AnmCp210PwT6B"
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Berhasil mengubah song"
}
```

### Menghapus lagu berdasarkan id

- /songs/{id} (DELETE)

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Berhasil menghapus song"
}
```

### Registrasi dan Authentikasi Pengguna

### Menambahkan pengguna / register

- /users (POST)

#### Request Body

```json
{
  "username": "john", --> (required, unique)
  "password": "secretpassword", --> (required)
  "fullname": "John Doe", --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "userId": "user-UsamMhLnZE08sd9f"
  }
}
```

### Authentikasi pengguna / login

- /authentications (POST)

#### Request Body

```json
{
  "username": "john", --> (required)
  "password": "secretpassword", --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "accessToken": "accessToken",
    "refreshToken": "refreshToken"
  }
}
```

### Memperbarui access token

- /authentications (PUT)

#### Request Body

```json
{
  "refreshToken": "refreshToken", --> (required)
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "accessToken": "accessToken"
  }
}
```

### Menghapus authentikasi

- /authentications (DELETE)

#### Request Body

```json
{
  "refreshToken": "refreshToken", --> (required)
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

### Pengelolaan Data Playlist

- Resource yang dibatasi (restrict). Membutuhkan access token untuk mengaksesnya.

### Authorization Header

#### Menambahkan access token pada header

```json
{
  "Authorization": "Bearer {accessToken}"
}
```

### Menambahkan playlist

- /playlists (POST)

#### Request Body

```json
{
  "name": "Lagu Indie Hits Indonesia", --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-Qbax5Oy7L8WKf74l"
  }
}
```

### Melihat daftar playlist yang dimiliki

- /playlists (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "playlists": [
      {
        "id": "playlist-Qbax5Oy7L8WKf74l",
        "name": "Lagu Indie Hits Indonesia",
        "username": "dicoding"
      },
      {
        "id": "playlist-lmA4PkM3LseKlkmn",
        "name": "Lagu Untuk Membaca",
        "username": "dicoding"
      }
    ]
  }
}
```

### Menghapus playlist

- /playlists/{id} (DELETE)

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Playlist berhasil dihapus"
}
```

### Menambahkan lagu ke playlist

- /playlists/{id}/songs (POST)

#### Request Body

```json
{
  "songId": "song-Qbax5Oy7L8WKf74l", --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "message": "Song berhasil ditambahkan ke playlist"
}
```

### Melihat daftar lagu di dalam playlist

- /playlists/{id}/songs (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-Mk8AnmCp210PwT6B",
      "name": "My Favorite Coldplay",
      "username": "dicoding",
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        },
        {
          "id": "song-poax5Oy7L8WKllqw",
          "title": "Centimeteries of London",
          "performer": "Coldplay"
        },
        {
          "id": "song-Qalokam7L8WKf74l",
          "title": "Lost!",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

### Menghapus lagu dari playlist

- /playlists/{id}/songs (DELETE)

#### Request Body

```json
{
  "songId": "song-Qbax5Oy7L8WKf74l", --> (required)
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "Song berhasil dihapus dari playlist"
}
```

### Mengelola data kolaborator playlist

### Menambahkan kolaborator playlist

- /collaborations (POST)

#### Request Body

```json
{
  "playlistId": "playlist-Mk8AnmCp210PwT6B", --> (required)
  "userId": "user-UsamMhLnZE08sd9f" --> (required)
}
```

#### Response (201) : created

```json
{
  "status": "success",
  "data": {
    "collaborationId": "collab-9AJII5x7guTyiWw_"
  }
}
```

### Menghapus kolaborator playlist

- /collaborations (DELETE)

#### Request Body

```json
{
  "playlistId": "playlist-Mk8AnmCp210PwT6B", --> (required)
  "userId": "user-UsamMhLnZE08sd9f" --> (required)
}
```

#### Response (200) : ok

```json
{
  "status": "success",
  "message": "collaborator berhasil dihapus"
}
```

### Mendapatkan daftar playlist activities

- /playlists/{id}/activities (GET)

#### Response (200) : ok

```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-Mk8AnmCp210PwT6B",
    "activities": [
      {
        "username": "dicoding",
        "title": "Life in Technicolor",
        "action": "add",
        "time": "2021-09-13T08:06:20.600Z"
      },
      {
        "username": "dicoding",
        "title": "Centimeteries of London",
        "action": "add",
        "time": "2021-09-13T08:06:39.852Z"
      },
      {
        "username": "dimasmds",
        "title": "Life in Technicolor",
        "action": "delete",
        "time": "2021-09-13T08:07:01.483Z"
      }
    ]
  }
}
```
