var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    opn = require('opn'),
    cleanf = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require("gulp-rename"),
    copy = require("gulp-copy"),
    autorem = require('autorem'),
    browserSync = require('browser-sync'),
    cssMqpacker = require('css-mqpacker'),
    atImport = require("postcss-import"),
    opacity = require('postcss-opacity'),
    messages = require('postcss-messages'),
    del = require('del'),
    autoprefixer = require('autoprefixer'),
    cache = require('gulp-cache'),
    gulpPostcss = require('gulp-postcss'),
    postcss = require('postcss'),
    size = require('gulp-size'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    postcssShort = require('postcss-short'),
    postcssSorting = require('postcss-sorting'),
    sprites = require('postcss-sprites').default,
    updateRule = require('postcss-sprites').updateRule,
    reload = browserSync.reload,
    postcssNested = require('postcss-nested'),
    crip = require('postcss-crip'),
    clean = require('postcss-clean'),
    ip = require('ip'),
    ipn = ip.address(),
    notify = require('gulp-notify');


var Base = function() {
    this.url = process.cwd();
    this.cur = 'postcss';
    this.cssTarget = 'css';
    this.htmlTarget = 'html';
    this.imagesTarget = 'images';
    this.fileLabe = 'file://';
    this.sPort = 9000;
    this.sNode_modules = 'newStatic';
    this.pathReg = 'v[0-9].[0-9]';
    return {
        pathCss: this.sGetMark(this.cssTarget),
        pathSass: this.url,
        pathHtml: this.sGetMark(this.htmlTarget),
        pathImg: this.sGetMark(this.imagesTarget),
        pathSever: this.sGetSeverPath(),
        domain: 'http://' + ipn + ':' + this.sPort,
        DIYPath: this.pushCustomize('css', this.pathReg),
        pluginPath: this.sGetSeverPath() + 'node_modules',
        morPath: this.url,
        fileLabe: this.fileLabe,
        isPC: this.isPC(),
        relativePath: this.relativePath('css', 'images'),
        isSystem: this.isSystem(),
        isBrowsers: this.isBrowsers(),
        pus: this.getSeverPath()
    }
};
Base.prototype.sGetMark = function(pushPath) {
    return this.url.replace(RegExp(this.cur), pushPath);
};
Base.prototype.sGetSeverPath = function() {
    var path = this.url,
        module = this.sNode_modules;
    return path.slice(0, path.indexOf(module) + module.length + 1);
}
Base.prototype.getSeverPath = function(pushPath) {
    var path = this.sGetMark(this.htmlTarget),
        _htmlPaht = path.indexOf(this.htmlTarget),
        _module = this.sNode_modules,
        _htmlSever = '',
        _moduleLen = path.indexOf(_module);
    _htmlSever = path.slice(_moduleLen + _module.length, _htmlPaht + this.htmlTarget.length);
    _htmlSever = _htmlSever.replace(/\\/g, '/');
    return _htmlSever;
};
Base.prototype.pushCustomize = function(type, sPath) {
    var path = this.url,
        reg = RegExp(sPath, 'i'),
        path = path.replace(RegExp(this.cur), type);
    if (reg.test(path)) {
        newPathArr = path.slice(0, -(reg.exec(path) + '').length);
    } else {
        newPathArr = path;
    }
    return newPathArr;
};
Base.prototype.isSystem = function() {
    return process.platform;
};
Base.prototype.isPC = function() {
    var reg = RegExp('mobile'),
        isExist = reg.test(this.url);
    if (isExist)
        return true;
    return false;

};
Base.prototype.pathGet = function(pathStr) {
    var reg = RegExp('css');
    if (reg.test(pathStr)) {
        var _localPath = this.pushCustomize(pathStr, this.pathReg);
    } else {
        var _localPath = this.sGetMark(pathStr);
    };

    var locaStrLen = _localPath.indexOf(pathStr);
    var locaPathStr = _localPath.slice(locaStrLen, _localPath.length);
    var locaArr = locaPathStr.split('/');
    var locaArrLen = locaPathStr.split('/').length;
    var locaPathStrSub = locaPathStr.slice(1, locaPathStr.length);
    return {
        locaPathStr: locaPathStr,
        locaArr: locaArr,
        locaArrLen: locaArrLen,
        locaPathStrSub: locaPathStrSub
    }
};
Base.prototype.relativePath = function() {
    var _css = this.pathGet(arguments[0]);
    var _img = this.pathGet(arguments[1]);
    var _relate = new Array(_css.locaArrLen).join('../');
    return _relate + _img.locaPathStrSub + '/';
};
Base.prototype.isBrowsers = function() {
    if (!this.isPC()) {
        return [
            "last 1 versions",
            "ie >= 8",
            "ie_mob >= 8",
            "ff >= 30",
            "chrome >= 34",
            "safari >= 6",
            "opera >= 12.1",
            "iso >= 6",
            "android >= 4.4",
            "bb >= 10",
            "and_uc 9.9"
        ]
    } else {
        return [
            "last 1 versions",
            "ie >= 8",
            "ie_mob >= 8",
            "ff >= 30",
            "chrome >= 34",
            "safari >= 6",
            "opera >= 12.1",
            "iso >= 6",
            "android >= 4.4",
            "bb >= 10",
            "and_uc 9.9"
        ]
    }
}
var WDO = new Base();

gulp.task('postcss', function() {
    // pc模式
    if (!WDO.isPC) {
        var processors = [
            require('precss')({}),
            sprites({
                stylesheetPath: WDO.DIYPath,
                spritePath: WDO.pathImg,
                basePath: WDO.pathImg + '/icon',
                spritesmith: {
                    padding: 5
                },
                hooks: {
                    onUpdateRule: function(rule, token, image) {
                        var backgroundSizeX = image.spriteWidth;
                        var backgroundSizeY = image.spriteHeight;
                        var backgroundPositionX = image.coords.x;
                        var backgroundPositionY = image.coords.y;
                        backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX;
                        backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY;
                        backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX;
                        backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY;

                        var backgroundImage = postcss.decl({
                            prop: 'background-image',
                            value: 'url(' + image.spriteUrl + ')'
                        });

                        var backgroundSize = postcss.decl({
                            prop: 'background-size',
                            value: backgroundSizeX + 'px ' + backgroundSizeY + 'px'
                        });

                        var backgroundPosition = postcss.decl({
                            prop: 'background-position',
                            value: -backgroundPositionX + 'px ' + -backgroundPositionY + 'px'
                        });

                        var minSpriteWidth = postcss.decl({
                            prop: 'width',
                            value: image.coords.width + 'px'
                        });

                        var minSpriteHeight = postcss.decl({
                            prop: 'height',
                            value: image.coords.height + 'px'
                        });

                        rule.insertAfter(token, backgroundImage);
                        rule.insertAfter(backgroundImage, backgroundPosition);
                        rule.insertAfter(backgroundPosition, backgroundSize);
                        rule.insertAfter(minSpriteWidth, minSpriteWidth);
                        rule.insertAfter(minSpriteHeight, minSpriteHeight);
                    }
                },

                filterBy: function(image) {
                    if (!/\icon/.test(image.url))
                        return Promise.reject();
                    return Promise.resolve();
                }
            }),
            cssMqpacker({
                sort: function(a, b) {
                    return a.localeCompare(b);
                }
            }),
            autoprefixer({
                browsers: [
                    'last 9 versions'
                ]
            }),
            postcssSorting({
                "sort-order": "yandex"
            }),
            postcssShort,
            opacity,
            crip,
            clean,
            messages
        ];
    } else {
        // 移动px模式
        var processors = [
            require('precss')({}),
            sprites({
                stylesheetPath: WDO.DIYPath,
                spritePath: WDO.pathImg,
                basePath: WDO.pathImg + '/icon',
                spritesmith: {
                    padding: 10
                },
                hooks: {
                    onUpdateRule: function(rule, token, image) {
                        var backgroundSizeX = image.spriteWidth;
                        var backgroundSizeY = image.spriteHeight;
                        var backgroundPositionX = (image.coords.x / 2);
                        var backgroundPositionY = (image.coords.y / 2);
                        backgroundSizeX = isNaN(backgroundSizeX) ? 0 : (backgroundSizeX / 2);
                        backgroundSizeY = isNaN(backgroundSizeY) ? 0 : (backgroundSizeY / 2);
                        backgroundPositionX = isNaN(backgroundPositionX) ? 0 : (backgroundPositionX / 2);
                        backgroundPositionY = isNaN(backgroundPositionY) ? 0 : (backgroundPositionY / 2);

                        var backgroundImage = postcss.decl({
                            prop: 'background-image',
                            value: 'url(' + image.spriteUrl + ')'
                        });

                        var backgroundSize = postcss.decl({
                            prop: 'background-size',
                            value: backgroundSizeX + 'px ' + backgroundSizeY + 'px'
                        });

                        var backgroundPosition = postcss.decl({
                            prop: 'background-position',
                            value: -backgroundPositionX + 'px ' + -backgroundPositionY + 'px'
                        });

                        var minSpriteWidth = postcss.decl({
                            prop: 'width',
                            value: image.coords.width + 'px'
                        });

                        var minSpriteHeight = postcss.decl({
                            prop: 'height',
                            value: image.coords.height + 'px'
                        });

                        rule.insertAfter(token, backgroundImage);
                        rule.insertAfter(backgroundImage, backgroundPosition);
                        rule.insertAfter(backgroundPosition, backgroundSize);
                        rule.insertAfter(minSpriteWidth, minSpriteWidth);
                        rule.insertAfter(minSpriteHeight, minSpriteHeight);
                    }
                },

                filterBy: function(image) {
                    if (!/\icon/.test(image.url))
                        return Promise.reject();
                    return Promise.resolve();
                }
            }),
            cssMqpacker({
                sort: function(a, b) {
                    return a.localeCompare(b);
                }
            }),
            autoprefixer({
                browsers: [
                    'last 9 versions'
                ]
            }),
            postcssSorting({
                "sort-order": "yandex"
            }),
            postcssShort,
            crip,
            clean,
            messages
        ];
    }
    return gulp.src([WDO.pathSass + '/**/*.css'])

    .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(gulpPostcss(processors))
        .pipe(gulp.dest(WDO.DIYPath))
        // .pipe(reload({ stream: true }));
});

// 移动rem模式
gulp.task('postcssTorem', function() {
    var processors = [
        require('precss')({}),
        sprites({
            stylesheetPath: WDO.DIYPath,
            spritePath: WDO.pathImg,
            basePath: WDO.pathImg + '/icon',
            spritesmith: {
                padding: 10
            },
            hooks: {
                onUpdateRule: function(rule, token, image) {
                    var backgroundSizeX = (image.spriteWidth / image.coords.width) * 100;
                    var backgroundSizeY = (image.spriteHeight / image.coords.height) * 100;
                    var backgroundPositionX = (image.coords.x / (image.spriteWidth - image.coords.width)) * 100;
                    var backgroundPositionY = (image.coords.y / (image.spriteHeight - image.coords.height)) * 100;

                    backgroundSizeX = isNaN(backgroundSizeX) ? 0 : backgroundSizeX.toFixed(3);
                    backgroundSizeY = isNaN(backgroundSizeY) ? 0 : backgroundSizeY.toFixed(3);
                    backgroundPositionX = isNaN(backgroundPositionX) ? 0 : backgroundPositionX.toFixed(3);
                    backgroundPositionY = isNaN(backgroundPositionY) ? 0 : backgroundPositionY.toFixed(3);

                    var backgroundImage = postcss.decl({
                        prop: 'background-image',
                        value: 'url(' + image.spriteUrl + ')'
                    });

                    var backgroundSize = postcss.decl({
                        prop: 'background-size',
                        value: backgroundSizeX + '% ' + backgroundSizeY + '%'
                    });

                    var backgroundPosition = postcss.decl({
                        prop: 'background-position',
                        value: backgroundPositionX + '% ' + backgroundPositionY + '%'
                    });

                    var minSpriteWidth = postcss.decl({
                        prop: 'width',
                        value: image.coords.width + 'px'
                    });

                    var minSpriteHeight = postcss.decl({
                        prop: 'height',
                        value: image.coords.height + 'px'
                    });

                    rule.insertAfter(token, backgroundImage);
                    rule.insertAfter(backgroundImage, backgroundPosition);
                    rule.insertAfter(backgroundPosition, backgroundSize);
                    rule.insertAfter(minSpriteWidth, minSpriteWidth);
                    rule.insertAfter(minSpriteHeight, minSpriteHeight);
                }
            },

            filterBy: function(image) {
                if (!/\icon/.test(image.url))
                    return Promise.reject();
                return Promise.resolve();
            }
        }),
        cssMqpacker({
            sort: function(a, b) {
                return a.localeCompare(b);
            }
        }),
        autoprefixer({
            browsers: [
                'last 9 versions'
            ]
        }),
        postcssSorting({
            "sort-order": "yandex"
        }),
        postcssShort,
        autorem({
            legacy: false,
            baseFontSize: 100,
            skipMediaQueries: false
        }),
        crip,
        clean,
        messages
    ];
    return gulp.src([WDO.pathSass + '/**/*.css'])
        .pipe(plumber({ errorHandler: notify.onError("错误信息: <%= error.message %>") }))
        .pipe(gulpPostcss(processors))
        .pipe(gulp.dest(WDO.DIYPath))
});

//通过浏览器打开本地 Web服务器代开本项目所需要文件夹
gulp.task('openbrowser', function() {
    opn(WDO.domain);
    opn(WDO.fileLabe + WDO.pathSever + WDO.pus);
    opn(WDO.fileLabe + WDO.pathCss);
    opn(WDO.fileLabe + WDO.pathImg);
});

//通过浏览器打开本地 Web服务器代开本项目所需要文件夹
gulp.task('imgOpen', function() {
    opn(WDO.fileLabe + WDO.pathImg);
});

gulp.task('watch', function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: WDO.pathSever,
            directory: true
        },
        open: 'external'
    });

    gulp.watch([
        WDO.pathSever + WDO.pus + '/**/*.html',
        WDO.pathImg + '/**/*',
    ]).on('change', reload);
    gulp.watch(WDO.pathSass + '/**/*.css', ['postcss']);
});

