import React from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput
} from 'react-native';
import AppComponent from "../../app-component";
import TitleBar from "../../components/titlebar";
import {navigateBack} from "../../../helpers/app-helper";
import db from "../../../api/firebase";
import {notifyError} from "../../../helpers/exceptions-helper";
import {getLanguages} from 'react-native-i18n';
import OutlineButton from "../../components/widgets/outline-button";
import FeedbackScreen from "./feedback-screen";


export default class HelpScreen extends AppComponent {

    constructor() {
        super();
        this.state = {
            faq: JSON.parse(`[{"content":"1. Open WhatsApp and watch any status  2. Then come back to this app and open the viewed status  3. Press the save icon to save the status to your device :)","title":"How to use"},{"content":"This happens especially for video statuses. Watch the video completely and the check back again.","title":"My status are not displayed in the app"},{"content":"Gallery takes a while to load new media from the storage. Just wait for a while, your status is saved already","title":"The status I saved is not appearing in the gallery"},{"content":"The status are saved in the 'WhatsApp Status' folder in your internal storage.","title":"Where are the status saved ?"},{"content":"Long press any status to enter multi select mode. From there you can save or share multiple statuses at once.","title":" How do I save or share multiple status ?"}]`),
            fetching: true,
            feedbackFormVisible: false
        };
    }

    async componentDidMount() {
        try {
            const language = await getLanguages();
            const faq = await db.read('faqs/' + language[0]);
            console.log(JSON.stringify(faq))
            this.setState({faq, fetching: false})
        } catch (e) {
            notifyError(e);
            this.toast('Error getting faq. PLease try again later');
            this.setState({faq: [], fetching: false})
        }
    }

    _hideFeedbackForm = () => {
        this.setState({feedbackFormVisible: false})
    }

    _showFeedbackForm = () => {
        this.setState({feedbackFormVisible: true})
    }

    _renderFeedbackForm = () => {
        return (
            <Modal
                visible={this.state.feedbackFormVisible}
                onRequestClose={this._hideFeedbackForm}
                transparent={true}
                animationType={'fade'}
            >
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <FeedbackScreen
                        onRequestClose={this._hideFeedbackForm}
                        onSubmissionComplete={this._hideFeedbackForm}
                    />
                </View>
            </Modal>
        )
    }

    renderItem = ({item, index}) => {
        return (
            <View style={styles.item}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
            </View>
        )
    };

    renderLoader() {
        if (!this.state.fetching) return null;

        return (
            <ActivityIndicator style={styles.loadingIndicator} animating={true} size={'large'}/>
        )
    }

    _renderSeparatorComponent = () => {
        return (
            <View style={{height: 1, width: 500, backgroundColor: 'grey'}}/>
        )
    };

    _renderFaqHeader = () => {
        return (
            <Text style={styles.heading}>
                FAQ
            </Text>
        )
    }

    _renderSendFeedbackButton = () => {
        return (
            <TouchableOpacity onPress={this._showFeedbackForm}>
                <Text style={styles.feedbackBtn}>SEND FEEDBACK</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={this.theme.containers.screen}>
                <TitleBar
                    title={'Help'}
                    rightActions={this._renderSendFeedbackButton()}
                    onBackPress={() => navigateBack(this)}
                />
                {this.renderLoader()}
                {this._renderFeedbackForm()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={this.state.faq}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this._renderFaqHeader}
                        ListHeaderComponentStyle={styles.heading}
                        ItemSeparatorComponent={this._renderSeparatorComponent}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: 16,
    },
    content: {
        color: 'black',
        fontSize: 15,
        marginVertical: 2,
    },
    contentContainer: {
        padding: 10
    },
    item: {
        marginTop: 5,
        padding: 15,
    },
    loadingIndicator: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    heading: {
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center'
    },
    feedbackBtn: {
        fontWeight: 'bold',
        fontSize: 14
    },
    feedbackFormContainer: {
        backgroundColor: '#ffffff',
        margin: 30,
        padding: 20,
        borderRadius: 15
    },
    feedbackText: {
        marginVertical: 7,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'lightgrey'
    },
    feedbackTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold'
    }
});