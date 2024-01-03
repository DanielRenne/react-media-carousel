const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry point of your component
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'index.js', // Output file name
    library: 'YourReactComponent', // Global variable name for consuming in browser
    libraryTarget: 'umd', // Universal Module Definition
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader', // Use Babel to transpile JavaScript/React code
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // File extensions to resolve
  },
  externals: {
    react: 'react', // Exclude React from the bundle if it's a peer dependency
    'react-dom': 'react-dom', // Exclude React DOM from the bundle if it's a peer dependency
  },
};
