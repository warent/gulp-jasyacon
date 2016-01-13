var gutil = require('gulp-util'),
    through = require('through2'),
    path = require('path'),
    YAML = require('yaml-to-json'),
    glob = require('glob-fs')({ gitignore: true }),
    fs = require('fs');

var getLines = function(contents) {
  return contents.replace(/\r\n/g, '\n').split(/\n/);
}

var jasyacon_r = /\/\*(\s+)\!\!jasyacon (.+)(\s+)\*\//;

module.exports = function(opts) {
  if (!opts.nopipe) {
    return piper(opts);
  } else {
    return converter(opts);
  }
};

var piper = function(opts) {

  if (!opts.noassoc) {
    var parsedYAMLFiles = [];
  } else {
    var parsedYAMLFiles = {};
  }

  yamlArgs = opts.yaml || {};

  glob.use(function (file) {
    parsedYAML = YAML(fs.readFileSync(file.path).toString(), yamlArgs);
    id = path.basename(file.path, path.extname(file.path));
    !opts.noassoc ? parsedYAMLFiles[id] = parsedYAML : parsedYAMLFiles.push(parsedYAML)
  });

  glob.readdirSync(opts.glob);

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
}

var converter = function(opts) {

  if (!opts.noassoc) {
    var parsedYAMLFiles = {};
  } else {
    var parsedYAMLFiles = [];
  }

  yamlArgs = opts.yaml || {};


  glob.use(function (file) {
    parsedYAML = YAML(fs.readFileSync(file.path).toString(), yamlArgs);
    id = path.basename(file.path, path.extname(file.path));
    if (parsedYAML.length == 1) {
      parsedYAML = parsedYAML[0];
    }
    !opts.noassoc ? parsedYAMLFiles[id] = parsedYAML : parsedYAMLFiles.push(parsedYAML)
  });

  glob.readdirSync(opts.glob);

  return parsedYAMLFiles;
}
