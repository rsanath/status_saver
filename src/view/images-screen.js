import React, { Component } from 'react';
import { StyleSheet, FlatList, View, Text, Image, TouchableWithoutFeedback, Modal, Dimensions } from 'react-native';
import ZoomImageViewer from 'react-native-image-zoom-viewer'

import { requestStoragePermission } from '../helpers/permissions-helper';
import { getPhotoStatuses, isWhatsappInstalled } from '../helpers/whatsapp-helper';
import StatusActionBar from "./status-actionbar";
import { presistImage, toast, shareImage } from '../helpers/app-helper';
import { t } from '../i18n/i18n'


export default class ImagesScreen extends Component {
    state = {
        showModal: false,
        currentIndex: 0,
        statuses: []
    }

    async componentDidMount() {
        if (await requestStoragePermission() && await isWhatsappInstalled()) {
            this.setState({ statuses: await getPhotoStatuses() })
        }
    }

    getStatusCount = () => this.state.statuses.length

    renderPhoto({ item, index }) {
        const size = Dimensions.get('window').width / 2

        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ showModal: true, showActions: true, currentIndex: index })} >
                <Image
                    source={{ uri: 'file://' + item }}
                    style={{ width: size, height: size }} />
            </TouchableWithoutFeedback>
        )
    }

    saveImage = () => {
        const path = this.state.statuses[this.state.currentIndex]
        presistImage(path)
            .then(() => toast(t('photoSavedToDeviceMsg')))
            .catch((e) => toast(t('unableToPhotoSaveMsg\nErrMsg: ' + e.toString())))
    }

    shareImage = () => {
        const path = this.state.statuses[this.state.currentIndex]
        try {
            shareImage(path)
        } catch (e) {
            toast('Unable to share\nErrMsg: ' + e.toString())
        }
    }

    renderFooter() {
        return (
            <StatusActionBar
                onSharePress={this.shareImage.bind(this)}
                onSavePress={this.saveImage.bind(this)}
                visible={this.state.showActions} />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}>
                    <ZoomImageViewer
                        index={this.state.currentIndex}
                        renderIndicator={() => null}
                        onClick={() => this.setState(state => ({ showActions: !state.showActions }))}
                        onChange={index => this.setState({ currentIndex: index })}
                        onCancel={() => this.setState({ showModal: false, currentIndex: null })}
                        enableSwipeDown={true}
                        renderFooter={this.renderFooter.bind(this)}
                        imageUrls={this.state.statuses.map(url => ({ url: 'file://' + url }))} />
                </Modal>
                <FlatList
                    numColumns={2}
                    data={this.state.statuses}
                    keyExtrator={({ item }) => item}
                    renderItem={this.renderPhoto.bind(this)}
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
