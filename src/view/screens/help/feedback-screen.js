import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    ToastAndroid
} from 'react-native';
import PropTypes from 'prop-types';

import OutlineButton from "../../components/widgets/outline-button";


export default class FeedbackScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            submitting: false,
            feedbackText: '',
            feedbackLength: 140
        };
    }

    _submitFeedback = () => {
        this.setState({submitting: true});
        setTimeout(() => {
            this.setState({submitting: false});
            this.props.onSubmissionComplete && this.props.onSubmissionComplete(true)
            ToastAndroid.showWithGravity('Submitted', ToastAndroid.SHORT, ToastAndroid.CENTER)
        }, 2000)
    };

    _hideFeedbackForm = () => {
        this.props.onRequestClose && this.props.onRequestClose()
    };

    _handleOnTextChange = text => {
        this.setState({feedbackText: text});
    };

    render() {
        return (
            <View style={styles.outerContainer}>
                <View style={styles.feedbackFormContainer}>
                    <View
                        style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.feedbackTitle}>Send Feedback</Text>
                        <TouchableOpacity onPress={this._hideFeedbackForm}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        onChangeText={this._handleOnTextChange}
                        style={styles.feedbackText}
                        numberOfLines={4}
                        maxLength={this.state.feedbackLength}
                        autoFocus={true}
                        multiline={true}
                        blurOnSubmit={true}
                        editable={!this.state.submitting}
                        placeholder={'Enter here'}
                        returnKeyType={'done'}
                    />
                    <Text style={styles.feedbackLengthIndicator}>
                        {`${this.state.feedbackText.length}/${this.state.feedbackLength}`}
                    </Text>
                    {this.state.submitting ? (
                        <ActivityIndicator size={'large'}/>
                    ) : (
                        <OutlineButton
                            titleStyle={{flex: 1, padding: 5}}
                            onPress={this._submitFeedback}
                            size={17}
                            title={'SEND'}
                        />
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    feedbackBtn: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    feedbackFormContainer: {
        backgroundColor: '#ffffff',
        margin: 30,
        padding: 20,
        borderRadius: 10,
    },
    feedbackText: {
        marginTop: 7,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgrey',
        textAlignVertical: 'top',
        padding: 15,
    },
    feedbackTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    outerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    feedbackLengthIndicator: {
        textAlign: 'right',
        color: 'grey',
        marginVertical: 5,
    },
});

FeedbackScreen.propTypes = {
    onRequestClose: PropTypes.func,
    onSubmissionComplete: PropTypes.func
};