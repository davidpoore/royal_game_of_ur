import Player from "./player.js";

const TURN_STEPS = {
	ROLL: "roll",
	MOVE: "move",
	PASS: "pass"
}

export default class GameState {
	constructor() {
		this.playerOne = new Player(1);
    this.playerTwo = new Player(2);
		this.activePlayer = this.playerOne;
		this.currentTurnStep = TURN_STEPS.ROLL;
		this.lastDiceRoll = [];
		this.selectedPiece = null;
	}

	static get turnSteps() { return TURN_STEPS; }

	get players() { return [this.playerOne, this.playerTwo]; }
}
