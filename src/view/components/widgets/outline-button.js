import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import SwitchView from "../switch-view";
import Icon from "./icon";


export default class OutlineButton extends React.Component {
    render() {
        const style = {
            color: this.props.color,
            borderColor: this.props.color,
            fontSize: this.props.size,
            ...this.props.titleStyle
        };

        return (
            <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
                <SwitchView visible={this.props.icon}>
                    <Icon color={this.props.color} name={this.props.icon} size={this.props.size}/>
                </SwitchView>
                <Text style={[styles.button, style]}>{this.props.title}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        fontWeight: 'bold',
        borderRadius: 5,
        borderWidth: 1,
        margin: 10,
        padding: 10,
        textAlign: 'center'
    },
    container: {
        flexDirection: 'row'
    }
});

OutlineButton.propTypes = {
    color: PropTypes.string,
    onPress: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.string,
    size: PropTypes.number,
    titleStyle: PropTypes.object
};

OutlineButton.defaultProps = {
    size: 15
};