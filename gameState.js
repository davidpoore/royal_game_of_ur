import Player from "./player.js";

export default class GameState {
	constructor() {
		this.playerOne = new Player(1);
    this.playerTwo = new Player(2);
		this.activePlayerId = this.playerOne.id;
	}
}