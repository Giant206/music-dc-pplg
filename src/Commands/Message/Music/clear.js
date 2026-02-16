import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "clear",
  aliases: ["clq", "cl"],
  category: "Music",
  permission: "",
  desc: "🗑️ Mengosongkan Antrian!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try {
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **Tidak ada pemutar musik aktif ditemukan!**")
              .setColor("#FF0000"),
          ],
        });
      }

      if (!player.queue.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("🎵 **Antrian sudah kosong!**"),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("🗑️ Mengosongkan Antrian")
        .setDescription("Apakah Anda yakin ingin **mengosongkan antrian**?")
        .setColor("#FFA500")
        .setFooter({
          text: `Diminta oleh ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_clear")
          .setLabel("✅ Yes, Clear")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("cancel_clear")
          .setLabel("❌ Cancel")
          .setStyle(2)
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "confirm_clear") {
          player.queue.clear();

          const successEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription("✅ **Berhasil mengosongkan antrian!**");

          await msg.edit({ embeds: [successEmbed], components: [] });
        } else {
          await msg.edit({
            content: "❌ **Pengosongan antrian dibatalkan!**",
            embeds: [],
            components: [],
          });
        }
      });

      collector.on("end", () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (error) {
      console.error(error);
      message.channel.send({
        content: "⚠️ **An error occurred while clearing the queue!**",
      });
    }
  },
};
