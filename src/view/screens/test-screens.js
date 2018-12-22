import React from 'react';
import { View } from 'react-native';
import MediaViewer from '../components/media-viewer';

export default class TestScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }} >
                <MediaViewer
                    multiSelectActions={[{iconName: 'home', onPress: d => console.log(d)}]}
                    onEnterMultiSelectMode={() => { }}
                    onExitMultiSelectMode={() => { }}
                    onSelectionChange={() => { }}
                    path={'/sdcard/WhatsApp/Media/.Statuses'}
                />
            </View>
        )
    }
}