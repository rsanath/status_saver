'use strict';

import React from 'react';
import {
    View,
    Image,
    RefreshControl,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import AppComponent from '../app-component';
import MultiSelectFlatList from './multi-select-flatlist';
import ContextualActionBar from './contextual-toolbar';
import SwitchView from './switch-view';
import { listContent } from '../../helpers/file-system-helper';


export default class MediaViewer extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: [],
            multiSelectMode: false,
            selectedIndex: []
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
    };

    getRefreshControl = () => {
        return (
            <RefreshControl
                colors={[this.theme.colors.secondary]}
                onRefresh={this.refreshData}
                refreshing={this.state.fetchingData}
            />
        )
    };

    refreshData = async () => {
        this.setState({ fetchingData: true });

        let data = await listContent(this.props.path);
        data = this.props.filterData(data);

        this.setState({ fetchingData: false, data })
    };

    fetchData = async () => {
        if (this.state.fetchingData) return;

        let data = await listContent(this.props.path);
        data = this.props.filterData(data);

        this.setState({ data });
    };

    onEnterMultiSelectMode = () => {
        this.setState({ multiSelectMode: true })
        this.props.onEnterMultiSelectMode()
    };

    onExitMultiSelectMode = () => {
        this.setState({ multiSelectMode: false })
        this.props.onExitMultiSelectMode()
    };

    onSelectionChange = selectedIndex => {
        this.setState({ selectedIndex })
        const selectedItems = selectedIndex.map(i => this.state.data[i])
        this.props.onMultiSelectSelectionChange(selectedItems)
    };

    onRequestCancel = () => {
        this.exitMultiSelectMode()
    };

    onMultiSelectActionPressed = () => {
        this.exitMultiSelectMode()
    };

    exitMultiSelectMode = () => {
        this.setState({ multiSelectMode: false, selectedIndex: [] })
        this.refs.multiSelectList.finishMultiSelectMode()
        this.props.onRequestCancelMultiSelect()
    };

    getSelectedItems = () => this.state.selectedIndex.map(i => this.state.data[i])

    getMultiSelectAction = () => {
        return this.props.multiSelectActions.map(action => {
            let onPress = () => {
                action.onPress(this.getSelectedItems())
                this.refs.multiSelectList.finishMultiSelectMode()
            }
            return {
                iconName: action.iconName,
                onPress: onPress
            }
        })
    };

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
        const { multiSelectActionsStyle } = this.props;

        return (
            <View style={styles.container}>

                <SwitchView visible={this.state.multiSelectMode} >
                    <ContextualActionBar
                        iconSize={multiSelectActionsStyle.iconSize}
                        foregroundColor={multiSelectActionsStyle.foregroundColor}
                        backgroundColor={multiSelectActionsStyle.backgroundColor}
                        onRequestCancel={this.onRequestCancel}
                        count={this.state.selectedIndex.length}
                        actions={this.getMultiSelectAction()}
                        onActionPressed={this.onMultiSelectActionPressed}
                    />
                </SwitchView>

                <SwitchView visible={this.state.data != null}>
                    <MultiSelectFlatList
                        ref={'multiSelectList'}
                        onEnterMultiSelectMode={this.onEnterMultiSelectMode}
                        onExitMultiSelectMode={this.onExitMultiSelectMode}
                        onSelectionChange={this.onSelectionChange}
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
    filterData: PropTypes.func,
    onEnterMultiSelectMode: PropTypes.func.isRequired,
    onExitMultiSelectMode: PropTypes.func.isRequired,
    onRequestCancelMultiSelect: PropTypes.func.isRequired,
    onMultiSelectSelectionChange: PropTypes.func.isRequired,
    dataRefreshRate: PropTypes.number,
    NoMediaComponent: PropTypes.instanceOf(React.Component),
    multiSelectActions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    })),
    multiSelectActionsStyle: PropTypes.shape({
        foregroundColor: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        iconSize: PropTypes.number
    })
};

MediaViewer.defaultProps = {
    dataRefreshRate: 5000, // should get from a config file later
    filterData: data => data,
    NoMediaComponent: null,
    multiSelectActions: [],
    onRequestCancelMultiSelect: () => { },
    onMultiSelectSelectionChange: () => { },
    multiSelectActionsStyle: {}
}