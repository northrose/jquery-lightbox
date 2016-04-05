var gulp = require('gulp');
var karma = require('karma');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var banner = require('gulp-banner');
var runSequence = require('run-sequence');
var pkg = require("./package.json");

var comment = "/*\n" +
    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
    " *  <%= pkg.description %>\n" +
    " *  <%= pkg.homepage %>\n" +
    " *\n" +
    " *  Made by <%= pkg.author.name %>\n" +
    " *  Under <%= pkg.license %> License\n" +
    " */\n";

gulp.task('tests', function(done) {
   return karma.start({
       configFile: __dirname + '/karma.conf.js',
       singleRun: false
   }, done); 
});

gulp.task('jshint', function() {
   return gulp.src(['src/*.js', 'test/**/*.js'])
       .pipe(jshint(".jshintrc"))
       .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function() {
   return gulp.src('src/**/*.js')
       .pipe(jscs())
       .pipe(jscs.reporter());
});

gulp.task('concat', function() {
   return gulp.src('./src/jquery.lightbox.js')
       .pipe(banner(comment, { pkg: pkg }))
       .pipe(concat('jquery.lightbox.js'))
       .pipe(gulp.dest('./dist/'))
       .pipe(gulp.dest('./demo/public/js/'));
});

gulp.task('uglify', function() {
   return gulp.src('./dist/jquery.lightbox.js')
       .pipe(rename('jquery.lightbox.min.js'))
       .pipe(uglify())
       .pipe(banner(comment, { pkg: pkg }))
       .pipe(gulp.dest('./dist/'))
       .pipe(gulp.dest('./demo/public/js/'));
});

gulp.task('lint', ['jshint'], function(cb) {
    runSequence(['jscs'], cb);
});
gulp.task('build', ['concat'], function(cb) {
    runSequence(['uglify'], cb);
});
gulp.task('default', ['jshint', 'build', 'tests']);
