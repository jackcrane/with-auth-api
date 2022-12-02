import express from 'express';
const router = express.Router();
import { Verification, Customers, removeByValue } from '../lib/index.js';

router.post('/phone', async (req, res) => {
  const { pin } = req.body;
  const verified = await Verification.phone.verify({ pin });
  res.json(verified);

  if (verified.valid) {
    let status = JSON.parse(
      await Customers({ id: verified.customerId }).getStatus(),
    );
    status = removeByValue(
      status,
      `${process.env.NAMESPACE}.AWAITINGPHONECONFIRMATION`,
    );
    await Customers({ id: verified.customerId }).applyStatus(
      JSON.stringify(status),
    );
  }
});

export default router;

// import route from './routes/__route.js';
// app.use('/__route', route);

// https://expressjs.com/en/guide/routing.html
// bottom of page
