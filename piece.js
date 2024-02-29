export default class Piece {
  constructor(id, playerId, position) {
		this.id = id;
    this.playerId = playerId;
    this.position = position;
		this.selected = false;
	}
	
	move(newPosition) { return this.position = newPosition; }
}
