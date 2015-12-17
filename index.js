var gutil = require('gulp-util'),
    through = require('through2'),
    path = require('path'),
    multimatch = require('multimatch'),
    YAML = require('yaml-to-json'),
    glob = require('glob-fs')({ gitignore: true }),
    fs = require('fs');

var getLines = function(contents) {
  return contents.replace(/\r\n/g, '\n').split(/\n/);
}

var parsedYAMLFiles = {};

var jasyacon_r = /\/\*(\s+)\!\!jasyacon (.+)(\s+)\*\//;

module.exports = function(opts) {

  yamlArgs = opts.yamlArgs || {};

  glob.use(function (file) {
    parsedYAML = YAML(fs.readFileSync(file.path).toString(), yamlArgs);
    id = path.basename(file.path, path.extname(file.path));
    parsedYAMLFiles[id] = parsedYAML;
  });

  glob.readdirSync(opts.yamlGlob);

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-jasyacon', 'Streaming not supported'));
    }

    newContents = "";

    lines = getLines(file.contents.toString());
    lines.forEach(function (line) {
      jasyaconMatch = line.match(jasyacon_r);
      if (jasyaconMatch) line = line.replace(jasyacon_r, JSON.stringify(parsedYAMLFiles[jasyaconMatch[2]]));
      newContents += line + "\r\n";
    });

    try {
      file.contents = new Buffer(newContents);
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-jasyacon', err));
    }

    cb();
  });
};
