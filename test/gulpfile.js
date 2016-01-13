var jasyacon = require('../'),
    gulp = require('gulp');

gulp.task("default", function() {
  gulp.src(['./source/**/*.js'])
    .pipe(jasyacon({glob: './source/yaml/**/*.yaml'}))
    .pipe(gulp.dest('./public/'));
});

console.log(
  JSON.stringify(jasyacon({
    glob: './source/yaml/**/*.yaml',
    nopipe: true
  }))
);
