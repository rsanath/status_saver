import React from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';


export default class Icon extends React.Component {

    static FONT_FAMILY = 'material';
    static MATERIAL = 'material';
    static DEFAULT_ICON = 'unknown';

    static IconNameMap = {
        material: {
            save: 'save',
            play: 'play-arrow',
            'dots-vertical': 'more-vert',
            x: 'close',
            pause: 'pause',
            'volume-mute': 'volume-mute',
            'volume-up': 'volume-up',
            'chevron-down': 'keyboard-arrow-down',
            info: 'info',
            tick: 'check',
            trash: 'delete',
            share: 'share',
            videocam: 'videocam',
            back: 'arrow-back',
            unknown: 'error-outline'
        }
    };

    getIconFamily = () => {
        switch (Icon.FONT_FAMILY) {
            case Icon.MATERIAL:
                return MaterialIcon;
            default:
                return MaterialIcon;
        }
    };


    getIconName = () => {
        return Icon.IconNameMap
            [Icon.FONT_FAMILY]
            [this.props.name];
    };

    render() {
        const Icon_ = this.getIconFamily();
        const iconName = this.getIconName();
        return (
            <Icon_
                {...this.props}
                name={iconName}
            />
        )
    }
}

Icon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string
};

Icon.deafultProps = {
    size: 30,
    color: '#000000',
    name: Icon.DEFAULT_ICON
};