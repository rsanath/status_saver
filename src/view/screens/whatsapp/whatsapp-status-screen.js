import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Dimensions,
    StatusBar,
    Modal
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';

import AppComponent from '../../app-component';
import Gallery from '../../components/gallery';
import Constants from "../../../constants";
import IconButton from "../../components/widgets/icon-button";

import {getFileInfoAsString} from '../../../helpers/app-helper';
import fs from '../../../native-modules/file-system';
import CommonUtil from "../../../utils/common-utils";
import {notifyError} from "../../../helpers/bugsnag-helper";
import ShareModule from "../../../native-modules/share-module";
import MediaViewer from "../../components/media-viewer";
import TitleBar from "../../components/titlebar";


class WhatsAppStatusScreen extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            multiSelectMode: false,
            mediaViewerVisible: false
        }
    }

    onMultiSelectItemsChange = (selection) => {
        this.setState({
            multiSelectItems: selection
        })
    };

    clearMultiSelectItems = () => {
        this.setState({multiSelectItems: [], multiSelectMode: false})
    };

    onSaveMultiple = async (items) => {
        const exist = await fs.exists(Constants.WHATSAPP_STATUS_SAVE_PATH);
        if (!exist) {
            await fs.mkdir(Constants.WHATSAPP_STATUS_SAVE_PATH);
        }
        let saves = items.map(item => {
            let dest = Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(item);
            return fs.cp(item, dest);
        });
        Promise.all(saves)
            .then(() => this.toast(this.t('messages.saveSuccess')))
            .catch(e => {
                notifyError(e);
                this.toast(this.t('messages.saveFailure') + '\nMessage: ' + e.message);
            })
    };

    onShareMultiple = (items) => {
        ShareModule.shareMultipleMedia(items, 'images/*')
    }

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
        const exist = await fs.exists(Constants.WHATSAPP_STATUS_SAVE_PATH);
        if (!exist) {
            await fs.mkdir(Constants.WHATSAPP_STATUS_SAVE_PATH);
        }
        let dest = Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(path);
        fs.cp(path, dest)
            .then(() => this.toast(this.t('messages.saveSuccess')))
            .catch(e => {
                notifyError(e);
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
            {iconName: 'content-save', onPress: () => this.onSaveMultiple(this.state.multiSelectItems)},
            {iconName: 'share-variant', onPress: () => this.onShareMultiple(this.state.multiSelectItems)},
        ]
    };

    renderHeader = function (path) {
        const colors = this.theme.screens.whatsapp;
        const onPress = () => this.setState({mediaViewerVisible: false});

        return (
            <View style={{flex: 1, flexDirection: 'row', backgroundColor: colors.mediaViewerHeaderFooterColor}}>
                <IconButton
                    name={'chevron-down'}
                    size={50}
                    color={colors.mediaViewerFgColor}
                    onPress={onPress}
                />
            </View>
        )
    };

    renderFooter = path => {
        const colors = this.theme.screens.whatsapp;

        return (
            <View style={[styles.header, {backgroundColor: colors.mediaViewerHeaderFooterColor}]}>
                <IconButton
                    name={'information'}
                    color={colors.mediaViewerFgColor}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressInfo(path)}/>
                <IconButton
                    name={'delete'}
                    color={colors.mediaViewerFgColor}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressDelete(path)}/>
                <IconButton
                    name={'content-save'}
                    color={colors.mediaViewerFgColor}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressSave(path)}/>
                <IconButton
                    name={'share-variant'}
                    color={colors.mediaViewerFgColor}
                    size={30}
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
            />
        )
    };

    componentProps = {
        highlightableView: {
            highlightColor: this.theme.screens.whatsapp.itemHighlightColor
        },
        actionBar: {
            foregroundColor: 'black',
            backgroundColor: 'white'
        },
        titleBar: {
            backgroundColor: this.theme.screens.whatsapp.titleBarBgColor,
            foregroundColor: this.theme.screens.whatsapp.titleBarFgColor
        }
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
                {this.renderTitleBar()}
                {this.renderMediaViewer()}
                <Gallery
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
                />
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

export default connect(mapStateToProps)(WhatsAppStatusScreen);