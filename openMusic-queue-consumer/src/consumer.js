require("dotenv").config();

const amqp = require("amqplib");

const MailSender = require("./MailSender");
const PlaylistsService = require("./PlaylistsService");
const Listener = require("./Listener");

(async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlist", {
    durable: true,
  });

  channel.consume("export:playlist", listener.listen, { noAck: true });
})();
