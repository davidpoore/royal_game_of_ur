import GameState from "./gameState.js";
import { bindEventListeners } from "./listeners.js";
import { renderGameState } from "./render.js";

const GAME_STATE = new GameState();

window.onload = () => {
	renderGameState(GAME_STATE);
	bindEventListeners(GAME_STATE);
}
