import net from "net";
import { onConnection } from "./events/onConnection.js";
import { startGame } from "./games/game.js";

const server = net.createServer(onConnection);

const startServer = async () => {
  startGame();
  server.listen(5555, "localhost", async () => {
    console.log("[게임] 서버 시작!!", 5555);
  });
};

startServer();