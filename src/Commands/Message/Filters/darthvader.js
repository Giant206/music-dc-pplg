import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "darthvader",
  category: "Filters",
  permission: "",
  desc: "Mengaktifkan filter suara Darth Vader untuk efek suara yang dalam dan mirip Sith! ⚔️",
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
      // Buttons for toggling filter
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("on")
          .setLabel("Activate Sith Mode")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("⚔️"),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable Filter")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❌")
      );

      // Initial embed
      const embed = new EmbedBuilder()
        .setTitle("⚫ **Filter Audio - Darth Vader Mode**")
        .setDescription(
          "🔥 **Embrace the Dark Side!**\n🔊 Klik **Aktifkan Mode Sith** untuk efek suara dalam dan kuat."
        )
        .setColor("#111111")
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
              speed: 0.95,
              pitch: 0.4,
              rate: 0.85,
            },
          };
          player.send(data);

          const enabledEmbed = new EmbedBuilder()
            .setDescription(
              "⚔️ **Mode Sith Diaktifkan!** Rasakan kekuatan Sisi Gelap! 🔊"
            )
            .setColor("#FF0000");

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
              "❌ **Filter Dinonaktifkan!** Kembali ke Sisi Terang. 🌟"
            )
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
          "⚠️ | **Terjadi kesalahan saat menerapkan filter Darth Vader!**",
      });
    }
  },
};
