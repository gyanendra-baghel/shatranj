class Timer {
  constructor(timer1, timer2, time = 600) {
    this.timer1 = timer1;
    this.timer2 = timer2;
    this.player1Time = time;
    this.player2Time = time;
    this.currentPlayer = 1;
    this.timerInterval = null;
    this.timeUpCallbacks = [];
  }

  onTimeUp(callback) {
    this.timeUpCallbacks.push(callback);
  }

  updateTimerDisplay() {
    this.timer1.textContent = this.formatTime(this.player1Time);
    this.timer2.textContent = this.formatTime(this.player2Time);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  switchPlayer() {
    clearInterval(this.timerInterval);
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.currentPlayer === 1) {
        this.player1Time--;
        if (this.player1Time <= 0) {
          clearInterval(this.timerInterval);
          this.runTimeUpCallback("team2");
        }
      } else {
        this.player2Time--;
        if (this.player2Time <= 0) {
          clearInterval(this.timerInterval);
          this.runTimeUpCallback("team1");
        }
      }
      this.updateTimerDisplay();
    }, 1000);
  }

  runTimeUpCallback(winnerTeam) {
    this.timeUpCallbacks.forEach((callback) => callback(winnerTeam));
  }

  start(time) {
    this.player1Time = time;
    this.player2Time = time;
    this.startTimer();
  }

  stop() {
    clearInterval(this.timerInterval);
  }

  destroy() {
    this.timeUpCallbacks = [];
    this.stop();
  }
}

export default Timer;
