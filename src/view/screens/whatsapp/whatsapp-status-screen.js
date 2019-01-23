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


class WhatsAppStatusScreen extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selectedIndex: 0,
            mediaViewerVisible: false
        }
    }

    onMultiSelectItemsChange = (selection) => {
        this.setState({
            multiSelectItems: selection
        })
    };

    clearMultiSelectItems = () => {
        this.setState({multiSelectItems: []})
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
        const onPress = () => this.setState({mediaViewerVisible: false});
        return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                <IconButton name={'chevron-down'} size={50} color={'white'} onPress={onPress}/>
            </View>
        )
    };

    renderFooter = path => {
        return (
            <View style={styles.header}>
                <IconButton
                    name={'information'}
                    color={'white'}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressInfo(path)}/>
                <IconButton
                    name={'delete'}
                    color={'white'}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressDelete(path)}/>
                <IconButton
                    name={'content-save'}
                    color={'white'}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressSave(path)}/>
                <IconButton
                    name={'share-variant'}
                    color={'white'}
                    size={30}
                    style={styles.icon}
                    onPress={() => this.onPressShare(path)}/>
            </View>
        )
    };

    renderMediaViewer = () => {
        if (!this.state.mediaViewerVisible) return null;

        return (
            <Modal
                animationType={'slide'}
                onRequestClose={() => this.setState({mediaViewerVisible: false})}
                visible={this.state.mediaViewerVisible}>
                <StatusBar backgroundColor={'black'}/>
                <MediaViewer
                    index={this.state.selectedIndex}
                    data={this.state.data}
                    immersiveMode={false}
                    renderFooter={this.renderFooter}
                    renderHeader={this.renderHeader.bind(this)}
                />
            </Modal>
        )
    };

    render() {
        const screen = Dimensions.get('screen');
        const window = Dimensions.get('window');

        return (
            <View style={this.theme.containers.screen}>
                {this.renderMediaViewer()}
                <Gallery
                    path={this.props.statusSource}
                    dataRefreshRate={Constants.MEDIA_REFRESH_RATE}
                    onPressItem={this.onPressItem}
                    onEnterMultiSelectMode={() => null}
                    onExitMultiSelectMode={this.clearMultiSelectItems}
                    onRequestCancelMultiSelect={this.clearMultiSelectItems}
                    onMultiSelectSelectionChange={this.onMultiSelectItemsChange}
                    multiSelectActions={this.getMultiSelectActions()}
                    onDataChange={data => this.setState({data})}
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
    }
});

const mapStateToProps = ({whatsapp}) => ({...whatsapp});

export default connect(mapStateToProps)(WhatsAppStatusScreen);