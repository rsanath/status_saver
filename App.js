import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { AdMobBanner } from 'react-native-admob';

import AppNavigator from './src/view/screens/navigator';

import theme from './src/view/theme/theme';
import config from './config';
import * as ads from './src/helpers/admob-helper';
import SwitchView from './src/view/widgets/switch-view';
import { db } from './src/firebase';


export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      showAds: false
    }
  }

  async componentDidMount() {
    const showAds = await ads.shouldShowAd()
    this.setState({ showAds })
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StatusBar
          backgroundColor={theme.colors.primaryDark}
          barStyle="light-content" />
        <AppNavigator />
        <SwitchView visible={this.state.showAds} >
          <AdMobBanner
            adSize="fullBanner"
            adUnitID={config.admob.adUnitId}
            testDeviceID={config.admob.testDeviceId}
          />
        </SwitchView>
      </View>
    );
  }
}

