import { db } from "../db.js";
import { errorHandler } from "../handlers/error.handler.js";
import User from "./user.class.js";

export const users = new Map();
export const blackList = new Set();

export const addUser = (socket, token) => {
  try {
    db.get(
      "SELECT id, address, disqualified FROM users WHERE token = ?",
      [token],
      (err, row) => {
        if (!row) {
          new Error("유저가 존재하지 않습니다.");
        }

        if (row.disqualified) {
          blackList.add(token);
          new Error("실격된 사용자입니다.");
        }

        const user = new User(socket, row.id, row.address, token);

        users.set(token, user);
      }
    );
  } catch (err) {
    errorHandler(socket, err.message);
  }
};

export const disqualifyUser = (user) => {
  users.delete(user.token);
  blackList.add(user.token);
  db.run("UPDATE users SET disqualified = TRUE WHERE id = ?", [user.id]);
  user.socket.destroy(); // 연결 강제 종료.
};
