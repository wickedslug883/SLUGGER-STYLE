// Initialize game variables
const words = ['apple', 'banana', 'cherry']; // Add more words
let fallingWords = [];
let lives = 3;

let speed = 1;
let score = 0;
let typedWord = "";
let characterState = 'idle';
let stateActivatedTime = null;
const stateDuration = 1500; // in milliseconds
let gameActive = false; // New Variable to track if the game is active or not

// New Variables
let highScores = [];
let personalBest = 0;
// Initialize game variables
let currentMultiplier = 1;
let consecutiveSuccess = 0;  // New variable to keep track of consecutive successes
let idleFrames = 13; // Total number of idle frames
let currentIdleFrame = 1; // Current frame of the idle animation
let frameUpdateInterval = 600; // Time in milliseconds between frame updates
let lastFrameUpdateTime = 0; // The last time the frame was updated
// Create Audio objects
const successSound = new Audio('upshort.wav');
const failureSound = new Audio('sfx_toggle.ogg');
failureSound.volume = 0.25;  // Setting volume to 50%

let characterElement;

document.addEventListener("DOMContentLoaded", function() {
  characterElement = document.createElement('img');
  characterElement.id = "character";
  characterElement.alt = "character";
  
  const gameArea = document.getElementById('gameArea');
  gameArea.appendChild(characterElement);

  setInterval(gameLoop, 30);
  document.addEventListener('keydown', handleTyping);
    // Retrieve high scores from local storage
     // Retrieve high scores from local storage
  const savedHighScores = localStorage.getItem('highScores');
  if (savedHighScores) {
    highScores = JSON.parse(savedHighScores);
  }
  
  // Retrieve personal best from local storage
  const savedPersonalBest = localStorage.getItem('personalBest');
  if (savedPersonalBest) {
    personalBest = JSON.parse(savedPersonalBest);
  }
  // Generate a unique identifier for this computer if it doesn't exist
let uniqueIdentifier = localStorage.getItem('uniqueIdentifier');
if (!uniqueIdentifier) {
  uniqueIdentifier = Math.random().toString(36).substring(2);
  localStorage.setItem('uniqueIdentifier', uniqueIdentifier);
}

    // Add a start menu
    showStartMenu();
});

function showStartMenu() {
  // Show a start menu, and when the "Start" button is clicked, call startGame
  const startMenu = document.getElementById('startMenu');
  startMenu.style.display = 'block';

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', startGame);
  gameActive = false;

}


