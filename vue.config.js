module.exports = {
    css: {
      loaderOptions: {
        less: {
          lessOptions: {
            modifyVars: {
              'primary-color': '#bb131a',
              'link-color': '#000000',
              'text-color': '#000000',
              'border-radius-base': '2px',
              'font-size-base':'0.14rem'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    productionSourceMap: false
  };