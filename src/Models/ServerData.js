import { Schema, model } from "mongoose";

const ServerSchema = new Schema({
  serverID: { type: String },
  prefix: { type: String, default: "-" },
  autoplay: { type: Boolean, default: false },
  botChannel: { type: String },
});

export default model("ServerData", ServerSchema);
