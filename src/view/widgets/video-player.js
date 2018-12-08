import React from 'react';
import { View, ProgressBarAndroid, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import PropTypes from 'prop-types';

import AppComponent from '../app-component';


export default class VideoPlayer extends AppComponent {

    onVideoProgress = event => {
        const { currentTime, playableDuration } = event;
        const normalize = (value, min, max) => (value - min) / (max - min);
        this.setState({ progress: normalize(currentTime, 0, (currentTime + playableDuration) / 2) })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }} >
                <ProgressBarAndroid
                    ref={'progressBar'}
                    style={{ margin: -6, padding: 0 }}
                    indeterminate={false}
                    styleAttr="Horizontal"
                    color={this.props.progressColor || 'white'}
                    progress={this.state.progress} />
                <TouchableOpacity
                    onPress={this.props.onPressVideo}
                    activeOpacity={1}
                    style={{ flex: 1, justifyContent: 'center' }} >
                    <Video
                        onProgress={this.onVideoProgress}
                        ref={'video'}
                        autoplay={true}
                        loop={true}
                        style={{ flex: 1 }}
                        source={this.props.video}
                        paused={this.props.paused}
                        onEnd={() => {
                            if (this.props.loop) this.refs.video.seek(0)
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

VideoPlayer.propTypes = {
    onPressVideo: PropTypes.func,
    paused: PropTypes.bool,
    loop: PropTypes.bool,
    progressColor: PropTypes.string,
    video: PropTypes.shape({
        uri: PropTypes.string
    })
}