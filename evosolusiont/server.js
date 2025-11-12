import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist'), { index: 'index.html' }));

// Catch all handler: send back React's index.html file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`📱 Access via: http://localhost:${PORT}`);
  console.log(`🌐 Access via IP: http://0.0.0.0:${PORT}`);
  console.log(`🚀 Evolutions Frontend Server running on port ${PORT}`);
});
