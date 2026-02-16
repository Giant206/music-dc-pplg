import { EmbedBuilder } from "discord.js";
import reconnectAuto from "../../../Models/reconnect.js";

export default {
  name: "247",
  aliases: ["24/7", "24/7mode", "24/7-mode"],
  category: "Music",
  permission: "",
  desc: "Mengaktifkan mode 24/7 untuk pemutaran musik tanpa henti! 🎵",
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
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   */
  run: async ({ client, message }) => {
    try {
      const guildId = message.guild.id;
      const existingData = await reconnectAuto.findOne({ GuildId: guildId });

      if (existingData) {
        await reconnectAuto.findOneAndDelete({ GuildId: guildId });

        const disabledEmbed = new EmbedBuilder()
          .setTitle("⏹️ Mode 24/7 Dinonaktifkan")
          .setDescription(
            "🔴 **Mode 24/7 sekarang dinonaktifkan.** Bot akan keluar saat tidak aktif."
          )
          .setColor("#FF0000")
          .setFooter({
            text: `Dinonaktifkan oleh ${message.author.username}`,
            iconURL: message.author.displayAvatarURL(),
          });

        return message.channel.send({ embeds: [disabledEmbed] });
      }

      await reconnectAuto.create({
        GuildId: guildId,
        TextId: message.channel.id,
        VoiceId: message.member.voice.channel.id,
      });

      await client.kazagumo.createPlayer({
        guildId: guildId,
        textId: message.channel.id,
        voiceId: message.member.voice.channel.id,
        deaf: true,
      });

      const enabledEmbed = new EmbedBuilder()
        .setTitle("✅ Mode 24/7 Diaktifkan")
        .setDescription(
          "🔵 **Mode 24/7 sekarang aktif!** Bot akan tetap berada di VC meski tidak aktif."
        )
        .setColor("#00FF00")
        .setFooter({
          text: `Diaktifkan oleh ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      message.channel.send({ embeds: [enabledEmbed] });
    } catch (e) {
      console.error(e);
      message.channel.send({
        content: "⚠️ **Terjadi kesalahan saat mengaktifkan mode 24/7!**",
      });
    }
  },
};
