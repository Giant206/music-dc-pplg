import {
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from "discord.js";

export default {
  name: "search",
  aliases: ["se", "Dhund"],
  category: "Music",
  permission: "",
  desc: "🔍 Cari lagu berdasarkan minat Anda!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, ServerData }) => {
    try {
      await message.channel.sendTyping();
      const query = args.join(" ");
      if (!query) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                `❌ **Penggunaan:** \`${ServerData.prefix}search <nama lagu>\``
              ),
          ],
        });
      }

      // Check for unsupported platforms
      if (
        /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(
          query
        )
      ) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                "⚠️ **Dukungan YouTube telah dihapus!**\nSilakan gunakan platform lain atau berikan kueri pencarian."
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
        loadBalancer: true,
      });

      let result = await client.kazagumo.search(query, {
        requester: message.author,
      });

      if (!result.tracks.length) {
        return message.reply(`❌ **Tidak ada hasil ditemukan untuk:** \`${query}\``);
      }

      // Generate select menu options
      const results = result.tracks.slice(0, 10).map((track, index) => ({
        label: `${index + 1}. ${
          track.title.length > 40
            ? track.title.slice(0, 37) + "..."
            : track.title
        }`,
        value: track.uri,
      }));

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("trackSelect")
        .setPlaceholder("🎵 Pilih lagu untuk diputar")
        .addOptions(results);

      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setAuthor({
          name: "🎶 Pilih Lagu untuk Diputar",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(selectMenu)],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        time: 20000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "trackSelect") {
          const selectedTrack = await client.kazagumo
            .search(i.values[0], { requester: i.user })
            .then((x) => x.tracks[0]);

          if (!selectedTrack) return;

          player.queue.add(selectedTrack);
          if (!player.playing && !player.paused && !player.queue.size) {
            player.play();
          }

          i.update({
            embeds: [
              embed
                .setAuthor({
                  name: "🎶 Lagu Ditambahkan ke Antrian",
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `✅ **[${selectedTrack.title}](${selectedTrack.uri})** telah ditambahkan ke antrian!`
                ),
            ],
            components: [],
          });
        }
      });

      collector.on("end", async (collected) => {
        if (collected.size === 0) {
          msg.edit({
            embeds: [
              embed.setDescription(
                "⏳ **Pemilihan Kadaluarsa!** Tidak ada lagu yang dipilih."
              ),
            ],
            components: [],
          });
        }
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Terjadi kesalahan saat mencari lagu!**"),
        ],
      });
    }
  },
};
