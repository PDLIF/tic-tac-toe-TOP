const readline = require('readline');


const Gameboard = (function () {
    let board = Array(9).fill('');

    function printBoard() {
        console.log(`
            ${board[0]} | ${board[1]} | ${board[2]}
            ---------
            ${board[3]} | ${board[4]} | ${board[5]}
            ---------
            ${board[6]} | ${board[7]} | ${board[8]}
        `);
    }

    function placeMarker(index, marker) {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    }

    function resetBoard() {
        board = Array(9).fill('');
    }

    function getBoard() {
        return board;
    }

    return {printBoard, placeMarker, resetBoard, getBoard};
})();



const Player = function (marker) {
    let score = 0;

    function makeTurn(index) {
        const success = Gameboard.placeMarker(index, marker);
        if (!success) {
            console.log('Invalid move. Spot already taken!');
        }
        return success;
    }

    function getMarker() {
        return marker;
    }

    function increaseScore() {
        score++;
    }

    function getScore() {
        return score;
    }

    return {makeTurn, getMarker, increaseScore, getScore};
}



const GameController = (function () {
   let gameActive = false;
   let currentPlayer;
   const playerX = Player('X');
   const playerO = Player('O');

   const rl = readline.createInterface({
       input: process.stdin,
       output: process.stdout,
   });

   function startGame() {
       Gameboard.resetBoard();
       currentPlayer = playerX;
       gameActive = true;
       Gameboard.printBoard();
       playConsoleGame();
   }

   function playConsoleGame() {
        rl.question(`Player ${currentPlayer.getMarker()}, enter your move (0-8): `, (input) => {
                const parsedIndex = parseInt(input, 10);

                if (isNaN(parsedIndex) || parsedIndex < 0 || parsedIndex > 8) {
                    console.log("Invalid input. Please enter a number between 0 and 8.");
                    playConsoleGame(); // Ask again
                    return;
                }

                const turnEnded = playTurn(parsedIndex);

                if (!gameActive) {
                    rl.question('Do you want to play again? (y/n): ', (input) => {
                        if (input.toLowerCase() === 'y') {
                            GameController.startGame();
                        } else {
                            console.log('Thanks for playing!');
                            rl.close();
                        }
                    });
                } else {
                    playConsoleGame();
                }
            }
        );
   }

   function switchTurn() {
       currentPlayer = currentPlayer === playerX ? playerO : playerX;
   }

   function playTurn(index) {
        const success = currentPlayer.makeTurn(index);

        Gameboard.printBoard();

        if (checkWinner()) {
            console.log(`Player ${currentPlayer.getMarker()} wins`);
            currentPlayer.increaseScore();
            gameActive = false;
            return true;
        }
        if (isTie()) {
            console.log(`It's a tie`);
            gameActive = false;
            return true;
        }

        switchTurn();
        return false;
   }

   function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],           // Diagonals
        ];

        const board = Gameboard.getBoard();
        return winningCombos.some(combo => {
            return combo.every(index => board[index] === currentPlayer.getMarker());
        });
   }

   function isTie() {
       return Gameboard.getBoard().every(cell => cell !== '');
   }

   return {startGame};
})();

GameController.startGame()