/**
 * @param {import("discord.js").ThreadChannel} thread
 */

export default async (_, thread) => {
  if (thread.joinable && !thread.joined) {
    await thread.join();
  }
};
