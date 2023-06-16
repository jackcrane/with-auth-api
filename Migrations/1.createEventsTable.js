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
  await connection.query(`
    create table events
    (
        id          varchar(36)                         not null
            primary key,
        created_at  timestamp default CURRENT_TIMESTAMP not null,
        edited_at   timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
        owner       varchar(36)                         null,
        name        varchar(255)                        null,
        description text                                null,
        logo        varchar(255)                        null,
        url         varchar(255)                        null,
        constraint events_pk
            unique (id),
        constraint events_customers_null_fk
            foreign key (owner) references customers (id)
    );
  `);
  console.log('Created events table'.green);
}

export async function down() {
  await connection.query(`
    drop table events;
  `);
  console.log('Dropped events table'.red);
}

export async function test() {
  try {
    await connection.query(`
      SELECT * FROM events LIMIT 1;
    `);
    console.log('Tested events table'.green);
    return true;
  } catch (error) {
    console.log(error);
    console.log('Failed to test events table'.red);
    return false;
  }
}
