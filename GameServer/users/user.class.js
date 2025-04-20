import CONSTANTS from "../constants.js";
import { errorHandler } from "../handlers/error.handler.js";
import { disqualifyUser } from "./user.session.js";

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
          disqualifyUser(this);

          new Error("클릭 대기 시간이 만료되어 실격되었습니다.");
        }
      } catch (err) {
        errorHandler(this.socket, err.message);
      }
    }, 500);
  }

  // 클릭 이벤트
  click() {
    try {
      // 게임 시간 만료 체크
      if (time > CONSTANTS.DURATION_NS) return;

      this.clickCounter = 0;
      this.lastClickUpdate = Date.now();
      const time = process.hrtime.bigint();

      if (this.clicks.length < CONSTANTS.LIMITED_NUM) {
        this.clicks.push(time);
        return;
      }

      // 부정행위 실격 체크
      const prevClick = this.clicks[length - CONSTANTS.LIMITED_NUM];

      if (time - prevClick > CONSTANTS.LIMITED_TIME) {
        disqualifyUser(this);
        new Error("부정행위로 실격되었습니다.");
      } else {
        this.clicks.push(time);
      }
    } catch (err) {
      errorHandler(this.socket, err.message);
    }
  }
}

export default User;