function startGame() {
  // Hide the start menu and start the game loop
  const startMenu = document.getElementById('startMenu');
  startMenu.style.display = 'none';

  setInterval(gameLoop, 30);
  gameActive = true;

}
function gameOver() {
  gameActive = false; // Set game to inactive

  // Check if a new high score is achieved
  if (score > personalBest) {
    personalBest = score;
    const name = prompt("New high score! Enter your name:");

    // Save the new high score to the server
    fetch('/api/highscores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, score }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Score successfully added') {
        console.log('High score successfully saved.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });

    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);

    // Save personal best to local storage
  // Save to local storage
  localStorage.setItem('personalBest', JSON.stringify(personalBest));
  localStorage.setItem('highScores', JSON.stringify(highScores));
  }

  // Show high scores on a game-over screen
  const gameOverMenu = document.getElementById('gameOverMenu');
  const highScoresList = document.getElementById('highScoresList');
  highScoresList.innerHTML = '';

  const savedHighScores = localStorage.getItem('highScores');
  if (savedHighScores) {
    highScores = JSON.parse(savedHighScores);
  }

  highScores.forEach(record => {
    const listItem = document.createElement('li');
    listItem.innerText = `${record.name}: ${record.score}`;
    highScoresList.appendChild(listItem);
  });

  gameOverMenu.style.display = 'block';

  // Add retry button functionality
  const retryButton = document.getElementById('retryButton');
  retryButton.addEventListener('click', () => {
    location.reload();
  });
}

// Main game loop
function gameLoop() {
  if (!gameActive) return; // Pause the game if it's not active

  let currentTime = Date.now();
  if (Math.random() < 0.01) {
    spawnWord(); // Randomly spawn words
  }
   
  // Logic for idle animation
  if (characterState === 'idle' && currentTime - lastFrameUpdateTime >= frameUpdateInterval) {
    currentIdleFrame = currentIdleFrame % idleFrames + 1;
    lastFrameUpdateTime = currentTime; // Update the last frame update time
  }
  displayScore(); // New function to display the score

  moveWords(); // Move the words
  drawWords(); // Draw the words
  checkCollisions(); // Check for collisions
}


// Spawn a word at a random x-coordinate
function spawnWord() {
  const x = Math.random() * 750;
  const word = words[Math.floor(Math.random() * words.length)];
  fallingWords.push({ x: x, y: 0, word: word });
}

// Move words based on speed
function moveWords() {
  fallingWords.forEach(wordObj => {
    wordObj.y += speed;
  });
}
function drawWords() {
  const gameArea = document.getElementById('gameArea');
  gameArea.style.backgroundImage = "url('iimaBack.png')"; // Set the background image

  // Update character state source
  let characterSrc = '';
  if (characterState === 'idle') {
    characterSrc = `iima${currentIdleFrame}.png`;
  } else if (characterState === 'success') {
    characterSrc = 'oopa.png';
  } else if (characterState === 'fail') {
    characterSrc = 'ooma.png';
  }

  characterElement.src = characterSrc;

  // Remove any old word elements
  gameArea.querySelectorAll('div').forEach(e => e.remove());

  fallingWords.forEach(wordObj => {
    let wordElement = document.createElement('div');

    for (let i = 0; i < wordObj.word.length; i++) {
      const letter = wordObj.word[i];
      const letterElement = document.createElement('span');
      letterElement.textContent = letter;

      if (typedWord && wordObj.word.startsWith(typedWord)) {
        if (i < typedWord.length) {
          letterElement.style.color = 'red';
        }
      }

      wordElement.appendChild(letterElement);
    }

    wordElement.style.position = 'absolute';
    wordElement.style.left = `${wordObj.x}px`;
    wordElement.style.top = `${wordObj.y}px`;
    wordElement.style.fontSize = '24px'; // Setting the font size here
    wordElement.style.fontWeight = '900';
    wordElement.style.color = 'white';
    wordElement.style.fontFamily = 'cas'; // Setting the imported font here

    gameArea.appendChild(wordElement);
  });

  // Reset the character state after the state duration
  if (stateActivatedTime && Date.now() - stateActivatedTime >= stateDuration) {
    characterState = 'idle';
    stateActivatedTime = null;
  }
}

// Check for collisions with the bottom
function checkCollisions() {
  fallingWords = fallingWords.filter(wordObj => {
    if (wordObj.y > 600) {
      loseLife();
      return false;
    }
    return true;
  });
}


// Update character state
function updateCharacter(state) {
    characterState = state;
    stateActivatedTime = Date.now();
  
    if (state === 'success') {
      successSound.play(); // Play success sound
      consecutiveSuccess++;
      updateMultiplier(); // New function to update multiplier
    } else if (state === 'fail') {
      failureSound.play(); // Play failure sound
      consecutiveSuccess = 0; // Reset the consecutive successes
      currentMultiplier = 1;  // Reset multiplier
    }
  }
  // Update the multiplier based on the consecutiveSuccess
function updateMultiplier() {
  if (consecutiveSuccess >= 15) {
    currentMultiplier = 10;
  } else if (consecutiveSuccess >= 5) {
    currentMultiplier = 4;
  } else if (consecutiveSuccess >= 3) {
    currentMultiplier = 2;
  } else {
    currentMultiplier = 1;
  }
}
// Function to display the current score
function displayScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.innerHTML = `Score -  ${score} <br> Mult - ${currentMultiplier}x`;
}
function drawHearts() {
  const heartsDiv = document.getElementById('hearts');
  heartsDiv.innerHTML = ''; // Clear previous hearts

  for (let i = 0; i < 3; i++) { // Always draw 3 hearts
    let heartContainer = document.createElement('div');
    heartContainer.className = 'heart-container';

    let fullHeart = document.createElement('img');
    fullHeart.src = 'heartFull.png'; // Make sure this path is correct
    fullHeart.className = 'full-heart';
    heartContainer.appendChild(fullHeart);

    let emptyHeart = document.createElement('img');
    emptyHeart.src = 'heartOut.png'; // Make sure this path is correct
    emptyHeart.className = 'empty-heart';
    heartContainer.appendChild(emptyHeart);

    if (i >= lives) {
      fullHeart.style.opacity = '0';
      emptyHeart.style.opacity = '1';
    } else {
      fullHeart.style.opacity = '1';
      emptyHeart.style.opacity = '0';
    }

    heartsDiv.appendChild(heartContainer);
  }
}



function loseLife() {
  updateCharacter('fail');
  lives--;
  drawHearts();  // Update the hearts
  if (lives <= 0) {
    gameOver();
  }
}


// Handle user typing
function handleTyping(e) {
  if (!gameActive) return; // Don't handle typing if the game is not active

    const keyCode = e.keyCode;
    const typedChar = String.fromCharCode(keyCode).toLowerCase();
    typedWord += typedChar;
  
    let foundWord = fallingWords.find(wordObj => wordObj.word.startsWith(typedWord));
  
    if (foundWord) {
      if (foundWord.word === typedWord) {
        // Successfully typed a full word
        updateCharacter('success');
        fallingWords = fallingWords.filter(wordObj => wordObj !== foundWord);
        typedWord = ""; // Reset
        score += foundWord.word.length;
      }
    } else {
      typedWord = ""; // Reset if no word is found
    }
  }