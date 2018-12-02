import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StatusBar
} from 'react-native';

import ImageViewer from '../widgets/image-viewer';
import StatusActionBar from '../widgets/status-actionbar';
import AppComponent from '../app-component';
import MultiSelectFlatlist from '../widgets/multi-select-flatlist';

import { requestStoragePermission } from '../../helpers/permissions-helper';
import {
    getPhotoStatuses,
    isWhatsappInstalled,
    saveWhatsAppStatus,
    saveWhatsAppStatuses
} from '../../helpers/whatsapp-helper';
import { shareImage, shareImages } from '../../helpers/app-helper';
import C from '../../constants';
import MultiSelectActionBar from '../widgets/multi-select-actionbar';


export default class ImagesScreen extends AppComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: (navigation.state.params && !navigation.state.params.hideTabBar),
            swipeEnabled: (navigation.state.params && !navigation.state.params.hideTabBar),
            animationEnabled: true
        }
    }

    state = {
        ...this.state,
        showModal: false,
        showActions: true,
        currentIndex: 0,
        statuses: [],
        multiSelectMode: false,
        selectedItems: []
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

    getMultiSelectActionBar = () => {
        const onShare = () => shareImages(this.state.selectedItems)
        const onSave = () => saveWhatsAppStatuses(this.state.selectedItems)

        return this.state.multiSelectMode ?
            (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                        elevation: 4
                    }}>
                    <StatusBar
                        backgroundColor={this.theme.colors.secondaryDark}
                        barStyle="light-content"
                    />
                    <MultiSelectActionBar
                        style={{
                            backgroundColor: this.theme.colors.secondary
                        }}
                        onShare={onShare}
                        onSave={onSave}
                        onCancel={() => this.refs.multiSelectList.finishMultiSelectMode()}
                        count={this.state.selectedItems.length} />
                </View>
            ) : null
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
                    ref={'multiSelectList'}
                    style={{ marginTop: this.state.multiSelectMode ? 54 : 0 }}
                    onExitMultiSelectMode={() => {
                        this.setState({ multiSelectMode: false })
                        this.props.navigation.setParams({ hideTabBar: false });
                    }}
                    onEnterMultiSelectMode={() => {
                        this.setState({ multiSelectMode: true })
                        this.props.navigation.setParams({ hideTabBar: true });
                    }}
                    onSelectionChange={selectedIndexes => {
                        const items = selectedIndexes.map(i => this.state.statuses[i])
                        this.setState({ selectedItems: items })
                    }}
                    onPressItem={({ index }) => this.setState({ showModal: true, showActions: true, currentIndex: index })}
                    key={this.state.orientation}
                    numColumns={this.isPortrait() ? 2 : 4}
                    data={this.state.statuses}
                    keyExtrator={({ item }) => item}
                    renderItem={this.renderPhoto.bind(this)}
                />

                {this.getMultiSelectActionBar()}

            </View>
        );
    }
}