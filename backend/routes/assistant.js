const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const OMNI_API = 'https://backend.omnidim.io/api/v1/query';
const OMNI_API_KEY = process.env.OMNIDIM_API_KEY;
const OMNI_AGENT_ID = process.env.OMNIDIM_AGENT_ID;

router.post('/', async (req, res) => {
  const { query } = req.body;

  try {
    const response = await fetch(OMNI_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OMNI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: 2637,
        query,
      }),
    });

    const data = await response.json();
    res.json({ result: data.result || "Sorry, I didn’t understand." });
  } catch (err) {
    console.error('❌ Omni API Error:', err);
    res.status(500).json({ error: 'AI backend error.' });
  }
});

module.exports = router;
