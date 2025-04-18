import sqlite from "node:sqlite";
import crypto from "node:crypto";

let db;

export const initDB = async () => {
  db = await open({
    filename: "./users.db",
    driver: sqlite.SQLite3Driver,
  });

  await db.exec(`
          CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY 
            id TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            address TEXT,
            token TEXT,
            disqualified boolean DEFAULT FALSE
          )
      `);
};

export const registerUser = async (body, res) => {
  if (!body.id || !body.password) return; // 비어있으면 반환

  db.run(
    "INSERT INTO users (id, password) VALUES (?, ?, ?)",
    [body.id, body.password, body.address],
    (err) => {
      if (err) {
        res.writeHead(409);
        return res.end("유저가 이미 존재합니다.");
      }
      res.writeHead(201);
      res.end("유저가 등록되었습니다.");
    }
  );
};

export const logInUser = async (body, res) => {
  const { id, password } = body;
  if (!id || !password) return; // 비어있으면 반환

  db.get(
    "SELECT * FROM users WHERE id = ? AND password = ?",
    [id, password],
    (err, row) => {
      if (!row) {
        res.writeHead(401);
        return res.end("아이디나 비밀번호가 일치하지 않습니다.");
      }

      if (row.disqualified) {
        res.writeHead(403);
        return res.end("실격된 사용자입니다.");
      }

      const token = crypto.randomBytes(16).toString("hex");
      db.run("UPDATE users SET token = ? WHERE id = ?", [token, id]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ token }));
    }
  );
};
