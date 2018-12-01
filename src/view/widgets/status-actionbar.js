import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

import AppComponent from '../app-component';


export default class StatusActionBar extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state
        }
    }

    render() {
        if (this.props.visible == false || this.state.visible == false) return null;

        return (
            <View style={[styles.container, { width: this.state.screenWidth }]} {...this.props} >
                <TouchableOpacity onPress={this.props.onSavePress} >
                    <View style={styles.iconContainer} >
                        <Icon size={30} color={'white'} name={'save'} />
                        <Text style={styles.iconTitle} >Save</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.props.onSharePress} >
                    <View style={styles.iconContainer} >
                        <Icon size={30} color={'white'} name={'share'} />
                        <Text style={styles.iconTitle} >Share</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    iconContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 6,
        marginVertical: 4,
    },
    iconTitle: {
        color: 'white',
        fontWeight: 'bold',
    }
})
