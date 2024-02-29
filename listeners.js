import { rollDice } from "./dice.js";
import { renderLastDiceRoll, renderCurrentTurnStep, renderActivePlayerId, renderSelectedPiece } from "./render.js";
import GameState from "./gameState.js";

export const bindEventListeners = (gameState) => {
	// dice roll listener
	document.getElementById("rollDice").addEventListener("click", () => {
		gameState.lastDiceRoll = rollDice();
		renderLastDiceRoll(gameState.lastDiceRoll);
		// set current step to "move"
		gameState.currentTurnStep = GameState.turnSteps.MOVE;
		renderCurrentTurnStep(gameState.currentTurnStep);
	});

	// pass turn listener
	document.getElementById("passTurn").addEventListener("click", () => {
		if (gameState.activePlayer.id === gameState.playerOne.id) {
			gameState.activePlayer = gameState.playerTwo;
		} else if (gameState.activePlayer.id === gameState.playerTwo.id) {
			gameState.activePlayer = gameState.playerOne;
		}
		renderActivePlayerId(gameState.activePlayer.id);
	});

	// select piece listener
	const pieceEls = document.getElementsByClassName("piece");
	for (let pieceEl of pieceEls) {
		pieceEl.addEventListener("click", (e) => {
			if (parseInt(e.target.dataset.playerId) === gameState.activePlayer.id) {
				const piece = gameState.activePlayer.pieces.find((p) => p.id === parseInt(e.target.dataset.pieceId));
				gameState.selectedPiece = piece;
				renderSelectedPiece(piece);
			}
		});
	}
}
