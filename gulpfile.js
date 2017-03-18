var path = {
    bulid: './bulid/',
    public: './public/',
    bower: './bower_components/'
}

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer'),
    pngquant = require('imagemin-pngquant'),
    jpegoptim = require('imagemin-jpegoptim');

gulp.task('browserSync', function() {

    browserSync.init({
        server: { baseDir: './public/' }
    })

});

gulp.task('jade', function() {

    return gulp.src('./bulid/jade/**/*.jade')
        .pipe($.changed('./public/', { extension: '.html' }))
        .pipe($.plumber({
            errorHandler: $.notify.onError("jade compile error")
        }))
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
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
// gulp.task('scss', function() {
//     return gulp.src('./bulid/scss/**/*.scss')
//         .pipe($.plumber({
//             errorHandler: $.notify.onError("scss compile error")
//         }))
//         .pipe($.sourcemaps.init())
//         .pipe($.sass({
//             outputStyle: 'expanded',
//             includePaths: [path.bower + 'bootstrap-sass/assets/stylesheets']
//         }).on('error', $.sass.logError))
//         .pipe(autoprefixer({
//             browsers: ['last 5 versions', 'ie >= 9'],
//             cascade: true
//         }))
//         .pipe($.sourcemaps.write("./maps"))
//         .pipe(gulp.dest('./public/css'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
//         .pipe($.notify({
//             message: 'sass compile success'
//         }));
// });

gulp.task('scss', function() {

    var processors = [
        autoprefixer({
           browsers: ['last 2 version', 'safari 5', 'ie 6', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        })
    ];

    return gulp.src('./bulid/scss/**/*.scss')
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
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'sass compile success'
        }));

});


// gulp.task('scripts', function() {

//     gulp.src(['./bulid/js/**/*.js', '!node_modules/**'])
//         .pipe($.eslint({
//             extends: 'eslint:recommended',
//             rules: {
//                 "no-unused-vars": ["error", {
//                     "vars": "local"
//                 }]
//             },
//             globals: {
//                 "jQuery": false,
//                 "$": true
//             }
//         }))
//         .pipe($.eslint.format())
//         .pipe($.plumber({
//             errorHandler: $.notify.onError("js compile error")
//         }))
//         .pipe($.uglify())
//         .pipe(gulp.dest('./public/js'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
//         .pipe($.notify({
//             message: 'js compile success'
//         }));

// });

gulp.task('imageCompress', function() {

    gulp.src('./bulid/images/**/*')
        .pipe($.newer('./public/images'))
        .pipe($.imagemin({
            progressive: true,
            use: [pngquant(), jpegoptim({ size: "60%" })]
        }))
        .pipe($.size({
            showFiles: true,
            pretty: true
        }))
        .pipe(gulp.dest('./public/images'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'image compressed success'
        }));

});

gulp.task('clean', function() {

    return del(['./public/*.html', './public/css/maps/', './public/css/*.css', './public/images/*']);

});

gulp.task('complierTask', ['clean'], function() {

    gulp.start('clean_jadeTemplate', 'scss', 'imageCompress');

});

gulp.task('default', ['complierTask', 'browserSync'], function() {

    gulp.watch('./bulid/jade/**/*.jade', ['clean_jadeTemplate']);
    gulp.watch('./bulid/scss/**/*.scss', ['scss']);
    // gulp.watch('./bulid/js/**/*.js', ['scripts']);
    gulp.watch('./bulid/images/**/*', ['imageCompress']);

});
