import { rollDice, sumDiceRoll } from "./dice.js";
import { renderLastDiceRoll, renderCurrentTurnStep, renderActivePlayerId, renderSelectedPiece, renderValidMoves, renderPieces, renderScores, renderGameState, clearValidMoves, clearSelectedPiece, clearLastDiceRoll, clearActivePieceEls } from "./render.js";
import { calculateValidMoves } from "./validation.js";
import GameState from "./gameState.js";

const passTurn = (gameState) => {
	document.getElementById("noValidMoves").style.visibility = 'hidden';

	if (gameState.activePlayer.id === gameState.playerOne.id) {
		gameState.activePlayer = gameState.playerTwo;
	} else if (gameState.activePlayer.id === gameState.playerTwo.id) {
		gameState.activePlayer = gameState.playerOne;
	}
	renderActivePlayerId(gameState.activePlayer.id);

	// set turn step to roll after setting active player
	gameState.currentTurnStep = GameState.turnSteps.ROLL;
	renderCurrentTurnStep(gameState.currentTurnStep);

	document.getElementById("rollDice").disabled = false;
}

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
			// render no valid moves message and move to pass turn after a short delay
		  gameState.currentTurnStep = GameState.turnSteps.PASS;
			renderCurrentTurnStep(gameState.currentTurnStep);

			document.getElementById("noValidMoves").style.visibility = '';

			setTimeout(() => passTurn(gameState), 2000);
		}
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
					// passTurn after move
					passTurn(gameState);
				}

				renderCurrentTurnStep(gameState.currentTurnStep);
			}
		})
	}

	// new game button listener
	document.getElementById("newGame").addEventListener("click", (e) => {
		document.getElementById("victoryOverlay").style.display = 'none';
		document.getElementById("rollDice").disabled = false;
		gameState = new GameState();
		renderGameState(gameState);
	});
}
