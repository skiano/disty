const path = require('path');
const disty = require('../');

const root = process.cwd();
const args = process.argv;

const folder = args[args.findIndex(v => v === '--path') + 1]

if (!folder) {
  console.log('Please specify --path relative from package.json');
  process.exit(1);
}

disty.printFileStats(path.resolve(root, folder));
