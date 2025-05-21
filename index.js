/**
 * @format
 */

import { AppRegistry, useColorScheme } from 'react-native';
import App from './App';
import React, { useState } from 'react';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';
import { DarkTheme, LightTheme } from './src/utilities/Appcolor';
import { Provider as ReduxProvider } from 'react-redux'; // Import Redux provider
import store from './src/Redux/store'; // Import the store

export default function Main() {
  const scheme = useColorScheme();
  return (
    // Wrap the app with Redux Provider and pass the store
    <ReduxProvider store={store}>
      <PaperProvider theme={scheme === 'dark' ? DarkTheme : LightTheme}>
        <App />
      </PaperProvider>
    </ReduxProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
