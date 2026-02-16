import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "shuffle",
  aliases: ["mix"],
  category: "Music",
  permission: "",
  desc: "🔀 Shuffle antrian saat ini!",
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
  run: async ({ client, message }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setAuthor({
                name: "❌ Tidak Ada Pemutar Aktif Ditemukan!",
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription("Tidak ada pemutar aktif di server ini."),
          ],
        });
      }

      if (player.queue.length < 3) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Tidak cukup lagu dalam antrian untuk diacak!**\n🔢 *Minimal 3 lagu diperlukan.*"
              ),
          ],
        });
      }

      player.queue.shuffle();

      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription(
          "🎶 **Antrian telah diacak!** 🔀\nNikmati campuran baru dari lagu-lagu Anda!"
        );

      const shuffleButton = new ButtonBuilder()
        .setCustomId("reshuffle")
        .setLabel("🔁 Acak Lagi")
        .setStyle(1);

      const row = new ActionRowBuilder().addComponents(shuffleButton);

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
        if (i.customId === "reshuffle") {
          player.queue.shuffle();
          await i.update({
            embeds: [
              embed.setDescription(
                "🔁 **Antrian telah diacak ulang!** Nikmati urutan baru!"
              ),
            ],
          });
        }
      });

      collector.on("end", async () => {
        msg.edit({ components: [] }).catch(() => {});
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **Terjadi kesalahan saat mengacak antrian!**"
            ),
        ],
      });
    }
  },
};
