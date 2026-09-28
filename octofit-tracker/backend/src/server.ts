import express from 'express';
import dotenv from 'dotenv';
import './config/database.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend' });
});

app.listen(port, () => {
  console.log(`OctoFit backend listening on http://localhost:${port}`);
});
