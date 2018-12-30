import React, {Component} from 'react';
import {View} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider as StoreProvider} from 'react-redux';

import AppNavigator from './src/view/navigators/root-navigator';

import store from './src/redux/store';
import {notifyError} from './src/helpers/bugsnag-helper';
import TestScreen from './src/view/screens/test-screens';


export default class App extends Component {

    componentDidCatch(error, info) {
        console.warn(error);
        notifyError(error, info);
    }

    render() {
        return (
            <TestScreen />
        );
    }
}

/*

<MenuProvider>
    <StoreProvider store={store}>
        <AppNavigator/>
    </StoreProvider>
</MenuProvider>


*/