import React, { Component } from 'react';
import {
    FlatList,
    View,
    StatusBar,
    Dimensions,
    ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import AppComponent from '../app-component';
import StatusVideoPlayer from './status-video-player';
import MultiSelectFlatlist from '../widgets/multi-select-flatlist';
import MultiSelectActionBar from '../widgets/multi-select-actionbar';

import { requestStoragePermission } from '../../helpers/permissions-helper';
import { getVideoStatuses, isWhatsappInstalled, saveWhatsAppStatuses } from '../../helpers/whatsapp-helper';
import { shareVideo, shareVideos } from '../../helpers/app-helper';
import C from '../../constants';


export default class VideoScreen extends AppComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            tabBarVisible: (navigation.state.params && !navigation.state.params.hideTabBar),
            swipeEnabled: (navigation.state.params && !navigation.state.params.hideTabBar),
            animationEnabled: true
        }
    }

    state = {
        ...this.state,
        showActions: true,
        showModal: false,
        currentIndex: 0,
        statuses: [],
        multiSelectMode: false,
        selectedItems: []
    }

    async componentDidMount() {
        if (await requestStoragePermission() && await isWhatsappInstalled()) {
            this.setState({ statuses: await getVideoStatuses() })
            setInterval(async () => {
                this.setState({ statuses: await getVideoStatuses() })
            }, C.whatsAppStatusRefreshRate)
        }
    }

    renderVideoThumbnail({ item, index }) {
        const size = Dimensions.get('window').width / (this.isPortrait() ? 2 : 4)

        return (
            <View>
                <ImageBackground
                    source={{ uri: 'file://' + item }}
                    style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }} >
                    <Icon size={60} color={'rgba(255,255,255,0.6)'} name={'play-circle-outline'} />
                </ImageBackground>
            </View>
        )
    }

    getViewingStatus = () => this.state.statuses[this.state.currentIndex]

    getMultiSelectActionBar = () => {
        const onShare = () => shareVideos(this.state.selectedItems)
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
                <StatusVideoPlayer
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}
                    onSharePress={() => shareVideo(this.getViewingStatus())}
                    onSavePress={() => saveWhatsAppStatus(this.getViewingStatus())}
                    video={{ uri: this.state.statuses[this.state.currentIndex] }}
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
                    renderItem={this.renderVideoThumbnail.bind(this)}
                />

                {this.getMultiSelectActionBar()}
            </View>
        );
    }
}