const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const webpack = require("webpack");

module.exports = function override(config, env) {
  // Update module rules
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    },
    {
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // Allow imports without extensions
      },
    },
  ];

  // Remove ModuleScopePlugin to allow importing from outside the src directory
  config.resolve.plugins = config.resolve.plugins.filter(
    (plugin) => !(plugin instanceof ModuleScopePlugin)
  );

  // Add fallback for Node.js core modules
  config.resolve.fallback = {
    fs: false,
    os: false,
    tls: false,
    net: false,
    buffer: require.resolve("buffer/"),
    path: require.resolve("path-browserify"),
    process: require.resolve("process/browser"),
  };

  // Add plugins to provide Buffer and process globally
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    })
  );

  return config;
};
