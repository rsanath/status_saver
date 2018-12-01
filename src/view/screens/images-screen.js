import React from 'react';
import {
    View,
    Image,
    Dimensions
} from 'react-native';

import ImageViewer from '../widgets/image-viewer';
import StatusActionBar from '../widgets/status-actionbar';
import AppComponent from '../app-component';
import MultiSelectFlatlist from '../widgets/multi-select-flatlist';

import { requestStoragePermission } from '../../helpers/permissions-helper';
import { getPhotoStatuses, isWhatsappInstalled, saveWhatsAppStatus } from '../../helpers/whatsapp-helper';
import { shareImage } from '../../helpers/app-helper';
import C from '../../constants';


export default class ImagesScreen extends AppComponent {
    state = {
        ...this.state,
        showModal: false,
        showActions: true,
        currentIndex: 0,
        statuses: [],
        multiSelectMode: false,
        selectedIndex: []
    }

    async componentDidMount() {
        if (await requestStoragePermission() && await isWhatsappInstalled()) {
            this.setState({ statuses: await getPhotoStatuses() })
            setInterval(async () => {
                if (this.state.multiSelectMode) return;
                this.setState({ statuses: await getPhotoStatuses() })
            }, C.whatsAppStatusRefreshRate)
        }
    }

    renderPhoto({ item, index }) {
        const size = Dimensions.get('window').width / (this.isPortrait() ? 2 : 4)

        return (
            <Image
                source={{ uri: 'file://' + item }}
                style={{ width: size, height: size }} />
        )
    }

    getViewingStatus = () => this.state.statuses[this.state.currentIndex]

    renderFooter = () => {
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

                <ImageViewer
                    backgroundColor={'red'}
                    onPressImage={() => this.setState(state => ({ showActions: !state.showActions }))}
                    renderFooter={this.renderFooter}
                    index={this.state.currentIndex}
                    onIndexChanged={currentIndex => this.setState({ currentIndex })}
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}
                    images={this.state.statuses.map(img => 'file://' + img)}
                />

                <MultiSelectFlatlist
                    onPressItem={({ index }) => this.setState({ showModal: true, showActions: true, currentIndex: index })}
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




{/* <FlatList
    key={this.state.orientation}
    numColumns={this.isPortrait() ? 2 : 4}
    data={this.state.statuses}
    keyExtrator={({ item }) => item}
    renderItem={this.renderPhoto.bind(this)}
/>  */}