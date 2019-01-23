import React, { Component } from 'react';
import { BackHandler, TouchableWithoutFeedback, Vibration } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import HighlightableView from './highlightable-view';


Array.prototype.contains = function(item) {
    for (let i in this) {
        if (this[i] === item) return true;
    }
    return false;
};

Array.prototype.remove = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

Array.prototype.equals = function(arr) {
    if (this.length != arr.length) return false;
    for (let i in this) {
        if (this[i] != arr[i]) {
            return false;
        }
    }
    return true;
};

export default class MultiSelectFlatList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            multiSelectMode: false,
            selectedIndexes: []
        };
    }

    _onBackButtonPressAndroid = () => {
        this.props.onCancelMultiSelect && this.props.onCancelMultiSelect()
        if (this.state.multiSelectMode) {
            this._exitMultiSelectMode()
            return true
        } else {
            return false
        }

    }

    _exitMultiSelectMode = () => {
        this.props.onExitMultiSelectMode()
        this.setState({ multiSelectMode: false, selectedIndexes: [] })
    }

    _enterMultiSelectMode = () => {
        Vibration.vibrate(10)
        this.props.onEnterMultiSelectMode()
        this.setState({ multiSelectMode: true })
    }

    _onPress = item => {
        if (this.state.multiSelectMode) {
            this._onPressItemInMultiSelectMode(item.index)
        } else {
            this.props.onPressItem && this.props.onPressItem(item)
        }
    }

    _onLongPress = item => {
        if (!this.props.multiSelectEnabled) return;

        if (!this.state.multiSelectMode) this._enterMultiSelectMode();
        this._onPressItemInMultiSelectMode(item.index)
    }

    _onPressItemInMultiSelectMode = index => {
        const {selectedIndexes} = this.state;

        let newList = []
        if (selectedIndexes.contains(index)) {
            // selecting the already selected item. so unselect it
            if (selectedIndexes.length == 1) {
                // if that was the only slected item. exit multiselect mode
                this._exitMultiSelectMode()
            } else {
                newList = selectedIndexes.remove(index)
            }
        } else {
            // selecting the item for first time. add to selected list
            newList = [...selectedIndexes, index]
        }
        this.props.onSelectionChange && this.props.onSelectionChange(newList)
        this.setState({ selectedIndexes: newList })
    }

    _renderItem = (item) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => this._onPress(item)}
                onLongPress={() => this._onLongPress(item)}
            >
                <HighlightableView
                    style={this.props.highlightStyle}
                    highlight={this.state.multiSelectMode && this.state.selectedIndexes.contains(item.index)}>
                    {this.props.renderItem(item)}
                </HighlightableView>
            </TouchableWithoutFeedback>
        )
    }

    getSelectedIndexes = () => {
        return this.state.selectedIndexes
    }

    finishMultiSelectMode = () => {
        const { selectedIndexes } = this.state
        this._exitMultiSelectMode()
        return selectedIndexes
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onBackButtonPressAndroid)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {selectedIndexes} = this.state;

        if (!selectedIndexes.equals(prevState.selectedIndexes)) {
            this.props.onSelectionChange(this.state.selectedIndexes)
        }
    }

    render() {
        return (
            <FlatList
                extraData={this.state.selectedIndexes}
                {...this.props}
                renderItem={this._renderItem}
            />
        );
    }
}

MultiSelectFlatList.propTypes = {
    onPressItem: PropTypes.func,
    onEnterMultiSelectMode: PropTypes.func,
    onExitMultiSelectMode: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onCancelMultiSelect: PropTypes.func,
    highlightStyle: PropTypes.object,
    multiSelectEnabled: PropTypes.bool,
    vibrationsEnabled: PropTypes.bool
}

MultiSelectFlatList.defaultProps = {
    onEnterMultiSelectMode: () => {},
    onExitMultiSelectMode: () => {},
    onSelectionChange: () => {},
    multiSelectEnabled: true,
    vibrationsEnabled: true
}