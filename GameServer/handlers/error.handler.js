import { sendPacket } from "../makePacket.js";
import CONSTANTS from "../constants.js";

export const errorHandler = (socket, message) => {
  sendPacket(socket, CONSTANTS.RESPONSE_CODE.ERROR, { message });
};
