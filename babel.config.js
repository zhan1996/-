const productPlugins = []
if(process.env.NODE_ENV === 'producttion'){
    productPlugins.push("transform-remove-console")
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    ...productPlugins
  ]
}
