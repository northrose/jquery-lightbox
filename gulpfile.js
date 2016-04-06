var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var Server = require('karma').Server;
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
   return new Server({
       configFile: __dirname + '/karma.conf.js',
       singleRun: true
   }, done).start();
});

gulp.task('jshint', function() {
   return gulp.src(['src/*.js', 'test/**/*.js'])
       .pipe($.jshint(".jshintrc"))
       .pipe($.jshint.reporter('default'));
});

gulp.task('jscs', function() {
   return gulp.src('src/**/*.js')
       .pipe($.jscs())
       .pipe($.jscs.reporter());
});

gulp.task('concat', function() {
   return gulp.src('./src/jquery.lightbox.js')
       .pipe($.banner(comment, { pkg: pkg }))
       .pipe($.concat('jquery.lightbox.js'))
       .pipe(gulp.dest('./dist/'))
       .pipe(gulp.dest('./demo/public/js/'));
});

gulp.task('uglify', function() {
   return gulp.src('./dist/jquery.lightbox.js')
       .pipe($.rename('jquery.lightbox.min.js'))
       .pipe($.uglify())
       .pipe($.banner(comment, { pkg: pkg }))
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
