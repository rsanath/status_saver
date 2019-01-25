import {PermissionsAndroid} from 'react-native';

const requestStoragePermission = async () => {
    try {
        return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    } catch (err) {
        notifyError(err);
    }
};

const isStoragePermissionGranted = () => {
    return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
};

const Storage = {
    requestStoragePermission,
    isStoragePermissionGranted
};


const PermissionHelper = {
    Storage
};

export default PermissionHelper;