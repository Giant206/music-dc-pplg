import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "disconnect",
  aliases: ["dc", "leave"],
  category: "Music",
  permission: "",
  desc: "🔌 Memutuskan koneksi bot dari voice",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: false,
      active: true,
    },
    premium: false,
    vote: false,
  },
  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setDescription("🚫 **Tidak ada pemutar musik aktif ditemukan!**")
              .setColor("#FF0000"),
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("🔌 Memutuskan Koneksi Player")
        .setDescription("Apakah Anda yakin ingin **memutuskan koneksi bot**?")
        .setColor("#FFA500")
        .setFooter({
          text: `Diminta oleh ${message.author.username}`,
          iconURL: message.author.displayAvatarURL(),
        });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("confirm_disconnect")
          .setLabel("✅ Yes, Disconnect")
          .setStyle(4),
        new ButtonBuilder()
          .setCustomId("cancel_disconnect")
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
        if (i.customId === "confirm_disconnect") {
          player.queue.clear();
          player.skip();

          const disconnectEmbed = new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription("👋 **Memutuskan koneksi...**");

          await msg.edit({ embeds: [disconnectEmbed], components: [] });

          setTimeout(() => {
            player.destroy();
            message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setColor("#FF0000")
                  .setDescription(
                    "🔌 **Bot telah terputus dari saluran suara!**"
                  ),
              ],
            });
          }, 3000);
        } else {
          await msg.edit({
            content: "❌ **Pemutusan koneksi dibatalkan!**",
            embeds: [],
            components: [],
          });
        }
      });

      collector.on("end", () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (err) {
      console.error(err);
      message.channel.send("⚠️ **Terjadi kesalahan saat memutuskan koneksi!**");
    }
  },
};
