import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "skip",
  aliases: ["s", "next", "agla"],
  category: "Music",
  permission: "",
  desc: "⏭️ Lewati lagu yang sedang diputar!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], player: import("kazagumo").Player }}
   */
  run: async ({ client, message, args, player }) => {
    try {
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

      if (player.paused) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Tidak bisa melewatkan lagu saat lagu sedang dijeda!**\n▶️ *Lanjutkan lagu sebelum melewatkan.*"
              ),
          ],
        });
      }

      if (!args[0]) {
        const skippedTrack = player.queue.current;
        await player.skip();

        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `⏭️ **Dilewati:** [${skippedTrack.title}](${skippedTrack.uri})`
              ),
          ],
        });
      }

      const skipCount = parseInt(args[0]);
      if (isNaN(skipCount) || skipCount <= 0) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Silakan berikan jumlah lagu yang valid untuk dilewati!**"
              ),
          ],
        });
      }

      if (skipCount > player.queue.length) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "⚠️ **Antrian tidak sepanjang itu!**\n🔢 *Periksa antrian dan coba lagi.*"
              ),
          ],
        });
      }

      player.queue.remove(0, skipCount - 1);
      player.skip();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`⏭️ **Dilewati ${skipCount} lagu!**`),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **Terjadi kesalahan saat melewatkan lagu!**"
            ),
        ],
      });
    }
  },
};
