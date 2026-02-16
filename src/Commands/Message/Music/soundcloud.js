import { EmbedBuilder } from "discord.js";

export default {
  name: "soundcloud",
  aliases: ["sc"],
  category: "Music",
  permission: "",
  desc: "🎵 Cari & Putar Lagu dari SoundCloud!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[], ServerData: any }}
   */
  run: async ({ client, message, args, ServerData }) => {
    try {
      const query = args.join(" ");
      if (!query) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                `❌ **Penggunaan:** \`${ServerData.prefix}soundcloud <nama lagu/url>\``
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

      let result = await client.kazagumo.search(query, {
        engine: "soundcloud",
        requester: message.author,
      });

      if (!result.tracks.length) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription("❌ **Tidak ada hasil yang ditemukan di SoundCloud!**"),
          ],
        });
      }

      if (result.type === "PLAYLIST") {
        for (let track of result.tracks) {
          player.queue.add(track);
        }
      } else {
        player.queue.add(result.tracks[0]);
      }

      if (!player.playing && !player.paused) {
        player.play();
      }

      if (result.type === "PLAYLIST") {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `📜 **Menambahkan \`${result.tracks.length}\` lagu dari playlist:**\n🎶 **${result.playlist.name}**`
              ),
          ],
        });
      } else {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.settings.COLOR)
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
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(
              "❌ **Terjadi kesalahan saat mencari di SoundCloud!**"
            ),
        ],
      });
    }
  },
};
