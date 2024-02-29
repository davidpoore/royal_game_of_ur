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
		this.activePlayerId = this.playerOne.id;
		this.currentTurnStep = TURN_STEPS.ROLL;
		this.lastDiceRoll = [];
	}

	static get turnSteps() { return TURN_STEPS; }

	get players() { return [this.playerOne, this.playerTwo]; }
}
