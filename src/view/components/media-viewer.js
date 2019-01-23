import React from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import Image from 'react-native-fast-image';
import VideoPlayer from '../components/video-player';

import CommonUtils from '../../utils/common-utils';
import SwitchView from "./switch-view";
import FadeView from "./fade-view";
import ViewUtil from "../../native-modules/view-util";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const NAVBAR_HEIGHT = Dimensions.get('screen').height - Dimensions.get('window').height;

const HEADER_HEIGHT = 50;

export default class MediaViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            swipeEnabled: true,
            showHeaderFooter: true,
            currentPosition: 0,
            currentVideo: null
        }
    }

    getItemLayout = (data, index) => {
        return {length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index}
    };

    componentDidMount() {
        if (this.props.immersiveMode) {
            ViewUtil.enterFullScreen();
        }
    }

    componentWillUnmount() {
        if (this.props.immersiveMode) {
            ViewUtil.disableFullScreen();
        }
    }

    renderItem = ({item, index}) => {
        const type = CommonUtils.getMediaType(item);

        let media = null;

        if (type === 'image') {
            media = this.renderImage(item, index)
        } else if (type === 'video') {
            media = this.renderVideo(item, index)
        }

        return (
            <TouchableWithoutFeedback key={item} onPress={this.toggleHeaderFooter}>
                <View key={item} style={styles.container}>
                    {media}
                    {this.renderHeaderFooter(item, index)}
                </View>
            </TouchableWithoutFeedback>
        )
    };

    renderImage = (path, index) => {
        return (
            <Image
                key={path}
                style={[styles.image]}
                resizeMode={'contain'}
                source={{uri: 'file://' + path}}
            />
        )
    };

    renderVideo = (path, index) => {
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

        const uri = {uri: 'file://' + path};

        return (
            <VideoPlayer
                video={uri}
                thumbnail={uri}
                style={[styles.video]}
                customStyles={customStyles}
                renderFooter={() => this.props.renderFooter(path, index)}
                renderHeader={() => this.props.renderHeader(path, index)}
                onStart={() => {
                    this.setState({currentVideo: ref, showHeaderFooter: false})
                    console.log('video ref said')
                }}
                onEnd={() => this.setState({currentVideo: null, showHeaderFooter: true})}
                // so that the screen doesn't move while seeking.
                onSeekingEnd={() => this.setState({swipeEnabled: true})}
                onSeekingStart={() => this.setState({swipeEnabled: false})}
                autoplay={false}
                ref={p => ref = p}
                endWithThumbnail={true}
                key={path}
                onPressThumbnailImage={this.toggleHeaderFooter}
            />
        )
    };

    renderHeaderFooter = (path, index) => {
        return (
            <SwitchView visible={this.state.showHeaderFooter}>
                <FadeView style={styles.header}>
                    {this.props.renderHeader ? this.props.renderHeader(path, index) : null}
                </FadeView>
                <FadeView style={styles.footer}>
                    {this.props.renderFooter ? this.props.renderFooter(path, index) : null}
                </FadeView>
            </SwitchView>
        )
    };

    toggleHeaderFooter = () => {
        this.setState(state => {
            return {
                showHeaderFooter: !state.showHeaderFooter
            }
        })
    };

    stopPlayingVideo = () => {
        console.log('in stop playing video');
        if (this.state.currentVideo) {
            console.log('stopping video');
            this.state.currentVideo.stop();
            this.setState({currentVideo: null})
        }
    };

    onPageSelected = index => {
        this.stopPlayingVideo(); // if any

        this.setState({currentPosition: index, showHeaderFooter: true, index});
        this.props.onPageChange && this.props.onPageChange(index)
    };

    onViewableItemsChanged = ({viewableItems, changed}) => {
        console.log('in onViewableItemsChanged')
        if (viewableItems.length > 0) {
            console.log('viewable item changed')
            const viewableItem = viewableItems[0];
            this.onPageSelected(viewableItem)
        }
    };

    viewabilityConfig = {
        itemVisiblePercentThreshold: 90
    };

    render() {
        return (
            <View style={[styles.container]}>
                <FlatList
                    horizontal={true}
                    extraData={this.state.showHeaderFooter}
                    pagingEnabled={true}
                    removeClippedSubviews={true}
                    data={this.props.media}
                    renderItem={this.renderItem}
                    scrollEnabled={this.state.swipeEnabled}
                    onViewableItemsChanged={this.onViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    getItemLayout={this.getItemLayout}
                    initialScrollIndex={this.props.index || 0}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'black'
    },
    video: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - NAVBAR_HEIGHT,
        backgroundColor: 'black'
    },
    header: {
        height: HEADER_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
    },
    footer: {
        height: HEADER_HEIGHT,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0
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
    videoProgressbarColor: PropTypes.string,
    index: PropTypes.number,
    onPageChange: PropTypes.func,
    hideStatusbar: PropTypes.bool,
    immersiveMode: PropTypes.bool
};

MediaViewer.defaultProps = {
    fallbackComponent: null,
    videoProgressbarColor: 'white',
    index: 0,
    hideStatusbar: false,
    immersiveMode: false
};