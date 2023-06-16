import mysqldump from 'mysqldump';
import * as dotenv from 'dotenv';
dotenv.config();

mysqldump({
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  dumpToFile: './dump.sql',
});
