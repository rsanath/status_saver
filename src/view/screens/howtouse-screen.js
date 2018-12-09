import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { t } from '../../i18n/i18n';

export default class HowToUseScreen extends Component {
  constructor(props) {
    super(props);
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
      </ScrollView>
    );
  }
}

const styles = {
  title: {
    fontWeight: 'bold',
    margin: 6,
    textAlign: 'center',
    fontSize: 20,
  },
  steps: {
    fontSize: 18,
    marginVertical: 5,
  }
}