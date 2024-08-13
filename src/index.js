import CanvasBoard from "./core/canvas-board";
import Timer from "./core/timer";

class Shataranj {
  constructor(elemId, size) {
    const elem = document.getElementById(elemId);
    if (!(elem instanceof HTMLElement)) {
      throw new Error("Invalid element Id: " + elemId);
    }
    this.canvas = document.createElement("canvas");
    this.timer1 = document.createElement("p");
    this.timer2 = document.createElement("p");

    this.timer = new Timer(this.timer1, this.timer2);
    this.chess = new CanvasBoard(this.canvas, size);

    this.chess.on("move", () => {
      this.timer.switchPlayer();
    });

    this.chess.on("end", () => {
      this.timer.stop();
    });

    this.timer.onTimeUp((team) => {
      this.chess.announceWinner(team);
    });

    this.timer1.className = "timer1";
    this.timer2.className = "timer2";

    elem.appendChild(this.timer1);
    elem.appendChild(this.canvas);
    elem.appendChild(this.timer2);
  }
  init(time = 600) {
    this.timer.start(time);
    this.chess.init();
  }
  destroy() {
    this.canvas.remove();
    this.timer1.remove();
    this.timer2.remove();
  }
}

export default Shataranj;
