import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "uptime",
  aliases: ["up"],
  category: "Utility",
  permission: "",
  desc: "⏳ Periksa berapa lama bot telah berjalan.!",
  options: {
    owner: false,
    inVc: false,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  run: async ({ client, message }) => {
    const uptimeInSeconds = Math.floor(client.uptime / 1000);

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("⏳ Bot Uptime")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(
        `🚀 **Bot telah berjalan selama:** <t:${Math.floor(
          Date.now() / 1000 - uptimeInSeconds
        )}:R>\n\n` +
          "💡 *Bot berjalan dengan lancar tanpa gangguan!*"
      )
      .setFooter({
        text: `Diminta oleh ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const refreshButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("refresh_uptime")
        .setLabel("🔄 Refresh")
        .setStyle(2) // Secondary button style
    );

    const msg = await message.channel.send({
      embeds: [embed],
      components: [refreshButton],
    });

    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 30000, // Button active for 30 seconds
    });

    collector.on("collect", async (i) => {
      if (i.customId === "refresh_uptime") {
        await i.deferUpdate();

        const newUptime = Math.floor(client.uptime / 1000);
        const updatedEmbed = new EmbedBuilder()
          .setColor("#5865F2")
          .setTitle("⏳ Bot Uptime")
          .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
          .setDescription(
            `🚀 **Bot telah berjalan selama:** <t:${Math.floor(
              Date.now() / 1000 - newUptime
            )}:R>\n\n` +
              "💡 *Bot berjalan dengan lancar tanpa gangguan!*"
          )
          .setFooter({
            text: `Diminta oleh ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          });

        await msg.edit({ embeds: [updatedEmbed], components: [refreshButton] });
      }
    });
  },
};
