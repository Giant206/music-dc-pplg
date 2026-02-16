import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "invite",
  aliases: ["add", "inv"],
  category: "Utility",
  permission: "",
  desc: "🔗 Dapatkan tautan undangan",
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

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=37088600&scope=bot%20applications.commands`;
    const supportLink = "https://wa.me/6285171648088/";
    const voteLink = "https://top.gg/bot";

    const inviteEmbed = new EmbedBuilder()
      .setColor("#000000") // Discord Blurple Color
      .setTitle("🔗 Undangan ke Server Anda!")
      .setDescription(
        `Hai **${message.author.username}**! 👋\n\n` +
        `Klik tombol di bawah ini untuk mengundang saya ke server Anda dan nikmati pengalaman musik terbaik! 🚀\n\n` +
        `🌟 **Tautan Lainnya:**\n` +
        `> 🛠️ **[Server Dukungan](${supportLink})** - Dapatkan bantuan & pembaruan!\n` +
        `> ⭐ **[Beri Vote](${voteLink})** - Tunjukkan dukungan Anda!`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `Powered by TheExtremez 🎵`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("🚀 Invite Me")
        .setURL(inviteLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("🛠️ Support Server")
        .setURL(supportLink),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("⭐ Vote")
        .setURL(voteLink)
    );

    return message.channel.send({
      embeds: [inviteEmbed],
      components: [buttons],
    });
  },
};
