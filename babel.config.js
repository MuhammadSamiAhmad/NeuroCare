module.exports = (api) => {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@": "./",
            "@app": "./app",
            "@components": "./app/components",
            "@screens": "./app/screens",
            "@hooks": "./app/hooks",
            "@stores": "./app/stores",
            "@theme": "./app/theme",
            "@types": "./app/types",
            "@assets": "./assets",
          },
        },
      ],
      "expo-router/babel",
    ],
  }
}
