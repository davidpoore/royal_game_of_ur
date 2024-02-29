import { sumDiceRoll } from "./dice.js";

const renderPieces = (pieces) => {
	pieces.forEach((piece) => {
		if (piece.position === "reserve") {
			renderReservePiece(piece);
		}
	});
}

const renderReservePiece = (piece) => {
	const pieceEl = document.createElement("span");
	pieceEl.classList.add(`p${piece.playerId}`);
	pieceEl.classList.add("piece");
	pieceEl.id = `player-${piece.playerId}-piece-${piece.id}`;
	pieceEl.dataset.playerId = piece.playerId;
	pieceEl.dataset.pieceId = piece.id
	document.getElementById(`player-${piece.playerId}-reserves`).appendChild(pieceEl);
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

export const renderSelectedPiece = (piece) => {
	// clear previous selection
	clearSelectedPiece();

	// addclass to newly selected piece
	const pieceEl = document.getElementById(`player-${piece.playerId}-piece-${piece.id}`);
	pieceEl.classList.add("selectedPiece");

	// DEBUG: render selected piece info
	const selectedPieceEl = document.getElementById("selectedPieceInfo");
	selectedPieceEl.innerHTML = `Player ${piece.playerId}'s piece with id ${piece.id}`;
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

export const renderGameState = (gameState) => {
	// DEBUG: view active player
	const activePlayer = gameState.activePlayer;
	renderActivePlayerId(activePlayer.id);
	
	// DEBUG: view current turn step
	const currentTurnStep = gameState.currentTurnStep;
	renderCurrentTurnStep(currentTurnStep);

	gameState.players.forEach((player) => {
		renderPieces(player.pieces);
	});
	
	// render dice roll results
	const lastDiceRoll = gameState.lastDiceRoll;
	renderLastDiceRoll(lastDiceRoll);
}
