import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StatusBar,
    RefreshControl
} from 'react-native';

import { connect } from 'react-redux';

import ImageViewer from '../widgets/image-viewer';
import StatusActionBar from '../widgets/status-actionbar';
import AppComponent from '../app-component';
import MultiSelectFlatlist from '../widgets/multi-select-flatlist';
import MultiSelectActionBar from '../widgets/multi-select-actionbar';

import { requestStoragePermission } from '../../helpers/permissions-helper';
import { getPhotoStatuses, saveWhatsAppStatus, saveWhatsAppStatuses } from '../../helpers/whatsapp-helper';
import { shareImage, shareImages } from '../../helpers/app-helper';
import C from '../../constants';
import App from '../../../App';
import SwitchView from '../widgets/switch-view';
import NoStatusWidget from '../widgets/no-status-widget';
import { FlatList } from 'react-native-gesture-handler';



class ImagesScreen extends AppComponent {
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
        selectedItems: [],
        refreshing: false
    }

    fetchStatuses = async () => {
        this.setState({ statuses: await getPhotoStatuses(this.props.statusPath) })
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

    renderHeader = () => {
        return (
            <View />
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

    onRefresh = () => {
        console.log('refreshing')
        this.setState({ refreshing: true })
        this.fetchStatuses()
            .then(() => this.setState({ refreshing: true }))
    }

    async componentDidMount() {
        if (await requestStoragePermission()) {
            this.fetchStatuses()
            setInterval(async () => {
                if (this.state.multiSelectMode) return;
                this.fetchStatuses()
            }, C.whatsAppStatusRefreshRate)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.statusPath !== this.props.statusPath) {
            this.fetchStatuses()
        }
    }

    render() {

        return (
            <View style={this.theme.containers.screen}>

                <ImageViewer
                    backgroundColor={'red'}
                    onPressImage={() => this.setState(state => ({ showActions: !state.showActions }))}
                    renderHeader={this.renderHeader}
                    renderFooter={this.renderFooter}
                    index={this.state.currentIndex}
                    onIndexChanged={currentIndex => this.setState({ currentIndex })}
                    onRequestClose={() => this.setState({ showModal: false })}
                    visible={this.state.showModal}
                    images={this.state.statuses.map(img => 'file://' + img)}
                />

                <SwitchView visible={this.state.statuses.length <= 0} >
                    <NoStatusWidget />
                </SwitchView>

                <MultiSelectFlatlist
                    ref={'multiSelectList'}
                    style={{ marginTop: this.state.multiSelectMode ? 54 : 0 }}
                    onExitMultiSelectMode={() => {
                        App.titleBar().toggleMultiSelectMode(false)
                        this.setState({ multiSelectMode: false })
                        this.props.navigation.setParams({ hideTabBar: false });
                    }}
                    onEnterMultiSelectMode={() => {
                        App.titleBar().toggleMultiSelectMode(true)
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
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => {
                                this.fetchStatuses().then(() => this.setState({ refreshing: false }))
                            }}
                            refreshing={this.state.refreshing}
                        />
                    }
                />

                {this.getMultiSelectActionBar()}

            </View>
        );
    }
}

const mapStateToProps = ({ status }) => ({ ...status });

export default connect(mapStateToProps)(ImagesScreen);