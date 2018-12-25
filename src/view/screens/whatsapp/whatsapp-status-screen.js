import React from 'react';
import {
    View
} from 'react-native';

import { connect } from 'react-redux';

import AppComponent from '../../app-component';
import MediaViewer from '../../components/media-viewer';
import Constants from "../../../constants";


class WhatsAppStatusScreen extends AppComponent {

    render() {
        return (
            <View style={this.theme.containers.screen}>
                <MediaViewer
                    path={this.props.statusSource}
                    dataRefreshRate={Constants.MEDIA_REFRESH_RATE}
                    onEnterMultiSelectMode={this.props.onEnterMultiSelectMode}
                    onExitMultiSelectMode={() => {}}
                    onRequestCancelMultiSelect={() => {}}
                    onMultiSelectSelectionChange={() => {}}
                />
            </View>
        );
    }
}

const mapStateToProps = ({whatsapp}) => ({...whatsapp});

export default connect(mapStateToProps)(WhatsAppStatusScreen);