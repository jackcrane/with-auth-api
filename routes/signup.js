'use strict';

import express from 'express';
const router = express.Router();
import { Customers, Verification } from '../lib/index.js';
import { hashSync } from 'bcrypt';
import { stripe } from '../lib/AuthenticatedServices.js';
import colors from 'colors';

router.post('/', async (req, res) => {
  const { name, email, phone, password } = req.body;
  // verify email matches regex
  const verification = await Verification.email.valid({ email });
  if (!verification.wellFormed) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }
  if (!verification.validDomain) {
    res.status(400).json({
      error: 'Invalid email. Make sure you are using a real email host!',
    });
    return;
  }

  if (!(await Customers({ email }).checkEmailUnique())) {
    res.status(400).json({ error: 'Email already in use' });
    return;
  }

  const hashedPassword = hashSync(password, 10);

  const customer = await stripe.customers.create({
    email,
    name,
    phone,
  });
  const uuid = await Customers().create({
    name,
    email,
    phone,
    password: hashedPassword,
    stripe_customerId: customer.id,
  });
  await Customers({ id: uuid }).applyStatus(
    JSON.stringify([
      `${process.env.NAMESPACE}.AWAITINGPAYMENTINFO`,
      `${process.env.NAMESPACE}.AWAITINGEMAILCONFIRMATION`,
      `${process.env.NAMESPACE}.AWAITINGPHONECONFIRMATION`,
    ]),
  );

  await Verification.phone.send({ phone, customerId: uuid });
  // await Verification.email.send({ email, customerId: uuid });

  res.json({ uuid });

  console.log(
    colors.bgBrightGreen(`  ${process.env.NAMESPACE}.SIGNUP  `) +
      ` new customer ${uuid}`,
  );
});

export default router;
