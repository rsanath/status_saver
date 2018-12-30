import React from 'react';
import {
    View
} from 'react-native';

import { connect } from 'react-redux';

import AppComponent from '../../app-component';
import MediaLister from '../../components/media-lister';
import Constants from "../../../constants";


class WhatsAppStatusScreen extends AppComponent {

    render() {

        console.log(this.props.statusSource)

        return (
            <View style={this.theme.containers.screen}>
                <MediaLister
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