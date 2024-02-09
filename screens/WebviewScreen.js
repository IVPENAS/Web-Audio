import React from 'react';
import { WebView } from 'react-native-webview';

const WebviewScreen = () => {
  return <WebView source={require('../assets/index.html')} />;
};

export default WebviewScreen;
