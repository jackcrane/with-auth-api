import express from 'express';
const router = express.Router();
import * as jdenticon from 'jdenticon';

router.get('/:uid', (req, res) => {
  const uid = req.params.uid;
  const image = jdenticon.toPng(uid, parseInt(req.query.size) || 200);
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': image.length,
  });
  res.end(image);
});

export default router;
