import React, { Component } from 'react';
import {
    StyleSheet,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { requestStoragePermission } from '../helpers/permissions-helper';
import { getVideoStatuses, isWhatsappInstalled } from '../helpers/whatsapp-helper';
import StatusActionBar from "./status-actionbar";
import { presistImage, toast, shareImage, shareVideo } from '../helpers/app-helper';
import { t } from '../i18n/i18n'
import StatusVideoPlayer from './status-video-player';


export default class VideoScreen extends Component {
    state = {
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
        const size = Dimensions.get('window').width / 2
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

    saveStatus = () => {
        const path = this.state.statuses[this.state.currentIndex]
        presistImage(path)
            .then(() => toast(t('photoSavedToDeviceMsg')))
            .catch((e) => toast(t('unableToPhotoSaveMsg\nErrMsg: ' + e.toString())))
    }

    shareVideo = () => {
        const path = this.state.statuses[this.state.currentIndex]
        try {
            shareVideo(path)
        } catch (e) {
            toast('Unable to share\nErrMsg: ' + e.toString())
        }
    }

    render() {

        return (
            <View style={styles.container}>
                <Modal
                    hardwareAccelerated={true}
                    animationType="slide"
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}>
                    <StatusVideoPlayer
                        onSavePress={this.saveStatus.bind(this)}
                        onSharePress={this.shareVideo.bind(this)}
                        video={{ uri: this.state.statuses[this.state.currentIndex] }}
                    />
                </Modal>

                <FlatList
                    numColumns={2}
                    data={this.state.statuses}
                    keyExtrator={({ item }) => item}
                    renderItem={this.renderVideoThumbnail.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});