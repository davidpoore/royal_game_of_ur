import Piece from "./piece.js";
const NUM_PIECES = 7;

export default class Player {
	constructor(id) {
		this.id = id;
		this.pieces = [];
		for (let i = 0; i < NUM_PIECES; i++) {
			this.pieces.push(new Piece(i, this, 0));
		}
	}
	
	static get numPieces() { return NUM_PIECES; }

	// position 15 is "HOME" and counts as a scored piece
	get score() { return this.pieces.filter((p) => p.position === 15).length; }
}
