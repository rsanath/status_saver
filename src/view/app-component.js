import React, { Component } from 'react';
import { Dimensions } from 'react-native';

import DisplayUtil from '../utils/display-utils';
import theme from './theme/theme';
import { toast } from '../helpers/app-helper';
import { t } from '../i18n/i18n'


export default class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.theme = theme;
    this.toast = toast;
    this.t = t;

    Dimensions.addEventListener('change', ({ window, screen }) => {
      this.setState({
        screenWidth: screen.width,
        screenHeight: screen.height,
        orientation: DisplayUtil.isPortrait() ? 'portrait' : 'landscape'
      });
    });
    const { width, height } = Dimensions.get('screen');
    this.state = {
      screenWidth: width,
      screenHeight: height,
      orientation: DisplayUtil.isPortrait() ? 'portrait' : 'landscape',
    };
  }

  isPortrait = () => this.state.orientation == 'portrait'
}
