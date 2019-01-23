import React from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {connect} from 'react-redux';

import MediaViewer from '../../components/media-viewer';


export default class StatusViewerScreen extends React.Component {
    constructor(props) {
        super(props);
        const params = props.navigation.getParam('props', null);
        if (!params) throw ('props required for MediaViewer are not present');

        this._props = params;
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={'black'} />
                <MediaViewer
                    {...this._props}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const mapStateToProps = ({whatsapp}) => ({
    data: whatsapp.data
});