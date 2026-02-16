import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  AttachmentBuilder,
  SelectMenuBuilder,
} from "discord.js";
import prettyMilliseconds from "pretty-ms";
import reconnectAuto from "../Models/reconnect.js";
import Functions from "./../Struct/functions.js";
import Spotify from "kazagumo-spotify";
import Config from "./../config.js";
/**
 * @param {import("../Struct/Client")} client
 * @param {import("discord.js").Message} message
 * @param {import("discord.js").StringResolvable} content
 * @param {import("kazagumo").PlayerMovedState} state
 * @param {import("kazagumo").PlayerMovedChannels} channel
 */

/**done*/

export default async (client, message) => {
  client.kazagumo.on("playerStart", async (player, track) => {
    track.requester = player.previous
      ? player.queue.previous.requester
      : player.queue.current.requester;
    if (track.uri.includes("https://cdn.discordapp.com/attachments/")) {
      return;
    }
    function convert(ms) {
      return prettyMilliseconds(ms, {
        colonNotation: true,
        secondsDecimalDigits: 0,
      });
    }
    let sp = new Spotify({
      clientID: Config.SpotifyID,
      clientSecret: Config.SpotifySecret,
    });

    player.data.set("autoplayTrack", track, player);

    const channel = await client.channels.cache.get(player.textId);
    const embed = new EmbedBuilder()
      .setTitle(`Now Playing`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setImage(track.thumbnail || track.displayThumbnail())
      .setColor(client.settings.COLOR)
      .setDescription(
        `[${
          track.title.length > 50
            ? track.title.slice(0, 50) + "..."
            : track.title
        }](${track.uri})\n[<@${
          player.queue.previous
            ? player.queue.previous.requester.id
            : player.queue.current.requester.id
        }>]`
      )
      .setFooter({
        text: `Volume bot saat ini di atas 100%. Anda mungkin mengalami distorsi.`,
      });
    const set = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("set")
      .setEmoji(`1177656041438183534`)
      .setLabel("Settings");
    const prev = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("prev")
      //.setEmoji(`1177656047985504351`)
      .setLabel("Previous")
      .setDisabled(!player.queue.previous ? true : false);
    const pauseandres = new ButtonBuilder()
      .setStyle(player.playing ? client.Buttons.grey : client.Buttons.green)
      .setCustomId("pauseandres")
      //.setEmoji(`1177594147297820712`)
      .setLabel(player.playing ? "Pause" : "Resume");
    const skip = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("skip")
      //.setEmoji(`1177656050590154812`)
      .setLabel("Skip");
    const stop = new ButtonBuilder()
      .setStyle(client.Buttons.red)
      .setCustomId("stop")
      //.setEmoji(`1177656045099827290`)
      .setLabel("Stop");
    const forwar = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("forw")
      .setEmoji(`1178010184539459675`);
    const rewin = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("rewi")
      .setEmoji(`1178010175219699722`);
    const favsongs = new ButtonBuilder()
      .setStyle(client.Buttons.grey)
      .setCustomId("likeds")
      .setEmoji(`1178013963829657631`);
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

    const filtersel = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("filter_pop")
        .setPlaceholder("Select Filter")
        .addOptions([
          {
            label: "Reset Filters",
            value: "clear_but",
          },
          {
            label: "BassBoost",
            value: "bass_but",
          },
          {
            label: "8D",
            value: "8d_but",
          },
          {
            label: "DayCore",
            value: "dayc_but",
          },
          {
            label: "Chipmunk",
            value: "chipm_but",
          },
          {
            label: "China",
            value: "china_but",
          },
          {
            label: "Dance",
            value: "dance_but",
          },
          {
            label: "Darthvader",
            value: "darthv_but",
          },
          {
            label: "Doubletime",
            value: "doublt_but",
          },
          {
            label: "Treblbass",
            value: "treblb_but",
          },
        ])
    );

    const row = new ActionRowBuilder().addComponents(
      pauseandres,
      skip,
      loop,
      shuffle,
      stop
    );
    const row2 = new ActionRowBuilder().addComponents(rewin, stop, forwar, set);
    channel.send({ embeds: [embed], components: [row] }).then(async (msg) => {
      player.data.set("nowplaying", msg.id);
    });
  });
  client.kazagumo.on("playerResolveError", async (player, track) => {});
  client.kazagumo.on("playerDestroy", async (player, track) => {
    const channel = client.channels?.cache.get(player.textId);
    let msg = await channel?.messages.fetch(player.data.get("nowplaying"));
    if (msg) {
      await msg.delete();
    }
  });
  client.kazagumo.on("playerCreate", async (player, track) => {});
  client.kazagumo.on("playerEnd", async (player, track) => {
    const channel = client.channels?.cache.get(player.textId);
    if (channel) {
      channel.messages.fetch(player.data.get("nowplaying")).then((msg) => {
        msg.delete();
      });
    }
  });
  client.kazagumo.on("playerEmpty", async (player, track) => {
    let channel = client.channels?.cache.get(player.textId);
    let msg = await channel?.messages.fetch(player.data.get("nowplaying"));
    if (msg) {
      await msg.delete();
    }
    const ap = player.data.get("autoplay");
    if (ap) {
      return Functions.ColdAutoplay(client, player);
    } else {
      channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor(client.settings.COLOR)
            .setDescription(`> Queue telah berakhir! Pertimbangkan untuk mengundang saya?.`),
        ],
      });
    }
  });
  client.kazagumo.on("playerClosed", async (player, track) => {
    const channel = client.channels.cache.get(player.textId);
    if (channel) {
      channel.messages.fetch(player.data.get("nowplaying")).then((msg) => {
        msg.delete();
      });
    }
  });
  client.kazagumo.on("playerStuck", async (player, track) => {
    let msg = await channel?.messages.fetch(player.data.get("nowplaying"));
    if (msg) {
      await msg.delete();
    }
    const channel = client.channels.cache.get(player.textId);
    player.skip();
    const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setDescription(`> **Lagu Terhenti. Melewati Lagu Berikutnya.**`);
    channel.send({ embeds: [embed] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
  });
  client.kazagumo.on("playerResumed", async (player, track) => {});
  client.kazagumo.on("playerMoved", async (player, state, channel) => {
    const data = await reconnectAuto.findOne({ GuildId: player.guildId });
    const guild = client.guilds.cache.get(player.guildId);
    if (!guild) return;
    const chn = client.channels.cache.get(player.textId);
    if (channel.newChannelId === channel.oldChannelId) return;
    if (channel.newChannelId === null || !channel.newChannelId) {
      if (data) {
        if (!player) return;
        player.destroy();
        setTimeout(async () => {
          await client.kazagumo.createPlayer({
            guildId: data.GuildId,
            textId: data.TextId,
            voiceId: data.VoiceId,
            deaf: true,
          });
        }, 200);
        const embed = new EmbedBuilder()
          .setAuthor({
              name: "Menyambung Kembali ke VC, Karena Layanan 24/7 Diaktifkan!",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setColor(client.settings.COLOR);

        return await chn.send({ embeds: [embed] }).then(async (a) => {
          setTimeout(async () => {
            await a.delete().catch(() => {});
          }, 15000);
        });
      } else {
        if (!player) return;
        player.destroy();
        if (chn)
          return await chn
            .send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    `Saya telah diputuskan dari <#${channel.oldChannelId}>.`
                  )
                  .setColor(client.settings.COLOR),
              ],
            })
            .then((a) =>
              setTimeout(async () => await a.delete().catch(() => {}), 15000)
            )
            .catch(() => {});
      }
    } else {
      if (player.paused) player.pause(false);
    }
  });
  client.kazagumo.on("playerException", async (player, track) => {
    const channel = client.channels.cache.get(player.textId);
    if (channel) {
      channel.messages.fetch(player.data.get("nowplaying")).then((msg) => {
        msg.delete();
      });
    }
    player.skip();
    const embed = new EmbedBuilder()
      .setColor(client.settings.COLOR)
      .setDescription(`> **Track Mengalami Exception. Melewati Lagu Berikutnya.**`);
    channel.send({ embeds: [embed] }).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
  });
  client.kazagumo.on("playerUpdate", async (player, track) => {});
};
