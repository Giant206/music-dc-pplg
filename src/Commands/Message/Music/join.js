import { EmbedBuilder, PermissionsBitField } from "discord.js";

export default {
  name: "join",
  aliases: ["j"],
  category: "Music",
  permission: "",
  desc: "🎵 Menghubungkan bot ke saluran suara Anda!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try {
      const { guild, member, channel } = message;
      const voiceChannel = member.voice.channel;

      if (!voiceChannel) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "🚫 **Anda harus berada di saluran suara untuk menggunakan perintah ini!**"
              ),
          ],
        });
      }

      if (player && player.state === "CONNECTED") {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `✅ **Saya sudah terhubung ke** <#${player.voiceChannel}>!`
              ),
          ],
        });
      }

      const botPermissions = guild.members.me.permissions;
      if (!botPermissions.has(PermissionsBitField.Flags.ViewChannel)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Saya tidak memiliki izin untuk melihat saluran suara Anda!**"
              ),
          ],
        });
      }

      if (!botPermissions.has(PermissionsBitField.Flags.Connect)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Saya tidak memiliki izin untuk terhubung ke saluran suara Anda!**"
              ),
          ],
        });
      }

      if (!botPermissions.has(PermissionsBitField.Flags.Speak)) {
        return channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Saya tidak memiliki izin untuk berbicara di saluran suara Anda!**"
              ),
          ],
        });
      }

      if (!player) {
        player = client.kazagumo.createPlayer({
          guildId: guild.id,
          voiceId: voiceChannel.id,
          textId: channel.id,
          deaf: true,
        });
      }

      return channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(
              `✅ **Berhasil terhubung ke** ${voiceChannel} **dan siap memutar musik!** 🎶`
            ),
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "⚠️ **Terjadi kesalahan saat mencoba menghubungkan ke saluran suara!**"
            ),
        ],
      });
    }
  },
};
