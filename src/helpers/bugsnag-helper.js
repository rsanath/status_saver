import DeviceInfo from 'react-native-device-info';

import { db } from '../firebase';
import C from '../constants';


export const notifyError = e => {
    if (!(e instanceof Error)) return;

    var errorInfo = {
        name: e.name,
        stack: e.stack,
        message: e.message,
        timestamp: new Date().getTime(),
        apiLeve: DeviceInfo.getAPILevel(),
        device: DeviceInfo.getBrand(),
        deviceId: DeviceInfo.getDeviceId(),
        freeDiskStorage: DeviceInfo.getFreeDiskStorage(),
        memory: DeviceInfo.getMaxMemory(),
        locale: DeviceInfo.getDeviceLocale(),
        buildNumber: DeviceInfo.getBuildNumber(),
        appId: DeviceInfo.getBundleId(),
        deviceModel: DeviceInfo.getModel()
    };

    var key = db().ref().push().key;

    db().ref('errors/' + C.appName + '/' + key).set(errorInfo);
}