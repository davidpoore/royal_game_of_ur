export default class Piece {
  constructor(id, player, position) {
		this.id = id;
    this.player = player;
    this.position = position;
		this.selected = false;
	}
	
	move(newPosition) { return this.position = newPosition; }
}
