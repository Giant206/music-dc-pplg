import {
  EmbedBuilder,
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
    player: { playing: false, active: false },
    premium: false,
    vote: false,
  },

  run: async ({ client, message, ServerData, args }) => {
    const defaultPrefix =
      client.settings?.PREFIX ||
      client.settings?.prefix ||
      "p!";

    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🚫 Izin Tidak Cukup!")
            .setDescription("Anda perlu izin **Kelola Server** untuk mengubah prefix."),
        ],
      });
    }

    const currentPrefix = ServerData.prefix || defaultPrefix;

    // ===== SHOW PREFIX
    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🔧 Server Prefix")
            .setDescription(
              `📌 **Current Prefix:** \`${currentPrefix}\`\n\n` +
              `➤ Gunakan \`${currentPrefix}prefix set <baru>\`\n` +
              `➤ Gunakan \`${currentPrefix}prefix reset <prefix lama>\``
            ),
        ],
      });
    }

    const sub = args[0].toLowerCase();

    if (sub === "set") {

      const newPrefix = args.slice(1).join(" ").trim();

      if (!newPrefix) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FFA500")
              .setTitle("❌ Prefix kosong")
              .setDescription("Contoh: `prefix set !`"),
          ],
        });
      }

      if (newPrefix.length > 5) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#FF4500")
              .setTitle("⚠️ Terlalu panjang")
              .setDescription("Maksimal **5 karakter**"),
          ],
        });
      }

      if (newPrefix === currentPrefix) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("#00BFFF")
              .setDescription(`Prefix sudah \`${newPrefix}\``),
          ],
        });
      }

      ServerData.prefix = newPrefix;
      await ServerData.save();

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF7F")
            .setTitle("✅ Prefix Diubah")
            .setDescription(`Prefix baru: \`${newPrefix}\``),
        ],
      });
    }

    if (sub === "reset") {

      ServerData.prefix = null;
      await ServerData.save();

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#32CD32")
            .setTitle("🔄 Prefix Reset")
            .setDescription(`Prefix kembali ke default: \`${defaultPrefix}\``),
        ],
      });
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#DC143C")
          .setTitle("❌ Subcommand Tidak Valid")
          .setDescription("Gunakan: `set` atau `reset`"),
      ],
    });
  },
};
