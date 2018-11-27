import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import AppNavigator from './src/view/screens/navigator';
import theme from './src/view/theme/theme';


export default class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StatusBar
          backgroundColor={theme.colors.primaryDark}
          barStyle="light-content" />
        <AppNavigator />
      </View>
    );
  }
}