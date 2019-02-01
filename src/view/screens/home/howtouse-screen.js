import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { t } from '../../../i18n/i18n';
import theme from '../../theme/theme';
import {sendMail, getSupportEmail} from '../../../helpers/app-helper';

export default class HowToUseScreen extends Component {
  constructor(props) {
    super(props);
  }

  sendMailToSupport = async () => {
    const supportEmail = await getSupportEmail()
    sendMail(supportEmail);
  }

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false} >
        <View>
          <Text style={styles.title} >{t('screens.howtouse.title')}</Text>
          <Text style={styles.steps} >{t('screens.howtouse.steps')}</Text>

          <Text style={styles.title} >{t('screens.howtouse.faqTitle')}</Text>
          <Text style={styles.steps} >{t('screens.howtouse.faqContent')}</Text>
        </View>

        <TouchableOpacity onPress={() => this.sendMailToSupport()} >
          <Text style={styles.button} >{t('screens.howtouse.sendFeedback').toUpperCase()}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = {
  ,
  button: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    margin: 10,
    padding: 10,
    textAlign: 'center',
    borderColor: theme.colors.primary,
  }
}