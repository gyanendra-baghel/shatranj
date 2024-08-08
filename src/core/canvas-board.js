import Board from "./board";

class CanvasBoard {
  constructor(canvas, size, margin = 0) {
    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");
    this.canvas.width = this.canvas.height = this.canvasSize = size;
    this.margin = margin;
    this.cellSize = (this.canvasSize - 2 * this.margin) / 8;
    this.selectedPawn = null;
    this.selectedPawnMoves = [];
    this.board = new Board();

    this.pawnCharIcon = {
      K: "\u2654",
      Q: "\u2655",
      R: "\u2656",
      B: "\u2657",
      N: "\u2658",
      P: "\u2659",
    };
    this.events = {};
    this.boundHandleBoardClick = this.handleBoardClick.bind(this);
  }

  init() {
    this.drawChessBoard();
    this.addEventListeners();
  }

  drawChessBoard() {
    this.canvasCtx.clearRect(0, 0, this.canvasSize, this.canvasSize);

    for (let i = 0; i < 64; i++) {
      const isGreen = (i + Math.floor(i / 8)) % 2 === 1;
      this.canvasCtx.fillStyle = isGreen ? "#008000" : "#979797";
      this.canvasCtx.fillRect(
        this.margin + this.cellSize * (i % 8),
        this.margin + this.cellSize * Math.floor(i / 8),
        this.cellSize,
        this.cellSize
      );
    }
    // Selected box color
    if (this.selectedPawn) {
      const { x, y } = this.getPositionByBox(this.selectedPawn.pos);
      this.canvasCtx.fillStyle = "#a9fb05";
      this.canvasCtx.fillRect(x, y, this.cellSize, this.cellSize);
    }
    // King checked warning
    if (this.board.isKingInCheck(this.board.currentTurn)) {
      const kingBoardPosition = this.board.getPositionByName(
        "k",
        this.board.currentTurn
      )[0].pos;
      const { x, y } = this.getPositionByBox(kingBoardPosition);
      this.canvasCtx.fillStyle = "red";
      this.canvasCtx.fillRect(x, y, this.cellSize, this.cellSize);
    }

    this.drawPawns();
    this.drawPawnMoves(this.selectedPawnMoves);
  }

  drawPawns() {
    const pieces = this.board.getAllPieces();
    pieces.forEach((piece) => {
      const { x, y } = this.getPositionByBox(piece.pos);

      this.canvasCtx.globalAlpha =
        piece.team === this.board.currentTurn ? 1 : 0.6;
      this.canvasCtx.fillStyle = piece.team === "team1" ? "white" : "#033500";
      this.canvasCtx.textAlign = "center";
      this.canvasCtx.textBaseline = "middle";
      this.canvasCtx.font = "bold 35px Poppins";
      this.canvasCtx.fillText(
        this.pawnCharIcon[piece.name.toUpperCase()] || "",
        x + this.cellSize / 2,
        y + this.cellSize / 2,
        this.cellSize,
        this.cellSize
      );
      this.canvasCtx.globalAlpha = 1;
    });
  }

  drawPawnMoves(moves) {
    this.canvasCtx.fillStyle = "#fbe605";

    moves.forEach((move) => {
      const { x, y } = this.getPositionByBox(move);
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(
        x + this.cellSize / 2,
        y + this.cellSize / 2,
        this.cellSize / 4,
        0,
        Math.PI * 2
      );
      this.canvasCtx.fill();
      this.canvasCtx.closePath();
    });
  }

  getPositionByBox([row, col]) {
    return {
      x: this.margin + this.cellSize * col,
      y: this.margin + this.cellSize * row,
    };
  }

  getCellByPosition([x, y]) {
    return [Math.floor(y / this.cellSize), Math.floor(x / this.cellSize)];
  }

  addEventListeners() {
    this.canvas.addEventListener("click", this.boundHandleBoardClick, true);
  }

  removeListeners() {
    this.canvas.removeEventListener("click", this.boundHandleBoardClick, true);
  }

  handleBoardClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - this.margin;
    const mouseY = event.clientY - rect.top - this.margin;

    if (mouseX >= 0 && mouseY >= 0 && !this.board.isGameCompleted) {
      const targetedCellPosition = this.getCellByPosition([mouseX, mouseY]);
      const clickedPawn = this.board.getPieceByPosition(targetedCellPosition);

      if (
        this.selectedPawn &&
        this.selectedPawn.team === this.board.currentTurn &&
        this.selectedPawnMoves.length > 0
      ) {
        if (this.board.movePiece(this.selectedPawn.pos, targetedCellPosition)) {
          if (this.events["move"]) {
            this.events["move"]();
          }
          const nextTurn = this.board.nextTurn(this.board.currentTurn);
          if (this.board.isKingInCheck(nextTurn)) {
            this.announceWinner(this.board.currentTurn);
          }
        }
        this.resetSelection();
      } else if (clickedPawn && clickedPawn.team === this.board.currentTurn) {
        this.selectedPawn = clickedPawn;
        this.selectedPawnMoves = clickedPawn.getMoves(true);
      } else {
        this.resetSelection();
      }

      if (!this.board.isGameCompleted) this.drawChessBoard();
    }
  }

  on(type, callback) {
    if (!["move", "end"].includes(type)) return;
    this.events[type] = callback;
  }

  announceWinner(winnerTeam) {
    if (!this.isGameCompleted) {
      this.isGameCompleted = true;
      this.removeListeners();
      const timeoutAnnouncement = this.announceWinner.bind(this);
      setTimeout(timeoutAnnouncement, 1000, winnerTeam);
    }
    console.log("Winner Announce", winnerTeam, this.canvasSize);
    this.canvasCtx.fillStyle = "black";
    this.canvasCtx.fillRect(0, this.canvasSize / 2 - 50, this.canvasSize, 100);
    this.canvasCtx.textAlign = "center";
    this.canvasCtx.fillStyle = "Green";
    this.canvasCtx.textBaseline = "middle";
    this.canvasCtx.strokeStyle = "white";
    this.canvasCtx.font = "bold 50px Arial";
    this.canvasCtx.fillText(
      `🎉 ${winnerTeam.toUpperCase()} WON! 🎉`,
      this.canvasSize / 2,
      this.canvasSize / 2,
      this.canvasSize
    );
    this.canvasCtx.strokeText(
      `🎉${winnerTeam.toUpperCase()} WON!🎉`,
      this.canvasSize / 2,
      this.canvasSize / 2,
      this.canvasSize
    );
    if (this.events["end"]) {
      this.events["end"]();
    }
  }

  resetSelection() {
    this.selectedPawn = null;
    this.selectedPawnMoves = [];
  }
}

export default CanvasBoard;
