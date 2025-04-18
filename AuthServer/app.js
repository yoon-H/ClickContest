import { createServer } from "http";
import { initDB, logInUser, registerUser } from "./auth.js";

console.log('실행!');

const server = createServer((req, res) => {
  console.log("server Start!!!");
  // DB 연결
  initDB();

  const { url, method } = req;

  console.log(`요청: ${method} ${url}`);

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    if (req.method === "POST") {
      switch (url) {
        case "/sign-up":
          registerUser(body, res);
          break;
        case "/sign-in":
          logInUser(body, res);
          break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log("HTTP 서버 실행 중 (포트 3000)");
});
