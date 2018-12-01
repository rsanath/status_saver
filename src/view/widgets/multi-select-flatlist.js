import React, { Component } from 'react';
import { BackHandler, View, TouchableWithoutFeedback, Vibration } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
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
        console.log('back button. exit multiselect')
        this.props.onCancelMultiSelect && this.props.onCancelMultiSelect()
        this._exitMultiSelectMode()
        return true
    }

    _exitMultiSelectMode = () => {
        console.log('multi select mdoe OFF')
        this.setState({ multiSelectMode: false, selectedIndexes: [] })
    }

    _enterMultiSelectMode = () => {
        Vibration.vibrate(100)
        console.log('multi select mdoe ON')
        this.setState({ multiSelectMode: true })
    }

    _onPress = item => {
        if (this.state.multiSelectMode) {
            this._onPressItemInMultiSelectMode(item.index)
        } else {
            this.props.onPressItem && this.props.onPressItem(item)
        }
    }

    _onPressItemInMultiSelectMode = index => {
        if (contains(this.state.selectedIndexes, index)) {
            this.setState(state => {
                return {
                    selectedIndexes: remove(state.selectedIndexes, index)
                }
            })
        } else {
            Vibration.vibrate(10)
            this.setState(state => {
                return {
                    selectedIndexes: [...state.selectedIndexes, index]
                }
            })
        }
    }

    _onLongPress = item => {
        if (!this.state.multiSelectMode) this._enterMultiSelectMode();
        this._onPressItemInMultiSelectMode(item.index)
    }

    _renderItem = (item) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => this._onPress(item)}
                onLongPress={() => this._onLongPress(item)} >
                <HighlightableView
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