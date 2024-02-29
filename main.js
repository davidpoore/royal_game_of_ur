import GameState from "./gameState.js";
import { bindEventListeners } from "./listeners.js";
import { renderGameState } from "./render.js";

const GAME_STATE = new GameState();

window.onload = () => {
	bindEventListeners(GAME_STATE);
	renderGameState(GAME_STATE);
}
