import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "support",
  aliases: ["support", "helpserver"],
  category: "Utility",
  permission: "",
  desc: "🔗 Dapatkan tautan undangan untuk Server Dukungan!",
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

  run: async ({ message }) => {
    const inviteLink = "https://wa.me/6285171648088/";

    const embed = new EmbedBuilder()
      .setTitle("🌟 Butuh Bantuan? Bergabunglah dengan Server Dukungan Kami!")
      .setDescription(
        "👋 **Hai!** Butuh bantuan, punya pertanyaan, atau ingin bermain bersama komunitas?\n\n" +
          "🔗 Klik tombol di bawah untuk bergabung dengan **Server Dukungan** kami!"
      )
      .setColor("#5865F2")
      .setThumbnail("https://cdn.pfps.gg/pfps/7802-egirl-2.png")
      .setFooter({
        text: "Kami siap membantu!",
        iconURL: message.author.displayAvatarURL(),
      });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("💬 Join server nya")
        .setURL(inviteLink)
        .setStyle("Link")
    );

    return message.reply({ embeds: [embed], components: [button] });
  },
};
