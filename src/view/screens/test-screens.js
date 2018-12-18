import React from 'react';
import { View } from 'react-native';
import MediaViewer from './whatsapp/status-screen/media-viewer';

export default class TestScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }} >
                <MediaViewer
                    onEnterMultiSelectMode={() => { }}
                    onExitMultiSelectMode={() => { }}
                    onSelectionChange={() => { }}
                    path={'/sdcard/WhatsApp/Media/.Statuses'}
                />
            </View>
        )
    }
}