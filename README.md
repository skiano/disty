# disty
Pretty print dist file sizes with only bare minimum of dependencies.

```

### Why

With npm audits and increasingly huge dev tools, I am starting to really want packages that have very shallow dependency trees, so this one has exactly two: `bytes` and `text-table`, which both have none.

It installs and boots fast and makes me happy :)

### API

```javascript
const {
  printFileStats,
  getFormattedStats,
  getFileStats
} = require('disty');


printFileStats('path/to/directory', [options]); // prints to console and returns promise
```

*OPTIONS*

- `filter`: function given a file path, returns true if it should be included
- `sort`: function given two file objects that sorts them
- `maxDepth`: how many folders deep should it continue (0 is top level only)
- `checkGzip`: also estimate gzip size (true by default)
- `bytesOptions`: formatting options passed to `bytes`

### TODO

- setup a cli for convienience
