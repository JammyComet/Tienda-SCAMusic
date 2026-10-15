const babelRule = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: "babel-loader",
};

module.exports = {
  mode: "development",

  module: {
    rules: [babelRule],
  },

  resolve: {
    extensions: [".js", ".jsx"],
    fullySpecified: false,
  },
};
