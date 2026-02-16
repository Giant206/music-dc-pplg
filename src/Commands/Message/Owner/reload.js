import { EmbedBuilder } from "discord.js";

export default {
  name: "reload",
  aliases: ["rr"],
  category: "Owner",
  desc: "🔄 Memuat ulang perintah!",
  options: {
    owner: true,
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
    const cmd = args.length > 0 ? args[0].toLowerCase() : null;

    if (!cmd) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Nama Perintah Tidak Dimasukkan")
            .setDescription(
              "Silakan berikan **nama perintah** yang ingin dimuat ulang!"
            ),
        ],
      });
    }

    const command =
      client.messageCommands.get(cmd) ||
      client.messageCommands.find(
        (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
      );

    if (!command) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FFA500")
            .setTitle("⚠️ Perintah Tidak Ditemukan")
            .setDescription(
              `Tidak ada perintah atau alias bernama **\`${cmd}\`**!`
            ),
        ],
      });
    }

    try {
      delete require.cache[
        require.resolve(`../${command.category}/${command.name}.js`)
      ];

      const newCommand = (
        await import(`../${command.category}/${command.name}.js`)
      ).default;
      client.messageCommands.set(newCommand.name, newCommand);

      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#00FF00")
            .setTitle("✅ Perintah Dimuat Ulang")
            .setDescription(
              `🔄 Berhasil memuat ulang perintah **\`${newCommand.name}\`**!`
            ),
        ],
      });
    } catch (error) {
      console.error(error);
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF0000")
            .setTitle("❌ Gagal Memuat Ulang Perintah")
            .setDescription(
              `Terjadi **kesalahan** saat memuat ulang perintah \`${command.name}\`:\n\`\`\`js\n${error.message}\n\`\`\``
            ),
        ],
      });
    }
  },
};
