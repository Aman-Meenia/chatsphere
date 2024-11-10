import PusherServer from "pusher";
import Pusher from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: "ap2",
});
// export const pusherClient = new PusherClient(process.env.PUSHER_KEY || "", {
//   cluster: process.env.PUSHER_CLUSTER || "",
//   authEndpoint: process.env.PUSHER_AUTH_ENDPOINT || "",
//   authTransport: "ajax",
//   wsPort: 3000,
//   wssPort: 3000,
//   auth: {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   },
// });
