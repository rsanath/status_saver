 import React, { Component } from 'react';
import { View, Modal, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppComponent from '../app-component';
import SwitchView from './switch-view';


export default class ImageViewer extends AppComponent {

    onIndexChanged = index => {
        this.setState({ index })
        this.props.onIndexChanged && this.props.onIndexChanged(index)
    };

    getImages = () => {

        return this.props.images.map(source => {
            const onPress = this.props.onPressImage ? () => this.props.onPressImage(source) : null
            return (
                <TouchableWithoutFeedback
                    key={source}
                    onPress={onPress} >
                    <Image
                        resizeMode={'contain'}
                        style={{ width: this.state.screenWidth, height: this.state.screenHeight }}
                        source={{ uri: source }} />
                </TouchableWithoutFeedback>
            )
        })
    }

    renderHeader = () => {
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                flexDirection: 'row',
            }} >
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={this.props.onRequestClose} >
                    <Icon name={'close'} color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <Modal
                onRequestClose={this.props.onRequestClose}
                visible={this.props.visible} >
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }} >

                    <Swiper
                        style={{
                            marginTop: -15,
                            padding: 0,
                        }}
                        ref={'swiper'}
                        showsPagination={false}
                        width={this.state.screenWidth}
                        height={this.state.screenHeight}
                        containerStyle={styles.containerStyle}
                        loop={this.props.loop || false}
                        onIndexChanged={this.onIndexChanged}
                        index={this.props.index || 0}
                        showsButtons={false}>
                        {this.getImages()}
                    </Swiper>

                    <SwitchView visible={this.props.renderFooter} >
                        <View style={styles.footer}>
                            {this.props.renderFooter && this.props.renderFooter()}
                        </View>
                    </SwitchView>

                    <SwitchView visible={this.props.renderHeader} >
                        <View style={styles.header}>
                            {this.props.renderHeader && this.props.renderHeader()}
                        </View>
                    </SwitchView>

                </View>
            </Modal>

        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {
        position: 'absolute',
        top: 0,
    },
    footer: {
        position: 'absolute',
        bottom: 0
    }
}