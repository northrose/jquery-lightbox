var gulp = require('gulp');
var karma = require('karma');
var jasmine = require('jasmine');

gulp.task('tests', function(done) {
   return karma.start({
       configFile: __dirname + '/karma.conf.js',
       singleRun: false
   }, done); 
});

gulp.task('default', ['tests']);
