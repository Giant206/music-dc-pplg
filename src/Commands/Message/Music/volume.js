import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "volume",
  aliases: ["vol"],
  category: "Music",
  permission: "",
  desc: "🎛️ Atur volume pemutar dengan mudah!",
  options: {
    owner: false,
    inVc: true,
    sameVc: true,
    player: {
      playing: true,
      active: true,
    },
    premium: true,
    vote: false,
  },

  run: async ({ client, message, args, player }) => {
    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **Tidak ada pemutar aktif ditemukan!**\n💡 *Mulai memutar sesuatu terlebih dahulu!*"
            ),
        ],
      });
    }

    const safeVolume = (percent) => {
      // percent 0–200
      // 100% = 1.0, 0% = 0.5 (minimal terdengar), 200% = 2.0
      return Math.min(2.0, Math.max(0.5, 0.5 + (percent / 200)));
    };

    let currentVolume = Math.round(player.volume * 100);
    if (currentVolume < 5) currentVolume = 5;

    if (!args[0]) {
      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setTitle("🔊 Volume Control")
        .setDescription(`🎵 **Volume Saat Ini:** \`${currentVolume}%\``);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("volumedown")
          .setLabel("Vol -")
          .setStyle(2)
          .setEmoji("🔉"),
        new ButtonBuilder()
          .setCustomId("volumeup")
          .setLabel("Vol +")
          .setStyle(2)
          .setEmoji("🔊")
      );

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const collector = msg.createMessageComponentCollector({
        filter: (button) => button.user.id === message.author.id,
        time: 30000,
      });

      collector.on("collect", async (button) => {
        if (!player) return;

        if (button.customId === "volumedown")
          currentVolume = Math.max(5, currentVolume - 10);
        if (button.customId === "volumeup")
          currentVolume = Math.min(200, currentVolume + 10);

        player.setVolume(safeVolume(currentVolume));

        const newEmbed = new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("🔊 Volume Control")
          .setDescription(`🎵 **Volume Saat Ini:** \`${currentVolume}%\``);

        await button.update({ embeds: [newEmbed], components: [row] });
      });

      collector.on("end", async () => {
        const disabledRow = new ActionRowBuilder().addComponents(
          row.components.map((btn) => btn.setDisabled(true))
        );
        await msg.edit({ components: [disabledRow] });
      });

      return;
    }

    let volume = parseInt(args[0]);
    if (isNaN(volume) || volume < 1 || volume > 200) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "🚫 **Volume tidak valid!**\n💡 *Masukkan angka antara `1 - 200`*"
            ),
        ],
      });
    }

    if (volume < 5) volume = 5;
    currentVolume = volume;
    player.setVolume(safeVolume(currentVolume));

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.settings.COLOR)
          .setTitle("🔊 Volume Updated!")
          .setDescription(`🎶 **Volume Baru:** \`${currentVolume}%\``),
      ],
    });
  },
};
