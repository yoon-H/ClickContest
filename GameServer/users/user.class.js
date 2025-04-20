import CONSTANTS from "../constants.js";
import { errorHandler } from "../handlers/error.handler.js";
import { blackList, disqualifyUser, users } from "./user.session.js";

class User {
  constructor(socket, id, address, token) {
    this.socket = socket;
    this.id = id;
    this.address = address;
    this.token = token;
    this.clicks = [];

    // 인터벌 체크
    this.clickCounter = 0;
    this.lastClickUpdate = Date.now();
    this.clickLoop = loopStart();
  }

  // 클릭 체크하는 인터벌 만들기
  loopStart() {
    return setInterval(() => {
      try {
        const now = Date.now();
        const elapsed = now - this.lastClickUpdate;
        this.clickCounter += elapsed;

        if (this.clickCounter > CONSTANTS.CLICK_INTERVAL) {
          clearInterval(this.clickLoop);

          // 유저 실격 처리
          disqualifyUser(this.socket, this.id);

          new Error("클릭 대기 시간이 만료되어 실격되었습니다.");
        }
      } catch (err) {
        errorHandler(this.socket, err.message);
      }
    }, 500);
  }

  // 클릭 이벤트
  click() {}
}

export default User;
