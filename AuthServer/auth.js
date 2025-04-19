import { DatabaseSync } from "node:sqlite";
import crypto from "node:crypto";

const db = new DatabaseSync("../users.db");

db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          idx INT AUTO_INCREMENT PRIMARY KEY,
          id TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          address TEXT,
          token TEXT,
          disqualified boolean DEFAULT FALSE
        )
    `);

export const registerUser = async (body, res) => {
  const result = registerUser(body);
  res.writeHead(result.code);
  res.end(result.message);
};

export function registerUserLogic({ id, password, address }) {
  if (!id || !password) return; // 비어있으면 반환

  db.run(
    "INSERT INTO users (id, password) VALUES (?, ?, ?)",
    [id, password, address],
    (err) => {
      if (err) {
        return { code: 409, message: "유저가 이미 존재합니다." };
      }
      return { code: 201, message: "유저가 등록되었습니다." };
    }
  );
}

export const logInUser = async (body, res) => {
  const result = logInUserLogic(body);
  res.writeHead(result.code, { "Content-Type": "application/json" });

  if (result.data) {
    res.end(JSON.stringify(result.data));
  } else {
    res.end(JSON.stringify({ message: result.message }));
  }
};

export function logInUserLogic({ id, password }) {
  if (!id || !password) return; // 비어있으면 반환

  db.get(
    "SELECT * FROM users WHERE id = ? AND password = ?",
    [id, password],
    (err, row) => {
      if (!row) {
        return { code: 401, message: "아이디나 비밀번호가 일치하지 않습니다." };
      }

      if (row.disqualified) {
        return { code: 403, message: "실격된 사용자입니다." };
      }

      const token = crypto.randomBytes(16).toString("hex");
      db.run("UPDATE users SET token = ? WHERE id = ?", [token, id]);
      return { code: 200, data: token };
    }
  );
}
