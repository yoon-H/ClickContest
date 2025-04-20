export const makePacket = (responseCode, data) => {
  const responsePayload = {
    responseCode,
    data: data ? Buffer.from(JSON.stringify(data)) : null, // 문자열화해서 버퍼객체로 만들기
  };

  const buffer = Buffer.from(JSON.stringify(responsePayload));

  const packetLength = Buffer.alloc(4);

  packetLength.writeUInt32BE(buffer.length + 4, 0);

  return Buffer.concat([packetLength, buffer]);
};

export const sendPacket = (socket, responseCode, data) => {
  const packet = makePacket(responseCode, data);
  socket.write(packet);
};
