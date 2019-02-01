/** @format */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TestScreen from "./src/view/screens/test-screens";
import HelpScreen from "./src/view/screens/help/help";

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => HelpScreen);
