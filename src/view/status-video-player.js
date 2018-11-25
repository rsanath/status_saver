import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import Video from 'react-native-video-player';
import StatusActionBar from './status-actionbar';
import { getHeightForFullWidth, toast } from '../helpers/app-helper';

export default class StatusVideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showActions: true,
            screenWidth: Dimensions.get('window').width
        };
    }

    componentDidMount() {
        this.refs.videoContainer.measure(
            (ox, oy, width, height, px, py) => {
                this.setState({ vidContainerHeight: height })
            }
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }} >
                <View ref={'videoContainer'} style={{ flex: 1, justifyContent: 'center' }} >
                    <Video
                        autoplay={true}
                        resizeMode={'contain'}
                        onHideControls={() => this.setState({ showActions: false })}
                        onShowControls={() => this.setState({ showActions: true })}
                        videoWidth={this.state.screenWidth}
                        videoHeight={this.state.vidContainerHeight}
                        loop={true}
                        video={this.props.video}
                        onLoad={response => {
                            const { width, height } = response.naturalSize;
                            const videoHeight = getHeightForFullWidth(width, height)
                            this.setState({ videoHeight });
                        }}
                    />
                </View>
                <View style={{ width: this.state.screenWidth }}>
                    <StatusActionBar
                        visible={true}
                        onSavePress={this.props.onSavePress}
                        onSharePress={this.props.onSharePress} />
                </View>
            </View>
        );
    }
}
