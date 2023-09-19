const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Enable CORS for all routes (you can tighten this up for production)
app.use(cors());

// To handle JSON payloads
app.use(bodyParser.json());

// Serve static files from "game" folder
app.use(express.static('game'));

// Default route to serve game.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/game/game.html');
});

// In-memory storage for high scores
const highScores = [];

// Get high scores
app.get('/api/highscores', (req, res) => {
  res.json(highScores);
});

// Add a high score
app.post('/api/highscores', (req, res) => {
  const { name, score } = req.body;
  if (typeof name !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  highScores.push({ name, score });
  highScores.sort((a, b) => b.score - a.score);
  highScores.length = Math.min(highScores.length, 10);

  res.status(201).json({ message: 'Score successfully added' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
function drawHearts() {
  const heartsDiv = document.getElementById('hearts');
  heartsDiv.innerHTML = ''; // Clear previous hearts

  for (let i = 0; i < 3; i++) { // Always draw 3 hearts
    let heartContainer = document.createElement('div');
    heartContainer.className = 'heart-container';

    let fullHeart = document.createElement('img');
    fullHeart.src = 'full_heart.png';
    fullHeart.className = 'full-heart';
    heartContainer.appendChild(fullHeart);

    let emptyHeart = document.createElement('img');
    emptyHeart.src = 'empty_heart.png';
    emptyHeart.className = 'empty-heart';
    heartContainer.appendChild(emptyHeart);

    if (i >= lives) {
      fullHeart.classList.add('pixelate'); // Apply pixelate effect
    }

    heartsDiv.appendChild(heartContainer);
  }
}
