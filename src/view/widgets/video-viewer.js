import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import AppComponent from '../app-component';
import VideoPlayer from '../widgets/video-player';


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

    renderHeader = () => {
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                flexDirection: 'row',
            }} >
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={this.props.onRequestClose} >
                    <Icon name={'close'} color={'white'} size={25} />
                </TouchableOpacity>
            </View>
        )
    }

    renderFooter = () => {
        if (!this.props.renderFooter || !this.state.showActions) return null;

        return (
            <View style={{ position: 'absolute', bottom: 0 }} >
                {this.props.renderFooter()}
            </View>
        )
    }

    render() {
        return (
            <Modal
                onRequestClose={this.props.onRequestClose}
                visible={this.props.visible} >
                <View style={{ flex: 1 }} >
                    {this.renderHeader()}
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
                    {this.renderFooter()}
                </View>
            </Modal>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'black'
    }
}

VideoViewer.propTypes = {
    autoPlay: PropTypes.bool,
    videos: PropTypes.arrayOf(PropTypes.string).isRequired,
    visible: PropTypes.bool.isRequired,
    footerComponent: PropTypes.object
}