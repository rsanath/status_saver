import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, PermissionsAndroid, AppState} from 'react-native';

import {t} from '../../i18n/i18n';
import theme from '../theme/theme';
import PermissionHelper from "../../helpers/permissions-helper";
import SettingsModule from "../../native-modules/settings-module";
import Card from "./widgets/card";
import OutlineButton from "./widgets/outline-button";

export default class PermissionRequestComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionStatus: null,
            settingsOpened: false
        }
    }

    componentDidMount() {
        // if the user opens settings and grants the permission when coming back to the app
        // invoke the callback
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = async (nextState) => {
        const granted = await PermissionHelper.Storage.isStoragePermissionGranted();
        this.props.onPermissionResult && this.props.onPermissionResult(granted);
    }

    requestPermission = async (a) => {
        const result = await PermissionHelper.Storage.requestStoragePermission();
        this.setState({permissionStatus: result});
        this.props.onPermissionResult && this.props.onPermissionResult(result == PermissionsAndroid.RESULTS.GRANTED);
    }

    onPressRequestButton = () => {
        if (this.state.permissionStatus == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            SettingsModule.openAppSettings();
        } else {
            this.requestPermission()
        }
    };

    getButtonText = () => {
        if (this.state.permissionStatus == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            return "OPEN SETTINGS";
        }
        return "GRANT PERMISSION";
    };

    render() {
        return (
            <Card
                image={require('../../assets/images/castle.png')}
                content={t('permissionsDescription')}
                footer={(
                    <OutlineButton
                        title={this.getButtonText()}
                        color={theme.colors.primary}
                        onPress={this.onPressRequestButton}
                    />
                )}
            />
        );
    }
}

const styles = {
    container: {
        padding: 10,
        margin: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    info: {
        margin: 5,
        fontSize: 16,
        textAlign: 'center'
    },
    button: {
        fontWeight: 'bold',
        color: theme.colors.primary,
        borderRadius: 5,
        borderWidth: 1,
        margin: 10,
        padding: 10,
        textAlign: 'center',
        borderColor: theme.colors.primary,
    }
}