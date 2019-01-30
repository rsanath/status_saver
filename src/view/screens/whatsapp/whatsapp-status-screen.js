import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    StatusBar,
    Modal, Text
} from 'react-native';

import {connect} from 'react-redux';

import AppComponent from '../../app-component';
import Gallery from '../../components/gallery';
import Constants from "../../../constants";
import IconButton from "../../components/widgets/icon-button";

import {getFileInfoAsString} from '../../../helpers/app-helper';
import fs from '../../../native-modules/file-system';
import CommonUtil from "../../../utils/common-utils";
import ShareModule from "../../../native-modules/share-module";
import MediaViewer from "../../components/media-viewer";
import TitleBar from "../../components/titlebar";
import {WhatsAppActions, getInitialStatusSource} from "../../../redux/actions/whatsapp-actions";
import WhatsAppHelper from "../../../helpers/whatsapp-helper";
import SwitchView from "../../components/switch-view";
import Card from "../../components/card";


class WhatsAppStatusScreen extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            multiSelectMode: false,
            mediaViewerVisible: false
        };
    }

    componentDidMount() {
        this.props.getInitialStatusSource();
    }

    onMultiSelectItemsChange = (selection) => {
        this.setState({
            multiSelectItems: selection
        })
    };

    clearMultiSelectItems = () => {
        this.setState({multiSelectItems: [], multiSelectMode: false})
    };

    onChangeStatusSource = async (type) => {
        const path = WhatsAppHelper.getPathForWhatsAppType(type);
        const exists = await fs.exists(path);
        if (!exists) {
            Alert.alert(this.t('screens.whatsApp.titles.noStatus'), this.t('screens.whatsApp.messages.noStatus', {type}));
            return;
        }
        this.props.changeWhatsAppType(path);
    };

    onDeleteMultiple = async (items) => {
        const deleteFiles = () => {
            const del = items.map(item => fs.rm(item));
            Promise.all(del)
                .then(() => {
                    this.toast('Deleted');
                    this.refs.gallery.fetchData();
                })
                .catch(e => this.toast(e))
        };

        Alert.alert(
            this.t('titles.deleteStatus'),
            this.t('messages.deleteMultipleStatus'),
            [
                {text: this.t('labels.cancel'), onPress: null, style: 'cancel'},
                {text: this.t('labels.delete'), onPress: deleteFiles},
            ],
            {cancelable: true}
        )
    };

    onSaveMultiple = async (items) => {
        WhatsAppHelper.saveMultipleStatus(items)
            .then(() => this.toast(this.t('messages.saveSuccess')))
            .catch(e => {
                this.toast(this.t('messages.saveFailure') + '\nMessage: ' + e.message);
            })
    };

    onShareMultiple = (items) => {
        ShareModule.shareMultipleMedia(items, 'images/*')
    };

    onPressItem = (item, index, data) => {
        this.setState({selectedIndex: index, mediaViewerVisible: true})
    };

    onPressInfo = async path => {
        Alert.alert(
            this.t('labels.fileInfo'),
            await getFileInfoAsString(path),
            [],
            {cancelable: true})
    };

    onPressDelete = path => {
        const deleteFile = () => {
            fs.rm(path)
                .then(() => {
                    this.refs.gallery.fetchData();
                    this.toast('Deleted')
                })
        };

        Alert.alert(
            this.t('titles.deleteStatus'),
            this.t('messages.deleteStatus'),
            [
                {text: this.t('labels.cancel'), onPress: null, style: 'cancel'},
                {text: this.t('labels.delete'), onPress: deleteFile},
            ],
            {cancelable: true}
        )
    };

    onPressSave = async (path) => {
        WhatsAppHelper.saveStatus(path)
            .then(() => this.toast(this.t('messages.saveSuccess')))
            .catch(e => {
                this.toast(this.t('messages.saveFailure') + '\nMessage: ' + e.message);
            })
    };

    onPressShare = path => {
        const type = CommonUtil.getMediaType(path);
        const mime = type == 'video' ? 'video/mp4' : 'image/jpg';
        ShareModule.shareMedia(path, mime)
    };

    getMultiSelectActions = () => {
        return [
            {iconName: 'trash', onPress: () => this.onDeleteMultiple(this.state.multiSelectItems)},
            {iconName: 'save', onPress: () => this.onSaveMultiple(this.state.multiSelectItems)},
            {iconName: 'share', onPress: () => this.onShareMultiple(this.state.multiSelectItems)},
        ]
    };

    getTitleBarMenu = () => {
        return [{
            name: 'WhatsApp Status',
            onSelect: () => this.onChangeStatusSource(WhatsAppHelper.WhatsAppTypes.WHATSAPP)
        }, {
            name: 'GB WhatsApp Status',
            onSelect: () => this.onChangeStatusSource(WhatsAppHelper.WhatsAppTypes.GB_WHATSAPP)
        }, {
            name: 'WhatsApp Business Status',
            onSelect: () => this.onChangeStatusSource(WhatsAppHelper.WhatsAppTypes.WHATSAPP_BUSINESS)
        }];
    };

    renderHeader = function (path) {
        const colors = this.theme.screens.whatsapp;
        const onPress = () => this.setState({mediaViewerVisible: false});

        return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: colors.mediaViewerHeaderFooterColor}}>
                <IconButton
                    style={{marginTop: 10, marginLeft: 10}}
                    name={'chevron-down'}
                    size={40}
                    color={colors.mediaViewerFgColor}
                    onPress={onPress}
                />
            </View>
        )
    };

    renderFooter = path => {
        const colors = this.theme.screens.whatsapp;
        const iconSize = 30;

        return (
            <View style={[styles.header, {backgroundColor: colors.mediaViewerHeaderFooterColor}]}>
                <IconButton
                    name={'info'}
                    color={colors.mediaViewerFgColor}
                    size={iconSize}
                    style={styles.icon}
                    onPress={() => this.onPressInfo(path)}/>
                <IconButton
                    name={'trash'}
                    color={colors.mediaViewerFgColor}
                    size={iconSize}
                    style={styles.icon}
                    onPress={() => this.onPressDelete(path)}/>
                <IconButton
                    name={'save'}
                    color={colors.mediaViewerFgColor}
                    size={iconSize}
                    style={styles.icon}
                    onPress={() => this.onPressSave(path)}/>
                <IconButton
                    name={'share'}
                    color={colors.mediaViewerFgColor}
                    size={iconSize}
                    style={styles.icon}
                    onPress={() => this.onPressShare(path)}/>
            </View>
        )
    };

    renderMediaViewer = () => {
        if (!this.state.mediaViewerVisible) return null;
        const screenTheme = this.theme.screens.whatsapp;

        return (
            <Modal
                transparent={true}
                animationType={'slide'}
                onRequestClose={() => this.setState({mediaViewerVisible: false})}
                visible={this.state.mediaViewerVisible}>
                <StatusBar backgroundColor={screenTheme.mediaViewerBgColor}/>
                <MediaViewer
                    index={this.state.selectedIndex}
                    data={this.state.data}
                    immersiveMode={false}
                    renderFooter={this.renderFooter}
                    renderHeader={this.renderHeader.bind(this)}
                    backgroundColor={this.theme.screens.whatsapp.mediaViewerBgColor}
                />
            </Modal>
        )
    };

    renderTitleBar = () => {
        if (this.state.multiSelectMode) return null;

        return (
            <TitleBar
                {...this.componentProps.titleBar}
                title={'WhatsApp Status Saver'}
                containerStyle={styles.titleBarStyle}
                menu={this.getTitleBarMenu()}
            />
        )
    };

    renderNoMediaComponent = () => {
        return (
            <Card
                image={require('../../../assets/images/beach.png')}
                content={(
                    <Text>
                        <Text>Nothing here.</Text>
                        <Text>View any status and come check back.</Text>
                    </Text>
                )}
            />
        )
    };

    componentProps = {
        highlightableView: {
            highlightColor: this.theme.screens.whatsapp.itemHighlightColor
        },
        actionBar: {
            foregroundColor: 'black',
            backgroundColor: 'white',
            iconSize: 30
        },
        titleBar: {
            backgroundColor: this.theme.screens.whatsapp.titleBarBgColor,
            foregroundColor: this.theme.screens.whatsapp.titleBarFgColor
        }
    };

    renderNoWhatsAppAvailableComponent = () => {
        return (
            <Card
                content={'No whatsapp available'}
                image={require('../../../assets/images/hammock.png')}
            />
        )
    };

    render() {
        const screenTheme = this.theme.screens.whatsapp;
        const statusBarColor = this.state.multiSelectMode ?
            screenTheme.statusBarSelectionModeColor :
            screenTheme.statusBarColor;
        const statusBarStyle = CommonUtil.isLightColor(statusBarColor) ?
            'dark-content' : 'light-content';

        return (
            <View
                style={[this.theme.containers.screen, {backgroundColor: this.theme.screens.whatsapp.backgroundColor}]}>
                <StatusBar
                    barStyle={statusBarStyle}
                    backgroundColor={statusBarColor}/>
                <SwitchView visible={this.state.noWhatsAppAvailable}>
                    {this.renderNoWhatsAppAvailableComponent}
                </SwitchView>
                <SwitchView visible={!this.state.noWhatsAppAvailable}>
                    {this.renderTitleBar()}
                    {this.renderMediaViewer()}
                    <Gallery
                        ref={'gallery'}
                        containerStyle={{backgroundColor: this.theme.screens.global.backgroundColor}}
                        path={this.props.statusSource}
                        dataRefreshRate={Constants.MEDIA_REFRESH_RATE}
                        onPressItem={this.onPressItem}
                        onEnterMultiSelectMode={() => this.setState({multiSelectMode: true})}
                        onExitMultiSelectMode={this.clearMultiSelectItems}
                        onRequestCancelMultiSelect={this.clearMultiSelectItems}
                        onMultiSelectSelectionChange={this.onMultiSelectItemsChange}
                        onDataChange={data => this.setState({data})}
                        multiSelectActions={this.getMultiSelectActions()}
                        refreshColor={[this.theme.screens.whatsapp.refreshColor]}
                        contextualActionBarProps={this.componentProps.actionBar}
                        highlightableViewProps={this.componentProps.highlightableView}
                        NoMediaComponent={this.renderNoMediaComponent()}
                    />
                </SwitchView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row'
    },
    icon: {
        marginHorizontal: 10
    },
    multiselectActionBarStyle: {
        borderBottomColor: 'white',
        borderBottomWidth: 2
    },
    titleBarStyle: {}
});

const mapStateToProps = ({whatsapp}) => ({...whatsapp});

const mapDispatchToProps = dispatch => {
    return {
        getInitialStatusSource: () => getInitialStatusSource(dispatch),
        changeWhatsAppType: (source) => dispatch(WhatsAppActions.changeWhatsAppType(source))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppStatusScreen);