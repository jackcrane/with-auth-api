// Create the database tables
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import * as dotenv from 'dotenv';
dotenv.config();
import RL from 'readline';
import colors from 'colors';

// Prompt user to continue
const readline = RL.createInterface({
  input: process.stdin,
  output: process.stdout,
});

await new Promise((resolve) => {
  readline.question(
    `NOTICE: You are about to create a database called ${process.env.DB_NAME} and populate it with the necessary tables to run auth. Continue? (y/n) `,
    async (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log('Exiting...');
        process.exit(0);
      } else {
        resolve();
      }
    },
  );
});

import Protection from '../lib/Protection.js';

const initialConnection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  Promise: bluebird,
});

await initialConnection.execute(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
);

const c = await Protection({ includes: ['Vars', 'DbConnection'] });

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  Promise: bluebird,
});

try {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS customers
  (
      id                varchar(36)  not null
          primary key,
      name              varchar(255) null,
      email             varchar(255) null,
      phone             varchar(18)  null,
      stripe_customerId varchar(64)  null,
      INTERNAL_notes    text         null,
      status            varchar(255) null,
      password          varchar(255) null,
      constraint customers_pk
          unique (id)
  );`,
  );
} catch (error) {
  console.error(error);
  console.log("Couldn't create customers table");
}

try {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS auth_nonces
  (
      nonce      varchar(36) null,
      customer   varchar(36) null,
      expires_at datetime    null,
      constraint auth_nonces_customers_null_fk
          foreign key (customer) references customers (id)
  );`,
  );
} catch (error) {
  console.error(error);
  console.log("Couldn't create auth_nonces table");
}

try {
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS verifications
  (
      id          varchar(36) not null
          primary key,
      customer_id varchar(36) null,
      pin         int         null,
      type        varchar(36) null,
      expires_at  timestamp   null,
      constraint table_name_customers_null_fk
          foreign key (customer_id) references customers (id)
  );`,
  );
} catch (error) {
  console.error(error);
  console.log("Couldn't create verifications table");
}

const r = await Protection({ includes: ['DbTables'], mute: true });
if (r === 'pass') {
  console.log(
    'Tables created, initial onboarding complete. We will run the Protection script again. Your next steps are to reolve anything it finds. If it is all green, you are good to get started.',
  );
} else {
  console.log(
    `Tables may be created, but something went wrong. Suggest running this script again, or running 'npm run protect-verbose' for more details`,
  );
}

console.log('\n');
const nr = await Protection();
if (nr === 'pass') {
  console.log(colors.bgBrightGreen('  Onboarding complete!  '));
}
process.exit(0);
