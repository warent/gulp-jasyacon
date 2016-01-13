# Gulp JasYaCon

### *Note: This package is highly unstable and subject to backwards-incompatible changes*

Occasionally we find ourselves with a lot of static JSON objects floating around our scripts, causing clutter and ugliness. *JasYaCon* (**JS**ON **YA**ML **Con**solidator) is able to convert a YAML file into a JSON object, and then place that object directly into your script wherever specified, allowing for cleaner code and extremely easy replication.

## Arguments
* (glob) glob - The glob containing all of the yaml files for processing.
* (object) yaml - These are passed directly into [Yaml to Json]. Please refer to that package's documentation.
* (bool) nopipe - If true, the YAML glob will be converted into an array of JSON objects and directly returned.

## Sample Use
First we have our yaml file. Let's say the full path is: ./src/yaml/Persons.yaml
```yaml
---
    name: "John"
    age: 23

---
    name: "Sally"
    age: 51
```
Now we have our javascript in which we want to import these people. Let's say the full path is ./src/js/myScript.js
```js
var ListOfPeople = /* !!jasyacon Persons */;
```
Finally, we have our gulpfile.js
```js
var jasyacon = require('gulp-jasyacon'),
    gulp = require('gulp');

gulp.task("default", function() {
  gulp.src(['./src/js/**/*.js'])
    .pipe(jasyacon({yamlGlob: './src/yaml/**/*.yaml'}))
    .pipe(gulp.dest('./public/'));
});
```
This will compile, creating a file with the path ./public/myScript.js
That file will look like this:
```js
var ListOfPeople = [{"name": "John", "age": 22},{"name": "Sally", "age", 51}];
```

## Plugins
gulp-jasyacon utilizes the following plugins:
- [Gulp]
- [Glob FS]
- [Yaml to JSON]
- [Through2]
- [Path]

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Glob FS]: <https://www.npmjs.com/package/glob-fs>
   [Yaml to Json]: <https://www.npmjs.com/package/yaml-to-json>
   [Through2]: <https://www.npmjs.com/package/through2>
   [Gulp]: <https://www.npmjs.com/package/gulp>
   [Path]: <https://www.npmjs.com/package/path>
