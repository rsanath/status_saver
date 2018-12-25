import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import theme from '../theme/theme'
import whatsappStatusScreen from '../screens/whatsapp/whatsapp-status-screen';


const AppNavigator = createBottomTabNavigator({
    whatsapp: whatsappStatusScreen
});

export default createAppContainer(AppNavigator);