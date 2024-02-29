import { rollDice } from "./dice.js";
import { renderLastDiceRoll } from "./render.js";

export const bindEventListeners = (gameState) => {
	// dice roll listener
	document.getElementById("rollDice").addEventListener("click", () => {
		gameState.lastDiceRoll = rollDice();
		renderLastDiceRoll(gameState.lastDiceRoll);
	});
}