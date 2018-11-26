import React, { Component } from 'react';
import {
    StatusBar,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import Modal from "react-native-modal";

import AppComponent from '../app-component';
import { requestStoragePermission } from '../../helpers/permissions-helper';
import { getVideoStatuses, isWhatsappInstalled } from '../../helpers/whatsapp-helper';
import { shareVideo } from '../../helpers/app-helper';

import StatusVideoPlayer from './status-video-player';


export default class VideoScreen extends AppComponent {
    state = {
        ...this.state,
        showActions: true,
        showModal: false,
        currentIndex: 0,
        statuses: [],
        screenWidth: Dimensions.get('window').width,
        videoHeight: 0
    }

    async componentDidMount() {
        if (await requestStoragePermission() && await isWhatsappInstalled()) {
            this.setState({ statuses: await getVideoStatuses() })
        }
    }

    renderVideoThumbnail({ item, index }) {
        const size = Dimensions.get('window').width / (this.isPortrait() ? 2 : 4)
        const onPress = () => this.setState({ showModal: true, showActions: true, currentIndex: index })

        return (
            <TouchableOpacity activeOpacity={100} onPress={onPress} >
                <View>
                    <ImageBackground
                        source={{ uri: 'file://' + item }}
                        style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }} >
                        <Icon size={60} color={'rgba(255,255,255,0.6)'} name={'play-circle-outline'} />
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        )
    }

    getViewingStatus = () => this.state.statuses[this.state.currentIndex]

    render() {

        return (
            <View style={this.theme.containers.screen}>
                <Modal
                    hardwareAccelerated={true}
                    animationType="slide"
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}>
                    <StatusBar hidden />
                    <StatusVideoPlayer
                        onSharePress={() => shareVideo(this.getViewingStatus())}
                        onSavePress={() => saveWhatsAppStatus(this.getViewingStatus())}
                        video={{ uri: this.state.statuses[this.state.currentIndex] }}
                    />
                </Modal>

                <FlatList
                    key={this.state.orientation}
                    numColumns={this.isPortrait() ? 2 : 4}
                    data={this.state.statuses}
                    keyExtrator={({ item }) => item}
                    renderItem={this.renderVideoThumbnail.bind(this)}
                />
            </View>
        );
    }
}