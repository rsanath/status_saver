import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import PropTypes from 'prop-types';


export default class Card extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>{this.props.header}</View>
                <Image style={styles.image} source={this.props.image}/>
                <Text style={styles.text}>{this.props.content}</Text>
                <View style={styles.footer}>{this.props.footer}</View>
            </View>
        )
    }
}

Card.propTypes = {
    image: PropTypes.any,
    content: PropTypes.string,
    header: PropTypes.any,
    footer: PropTypes.any
};


const styles = StyleSheet.create({
    container: {
        padding: 15,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    image: {
        margin: 5,
        width: 200,
        height: 200
    },
    text: {
        margin: 5,
        fontSize: 16,
        textAlign: 'center'
    }
});
