const fs = require('fs');
const util = require('util');
const zlib = require('zlib');
const path = require('path');
const bytes = require('bytes');
const table = require('text-table');

const gzip = util.promisify(zlib.gzip);
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const getGzipSize = async (text) => {
  try {
    const data = await gzip(text);
    return data.length;
  } catch (e) {
    return 0;
  }
};

const defaults = {
  filter: () => true,
  sort: (a, b) => a.path < b.path ? -1 : 1,
  maxDepth: 10,
  checkGzip: true,
  bytesOptions: { decimalPlaces: 2 }
};

const getFileStats = async (
  base,
  options,
  /**/
  all = [],
  root = base,
  depth = 0
) => {
  options = depth ? options : Object.assign({}, defaults, options);

  const files = await readdir(base);

  await Promise.all(files.filter(options.filter).map(async (fileName) => {
    const filePath = path.join(base, fileName);
    const stats = await stat(filePath);

    if (stats.isDirectory() && depth < options.maxDepth) {
      const subFiles = await getFileStats(
        filePath,
        options,
        /**/
        all,
        root,
        depth + 1
      );
    } else if (stats.isFile()) {
      const stat = {
        path: path.relative(root, filePath),
        rawSize: stats.size
      };

      if (options.checkGzip) {
        const content = await readFile(filePath);
        stat.gzippedSize = await getGzipSize(content);
      }

      all.push(stat);
    }
  }));

  return depth === 0 && all.sort(options.sort);
};

const getFormattedStats = async (base, options) => {
  options = Object.assign({}, defaults, options);

  const stats = await getFileStats(base, options);

  const rows = stats.map(({ path, rawSize, gzippedSize}) => ([
    path,
    bytes(rawSize, options.bytesOptions),
    gzippedSize ? bytes(gzippedSize, options.bytesOptions) : '-',
  ]));

  const headings = [
    ['file', 'raw', 'gzip'],
    ['....', '...', '....'],
  ];

  return table(headings.concat(rows));
};

const printFileStats = async (...args) => {
  console.log(await getFormattedStats(...args));
};

module.exports = {
  getFileStats,
  getFormattedStats,
  printFileStats
};
