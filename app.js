let playerText = document.getElementById("playerText");
let restartBtn = document.getElementById("restartBtn");
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let boxes = Array.from(document.getElementsByClassName("box"));

const O_TEXT = "O";
const X_TEXT = "X";
let currentPlayer = X_TEXT;
let spaces = Array(9).fill(null);
let moveHistory = [];
let currentMove = -1;

const startGame = () => {
  boxes.forEach((box) => box.addEventListener("click", boxClicked));
};

function boxClicked(e) {
  const index = e.target.dataset.index;

  if (!spaces[index]) {
    if (currentMove < moveHistory.length - 1) {
      moveHistory.splice(currentMove + 1);
    }

    spaces[index] = currentPlayer;
    e.target.innerText = currentPlayer;

    moveHistory.push({ player: currentPlayer, board: spaces.slice() });
    currentMove++;

    if (playerHasWon()) {
      playerText.innerText = `${currentPlayer} has won!`;
      highlightWinningBlocks(playerHasWon());
      disableClickEvent();
      disableButtons(false, true);
    } else if (boardIsFull()) {
      playerText.innerText = "It's a draw!";
      disableClickEvent();
      disableButtons(false, true);
    } else {
      currentPlayer = currentPlayer === X_TEXT ? O_TEXT : X_TEXT;
      playerText.innerText = `Current Player: ${currentPlayer}`;
      disableButtons(currentMove === 0, currentMove === moveHistory.length - 1);
    }
  }
  if (playerHasWon() || boardIsFull()) {
    enableButtons();
  }
}

const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function playerHasWon() {
  for (const condition of winningCombination) {
    let [a, b, c] = condition;

    if (spaces[a] && spaces[a] === spaces[b] && spaces[a] === spaces[c]) {
      return [a, b, c];
    }
  }
  return false;
}

function boardIsFull() {
  return spaces.every((cell) => cell !== null);
}

restartBtn.addEventListener("click", restart);

function restart() {
  spaces.fill(null);
  currentPlayer = X_TEXT;
  playerText.innerText = `Current Player: ${currentPlayer}`;
  moveHistory = [];
  currentMove = -1;
  boxes.forEach((box) => {
    box.innerText = "";
    box.classList.remove("winner");
  });
  enableClickEvent();
  disableButtons(true, true);

  prevBtn.style.display = "none";
  nextBtn.style.display = "none";
}

function highlightWinningBlocks([a, b, c]) {
  boxes[a].classList.add("winner");
  boxes[b].classList.add("winner");
  boxes[c].classList.add("winner");
}

function disableClickEvent() {
  boxes.forEach((box) => box.removeEventListener("click", boxClicked));
}

function enableClickEvent() {
  boxes.forEach((box) => box.addEventListener("click", boxClicked));
}

function disableButtons(prev, next) {
  prevBtn.disabled = prev;
  nextBtn.disabled = next;
}

prevBtn.addEventListener("click", () => {
  currentMove--;
  board = moveHistory[currentMove].board;
  currentPlayer = moveHistory[currentMove].player;
  boxes.forEach((box, index) => (box.innerText = board[index]));
  playerText.innerText = `Current Player: ${currentPlayer}`;
  disableButtons(currentMove === 0, false);
});

nextBtn.addEventListener("click", () => {
  currentMove++;
  board = moveHistory[currentMove].board;
  currentPlayer = moveHistory[currentMove].player;
  boxes.forEach((box, index) => (box.innerText = board[index]));
  playerText.innerText = `Current Player: ${currentPlayer}`;
  disableButtons(false, currentMove === moveHistory.length - 1);
});

playerText.innerText = `Current Player: ${currentPlayer}`;
disableButtons(true, true);

function enableButtons() {
  prevBtn.style.display = "inline-block";
  nextBtn.style.display = "inline-block";
}

prevBtn.style.display = "none";
nextBtn.style.display = "none";

startGame();
// proj
