import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { t } from '../../i18n/i18n';
import theme from '../theme/theme';
import { requestStoragePermission } from '../../helpers/permissions-helper';

export default class PermissionRequiredComponent extends Component {
    constructor(props) {
        super(props);
    }

    onRequestPermission = async () => {
        const result = await requestStoragePermission()
        this.props.onPermissionResult && this.props.onPermissionResult(result)
    }

    render() {
        return (
            <View
                style={[styles.container, this.props.style]}
                {...this.props}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('../../assets/images/castle.png')} />
                <Text style={styles.info} >{t('perissionDescription')}</Text>

                <TouchableOpacity onPress={this.onRequestPermission} >
                    <Text style={styles.button} >GRANT PERMISSION</Text>
                </TouchableOpacity>

            </View>
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