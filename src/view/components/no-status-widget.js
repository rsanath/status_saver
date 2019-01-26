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
                    style={{ width: 200, height: 200 , margin: 10}}
                    source={require('../../assets/images/beach.png')} />
                <Text style={styles.info} >Nothing here.</Text>
                <Text style={styles.info} >View any status and come check back.</Text>

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
        fontSize: 18,
        textAlign: 'center'
    }
}