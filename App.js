import React, {Component} from 'react';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider as StoreProvider} from 'react-redux';

import AppNavigator from './src/view/navigators/root-navigator';

import store from './src/redux/store';
import TestScreen from './src/view/screens/test-screens';
import PermissionHelper from "./src/helpers/permissions-helper";
import PermissionRequestComponent from "./src/view/components/permission-request-component";


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            permissionsGranted: null
        }
    }

    async componentDidMount() {
        const granted = await PermissionHelper.Storage.isStoragePermissionGranted();
        this.setState({permissionsGranted: granted})
    }

    renderPermissionRequestComponent = () => {
        return (
            <PermissionRequestComponent
                onPermissionResult={(result) => {
                    this.setState({permissionsGranted: result.granted})
                }}
            />
        )
    };

    renderApp = () => {
        return (
            <MenuProvider>
                <StoreProvider store={store}>
                    <AppNavigator/>
                </StoreProvider>
            </MenuProvider>
        );
    };

    render() {
        {
            if (this.state.permissionsGranted == false) {
                return this.renderPermissionRequestComponent();
            } else if (this.state.permissionsGranted == true) {
                return this.renderApp();
            } else {
                return null;
            }
        }
    }
}