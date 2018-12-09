import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import IconButton from './icon-button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import SwitchView from './switch-view';



export default class TitleBar extends Component {
    constructor(props) {
        super(props);
        this.iconSize = 26
    }

    getMenuList = () => {
        return this.props.menu.map(item => {
            return (
                <MenuOption
                    key={JSON.stringify(item)}
                    disabled={item.disabled}
                    onSelect={item.onSelect} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <SwitchView visible={item.icon} >
                            <Icon size={25} name={item.icon} color={'black'} />
                        </SwitchView>
                        <Text style={{ ...styles.menu, color: item.disabled ? 'grey' : 'black' }}>
                            {item.name}
                        </Text>
                    </View>
                </MenuOption>
            )
        })
    }

    getActions = () => {
        return this.props.actions.map(item => {
            return (
                <IconButton
                    style={{ marginRight: 10 }}
                    key={JSON.stringify(item)}
                    size={this.iconSize}
                    color={this.props.foregroundColor}
                    onPress={item.onPress}
                    name={item.icon} />
            )
        })
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    this.props.containerStyle,
                    { backgroundColor: this.props.backgroundColor }
                ]} >
                <Text style={[styles.title, { color: this.props.foregroundColor }]} >{this.props.title}</Text>

                <View style={{ flex: 1 }} />

                {this.getActions()}

                <SwitchView visible={this.props.menu.length > 0} >
                    <Menu>
                        <MenuTrigger>
                            <Icon
                                size={this.iconSize}
                                name={'dots-vertical'}
                                color={this.props.foregroundColor} />
                        </MenuTrigger>
                        <MenuOptions>
                            {this.getMenuList()}
                        </MenuOptions>
                    </Menu>
                </SwitchView>
            </View >
        );
    }
}

const styles = {
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 54,
        alignItems: 'center',
        paddingVertical: 5,
        paddingLeft: 6,
        paddingRight: 8,
    },
    title: {
        fontSize: 18,
        marginHorizontal: 6,
        fontWeight: 'bold'
    },
    menu: {
        fontSize: 16,
        padding: 3
    }
}

TitleBar.propTypes = {
    backgroundColor: PropTypes.string,
    foregroundColor: PropTypes.string,
    title: PropTypes.string,
    containerStyle: PropTypes.object,
    menu: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        onSelect: PropTypes.func.isRequired,
        icon: PropTypes.string,
        disabled: PropTypes.bool
    })),
    actions: PropTypes.arrayOf(PropTypes.shape({
        icon: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    }))
}

TitleBar.defaultProps = {
    backgroundColor: 'white',
    foregroundColor: 'black',
    title: '',
    menu: [],
    actions: []
}