import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "play",
  aliases: ["p"],
  category: "Music",
  permission: "",
  desc: "🎶 Mulailah memainkan lagu-lagu favoritmu!",

  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: { playing: false, active: false },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, args, ServerData }) => {

    const prefix = ServerData.prefix || client.settings.PREFIX;

    const query = args.join(" ");

    if (!query) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `❌ Anda tidak memberikan lagu!\nGunakan \`${prefix}play <song/url>\``
            ),
        ],
      });
    }

    const { channel } = message.member.voice;

    let player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: channel.id,
      deaf: true,
    });

    try {
      const loadingMsg = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("🔍 Mencari lagu Anda..."),
        ],
      });

      const result = await client.kazagumo.search(query, {
        requester: message.author,
      });

      if (!result || !result.tracks.length) {
        return loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ Tidak ada hasil ditemukan!"),
          ],
        });
      }

      if (result.type === "PLAYLIST") {

        for (const track of result.tracks)
          player.queue.add(track);

        if (!player.playing) player.play();

        const playlistName =
          result.playlist?.name || "Playlist";

        const playlistUrl =
          result.playlist?.uri || result.tracks[0].uri;

        return loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `📂 Playlist ditambahkan!\n` +
                `**${playlistName}**\n` +
                `Jumlah lagu: **${result.tracks.length}**`
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Buka Playlist")
                .setURL(playlistUrl)
                .setStyle(ButtonStyle.Link)
            ),
          ],
        });
      }

      const track = result.tracks[0];
      player.queue.add(track);

      if (!player.playing && !player.paused)
        player.play();

      return loadingMsg.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `🎵 Ditambahkan:\n[${track.title}](${track.uri})\n` +
              `👤 ${track.author}`
            ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("🎧 Dengarkan")
              .setURL(track.uri)
              .setStyle(ButtonStyle.Link)
          ),
        ],
      });

    } catch (err) {
      console.error(err);

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ Terjadi error saat memutar lagu"),
        ],
      });
    }
  },
};
