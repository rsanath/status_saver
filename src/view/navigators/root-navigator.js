import React from 'react';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import theme from '../theme/theme';
import WhatsappStatusScreen from '../screens/whatsapp/whatsapp-status-screen';
import StatusViewerScreen from '../screens/whatsapp/status-viewer-screen';


const WhatsAppNavigator = createStackNavigator({
    WhatsappStatus: {
        screen: WhatsappStatusScreen
    },
    StatusViewer: {
        screen: StatusViewerScreen
    }
}, {
    headerMode: 'none'
});

const AppNavigator = createBottomTabNavigator({
    whatsapp: WhatsAppNavigator
}, {
    tabBarComponent: null
});

export default createAppContainer(WhatsAppNavigator);