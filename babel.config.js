// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Use the default Expo preset globally
    overrides: [
      {
        test: "./app/**/*.{js,jsx,ts,tsx}", // Adjust this path to your project's source code
        plugins: [["nativewind/babel", { jsxImportSource: "nativewind" }]],
      },
    ],
  };
};
