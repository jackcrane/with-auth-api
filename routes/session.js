import express from 'express';
import { UseCustomerInformation } from '../lib/index.js';
const router = express.Router();
import colors from 'colors';

router.post('/', [UseCustomerInformation], (req, res) => {
  if (!req.customer.id) {
    res.status(401).json({
      message: 'Auth header could not be confirmed',
    });
    console.log(
      colors.bgYellow(` ${process.env.NAMESPACE}.SESSION  `) +
        ` could not confirm auth header. customer ID not present`,
    );
  } else {
    res.status(200).json({
      message: 'Auth header confirmed',
      customer: req.customer,
    });
    console.log(
      colors.bgBrightYellow(` ${process.env.NAMESPACE}.SESSION  `) +
        ` auth header confirmed for ${req.customer.id}`,
    );
  }
});

export default router;
