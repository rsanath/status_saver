import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import IconButton from './widgets/icon-button';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from 'react-native-popup-menu';
import SwitchView from './switch-view';
import theme from '../theme/theme';
import Icon from "./widgets/icon";

export default class TitleBar extends Component {
    constructor(props) {
        super(props);
        this.iconSize = 30;
        this.state = {
            multiSelectMode: false
        }
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
                            <Icon size={20} name={item.icon} color={'black'} />
                        </SwitchView>
                        <Text style={{ ...styles.menu, color: item.disabled ? 'grey' : 'black' }}>
                            {item.name}
                        </Text>
                    </View>
                </MenuOption>
            )
        })
    }

    toggleMultiSelectMode = val => {
        this.setState({ multiSelectMode: val })
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
                    { backgroundColor: this.state.multiSelectMode ? theme.colors.secondary : this.props.backgroundColor }
                ]}>
                <Text style={[styles.title, { color: this.props.foregroundColor }]} >{this.props.title}</Text>

                <View style={{ flex: 1 }} />

                <SwitchView visible={!this.state.multiSelectMode} >
                    {this.getActions()}

                    <SwitchView visible={this.props.menu.length > 0} >
                        <Menu style={{paddingRight: 6}} >
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
        elevation: 10
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
    })),
    selectionMode: PropTypes.bool
}

TitleBar.defaultProps = {
    backgroundColor: 'white',
    foregroundColor: 'black',
    title: '',
    menu: [],
    actions: []
}