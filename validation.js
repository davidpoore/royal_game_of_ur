import GameState from "./gameState.js";

export const calculateValidMovesForPiece = (piece, activePiecePositions, opponentPiecePositions, dieRoll) => {
	let numValidMoves = 0;
	const possiblePosition = piece.position + dieRoll;
	if (possiblePosition > 15 || piece.position === 15) return numValidMoves; // if possiblePosition is beyond Home space or piece is already Home, return early
	if (possiblePosition === 15) numValidMoves++; // 15 is always valid because it is Home, which scores
	// if piece can move to a position that doesn't contain their own piece
	// AND
	// if space is the center star AND it DOES NOT contain an opponent's piece, it has a valid move
	if (!activePiecePositions.includes(possiblePosition)) {
		if (possiblePosition === GameState.centerStarPosition && opponentPiecePositions.includes(GameState.centerStarPosition)) {
			return numValidMoves; // return early as this is not a valid move
		} else {
			numValidMoves++;
		}
	}
	
	return numValidMoves;
}

export const calculateValidMoves = (activePlayerPieces, opponentPieces, dieRoll) => {
	let totalValidMoves = 0;

	if (dieRoll === 0) return totalValidMoves; // die roll of 0 has no valid moves ever

	const activePiecePositions = activePlayerPieces.map((p) => p.position);
	const opponentPiecePositions = opponentPieces.map((p) => p.position);	

	activePlayerPieces.forEach((piece) => {
		totalValidMoves += calculateValidMovesForPiece(piece, activePiecePositions, opponentPiecePositions, dieRoll);
	});
	
	return totalValidMoves;
}
