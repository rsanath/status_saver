import React, { Component } from 'react';
import { View } from 'react-native';

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
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    borderWidth: 2,
                                    borderColor: this.props.highlightColor || '#00887a',
                                    ...this.props.highlightStyle
                                }} />
                        ) : null
                }
            </View>
        );
    }
}
