import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let playerId;
let players = {};
let collectibles = {};

socket.on('init', ({ id, playersData, collectiblesData }) => {
    playerId = id;

    players = {};
    for (let key in playersData) {
        players[key] = new Player(playersData[key]);
    }
    collectibles = {};
    for (let key in collectiblesData) {
        collectibles[key] = new Collectible(collectiblesData[key]);
    }

    requestAnimationFrame(gameLoop);
});

socket.on('updatePlayers', (playersData) => {
    for (let key in playersData) {
        if (players[key]) {
            players[key].x = playersData[key].x;
            players[key].y = playersData[key].y;
            players[key].score = playersData[key].score;
        } else {
            players[key] = new Player(playersData[key]);
        }
    }
});

socket.on('updateCollectibles', (collectiblesData) => {
    collectibles = {};
    for (let key in collectiblesData) {
        collectibles[key] = new Collectible(collectiblesData[key]);
    }
});

document.addEventListener('keydown', (e) => {
    const speed = 5;
    let direction = null;

    if (e.key === 'ArrowUp' || e.key === 'w') direction = 'up';
    if (e.key === 'ArrowDown' || e.key === 's') direction = 'down';
    if (e.key === 'ArrowLeft' || e.key === 'a') direction = 'left';
    if (e.key === 'ArrowRight' || e.key === 'd') direction = 'right';

    if (direction) {
        const player = players[playerId];
        if (player) {
            player.movePlayer(direction, speed);

            for (let id in collectibles) {
                if (player.collision(collectibles[id])) {
                    player.score += collectibles[id].value;
                    delete collectibles[id];

                    socket.emit('collect', { collectibleId: id, playerId: playerId });
                }
            }

            socket.emit('updatePosition', { x: player.x, y: player.y, score: player.score });
        }
    }
});

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in collectibles) {
        const collectible = collectibles[id];
        context.fillStyle = 'gold';
        context.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    }

    for (let id in players) {
        const player = players[id];
        context.fillStyle = id === playerId ? 'blue' : 'red';
        context.fillRect(player.x, player.y, player.width, player.height);

        context.fillStyle = 'black';
        const rankText = player.calculateRank(Object.values(players));
        context.fillText(`Score: ${player.score} | ${rankText}`, player.x, player.y - 10);
    }

    requestAnimationFrame(gameLoop);
}
