// import { BackgroundSyncPlugin } from "workbox-background-sync";
import { registerRoute } from "workbox-routing/registerRoute";
import { NetworkOnly } from "workbox-strategies/NetworkOnly";

// const bgSyncPlugin = new BackgroundSyncPlugin("myQueueName", {
//   maxRetentionTime: 24 * 60,
// });

registerRoute(
  /\/api\/.*\/*.json/,
  new NetworkOnly({
    // plugins: [bgSyncPlugin],
  }),
  "POST"
);

// self.addEventListener("install", () => {
//   console.log("installed");
// });
