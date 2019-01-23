import * as React from 'react';
import {Animated} from 'react-native';
import PropTypes from 'prop-types';


export default class FadeView extends React.Component {
    constructor() {
        super();
        this.fadeAnim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.timing(
            this.fadeAnim,
            {
                toValue: 1,
                duration: this.props.duration,
                useNativeDriver: true
            },
        ).start();
    }

    componentWillUnmount() {
        // Animated.timing(
        //     this.fadeAnim,
        //     {
        //         toValue: 0,
        //         duration: this.props.duration,
        //         useNativeDriver: true
        //     },
        // ).start();
    }

    render() {
        return (
            <Animated.View {...this.props} style={[this.props.style, {opacity: this.fadeAnim}]} />
        )
    }
}

FadeView.propTypes = {
    duration: PropTypes.number
};

FadeView.defaultProps = {
    duration: 200
};