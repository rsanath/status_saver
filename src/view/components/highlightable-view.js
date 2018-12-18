import React, { Component } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HighlightableView extends Component {

    render() {
        return (
            <View {...this.props} >
                {this.props.children}
                {
                    this.props.highlight ?
                        (
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    ...this.props.highlightStyle
                                }} >

                                <Icon name={'check'} color={'white'} size={50} />

                            </View>
                        ) : null
                }
            </View>
        );
    }
}
