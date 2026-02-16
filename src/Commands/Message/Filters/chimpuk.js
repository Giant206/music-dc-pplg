import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "chimpuk",
  aliases: ["chimi"],
  category: "Filters",
  permission: "",
  desc: "Mengaktifkan filter Chimpuk yang menyenangkan untuk pengalaman suara yang unik! 🐵",
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
      // Buttons for enabling/disabling the filter
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable Chimpuk")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🐵"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Reset Filter")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );

      const embed = new EmbedBuilder()
        .setTitle("🐵 **Filter Audio - Chimpuk Mode**")
        .setDescription(
          "🎶 **Aktifkan kesenangan!** Filter Chimpuk memberikan efek suara yang lucu dan tinggi.\n\n🔄 Klik **Aktifkan Chimpuk** untuk mengaktifkan, atau **Reset Filter** untuk kembali ke suara normal!"
        )
        .setColor(client.settings.COLOR)
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Klik tombol untuk mengaktifkan/menonaktifkan Mode Chimpunk!",
          iconURL: message.author.displayAvatarURL(),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      // Collector for button interactions
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
            timescale: {
              speed: 1.05,
              pitch: 1.35,
              rate: 1.25,
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **Mode Chimpuk Diaktifkan!** Nikmati vibe lucu. 🐒🎶"
            )
            .setColor(client.settings.SUCCESS_COLOR);

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 1,
              pitch: 1,
              rate: 1,
            },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription(
              "❌ **Mode Chimpuk Dinonaktifkan!** Kembali ke suara normal. 🔄"
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
      message.channel.send({
        content:
          "⚠️ | **Terjadi kesalahan saat menerapkan filter Chimpuk!**",
      });
    }
  },
};
