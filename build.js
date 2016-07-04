
var fs = require('fs');
var path = require('path');
var stripComments = require('strip-comments');
var file = stripComments(fs.readFileSync(path.resolve(__dirname, 'src', 'ArrayPool.js'), 'utf8'));
var frames = {
    '': [
        '(function(global){\n',
        '\nglobal.ArrayPool = ArrayPool;\n\n}(this));'
    ],
    amd: [
        'define(function(){\n',
        '\nreturn ArrayPool;\n\n});'
    ],
    cjs: [
        'module.exports = ArrayPool;\n',
        ''
    ],
    es6: [
        'export default ArrayPool;\n',
        ''
    ]
};

for (var type in frames) {
    var prefix = frames[type][0];
    var suffix = frames[type][1];
    var fspath = path.resolve(__dirname, 'dist', 'array-pool' + (type ? ('.' + type) : '') + '.js');
    var string = prefix + file + suffix;
    fs.writeFileSync(fspath, string, 'utf8');
}