import {
  WebhookClient,
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
} from "discord.js";

const webhookURL =
  "https://discord.com/api/webhooks/1472753031505252566/3WPad0vUiwlZrQre-YRaKlnEp_Spa6C6lAe_GBN63oEjkZXt_O0Bg-mFisSIHwC4a1K0";
const hook = new WebhookClient({ url: webhookURL });

export default async (client, guild) => {
  try {
    await client.guilds.fetch({ cache: true });

    const guildCount = await client.cluster.broadcastEval(
      (c) => c.guilds.cache.size
    );
    const channelCount = await client.cluster.broadcastEval(
      (c) => c.channels.cache.size
    );
    const userCount = await client.cluster.broadcastEval(
      (c) => c.users.cache.size
    );

    const joinedEmbed = new EmbedBuilder()
      .setColor("#FFD700") // Gold for premium feel
      .setTitle("✅ Masuk Server Baru!")
      .setDescription(
        `🎉 **${guild.name}** \n👥 **Members:** ${guild.memberCount}`
      )
      .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
      .setFooter({
        text: `Total Servers: ${guildCount.reduce((a, b) => a + b, 0)}`,
      });

    await hook.send({
      content: "**📢 Masuk Server <@&1299394763933618239>**",
      embeds: [joinedEmbed],
    });

    // Sending welcome message in the server
    const welcomeEmbed = new EmbedBuilder()
      .setColor("#00FF00") // Green for welcome feel
      .setAuthor({
        name: "Thanks for Adding The Extremez!",
        iconURL: guild.iconURL({ dynamic: true }),
        url: "https://discord.gg/cGJ4r9Ye4q",
      })
      .setTitle("🎶 PPLG Bot Music")
      .setURL("https://discord.gg/cGJ4r9Ye4q")
      .setDescription(
        `Hi **${guild.name}**! Terimakasih telah menambahkan saya ke dalam server dan pastikan tidak sampai spam cmd apapun.. 🎵\n\n`
      )
      .setThumbnail(
        client.user.displayAvatarURL({ dynamic: true, size: 1024 })
      );

    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("playerselect")
        .setLabel("🎚️ Pilih Player")
        .setStyle(2) // Grey button style
        .setEmoji("🎵")
    );

    // Find a suitable channel to send the embed
    const targetChannel = guild.channels.cache.find(
      (channel) =>
        [
          "logs",
          "log",
          "setup",
          "bot",
          "bot-logs",
          "music",
          "music-logs",
          "music-req",
          "chat",
          "general",
        ].some((name) => channel.name.includes(name)) && channel.isTextBased()
    );

    if (targetChannel) {
      await targetChannel.send({
        embeds: [welcomeEmbed],
        components: [actionRow],
      });
    }
  } catch (error) {
    console.error("Error in guildCreate event:", error);
  }
};
