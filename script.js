const gameElement = document.getElementById("game");
const statusElement = document.getElementById("status");

let currentPlayer = "X";
let activeBoard = -1; // -1 means all boards are active initially
const boards = Array(9).fill(null).map(() => Array(9).fill(null));
const winners = Array(9).fill(null);

function createGameBoard() {
  for (let i = 0; i < 9; i++) {
    const boardElement = document.createElement("div");
    boardElement.className = "board";
    boardElement.dataset.index = i;

    for (let j = 0; j < 9; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.cellIndex = j;
      cell.addEventListener("click", handleCellClick);
      boardElement.appendChild(cell);
    }

    gameElement.appendChild(boardElement);
  }
}

function handleCellClick(event) {
  const cell = event.target;
  const boardIndex = cell.parentNode.dataset.index;
  const cellIndex = cell.dataset.cellIndex;

  if (winners[boardIndex] || boards[boardIndex][cellIndex] || (activeBoard !== -1 && activeBoard != boardIndex)) {
    return;
  }

  boards[boardIndex][cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner(boards[boardIndex])) {
    winners[boardIndex] = currentPlayer;
    markBoardWinner(boardIndex, currentPlayer);
  }

  if (checkWinner(winners)) {
    statusElement.textContent = `Player ${currentPlayer} wins the game! 🎉`;
    gameElement.style.pointerEvents = "none";
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;

  activeBoard = winners[cellIndex] ? -1 : cellIndex;
  updateActiveBoards();
}

function updateActiveBoards() {
  document.querySelectorAll(".board").forEach((board, index) => {
    board.classList.remove("active");
    if (activeBoard === -1 || activeBoard == index) {
      board.style.pointerEvents = winners[index] ? "none" : "auto";
      board.classList.add("active");
    } else {
      board.style.pointerEvents = "none";
    }
  });
}

function markBoardWinner(boardIndex, player) {
  const boardElement = document.querySelector(`.board[data-index="${boardIndex}"]`);
  boardElement.classList.add(player === "X" ? "winner-x" : "winner-o");
}

function checkWinner(board) {
  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winningPatterns.some(pattern =>
    pattern.every(index => board[index] === currentPlayer)
  );
}

createGameBoard();
updateActiveBoards();
