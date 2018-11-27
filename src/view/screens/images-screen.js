import React from 'react';
import {
    FlatList,
    View,
    StatusBar,
    Image,
    TouchableWithoutFeedback,
    Dimensions,
    Modal
} from 'react-native';

import AppComponent from '../app-component';
import { requestStoragePermission } from '../../helpers/permissions-helper';
import { getPhotoStatuses, isWhatsappInstalled, saveWhatsAppStatus, Platform } from '../../helpers/whatsapp-helper';
import StatusActionBar from "../widgets/status-actionbar";
import { shareImage } from '../../helpers/app-helper';

import ZoomImageViewer from 'react-native-image-zoom-viewer'

export default class ImagesScreen extends AppComponent {
    state = {
        ...this.state,
        showModal: false,
        currentIndex: 0,
        statuses: []
    }

    async componentDidMount() {
        if (await requestStoragePermission() && await isWhatsappInstalled()) {
            this.setState({ statuses: await getPhotoStatuses() })
        }
    }

    renderPhoto({ item, index }) {
        const size = Dimensions.get('window').width / (this.isPortrait() ? 2 : 4)

        return (
            <TouchableWithoutFeedback onPress={() => this.setState({ showModal: true, showActions: true, currentIndex: index })} >
                <Image
                    source={{ uri: 'file://' + item }}
                    style={{ width: size, height: size }} />
            </TouchableWithoutFeedback>
        )
    }

    getViewingStatus = () => this.state.statuses[this.state.currentIndex]

    renderFooter() {
        return (
            <StatusActionBar
                onSharePress={() => shareImage(this.getViewingStatus())}
                onSavePress={() => saveWhatsAppStatus(this.getViewingStatus())}
                visible={this.state.showActions} />
        )
    }

    render() {
        return (
            <View style={this.theme.containers.screen}>

                <Modal
                    animationType="slide"
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}>
                    <StatusBar hidden />
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
                    key={this.state.orientation}
                    numColumns={this.isPortrait() ? 2 : 4}
                    data={this.state.statuses}
                    keyExtrator={({ item }) => item}
                    renderItem={this.renderPhoto.bind(this)}
                />
            </View>
        );
    }
}