import { EmbedBuilder } from "discord.js";
import axios from "axios";

const apiKey = "7c5b72c7a6be8a06413ff8025ca26207";

export default {
  name: "lyrics",
  category: "Music",
  permission: "",
  desc: "📜 Cari lirik lagu yang sedang diputar!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, player: import("kazagumo").Player }}
   */
  run: async ({ client, message, player }) => {
    try {
      if (!player || !player.queue.current) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **Tidak ada lagu yang sedang diputar saat ini!**"),
          ],
        });
      }

      const songName = player.queue.current.title || "Lagu Tidak Diketahui";
      const authorName = player.queue.current.author || "Artis Tidak Dikenal";
      const formattedSong = encodeURIComponent(songName);
      const formattedAuthor = encodeURIComponent(authorName);

      const response = await axios.get(
        `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${formattedSong}&q_artist=${formattedAuthor}&apikey=${apiKey}`
      );

      const data = response.data;

      if (!data.message.body || !data.message.body.lyrics) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(`❌ **Lirik tidak ditemukan untuk** \`${songName}\``),
          ],
        });
      }

      let lyrics = data.message.body.lyrics.lyrics_body;

      // Musixmatch truncates lyrics, so we remove extra text if it appears
      lyrics = lyrics
        .replace(/(\*\*\*\* This Lyrics is NOT for Commercial use.*)/gi, "")
        .trim();

      // If lyrics are too long, cut them
      if (lyrics.length > 2000) {
        lyrics =
          lyrics.slice(0, 1950) + "\n\n**...Lirik terlalu panjang untuk ditampilkan!**";
      }

      const embed = new EmbedBuilder()
        .setColor(client.settings.COLOR)
        .setTitle(`📜 Lirik untuk: **${songName}**`)
        .setDescription(
          `🎤 **Artist:** ${authorName}\n\n\`\`\`fix\n${lyrics}\`\`\``
        )
        .setFooter({ text: "Powered by Musixmatch Discord API 🎶" });

      await message.channel.sendTyping();
      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("⚠️ **Terjadi kesalahan saat mengambil lirik!**"),
        ],
      });
    }
  },
};
