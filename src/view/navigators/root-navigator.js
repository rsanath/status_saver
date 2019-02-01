import React from 'react';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation";
import WhatsappStatusScreen from '../screens/whatsapp/whatsapp-status-screen';
import StatusViewerScreen from '../screens/whatsapp/status-viewer-screen';
import HelpScreen from "../screens/help/help";


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

const AppNavigator = createStackNavigator({
    WhatsApp: WhatsAppNavigator,
    Help: HelpScreen
}, {
    headerMode: 'none'
});

export default createAppContainer(AppNavigator);