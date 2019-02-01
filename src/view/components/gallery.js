'use strict';

import React from 'react';
import {
    View,
    RefreshControl,
    StyleSheet,
    Text,
    Image
} from 'react-native';
import PropTypes from 'prop-types';

import AppComponent from '../app-component';
import MultiSelectFlatList from './multi-select-flatlist';
import ContextualActionBar from './contextual-toolbar';
import SwitchView from './switch-view';
import {listContent} from '../../helpers/file-system-helper';
import CommonUtil from "../../utils/common-utils";
import Icon from "./widgets/icon";


export default class Gallery extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: [],
            multiSelectMode: false,
            selectedIndex: [],
            // in order to show no status icon after the first try
            firstTimeDataFetched: false
        };
    }

    renderThumbnail = ({item, index}) => {
        const size = this.state.screenWidth / (this.isPortrait() ? 3 : 4) - 4;
        const thumbnailStyle = {width: size, height: size};

        const isVideo = CommonUtil.getMediaType(item) === 'video';

        return (
            isVideo ? (
                <View>
                    <Image
                        source={{uri: item}}
                        style={[thumbnailStyle, styles.thumbnail]}/>
                    <Image style={styles.videoIndicatorIcon} source={require('../../assets/images/videocam.png')}/>
                </View>
            ) : (
                <Image
                    source={{uri: item}}
                    style={[thumbnailStyle, styles.thumbnail]}/>
            )
        )
    };

    onPressItem = ({item, index}) => {
        this.props.onPressItem && this.props.onPressItem(this.state.data[index], index, this.state.data)
    };

    _refreshData = async () => {
        if (!this.props.path) return;
        this.setState({fetchingData: true});

        let data = await listContent(this.props.path);
        data = this.props.filterData(data);

        if (!this.state.data.equals(data)) {
            this.setState({data});
            this.props.onDataChange && this.props.onDataChange(data)
        }
        this.setState({fetchingData: false})
    };

    fetchData = () => {
        if (this.state.fetchingData) return;
        if (!this.props.path) return;

        listContent(this.props.path)
            .then(data => {
                data = this.props.filterData(data);

                if (!this.state.data.equals(data)) {
                    this.setState({data, firstTimeDataFetched: true});
                    this.props.onDataChange && this.props.onDataChange(data)
                }
            })
            .catch(e => {
                this.setState({data: []});
            })
    };

    onEnterMultiSelectMode = () => {
        this.setState({multiSelectMode: true});
        this.props.onEnterMultiSelectMode()
    };

    onExitMultiSelectMode = () => {
        this.setState({multiSelectMode: false});
        this.props.onExitMultiSelectMode()
    };

    onSelectionChange = selectedIndex => {
        this.setState({selectedIndex});
        const selectedItems = selectedIndex.map(i => this.state.data[i]);
        this.props.onMultiSelectSelectionChange(selectedItems)
    };

    onRequestCancel = () => {
        this.exitMultiSelectMode()
    };

    onMultiSelectActionPressed = () => {
        this.exitMultiSelectMode()
    };

    exitMultiSelectMode = () => {
        this.setState({multiSelectMode: false, selectedIndex: []});
        this.refs.multiSelectList.finishMultiSelectMode();
        this.props.onRequestCancelMultiSelect()
    };

    getSelectedItems = () => this.state.selectedIndex.map(i => this.state.data[i]);

    getMultiSelectAction = () => {
        return this.props.multiSelectActions.map(action => {
            let onPress = () => {
                action.onPress(this.getSelectedItems());
                this.refs.multiSelectList.finishMultiSelectMode()
            };
            return {
                iconName: action.iconName,
                onPress: onPress
            }
        })
    };

    async componentDidMount() {
        await this.fetchData();

        const autoRefresh = setInterval(this.fetchData, this.props.dataRefreshRate);
        this.setState({autoRefresh});
    }

    componentWillUnmount() {
        clearInterval(this.state.autoRefresh)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.path != prevProps.path) {
            this.fetchData();
        }
    }


    renderRefreshControl = () => {
        return (
            <RefreshControl
                colors={this.props.refreshColor}
                onRefresh={this._refreshData}
                refreshing={this.state.fetchingData}
            />
        )
    };

    render() {
        const showNoMediaMessage = this.state.firstTimeDataFetched && this.state.data.length <= 0;

        return (
            <View
                style={[this.props.containerStyle, styles.container]}>
                <SwitchView visible={this.state.multiSelectMode}>
                    <ContextualActionBar
                        onRequestCancel={this.onRequestCancel}
                        count={this.state.selectedIndex.length}
                        actions={this.getMultiSelectAction()}
                        onActionPressed={this.onMultiSelectActionPressed}
                        {...this.props.contextualActionBarProps}
                    />
                </SwitchView>

                <SwitchView visible={this.state.data != null}>
                    <MultiSelectFlatList
                        data={this.state.data.map(d => 'file://' + d)}
                        renderItem={this.renderThumbnail}
                        numColumns={this.isPortrait() ? 3 : 4}
                        onPressItem={this.onPressItem}
                        ref={'multiSelectList'}
                        refreshControl={this.renderRefreshControl()}
                        onEnterMultiSelectMode={this.onEnterMultiSelectMode}
                        onExitMultiSelectMode={this.onExitMultiSelectMode}
                        onSelectionChange={this.onSelectionChange}
                        contentContainerStyle={{marginHorizontal: 2}}
                        key={this.state.orientation}
                        keyExtrator={({item}) => item}
                        highlightableViewProps={this.props.highlightableViewProps}
                    />
                </SwitchView>

                <SwitchView visible={showNoMediaMessage}>
                    <View style={styles.noMedia}>
                        {this.props.NoMediaComponent}
                    </View>
                </SwitchView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mediaViewer: {
        flex: 1,
        backgroundColor: 'black'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    videoIndicatorIcon: {
        height: 30,
        width: 30,
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 10
    },
    thumbnail: {
        margin: 2,
        backgroundColor: 'white',
        borderRadius: 3
    },
    videoIndicator: {
        borderWidth: 1,
        borderColor: 'black',
        elevation: 5
    },
    headerContainer: {
        flex: 1,
        paddingHorizontal: 15,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    noMedia: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

Gallery.propTypes = {
    path: PropTypes.string.isRequired,
    filterData: PropTypes.func,
    onDataChange: PropTypes.func,
    onEnterMultiSelectMode: PropTypes.func.isRequired,
    onExitMultiSelectMode: PropTypes.func.isRequired,
    onRequestCancelMultiSelect: PropTypes.func.isRequired,
    onMultiSelectSelectionChange: PropTypes.func.isRequired,
    dataRefreshRate: PropTypes.number,
    NoMediaComponent: PropTypes.any,
    multiselectActionBarStyle: PropTypes.object,
    multiSelectActions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    })),
    immersiveMode: PropTypes.bool,
    hideStatusbar: PropTypes.bool,
    onPressItem: PropTypes.func,
    refreshColor: PropTypes.arrayOf(PropTypes.string),
    contextualActionBarProps: PropTypes.object
};

Gallery.defaultProps = {
    dataRefreshRate: 5000, // should get from a config file later
    filterData: data => data,
    NoMediaComponent: null,
    multiSelectActions: [],
    onRequestCancelMultiSelect: () => {
    },
    onMultiSelectSelectionChange: () => {
    },
    immersiveMode: false,
    hideStatusbar: false
};