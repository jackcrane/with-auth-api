import colors from 'colors';
import Stripe from 'stripe';
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();
import { connection } from './index.js';

const processCodes = {
  verbose: '--verbose',
  verboseShort: '-v',
  exitOnFail: '--exit-on-fail',
  exitOnFailShort: '-e',
  skip: '--skip-protection',
  skipShort: '-s',
};

const Quit = () => {
  console.log(
    colors.bgBrightRed(
      '  Protection check failed, fatal flag set to true. Exiting process with exit code (1)  ',
    ),
  );
  process.exit(1);
};

const PC = (code) => {
  return process.argv.includes(code);
};

const test = async (args) => {
  // args could be {includes, mute}
  if (args === undefined) {
    args = {};
  }
  const { includes, mute, fatal } = args;
  if (PC(processCodes.skip) || PC(processCodes.skipShort)) {
    !mute && console.log(colors.yellow('Skipping tests'));
    return;
  }
  let fail = false;

  const testSkip = (phase) => {
    if (includes) {
      if (includes.includes(phase)) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const promises = [];

  if (!testSkip('Vars')) {
    // Verify all environment variables are set
    promises.push(
      (async () => {
        // Verify environment variables
        const env = process.env;
        const envKeys = Object.keys(env);

        const requiredEnvKeys = [
          'DB_HOST',
          'DB_USER',
          'DB_PASS',
          'DB_NAME',
          'STRIPE_PK',
          'STRIPE_SK',
          'TWILIO_SID',
          'TWILIO_AUTH_TOKEN',
          'TWILIO_PHONE_NUMBER',
          'NAMESPACE',
          'FRIENDLY_NAME',
          'SENDGRID_API_KEY',
        ];
        const missingEnvKeys = requiredEnvKeys.filter(
          (key) => !envKeys.includes(key),
        );
        if (missingEnvKeys.length > 0) {
          !mute && console.log(colors.red('Missing environment variables:'));
          !mute && console.log(colors.red(missingEnvKeys.join(', ')));
          if (
            PC(processCodes.exitOnFail) ||
            PC(processCodes.exitOnFailShort) ||
            Boolean(fatal)
          ) {
            Quit();
          }
        } else {
          !mute && console.log(colors.green('Environment variables are set'));
        }
      })(),
    );
  }

  if (!testSkip('DbConnection')) {
    // Verify database connection
    promises.push(
      (async () => {
        try {
          if (connection.state === 'FAIL') {
            if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
              !mute && console.log(colors.red(connection.error));
            }
            throw new Error('Connection is null. See error above.');
          }
          await connection.execute('SELECT 1');
          !mute && console.log(colors.green('MySQL connected'));
        } catch (error) {
          fail = true;
          !mute && console.log(colors.red('MySQL connection failed'));
          if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
            !mute && console.log(error);
          }
          if (
            PC(processCodes.exitOnFail) ||
            PC(processCodes.exitOnFailShort) ||
            Boolean(fatal)
          ) {
            Quit();
          }
        }
      })(),
    );
  }

  if (!testSkip('DbTables')) {
    // Verify database tables exist
    promises.push(
      (async () => {
        try {
          const tables = ['customers', 'auth_nonces', 'verifications'];
          const res = await connection.execute('SHOW TABLES');
          const missingTables = [];
          const tableNames = res[0].map((table) => Object.values(table)[0]);
          tables.forEach((table) => {
            if (!tableNames.includes(table)) {
              missingTables.push(table);
            }
          });
          if (missingTables.length > 0) {
            !mute && console.log(colors.red('Missing database tables:'));
            !mute && console.log(colors.red(missingTables.join(', ')));
            if (
              PC(processCodes.exitOnFail) ||
              PC(processCodes.exitOnFailShort) ||
              Boolean(fatal)
            ) {
              Quit();
            }
            if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
              !mute && console.log(colors.red('Tables found:'));
              !mute && console.log(colors.red(tables.join(', ')));
            }
          }
          !mute && console.log(colors.green('Database tables exist'));
        } catch (error) {
          fail = true;
          !mute &&
            console.log(
              colors.red(
                'Database tables check failed. Suggest using -v to see error',
              ),
            );
          if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
            !mute && console.log(error);
          }
          if (
            PC(processCodes.exitOnFail) ||
            PC(processCodes.exitOnFailShort) ||
            Boolean(fatal)
          ) {
            Quit();
          }
        }
      })(),
    );
  }

  if (!testSkip('Stripe')) {
    // Verify Stripe API Key validity
    promises.push(
      (async () => {
        try {
          const stripe = await Stripe(process.env.STRIPE_SK);
          await stripe.customers.list();
          !mute && console.log(colors.green('Stripe connected'));
        } catch (error) {
          fail = true;
          !mute && console.log(colors.red('Stripe connection failed'));
          if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
            !mute && console.log(error);
          }
          if (
            PC(processCodes.exitOnFail) ||
            PC(processCodes.exitOnFailShort) ||
            Boolean(fatal)
          ) {
            Quit();
          }
        }
      })(),
    );
  }

  if (!testSkip('Twilio')) {
    // Verify Twilio API Key validity
    promises.push(
      (async () => {
        try {
          const twilClient = twilio(
            process.env.TWILIO_SID,
            process.env.TWILIO_AUTH_TOKEN,
          );
          await twilClient.messages.list();
          !mute && console.log(colors.green('Twilio connected'));
        } catch (error) {
          fail = true;
          !mute && console.log(colors.red('Twilio connection failed'));
          if (PC(processCodes.verbose) || PC(processCodes.verboseShort)) {
            !mute && console.log(error);
          }
          if (
            PC(processCodes.exitOnFail) ||
            PC(processCodes.exitOnFailShort) ||
            Boolean(fatal)
          ) {
            Quit();
          }
        }
      })(),
    );
  }

  await Promise.all(promises);
  return fail ? 'fail' : 'pass';
};

export default test;
