import { ActivityType } from "discord.js";
import chalk from "chalk";
import reconnectAuto from "../../Models/reconnect.js";

/**
 * @param {import("../Struct/Client")} client
 */
export default async (client) => {
  try {
    console.log(chalk.blue.bold("\n🚀 Gian Sigma SKibidi On TOP!!\n"));

    // Ini biarin aja, buat ngecek total server, channels, dan users di logs saat bot ready
    const [totalGuilds, totalChannels, totalUsers] = await Promise.all([
      client.cluster.broadcastEval((c) => c.guilds.cache.size),
      client.cluster.broadcastEval((c) => c.channels.cache.size),
      client.cluster.broadcastEval((c) => c.users.cache.size),
    ]);

    //  Total Jumlah Server, Channels, dan Users
    const totalServers = totalGuilds.reduce((acc, val) => acc + val, 0);
    const totalChannelsCount = totalChannels.reduce((acc, val) => acc + val, 0);
    const totalUsersCount = totalUsers.reduce((acc, val) => acc + val, 0);

    console.log(chalk.green.bold("📡 Terhubung ke Discord!"));
    console.log(
      chalk.yellow(`🌍 Jumlah Server: ${chalk.white.bold(totalServers)}`)
    );
    console.log(
      chalk.magenta(
        `📢 Total Channels: ${chalk.white.bold(totalChannelsCount)}`
      )
    );
    console.log(
      chalk.cyan(`👥 Total Users: ${chalk.white.bold(totalUsersCount)}`)
    );
    console.log(chalk.green.bold(`✅ ${client.user.tag} is Ready! 🚀`));

    // 🎵 Otomatis Reconnect (jangan di ubah)
    const maindata = await reconnectAuto.find();
    console.log(
      chalk.blue.bold(
        `🔄 Sambungkan Kembali Otomatis: ${chalk.white.bold(
          maindata.length
        )} Antrian ditemukan.`
      )
    );

    for (const [index, data] of maindata.entries()) {
      setTimeout(async () => {
        const textChannel = client.channels.cache.get(data.TextId);
        const guild = client.guilds.cache.get(data.GuildId);
        const voiceChannel = client.channels.cache.get(data.VoiceId);

        if (!guild || !textChannel || !voiceChannel) {
          console.log(
            chalk.red(
              `❌ Penyambungan ulang otomatis gagal: Guild/Teks/Suara hilang untuk antrean #${
                index + 1
              }`
            )
          );
          return;
        }

        try {
          await client.kazagumo.createPlayer({
            guildId: guild.id,
            textId: textChannel.id,
            voiceId: voiceChannel.id,
            deaf: true,
            shardId: guild.shardId,
          });

          console.log(
            chalk.green(
              `✅ User Terhubung Kembali di: ${guild.name} [#${index + 1}]`
            )
          );
        } catch (error) {
          console.error(
            chalk.red(
              `❌ Gagal membuat user di ${guild.name}: ${error.message}`
            )
          );
        }
      }, index * 5000);
    }

    console.log(
      chalk.green.bold(
        `🎧 Berhasil terhubung kembali ke ${maindata.length} guild!`
      )
    );
    console.log(
      chalk.green.bold(`🌟 Cluster #${client.cluster.id} sepenuhnya stabil! 🚀\n`)
    );

    // 🎭 Dynamic Status Rotation
    const statuses = [
      { name: "🎶 Music & Project", type: ActivityType.Listening },
      { name: "🔥 GianMasbro", type: ActivityType.Playing },
      { name: "💥 PPLGBot", type: ActivityType.Playing },
      { name: "💡 p!help | Butuh Bantuan?", type: ActivityType.Listening },
    ];

    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      client.user.setActivity(status.name, {
        type: status.type,
        url: status.url,
      });
      client.user.setPresence({
        status: "online", // Options: "idle", "dnd", "online"
      });

      // console.log(
      //   chalk.cyan(
      //     `🎭 Status Updated: ${chalk.white.bold(status.name)} (${chalk.yellow(
      //       status.type
      //     )})`
      //   )
      // );
    }, 10000); // Updates every 10 seconds
  } catch (error) {
    console.error(
      chalk.red.bold("❌ Terjadi kesalahan pada event ready:"),
      error
    );
  }
};
