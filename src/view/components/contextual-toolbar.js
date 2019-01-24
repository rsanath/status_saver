import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import IconButton from './widgets/icon-button';


export default class ContextualToolbar extends Component {

    getActions = () => {
        return this.props.actions.map(action => {
            return (
                <IconButton
                    style={styles.action}
                    key={action.iconName}
                    onPress={action.onPress}
                    name={action.iconName}
                    color={this.props.foregroundColor}
                    size={this.props.iconSize}
                />
            )
        })
    };

    render() {
        const { iconSize, foregroundColor, backgroundColor } = this.props;
        const containerStyle = { backgroundColor };
        const countStyle = {color: this.props.foregroundColor};

        return (
            <View style={[styles.container, containerStyle]} >

                <IconButton
                    onPress={this.props.onRequestCancel}
                    style={styles.icon}
                    name={'close'}
                    color={foregroundColor}
                    size={iconSize} />

                <Text
                    style={[styles.count, countStyle]}  >
                    {this.props.count}
                </Text>

                <View style={styles.flexibleGap} />

                <View style={styles.actionsContainer} >
                    {this.getActions()}
                </View>

            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 54,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 6,
        elevation: 10
    },
    actionsContainer: {
        padding: 10,
        flexDirection: 'row'
    },
    icon: {
        marginVertical: 3,
        marginHorizontal: 5
    },
    action: {
        marginLeft: 10
    },
    flexibleGap: {
        flex: 1
    },
    count: {
        fontSize: 18,
        marginHorizontal: 6,
        fontWeight: 'bold'
    }
});

ContextualToolbar.propTypes = {
    iconSize: PropTypes.number,
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    selectedCount: PropTypes.number,
    onRequestCancel: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    })),
    onActionPressed: PropTypes.func.isRequired
};

ContextualToolbar.defaultProps = {
    iconSize: 30,
    foregroundColor: 'black',
    backgroundColor: 'white',
    actions: []
};