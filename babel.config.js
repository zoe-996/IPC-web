module.exports = {
  exclude: /node_modules/,
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
          "ie": "11",
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5",
      }
    ]
  ],
  plugins: [
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", style: true }],
    ["@babel/plugin-transform-runtime", { 
      "corejs": 3,
      "helpers": true ,
      "regenerator": true,
    }]
  ]
}
