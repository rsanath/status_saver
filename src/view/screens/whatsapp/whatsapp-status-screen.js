import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Dimensions
} from 'react-native';

import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';

import AppComponent from '../../app-component';
import Gallery from '../../components/gallery';
import Constants from "../../../constants";
import IconButton from "../../components/widgets/icon-button";

import fs from '../../../native-modules/file-system';
import CommonUtil from "../../../utils/common-utils";
import {notifyError} from "../../../helpers/bugsnag-helper";


class WhatsAppStatusScreen extends AppComponent {

    onPressItem = (item, index, data) => {
        const props = {
            index,
            media: data,
            immersiveMode: false,
            renderFooter: () => this.renderFooter(item),
            renderHeader: () => this.renderHeader(item)
        };
        this.props.navigation.navigate('StatusViewer', {props})
    };

    onPressInfo = async path => {
        const info = (await fs.lstat(path))[0];

        const message = `Path: ${info.path}\n\nLastModified: ${info.lastModified}`;

        Alert.alert(info.filename, message)
    };

    onPressDelete = path => {

    };

    onPressSave = async (path) => {
        console.log(path);
        console.log(Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(path))

        const exist = await fs.exists(Constants.WHATSAPP_STATUS_SAVE_PATH);
        if (!exist) {
            await fs.mkdir(Constants.WHATSAPP_STATUS_SAVE_PATH);
        }

        fs.cp(path, Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(path))
            .then(() => {
                this.toast('Saved.')
            })
            .catch(e => {
                notifyError(e);
                this.toast('Unable to save\nMessage: ' + e.message);
            })
    };

    onPressShare = path => {

    };

    renderHeader = function (path) {
        const onPress = () => this.props.navigation.dispatch(NavigationActions.back());
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

    render() {
        const screen = Dimensions.get('screen');
        const window = Dimensions.get('window');

        console.log(`Height\nscreen: ${screen.height}\twindow: ${window.height}\t diff: ${screen.height - window.height}`)
        console.log(`Width\nscreen: ${screen.width}\twindow: ${window.width}\t diff: ${screen.width - window.width}`)

        return (
            <View style={this.theme.containers.screen}>
                <Gallery
                    path={this.props.statusSource}
                    dataRefreshRate={Constants.MEDIA_REFRESH_RATE}
                    onPressItem={this.onPressItem}
                    onEnterMultiSelectMode={() => {
                    }}
                    onExitMultiSelectMode={() => {
                    }}
                    onRequestCancelMultiSelect={() => {
                    }}
                    onMultiSelectSelectionChange={() => {
                    }}
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