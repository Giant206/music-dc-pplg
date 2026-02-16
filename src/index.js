import { ClusterManager } from "discord-hybrid-sharding";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const manager = new ClusterManager(`./src/cold.js`, {
  totalShards: "auto",
  shardsPerClusters: 2,
  totalClusters: "auto",
  mode: "process",
  token:
    process.env.TOKEN ||
    "MTQ3MjYxNTM0NTQwMjU0NDEzOA.GNAmY0.z_3i6KgNUHTbdSZF3gGo9hR1VSjQ5zpEUYw108", // mau pakai di .env juga gapapa, yang penting tokennya jangan di publish ya :v
});
manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);
manager.spawn({ timeout: -1 });

app.get("/", (req, res) => {
  const message = `
  <h1>Bot is running!</h1>
  <p>Cluster Manager is active with ${manager.totalClusters} clusters.</p>
  `;
  res.send(message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
