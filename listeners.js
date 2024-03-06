import { rollDice, sumDiceRoll } from "./dice.js";
import { renderLastDiceRoll, renderCurrentTurnStep, renderActivePlayerId, renderSelectedPiece, renderValidMoves, renderPieces, clearValidMoves, clearSelectedPiece, clearLastDiceRoll } from "./render.js";
import GameState from "./gameState.js";

export const pieceClickCallback = (e, gameState) => {
	if (gameState.currentTurnStep === GameState.turnSteps.MOVE && parseInt(e.target.dataset.playerId) === gameState.activePlayer.id) {
		const piece = gameState.activePlayer.pieces.find((p) => p.id === parseInt(e.target.dataset.pieceId));
		gameState.selectedPiece = piece;
		renderSelectedPiece(piece);
		renderValidMoves(gameState);
	}
}

export const bindEventListeners = (gameState) => {
	// dice roll listener
	document.getElementById("rollDice").addEventListener("click", (e) => {
		gameState.lastDiceRoll = rollDice();
		renderLastDiceRoll(gameState.lastDiceRoll);
		// set current step to "move"
		gameState.currentTurnStep = GameState.turnSteps.MOVE;
		renderCurrentTurnStep(gameState.currentTurnStep);

		// disable roll dice button
		e.target.disabled = true;

		// if die roll is 0, move to pass turn automatically
		if (sumDiceRoll(gameState.lastDiceRoll) === 0) {
			gameState.currentTurnStep = GameState.turnSteps.PASS;
			renderCurrentTurnStep(gameState.currentTurnStep);

			document.getElementById("passTurn").disabled = false;
		}
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

	// select valid space listener
	const spaceEls = document.getElementsByClassName("space");
	for (let spaceEl of spaceEls) {
		spaceEl.addEventListener("click", (e) => {
			if(spaceEl.classList.contains("valid")) {
				gameState.selectedPiece.position = parseInt(e.target.dataset.position);

				// check for any opponent pieces in position
				const opponent = gameState.players.find((p) => p.id !== gameState.activePlayer.id);
				opponent.pieces.forEach((piece) => {
					if (!GameState.nonSharedSpaces.includes(piece.position) && piece.position === gameState.selectedPiece.position) {
						// send to reserves
						piece.position = 0;
					}
				})
				renderPieces(opponent.pieces, gameState);

				clearValidMoves();
				renderPieces(gameState.activePlayer.pieces, gameState);

				// rebind click listener
				// document.getElementById(`player-${gameState.selectedPiece.player.id}-piece-${gameState.selectedPiece.id}`).addEventListener("click", (e) => { pieceClickCallback(e, gameState); });

				clearSelectedPiece();
				gameState.selectedPiece = null;
				gameState.currentTurnStep = GameState.turnSteps.PASS;
				renderCurrentTurnStep(gameState.currentTurnStep);

				document.getElementById("passTurn").disabled = false;
			}
		})
	}
}
