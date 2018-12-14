import React from 'react';
import { View, StatusBar, Modal, BackHandler, PermissionsAndroid } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob';
import { MenuProvider } from 'react-native-popup-menu';
import { Provider } from 'react-redux';

import AppNavigator from './src/view/screens/navigator';
import TitleBar from './src/view/widgets/titlebar';
import SwitchView from './src/view/widgets/switch-view';
import HowToUseScreen from './src/view/screens/howtouse-screen';
import PermissionRequiredMsg from './src/view/widgets/permission-required-component';
import IconButton from './src/view/widgets/icon-button';
import AppComponent from './src/view/app-component';

import theme from './src/view/theme/theme';
import config from './config';
import * as ads from './src/helpers/admob-helper';
import C from './src/constants';
import store from './src/redux/store';
import { StatusActions } from './src/redux/actions/status-actions';
import { t } from './src/i18n/i18n';
import { notifyError } from './src/helpers/bugsnag-helper';
import { requestStoragePermission, checkStoragePermission } from './src/helpers/permissions-helper';


let _titleBar;

export default class App extends AppComponent {
  static titleBar = () => _titleBar

  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      adConfig: ads.DeafultAdConfig,
      isModalVisible: false,
      permissionGranted: null
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
    this.setState({ permissionGranted: await checkStoragePermission()})

    const adConfig = await ads.getAdConfig()
    this.setState({ adConfig })

    // globalize a ref to title bar to make it accessable in status screens
    // very bad! show find alternative way to achieve this
    _titleBar = this.refs.titlebar

    
    AdMobInterstitial.setAdUnitID(adConfig.appCloseAd.adUnitId);
    AdMobInterstitial.setTestDeviceID(config.admob.testDeviceId);
    this.preLoadAd(adConfig)
    
    BackHandler.addEventListener('hardwareBackPress', this.showAd);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.showAd);
  }

  componentDidCatch(error, info) {
    console.warn(error)
    notifyError(error, info)
  }

  preLoadAd = (adConfig) => {
    if (adConfig.showAds && adConfig.appCloseAd.showAd) {
      AdMobInterstitial.requestAd();
    }
  }

  showAd = () => {
    const { adConfig } = this.state
    const showAd = adConfig.showAds && adConfig.appCloseAd.showAd

    AdMobInterstitial.isReady(ready => {
      if (ready && showAd) AdMobInterstitial.showAd();
    })

    return false
  }

  shouldShowBottomBannerAd = () => {
    const { adConfig } = this.state

    return (
      adConfig.showAds &&
      adConfig.bottomBannerAd.showAd &&
      this.state.orientation != 'landscape' &&
      this.state.permissionGranted
    )
  }

  render() {
    const { adConfig } = this.state

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
                { name: t('lables.whatsappStatus'), onSelect: () => this.changeStatusSource(C.WhatappStatusPath) },
                { name: t('lables.gbWhatsappStatus'), onSelect: () => this.changeStatusSource(C.GBWhatsAppStatusPath) },
                { name: t('lables.whatsappBusinessStatus'), onSelect: () => this.changeStatusSource(C.WhatsAppBusinessStatusPath) },
              ]}
              actions={[
                { icon: 'help-circle-outline', onPress: () => this.setState({ isModalVisible: true, modalComponent: 'howtouse' }) }
              ]}
            />

            <SwitchView visible={this.state.permissionGranted} >
              <AppNavigator />
            </SwitchView>

            <SwitchView visible={this.state.permissionGranted == false} >
              <View style={{ position: 'absolute', bottom: this.state.screenWidth / 2 }} >
                <PermissionRequiredMsg
                  onPermissionResult={result => this.setState({ permissionGranted: result })} />
              </View>
            </SwitchView>

            <SwitchView
              visible={this.shouldShowBottomBannerAd()} >
              <View style={{ position: 'absolute', bottom: 0 }} >
                <AdMobBanner
                  adSize="fullBanner"
                  adUnitID={adConfig.bottomBannerAd.adUnitId}
                  testDeviceID={config.admob.testDeviceId}
                />
              </View>
            </SwitchView>

          </View>

        </Provider>
      </MenuProvider >
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