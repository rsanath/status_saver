import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';


export default class NoStatusWidget extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View
                style={[styles.container, this.props.style]}
                {...this.props}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('../../assets/images/beach.png')} />
                <Text style={styles.info} >No status available</Text>
                <Text style={styles.info} >Watch any status on WhatsApp and come check back.</Text>

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
    }
}