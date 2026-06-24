import { readFile } from 'fs/promises';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const raw = await readFile(new URL('../../data/collections.json', import.meta.url), 'utf-8');
    const data = JSON.parse(raw);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data);
  } catch (err) {
    console.error('/api/collections error', err);
    return res.status(500).json({ error: 'Failed to read collections' });
  }
}
