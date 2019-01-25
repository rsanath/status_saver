import {NativeModules} from 'react-native';

    const settings = NativeModules.SettingsModule;

const openAppSettings = () => {
    settings.openAppSettings();
};

const SettingsModule = {
    openAppSettings
};

export default SettingsModule;