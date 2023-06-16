import express from 'express';
var router = express.Router();
var app = express();
import Protection from './lib/Protection.js';
import cookieParser from 'cookie-parser';

router.use(express.json());
router.use(cookieParser());

// Import routes
import signup from './routes/signup.js';
import login from './routes/login.js';
import debuggers from './routes/debuggers.js';
import verify from './routes/verify.js';
import session from './routes/session.js';
import identicon from './routes/identicon.js';
import events from './routes/events.js';

router.use('/signup', signup);
router.use('/login', login);
router.use('/debuggers', debuggers);
router.use('/verify', verify);
router.use('/session', session);
router.use('/identicon', identicon);
router.use('/events', events);

app.use(router);

await Protection({
  fatal: true,
});

app.listen(4000, () => {
  console.log('Server started on port 4000');
});
