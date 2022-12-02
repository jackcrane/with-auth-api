import express from 'express';
import { AuthNonces, UseCustomerInformation } from '../lib/index.js';
const router = express.Router();
import colors from 'colors';

router.post('/', [UseCustomerInformation], async (req, res) => {
  if (!req.customer.id) {
    res.status(401).json({
      message: 'Account not logged in',
    });
  } else {
    const nonce =
      req.cookies[`${process.env.NAMESPACE}.AuthNonce`] ||
      req.headers['x-auth-nonce'];
    if (!nonce) {
      res.status(401).json({
        message: 'Auth header could not be confirmed',
      });
    } else {
      await AuthNonces({ customer: req.customer.id }).destroy();
      res.status(200).json({});
      console.log(
        colors.bgBrightRed(` ${process.env.NAMESPACE}.SESSION  `) +
          ` session destroyed for ${req.customer.id}`,
      );
    }
  }
});

export default router;
