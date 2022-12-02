import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
});

export default router;

// import route from './routes/__route.js';
// app.use('/__route', route);

// https://expressjs.com/en/guide/routing.html
// bottom of page
