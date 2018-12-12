import React from 'react';
import { View, Modal } from 'react-native';
import Swiper from 'react-native-swiper';
import PropTypes from 'prop-types';

import AppComponent from '../app-component';
import VideoPlayer from '../widgets/video-player';
import SwitchView from './switch-view';


export default class VideoViewer extends AppComponent {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            showActions: true
        }
    }

    onIndexChanged = index => {
        this.setState({ index })
        this.props.onIndexChanged && this.props.onIndexChanged(index)
    }

    getVideos = () => {
        return this.props.videos.map((source, index) => {
            const onPress = () => {
                this.props.onPressVideo && this.props.onPressVideo(index)
                this.setState({ showActions: !this.state.showActions })
            }

            if (this.props.index != index) return null;

            return (
                <VideoPlayer
                    key={source}
                    paused={this.props.index != index}
                    onPressVideo={onPress}
                    video={{ uri: source }} />
            )
        })
    }

    render() {
        return (
            <Modal
                onRequestClose={this.props.onRequestClose}
                visible={this.props.visible} >
                <View style={{ flex: 1 }} >
                    <Swiper
                        loadMinimal={true}
                        ref={'swiper'}
                        showsPagination={false}
                        width={this.screenWidth}
                        height={this.screenHeight}
                        containerStyle={styles.containerStyle}
                        loop={this.props.loop || false}
                        onIndexChanged={this.onIndexChanged}
                        index={this.props.index || 0}
                        showsButtons={false}>
                        {this.getVideos()}
                    </Swiper>

                    <SwitchView visible={this.props.renderFooter} >
                        <View style={styles.footer}>
                            {this.props.renderFooter && this.props.renderFooter()}
                        </View>
                    </SwitchView>

                    <SwitchView visible={this.props.renderHeader} >
                        <View style={styles.header}>
                            {this.props.renderHeader && this.props.renderHeader()}
                        </View>
                    </SwitchView>

                </View>
            </Modal>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {
        position: 'absolute',
        top: 0,
    },
    footer: {
        position: 'absolute',
        bottom: 0
    }
}

VideoViewer.propTypes = {
    autoPlay: PropTypes.bool,
    videos: PropTypes.arrayOf(PropTypes.string).isRequired,
    visible: PropTypes.bool.isRequired,
    footerComponent: PropTypes.object
}