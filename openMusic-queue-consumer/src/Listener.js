class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );
      const playlist = await this._playlistsService.getPlaylistById(
        playlistId,
        userId
      );
      const songs = await this._playlistsService.getSongsByPlaylistId(
        playlistId
      );

      const content = {
        playlist: { ...playlist, songs },
      };
      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(content)
      );

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;