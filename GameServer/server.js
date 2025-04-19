import net from "net";
import { onConnection } from "./events/onConnection.js";

const server = net.createServer(onConnection);

server.listen(5555, "localhost", async () => {
  console.log("서버 시작!!", 5555);
});
