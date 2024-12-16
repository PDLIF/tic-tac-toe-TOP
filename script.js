const Gameboard = (function () {
    let board = Array(9).fill('');

    function placeMarker(index, marker) {
        if (board[index] === '') {
            board[index] = marker;
            document.getElementById(`cell-${index}`).textContent = marker;
            return true;
        }
        
        console.log('Invalid move. Spot already taken!');
        return false;
    }

    function resetBoard() {
        board = Array(9).fill('');
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
    }

    function getBoard() {
        return board;
    }

    return {placeMarker, resetBoard, getBoard};
})();






const Player = function (marker) {
    let score = 0;

    function getMarker() {
        return marker;
    }

    function getScore() {
        return score;
    }

    function increaseScore() {
        score++;
        document.getElementById(`score-${marker.toLowerCase()}`).textContent = `Player ${marker}: ${score}`;
    }

    function resetScore() {
        score = 0;
        document.getElementById(`score-${marker.toLowerCase()}`).textContent = `Player ${marker}'s: 0`;
    }

    return {getMarker, getScore, increaseScore, resetScore};
}






const GameController = (function () {
    let gameActive = false;
    let currentPlayer;
    const playerX = Player('X');
    const playerO = Player('O');
    

    function startGame() {
        Gameboard.resetBoard();
        currentPlayer = playerX;
        gameActive = true;
        
        document.querySelectorAll('.cell').forEach(element => {
            element.addEventListener('click', event => {
                console.log('dsfsd');
                const currentMarker = currentPlayer.getMarker();
                const index = parseInt(event.target.id.split('-')[1]);
                const marker = currentPlayer.getMarker();
                playTurn(index, marker);
            });
        });

        document.querySelector('#restart-button').addEventListener('click', event => {
            restartGame();
        });

        document.querySelector('#next-round-button').addEventListener('click', event => {
            nextRound();
        })
    }

    function switchTurn() {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }

    function playTurn(index, marker) {
        while (gameActive) {
            const success = Gameboard.placeMarker(index, marker);
            document.getElementById(`cell-${index}`).textContent = marker;

            if (success) {
                if (checkWinner()) {
                    document.getElementById('turn-info').textContent = `Player ${marker} wins!`;
                    currentPlayer.increaseScore();
                    gameActive = false;
                    return true;
                }
                if (isTie()) {
                    document.getElementById('turn-info').textContent = `It's a tie!`;
                    gameActive = false;
                    return true;
                }

                switchTurn();
                document.getElementById('turn-info').textContent = `Player ${currentPlayer.getMarker()}'s turn`;
                return false;
            } else {
                return false;
            }
        }
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

    function nextRound() {
        switchTurn();
        Gameboard.resetBoard();
        gameActive = true;
        document.getElementById('turn-info').textContent = `Player ${currentPlayer.getMarker()} starts`;
    }
    
    function restartGame() {
        gameActive = true;
        Gameboard.resetBoard();
        playerX.resetScore();
        playerO.resetScore();
        document.getElementById('turn-info').textContent = `Player ${currentPlayer.getMarker()} starts`;
    }

    return {startGame};
})();


GameController.startGame()























