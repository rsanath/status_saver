import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class IconButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}>
                <Icon name={this.props.name}
                      color={this.props.color}
                      size={this.props.size}
                      style={this.props.style}/>
            </TouchableOpacity>
        );
    }
}
