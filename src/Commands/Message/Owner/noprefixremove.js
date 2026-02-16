import { EmbedBuilder } from "discord.js";

const prime = ["1299394763933618239"]; // Authorized Users

export default {
  name: "noprefixremove",
  aliases: ["npremov"],
  category: "Owner",
  permission: "Administrator",
  desc: "❌ Menghapus pengguna dari daftar Tanpa Awalan.!",
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
   * @param {{ client: import("../../../Struct/Client"), message: import("discord.js").Message, args: string[] }}
   */
  run: async ({ client, message, args }) => {
    if (!prime.includes(message.author.id)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("🚫 Akses Ditolak")
            .setDescription(
              "Anda **tidak** memiliki izin untuk menggunakan perintah ini!"
            ),
        ],
      });
    }

    if (!args[0]) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Argumen Tidak Lengkap")
            .setDescription("Silakan berikan **User ID** yang valid!"),
        ],
      });
    }

    const userId = args[0];
    let user;

    try {
      user = await client.users.fetch(userId);
    } catch (error) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ User ID tidak valid")
            .setDescription(
              "ID yang diberikan **tidak** cocok dengan pengguna Discord mana pun."
            ),
        ],
      });
    }

    const exists = await client.db.get(`noprefix_${userId}`);

    if (!exists) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("⚠️ Tidak Ditemukan")
            .setDescription(
              `🔹 <@${userId}> **tidak** ada di daftar Tanpa Awalan!`
            ),
        ],
      });
    }

    await client.db.delete(`noprefix_${userId}`);

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#00FF00")
          .setTitle("✅ Berhasil Dihapus")
          .setDescription(
            `🔹 <@${userId}> telah **dihapus** dari daftar Tanpa Awalan!`
          ),
      ],
    });
  },
};
