import Protection from '../lib/Protection.js';
import colors from 'colors';

const c = await Protection();

if (c === 'pass') {
  console.log(colors.bgBrightGreen('  Protection passed  '));
} else {
  console.log(colors.bgBrightRed('  Protection failed  '));
}
process.exit(0);
