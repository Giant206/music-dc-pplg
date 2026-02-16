import { EmbedBuilder } from "discord.js";
import SpotiPro from "spoti-pro";

const clientId = "e6f84fbec2b44a77bf35a20c5ffa54b8";
const clientSecret = "498f461b962443cfaf9539c610e2ea81";
const spoti = new SpotiPro(clientId, clientSecret);
const limit = 5;
const country = "IN";

// Regex untuk deteksi URL Spotify
const SPOTIFY_URL_REGEX = /^https?:\/\/(?:open\.spotify\.com\/)(.+)$/;

export default {
  name: "spotify",
  aliases: ["sp"],
  category: "Music",
  permission: "",
  desc: "🎵 Putar lagu dari Spotify!",
  options: {
    owner: false,
    inVc: true,
    sameVc: false,
    player: {
      playing: false,
      active: false,
    },
    premium: false,
    vote: false,
  },

  /**
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], ServerData: any, Color: any }}
   */
  run: async ({ client, message, args, ServerData, Color }) => {
    try {
      const prefix = ServerData.prefix;
      const query = args.join(" ");

      if (!query) {
        return message
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor("#FF0000")
                .setDescription(
                  `❌ **Penggunaan:** \`${prefix}spotify <nama lagu/url>\``
                ),
            ],
          })
          .then((msg) => setTimeout(() => msg.delete(), 15000));
      }

      const { channel } = message.member.voice;
      let player = await client.kazagumo.createPlayer({
        guildId: message.guild.id,
        textId: message.channel.id,
        voiceId: channel.id,
        deaf: true,
      });

      // Cek apakah input adalah URL YouTube → konversi ke Spotify
      const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi.test(query);
      const isSpotifyUrl = SPOTIFY_URL_REGEX.test(query);

      let spotifyQuery = query;

      if (isYouTubeUrl) {
        const msg = await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setDescription(`🔄 **Mengonversi YouTube ke Spotify...**`),
          ],
        });

        const youtubeResult = await client.kazagumo.search(query, {
          requester: message.author,
        });
        if (!youtubeResult.tracks.length) {
          await msg.delete().catch(() => {});
          return message.reply("❌ **Tidak ada lagu ditemukan di YouTube!**");
        }

        const trackName = youtubeResult.tracks[0].title;
        const spotifyResults = await spoti.searchSpotify(trackName, limit, country);
        if (!spotifyResults.length) {
          await msg.delete().catch(() => {});
          return message.reply("❌ **Tidak ditemukan di Spotify!**");
        }
        spotifyQuery = spotifyResults[0]; 
        await msg.delete().catch(() => {});
      }

      if (isSpotifyUrl) {
        spotifyQuery = query; 
      }

      const result = await client.kazagumo.search(spotifyQuery, {
        requester: message.author,
      });

      if (!result.tracks.length) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **Tidak ada lagu yang dapat diputar dari Spotify!**"),
          ],
        });
      }

      if (result.type === "PLAYLIST") {
        for (let track of result.tracks) player.queue.add(track);
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `📜 **Menambahkan \`${result.tracks.length}\` lagu dari playlist:**\n🎶 **[${result.playlist.name}](${result.playlist.url})**`
              ),
          ],
        });
      } else {
        player.queue.add(result.tracks[0]);
        await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(Color)
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `🎧 **Ditambahkan ke antrian:**\n[${result.tracks[0].title}](${result.tracks[0].uri})\n👤 **Oleh:** ${result.tracks[0].author}`
              ),
          ],
        });
      }

      if (!player.playing && !player.paused) {
        player.play();
      }
    } catch (error) {
      console.error("[SPOTIFY ERROR]", error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("❌ **Gagal memproses permintaan Spotify!**"),
        ],
      });
    }
  },
};