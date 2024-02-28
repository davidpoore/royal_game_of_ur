import GameState from "./gameState.js";

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

const renderGameState = () => {
	const gameState = JSON.parse(sessionStorage.getItem("gameState"));
	
	const activePlayerId = gameState.activePlayerId;
	renderActivePlayerId(activePlayerId);
	
	const playerOne = gameState.playerOne;
	const playerTwo = gameState.playerTwo;
	
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
	const gameState = new GameState();
	sessionStorage.setItem("gameState", JSON.stringify(gameState));
	renderGameState();
}
