import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SceneMap, TabView, TabBar} from "react-native-tab-view";

import {t} from '../../../i18n/i18n';

import AppComponent from "../../app-component";
import WhatsAppImageStatusScreen from './whatsapp-image-status-screen';
import WhatsAppVideoStatusScreen from './whatsapp-video-status-screen';


class WhatsAppTabNavigator extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            navigationState: {
                index: 0,
                routes: [
                    { key: 'photos', title: t('screens.whatsApp.photoStatusTitle') },
                    { key: 'videos', title: t('screens.whatsApp.videoStatusTitle') },
                ],
            }
        };
    }

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={SceneMap({
                    photos: WhatsAppImageStatusScreen,
                    videos: WhatsAppVideoStatusScreen
                })}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: this.state.screenWidth }}
            />
        )
    }
}

const styles = StyleSheet.create({

});