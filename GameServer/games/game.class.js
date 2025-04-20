import CONSTANTS from "../constants.js";
import { sendPacket } from "../makePacket.js";
import { users } from "../users/user.session.js";
import { game } from "./game.js";

class Game {
  constructor() {
    this.time = 0;
    this.start = process.hrtime.bigint(); // 서버 시작 시간
    this.gameLoop = gameStart();
  }

  checkTime(point) {
    if (point - this.start > CONSTANTS.DURATION_NS) return false;
    else return true;
  }

  gameStart() {
    return setInterval(() => {
      const now = process.hrtime.bigint();
      const elapsed = now - start;

      if (elapsed > CONSTANTS.DURATION_NS) {
        this.gameEnd();
      }
    }, 50);
  }

  gameEnd() {
    // 게임 인터벌 삭제
    clearInterval(this.gameLoop);

    // 우승자 판별
    const winner = this.getWinner();

    for (const [token, user] of users) {
      if (token === winner.token) {
        sendPacket(user.socket, CONSTANTS.RESPONSE_CODE.EVENT_END, {
          result: "win",
          address: user.address,
          count: user.clicks.length,
        });
      } else {
        sendPacket(user.socket, CONSTANTS.RESPONSE_CODE.EVENT_END, {
          result: "lose",
        });
      }

      clearInterval(user.clickLoop);
    }

    game = null;
  }

  getWinner() {
    let max = 0;
    let maxUsers = [];

    // 가장 많이 클릭한 유저 추출
    for (const [token, user] of users) {
      const len = user.clicks.length;

      if (len > max) {
        max = len;
        maxUsers = [user];
      } else if (len == max) {
        maxUsers.push(user);
      }
    }

    if (maxUsers.length === 1) return maxUsers[0];

    // 빠른 유저 찾기
    let fastUser = 0;
    let fastClick = 60_000_000_000n;

    for (const user of maxUsers) {
      const click = user.clicks[user.clicks.length - 1];

      if (fastClick < click) {
        fastUser = user;
        fastClick = click;
      }
    }

    return fastUser;
  }
}

export default Game;
