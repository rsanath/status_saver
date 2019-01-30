/** @format */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TestScreen from "./src/view/screens/test-screens";

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
