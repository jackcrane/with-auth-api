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
    `NOTICE: You are about to destroy your database named "${process.env.DB_NAME}" at host "${process.env.DB_HOST}" and all internal data. If you would like to continue, enter (case sensitive) the namespace of this project. `
      .red,
    async (answer) => {
      console.log(process.env.NAMESPACE);
      if (answer !== process.env.NAMESPACE) {
        console.log('Exiting...');
        process.exit(0);
      } else {
        console.log('Continuing...');
        resolve();
      }
    },
  );
});

const initialConnection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  Promise: bluebird,
});

// Drop the database
await initialConnection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

console.log('\n');
console.log(colors.bgBrightGreen('  Spindown complete!  '));
process.exit(0);
