import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "china",
  aliases: ["corona"],
  category: "Filters",
  permission: "",
  desc: "Mengaktifkan filter China untuk efek suara yang unik! 🏮",
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
      // Interactive buttons
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable China Filter")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🏮"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Reset Filter")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🏮 **Filter Audio - China Mode**")
        .setDescription(
          "🎶 **Experience a unique audio effect!**\n🔄 Klik **Aktifkan Filter China** untuk mengaktifkan, atau **Reset Filter** untuk kembali ke suara normal."
        )
        .setColor(client.settings.COLOR)
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Klik tombol untuk mengaktifkan/menonaktifkan filter!",
          iconURL: message.author.displayAvatarURL(),
        });

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      // Button collector
      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 20000, // Expires in 20 seconds
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 0.85,
              pitch: 1.2,
              rate: 1.15,
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **Filter China Diaktifkan!** Nikmati suara baru. 🏮🎶"
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
              "❌ **Filter China Dinonaktifkan!** Kembali ke suara normal. 🔄"
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
        content: "⚠️ | **Terjadi kesalahan saat menerapkan filter China!**",
      });
    }
  },
};
