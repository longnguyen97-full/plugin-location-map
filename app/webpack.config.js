const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index.js",
    admin: "./src/admin/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|build)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sass|css|scss)$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: {
          loader: "url-loader?limit=100000",
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // Output CSS filename
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html", // HTML template file
      filename: "index.html", // Output HTML filename
    }),
  ],
  devServer: {
    contentBase: "./dist", // Serve files from the 'dist' directory
    hot: true,
    historyApiFallback: true,
  },
};
