import React, { Component } from 'react';
import { View, Text } from 'react-native';

import AppComponent from '../app-component';
import { checkStoragePermission } from '../../helpers/permissions-helper';


export default class PermissionComponent extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    styles = StyleSheet.create({
        container: {
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center'
        },
        permissionMsg: {
            margin: 10
        }
    })

    async componentDidMount() {
        const permissionStatus = await checkStoragePermission()
        this.setState({ permissionStatus })
    }

    getButtonLabel() {

    }

    getMessageForStatus() {
        const messages = {}
        messages[PermissionsAndroid.RESULTS.GRANTED] = this.t('components.permissionBox.grantedMessage')
        messages[PermissionsAndroid.RESULTS.DENIED] = this.t('components.permissionBox.deniedMessage')
        messages[PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN] = this.t('components.permissionBox.deniedMessage')
        return messages[this.state.permissionStatus];
    }

    render() {
        return (
            <View style={this.styles.container} >
                <Text style={this.styles.permissionMsg} >{this.getMessageForStatus()}</Text>               
            </View>
        );
    }
}