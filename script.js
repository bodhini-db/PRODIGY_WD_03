document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const menu = document.getElementById('menu');
    const game = document.getElementById('game');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const leaderboardXElement = document.getElementById('leaderboardX');
    const leaderboardOElement = document.getElementById('leaderboardO');
    const resetButton = document.getElementById('restart');
    const playAIButton = document.getElementById('play-ai');
    const play2PButton = document.getElementById('play-2p');
    const backButton = document.getElementById('back-to-menu');

    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameMode = '2P'; // Default mode is 2 players
    let scoreX = 0;
    let scoreO = 0;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    // Event listeners for game mode buttons
    playAIButton.addEventListener('click', () => {
        gameMode = 'AI';
        startGame();
    });

    play2PButton.addEventListener('click', () => {
        gameMode = '2P';
        startGame();
    });

    // Event listener for back button
    backButton.addEventListener('click', () => {
        game.classList.add('hidden');
        menu.classList.remove('hidden');
    });

    // Event listener for restart button
    resetButton.addEventListener('click', resetGame);

    function startGame() {
        menu.classList.add('hidden');
        game.classList.remove('hidden');
        resetBoard();
    }

    function handleClick(e) {
        const cell = e.target;
        const index = cell.dataset.index;
        if (board[index] === null) {
            makeMove(index, currentPlayer);
            if (gameMode === 'AI' && currentPlayer === 'X') {
                const bestMove = getBestMove();
                setTimeout(() => makeMove(bestMove, 'O'), 500);
            }
            if (gameMode === '2P') {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            }
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player); // Add player class for styling
        cells[index].removeEventListener('click', handleClick);
        if (checkWin(player)) {
            if (player === 'X') {
                scoreX++;
            } else {
                scoreO++;
            }
            updateScores();
            updateLeaderboard();
            // Check if any player has reached 3 points
            if (scoreX >= 3) {
                setTimeout(() => alert('Player X has won the game!'), 100);
                setTimeout(resetGame, 1000);
            } else if (scoreO >= 3) {
                setTimeout(() => alert('Player O has won the game!'), 100);
                setTimeout(resetGame, 1000);
            } else {
                setTimeout(() => alert(`${player} wins this round!`), 100);
                setTimeout(resetBoard, 1000);
            }
        } else if (isBoardFull()) {
            setTimeout(() => alert('It\'s a draw!'), 100);
            setTimeout(resetBoard, 1000);
        }
    }

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => {
                return board[index] === player;
            });
        });
    }

    function isBoardFull() {
        return board.every(cell => cell !== null);
    }

    function resetBoard() {
        board.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O'); // Remove player classes
            cell.addEventListener('click', handleClick, { once: true });
        });
        currentPlayer = 'X';
    }

    function resetGame() {
        scoreX = 0;
        scoreO = 0;
        updateScores();
        updateLeaderboard();
        resetBoard();
    }

    function updateScores() {
        scoreXElement.textContent = `X: ${scoreX}`;
        scoreOElement.textContent = `O: ${scoreO}`;
    }

    function updateLeaderboard() {
        leaderboardXElement.textContent = scoreX;
        leaderboardOElement.textContent = scoreO;
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                let score = minimax(board, false);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, isMaximizing) {
        const winner = getWinner();
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        if (isBoardFull()) return 0;

        let bestScore = isMaximizing ? -Infinity : Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = isMaximizing ? 'O' : 'X';
                let score = minimax(board, !isMaximizing);
                board[i] = null;
                bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
            }
        }
        return bestScore;
    }

    function getWinner() {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }
});

