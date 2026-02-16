import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "8d",
  aliases: ["3d"],
  category: "Filters",
  permission: "",
  desc: "Aktifkan filter audio 8D untuk pengalaman yang lebih mendalam!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }} ctx
   */
  run: async ({ client, message, player }) => {
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable 8D")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🎧"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable 8D")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⛔")
      );

      const embed = new EmbedBuilder()
        .setTitle("🎵 **Filter Audio - Mode 8D**")
        .setDescription(
          "✨ **Nikmati musik dengan cara baru!**\n\n🔄 Filter 8D menciptakan efek **rotasi** yang bergerak di sekitar kepala Anda. Gunakan **headphones** untuk efek terbaik!"
        )
        .setColor(client.settings.COLOR)
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Klik tombol untuk mengaktifkan/menonaktifkan filter 8D!",
          iconURL: message.author.displayAvatarURL(),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 20000, // 20 seconds timeout
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            rotation: { rotationHz: 0.103 },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **Filter 8D Diaktifkan!** Nikmati pengalaman audio yang imersif. 🎶"
            )
            .setColor(client.settings.SUCCESS_COLOR);

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            rotation: { rotationHz: 0 },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription(
              "❌ **Filter 8D Dinonaktifkan!** Kembali ke pemutaran audio normal. 🎵"
            )
            .setColor(client.settings.ERROR_COLOR);

          await i.update({ embeds: [disabledEmbed], components: [] });
        }
        msg.delete().catch(() => {});
      });

      collector.on("end", () => {
        msg
          .edit({
            components: [],
            embeds: [
              embed.setDescription(
                "⏳ **Waktu Habis!** Anda tidak memilih opsi dalam waktu yang ditentukan. Jalankan perintah kembali."
              ),
            ],
          })
          .catch(() => {});
      });
    } catch (e) {
      console.error(e);
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          "⚠️ **Terjadi kesalahan saat mengaktifkan/menonaktifkan filter 8D.**"
        )
        .setColor(client.settings.ERROR_COLOR);
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
