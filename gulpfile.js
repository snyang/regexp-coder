const gulp = require('gulp');
const shell = require('gulp-shell');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname);
const distDir = path.join(root, 'dist');

gulp.task('lint', shell.task(['npm run lint'], {
	cwd: root,
}));

gulp.task('test', shell.task(['npm run test'], {
	cwd: root,
}));

gulp.task('dist', shell.task(['tsc'], {
	cwd: root,
}));

gulp.task('doc', shell.task(`${path.join('node_modules', '.bin', 'typedoc')} --out docs --excludePrivate --gitRevision master src`, {
	cwd: root,
}));

gulp.task('docs:copy', (cb) => {
	gulp.src([path.join(root, '.nojekyll')])
		.pipe(gulp.dest(path.join(root, 'docs')));
	cb();
});

gulp.task('pack', shell.task(['npm pack'], {
	cwd: root,
}));

// gulp.task('npm:unpublish', shell.task(['npm unpublish --force'], { cwd: root }));
// gulp.task('npm:publish', shell.task(['npm publish --access public'], { cwd: root }));

gulp.task('clean', (cb) => {
	if (fs.existsSync(distDir)) {
		fs.rmdirSync(distDir, {
			recursive: true,
		});
	}
	cb();
});

gulp.task('build', gulp.series('lint', 'test', 'clean', 'dist', 'doc', 'docs:copy', 'pack'));
