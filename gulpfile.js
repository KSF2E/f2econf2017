var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer'),
    pngquant = require('imagemin-pngquant'),
    ghPages = require('gulp-gh-pages'),
    jpegoptim = require('imagemin-jpegoptim');

var path = {

    bulid: './bulid/',
    public: './public/',
    bower: './bower_components/'
}

gulp.task('browserSync', function() {

    browserSync.init({
        server: { baseDir: path.public }
    })

});

gulp.task('jade', function() {

    return gulp.src(path.bulid + 'jade/**/*.jade')
        .pipe($.changed(path.public, { extension: '.html' }))
        .pipe($.plumber({
            errorHandler: $.notify.onError("jade compile error")
        }))
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.public))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'jade compile success'
        }));

});

gulp.task('clean_jadeTemplate', ['jade'], function() {

    del(['./public/layout/']);

});

gulp.task('scss', function() {

    var processors = [
        autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        })
    ];

    return gulp.src(path.bulid + 'scss/**/*.scss')
        .pipe($.plumber({
            errorHandler: $.notify.onError("scss compile error")
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            // outputStyle: 'compressed',
            outputStyle: 'expanded',
            includePaths: [path.bower + 'bootstrap-sass/assets/stylesheets']
        }).on('error', $.sass.logError))
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write("./maps"))
        .pipe(gulp.dest(path.public + 'css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'sass compile success'
        }));

});

gulp.task('scripts', function() {

    gulp.src([path.bulid + 'js/**/*.js', '!node_modules/**'])
        .pipe($.plumber({
            errorHandler: $.notify.onError("js compile error")
        }))
        .pipe($.uglify())
        .pipe(gulp.dest(path.public + 'js'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'js compile success'
        }));

});

gulp.task('imageCompress', function() {

    gulp.src(path.bulid + 'images/**/*')
        .pipe($.newer(path.public + 'images'))
        .pipe($.imagemin({
            progressive: true,
            use: [pngquant(), jpegoptim({ size: "60%" })]
        }))
        .pipe($.size({
            showFiles: true,
            pretty: true
        }))
        .pipe(gulp.dest(path.public + 'images'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'image compressed success'
        }));

});

gulp.task('fonts', function() {

    gulp.src(path.bulid + 'fonts/**/*')
        .pipe(gulp.dest(path.public + 'fonts/'));

});

gulp.task('jsPlugin', function() {

    gulp.src(path.bower + 'jquery/dist/jquery.min.js')
        .pipe(gulp.dest(path.public + 'plugin/'));

});


gulp.task('clean', function() {

    return del([path.public + '*.html', path.public + 'css/maps/', path.public + 'css/*.css', path.public + 'images/*', path.public + 'js/*']);

});

gulp.task('complierTask', ['clean'], function() {

    gulp.start('clean_jadeTemplate', 'scss', 'scripts', 'imageCompress', 'fonts', 'jsPlugin');

});

gulp.task('deploy', function() {

    return gulp.src('./public/**/*')
        .pipe(ghPages());
});

gulp.task('default', ['complierTask', 'browserSync'], function() {

    gulp.watch(path.bulid + 'jade/**/*.jade', ['clean_jadeTemplate']);
    gulp.watch(path.bulid + 'scss/**/*.scss', ['scss']);
    gulp.watch(path.bulid + 'plugin/**/*', ['jsPlugin']);
    gulp.watch(path.bulid + 'js/**/*.js', ['scripts']);
    gulp.watch(path.bulid + 'images/**/*', ['imageCompress']);
    gulp.watch(path.bulid + 'fonts/**/*', ['fonts']);

});
