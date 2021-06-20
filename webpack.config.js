const path = require("path");
const fs = require("fs");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = (relativePath) =>
  path.resolve(appDirectory, relativePath);

let configMain = {
  entry: "./src/client.js",
  output: {
    filename: "bundle.js",
    path: resolveAppPath("public"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    // Re-generate index.html with injected script tag.
    // The injected script tag contains a src value of the
    // filename output defined above.
    new HtmlWebPackPlugin({
      inject: true,
      template: resolveAppPath("public/index.html"),
      minify: false
    }),
  ],
  devServer: {
    // Serve index.html as the base
    contentBase: resolveAppPath("public"),
    proxy: [
      {
        context: ["/auth", "/api"],
        target: "http://localhost:3000",
      },
    ],
    historyApiFallback: true, // router will not work without this?
  },
  mode: "development",
};
//run this for production , note must set NODE_ENV to production in powershell where webpack is running PRIOR to running webpack
//$env:NODE_ENV="production"
if (process.env.NODE_ENV === "production") {
  configMain.plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
  configMain.watch = false;
}

module.exports = configMain;
