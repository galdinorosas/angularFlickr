var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');



// To run broswer sync (to make browser auto-update the browser to visually see changes instantly)
// open a new tab in terminal and run this code: browser-sync start --server --files "css/*.css,index.html"


gulp.task('jshint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// gulp.task('minify-css', function() {
//     return gulp.src('public/css/*.css')
//         .pipe(minifyCss({ compatibility: 'ie8' }))
//         .pipe(gulp.dest('public/css/minified/'));
// });


gulp.task('css', function() {
    var processors = [
        autoprefixer({ browsers: ['last 1 version'] }),
        mqpacker,
        csswring
    ];
    return gulp.src('public/css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('public/css/autoprefixed/'));
});


// Compile Sass task
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/css/'));
});

// Watch task
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['jshint']);
    gulp.watch('scss/*.scss', ['sass']);
});



gulp.task('html', function() {
    return gulp.src('index.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('public/'));
});

// JavaScript build task, removes whitespace and concatenates all files
gulp.task('scripts', function() {
    return browserify('js/angular.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'));
});

// Styles build task, concatenates all the files
// gulp.task('styles', function() {
//     return gulp.src('public/css/*.css')
//         .pipe(concat('styles.css'))
//         .pipe(gulp.dest('public/css/concat/'));
// });

// Image optimization task
gulp.task('images', function() {
    return gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));
});

// Build task
gulp.task('build', ['jshint', 'sass', 'html', 'scripts', 'images', 'css']);

// Default task
gulp.task('default', ['jshint', 'sass', 'watch']);
