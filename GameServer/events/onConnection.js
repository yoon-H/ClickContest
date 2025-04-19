import { onData } from "./onData.js";

export const onConnection = (socket)=> {
    console.log('서버와 연결되었습니다:', socket.remoteAddress, socket.remotePort);
  
    socket.buffer = Buffer.alloc(0);
  
    socket.on('data', onData(socket));

    socket.on('end', (socket) => {

    });

    socket.on('error', (socket) => {

    });
  };