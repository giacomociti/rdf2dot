// Note this only includes basic configuration for development mode.
// For a more comprehensive configuration check:
// https://github.com/fable-compiler/webpack-config-template

var path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/App.fs.js",
    output: {
        path: path.join(__dirname, "./docs"),
        filename: "bundle.js",
        library: "App"
    },
    devServer: {
        publicPath: "/",
        contentBase: "./docs",
        port: 8080,
    },
    module: {
    }
}
