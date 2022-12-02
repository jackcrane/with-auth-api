import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import * as dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from 'uuid';

let connection;
try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    Promise: bluebird,
  });
} catch (error) {
  connection = {
    state: 'FAIL',
    error,
  };
}

const Handlers = {
  Protect: (str) => {
    if (str || str === 0) {
      return str;
    } else {
      return null;
    }
  },
};

const Events = (obj) => {
  return {
    create: async (creat) => {
      const uuid = uuidv4();
      await connection.execute(
        `INSERT INTO events (id, organizer, title, location, address_street1, address_street2, address_city, address_region, address_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Handlers.Protect(uuid),
          Handlers.Protect(obj.organizer),
          Handlers.Protect(obj.title),
          Handlers.Protect(JSON.stringify(creat.location)),
          Handlers.Protect(creat.address?.line1),
          Handlers.Protect(creat.address?.line2),
          Handlers.Protect(creat.address?.city),
          Handlers.Protect(creat.address?.region),
          Handlers.Protect(creat.address?.country),
        ],
      );
      return uuid;
    },
    read: async () => {
      let res = await connection.execute(
        'SELECT * FROM `events` WHERE id = ? or title = ? or organizer = ? LIMIT 1',
        [
          Handlers.Protect(obj.id),
          Handlers.Protect(obj.title),
          Handlers.Protect(obj.organizer),
        ],
      );
      res = res[0];
      return res;
    },
  };
};

const Customers = (obj) => {
  return {
    create: async (details) => {
      const uuid = uuidv4();
      await connection.execute(
        'INSERT INTO customers (id, name, email, password, phone, stripe_customerId) VALUES (?, ?, ?, ?, ?, ?)',
        [
          Handlers.Protect(uuid),
          Handlers.Protect(details.name),
          Handlers.Protect(details.email),
          Handlers.Protect(details.password),
          Handlers.Protect(details.phone),
          Handlers.Protect(details.stripe_customerId),
        ],
      );
      return uuid;
    },
    applyStatus: async (status) => {
      await connection.execute('UPDATE customers SET status = ? WHERE id = ?', [
        Handlers.Protect(status),
        Handlers.Protect(obj.id),
      ]);
    },
    getStatus: async () => {
      let res = await connection.execute(
        'SELECT status FROM customers WHERE id = ?',
        [Handlers.Protect(obj.id)],
      );
      res = res[0][0];
      return res.status;
    },
    checkEmailUnique: async () => {
      let res = await connection.execute(
        'SELECT * FROM `customers` WHERE email = ?',
        [Handlers.Protect(obj.email)],
      );
      res = res[0];
      return res.length === 0;
    },
    read: async (method) => {
      if (method === 'email') {
        let res = await connection.execute(
          'SELECT * FROM `customers` WHERE email = ?',
          [Handlers.Protect(obj.email)],
        );
        res = res[0][0];
        return res;
      } else if (method === 'id') {
        let res = await connection.execute(
          'SELECT * FROM `customers` WHERE id = ?',
          [Handlers.Protect(obj.id)],
        );
        res = res[0][0];
        return res;
      } else if (method === 'stripe_customerId') {
        let res = await connection.execute(
          'SELECT * FROM `customers` WHERE stripe_customerId = ?',
          [Handlers.Protect(obj.stripe_customerId)],
        );
        res = res[0][0];
        return res;
      } else {
        throw new Error('Invalid method');
      }
    },
  };
};

const AuthNonces = ({ customer }) => {
  return {
    create: async () => {
      const uuid = uuidv4();
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 60);
      await connection.execute(
        'INSERT INTO auth_nonces (nonce, customer, expires_at) VALUES (?, ?, ?)',
        [Handlers.Protect(uuid), Handlers.Protect(customer), expires_at],
      );
      return uuid;
    },
    check: async (nonce) => {
      const res = await connection.execute(
        'SELECT * FROM auth_nonces WHERE nonce = ?',
        [Handlers.Protect(nonce)],
      );
      if (res[0].length === 0) {
        return false;
      }
      const expires_at = new Date(res[0][0].expires_at);
      const now = new Date();
      if (expires_at < now) {
        return false;
      }
      return true;
    },
    get: async (nonce) => {
      const res = await connection.execute(
        'SELECT * FROM auth_nonces WHERE nonce = ?',
        [Handlers.Protect(nonce)],
      );
      return res[0][0];
    },
    destroy: async (nonce) => {
      await connection.execute('DELETE FROM auth_nonces WHERE nonce = ?', [
        Handlers.Protect(nonce),
      ]);
    },
  };
};

export { Customers, AuthNonces, connection, Handlers, uuidv4 };
