import { sumDiceRoll } from "./dice.js";
import GameState from "./gameState.js";
import { pieceClickCallback } from "./listeners.js";

const renderPiece = (piece, gameState) => {
	// piece in HOME aren't rendered
	if (piece.position === 15) {
	  return;
	}

	const pieceEl = document.createElement("span");
	pieceEl.classList.add(`p${piece.player.id}`);
	pieceEl.classList.add("piece");
	pieceEl.id = `player-${piece.player.id}-piece-${piece.id}`;
	pieceEl.dataset.playerId = piece.player.id;
	pieceEl.dataset.pieceId = piece.id

	let parentEl;
	if (piece.position === 0) {
		parentEl = document.getElementById(`player-${piece.player.id}-reserves`);
	} else if (GameState.nonSharedSpaces.includes(piece.position)) {
		parentEl = document.getElementById(`player-${piece.player.id}-space-${piece.position}`);
	} else {
		parentEl = document.getElementById(`space-${piece.position}`);
	}

	// rebind clickListener
	pieceEl.addEventListener("click", (e) => {
		pieceClickCallback(e, gameState);
	});

	parentEl.appendChild(pieceEl);
}

const clearPieces = (playerId) => {
	const pieceEls = document.getElementsByClassName(`p${playerId} piece`);
	for (let i = pieceEls.length - 1; i >= 0; i--) {
		pieceEls[i].remove();
	}
}

export const renderPieces = (pieces, gameState) => {
	// clear pieces before re-rendering
	clearPieces(pieces[0].player.id);
	pieces.forEach((piece) => {
		renderPiece(piece, gameState);
	});
}

export const clearSelectedPiece = () => {
	const selectedPieceEls = document.getElementsByClassName("selectedPiece");
	if (selectedPieceEls.length > 0) {
		for (let selectedPieceEl of selectedPieceEls) {
			selectedPieceEl.classList.remove("selectedPiece");
		}
	}

	// DEBUG: clear selected piece info
	const selectedPieceEl = document.getElementById("selectedPieceInfo");
	selectedPieceEl.innerHTML = '';
}

export const clearValidMoves = () => {
	const validPieceEls = document.getElementsByClassName("space valid");
		if (validPieceEls.length > 0) {
		for (let validPieceEl of validPieceEls) {
			validPieceEl.classList.remove("valid");
		}
	}
}

export const renderSelectedPiece = (piece) => {
	// clear previous selection
	clearSelectedPiece();

	// addclass to newly selected piece
	const pieceEl = document.getElementById(`player-${piece.player.id}-piece-${piece.id}`);
	pieceEl.classList.add("selectedPiece");

	// DEBUG: render selected piece info
	const selectedPieceEl = document.getElementById("selectedPieceInfo");
	selectedPieceEl.innerHTML = `Player ${piece.player.id}'s piece with id ${piece.id}`;
};

export const clearLastDiceRoll = () => {
	const diceEl = document.getElementById("lastDiceRoll");
	diceEl.innerHTML = '';
}

export const renderLastDiceRoll = (lastDiceRoll) => {
	if (lastDiceRoll.length === 4) {
		const diceEl = document.getElementById("lastDiceRoll");
		
		lastDiceRoll.forEach((die) => {
			const dieEl = document.createElement("span");
			dieEl.classList.add("die");
			dieEl.classList.add(`die-${die}`);
			diceEl.appendChild(dieEl);
		});
		
		const totalSpan = document.createElement("span");
		totalSpan.innerHTML = `(Total: ${sumDiceRoll(lastDiceRoll)})`;
		diceEl.append(totalSpan);
	}
}

export const renderActivePlayerId = (activePlayerId) => {
	document.getElementById("activePlayerId").innerHTML = activePlayerId;
}

export const renderCurrentTurnStep = (currentTurnStep) => {
	document.getElementById("currentTurnStep").innerHTML = currentTurnStep;
}

export const renderScores = (gameState) => {
	document.getElementById("player-1-score").innerHTML = gameState.playerOne.score;
	document.getElementById("player-2-score").innerHTML = gameState.playerTwo.score;
}

export const renderValidMoves = (gameState) => {
	// clear previous selected piece valid moves
	clearValidMoves();

	const selectedPiece = gameState.selectedPiece;
	const dieRoll = gameState.lastDiceRoll;
	const rollTotal = sumDiceRoll(dieRoll);
	const player = selectedPiece.player;
	let opponent;
	if (gameState.activePlayer.id === gameState.playerOne.id) {
		opponent = gameState.playerTwo;
	} else {
		opponent = gameState.playerOne;
	}

	const validPosition = selectedPiece.position + rollTotal;
	// check if any piece for this player already in that space
	const piecePositions = player.pieces.map((p) => { return p.position });

  // can't go beyond the HOME space so 15 is the max
	// also, the only position that can have multiple because they aren't rendered & is final space
	if ((piecePositions.includes(validPosition) && validPosition !== 15) || validPosition > 15) {
		return; // early return, not a valid move for this piece
	}

	let validSpace;
	if (GameState.nonSharedSpaces.includes(validPosition)) {
		validSpace = document.getElementById(`player-${player.id}-space-${validPosition}`);
	} else {
		validSpace = document.getElementById(`space-${validPosition}`);

		// check if space is a star AND has an opponent's piece (stars are safe)
		if (validSpace.classList.contains("star") && opponent.pieces.map((p) => { return p.position }).includes(validPosition)) {
			// return early - not a valid move
			return;
		}
	}


	validSpace.classList.add("valid");
}

export const renderGameState = (gameState) => {
	// DEBUG: view active player
	const activePlayer = gameState.activePlayer;
	renderActivePlayerId(activePlayer.id);
	
	// DEBUG: view current turn step
	const currentTurnStep = gameState.currentTurnStep;
	renderCurrentTurnStep(currentTurnStep);

	gameState.players.forEach((player) => {
		renderPieces(player.pieces, gameState);
	});
	
	// render dice roll results
	const lastDiceRoll = gameState.lastDiceRoll;
	renderLastDiceRoll(lastDiceRoll);

	// render scores
	renderScores(gameState);
}
