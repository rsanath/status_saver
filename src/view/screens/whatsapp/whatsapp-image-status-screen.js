import React from 'react';
import {
    View
} from 'react-native';

import { connect } from 'react-redux';

import AppComponent from '../../app-component';
import MediaViewer from '../../components/media-viewer';
import Constants from "../../../constants";


class WhatsAppImageStatusScreen extends AppComponent {

    render() {
        return (
            <View style={this.theme.containers.screen}>
                <MediaViewer
                    path={this.props.path}
                    dataRefreshRate={Constants.MEDIA_REFRESH_RATE}
                    onEnterMultiSelectMode={this.props.onEnterMultiSelectMode}
                    onExitMultiSelectMode={}
                    onRequestCancelMultiSelect={}
                    onMultiSelectSelectionChange={}
                />
            </View>
        );
    }
}

const mapStateToProps = ({ status }) => ({ ...status });

export default connect(mapStateToProps)(ImagesScreen);