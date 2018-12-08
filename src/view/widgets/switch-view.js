import { Component } from 'react';

export default class SwitchView extends Component {
  render() {
    return this.props.visible ? this.props.children : null
  }
}
