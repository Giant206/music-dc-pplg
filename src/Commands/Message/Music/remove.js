import { EmbedBuilder } from "discord.js";

export default {
  name: "remove",
  aliases: ["rm"],
  category: "Music",
  permission: "",
  desc: "🗑️ Menghapus lagu dari antrean!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Tidak ada pemain aktif yang ditemukan di server ini!**"),
        ],
      });
    }

    if (!player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription("⚠️ **Antrian saat ini kosong!**"),
        ],
      });
    }

    if (!args[0] || isNaN(args[0])) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#1E90FF")
            .setDescription(
              "🔢 **Silakan tentukan nomor trek yang valid untuk dihapus!**\n\nContoh: `!remove 2`"
            ),
        ],
      });
    }

    const trackNumber = parseInt(args[0]);

    if (trackNumber < 1 || trackNumber > player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#DC143C")
            .setDescription(
              `🚫 **Nomor trek tidak valid!**\nPilih nomor antara \`1\` dan \`${player.queue.length}\`.`
            ),
        ],
      });
    }

    const removedTrack = player.queue[trackNumber - 1];
    player.queue.remove(trackNumber - 1);

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#32CD32")
          .setAuthor({
            name: "✅ Lagu Dihapus!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🗑️ **Lagu yang dihapus:**\n\n**[${removedTrack.title}](${removedTrack.uri})**\n🎤 **Artis:** ${removedTrack.author}\n👤 **Diminta oleh:** ${removedTrack.requester}`
          )
          .setFooter({ text: `Total Lagu Tersisa: ${player.queue.length}` }),
      ],
    });
  },
};
