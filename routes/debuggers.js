import express from 'express';
const router = express.Router();
import { AuthNonces, UseCustomerInformation } from '../lib/index.js';

router.post('/session', async (req, res) => {
  const { nonce } = req.body;
  const authNonce = await AuthNonces({}).check(nonce);
  res.json({ authNonce });
});

router.post('/customer', [UseCustomerInformation], async (req, res) => {
  res.json(req.customer);
});

export default router;

// import route from './routes/__route.js';
// app.use('/__route', route);

// https://expressjs.com/en/guide/routing.html
// bottom of page
