import express from 'express';
import dotenv from 'dotenv';
import './config/database.js';
dotenv.config();
const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
const users = [
    {
        id: 1,
        username: 'melissa',
        email: 'melissa@example.com',
        name: 'Melissa',
    },
    {
        id: 2,
        username: 'marco',
        email: 'marco@example.com',
        name: 'Marco',
    },
];
const activities = [
    {
        id: 1,
        type: 'workout',
        durationMinutes: 45,
        userId: 1,
        date: '2026-09-28',
    },
    {
        id: 2,
        type: 'run',
        durationMinutes: 30,
        userId: 2,
        date: '2026-09-28',
    },
];
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-backend', apiBaseUrl });
});
app.get(['/api/users', '/api/users/'], (_req, res) => {
    res.json({ apiBaseUrl, users });
});
app.get(['/api/activities', '/api/activities/'], (_req, res) => {
    res.json({ apiBaseUrl, activities });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on ${apiBaseUrl}`);
});
