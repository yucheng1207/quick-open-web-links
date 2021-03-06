const gulp = require('gulp');
const { existsSync, mkdirSync } = require('fs');
const { execSync } = require('../common/utils');
const { paths } = require('../common/paths.js');

/**
 * 拷贝渲染进程打包后的文件到`paths.rendererDist`
 */
async function copyToDist() {
    if (paths.rendererOutput !== paths.rendererDist) {
        console.log('正在拷贝渲染进程文件...');
        if (!existsSync(paths.dist)) {
            mkdirSync(paths.dist); // 确保dist文件夹存在
        }
        execSync(`cp -rf ${paths.rendererOutput} ${paths.rendererDist}`);
        console.log('拷贝渲染进程文件成功');
    }
}

/**
 * 清理打包文件
 */
async function cleanRenderer() {
    if (!existsSync(paths.dist)) {
        mkdirSync(paths.dist);
    }
    execSync(`rm -rf ${paths.rendererDist}`);
}

/**
 * 编译渲染进程代码
 */
async function buildRenderer() {
    const env = process.env.NODE_ENV;
    console.log(`正在编译【${env}环境】渲染进程文件...`);
    execSync(`cd ${paths.rendererSrc} && yarn build:${env}`);
    console.log('编译渲染进程文件成功');
    // console.log('正在编译渲染进程文件...');
    // return gulp
    //     .src(paths.mainEntry)
    //     .pipe(webpack(webpackConfig))
    //     .pipe(gulp.dest(paths.rendererDist))
    //     .on('end', function () {
    //         console.log('编译渲染进程文件成功');
    //     });
}

async function copyRendererPkgJson() {
    execSync(`cp -rf ${paths.rendererPkgJson} ${paths.rendererOutput}`);
}

const build = gulp.series(
    cleanRenderer,
    buildRenderer,
    copyRendererPkgJson,
    copyToDist
);

module.exports = {
    build,
};
