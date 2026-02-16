import { Schema, model } from "mongoose";

const noprefixSchema = new Schema({
  userId: { type: String },
  userName: { type: String },
  count: { type: Number, default: 0 },
  endTime: { type: Number, default: 0 },
});
export default model("noprefix", noprefixSchema);
