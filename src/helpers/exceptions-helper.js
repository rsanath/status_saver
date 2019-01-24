import DeviceInfo from 'react-native-device-info';

import { db } from '../api/firebase';
import C from '../constants';

export const notifyError = async e => {
    if (!(e instanceof Error)) return;

    var errorInfo = {
        name: e.name,
        stack: e.stack,
        message: e.message,
        timestamp: new Date().getTime(),
        apiLevel: DeviceInfo.getAPILevel(),
        batteryLevel: await DeviceInfo.getBatteryLevel(),
        brand: DeviceInfo.getBrand(),
        model: DeviceInfo.getModel(),
        readableVersion: DeviceInfo.getReadableVersion(),
        systemVersion: DeviceInfo.getSystemVersion(),
        timezone: DeviceInfo.getTimezone(),
        storageSize: DeviceInfo.getTotalDiskCapacity(),
        totalMemory: DeviceInfo.getTotalMemory(),
        uniqueId: DeviceInfo.getUniqueID(),
        buildNumber: DeviceInfo.getBuildNumber(),
        bundleId: DeviceInfo.getBundleId(),
        carrier: DeviceInfo.getCarrier(),
        deviceCountry: DeviceInfo.getDeviceCountry(),
        deviceId: DeviceInfo.getDeviceId(),
        deviceLocale: DeviceInfo.getDeviceLocale(),
        deviceName: DeviceInfo.getDeviceName(),
        firstInstallTime: DeviceInfo.getFirstInstallTime(),
        fontScale: DeviceInfo.getFontScale(),
        freeDiskStorage: DeviceInfo.getFreeDiskStorage(),
        lastUpdateTime: DeviceInfo.getLastUpdateTime(),
        manufacturer: DeviceInfo.getManufacturer(),
        maxMemory: DeviceInfo.getMaxMemory(),
    };

    var key = db().ref().push().key;

    db().ref('errors/' + C.APP_NAME + '/' + key).set(errorInfo);
}