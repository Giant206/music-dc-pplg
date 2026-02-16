import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} from "discord.js";

export default {
  name: "prefix",
  aliases: ["pfx"],
  category: "Utility",
  permission: "ManageGuild",
  desc: "🔧 Tetapkan prefix untuk server Anda!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, ServerData: any, args: string[] }}
   */
  run: async ({ client, message, ServerData, args }) => {
    // Check if the user has ManageGuild permission
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🚫 Izin Tidak Cukup!")
            .setDescription(
              "Anda perlu izin **Kelola Server** untuk mengubah prefix."
            ),
        ],
      });
    }

    // Display Current Prefix if No Args
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🔧 Server Prefix")
            .setDescription(
              `📌 **Current Prefix:** \`${ServerData.prefix}\`\n\n` +
                "🛠️ **Untuk Mengubah Prefix:**\n" +
                "➤ Gunakan `prefix set <new_prefix>` untuk mengubah.\n" +
                "➤ Gunakan `prefix reset` untuk mengembalikan ke default."
            )
            .setFooter({
              text: "Prefix System",
              iconURL: client.user.displayAvatarURL(),
            }),
        ],
      });
    }

    const subCommand = args[0].toLowerCase();

    // Setting a New Prefix
    if (subCommand === "set") {
      let newPrefix = args.slice(1).join(" ");

      if (!newPrefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FFA500")
              .setTitle("❌ Input Tidak Valid")
              .setDescription(
                "Silakan berikan prefix baru. Contoh: `prefix set !`"
              ),
          ],
        });
      }

      if (newPrefix.length > 5) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF4500")
              .setTitle("⚠️ Prefix Terlalu Panjang")
              .setDescription("Prefix **harus 5 karakter atau kurang**."),
          ],
        });
      }

      if (ServerData.prefix === newPrefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#00BFFF")
              .setTitle("✅ Prefix Tidak Berubah")
              .setDescription(
                `\`${newPrefix}\` sudah menjadi prefix server.`
              ),
          ],
        });
      }

      ServerData.prefix = newPrefix;
      await ServerData.save();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF7F")
            .setTitle("✅ Prefix Updated!")
            .setDescription(`🎉 Prefix baru: \`${newPrefix}\``),
        ],
      });
    }

    // reset prefix di default
    if (subCommand === "reset") {
      if (ServerData.prefix === client.settings.prefix) {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF69B4")
              .setTitle("ℹ️ Tidak Ada Prefix Kustom")
              .setDescription("Tidak ada prefix kustom yang diatur untuk server ini."),
          ],
        });
      }

      ServerData.prefix = client.settings.prefix;
      await ServerData.save();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("#32CD32")
            .setTitle("🔄 Prefix Reset")
            .setDescription(
              `🔁 Prefix telah direset ke: \`${client.settings.prefix}\``
            ),
        ],
      });
    }

    // Invalid Command Handling
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("#DC143C")
          .setTitle("❌ Subcommand Tidak Valid")
          .setDescription("Opsi yang valid: `set`, `reset`"),
      ],
    });
  },
};
