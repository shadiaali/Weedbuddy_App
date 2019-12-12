const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");


gulp.task("sass", function() {
return gulp
    .src("./app/sass/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest("./app/css"));
});

gulp.task("watch", function() {
gulp.watch("./app/sass/**/*.scss", gulp.series("sass", "reload"));
gulp.watch("./app/*.{html,js,css}", gulp.series("reload"));
});

gulp.task("serve", function() {
browserSync.init({
    server: {
    baseDir: "./app",
    index: "index.html"
    }
});
});

gulp.task("reload", function(done) {
    browserSync.reload();
    done();
});

gulp.task("default", gulp.parallel("serve", "watch"));

