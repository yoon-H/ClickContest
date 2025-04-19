import { RESPONSE_CODE, sendPacket } from "../makePacket.js";

export const errorHandler = (socket, message) => {
  sendPacket(socket, RESPONSE_CODE.ERROR, { message });
};
