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
   return gulp.src([ 
       './src/northrose.lightboxLink.js', 
       './src/northrose.imageLightboxLink.js', 
       './src/northrose.formLightboxLink.js'
   ] )
       .pipe($.banner(comment, { pkg: pkg }))
       .pipe($.concat('northrose-lightboxlink.js'))
       .pipe(gulp.dest('./dist/'))
       .pipe(gulp.dest('./demo/public/js/'));
});

gulp.task('uglify', function() {
   return gulp.src('./dist/northrose-lightboxlink.js')
       .pipe($.rename('northrose-lightboxlink.min.js'))
       .pipe($.uglify())
       .pipe($.banner(comment, { pkg: pkg }))
       .pipe(gulp.dest('./dist/'))
       .pipe(gulp.dest('./demo/public/js/'));
});

gulp.task('sass', function() {
   return gulp.src('scss/app.scss')
       .pipe($.sass())
       .on('error', function(error) {
            console.log(error);
            this.emit('end');
        })
       .pipe($.autoprefixer({
           browsers: ['last 2 versions', 'ie >= 9']
       }))
       .pipe($.cssnano())
       .pipe(gulp.dest('./demo/public/css/'))
       .pipe($.rename('northrose-lightboxlink.css'))
       .pipe(gulp.dest('./dist/'));
});

gulp.task('lint', ['jshint'], function(cb) {
    runSequence(['jscs'], cb);
});
gulp.task('build', ['concat', 'sass'], function(cb) {
    runSequence(['uglify'], cb);
});
gulp.task('default', ['jshint', 'build', 'tests']);
