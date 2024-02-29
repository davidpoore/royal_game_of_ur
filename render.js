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
	document.getElementById(`player-${piece.playerId}-reserves`).appendChild(pieceEl);
}

export const renderLastDiceRoll = (lastDiceRoll) => {
	if (lastDiceRoll.length === 4) {
		const diceEl = document.getElementById("lastDiceRoll");
		diceEl.innerHTML = '';
		
		lastDiceRoll.forEach((die) => {
			const dieEl = document.createElement("span");
			dieEl.classList.add(`die-${die}`);
			diceEl.appendChild(dieEl);
		});
		
		const totalSpan = document.createElement("span");
		totalSpan.innerHTML = `(Total: ${sumDiceRoll(lastDiceRoll)})`;
		diceEl.append(totalSpan);
	}
}

const renderActivePlayerId = (activePlayerId) => {
	document.getElementById("activePlayerId").innerHTML = activePlayerId;
}

const renderCurrentTurnStep = (currentTurnStep) => {
	document.getElementById("currentTurnStep").innerHTML = currentTurnStep;
}

export const renderGameState = (gameState) => {
	// DEBUG: view active player
	const activePlayerId = gameState.activePlayerId;
	renderActivePlayerId(activePlayerId);
	
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