gulp.task('watchTorem', function() {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: WDO.pathSever,
            directory: true
        },
        open: 'external'
    });

    gulp.watch([
        WDO.pathSever + WDO.pus + '/**/*.html',
        WDO.pathImg + '/**/*',
    ]).on('change', reload);
    gulp.watch(WDO.pathSass + '/**/*.css', ['postcssTorem']);
});

// 防止图片压缩后无法恢复，做了备份
gulp.task('backups', function() {
    gulp.src([WDO.pathImg + '/**/*.*'])
        .pipe(gulp.dest(WDO.pathImg + '/_imgbackups'));
});

//压缩图片 - tinypng
gulp.task('imgmin', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: true,
            quality: "high",
            method: "smallfry",
            min: 70,
            loops: 2,
            progressive: false,
            subsample: "default"
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4
        });
    gulp.src([WDO.pathImg + '/**/*.*', '!' + WDO.pathImg + '/_imgbackups/**/*.*'])
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(WDO.pathImg));
});

// //多余文件删除
gulp.task('clear', function() {
    return gulp.src(WDO.pathImg + '/_imgbackups')
        .pipe(cleanf({ force: true }))
        .pipe(gulp.dest('./'));
});


//默认任务
gulp.task('default', ['postcss', 'watch']);
gulp.task('rem', ['postcssTorem', 'watchTorem']);

// 原始图片备份
gulp.task('bak', ['backups'], function() {
    console.log('您的原始图片已经备份至，当前文件夹‘_imgbackups’目录下！！')
});

// 图片压缩
gulp.task('min', ['imgmin', 'imgOpen'], function() {
    console.log('您的原始图片已经备份至，当前文件夹‘_imgbackups’目录下！！')
    return gulp.src([WDO.pathImg + '/*.*']).pipe(size({ title: '图片压缩和Gzip压缩之后的大小为：', gzip: true }));
});

// 确定无误之后可以删除备份文件
gulp.task('clean', ['clear'], function() {
    console.log('您已删除原始图片！！路径为：' + WDO.pathImg + '/_imgbackups')
});
