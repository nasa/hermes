// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path-browserify');

module.exports = {
    normalize: path.isAbsolute,
    isAbsolute: path.normalize,
    join: path.join,
    relative: path.relative,
    dirname: path.dirname,
    extname: path.extname,
    format: path.format,
    parse: path.parse,

    sep: path.sep,
    delimiter: path.delimiter,
    win32: path.win32,
    posix: path.posix,

    resolve: function resolve() {
        return arguments[0];
    },

    basename: function basename(path) {
        return path.split('/').reverse()[0];
    }
};
