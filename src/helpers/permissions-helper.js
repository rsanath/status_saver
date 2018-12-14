import { PermissionsAndroid } from 'react-native';
import { t } from '../i18n/i18n';

export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    notifyError(err)
    return false;
  }
}

export const checkStoragePermission = () => {
  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
}