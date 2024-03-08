import { rollDice, sumDiceRoll } from "./dice.js";
import { renderLastDiceRoll, renderCurrentTurnStep, renderActivePlayerId, renderSelectedPiece, renderValidMoves, renderPieces, renderScores, renderGameState, clearValidMoves, clearSelectedPiece, clearLastDiceRoll, clearActivePieceEls } from "./render.js";
import { calculateValidMoves } from "./validation.js";
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

		// if die roll is 0 OR player has no valid moves, move to pass turn automatically
		const opponent = gameState.activePlayer.id === 1 ? gameState.playerTwo : gameState.playerOne;
		const totalValidMoves = calculateValidMoves(gameState.activePlayer.pieces, opponent.pieces, sumDiceRoll(gameState.lastDiceRoll));
		if (totalValidMoves === 0) {
			// render no valid moves message and move to pass turn
		  gameState.currentTurnStep = GameState.turnSteps.PASS;
			renderCurrentTurnStep(gameState.currentTurnStep);

			document.getElementById("noValidMoves").style.display = '';

			document.getElementById("passTurn").disabled = false;
		}
	});

	// pass turn listener
	document.getElementById("passTurn").addEventListener("click", (e) => {
		// clear out last roll data and hide no valid moves if it is displayed
		clearLastDiceRoll();
		gameState.lastDiceRoll = [];
		document.getElementById("noValidMoves").style.display = 'none';

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
			if(spaceEl.classList.contains("valid") && gameState.selectedPiece) {
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

				clearSelectedPiece();
				gameState.selectedPiece = null;

				clearActivePieceEls();

				// check if space was a star space - if so, reset to roll step
				if (spaceEl.classList.contains("star")) {
					gameState.currentTurnStep = GameState.turnSteps.ROLL;
					document.getElementById("rollDice").disabled = false;
					document.getElementById("passTurn").disabled = true;

					// clear out last roll data
					clearLastDiceRoll();
					gameState.lastDiceRoll = [];
				} else {
					gameState.currentTurnStep = GameState.turnSteps.PASS;
					// render scores
					renderScores(gameState);
					// if active player has a score of 7, they win! Display victory overly and new game button
					if (gameState.activePlayer.score === 7) {
						document.getElementById("victoryMessage").innerHTML = `Player ${gameState.activePlayer.id} Wins!`;
						document.getElementById("victoryOverlay").style.display = '';
						return;
					}
					document.getElementById("passTurn").disabled = false;
				}

				renderCurrentTurnStep(gameState.currentTurnStep);
			}
		})
	}

	// new game button listener
	document.getElementById("newGame").addEventListener("click", (e) => {
		document.getElementById("victoryOverlay").style.display = 'none';
		clearLastDiceRoll();
		document.getElementById("rollDice").disabled = false;
		gameState = new GameState();
		renderGameState(gameState);
	});
}
