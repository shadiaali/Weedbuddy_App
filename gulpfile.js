const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sass({
            outputStyle: "compressed"
        }))
        .pipe(gulp.dest('./app/css'))
})

gulp.task('default', gulp.series('sass'), function () {
    gulp.watch('./app/sass/**/*.scss'), gulp.series('sass');
})