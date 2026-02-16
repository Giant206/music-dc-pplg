import { EmbedBuilder } from "discord.js";

export default {
  name: "seek",
  aliases: [],
  category: "Music",
  permission: "",
  desc: "⏩ Carilah waktu tertentu di jalur saat ini!",
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
  run: async ({ client, message, args }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setAuthor({
                name: "❌ Tidak Ada Pemutar Aktif Ditemukan!",
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription("Tidak ada pemutar aktif di server ini."),
          ],
        });
      }

      const track = player.queue.current;
      if (!track) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **Tidak ada lagu yang sedang diputar saat ini!**"),
          ],
        });
      }

      if (!args[0]) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⏱️ **Penggunaan:** `seek <waktu>`\n📌 **Contoh:** `seek 1:30` (1 menit 30 detik)"
              ),
          ],
        });
      }

      if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(args[0])) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Format waktu tidak valid!**\n✅ **Format yang valid:** `mm:ss` atau `hh:mm:ss`"
              ),
          ],
        });
      }

      const ms =
        args[0]
          .split(":")
          .map(Number)
          .reduce((acc, time) => acc * 60 + time, 0) * 1000;

      if (ms > track.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⏳ **Waktu yang diberikan melebihi durasi lagu!**"
              ),
          ],
        });
      }

      player.seek(ms);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `⏩ **Dicari ke:** \`${args[0]}\`\n🎵 **Lagu:** [${track.title}](${track.uri})`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Terjadi kesalahan saat mencari waktu!**"),
        ],
      });
    }
  },
};
