import express from 'express';
import { Events, UseCustomerInformation } from '../lib/index.js';
const router = express.Router();
import colors from 'colors';

router.get('/:id/config', async (req, res) => {
  const events = await Events({ id: req.params.id }).read('id');
  res.json(events);
});

router.post('/:id/config', [UseCustomerInformation], async (req, res) => {
  const { id } = req.params;
  // get event
  let event = await Events({ id }).read('id');
  // Verify the customer owns the event
  if (event.owner !== req.customer.id) {
    res.status(401).json({
      message: 'Customer does not own event',
    });
    console.log(
      colors.bgBrightRed(`  ${process.env.NAMESPACE}.EVENT_UPDATE   `) +
        ` customer ${req.customer.id} does not own event ${id}`,
    );
    return;
  } else {
    let body = req.body;
    // remove nulls from body
    body = Object.keys(body).reduce((acc, key) => {
      if (body[key] !== null) {
        acc[key] = body[key];
      }
      return acc;
    }, {});
    await Events({ id }).update(body);
    res.json({ message: 'success' });
    console.log(
      colors.bgBrightBlue(`  ${process.env.NAMESPACE}.EVENT_UPDATE   `) +
        ` event updated ${id}`,
    );
  }
});

export default router;

// import route from './routes/__route.js';
// app.use('/__route', route);

// https://expressjs.com/en/guide/routing.html
// bottom of page
