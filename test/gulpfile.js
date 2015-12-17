var assert = require('assert'),
    es = require('event-stream'),
    File = require('vinyl'),
    jasyacon = require('../'),
    gulp = require('gulp');

gulp.task("default", function() {
  gulp.src(['./source/**/*.js'])
    .pipe(jasyacon({yamlGlob: './source/yaml/**/*.yaml'}))
    .pipe(gulp.dest('./public/'));
});