import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "treblebass",
  aliases: ["highbass"],
  category: "Filters",
  permission: "",
  desc: "Tingkatkan kualitas musik Anda dengan peningkatan Treble & Bass! 🎵",
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
      // Buttons for toggling the filter
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Enable 🔊")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable ❌")
          .setStyle(ButtonStyle.Danger)
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🎶 **Filter Audio - Treble & Bass**")
        .setDescription(
          "🔊 **Tingkatkan kualitas musik Anda!** Klik **Aktifkan** untuk suara yang lebih kuat.\n💥 **Meningkatkan kedalaman bass dan kejelasan treble untuk pengalaman mendengarkan yang imersif!**"
        )
        .setColor("#FFA500")
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
        time: 20000, // Expires in 20 sec
      });

      collector.on("collect", async (i) => {
        if (i.customId === "on") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: [
              { band: 0, gain: 0.6 },
              { band: 1, gain: 0.67 },
              { band: 2, gain: 0.67 },
              { band: 3, gain: 0 },
              { band: 4, gain: -0.5 },
              { band: 5, gain: 0.15 },
              { band: 6, gain: -0.45 },
              { band: 7, gain: 0.23 },
              { band: 8, gain: 0.35 },
              { band: 9, gain: 0.45 },
              { band: 10, gain: 0.55 },
              { band: 11, gain: 0.6 },
              { band: 12, gain: 0.55 },
              { band: 13, gain: 0 },
            ],
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "🔊 **Treble & Bass Ditingkatkan!** Nikmati suara yang lebih kaya! 🎵"
            )
            .setColor("#00FF00");

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: Array(14).fill({ band: 0, gain: 0 }), // Reset
          };

          player.send(data);
          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Filter Dinonaktifkan!** Kembali ke audio normal. 🎶")
            .setColor("#FF0000");

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
          "⚠️ | **Terjadi kesalahan saat menerapkan filter Treble & Bass!**",
      });
    }
  },
};
