import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

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
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, args, ServerData }) => {
    let prefix = ServerData.prefix;
    const query = args.join(" ");

    if (!query) {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `❌ **Anda tidak memberikan lagu!**\nGunakan **\`${prefix}play <song/url>\`** untuk melanjutkan.`
        );

      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => msg.delete(), 15000);
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
      const msg = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`🔍 **Mencari lagu Anda...**`),
        ],
      });

      const result = await client.kazagumo.search(query, {
        requester: message.author,
      });

      if (!result.tracks.length) {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(`❌ **Tidak ada hasil ditemukan untuk query Anda!**`);
        return msg.edit({ embeds: [embed] });
      }

      if (result.type === "PLAYLIST") {
        for (let track of result.tracks) player.queue.add(track);
        const embed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🎵 **Ditambahkan ke Antrian:** [${result.tracks[0].title}](${result.tracks[0].uri})\n👤 **Artis:** ${result.tracks[0].author}\n📂 **Playlist:** [${result.playlist.name}](${result.playlist.uri})\n📊 **Jumlah Lagu:** ${result.tracks.length}`
          );
        return msg.edit({ embeds: [embed] });
      } else {
        player.queue.add(result.tracks[0]);
        if (!player.playing && !player.paused) player.play();

        const embed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🎵 **Ditambahkan ke Antrian:** [${result.tracks[0].title}](${result.tracks[0].uri})\n👤 **Artis:** ${result.tracks[0].author}`
          );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("🎧 Dengarkan Sekarang")
            .setURL(result.tracks[0].uri)
            .setStyle(5)
        );

        return msg.edit({ embeds: [embed], components: [row] });
      }
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              `❌ **Terjadi kesalahan saat mengambil lagu!**`
            ),
        ],
      });
    }
  },
};
