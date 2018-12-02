import React, { Component } from 'react';
import { BackHandler, TouchableWithoutFeedback, Vibration } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

import HighlightableView from './highlightable-view';


const contains = (array, item) => {
    for (let i in array) {
        if (array[i] === item) return true;
    }
    return false;
}

const remove = (arr, val) => {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

const isEqual = (arr1, arr2) => {
    if (arr1.length != arr2.length) return false;
    for (let i in arr1) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

export default class MultiSelectFlatlist extends Component {
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
        this.props.onExitMultiSelectMode && this.props.onExitMultiSelectMode()
        this.setState({ multiSelectMode: false, selectedIndexes: [] })
    }

    _enterMultiSelectMode = () => {
        this.props.onEnterMultiSelectMode && this.props.onEnterMultiSelectMode()
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
        if (!this.state.multiSelectMode) this._enterMultiSelectMode();
        this._onPressItemInMultiSelectMode(item.index)
    }

    _onPressItemInMultiSelectMode = index => {
        let newList = []
        if (contains(this.state.selectedIndexes, index)) {
            // selecting the already selected item. so unselect it
            if (this.state.selectedIndexes.length == 1) {
                // if that was the only slected item. exit multiselect mode
                this._exitMultiSelectMode()
            } else {
                newList = remove(this.state.selectedIndexes, index)
            }
        } else {
            // selecting the item for first time. add to selected list
            Vibration.vibrate(10)
            newList = [...this.state.selectedIndexes, index]
        }
        this.props.onSelectionChange && this.props.onSelectionChange(newList)
        this.setState({ selectedIndexes: newList })
    }

    _renderItem = (item) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => this._onPress(item)}
                onLongPress={() => this._onLongPress(item)} >
                <HighlightableView
                    style={this.props.highlightStyle}
                    highlight={this.state.multiSelectMode && contains(this.state.selectedIndexes, item.index)}>
                    {this.props.renderItem(item)}
                </HighlightableView>
            </TouchableWithoutFeedback>
        )
    }

    getSelectedIndexed = () => {
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
        if (!isEqual(this.state.selectedIndexes, prevState.selectedIndexes)) {
            this.props.onSelectionChange && this.props.onSelectionChange(this.state.selectedIndexes)
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

MultiSelectFlatlist.propTypes = {
    onPressItem: PropTypes.func,
    onEnterMultiSelectMode: PropTypes.func,
    onExitMultiSelectMode: PropTypes.func,
    onSelectionChange: PropTypes.func,
    onCancelMultiSelect: PropTypes.func,
    highlightStyle: PropTypes.object
}