import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "discord.js";

export default {
  name: "grab",
  aliases: ["save"],
  category: "Music",
  permission: "",
  desc: "📥 Menyimpan lagu yang sedang diputar ke pesan pribadi Anda!",
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
    if (!player || !player.queue.current) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription("🚫 **Tidak ada lagu yang sedang diputar!**"),
        ],
      });
    }

    const track = player.queue.current;
    const trackTitle =
      track.title.length > 64 ? `${track.title.slice(0, 64)}...` : track.title;

    const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setAuthor({
        name: "📥 Lagu Disimpan!",
        iconURL: client.settings.icon,
        url: "https://wa.me/6285171648088/",
      })
      .setThumbnail(track.thumbnail)
      .setDescription(`🎵 **[${trackTitle}](${track.uri})**`)
      .addFields(
        { name: "🎤 Artist", value: `\`${track.author}\``, inline: true },
        {
          name: "▶️ Mainkan Lagi",
          value: `\`${client.settings.prefix}play ${track.uri}\``,
          inline: true,
        }
      )
      .setFooter({
        text: `🎶 Dari ${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      });

    message.member
      .send({ embeds: [embed] })
      .then(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#00FF00")
              .setDescription(
                "📭 **Cek DM-mu! Info lagunya sudah tersimpan.**"
              ),
          ],
        });
      })
      .catch(() => {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(
                "❌ **Saya tidak bisa mengirim DM-mu! Mohon aktifkan DM dan coba lagi.**"
              ),
          ],
        });
      });
  },
};
