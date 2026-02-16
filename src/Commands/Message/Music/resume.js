import { EmbedBuilder } from "discord.js";

export default {
  name: "resume",
  aliases: ["unpause", "continue", "wapis"],
  category: "Music",
  permission: "",
  desc: "▶️ Melanjutkan pemutaran musik!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Tidak ada pemain aktif yang ditemukan di server ini!**"),
        ],
      });
    }

    if (!player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setDescription("⚠️ **Pemutar sudah memutar musik!**"),
        ],
      });
    }

    const currentTrack = player.queue.current;
    player.pause(false);

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#32CD32")
          .setAuthor({
            name: "▶️ Pemutaran Dilanjutkan!",
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `🎶 **Sedang Diputar:**\n\n**[${currentTrack.title}](${currentTrack.uri})**\n🎤 **Artis:** ${currentTrack.author}\n👤 **Diminta oleh:** ${currentTrack.requester}`
          )
          .setFooter({ text: `Nikmati musiknya! Btw PPLG On Top Bro!! 🎧` }),
      ],
    });
  },
};
