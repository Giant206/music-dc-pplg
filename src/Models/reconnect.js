import { Schema, model } from "mongoose";

let reconnectAuto = new Schema({
  GuildId: { type: String, required: true },
  TextId: { type: String, required: true },
  VoiceId: { type: String, required: true },
});
export default model("autoreconnect ", reconnectAuto);
