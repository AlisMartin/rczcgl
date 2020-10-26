const UglifyJS = require('uglify-js');
const cssmin = require('cssmin');
const path = require('path')
const fs = require('fs')

const basePath = __dirname,
    distPath = path.join(basePath, "/dist"),
    modulesPath = path.join(basePath, '/node_modules');

//要排除的路径
const excludePaths = [
    distPath,
    modulesPath
]

//要排除的文件
const excludeFiles = [
    path.join(basePath, "/mini.js"),
    path.join(basePath, "/package.json"),
    path.join(basePath, "/package-lock.json"),
    ".map"
]

/**
 * 判断当前文件路径是否需要排除
 * @param {string} filename 文件路径
 */
function isExclude(filename) {
    for (const path of excludePaths) {
        if (filename.startsWith(path)) {
            return true;
        }
    }

    for (const filepath of excludeFiles) {
        if (filename.endsWith(filepath)) {
            return true;
        }
    }

    return false;
}

//只拷贝不压缩的文件列表
const onlyCopy = [
    ".min.js",
    ".min.css"
]

function isOnlyCopy(filename) {
    for (const path of onlyCopy) {
        if (filename.endsWith(path)) {
            return true;
        }
    }
}

/**
 * 遍历指定目录
 * @param {string} dir 要遍历的根目录
 * @param {function} callback 遍历到每个文件的回调
 * @param {function} finish 所有文件遍历完后的回调 
 */
function mapDir(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        if (err) {
            console.error(err)
            return
        }
        files.forEach((filename, index) => {
            let pathname = path.join(dir, filename)
            fs.stat(pathname, (err, stats) => { // 读取文件信息
                if (err) {
                    console.log('获取文件stats失败')
                    return
                }
                if (stats.isDirectory()) {
                    mapDir(pathname, callback, finish)
                } else if (stats.isFile()) {
                    fs.readFile(pathname, (err, data) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        callback && callback(data, pathname)
                    })
                }
            })
            if (index === files.length - 1) {
                finish && finish()
            }
        })
    })
}


/**
 * 异步复制文件
 * @param {string} src 源文件路径
 * @param {string} dist 源文件路径
 */
function copyFile(src, dist) {
    fs.readFile(src, (err, data) => {
        fs.writeFile(dist, data, err => {
            if (err) {
                console.log(`异步复制出现错误 ${err.toString()}`)
            } else {
                // console.log('异步赋值完成!')
            }
        })
    })
}

/**
 * 同步读取文件
 * @param {string} src 源文件路径
 * @param {string} dist 源文件路径
 */
function copySync(src, dist) {
    try {
        var data = fs.readFileSync(src);
        fs.writeFileSync(dist, data);

        // var readStream = fs.createReadStream(src);
        // var writeStream = fs.createWriteStream(dist);
        // readStream.pipe(writeStream);

        // console.log('同步拷贝完成:' + dist)
    } catch (err) {
        console.log(`同步复制出现错误 ${err.toString()}`);
    }
}

/**
 * 判断目标路径是否存在，若不存在则创建
 * @param {string} dst 目标路径
 * @param {function} callback 创建成功后的回调，参数为传递的dst目标路径
 */
var exists = function (dst, callback) {
    fs.stat(dst, (err, stats) => {
        if (err) {
            //recursive：是否递归创建文件夹
            fs.mkdir(dst, { recursive: true }, function () {
                callback(dst);
            });
        } else if (stats.isDirectory()) {
            callback(dst);
        } else if (stats.isFile()) {
            callback(dst);
        }
    })
};

//不需要顶级压缩的文件列表
const noTopLevel = [
    'js\\common\\common.js',
    'js\\login\\login.js'
]

/**
 * 是否不进行顶级压缩
 * @param {string} filename 文件路径
 */
function isNoTopLevel(filename) {
    for (const path of noTopLevel) {
        console.log(filename, path, filename.endsWith(path))
        if (filename.endsWith(path)) {
            console.log(filename);
            return true;
        }
    }

    return false;
}

exists(distPath, (dst) => {
    mapDir(
        basePath,
        function (file, pathname) {
            if (isExclude(pathname)) return;

            let ext = path.extname(pathname),
                fileSubPath = pathname.replace(basePath, ""),
                distFile = distPath + fileSubPath,
                distDir = path.dirname(distFile);


            let jsOpitions = {},
                jsTopLevelOptions = {
                    mangle: {
                        toplevel: true,
                    }
                };

            exists(distDir, () => {
                if (".js" === ext && !isOnlyCopy(pathname)) {
                    try {
                        fs.writeFileSync(distFile,
                            UglifyJS.minify(file.toString(),
                                isNoTopLevel(pathname) ? jsOpitions : jsTopLevelOptions).code.toString(), "utf8");
                    } catch (error) {
                        console.log(`压缩JS文件：${pathname}出错：${error.toString()}`);
                    }
                } else if (".css" === ext && !isOnlyCopy(pathname)) {
                    try {
                        fs.writeFileSync(distFile, cssmin(file.toString()), "utf8");
                    } catch (error) {
                        console.log(`压缩CSS文件：${pathname}出错：${error.toString()}`);
                    }
                } else {
                    copySync(pathname, distFile);
                }
            });


        },
        function () {
            // console.log('压缩完成')
        }
    )
});