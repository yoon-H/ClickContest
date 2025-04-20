import { errorHandler } from "../handlers/error.handler.js";
import { addUser, blackList } from "../users/user.session.js";

export const onData = (socket) => async (data) => {
  // 버퍼에 수신 데이터 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이
  const packetLength = 16;

  // 전체 헤더의 길이만큼 있을 때 패킷 처리하기
  while (socket.buffer.length >= packetLength) {
    try {
      const tokenBuffer = buffer.slice(0, 16);
      buffer = buffer.slice(16);

      const tokenHex = tokenBuffer.toString("hex");

      if (blackList.has(tokenHex)) {
        new Error("실격된 사용자입니다.");
      }

      if (!users.has(tokenHex)) {
        addUser(socket, tokenHex);
      }

      

    } catch (err) {
      errorHandler(socket, err.message);
    }
  }
};
