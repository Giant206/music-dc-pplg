import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "vote",
  category: "Utility",
  permission: "",
  desc: "🗳 Vote & Support kita cuyy!",
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
    const embed = new EmbedBuilder()
      .setColor("#FFD700") // Gold color for premium look
      .setTitle("🌟 Dukung Kami dengan Memberikan Suara Anda! 🌟")
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(
        `Hai **${message.author.username}**! 👋\n\n` +
        "Jika Anda menikmati fitur dan kinerja bot kami, pertimbangkan untuk memberikan suara Anda! 🗳️\n\n" +
        "Dengan memberikan suara, Anda membantu kami mendapatkan lebih banyak eksposur dan terus meningkatkan layanan kami. 🚀\n\n" +
        "Terima kasih atas dukungan Anda! 🙏"
      )
      .setFooter({
        text: `Diminta oleh ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(5) // Link button
        .setLabel("🔗 Vote Now (Belum ada)")
        .setURL("-"),

      new ButtonBuilder()
        .setStyle(5)
        .setLabel("🔎 Check Vote Status (Belum ada)")
        .setURL("-")
    );

    await message.reply({ embeds: [embed], components: [buttons] });
  },
};
