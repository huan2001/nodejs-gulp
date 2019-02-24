const gulp = require('gulp')
const imagein = require('gulp-imagemin')
const uglify = require('gulp-uglify')
const less = require('gulp-less')
const sass = require('gulp-sass')
const cleanCss = require('gulp-clean-css')
const concatCss = require('gulp-concat-css')
const concatJs = require('gulp-concat')
const browserSync = require('browser-sync').create()

/* 
TOP LEVEL FUNCTIONS USED IN GULP
gulp.task: used to define the task.
gulp.src: used to point the file to be used.
gulp.desc: used to point to th output folder
gulp.wathc: gulp watched the changes in the files so that we don't have run every time.
EXAMPLE:
gulp.task('message', gulp.series(function(done) {
    console.log("hello gulp config of rhp team");
    done();
}));
*/

gulp.task('copyHtmlFile', gulp.series(function(done) {
    gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('optimizeImage', gulp.series(function(done) {
    gulp.src('src/images/*')
        .pipe(imagein())
        .pipe(gulp.dest('build/images'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('uglifyJs', gulp.series(function(done) {
    gulp.src('src/js/*')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('less', gulp.series(function(done) {
    gulp.src('src/less/*')
        .pipe(less())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('sass', gulp.series(function(done) {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('cssCombine', gulp.series(function(done) {
    gulp.src('src/css/*')
        .pipe(concatCss('main.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('jsCombine', gulp.series(function(done) {
    gulp.src('src/js/*')
        .pipe(concatJs('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream())
    done()
}))

gulp.task('browserSync', gulp.series(function(done) {
    browserSync.init({
        server: {
            baseDir: "build"
        }
    })
    done()
}))

gulp.task('configServer', gulp.series(['browserSync', 'copyHtmlFile', 'optimizeImage', 'sass', 'jsCombine'], function(done) {
    gulp.watch('src/**/*.html', gulp.series('copyHtmlFile'))
    gulp.watch('src/images/**/*', gulp.series('optimizeImage'))
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'))
    gulp.watch('src/js/**/*.js', gulp.series('jsCombine'))
    gulp.watch('src/**/*.html', browserSync.reload)
}))

gulp.task('default', gulp.series('configServer', function(done) {
    done()
}))