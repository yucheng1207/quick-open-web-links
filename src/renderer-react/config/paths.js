const path = require("path")
const { paths } = require("../../../scripts/common/paths")
const env = process.env.NODE_ENV || "development"

const resolveApp = (p) => path.resolve(__dirname, "..", p)

module.exports = {
	env,
	port: paths.rendererPort,
	resolveApp,
	entryPath: () => resolveApp("src/boot-client.tsx"),
	buildPath: () => paths.rendererOutput, // () => resolveApp('build'),
	htmlPath: () => resolveApp("public/index.html"),
	imagesPath: () => resolveApp("src/images"),
	publicPath: () => resolveApp("public"),
	envPath: () => resolveApp(`env/${env}.env`),
}
