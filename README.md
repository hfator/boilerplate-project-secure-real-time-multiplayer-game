# Secure Real Time Multiplayer Game

This is the boilerplate for the Secure Real Time Multiplayer Game project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/information-security/information-security-projects/secure-real-time-multiplayer-game

Create a secure multiplayer game in which each player can move their avatar, there is at least one collectible item, and the rank of the players is calculated based on their score.

For details consult the tests below.

Make sure that your game is secure! Include these security measures:

The client should not be able to guess/sniff the MIME type
Prevent XSS attacks
Do not cache anything from the website in the client
The headers say that the site is powered by PHP 7.4.3
Note: helmet@^3.21.3 is needed for the user stories. This means you will need to use the previous version of Helmet's docs, for information on how to achieve the user stories.

1. You can provide your own project, not the example URL.
2. Multiple players can connect to a server and play.
3. Each player has an avatar.
4. Each player is represented by an object created by the Player class in Player.mjs.
5. At a minimum, each player object should contain a unique id, a score, and x and y coordinates representing the player's current position.
6. The game has at least one type of collectible item. Complete the Collectible class in Collectible.mjs to implement this.
7. At a minimum, each collectible item object created by the Collectible class should contain a unique id, a value, and x and y coordinates representing the item's current position.
8. Players can use the WASD and/or arrow keys to move their avatar. Complete the movePlayer method in Player.mjs to implement this.
9. The movePlayer method should accept two arguments: a string of "up", "down", "left", or "right", and a number for the amount of pixels the player's position should change. movePlayer should adjust the x and y coordinates of the player object it's called from.
10. The player's score should be used to calculate their rank among the other players. Complete the calculateRank method in the Player class to implement this.
11. The calculateRank method should accept an array of objects representing all connected players and return the string Rank: currentRanking/totalPlayers. For example, in a game with two players, if Player A has a score of 3 and Player B has a score of 5, calculateRank for Player A should return Rank: 2/2.
12. Players can collide with a collectible item. Complete the collision method in Player.mjs to implement this.
13. The collision method should accept a collectible item's object as an argument. If the player's avatar intersects with the item, the collision method should return true.
14. All players are kept in sync.
15. Players can disconnect from the game at any time.
16. Prevent the client from trying to guess / sniff the MIME type.
17. Prevent cross-site scripting (XSS) attacks.
18. Nothing from the website is cached in the client.
19. The headers say that the site is powered by "PHP 7.4.3" even though it isn't (as a security measure).