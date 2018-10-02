const path = require('path');
const assert = require('assert');

const {
  getFileStats,
  getFormattedStats,
  printFileStats
} = require('./');

const fixturePath = path.resolve(__dirname, 'fixtures');

const main = async () => {
  try {
    let stats;

    // TEST: default options

    stats = await getFileStats(fixturePath);

    assert.deepEqual(stats, [
      { path: 'a.js', rawSize: 36, gzippedSize: 35 },
      { path: 'b.js', rawSize: 12, gzippedSize: 32 },
      { path: 'deep/c.js', rawSize: 1532, gzippedSize: 759 }
    ], 'failed to handle defaults');

    // TEST: using a filter

    stats = await getFileStats(fixturePath, {
      filter: f => !f.includes('b'),
    });

    assert.deepEqual(stats, [
      { path: 'a.js', rawSize: 36, gzippedSize: 35 },
      { path: 'deep/c.js', rawSize: 1532, gzippedSize: 759 }
    ], 'failed to filter');

    // TEST: supress gzip

    stats = await getFileStats(fixturePath, {
      filter: f => !f.includes('b'),
      checkGzip: false,
    });

    assert.deepEqual(stats, [
      { path: 'a.js', rawSize: 36 },
      { path: 'deep/c.js', rawSize: 1532 }
    ], 'failed to suppress gzip check');

    // TEST: restrict depth

    stats = await getFileStats(fixturePath, {
      maxDepth: 0,
    });

    assert.deepEqual(stats, [
      { path: 'a.js', rawSize: 36, gzippedSize: 35 },
      { path: 'b.js', rawSize: 12, gzippedSize: 32 },
    ], 'failed to limit depth');

    // TEST: getFormattedStats

    stats = await getFormattedStats(fixturePath)

    assert.deepEqual(stats.split('\n'), [
      'file       raw    gzip',
      '....       ...    ....',
      'a.js       36B    35B',
      'b.js       12B    32B',
      'deep/c.js  1.5KB  759B'
    ]);

    // TEST: getFormattedStats with custom options

    stats = await getFormattedStats(fixturePath, {
      bytesOptions: { decimalPlaces: 0 }
    })

    assert.deepEqual(stats.split('\n'), [
      'file       raw  gzip',
      '....       ...  ....',
      'a.js       36B  35B',
      'b.js       12B  32B',
      'deep/c.js  1KB  759B'
    ]);

    console.log('A OK!');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

main();
