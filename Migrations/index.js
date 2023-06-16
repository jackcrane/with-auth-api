import * as createEventsTable from './1.createEventsTable.js';

(() => {
  if (process.argv.includes('up')) {
    console.log('Migration up');
    createEventsTable.up();
  }
  if (process.argv.includes('down')) {
    console.log('Migration down');
    createEventsTable.down();
  }
  if (process.argv.includes('test')) {
    console.log('Migration test');
    createEventsTable.test();
  }
})();
