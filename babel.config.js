// babel.config.js

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Place this at the end of the plugins array
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'], // Add additional plugins for production
    },
  },
};
