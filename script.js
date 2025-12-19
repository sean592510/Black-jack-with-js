// ===== PLAYER & GAME STATE =====
const player = { name: "Alex", chips: 145, lives: 3 };
let cards = [], sum = 0, hasBlackJack = false, isAlive = false;
let gameActive = false;

// ===== DOM =====
const messageEl = document.getElementById("message-el");
const cardsEl = document.getElementById("cards-el");
const sumEl = document.getElementById("sum-el");
const playerEl = document.getElementById("player-el");
const livesEl = document.getElementById("lives-el");
const startBtn = document.getElementById("start-btn");
const newCardBtn = document.getElementById("new-card-btn");
const gameArea = document.getElementById("game-area");

// Update UI
function updatePlayerUI() {
  playerEl.textContent = `${player.name}: $${player.chips}`;
  livesEl.textContent = `Lives: ${'❤️'.repeat(player.lives)} (${player.lives})`;
}
updatePlayerUI();

// ===== CARD LOGIC =====
const suits = ['heart', 'diamond', 'spade', 'club'];
const values = [2,3,4,5,6,7,8,9,10,10,10,10,11];
const faceCards = ['J', 'Q', 'K'];

function getRandomCard() {
  const idx = Math.floor(Math.random() * values.length);
  const value = values[idx];
  const suit = suits[Math.floor(Math.random() * 4)];
  const display = value === 11 ? 'A' : value === 10 ? faceCards[Math.floor(Math.random()*3)] : value;
  return { value, suit, display };
}

// ===== GAME FUNCTIONS =====
function startGame() {
  if (player.lives <= 0) return;
  gameActive = true;
  isAlive = true;
  hasBlackJack = false;
  const card1 = getRandomCard();
  const card2 = getRandomCard();
  cards = [card1, card2];
  sum = card1.value + card2.value;

  startBtn.disabled = true;
  newCardBtn.disabled = false;
  messageEl.textContent = "Good luck!";

  renderGame();
}

function renderGame() {
  cardsEl.innerHTML = '';
  cards.forEach((card, i) => {
    setTimeout(() => {
      const cardEl = document.createElement('div');
      cardEl.className = `card ${card.suit}`;
      cardEl.dataset.value = card.display;
      cardEl.textContent = card.display;
      cardEl.style.animationDelay = `${i * 0.15}s`;
      cardsEl.appendChild(cardEl);
    }, i * 150);
  });

  sumEl.textContent = `Sum: ${sum}`;

  if (sum <= 20) {
    messageEl.textContent = "Do you want to draw a new card?";
  } else if (sum === 21) {
    endRound(true); // Win
  } else {
    endRound(false); // Bust
  }

  newCardBtn.disabled = !isAlive || hasBlackJack;
}

function endRound(isWin) {
  gameActive = false;
  isAlive = false;
  newCardBtn.disabled = true;
  startBtn.disabled = false;

  if (isWin) {
    player.chips += 50;
    messageEl.innerHTML = `<span style="color:#ffd700;">BLACKJACK! +$50</span>`;
  } else {
    player.chips -= 20;
    player.lives--;
    messageEl.innerHTML = `<span style="color:#e74c3c;">BUST! -$20</span>`;
  }

  updatePlayerUI();

  // Check game over
  if (player.lives <= 0) {
    setTimeout(showGameOver, 1200);
  }
}

function newCard() {
  if (!isAlive || hasBlackJack || !gameActive) return;
  const card = getRandomCard();
  cards.push(card);
  sum += card.value;
  renderGame();
}

function showGameOver() {
  const overlay = document.createElement('div');
  overlay.className = 'game-over';
  overlay.innerHTML = `
    <div>GAME OVER</div>
    <div style="font-size:1rem; margin:1rem 0;">Final Chips: $${player.chips}</div>
    <button id="restart-btn">PLAY AGAIN</button>
  `;
  gameArea.appendChild(overlay);

  document.getElementById("restart-btn").onclick = () => {
    // Reset game
    player.chips = 145;
    player.lives = 3;
    updatePlayerUI();
    overlay.remove();
    messageEl.textContent = "Want to play a round?";
    cardsEl.innerHTML = '';
    sumEl.textContent = "Sum: ";
    startBtn.disabled = false;
  };
}

// ===== EVENT LISTENERS =====
startBtn.addEventListener("click", startGame);
newCardBtn.addEventListener("click", newCard);
