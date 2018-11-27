import React from 'react';
import { View, Modal, ProgressBarAndroid, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import StatusActionBar from '../widgets/status-actionbar';
import AppComponent from '../app-component';

export default class StatusVideoPlayer extends AppComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            showActions: true
        };
    }

    componentDidMount() {
        setTimeout(() => this.setState({ showActions: false }), 4000)
    }

    onVideoProgress = event => {
        const { currentTime, playableDuration } = event;
        const normalize = (value, min, max) => (value - min) / (max - min);
        this.setState({progress: normalize(currentTime, 0, (currentTime + playableDuration) / 2)})
    }

    render() {
        return (
            <Modal
                hardwareAccelerated={true}
                animationType="slide"
                onRequestClose={this.props.onRequestClose}
                visible={this.props.visible}>

                <View style={{ flex: 1, backgroundColor: 'black' }} >
                    <ProgressBarAndroid
                        ref={'progressBar'}
                        style={{ margin: -6, padding: 0 }}
                        indeterminate={false}
                        styleAttr="Horizontal"
                        color="white"
                        progress={this.state.progress} />
                    <TouchableOpacity
                        onPress={() => this.setState(state => ({ showActions: !state.showActions }))}
                        activeOpacity={1}
                        style={{ flex: 1, justifyContent: 'center' }} >
                        <Video
                            onProgress={this.onVideoProgress}
                            ref={'video'}
                            autoplay={true}
                            loop={true}
                            style={{ flex: 1 }}
                            source={this.props.video}
                            onEnd={() => this.refs.video.seek(0)}
                        />
                    </TouchableOpacity>
                    <View style={{ width: this.state.screenWidth, position: 'absolute', bottom: 0 }}>
                        <StatusActionBar
                            visible={this.state.showActions}
                            onSavePress={this.props.onSavePress}
                            onSharePress={this.props.onSharePress} />
                    </View>
                </View>
            </Modal>


        );
    }
}
