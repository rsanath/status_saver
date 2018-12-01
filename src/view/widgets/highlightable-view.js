import React, { Component } from 'react';
import { View } from 'react-native';

export default class HighlightableView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    highlight = () =>  {
        this.setState({highlight: false})
    }

    unhighlight = () => {
        this.setState({highlight: false})
    }

    render() {
        return (
            <View {...this.props} >
                {this.props.children}
                {
                    this.props.highlight || this.state.highlight ?
                        (
                            <View style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                borderWidth: 1,
                                borderColor: this.props.highlightColor || 'powderblue',
                            }} />
                        ) : null
                }
            </View>
        );
    }
}
