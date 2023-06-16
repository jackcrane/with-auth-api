import { Events } from '../lib/index.js';

// console.log(
//   await Events().create({
//     name: 'Test Event',
//     description: 'This is a test event',
//     owner: 'd7783d19-ec6a-4eb4-9347-2ef789c32486',
//   }),
// );

console.log(
  await Events({
    owner: 'd7783d19-ec6a-4eb4-9347-2ef789c32487',
  }).read('owner'),
);
