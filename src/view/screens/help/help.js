import React from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import AppComponent from "../../app-component";
import TitleBar from "../../components/titlebar";
import {navigateBack, sendMail} from "../../../helpers/app-helper";
import db from "../../../api/firebase";
import {notifyError} from "../../../helpers/exceptions-helper";
import {getLanguages} from 'react-native-i18n';


export default class HelpScreen extends AppComponent {

    constructor() {
        super();
        this.state = {
            faq: [],
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

    _sendFeedbackEmail = async () => {
        const supportEmail = await db.read('support/supportEmail');
        sendMail(supportEmail, {subject: 'App Feedback'})
            .catch(e => {
                notifyError(e)
                this.toast('Please try again later');
            })
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

    _renderSendFeedbackButton = () => {
        return (
            <TouchableOpacity onPress={this._sendFeedbackEmail}>
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={this.state.faq}
                        renderItem={this.renderItem}
                        ListHeaderComponent={<Text style={styles.heading}>FAQ</Text>}
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