import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from "react-navigation";

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ImagesScreen from "../screens/whatsapp-tab/status-screen/images-screen";
import VideosScreen from "../screens/whatsapp-tab/status-screen/videos-screen";

import theme from '../theme/theme'


const StatusNavigator = createMaterialTopTabNavigator({
    Photos: {
        screen: ImagesScreen,
        navigationOptions: {
            title: 'Photos',
            tabBarIcon: <Icon size={25} color={theme.colors.accent} name={'camera'} />
        }
    },
    Videos: {
        screen: VideosScreen,
        navigationOptions: {
            title: 'Videos',
            tabBarIcon: <Icon size={27} color={theme.colors.accent} name={'video'} />
        }
    }
}, {
        tabBarOptions: {
            style: {
                backgroundColor: theme.colors.primary
            },
            tabStyle: {
                flexDirection: 'row'
            },
            labelStyle: {
                fontWeight: 'bold',
                fontSize: 14,
            },
            indicatorStyle: {
                backgroundColor: theme.colors.accent
            },
            showIcon: true,
            pressOpacity: 0.5
        }
    });

export default createAppContainer(StatusNavigator);