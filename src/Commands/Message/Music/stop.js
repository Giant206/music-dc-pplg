import { EmbedBuilder } from "discord.js";

export default {
  name: "stop",
  aliases: ["Stop", "destroy"],
  category: "Music",
  permission: "",
  desc: "⏹️ Menghentikan pemutar musik dan membersihkan antrean.!",
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
  run: async ({ client, message, player }) => {
    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **Tidak ada pemutar aktif ditemukan!**\n💡 *Mulai memutar sesuatu terlebih dahulu!*"
            ),
        ],
      });
    }

    if (!player.playing) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🎧 **Tidak ada yang sedang diputar saat ini!**"),
        ],
      });
    }

    player.destroy();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("⏹️ **Music Stopped**")
          .setDescription(
            "🎵 **Pemutar telah dihentikan, dan antrean telah dibersihkan!**\n📢 *Anda dapat memulai sesi baru kapan saja!*"
          ),
      ],
    });
  },
};
