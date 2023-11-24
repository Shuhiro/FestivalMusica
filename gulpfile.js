//src sirve para identificar un archivo y dest para guardarlo
const { src, dest, watch, parallel } = require("gulp");
//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Imagenes
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const avif = require('gulp-avif');

//Javascript
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss')//Identificar archivo de SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())// si hay errores no detiene la ejecucion
        .pipe(sass())//Compilar el archivo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));//Almacenarla en el disco duro
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));
    done()
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) {
    const opciones = {
        calidad: 50
    };
    src('src/img/**/*.{png,jpg}') // Buscar todas las imagenes
        .pipe(webp(opciones.calidad))
        .pipe(dest('build/img'));
    done();
}
function versionAvif(done) {
    const opciones = {
        calidad: 50
    };
    src('src/img/**/*.{png,jpg}') // Buscar todas las imagenes
        .pipe(avif(opciones.calidad))
        .pipe(dest('build/img'));
    done();
}
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);