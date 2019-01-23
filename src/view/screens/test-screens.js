import React from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import AppComponent from '../app-component';
import MediaViewer from "../components/media-viewer";
import {listContent} from "../../helpers/file-system-helper";
import Constants from "../../constants";
import SwitchView from "../components/switch-view";
import IconButton from "../components/widgets/icon-button";
import Gallery from '../components/gallery';

export default class TestScreen extends AppComponent {

    componentDidMount(): void {
        listContent(Constants.WHATSAPP_BUSINESS_STATUS_PATH)
            .then(items => this.setState({data: items.map(i => 'file://' + i)}))
    }

    renderHeader = () => {
        return (
            <View style={styles.header}>
                <IconButton name={'share'} size={30} color={'white'} onPress={() => alert('on save press')}/>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>

                <Gallery
                    onEnterMultiSelectMode={() => {
                    }}
                    onExitMultiSelectMode={() => {
                    }}
                    multiSelectActionsStyle={{foregroundColor: 'white', backgroundColor: this.theme.colors.secondary}}
                    NoMediaComponent={<Text>ape</Text>}
                    path={Constants.WHATSAPP_STATUS_PATH}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'black',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10
    }
});