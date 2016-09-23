'use strict';

var gulp = require('gulp');
var server = require( 'gulp-develop-server' );
var livereload = require( 'gulp-livereload' );

var options = {
    server: {
        path: './app.js'
    }
};

var serverFiles = [
    './public/*.js',
    './public/*.html',
    './public/modules/**/*.js',
    './public/modules/**/*.html',
    './public/*.js',
    './public/modules/**/*.html',
    './public/test/**/*.js'
];

gulp.task( 'server:start', function() {
    server.listen( options.server, livereload.listen);
});

gulp.task( 'server:restart', function() {
    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
        });
    }
    gulp.watch( serverFiles ).on( 'change', restart );
});

gulp.task( 'server:watch', [ 'server:start' ],  function() {
    gulp.watch( serverFiles, [ 'server:restart' ] );
});
