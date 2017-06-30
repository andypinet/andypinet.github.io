const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () =>
	gulp.src('components.js')
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest('dist'))
);