'use strict';

import React from 'react';
import {
    View,
    RefreshControl,
    StyleSheet,
    ImageBackground,
    Modal
} from 'react-native';
import PropTypes from 'prop-types';
import Image from 'react-native-fast-image';

import AppComponent from '../app-component';
import MultiSelectFlatList from './multi-select-flatlist';
import ContextualActionBar from './contextual-toolbar';
import SwitchView from './switch-view';
import {listContent} from '../../helpers/file-system-helper';
import CommonUtil from "../../utils/common-utils";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


export default class Gallery extends AppComponent {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            data: [],
            multiSelectMode: false,
            selectedIndex: []
        };
    }

    renderThumbnail = ({item, index}) => {
        const size = this.state.screenWidth / (this.isPortrait() ? 2 : 4) - 4;
        const thumbnailStyle = {width: size, height: size};

        const isVideo = CommonUtil.getMediaType(item) === 'video';

        return (
            isVideo ? (
                <View>
                    <Image
                        source={{uri: item}}
                        style={[thumbnailStyle, styles.thumbnail]}/>
                    <Icon style={styles.videoIndicatorIcon} color={'#fff'} size={30} name={'video'}/>
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
        this.setState({fetchingData: true});

        let data = await listContent(this.props.path);
        data = this.props.filterData(data);

        if (!this.state.data.equals(data)) {
            this.setState({data});
            this.props.onDataChange && this.props.onDataChange(data)
        }
        this.setState({fetchingData: false})
    };

    fetchData = async () => {
        if (this.state.fetchingData) return;

        let data = await listContent(this.props.path);
        data = this.props.filterData(data);

        if (!this.state.data.equals(data)) {
            this.setState({data});
            this.props.onDataChange && this.props.onDataChange(data)
        }
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

    render() {
        const showNoMediaMessage = this.state.data && this.state.data.length > 0;
        const {multiSelectActionsStyle} = this.props;
        const iconSize = multiSelectActionsStyle ? multiSelectActionsStyle.iconSize : 30;
        const foregroundColor = multiSelectActionsStyle ? multiSelectActionsStyle.foregroundColor : 'white';
        const backgroundColor = multiSelectActionsStyle ? multiSelectActionsStyle.backgroundColor : 'black';

        return (
            <View style={styles.container}>
                <SwitchView visible={this.state.multiSelectMode}>
                    <ContextualActionBar
                        iconSize={iconSize}
                        foregroundColor={foregroundColor}
                        backgroundColor={backgroundColor}
                        onRequestCancel={this.onRequestCancel}
                        count={this.state.selectedIndex.length}
                        actions={this.getMultiSelectAction()}
                        onActionPressed={this.onMultiSelectActionPressed}
                    />
                </SwitchView>

                <SwitchView visible={this.state.data != null}>
                    <MultiSelectFlatList
                        data={this.state.data.map(d => 'file://' + d)}
                        renderItem={this.renderThumbnail}
                        numColumns={this.isPortrait() ? 2 : 4}
                        onPressItem={this.onPressItem}
                        ref={'multiSelectList'}
                        refreshControl={this.getRefreshControl()}
                        onEnterMultiSelectMode={this.onEnterMultiSelectMode}
                        onExitMultiSelectMode={this.onExitMultiSelectMode}
                        onSelectionChange={this.onSelectionChange}
                        contentContainerStyle={{marginHorizontal: 2}}
                        key={this.state.orientation}
                        keyExtrator={({item}) => item}
                    />
                </SwitchView>

                <SwitchView visible={showNoMediaMessage}>
                    <View style={{position: 'absolute', bottom: this.state.screenWidth / 2}}>
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
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    thumbnail: {
        margin: 1,
        backgroundColor: 'white',
        borderRadius: 10
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
    NoMediaComponent: PropTypes.instanceOf(React.Component),
    multiSelectActions: PropTypes.arrayOf(PropTypes.shape({
        iconName: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    })),
    multiSelectActionsStyle: PropTypes.shape({
        foregroundColor: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        iconSize: PropTypes.number
    }),
    immersiveMode: PropTypes.bool,
    hideStatusbar: PropTypes.bool,
    onPressItem: PropTypes.func
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