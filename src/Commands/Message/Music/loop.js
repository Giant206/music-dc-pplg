import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "loop",
  aliases: ["repeat"],
  category: "Music",
  permission: "",
  desc: "🔄 Aktifkan atau nonaktifkan mode loop untuk trek atau antrean!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player, args: string[] }}
   */
  run: async ({ client, message, args }) => {
    try {
      const player = client.kazagumo.players.get(message.guild.id);
      if (!player) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **Tidak ada loop aktif ditemukan di server ini!**"),
          ],
        });
      }

      const loopModes = {
        track: "track",
        t: "track",
        song: "track",
        current: "track",
        queue: "queue",
        q: "queue",
        full: "queue",
        off: "none",
        disable: "none",
        false: "none",
        none: "none",
      };

      if (args[0]) {
        const loopType = loopModes[args[0].toLowerCase()];
        if (!loopType) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(
                  "⚠️ **Opsi loop tidak valid!**\n✅ **Opsi yang valid:** `track`, `queue`, `off`"
                ),
            ],
          });
        }

        await player.setLoop(loopType);
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                loopType === "none"
                  ? "🚫 **Pengulangan telah dinonaktifkan!**"
                  : `🔁 **Sekarang mengulang trek** \`${loopType}\`!`
              ),
          ],
        });
      }

      // Interactive buttons for loop selection
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setDescription("🎶 **Pilih mode pengulangan di bawah ini:**");

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("track")
          .setLabel("Track 🔂")
          .setStyle(client.Buttons.grey),
        new ButtonBuilder()
          .setCustomId("queue")
          .setLabel("Queue 🔁")
          .setStyle(client.Buttons.grey),
        new ButtonBuilder()
          .setCustomId("off")
          .setLabel("Disable 🚫")
          .setStyle(client.Buttons.grey)
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [buttons],
      });

      const filter = (i) => i.user.id === message.author.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 15000,
      });

      collector.on("collect", async (i) => {
        const selectedLoop = i.customId;
        await player.setLoop(selectedLoop === "off" ? "none" : selectedLoop);
        embed.setDescription(
          selectedLoop === "off"
            ? "🚫 **Pengulangan telah dinonaktifkan!**"
            : `🔁 **Sekarang mengulang trek** \`${selectedLoop}\`!`
        );
        i.update({ embeds: [embed], components: [] });
      });

      collector.on("end", (collected) => {
        if (collected.size === 0) {
          embed.setDescription("⏳ **Pemilihan pengulangan telah kedaluwarsa!**");
          msg.edit({ embeds: [embed], components: [] });
        }
      });
    } catch (err) {
      console.error(err);
      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "⚠️ **Terjadi kesalahan saat mengaktifkan/menonaktifkan mode pengulangan!**"
            ),
        ],
      });
    }
  },
};
