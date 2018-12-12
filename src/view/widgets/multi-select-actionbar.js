import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class MultiSelectActionBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { props } = this
        const itemColor = props.itemColor || 'white'
        const iconSize = props.iconSize || 30
        const defaultStyle = {
            marginVertical: 3,
            marginHorizontal: 5
        }

        return (
            <View
                {...this.props}
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 54,
                    backgroundColor: 'powderBlue',
                    alignItems: 'center',
                    paddingVertical: 5,
                    paddingHorizontal: 6,
                    ...this.props.style
                }} >

                <TouchableOpacity onPress={this.props.onCancel} >
                    <Icon
                        style={defaultStyle}
                        name={'close'}
                        color={itemColor}
                        size={iconSize} />
                </TouchableOpacity>

                <Text
                    style={{
                        ...defaultStyle,
                        fontSize: 18,
                        marginHorizontal: 6,
                        fontWeight: 'bold',
                        color: itemColor
                    }} >
                    {this.props.count}
                </Text>

                <View style={{ flex: 1 }} />

                <TouchableOpacity onPress={this.props.onSave} >
                    <Icon
                        style={defaultStyle}
                        name={'content-save'}
                        color={itemColor}
                        size={iconSize} />
                </TouchableOpacity>

                <TouchableOpacity onPress={this.props.onShare} >
                    <Icon
                        style={defaultStyle}
                        name={'share-variant'}
                        color={itemColor}
                        size={iconSize} />
                </TouchableOpacity>
            </View>
        );
    }
}
