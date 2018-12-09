import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class IconButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress} >
                <Icon {...this.props} />
            </TouchableOpacity>
        );
    }
}
