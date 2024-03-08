import Player from "./player.js";

const TURN_STEPS = {
	ROLL: "roll",
	MOVE: "move",
	PASS: "pass"
}

const NON_SHARED_SPACES = [1,2,3,4,13,14,15];
const CENTER_STAR_SPACE_POSITION = 8;

export default class GameState {
	constructor() {
		this.playerOne = new Player(1);
    this.playerTwo = new Player(2);
		this.activePlayer = this.playerOne;
		this.currentTurnStep = TURN_STEPS.ROLL;
		this.lastDiceRoll = [0,0,0,0];
		this.selectedPiece = null;
	}

	static get turnSteps() { return TURN_STEPS; }

	static get nonSharedSpaces() { return NON_SHARED_SPACES; }

	static get centerStarPosition() { return CENTER_STAR_SPACE_POSITION; }

	get players() { return [this.playerOne, this.playerTwo]; }
}
