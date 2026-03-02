import { Schema, model } from "mongoose";

const UserProfileSchema = new Schema({
  userID: { type: String, required: true, unique: true },
  // Top songs played by the user
  topSongs: [
    {
      title: { type: String },
      artist: { type: String },
      uri: { type: String },
      playCount: { type: Number, default: 1 },
      lastPlayed: { type: Date, default: Date.now },
    },
  ],
  // Top friends (people the user listened with)
  topFriends: [
    {
      friendID: { type: String },
      friendName: { type: String },
      listenCount: { type: Number, default: 1 },
    },
  ],
  // Top servers where user played music
  topServers: [
    {
      serverID: { type: String },
      serverName: { type: String },
      playCount: { type: Number, default: 1 },
    },
  ],
  // Total stats
  totalSongsPlayed: { type: Number, default: 0 },
  totalTimeListened: { type: Number, default: 0 }, // in seconds
  firstPlay: { type: Date, default: Date.now },
  lastPlay: { type: Date, default: Date.now },
});

export default model("UserProfile", UserProfileSchema);
