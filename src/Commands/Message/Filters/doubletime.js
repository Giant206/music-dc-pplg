import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "doubletime",
  aliases: ["double"],
  category: "Filters",
  permission: "",
  desc: "Mengaktifkan filter Double Time untuk mempercepat musik Anda! 🚀",
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
          .setLabel("Enable Speed 🚀")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable ❌")
          .setStyle(ButtonStyle.Danger)
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("🎶 **Filter Audio - Double Time Mode**")
        .setDescription(
          "🚀 **Percepat kecepatan musik Anda!** Klik **Aktifkan Kecepatan** untuk mempercepat pemutaran.\n⚡ **Sangat cocok untuk musik berritme cepat dan suasana energik!**"
        )
        .setColor("#FF4500")
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
            timescale: {
              speed: 1.165, // Slightly increased speed
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "🚀 **Mode Double Time Diaktifkan!** Musik Anda sekarang lebih cepat! 🎵"
            )
            .setColor("#FF6347");

          await i.update({ embeds: [enabledEmbed], components: [] });
        } else if (i.customId === "off") {
          const data = {
            op: "filters",
            guildId: message.guild.id,
            timescale: {
              speed: 1, // Normal Speed
            },
          };
          player.send(data);

          const disabledEmbed = new EmbedBuilder()
            .setDescription("❌ **Filter Dinonaktifkan!** Kembali ke kecepatan normal. 🎵")
            .setColor("#FFFFFF");

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
          "⚠️ | **Terjadi kesalahan saat menerapkan filter Double Time!**",
      });
    }
  },
};
