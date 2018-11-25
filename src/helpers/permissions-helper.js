import { PermissionsAndroid } from 'react-native';
import {t} from '../i18n/i18n';

export async function requestStoragePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: t('permissionTitle'),
        message: t('perissionDescription')
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the Storage")
    } else {
      console.log("Storage permission denied")
    }
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err)
    return false;
  }
}