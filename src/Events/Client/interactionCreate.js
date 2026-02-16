import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
  InteractionType,
  ButtonStyle,
} from "discord.js";
import ServerSchema from "../../Models/ServerData.js";

/**
 * @param {import("../../Struct/Client)}client
 * @param {import("discord.js").CommandInteraction} interaction
 */

export default async (client, interaction) => {
  if (!interaction.inGuild()) return;
  let ServerData = async () => {
    if (await ServerSchema.findOne({ serverID: interaction.guild.id })) {
      return await ServerSchema.findOne({ serverID: interaction.guild.id });
    } else {
      return new ServerSchema({ serverID: interaction.guild.id }).save();
    }
  };
  ServerData = await ServerData();
  let player = await client.kazagumo.players.get(interaction.guild.id);
  if (interaction.isButton()) {
    if (
      interaction.customId === "delete1" &&
      client.owner.includes(interaction.user.id)
    ) {
      interaction.message.delete();
    }
  }
  if (interaction.isButton()) {
    if (
      interaction.customId === "delete" &&
      client.owner.includes(interaction.user.id)
    ) {
      interaction.message.delete();
    }
  }
  if (interaction.isButton()) {
    const player = await client.kazagumo.players.get(interaction.guild.id);
    let requester;
    if (player)
      requester = player?.queue.previous
        ? player.queue.previous.requester
        : player.queue.current.requester;
    if (!player) requester = client.user;
    const notInvc = new EmbedBuilder();
    notInvc.setColor(client.settings.COLOR);
    notInvc.setDescription(
      `\`\`\`diff\n-Anda tidak sedang berada di saluran suara.\`\`\``
    );
    const samevc = new EmbedBuilder();
    samevc.setColor(client.settings.COLOR);
    samevc.setDescription(
      `\`\`\`fix\nAnda tidak berada di saluran suara yang sama dengan saya untuk menggunakan saya\`\`\``
    );
    const musicEmbd = new EmbedBuilder();
    musicEmbd.setColor(client.settings.COLOR);
    const requesterEmebd = new EmbedBuilder();
    requesterEmebd.setColor(client.settings.COLOR);
    requesterEmebd.setDescription(
      `\`\`\`diff\n-Lagu yang sedang diputar diminta oleh ${requester.username}. Jadi Anda tidak dapat menggunakan tombol ini!\`\`\``
    );
    if (interaction.customId === "skip") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.paused) {
        const embed = new EmbedBuilder();
        embed.setColor(client.settings.COLOR);
        embed.setDescription(
          `\`\`\`fix\nPemutar musik sedang dijeda! Saya tidak bisa melewati trek saat ini.\`\`\``
        );
        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        player.skip();
        musicEmbd.setDescription(`\`\`\`fix\nBerhasil melewati lagu saat ini!\`\`\``);
        return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
      }
    } else if (interaction.customId === "stop") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      player.destroy();
      musicEmbd.setDescription(`\`\`\`fix\nSistem musiknya hancur!\`\`\``);
      return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
    } else if (interaction.customId === "prev") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (!player.queue.previous) {
        const embed = new EmbedBuilder();
        embed.setColor(client.settings.COLOR);
        embed.setDescription(`\`\`\`diff\n-Tidak ada trek sebelumnya yang ditemukan!\`\`\``);
        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        player.queue.unshift(player.queue.previous);
        player.skip();
        musicEmbd.setDescription(
          `\`\`\`diff\n+Baiklah, sekarang saya akan memutar lagu sebelumnya!\`\`\``
        );
        return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
      }
    } else if (interaction.customId === "pauseandres") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      player.pause(player.paused ? false : true);
      const set = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("set")
        .setEmoji(`1177656041438183534`)
        .setLabel("Settings");
      const prev = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656047985504351`)
        .setCustomId("prev")
        .setLabel("Previous")
        .setDisabled(!player.queue.previous ? true : false);
      const pauseandres = new ButtonBuilder()
        .setStyle(player.playing ? client.Buttons.grey : client.Buttons.green)
        .setCustomId("pauseandres")
        //.setEmoji(`1177594147297820712`)
        .setLabel(player.playing ? "Pause" : "Resume");
      const skip = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656050590154812`)
        .setCustomId("skip")
        .setLabel("Skip");
      const stop = new ButtonBuilder()
        .setStyle(client.Buttons.red)
        .setCustomId("stop")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Stop");
      const loop = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("loop")
        //.setEmoji(`1177656045099827290`)
        .setLabel(
          `Loop - ${
            player.loop == "none"
              ? "Off"
              : player.loop == "track"
              ? "Track"
              : "Queue"
          }`
        );
      const shuffle = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("shuffle")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Shuffle");
      const row = new ActionRowBuilder().addComponents(
        pauseandres,
        skip,
        loop,
        shuffle,
        stop
      );
      try {
        const msg = await client.channels.cache
          .get(player.textId)
          .messages.fetch(player.data.get("nowplaying"));
        msg.edit({ components: [row] });
      } catch (e) {
        cosole.log(e);
      }
      musicEmbd.setDescription(
        `Track sekarang  ${
          player.paused ? "```diff\n-Dijeda```" : "```diff\n+Dilanjutkan```"
        }`
      );

      return interaction.reply({ embeds: [musicEmbd], ephemeral: true });
    } else if (interaction.customId === "set") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const set = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("set")
        .setEmoji(`1177656041438183534`)
        .setLabel("Settings");
      const prev = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656047985504351`)
        .setCustomId("prev")
        .setLabel("Previous")
        .setDisabled(!player.queue.previous ? true : false);
      const pauseandres = new ButtonBuilder()
        .setStyle(player.playing ? client.Buttons.grey : client.Buttons.green)
        .setCustomId("pauseandres")
        //.setEmoji(`1177594147297820712`)
        .setLabel(player.playing ? "Pause" : "Resume");
      const skip = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656050590154812`)
        .setCustomId("skip")
        .setLabel("Skip");
      const stop = new ButtonBuilder()
        .setStyle(client.Buttons.red)
        .setCustomId("stop")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Stop");
      const loop = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("loop")
        //.setEmoji(`1177656045099827290`)
        .setLabel(
          `Loop - ${
            player.loop == "none"
              ? "Off"
              : player.loop == "track"
              ? "Track"
              : "Queue"
          }`
        );
      const shuffle = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("shuffle")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Shuffle");
      const row = new ActionRowBuilder().addComponents(
        pauseandres,
        skip,
        loop,
        shuffle,
        stop
      );
      return interaction.reply({ components: [row], ephemeral: true });
    }
    //inside settings
    else if (interaction.customId === "loop") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.loop == "queue" && player.loop != "track") {
        player.setLoop("track");
      }
      if (player.loop == "none" && player.loop != "queue") {
        player.setLoop("queue");
      }
      if (player.loop == "track" && player.loop != "none") {
        player.setLoop("none");
      }
      const set = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("set")
        .setEmoji(`1177656041438183534`)
        .setLabel("Settings");
      const prev = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656047985504351`)
        .setCustomId("prev")
        .setLabel("Previous")
        .setDisabled(!player.queue.previous ? true : false);
      const pauseandres = new ButtonBuilder()
        .setStyle(player.playing ? client.Buttons.grey : client.Buttons.green)
        .setCustomId("pauseandres")
        //.setEmoji(`1177594147297820712`)
        .setLabel(player.playing ? "Pause" : "Resume");
      const skip = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        //.setEmoji(`1177656050590154812`)
        .setCustomId("skip")
        .setLabel("Skip");
      const stop = new ButtonBuilder()
        .setStyle(client.Buttons.red)
        .setCustomId("stop")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Stop");
      const loop = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("loop")
        //.setEmoji(`1177656045099827290`)
        .setLabel(
          `Loop - ${
            player.loop == "none"
              ? "Off"
              : player.loop == "track"
              ? "Track"
              : "Queue"
          }`
        );
      const shuffle = new ButtonBuilder()
        .setStyle(client.Buttons.grey)
        .setCustomId("shuffle")
        //.setEmoji(`1177656045099827290`)
        .setLabel("Shuffle");
      const row = new ActionRowBuilder().addComponents(
        pauseandres,
        skip,
        loop,
        shuffle,
        stop
      );
      interaction.update({ components: [row], ephemeral: true });
    }
    //autoplay
    else if (interaction.customId === "autoplay") {
      if (!player) return interaction.message.delete();

      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.data.get("autoplay", true)) {
        player.data.set("autoplay", false);
      } else {
        player.data.set("autoplay", true);
      }
      const settingRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("autoplay")
          .setEmoji(`1177656039227793468`)
          .setStyle(
            player.data.get("autoplay")
              ? ButtonStyle.Success
              : ButtonStyle.Secondary
          )
          .setLabel(
            "Autoplay - " +
              `${player.data.get("autoplay", true) ? "Enabled" : "Disabled"}`
          ),
        new ButtonBuilder()
          .setCustomId("loop")
          .setEmoji(`1177292642590142494`)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(`1177292642590142494`)
          .setLabel(
            `Loop - ${
              player.loop == "none"
                ? "Off"
                : player.loop == "track"
                ? "Track"
                : "Queue"
            }`
          ),
        new ButtonBuilder()
          .setCustomId("volume")
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Volume")
      );
      interaction.update({ components: [settingRow], ephemeral: true });
    } else if (interaction.customId === "volume") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const volumeRw = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("inc")
          .setStyle(ButtonStyle.Success)
          .setLabel("Increase"),
        new ButtonBuilder()
          .setCustomId("dec")
          .setStyle(ButtonStyle.Success)
          .setLabel("Decrease")
      );
      return interaction.reply({ components: [volumeRw], ephemeral: true });
    } else if (interaction.customId === "inc") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const currentVolume = player.volume * 100;
      if (player.volume === 150) {
        const emd = new EmbedBuilder()
          .setDescription("Anda tidak dapat meningkatkan volume di atas 150")
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });
      }
      player.setVolume(currentVolume + 10);
      const emd = new EmbedBuilder()
        .setDescription(`Volume Is Now At **${currentVolume * 100 + 10}** `)
        .setColor(client.settings.COLOR);
      return interaction.reply({ embeds: [emd], ephemeral: true });
    } else if (interaction.customId === "dec") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      const currentVolume = player.volume * 100;
      if (player.volume === 0) {
        const emd = new EmbedBuilder()
          .setDescription("Anda tidak dapat mengurangi volume di bawah 0")
          .setColor(client.settings.COLOR);
        return interaction.reply({ embeds: [emd], ephemeral: true });
      }
      player.setVolume(currentVolume - 10);
      const emd = new EmbedBuilder()
        .setDescription(`Volume Sekarang Di **${currentVolume * 100 - 10}** `)
        .setColor(client.settings.COLOR);
      return interaction.reply({ embeds: [emd], ephemeral: true });
    } else if (interaction.customId === "shuffle") {
      if (!player) return interaction.message.delete();
      if (
        !interaction.member.voice.channelId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [notInvc], ephemeral: true });
      if (
        interaction.member.voice.channelId !== player.voiceId &&
        interaction.user.id !== client.user.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [samevc], ephemeral: true });
      if (
        interaction.user.id !== player.queue.current.requester.id &&
        interaction.user.id !== client.settings.owner
      )
        return interaction.reply({ embeds: [requesterEmebd], ephemeral: true });
      if (player.queue.length < 3) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(`#FF0000`)
              .setDescription(`Tidak cukup lagu dalam antrian untuk diacak.`),
          ],
          ephemeral: true,
        });
      }
      player.queue.shuffle();
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription("Antrian telah diacak."),
        ],
        ephemeral: true,
      });
    }
  }
};
