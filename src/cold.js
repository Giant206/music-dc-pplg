import mongoose from "mongoose";
import { Database } from "quickmongo";
import Client from "./Struct/Client.js";
export const client = new Client();
client.ColdBuild();
client.db = new Database(client.settings.MONGO);
client.db.connect();
process.removeAllListeners("warning");
process.on("unhandledRejection", (err) => {
  console.log(err);
});
process.on("uncaughtException", (err) => {
  console.log(err);
});
process.on("multipleResolves", () => {});
process.on("uncaughtExceptionMonitor", (err) => {
  console.log(err);
});
