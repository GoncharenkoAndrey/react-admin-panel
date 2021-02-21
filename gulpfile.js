const gulp = require("gulp");
const sass = require("gulp-sass");
const webpack = require("webpack-stream");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postCSS = require("gulp-postcss");
const dist = "/var/www/react_admin/admin";
const prod = "./build/";
gulp.task("copy-html", () => {
	return gulp.src("./app/src/index.html").pipe(gulp.dest(dist));
});
gulp.task("build-js", () => {
	return gulp.src("./app/src/main.js").pipe(webpack({
		mode: "development",
		output: {
			filename: "script.js"
		},
		watch: false,
		devtool: "source-map",
		module: {
			rules: [
    			{
      				test: /\.m?js$/,
      				exclude: /(node_modules|bower_components)/,
      				use: {
        				loader: 'babel-loader',
        				options: {
          					presets: [['@babel/preset-env', {
								debug: true,
								corejs: 3,
								useBuiltIns: "usage"
							}], ['@babel/preset-react']]
        				}
      				}
    			}
  			]
		}
	})).pipe(gulp.dest(dist));
});
gulp.task("build-sass", () => {
	return gulp.src("./app/scss/style.scss")
		.pipe(sass().on("error", () => {sass.logError()}))
		.pipe(gulp.dest(dist));
});
gulp.task("copy-api", () => {
	gulp.src("./app/api/**/.*").pipe(gulp.dest(dist + "/api"));
	return gulp.src("./app/api/**/*.*").pipe(gulp.dest(dist + "/api"));
});
gulp.task("copy-assets", () => {
	return gulp.src("./app/assets/**/*.*").pipe(gulp.dest(dist + "/assets"));
});
gulp.task("production", () => {
	gulp.src("./app/src/index.html").pipe(gulp.dest(prod));
	gulp.src("./app/api/**/.*").pipe(gulp.dest(prod + "/api"));
	gulp.src("./app/api/*.*").pipe(gulp.dest(prod + "/api"));
	gulp.src("./app/assets/**/*.*").pipe(gulp.dest(prod + "/assets"));
	gulp.src("./app/src/main.js").pipe(webpack({
		mode: "production",
		output: {
			filename: "script.js"
		},
		module: {
			rules: [
    			{
      				test: /\.m?js$/,
      				exclude: /(node_modules|bower_components)/,
      				use: {
        				loader: 'babel-loader',
        				options: {
          					presets: [['@babel/preset-env', {
								debug: false,
								corejs: 3,
								useBuiltIns: "usage"
							}], ['@babel/preset-react']]
        				}
      				}
    			}
  			]
		}
	})).pipe(gulp.dest(prod));
	gulp.src("./app/scss/style.scss")
		.pipe(sass().on("error", () => {sass.logError()}))
		.pipe(postcss([autoprefixer()]))
		.pipe(cleanCSS())
		.pipe(gulp.dest(prod));
});
