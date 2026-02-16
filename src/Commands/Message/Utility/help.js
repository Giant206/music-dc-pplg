import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";

export default {
  name: "help",
  aliases: ["h"],
  category: "Utility",
  desc: "📜 Menampilkan semua perintah yang tersedia!",
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
    const helpEmbed = new EmbedBuilder()
      .setColor("#000000")
      .setAuthor({
        name: `${client.user.username} Pusat Bantuan 💡`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `Hai **${message.author.username}**! 👋\n\n` +
          `Aku adalah **${client.user.username}**, bot musik canggih dengan pengalaman yang mudah digunakan!\n` +
          `🎵 Musik berkualitas tinggi, 📜 filter lanjutan, dan banyak fitur lainnya!\n\n` +
          `🌟 **Fitur Utama:**\n` +
          `> 🎶 **Bot Musik Terbaik untuk Discord**\n` +
          `> ⚡ **Performa Cepat & Lancar**\n` +
          `> 🎧 **Dukungan Multi-Platform**\n\n` +
          `📌 **Navigasi:**\n` +
          `Klik tombol di bawah untuk melihat daftar perintah berdasarkan kategori!`
      )
      .addFields({
        name: "📂 Kategori",
        value:
          "🎼 **Musik**\n🎚 **Filter**\n⚙️ **Utilitas**\n🔍 **Sumber**\n\n🔗 **[Undang Saya](https://discord.com/oauth2/authorize?client_id=" +
          client.user.id +
          "&permissions=8&scope=bot%20applications.commands)** | " +
          "**[Dukungan](https://wa.me/6285171648088/)** | " +
          "**[Voting](https://top.gg/bot)**",
      })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "PPLG Bot Music 🎶",
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    // Tombol Navigasi
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("music")
        .setEmoji("🎼")
        .setLabel("Musik"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("filters")
        .setEmoji("🎚")
        .setLabel("Filter"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("utility")
        .setEmoji("⚙️")
        .setLabel("Utilitas"),
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("sources")
        .setEmoji("🔍")
        .setLabel("Sumber")
    );

    const messageResponse = await message.reply({
      embeds: [helpEmbed],
      components: [buttons],
    });

    const collector = messageResponse.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000, // 1 menit
    });

    collector.on("collect", async (interaction) => {
      const category = interaction.customId;

      const commandCategories = {
        music: {
          title: "🎼 Perintah Musik",
          commands: [
            "24/7",
            "Autoplay",
            "Clear",
            "Disconnect",
            "Grab",
            "Join",
            "Loop",
            "Lyrics",
            "Pause",
            "Play",
            "Previous",
            "Queue",
            "Remove",
            "Resume",
            "Search",
            "Seek",
            "Shuffle",
            "Skip",
            "SoundCloud",
            "Spotify",
            "Stop",
            "Volume",
          ],
        },
        filters: {
          title: "🎚 Perintah Filter",
          commands: [
            "8D",
            "Bass",
            "Bassboost",
            "Chipmunk",
            "China",
            "Dance",
            "Darth Vader",
            "Daycore",
            "DoubleTime",
            "TrebleBass",
          ],
        },
        utility: {
          title: "⚙️ Perintah Utilitas",
          commands: [
            "Invite",
            "Ping",
            "Prefix",
            "Stats",
            "Support",
            "Uptime",
            "Vote",
          ],
        },
        sources: {
          title: "🔍 Perintah Sumber",
          commands: ["Musixmatch", "Deezer", "SoundCloud", "Spotify"],
        },
      };

      const selectedCategory = commandCategories[category];
      if (!selectedCategory) return;

      const categoryEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(selectedCategory.title)
        .setDescription(`\`\`\`${selectedCategory.commands.join(", ")}\`\`\``);

      await interaction.reply({ embeds: [categoryEmbed], ephemeral: true });
    });

    collector.on("end", () => {
      messageResponse.edit({ components: [] }).catch(() => {});
    });
  },
};