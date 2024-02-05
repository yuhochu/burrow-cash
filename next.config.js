/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  webpack(config, { isServer, webpack, buildId }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.CONFIG_BUILD_ID": JSON.stringify(buildId),
      }),
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      // exclude: /node_modules/,
    });

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/markets",
  //       permanent: true,
  //     },
  //   ];
  // },
};
