import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import UserProfile from "../../../Models/UserProfile.js";

export default {
  name: "profile",
  aliases: ["profil", "myprofile"],
  category: "Utility",
  desc: "👤 Lihat statistik musik personalmu!",
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

  run: async ({ client, message, args }) => {
    // Get mentioned user or use the message author
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!user) {
      user = message.author;
    }

    const targetUser = user;
    const userID = targetUser.id;

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userID });
    
    if (!userProfile || userProfile.totalSongsPlayed === 0) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#000000")
            .setAuthor({
              name: `👤 Profil Musik ${targetUser.username}`,
              iconURL: targetUser.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
            .setDescription(
              `❌ **${targetUser.username}** belum pernah memutar lagu apapun!\n\n` +
              `🎵 **Cara Menggunakan:**\n` +
              `• Gunakan \`${client.settings.PREFIX}play <lagu>\` untuk memutar musik\n` +
              `• Dengarkan bersama teman di voice channel yang sama\n` +
              `• Gunakan \`${client.settings.PREFIX}profile\` untuk melihat statistik\n\n` +
              `📊 Statistik akan muncul setelah kamu memutar lagu!`
            )
            .setFooter({
              text: `Diminta oleh ${message.author.username}`,
              iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
        ]
      });
    }

    // Create buttons for different profile sections
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("profile_overview")
          .setLabel("📊 Overview")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("profile_songs")
          .setLabel("🎵 Top Lagu")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("profile_friends")
          .setLabel("👥 Top Teman")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(false),
        new ButtonBuilder()
          .setCustomId("profile_servers")
          .setLabel("🏠 Top Server")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(false)
      );

    // Format time ago function
    const formatTimeAgo = (date) => {
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 1) return "Baru saja";
      if (minutes < 60) return `${minutes}m lalu`;
      if (hours < 24) return `${hours}j lalu`;
      if (days === 1) return "Kemarin";
      if (days < 7) return `${days} hari lalu`;
      if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
      return `${Math.floor(days / 30)} bulan lalu`;
    };

    // Format date for display
    const formatDate = (date) => {
      return `<t:${Math.floor(new Date(date).getTime() / 1000)}:d>`;
    };

    // Overview Embed with improved styling
    const overviewEmbed = new EmbedBuilder()
      .setAuthor({
        name: `📊 Profil Musik ${targetUser.username}`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true })
      })
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setColor("#000000")
      .setDescription(
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `                    📈 **STATISTIK UMUM**\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🎵 **Total Lagu Diputar:** \`${userProfile.totalSongsPlayed}\` lagu\n` +
        `⏰ **Pertama Kali:** ${formatDate(userProfile.firstPlay)}\n` +
        `🕐 **Terakhir Memutar:** ${formatTimeAgo(userProfile.lastPlay)}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `                    🔥 **FAVORIT**\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `🎤 **Lagu Favorite:**\n` +
        `   ${userProfile.topSongs[0] ? `\`${userProfile.topSongs[0].title}\` (${userProfile.topSongs[0].playCount}x)` : "Belum ada"}\n\n` +
        `👥 **Teman Terdekat:**\n` +
        `   ${userProfile.topFriends[0] ? `**${userProfile.topFriends[0].friendName}** (${userProfile.topFriends[0].listenCount}x)` : "Belum ada"}\n\n` +
        `🏠 **Server Favorite:**\n` +
        `   ${userProfile.topServers[0] ? `**${userProfile.topServers[0].serverName}** (${userProfile.topServers[0].playCount}x)` : "Belum ada"}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      )
      .setFooter({
        text: `✨ Profil musik dari ${targetUser.username} • ${message.author.username} meminta`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true })
      });

    const msg = await message.reply({
      embeds: [overviewEmbed],
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferUpdate();

      if (interaction.customId === "profile_overview") {
        await msg.edit({ embeds: [overviewEmbed], components: [getUpdatedRow(row, "profile_overview")] });
      } 
      else if (interaction.customId === "profile_songs") {
        const songsList = userProfile.topSongs.length > 0 
          ? userProfile.topSongs.map((song, index) => {
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔹";
              return `${medal} **#${index + 1}** \`${song.title}\`\n` +
                     `    👤 Artis: ${song.artist}\n` +
                     `    🎮 Dimainkan: ${song.playCount}x • 🕐 ${formatTimeAgo(song.lastPlayed)}`;
            }).join("\n\n")
          : "Belum ada lagu yang dimainkan.";
        
        const songsEmbed = new EmbedBuilder()
          .setAuthor({
            name: `🎵 Top Lagu ${targetUser.username}`,
            iconURL: targetUser.displayAvatarURL({ dynamic: true })
          })
          .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
          .setColor("#000000")
          .setDescription(
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `              🎧 **TOP LAGU PALING BANYAK DIPUTAR**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            songsList +
            `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          )
          .setFooter({
            text: `Total: ${userProfile.totalSongsPlayed} lagu diputar`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          });
        
        await msg.edit({ embeds: [songsEmbed], components: [getUpdatedRow(row, "profile_songs")] });
      }
      else if (interaction.customId === "profile_friends") {
        const friendsList = userProfile.topFriends.length > 0
          ? userProfile.topFriends.map((friend, index) => {
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔹";
              return `${medal} **#${index + 1}** **${friend.friendName}**\n` +
                     `    🎧 Dengarkan bersama: ${friend.listenCount}x`;
            }).join("\n\n")
          : "Belum ada teman yang diajak mendengarkan.";
        
        const friendsEmbed = new EmbedBuilder()
          .setAuthor({
            name: `👥 Top Teman ${targetUser.username}`,
            iconURL: targetUser.displayAvatarURL({ dynamic: true })
          })
          .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
          .setColor("#000000")
          .setDescription(
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `              👯 **TOP TEMAN PALING SERING DENGARKAN**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            friendsList +
            `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💡 **Tips:** Dengarkan musik bersama teman di voice channel\n` +
            `    untuk menambah teman ke daftar ini!`
          )
          .setFooter({
            text: `Total teman: ${userProfile.topFriends.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          });

        await msg.edit({ embeds: [friendsEmbed], components: [getUpdatedRow(row, "profile_friends")] });
      }
      else if (interaction.customId === "profile_servers") {
        const serversList = userProfile.topServers.length > 0
          ? userProfile.topServers.map((server, index) => {
              const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🔹";
              return `${medal} **#${index + 1}** **${server.serverName}**\n` +
                     `    🎵 Dimainkan: ${server.playCount}x`;
            }).join("\n\n")
          : "Belum ada server yang digunakan.";
        
        const serversEmbed = new EmbedBuilder()
          .setAuthor({
            name: `🏠 Top Server ${targetUser.username}`,
            iconURL: targetUser.displayAvatarURL({ dynamic: true })
          })
          .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 2048 }))
          .setColor("#000000")
          .setDescription(
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `              🏛 **TOP SERVER PALING BANYAK DIGUNAKAN**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            serversList +
            `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
          )
          .setFooter({
            text: `Total server: ${userProfile.topServers.length}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          });

        await msg.edit({ embeds: [serversEmbed], components: [getUpdatedRow(row, "profile_servers")] });
      }
    });
  },
};

// Helper function to update button states
function getUpdatedRow(originalRow, activeId) {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("profile_overview")
        .setLabel("📊 Overview")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(activeId === "profile_overview"),
      new ButtonBuilder()
        .setCustomId("profile_songs")
        .setLabel("🎵 Top Lagu")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(activeId === "profile_songs"),
      new ButtonBuilder()
        .setCustomId("profile_friends")
        .setLabel("👥 Top Teman")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(activeId === "profile_friends"),
      new ButtonBuilder()
        .setCustomId("profile_servers")
        .setLabel("🏠 Top Server")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(activeId === "profile_servers")
    );
}
