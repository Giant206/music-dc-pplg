import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

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
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **Tidak ada pemutar musik aktif ditemukan!**")
              .setColor("#FF0000"),
          ],
        });
      }
      
      const current = player.data.get("autoplay") ?? false;
      const newState = !current;
      player.data.set("autoplay", newState);

      const embed = new EmbedBuilder()
        .setTitle("🎶 Autoplay Mode")
        .setDescription(
          newState
            ? "✅ **Autoplay diaktifkan!** Bot akan memutar lagu serupa otomatis."
            : "❌ **Autoplay dimatikan!** Musik berhenti saat antrian habis."
        )
        .setColor(newState ? "#00FF00" : "#FF0000")
        .setFooter({
          text: `Diubah oleh ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay")
          .setLabel(newState ? "Menu" : "Menu")
          .setStyle(
            newState ? ButtonStyle.Danger : ButtonStyle.Success
          )
      );

      return message.reply({
        embeds: [embed],
        components: [row],
      });

    } catch (error) {
      console.error(error);
      return message.reply({
        content: "⚠️ **Terjadi kesalahan saat mengubah Autoplay!**",
      });
    }
  },
};
