import twilio from 'twilio';
const twilClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
import { connection, Handlers, uuidv4 } from './mysql.handler.js';
import EmailValidator from 'email-deep-validator';
import { Email } from './email.js';
const emailValidator = new EmailValidator({
  verifyMailbox: false,
});

const Verification = {
  phone: {
    send: async ({ phone, customerId }) => {
      const uuid = uuidv4();
      const pin = Math.floor(Math.random() * 900000) + 100000;
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 5);

      const message = await twilClient.messages.create({
        body: `Your ${process.env.FRIENDLY_NAME} verification code is ${pin}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      await connection.execute(
        'INSERT INTO `verifications` (id, customer_id, pin, type, expires_at) VALUES (?, ?, ?, ?, ?)',
        [
          Handlers.Protect(uuid),
          Handlers.Protect(customerId),
          Handlers.Protect(pin),
          Handlers.Protect('sms'),
          Handlers.Protect(expires_at),
        ],
      );

      return uuid;
    },

    verify: async ({ pin }) => {
      const res = await connection.execute(
        'SELECT * FROM `verifications` WHERE pin = ? AND type = ?',
        [Handlers.Protect(pin), Handlers.Protect('sms')],
      );
      if (res[0].length === 0) {
        return {
          valid: false,
          message: 'Invalid PIN',
        };
      }
      if (res[0][0].expires_at < new Date()) {
        return {
          valid: false,
          message: 'PIN has expired',
        };
      }
      return {
        valid: true,
        message: 'PIN is valid',
        customerId: res[0][0].customer_id,
      };
    },
  },
  email: {
    valid: async ({ email }) => {
      const verification = await emailValidator.verify(email);
      return verification;
    },
    send: async ({ email, customerId }) => {
      const uuid = uuidv4();
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 60);
      await connection.execute(
        'INSERT INTO `verifications` (id, customer_id, type, expires_at) VALUES (?, ?, ?, ?)',
        [
          Handlers.Protect(uuid),
          Handlers.Protect(customerId),
          Handlers.Protect('email'),
          Handlers.Protect(expires_at),
        ],
      );
      await Email.send({
        to: email,
        templateName: 'Emails.VerifyEmail',
        params: {
          verify_url: `${process.env.FRONTEND_URL}/verify-email/${uuid}`,
        },
      });
      return uuid;
    },
  },
};

export { Verification };
