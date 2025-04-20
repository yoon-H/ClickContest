import CONSTANTS from "../constants.js";

class Game {
  constructor() {
    this.time = 0;
    this.start = process.hrtime.bigint(); // 서버 시작 시간
    this.gameLoop;
  }

  checkTime(point) {
    if (point - this.start > CONSTANTS.DURATION_NS) return false;
    else return true;
  }

  gameStart() {
    this.gameLoop = setInterval(() => {
      const now = process.hrtime.bigint();
      const elapsed = now - start;

      if (elapsed > CONSTANTS.DURATION_NS) {
        clearInterval(this.gameLoop);

        // TODO 이벤트 종료 이벤트
      }
    }, 50);
  }
}

export default Game;
