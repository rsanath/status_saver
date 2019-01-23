import React from 'react';
import {createStackNavigator, createAppContainer, createBottomTabNavigator} from "react-navigation";
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

export default createAppContainer(WhatsAppNavigator);