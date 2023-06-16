// Create the database tables
import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import * as dotenv from 'dotenv';
dotenv.config();
import colors from 'colors';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  Promise: bluebird,
});

export async function up() {
  try {
    await connection.query(`
    alter table events
    add visibility varchar(255) default '${process.env.NAMESPACE}.STANDARD' null;
    `);
    console.log('Created events table'.green);
  } catch (error) {
    console.error(error);
  }
}

if (process.argv.includes('up')) {
  console.log('Migration up');
  up();
}
