const path = require('path')

module.exports = {
  style: {
    postcss: {
      loaderOptions: {
        postcssOptions: {
          plugins: [
            require('tailwindcss')(
              path.resolve(__dirname, 'tailwind.config.js')
            ),
            require('autoprefixer')
          ]
        }
      }
    }
  },
  babel: {
    plugins: [
      [
        '@babel/plugin-transform-typescript',
        { loose: true, allowDeclareFields: true }
      ],
      [
        '@babel/plugin-proposal-private-property-in-object',
        { loose: true, allowDeclareFields: true }
      ]
    ]
  }
}
