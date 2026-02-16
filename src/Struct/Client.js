import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ButtonStyle,
} from "discord.js";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import { Connectors } from "shoukaku";
import { Kazagumo, Plugins } from "kazagumo";
import Deezer from "kazagumo-deezer";
import { ActivityType } from "discord.js";
import Config from "./../config.js";
import mongoose from "mongoose";
import Spotify from "kazagumo-spotify";
import Functions from "./functions.js";
import ColdEvents from "../handlers/event.js";
const Intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildInvites,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildWebhooks,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
];
/**
 * @param {import(discord.js).Message} message
 * @param {import(Kazagumo).KazagumoPlayer} player
 */

export default class ColdClient extends Client {
  constructor() {
    super({
      allowedMentions: {
        parse: ["roles", "users", "everyone"],
        repliedUser: false,
      },
      intents: [Intents],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
        Partials.Reaction,
      ],

      ws: {
        large_threshold: 50,
        version: 10,
      },
      rest: {
        retries: 3,
        authPrefix: "Bot",
        api: "https://discord.com/api",
        cdn: "https://cdn.discordapp.com/",
        version: "10",
        rejectOnRateLimit: null,
      },
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
    });
    this.Buttons = {
      green: ButtonStyle.Success,
      blue: ButtonStyle.Primary,
      grey: ButtonStyle.Secondary,
      red: ButtonStyle.Danger,
      link: ButtonStyle.Link,
    };
    this.owner = Config.OWNER;
    this.cluster = new ClusterClient(this);
    this.functions = new Functions(this);
    this.commands = new Collection();
    this.settings = Config;
    this.ClientEvents = new ColdEvents(this).LoadClientEvents();
    this.messageCommands = new Collection();
    (this.helpMessages = [
      "**Prefix Bot Ini Adalah** `p!` \n\n**Untuk Melihat Semua Perintah, Ketik** `-help`",
    ]),
      (this.Nodes = Config.NODES);
    this.kazagumo = new Kazagumo(
      {
        plugins: [
          new Plugins.PlayerMoved(this),
          new Deezer({
            playlistLimit: 30,
          }),
          new Spotify({
            clientId: Config.SpotifyID,
            clientSecret: Config.SpotifySecret,
            playlistPageLimit: 50,
            albumPageLimit: 10,
            searchLimit: 10,
            searchMarket: "IN",
          }),
          new Plugins.PlayerMoved(this),
        ],
        defaultSearchEngine: "youtube",
        defaultYoutubeThumbnail: "hq720",
        send: (guildId, payload) => {
          const guild = this.guilds.cache.get(guildId);
          if (guild) guild.shard.send(payload);
        },
      },
      new Connectors.DiscordJS(this),
      this.Nodes,
      Spotify
    );
    /**
     * @param {String} id
     * @param {import("kazagumo").KazagumoTrack} track
     * @returns {void}
     */
    this.kazagumo.shoukaku.on("ready", async (name) => {
      console.log(`Lavalink ${name} -  Ready`);
    });
    this.kazagumo.shoukaku.on("error", async (name, error) => {
      console.error(`Lavalink ${name} -  Error`, error);
    });
    this.kazagumo.shoukaku.on("close", async (name, code, reason) => {
      console.warn(
        `Lavalink ${name} - Closed, Code ${code}, Reason ${
          reason || "No reason"
        }`
      );
    });
    this.kazagumo.shoukaku.on("disconnect", async (name, players, moved) => {
      if (moved) return;
      players.map((player) => player.connection.disconnect());
      console.warn(`Lavalink ${name} - Disconnected`);
    });
  }

  async ColdBuild() {
    await loadHandlers(this);
    this.login(process.env.TOKEN)
      .then(() => {
        mongoose.set("strictQuery", true);
        const Options = {
          useNewUrlParser: true,
          autoIndex: false,
          connectTimeoutMS: 10000,
          family: 4,
          useUnifiedTopology: true,
        };
        mongoose
          .connect(this.settings.MONGO, Options)
          .then(() => {
            console.log(`Terhubung ke Database MongoDB`);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    return this;
  }
}
async function loadHandlers(client) {
  const handlerFiles = ["MessageCommand", "Dispatcher"];
  for (const file of handlerFiles) {
    let handler = await import(`./../handlers/${file}.js`).then(
      (r) => r.default
    );
    await handler(client);
  }
}
