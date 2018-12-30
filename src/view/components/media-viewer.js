import React from 'react';
import {View, ViewPagerAndroid, Dimensions, StyleSheet, StatusBar, TouchableWithoutFeedback} from 'react-native';
import PropTypes from 'prop-types';
import Image from 'react-native-fast-image';
import VideoPlayer from '../components/video-player';

import CommonUtils from '../../utils/common-utils';
import SwitchView from "./switch-view";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class MediaViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            swipeEnabled: true
        }
    }

    getMedia = () => {
        return this.props.media.map(path => {
            const type = CommonUtils.getMediaType(path);
            let item = null;
            if (type === 'image') {
                item = this.getImage(path)
            } else if (type === 'video') {
                item = this.getVideo(path)
            }
            return item;
        })
    };

    getImage = path => {
        const toggleControls = () => {
            this.setState(state => {
                return {
                    showImageControls: !state.showImageControls
                }
            })
        };

        return (
            <View style={styles.container} >
                <TouchableWithoutFeedback onPress={toggleControls} >
                    <Image
                        key={path}
                        style={styles.image}
                        resizeMode={'contain'}
                        source={{uri: path}}
                    />
                </TouchableWithoutFeedback>

                <SwitchView visible={this.state.showImageControls} >
                    <View style={styles.header} >
                        {this.props.renderHeader()}
                    </View>
                    <View style={styles.footer} >
                        {this.props.renderFooter()}
                    </View>
                </SwitchView>
            </View>
        )
    };

    getVideo = path => {
        const progressBarStyle = {
            backgroundColor: this.props.videoProgressbarColor
        };
        const customStyles = {
            seekBarKnob: progressBarStyle,
            seekBarProgress: progressBarStyle
        };

        // store the ref of this video when it starts playing
        // use it to stop the playing video when the user swipes to next media.
        let ref = null;

        return (
            <View style={styles.container}>
                <VideoPlayer
                    video={{uri: path}}
                    thumbnail={{uri: path}}
                    style={styles.video}
                    customStyles={customStyles}
                    renderFooter={this.props.renderFooter}
                    renderHeader={this.props.renderHeader}
                    onStart={() => this.setState({currentVideo: ref})}
                    onSeekingEnd={() => this.setState({swipeEnabled: true})}
                    onSeekingStart={() => this.setState({swipeEnabled: false})}
                    autoplay={false}
                    ref={p => ref = p}
                    endWithThumbnail={true}
                    key={path}
                />
            </View>
        )
    };

    onPageSelected = ({position}) => {
        if (this.state.currentVideo) this.state.currentVideo.stop();

        this.props.onPageChange && this.props.onPageChange(position)
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}/>
                <ViewPagerAndroid
                    initialPage={this.props.index}
                    onPageSelected={this.onPageSelected}
                    scrollEnabled={this.state.swipeEnabled}
                    style={[styles.container, this.props.containerStyle]}>
                    {this.getMedia()}
                </ViewPagerAndroid>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'black'
    },
    video: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'black'
    },
    header: {
        height: 50,
        width: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
    },
    footer: {
        height: 50,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
    },
    progressBar: {
        backgroundColor: 'blue'
    }
});

MediaViewer.propTypes = {
    media: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    containerStyle: PropTypes.object,
    fallbackComponent: PropTypes.instanceOf(React.Component),
    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    videoProgressbarColor: PropTypes.color,
    index: PropTypes.number,
    onPageChange: PropTypes.func
};

MediaViewer.defaultProps = {
    renderFooter: () => null,
    renderHeader: () => null,
    fallbackComponent: null,
    videoProgressbarColor: 'white',
    index: 0
};