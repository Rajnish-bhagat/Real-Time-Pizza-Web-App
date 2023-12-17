// webpack.mix.js

let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css'); // If we would have used plain webpack, it would have required more configurations. Here in laravel mix, we do it in a single line.