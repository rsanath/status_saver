import React, { Component } from 'react';
import { View, StatusBar, Modal } from 'react-native';
import { AdMobBanner } from 'react-native-admob';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';

import AppNavigator from './src/view/screens/navigator';
import TitleBar from './src/view/widgets/titlebar';
import SwitchView from './src/view/widgets/switch-view';
import HowToUseScreen from './src/view/screens/howtouse-screen';

import IconButton from './src/view/widgets/icon-button';
import AppComponent from './src/view/app-component';

import theme from './src/view/theme/theme';
import config from './config';
import * as ads from './src/helpers/admob-helper';
import C from './src/constants';
import store from './src/redux/store';
import { StatusActions } from './src/redux/actions/status-actions';
import { isLandscape } from './src/helpers/display-helper';


let _titleBar;

export default class App extends AppComponent {
  static titleBar = () => _titleBar

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      showAds: false,
      isModalVisible: false
    }
  }

  changeStatusSource = path => {
    store.dispatch(StatusActions.changeStatusPath(path))
  }

  getModalCompoenent = () => {
    if (this.state.modalComponent == 'howtouse') {
      return <HowToUseScreen />
    }
  }

  async componentDidMount() {
    const showAds = await ads.shouldShowAd()
    this.setState({ showAds })
    _titleBar = this.refs.titlebar
  }

  render() {
    console.log(this.state.orientation)

    return (
      <MenuProvider>
        <Provider store={store}>

          <View style={{ flex: 1 }} >

            <Modal
              animationType={'slide'}
              transparent={true}
              onRequestClose={() => this.setState({ isModalVisible: false })}
              visible={this.state.isModalVisible}>

              <View style={styles.modal} >
                <View style={styles.modalContainer} >
                  <IconButton
                    onPress={() => this.setState({ isModalVisible: false })}
                    color={'black'}
                    size={25}
                    style={{ alignSelf: 'flex-end', }}
                    name={'close'} />
                  {this.getModalCompoenent()}
                </View>
              </View>

            </Modal>

            <StatusBar
              backgroundColor={theme.colors.primaryDark}
              barStyle="light-content" />

            <TitleBar
              ref={'titlebar'}
              title={C.appName}
              backgroundColor={theme.colors.primary}
              foregroundColor={'white'}
              menu={[
                { name: 'WhatsApp Statuses', onSelect: () => this.changeStatusSource(C.WhatappStatusPath) },
                { name: 'GBWhatsApp Statuses', onSelect: () => this.changeStatusSource(C.GBWhatsAppStatusPath) },
                { name: 'WhatsApp Business Statuses', onSelect: () => this.changeStatusSource(C.WhatsAppBusinessStatusPath) },
              ]}
              actions={[
                { icon: 'help-circle-outline', onPress: () => this.setState({ isModalVisible: true, modalComponent: 'howtouse' }) }
              ]}
            />

            <AppNavigator />

            <SwitchView
              visible={this.state.showAds && this.state.orientation != 'landscape'} >
              <AdMobBanner
                adSize="fullBanner"
                adUnitID={config.admob.adUnitId}
                testDeviceID={config.admob.testDeviceId}
              />
            </SwitchView>

          </View>

        </Provider>
      </MenuProvider>
    );
  }
}

const styles = {
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    alignSelf: 'center',
    marginVertical: 30,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 15
  }
} 