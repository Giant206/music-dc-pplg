import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "autoplay",
  aliases: ["ap"],
  category: "Music",
  permission: "",
  desc: "🎵 Aktifkan Mode AutoPlay untuk Musik Tanpa Henti!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }} ctx
   */
  run: async ({ client, message, player }) => {
    try {
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **Tidak ada pemutar musik aktif ditemukan!**")
              .setColor("#FF0000"),
          ],
        });
      }

      const isAutoplayEnabled = player.data.get("autoplay");
      const newState = !isAutoplayEnabled;
      player.data.set("autoplay", newState);

      const embed = new EmbedBuilder()
        .setTitle("🎶 Autoplay Mode")
        .setDescription(
          newState
            ? "✅ **Fitur putar otomatis kini diaktifkan!** Bot akan terus memutar lagu-lagu serupa secara otomatis."
            : "❌ **Fitur putar otomatis dinonaktifkan!** Antrian akan berhenti ketika selesai."
        )
        .setColor(newState ? "#00FF00" : "#FF0000")
        .setFooter({
          text: `Dialihkan oleh ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay_toggle")
          .setLabel(newState ? "Matikan" : "Aktifkan")
          .setStyle(newState ? 4 : 3)
      );

      message.channel.send({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error(error);
      message.channel.send({
        content: "⚠️ **Terjadi kesalahan saat mengaktifkan Autoplay!**",
      });
    }
  },
};
