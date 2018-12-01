import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class CountBadge extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    styles = StyleSheet.create({
        badge: {
            color: this.props.color || 'white',
            fontSize: 12,
            padding: 5,
            fontWeight: 'bold',
            backgroundColor: 'grey',
            borderRadius: 1000
        }
    })

    render() {
        return (
            <View>
                <Text style={this.styles.badge}>
                    {this.props.count}
                </Text>
            </View>
        );
    }
}