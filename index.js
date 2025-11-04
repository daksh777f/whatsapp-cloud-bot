require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Verification route 
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED ');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// Incoming messages
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const change = req.body.entry?.[0]?.changes?.[0]?.value;
    const msg = change?.messages?.[0];
    if (msg) {
      const from = msg.from;
      const text = msg.text?.body;
      console.log(` ${from}: ${text}`);
      await sendReply(from, `Got your message: "${text}"`);
    }
  } catch (err) {
    console.error(err);
  }
});

async function sendReply(to, text) {
  const url = `https://graph.facebook.com/v15.0/${PHONE_NUMBER_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body: text }
  };
  await axios.post(url, payload, {
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(` Server running  ${port}`));

