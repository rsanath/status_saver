import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class HighlightableView extends Component {

    render() {
        return (
            <View>
                {this.props.children}
                {
                    this.props.highlight ?
                        (
                            <View
                                style={[styles.overlay, {backgroundColor: this.props.highlightColor}]}>
                                <Icon name={this.props.highlightIcon} color={this.props.foregroundColor} size={50}/>
                            </View>
                        ) : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

HighlightableView.propTypes = {
    highlightIcon: PropTypes.string,
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
};

HighlightableView.defaultProps = {
    highlightIcon: 'check',
    foregroundColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
};