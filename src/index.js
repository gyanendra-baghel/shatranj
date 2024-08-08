import CanvasBoard from "./core/canvas-board";
import Timer from "./core/timer";

class Shataranj {
  constructor(elemId, size) {
    const elem = document.getElementById(elemId);
    if (!(elem instanceof HTMLElement)) {
      throw new Error("Invalid element Id: " + elemId);
    }
    const canvas = document.createElement("canvas");
    const timer1 = document.createElement("p");
    const timer2 = document.createElement("p");

    this.timer = new Timer(timer1, timer2);
    this.chess = new CanvasBoard(canvas, size);

    this.chess.on("move", () => {
      this.timer.switchPlayer();
    });

    this.chess.on("end", () => {
      this.timer.stop();
    });

    this.timer.onTimeUp((team) => {
      this.chess.announceWinner(team);
    });

    timer1.className = "timer1";
    timer2.className = "timer2";

    elem.appendChild(timer1);
    elem.appendChild(canvas);
    elem.appendChild(timer2);
  }
  init(time = 600) {
    this.timer.start(time);
    this.chess.init();
  }
}

export default Shataranj;
