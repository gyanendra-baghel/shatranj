import { isLowerCase } from "../utils/helpers";
import Pawn from "./pawn";

class Board {
  constructor() {
    this.boardState = this.initializeBoard();
    this.currentTurn = "team1";
    this.isGameCompleted = false;
  }

  getAllPieces() {
    const pieces = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.boardState[i][j]) {
          pieces.push(new Pawn(this.boardState[i][j], [i, j], this));
        }
      }
    }

    return pieces;
  }

  getPositionByName(name, team = "team1") {
    name = team === "team1" ? name.toLowerCase() : name.toUpperCase();
    const pieces = this.getAllPieces();
    const positions = pieces.filter((piece) =>
      piece.name == name ? piece.pos : false
    );

    return positions.length > 0 ? positions : null;
  }

  getPieceByPosition(position) {
    const [x, y] = position;
    if (x < 0 || x >= 8 || y < 0 || y >= 8 || !this.boardState[x][y])
      return null;
    return new Pawn(this.boardState[x][y], position, this);
  }

  movePiece(start, target) {
    const selectedPawn = this.getPieceByPosition(start);
    if (!selectedPawn) return false;
    const isValidMove = selectedPawn
      .getMoves()
      .some((move) => move[0] === target[0] && move[1] === target[1]);
    if (!isValidMove) return false;

    if (this.isKingCassel(selectedPawn, target)) {
      const side = target[1] > 4 ? "right" : "left";
      this.handleCastle(selectedPawn, side);
    } else if (this.isPawnMoveDiagonal(selectedPawn, target)) {
      this.handlePawnMoveDiagonal(selectedPawn, target);
    } else if (this.isPawnPromotion(selectedPawn, target)) {
      this.pawnPromotion(selectedPawn, target);
    } else {
      this.boardState[start[0]][start[1]] = null;
      this.boardState[target[0]][target[1]] = selectedPawn.name;
    }

    this.currentTurn = this.nextTurn();
    return true;
  }

  initializeBoard() {
    return [
      ["r", "n", "b", "q", "k", "b", "n", "r"],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
    ];
  }
  nextTurn() {
    return this.currentTurn === "team1" ? "team2" : "team1";
  }

  isPawnPromotion(pawn, target) {
    const promotionRow = isLowerCase(pawn.name) ? 7 : 0;
    if (pawn.name.toLowerCase() == "p" && target[0] == promotionRow)
      return true;
    return false;
  }

  pawnPromotion(pawn, target) {
    const name = isLowerCase(pawn.name) ? "q" : "Q";
    this.boardState[pawn.pos[0]][pawn.pos[1]] = null;
    this.boardState[target[0]][target[1]] = name;
  }

  isPawnMoveDiagonal(pawn, target) {
    const direction = isLowerCase(pawn.name) ? 1 : -1;
    if (pawn.name.toLowerCase() == "p" && pawn.pos[0] - direction == target[0])
      return true;
    return false;
  }

  handlePawnMoveDiagonal(pawn, target) {
    const direction = -(pawn.pos[1] - target[1]);

    this.boardState[pawn.pos[0]][target[1]] = null;

    this.boardState[pawn.pos[0]][pawn.pos[1]] = null;
    this.boardState[target[0]][target[1]] = pawn.name;
  }

  isKingCassel(selectedPawn, target) {
    if (
      selectedPawn.name.toLowerCase() === "k" &&
      Math.abs(target[1] - selectedPawn.pos[1]) === 2
    ) {
      return true;
    }
    return false;
  }

  handleCastle(king, side) {
    const row = this.currentTurn === "team1" ? 0 : 7;

    const rookCol = side === "right" ? 7 : 0;
    const newKingCol = side === "right" ? 6 : 2;
    const newRookCol = side === "right" ? 5 : 3;

    const rook = this.getPieceByPosition([row, rookCol]);

    this.boardState[king.pos[0]][king.pos[1]] = null;
    this.boardState[rook.pos[0]][rook.pos[1]] = null;
    this.boardState[row][newKingCol] = king.name;
    this.boardState[row][newRookCol] = rook.name;
  }

  isKingInCheck(team) {
    const teamKing = this.getPositionByName("k", team)[0];
    if (!teamKing) return true;

    const enemyTeam = team === "team1" ? "team2" : "team1";
    return this.getAllPieces().some(
      (piece) =>
        piece.team === enemyTeam &&
        piece
          .getMoves()
          .some(
            (move) => move[0] === teamKing.pos[0] && move[1] === teamKing.pos[1]
          )
    );
  }
}

const pawnCharIcon = {
  K: "\u2654",
  Q: "\u2655",
  R: "\u2656",
  B: "\u2657",
  N: "\u2658",
  P: "\u2659",
  k: "\u266A",
  q: "\u266B",
  r: "\u266C",
  b: "\u266D",
  n: "\u266E",
  p: "\u266F",
};

export default Board;
