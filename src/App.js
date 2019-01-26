import React, {Component} from 'react';
import {View} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider as StoreProvider} from 'react-redux';

import AppNavigator from './view/navigators/root-navigator';

import store from './redux/store';
import PermissionHelper from "./helpers/permissions-helper";
import PermissionRequestComponent from "./view/components/permission-request-component";


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
            <View style={styles.permissionComponent} >
                <PermissionRequestComponent
                    onPermissionResult={(granted) => {
                        this.setState({permissionsGranted: granted})
                    }}
                />
            </View>
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

const styles = {
    permissionComponent: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
}