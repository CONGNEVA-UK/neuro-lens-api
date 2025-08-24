const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files in /public  ← 這行最關鍵！
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/v1/ping', (req, res) => {
  console.log('PING hit');
  res.json({ msg: 'NeuroLens API is alive 🚀' });
});

// Root
app.get('/', (req, res) => {
  res.send('✅ NeuroLens API is running!');
});

// Listen (keep last)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API up at http://localhost:${PORT}`);
});
