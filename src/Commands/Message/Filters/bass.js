import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "bass",
  category: "Filters",
  permission: "",
  desc: "Tingkatkan bass untuk pengalaman suara yang lebih mendalam!",
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
          .setLabel("Aktifkan Bass")
          .setStyle(ButtonStyle.Success)
          .setEmoji("🎚️"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Mengatur ulang Bass")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("❌")
      );

      const embed = new EmbedBuilder()
        .setTitle("🔊 **Filter Audio - Bass Boost**")
        .setDescription(
          "🔥 **Tingkatkan bass Anda untuk suara yang dalam dan bertenaga!**\n\n🎵 Gunakan filter ini untuk meningkatkan frekuensi rendah dan membuat musik Anda terasa lebih keras."
        )
        .setColor(client.settings.COLOR)
        .setThumbnail(
          "https://cdn.discordapp.com/emojis/1176868443207774309.png"
        )
        .setFooter({
          text: "Klik tombol untuk mengaktifkan/menonaktifkan Bass Boost!",
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
            equalizer: [
              { band: 0, gain: 0.3 },
              { band: 1, gain: 0.25 },
              { band: 2, gain: 0.2 },
              { band: 3, gain: 0.15 },
              { band: 4, gain: 0.1 },
              { band: 5, gain: 0 },
              { band: 6, gain: -0.1 },
              { band: 7, gain: -0.15 },
              { band: 8, gain: -0.2 },
              { band: 9, gain: -0.25 },
              { band: 10, gain: -0.3 },
              { band: 11, gain: -0.35 },
              { band: 12, gain: -0.4 },
              { band: 13, gain: -0.45 },
            ],
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "✅ **Bass Boost Diaktifkan!** Nikmati suara yang dalam dan bertenaga. 🎶"
            )
            .setColor(client.settings.SUCCESS_COLOR);

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            equalizer: Array(14).fill({ band: 0, gain: 0 }), // Resets all bands
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Bass Boost Diatur Ulang!** Kembali ke suara normal. 🔄")
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
          "⚠️ **Terjadi kesalahan saat mengaktifkan/menonaktifkan filter Bass.**"
        )
        .setColor(client.settings.ERROR_COLOR);
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
