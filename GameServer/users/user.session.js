import { DatabaseSync } from "node:sqlite";
import { errorHandler } from "../handlers/error.handler.js";
import User from "./user.class.js";

const users = [];

const db = new DatabaseSync("../users.db");

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
          new Error("실격된 사용자입니다.");
        }

        const user = new User(socket, row.id, row.address, token);

        users.push(user);
      }
    );
  } catch (err) {
    errorHandler(socket, err.message);
  }
};
