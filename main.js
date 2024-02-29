import GameState from "./gameState.js";

const GAME_STATE = new GameState();

const renderReservePiece = (playerId, pieceId) => {
	const pieceEl = document.createElement("span");
	pieceEl.classList.add(`p${playerId}`);
	pieceEl.classList.add("piece");
	pieceEl.id = `player-${playerId}-piece-${pieceId}`;
	document.getElementById(`player-${playerId}-reserves`).appendChild(pieceEl);
}

const renderActivePlayerId = (activePlayerId) => {
	document.getElementById("activePlayerId").innerHTML = activePlayerId;
}

const renderCurrentTurnStep = (currentTurnStep) => {
	document.getElementById("currentTurnStep").innerHTML = currentTurnStep;
}

const renderGameState = () => {
	const activePlayerId = GAME_STATE.activePlayerId;
	renderActivePlayerId(activePlayerId);
	
	const currentTurnStep = GAME_STATE.currentTurnStep;
	renderCurrentTurnStep(currentTurnStep);

	const playerOne = GAME_STATE.playerOne;
	const playerTwo = GAME_STATE.playerTwo;
	
	playerOne.pieces.forEach((piece) => {
		if (piece.position === "reserve") {
			renderReservePiece(playerOne.id, piece.id);
		}
	});
	
	playerTwo.pieces.forEach((piece) => {
		if (piece.position === "reserve") {
			renderReservePiece(playerTwo.id, piece.id);
		}
	});
}

window.onload = () => {
	renderGameState();
}
