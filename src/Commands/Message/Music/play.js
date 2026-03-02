import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import UserProfile from "../../../Models/UserProfile.js";

export default {
  name: "play",
  aliases: ["p"],
  category: "Music",
  permission: "",
  desc: "🎶 Mulailah memainkan lagu-lagu favoritmu!",

  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: { playing: false, active: false },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, args, ServerData }) => {

    const prefix = ServerData.prefix || client.settings.PREFIX;

    const query = args.join(" ");

    if (!query) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `❌ Anda tidak memberikan lagu!\nGunakan \`${prefix}play <song/url>\``
            ),
        ],
      });
    }

    const { channel } = message.member.voice;

    let player = await client.kazagumo.createPlayer({
      guildId: message.guild.id,
      textId: message.channel.id,
      voiceId: channel.id,
      deaf: true,
    });

    try {
      const loadingMsg = await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("🔍 Mencari lagu Anda..."),
        ],
      });

      const result = await client.kazagumo.search(query, {
        requester: message.author,
      });

      if (!result || !result.tracks.length) {
        return loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ Tidak ada hasil ditemukan!"),
          ],
        });
      }

      if (result.type === "PLAYLIST") {

        for (const track of result.tracks)
          player.queue.add(track);

        if (!player.playing) player.play();

        const playlistName =
          result.playlist?.name || "Playlist";

        const playlistUrl =
          result.playlist?.uri || result.tracks[0].uri;

        return loadingMsg.edit({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setDescription(
                `📂 Playlist ditambahkan!\n` +
                `**${playlistName}**\n` +
                `Jumlah lagu: **${result.tracks.length}**`
              ),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Buka Playlist")
                .setURL(playlistUrl)
                .setStyle(ButtonStyle.Link)
            ),
          ],
        });
      }

      const track = result.tracks[0];
      player.queue.add(track);

      if (!player.playing && !player.paused)
        player.play();

      // Track user play data
      await trackUserPlay(message, track);

      return loadingMsg.edit({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(
              `🎵 Ditambahkan:\n[${track.title}](${track.uri})\n` +
              `👤 ${track.author}`
            ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("🎧 Dengarkan")
              .setURL(track.uri)
              .setStyle(ButtonStyle.Link)
          ),
        ],
      });

    } catch (err) {
      console.error(err);

      message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ Terjadi error saat memutar lagu"),
        ],
      });
    }
  },
};

// Function to track user plays
async function trackUserPlay(message, track) {
  try {
    const userID = message.author.id;
    const guildID = message.guild.id;
    const guildName = message.guild.name;

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userID });
    if (!userProfile) {
      userProfile = new UserProfile({ userID });
    }

    // Update total stats
    userProfile.totalSongsPlayed += 1;
    userProfile.lastPlay = new Date();

    // Update top songs
    const existingSongIndex = userProfile.topSongs.findIndex(
      (s) => s.uri === track.uri
    );
    if (existingSongIndex !== -1) {
      userProfile.topSongs[existingSongIndex].playCount += 1;
      userProfile.topSongs[existingSongIndex].lastPlayed = new Date();
    } else {
      userProfile.topSongs.push({
        title: track.title,
        artist: track.author,
        uri: track.uri,
        playCount: 1,
        lastPlayed: new Date(),
      });
    }

    // Keep only top 10 songs (sorted by playCount)
    userProfile.topSongs.sort((a, b) => b.playCount - a.playCount);
    if (userProfile.topSongs.length > 10) {
      userProfile.topSongs = userProfile.topSongs.slice(0, 10);
    }

    // Update top servers
    const existingServerIndex = userProfile.topServers.findIndex(
      (s) => s.serverID === guildID
    );
    if (existingServerIndex !== -1) {
      userProfile.topServers[existingServerIndex].playCount += 1;
    } else {
      userProfile.topServers.push({
        serverID: guildID,
        serverName: guildName,
        playCount: 1,
      });
    }

    // Keep only top 5 servers
    userProfile.topServers.sort((a, b) => b.playCount - a.playCount);
    if (userProfile.topServers.length > 5) {
      userProfile.topServers = userProfile.topServers.slice(0, 5);
    }

    // Track friends (other users in the same voice channel)
    const voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
      const membersInVC = voiceChannel.members.filter(
        (member) => member.id !== message.author.id && !member.user.bot
      );
      
      for (const [friendID, member] of membersInVC) {
        // Update user's topFriends - people they listened with
        const existingFriendIndex = userProfile.topFriends.findIndex(
          (f) => f.friendID === friendID
        );
        if (existingFriendIndex !== -1) {
          userProfile.topFriends[existingFriendIndex].listenCount += 1;
        } else {
          userProfile.topFriends.push({
            friendID: friendID,
            friendName: member.user.username,
            listenCount: 1,
          });
        }

        // Keep only top 10 friends
        userProfile.topFriends.sort((a, b) => b.listenCount - a.listenCount);
        if (userProfile.topFriends.length > 10) {
          userProfile.topFriends = userProfile.topFriends.slice(0, 10);
        }

        // Also update the friend's profile to track this user as a friend
        let friendProfile = await UserProfile.findOne({ userID: friendID });
        if (!friendProfile) {
          friendProfile = new UserProfile({ userID: friendID });
        }

        const friendExistingIndex = friendProfile.topFriends.findIndex(
          (f) => f.friendID === userID
        );
        if (friendExistingIndex !== -1) {
          friendProfile.topFriends[friendExistingIndex].listenCount += 1;
        } else {
          friendProfile.topFriends.push({
            friendID: userID,
            friendName: message.author.username,
            listenCount: 1,
          });
        }

        friendProfile.topFriends.sort((a, b) => b.listenCount - a.listenCount);
        if (friendProfile.topFriends.length > 10) {
          friendProfile.topFriends = friendProfile.topFriends.slice(0, 10);
        }

        await friendProfile.save();
      }
    }

    await userProfile.save();
  } catch (error) {
    console.error("Error tracking user play:", error);
  }
}
