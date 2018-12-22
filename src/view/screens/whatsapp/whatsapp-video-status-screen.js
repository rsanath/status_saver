import React from 'react';
import {
    View
} from 'react-native';

import { connect } from 'react-redux';

import AppComponent from '../../app-component';


class VideoScreen extends AppComponent {

    render() {
        return (
            <View style={this.theme.containers.screen}>

            </View >
        );
    }
}

const mapStateToProps = ({ status }) => ({ ...status });

export default connect(mapStateToProps)(VideoScreen);