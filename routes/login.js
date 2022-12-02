import express from 'express';
const router = express.Router();
import { Customers, AuthNonces } from '../lib/index.js';
import { compareSync } from 'bcrypt';
import colors from 'colors';

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Missing email or password' });
    return;
  }

  const customer = await Customers({ email }).read('email');
  if (!customer) {
    res.status(400).json({ error: 'Email not found' });
    return;
  }

  if (!compareSync(password, customer.password)) {
    res.status(400).json({ error: 'Incorrect password' });
    return;
  }

  const nonce = await AuthNonces({ customer: customer.id }).create();

  res.json({ nonce });

  console.log(
    colors.bgBrightBlue(`  ${process.env.NAMESPACE}.LOGIN   `) +
      ` new login ${customer.id}`,
  );
});

export default router;
