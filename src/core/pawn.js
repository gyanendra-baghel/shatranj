import { isLowerCase, isUpperCase } from "../utils/helpers";

class Pawn {
  constructor(name, pos, board) {
    this.board = board;
    this.pos = pos;
    this.name = name;
    this.team = isLowerCase(name) ? "team1" : "team2";
    this.color = isLowerCase(name) ? "white" : "#1d441d";
    this.hasMoved = false; // TODO: update dynamically
  }

  getMoves(canKingCassel = true) {
    let moves = [];
    const name = this.name.toLowerCase();
    const directions = {
      n: [
        [-2, -1],
        [-1, -2],
        [1, -2],
        [2, -1],
        [2, 1],
        [1, 2],
        [-1, 2],
        [-2, 1],
      ],
      k: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ],
    };

    if (name == "p") {
      moves = this.getPawnMoves();
    } else if (name == "b") {
      moves = this.getLinearMoves(false, true);
    } else if (name == "r") {
      moves = this.getLinearMoves(true, false);
    } else if (name == "q") {
      moves = this.getLinearMoves(true, true);
    } else if (name == "k" || name == "n") {
      directions[name].forEach(([dx, dy]) => {
        const currentPos = [this.pos[0] + dx, this.pos[1] + dy];
        const piece = this.board.getPieceByPosition(currentPos);
        const _isValidPosition = this.isValidPosition(currentPos);
        if (_isValidPosition && (!piece || piece.team != this.team)) {
          moves.push(currentPos);
        }
      });
      // king cassel
      if (name == "k" && canKingCassel) {
        if (this.canCastle("right")) {
          moves.push([this.pos[0], this.pos[1] + 2]);
        }
        if (this.canCastle("left")) {
          moves.push([this.pos[0], this.pos[1] - 2]);
        }
      }
    }

    return moves;
  }

  getLinearMoves(horizontal, diagonal) {
    const [x, y] = this.pos;
    const moves = [];
    const directions = [];

    if (horizontal) directions.push([1, 0], [-1, 0], [0, 1], [0, -1]);
    if (diagonal) directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);

    directions.forEach(([dx, dy]) => {
      let nx = x + dx;
      let ny = y + dy;

      while (nx > -8 && ny > -8 && nx < 8 && ny < 8) {
        if (!this.isValidPosition([nx, ny])) break;
        const piece = this.board.getPieceByPosition([nx, ny]);
        if (piece) {
          if (piece.team != this.team) moves.push([nx, ny]);
          break;
        }
        moves.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
    });
    return moves;
  }

  getPawnMoves() {
    const [x, y] = this.pos;
    const moves = [];
    const direction = this.team === "team1" ? 1 : -1;
    const startRow = this.team === "team1" ? 1 : 6;

    if (!this.board.getPieceByPosition([x + direction, y])) {
      moves.push([x + direction, y]);
      if (
        x === startRow &&
        !this.board.getPieceByPosition([x + 2 * direction, y])
      ) {
        moves.push([x + 2 * direction, y]);
      }
    }
    // special killing move
    [-1, 1].forEach((dy) => {
      // front diagonal move
      const capturePos = [x + direction, y + dy];
      const pawn = this.board.getPieceByPosition(capturePos);
      if (pawn && pawn.team !== this.team) moves.push(capturePos);
      // back diagonal move
      if (x === startRow + 2 * direction) {
        const piece = this.board.getPieceByPosition([x, y + dy]);
        if (piece && piece.team != this.team)
          moves.push([x - direction, y + dy]);
      }
    });

    return moves;
  }

  canCastle(side) {
    if (this.name.toLowerCase() !== "k" || this.pos[1] !== 4 || this.hasMoved)
      return false;

    const kingRow = this.pos[0];
    const rookCol = side === "right" ? 7 : 0;
    const direction = side === "right" ? 1 : -1;

    const piece = this.board.getPieceByPosition([kingRow, rookCol]);
    if (piece === null || piece.name.toLowerCase() != "r") return false;

    for (let col = this.pos[1] + direction; col !== rookCol; col += direction) {
      if (this.board.getPieceByPosition([kingRow, col]) !== null) return false;
    }
    return true;
  }

  isValidPosition([x, y]) {
    return x >= 0 && y >= 0 && x < 8 && y < 8;
  }
}

export default Pawn;
