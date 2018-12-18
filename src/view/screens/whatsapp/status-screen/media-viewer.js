'use strict';

import React from 'react';
import {
    View,
    Image,
    RefreshControl,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import AppComponent from '../../../app-component';
import MultiSelectFlatList from '../../../components/multi-select-flatlist';
import ContextualActionBar from '../../../components/contextual-toolbar';
import SwitchView from '../../../components/switch-view';
import { listContent } from '../../../../helpers/file-system-helper';


export default class MediaViewer extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: [],
            multiSelectMode: false,
            selectedItems: []
        };
    }

    renderThumbnail = ({ item, index }) => {
        const size = this.state.screenWidth / (this.isPortrait() ? 2 : 4);
        const thumbnailStyle = { width: size, height: size };

        return (
            <Image
                source={{ uri: item }}
                style={thumbnailStyle} />
        )
    }

    getRefreshControl = () => {
        return (
            <RefreshControl
                colors={[this.theme.colors.secondary]}
                onRefresh={this.fetchData}
                refreshing={this.state.fetchingData}
            />
        )
    }

    fetchData = async () => {
        this.setState({ fetchingData: true });
        const data = await listContent(this.props.path);
        this.setState({ data, fetchingData: false })
    };

    onEnterMultiSelectMode = () => {
        this.setState({ multiSelectMode: true })
        this.props.onEnterMultiSelectMode()
    }

    onExitMultiSelectMode = () => {
        this.setState({ multiSelectMode: false })
    }

    onSelectionChange = selectedIndex => {
        this.setState({ selectedIndex })
        const selectedItems = selectedIndex.map(i => this.state.data[i])
        this.props.onSelectionChange(selectedItems)
    }

    async componentDidMount() {
        await this.fetchData();

        const autoRefresh = setInterval(this.fetchData, this.props.dataRefreshRate);
        this.setState({ autoRefresh });
    }

    componentWillUnmount() {
        clearInterval(this.state.autoRefresh)
    }

    render() {
        const showNoMediaMessage = this.state.data && this.state.data.length > 0

        return (
            <View style={styles.container}>
            
                <SwitchView visible={this.state.multiSelectMode} >
                    <ContextualActionBar
                        onRequestCancel={() => { }}
                        selectedCount={this.state.selectedItems.length}
                        actions={this.props.multiSelectActions} />
                </SwitchView>

                <SwitchView visible={this.state.data != null}>
                    <MultiSelectFlatList
                        ref={'multiSelectList'}
                        style={{ marginTop: this.state.multiSelectMode ? 54 : 0 }}
                        onExitMultiSelectMode={this.props.onExitMultiSelectMode}
                        key={this.state.orientation}
                        numColumns={this.isPortrait() ? 2 : 4}
                        data={this.state.data.map(d => 'file://' + d)}
                        keyExtrator={({ item }) => item}
                        renderItem={this.renderThumbnail}
                        refreshControl={this.getRefreshControl()}
                    />
                </SwitchView>

                <SwitchView visible={showNoMediaMessage}>
                    <View style={{ position: 'absolute', bottom: this.state.screenWidth / 2 }}>
                        {this.props.NoMediaComponent}
                    </View>
                </SwitchView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

MediaViewer.propTypes = {
    path: PropTypes.string.isRequired,
    onEnterMultiSelectMode: PropTypes.func.isRequired,
    onExitMultiSelectMode: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func.isRequired,
    dataRefreshRate: PropTypes.number,
    NoMediaComponent: PropTypes.instanceOf(React.Component),
    multiSelectActions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    }))
};

MediaViewer.defaultProps = {
    dataRefreshRate: 5000, // should get from a config file later
    NoMediaComponent: null,
    multiSelectActions: []
}