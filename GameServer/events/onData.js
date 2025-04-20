export const onData = (socket) => async (data) => {
  // 버퍼에 수신 데이터 추가
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이
  const packetLength = 16;

  // 전체 헤더의 길이만큼 있을 때 패킷 처리하기
  while (socket.buffer.length >= packetLength) {
    const tokenBuffer = buffer.slice(0, 16);
    buffer = buffer.slice(16);

    const tokenHex = tokenBuffer.toString('hex');

    if(!userId) {
        
    }
    

  }
};