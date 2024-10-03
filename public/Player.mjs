class Player {
  constructor({ x, y, score, id, width = 50, height = 50 }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = score;
    this.width = width;
    this.height = height;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case 'up':
        this.y -= speed;
        break;
      case 'down':
        this.y += speed;
        break;
      case 'left':
        this.x -= speed;
        break;
      case 'right':
        this.x += speed;
        break;
    }
    // Keep the player within the bounds
    this.x = Math.max(0, Math.min(this.x, 500 - this.width));
    this.y = Math.max(0, Math.min(this.y, 500 - this.height));
  }

  collision(item) {
    return !(
      this.x > item.x + item.width ||
      this.x + this.width < item.x ||
      this.y > item.y + item.height ||
      this.y + this.height < item.y
    );
  }

  calculateRank(players) {
    players.sort((a, b) => b.score - a.score);
    const rank = players.findIndex((player) => player.id === this.id) + 1;
    return `Rank: ${rank}/${players.length}`;
  }
}

export default Player;
