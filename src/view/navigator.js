import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from "react-navigation";
import ImagesScreen from "./images-screen";
import VideosScreen from "./videos-screen";
import theme from '../view/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusVideoPlayer from './status-video-player';

const StatuScreen = createMaterialTopTabNavigator({
    Photos: {
        screen: ImagesScreen,
        navigationOptions: {
            title: 'Photos',
            tabBarIcon: <Icon size={22} color={theme.colors.accent} name={'camera-alt'} />
        }
    },
    Videos: {
        screen: VideosScreen,
        navigationOptions: {
            title: 'Videos',
            tabBarIcon: <Icon size={23} color={theme.colors.accent} name={'videocam'} />
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

export default createAppContainer(StatuScreen);