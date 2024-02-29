import { rollDice } from "./dice.js";
import { renderLastDiceRoll, renderCurrentTurnStep, renderActivePlayerId, renderSelectedPiece, clearSelectedPiece, clearLastDiceRoll } from "./render.js";
import GameState from "./gameState.js";

export const bindEventListeners = (gameState) => {
	// dice roll listener
	document.getElementById("rollDice").addEventListener("click", (e) => {
		gameState.lastDiceRoll = rollDice();
		renderLastDiceRoll(gameState.lastDiceRoll);
		// set current step to "move"
		gameState.currentTurnStep = GameState.turnSteps.MOVE;
		renderCurrentTurnStep(gameState.currentTurnStep);

		// disable roll dice button & enable move button (debug only)
		e.target.disabled = true;
		document.getElementById("debugMovePiece").disabled = false;
	});

	// pass turn listener
	document.getElementById("passTurn").addEventListener("click", (e) => {
		// clear out last roll data
		clearLastDiceRoll();
		gameState.lastDiceRoll = [];

		if (gameState.activePlayer.id === gameState.playerOne.id) {
			gameState.activePlayer = gameState.playerTwo;
		} else if (gameState.activePlayer.id === gameState.playerTwo.id) {
			gameState.activePlayer = gameState.playerOne;
		}
		renderActivePlayerId(gameState.activePlayer.id);

		// set turn step to roll after setting active player
		gameState.currentTurnStep = GameState.turnSteps.ROLL;
		renderCurrentTurnStep(gameState.currentTurnStep);

		// enable roll dice button & disable pass turn button
		e.target.disabled = true;
		document.getElementById("rollDice").disabled = false;
	});

	// select piece listener
	const pieceEls = document.getElementsByClassName("piece");
	for (let pieceEl of pieceEls) {
		pieceEl.addEventListener("click", (e) => {
			if (gameState.currentTurnStep === GameState.turnSteps.MOVE && parseInt(e.target.dataset.playerId) === gameState.activePlayer.id) {
				const piece = gameState.activePlayer.pieces.find((p) => p.id === parseInt(e.target.dataset.pieceId));
				gameState.selectedPiece = piece;
				renderSelectedPiece(piece);
			}
		});
	}

	// DEBUG: intermediate "move" handler to test turn order
	document.getElementById("debugMovePiece").addEventListener("click", (e) => {
		// set turn step to pass after setting active player
		clearSelectedPiece();
		gameState.selectedPiece = null;
		gameState.currentTurnStep = GameState.turnSteps.PASS;
		renderCurrentTurnStep(gameState.currentTurnStep);

		// enable pass turn button & disable move button (debug only)
		e.target.disabled = true;
		document.getElementById("passTurn").disabled = false;
	});
}
