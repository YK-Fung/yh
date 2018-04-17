// 插件
var gulp = require('gulp');
var	replace = require('gulp-replace');
var	gulpif = require('gulp-if');
var	watch = require('gulp-watch');
var	changed = require('gulp-changed');
var	inject = require('gulp-inject-string');
var	livereload = require('gulp-livereload');
var	include = require('gulp-html-tag-include');
var	less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var concatcss = require('gulp-concat-css');
var	minifycss = require('gulp-minify-css');
var	jshint = require('gulp-jshint');
var concatjs = require('gulp-concat');
var uglify = require('gulp-uglify');
var	notify = require('gulp-notify');
var	clean = require('gulp-clean');
var	zip = require('gulp-zip');

// 基础路径和状态
var basePath = 'project/';
var outPath = 'dist/';
var backupPath = '../';
var state = false;

/*获取当前时间日期*/
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var minutes = date.getMinutes();
var second = date.getSeconds();
var time = '[' + year + '-' + month + '-' + day + '-' + hour + minutes + second +']';

/*错误提示*/
function errorHandler(){
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: 'compile error',
		message: '<%=error.message %>'
	}).apply(this, args);//替换为当前对象
	this.emit();//提交
}

// 配置
gulp.task('html', function(){
	return gulp.src([basePath +'html/*.html', basePath +'html/**/*.html'])
	.pipe(gulpif(state, inject.before('</body>','<script src="http://localhost:35729/livereload.js"></script>')))
	.pipe(include()).on('error', errorHandler)
	.pipe(changed(basePath +'html/**'))
	.pipe(gulp.dest(outPath +'html/'))
	.pipe(livereload());
});
gulp.task('less', function(){
	return gulp.src([basePath + 'less/*.less', basePath + 'less/**/*.less'])
	.pipe(less()).on('error', errorHandler)
    .pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 9', '> 1%'], cascade: false, remove:true}))
	.pipe(changed(outPath +' css/**'))
	.pipe(minifycss())
	.pipe(gulp.dest(outPath + 'css/'))
	.pipe(livereload());
});
gulp.task('css', function(){
	return gulp.src(basePath + 'css/*.css')
	.pipe(changed(outPath +' css/*.css'))
	.pipe(concatcss('bundle.css'))
	.pipe(minifycss())
	.pipe(gulp.dest(outPath + 'css/'))
	.pipe(livereload());
});
gulp.task('script', function(){
	return gulp.src(basePath + 'script/**')
	.pipe(changed(outPath + 'js/*.js'))
	// .pipe(concatjs('bundle.js'))
	// .pipe(uglify())
	.pipe(gulp.dest(outPath + 'js/'))
	.pipe(livereload());
});
gulp.task('js', function(){
	return gulp.src([basePath + 'js/*.js', basePath + 'js/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default')).on('error', errorHandler)
	.pipe(changed(outPath + 'js/**'))
	.pipe(gulp.dest(outPath + 'js/'))
	.pipe(livereload());
});
gulp.task('img', function(){
	return gulp.src(basePath + 'img/**')
	.pipe(changed(outPath + 'img/**'))
	.pipe(gulp.dest(outPath + 'img/'))
	.pipe(livereload());
});
gulp.task('fonts', function(){
	return gulp.src(basePath + '/fonts/**')
	.pipe(changed(outPath + '/fonts/**'))
	.pipe(gulp.dest(outPath + '/fonts/'))
	.pipe(livereload());
});

// 监听
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch([basePath +'/html/*.html', basePath +'/html/**/*.html'], ['html']);
	gulp.watch([basePath + 'less/*.less', basePath + 'less/**/*.less'], ['less']);
	gulp.watch(basePath +'/css/*.css', ['css']);
	gulp.watch(basePath +'/script/*.js', ['script']);
	gulp.watch([basePath + 'js/*.js', basePath + 'js/**/*.js'], ['js']);
	gulp.watch(basePath +'/img/**', ['img']);
	gulp.watch(basePath + '/fonts/**', ['fonts']);
});

// 清除
gulp.task('clean', function(){
	return gulp.src(outPath, {read: false})
	.pipe(clean());
});

// 任务
gulp.task('start', ['clean'], function(){
	state = true;
	gulp.run(['html', 'less', 'css', 'script', 'js', 'img', 'fonts', 'watch'], function(){
		console.log('Your success!');
	});
});

// 压缩备份
gulp.task('backup', function(){
	return gulp.src(backupPath + '**/*')
	.pipe(zip(time + 'backup.zip'))
	.pipe(gulp.dest(backupPath));
});
