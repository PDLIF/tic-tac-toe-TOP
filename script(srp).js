const Gameboard = (function () {
    let board = Array(9).fill('');

    function resetBoard() {
        board = Array(9).fill('');
    }

    function placeMarker(index, marker) {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
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
    }

    function resetScore() {
        score = 0;
    }

    return {getMarker, getScore, increaseScore, resetScore};
}











const DOMController = (function() {
    function updateCell(index, marker) {
        document.getElementById(`cell-${index}`).textContent = marker;
    }

    function clearBoard() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
        });
    }

    function updateScore(marker, score) {
        document.getElementById(`score-${marker.toLowerCase()}`).textContent = `Player ${marker}: ${score}`;
    }

    function showTurnInfo(message) {
        document.getElementById('turn-info').textContent = message;
    }

    function showWinner(marker) {
        document.getElementById('turn-info').textContent = `Player ${marker} wins!`;
    }

    function showTie() {
        document.getElementById('turn-info').textContent = `It's a tie!`;
    }

    return { updateCell, clearBoard, updateScore, showTurnInfo, showWinner, showTie }
})();








const GameFlowController = (function() {
    let gameActive = false;
    const playerX = Player('X');
    const playerO = Player('O');
    let currentPlayer = playerX;

    function initializeGameState() {
        Gameboard.resetBoard();
        currentPlayer = playerX ? playerO : playerX;
        gameActive = true;
    }

    function resetScores() {
        playerX.resetScore();
        playerO.resetScore();
    }

    function switchTurn() {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }

    function activateGame() {
        gameActive = true;
    }

    function deactivateGame() {
        gameActive = false;
    }

    function getGameActive() {
        return gameActive;
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }
    
    return { initializeGameState, resetScores, switchTurn, activateGame, deactivateGame, getGameActive, getCurrentPlayer }
})();






const UserInputHandler = (function() {
    function playTurn(event) {
        if (!GameFlowController.gameActive) return;
        const index = parseInt(event.target.id.split('-')[1]);
        const marker = currentPlayer.getMarker();
        const currentPlayer = GameFlowController.getCurrentPlayer();

        const success = Gameboard.placeMarker(index, marker);

        if (success) {
            DOMController.updateCell(index, marker);

            if (checkWinner()) {
                DOMController.showWinner(currentPlayer.getMarker());
                GameFlowController.currentPlayer.increaseScore();
                DOMController.updateScore(currentPlayer.getMarker(), currentPlayer.getScore());
                GameFlowController.deactivateGame();
                return true;
            }
            if (isTie()) {
                DOMController.showTie();
                GameFlowController.deactivateGame();
                return true;
            }

            switchTurn();
            DOMController.showTurnInfo(`Player ${currentPlayer.getMarker()}'s turn`);
        }
    }

    function restartGame() {
        GameFlowController.resetScores();
        GameFlowController.initializeGameState();
        DOMController.updateScore('X', 0);
        DOMController.updateScore('O', 0);
        DOMController.showTurnInfo(`Player ${GameFlowController.getCurrentPlayer().getMarker()} starts`);
    }

    function playNextRound() {
        GameFlowController.initializeGameState();
        DOMController.showTurnInfo(`Player ${GameFlowController.getCurrentPlayer().getMarker()} starts`);
    }

    return { playTurn, restartGame, playNextRound }
})();











const GameStateChecker = (function() {
    function checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6],           // Diagonals
        ];

        const board = Gameboard.getBoard();

        return winningCombos.some(combo => {
            combo.every(index => board[index] === GameFlowController.getCurrentPlayer().getMarker());
        });
    }

    function checkTie() {
        return Gameboard.getBoard().every(cell => cell !== '');
    }

    return { checkWinner, checkTie }
})();









const GameController = ( function() {
    function startGame() {
        GameFlowController.initializeGameState();

        document.querySelectorAll('.cell').forEach(element => {//           adding event listeners for each cell
            element.addEventListener('click', UserInputHandler.playTurn);
        });

        document.querySelector('#restart-button').addEventListener('click', UserInputHandler.restartGame());//             adding event listeners for "restart" and "next round" buttons
        document.querySelector('#next-round-button').addEventListener('click', UserInputHandler.playNextRound());
    }

    return { startGame }
})();

GameController.startGame();