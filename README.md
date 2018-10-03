# disty

Pretty-print dist file sizes with minimal dependencies.

### why

With npm audits and increasingly huge dev tools, I wanted a solution for this that requires very few other tools.

It installs and boots fast and makes me happy :)

### dependencies

|Package|What|Why
|:----|:---|:---|
|[`bytes`](https://www.npmjs.com/package/bytes)| zero-dependency human readible file sizes | improves api for input/output|
|[`text-table`](https://www.npmjs.com/package/text-table)| zero-dependency ascii tablualar data |better printing for output|

### Installation

```bash
$ npm i disty
```

### Use in package.json

```json
{
  "scripts": {
    "size": "disty --path dist"
  }
}
```

### Node API

```javascript
const { printFileStats } = require('disty');

printFileStats('path/to/directory', [options]); // prints to console and returns promise
```

**OPTIONS**

- `filter`: function given a file path, returns true if it should be included
- `sort`: function given two file objects that sorts them
- `maxDepth`: how many folders deep should it continue (0 is top level only)
- `checkGzip`: also estimate gzip size (true by default)
- `bytesOptions`: formatting options passed to `bytes`
