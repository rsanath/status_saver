import { ToastAndroid, Dimensions, Linking } from 'react-native';
import { checkAndCreateDir } from './file-system-helper';
import { NativeModules } from 'react-native';
import { t } from '../i18n/i18n';
import { get } from '../api/firebase';
import { notifyError } from './bugsnag-helper';
import fs from '../native-modules/file-system';


export const copyFile = async (sourcePath, destDir) => {
    await checkAndCreateDir(destDir)

    const fileName = getFileName(sourcePath)
    const destPath = destDir + '/' + fileName

    await fs.cp(sourcePath, destPath)
}

export const copyFiles = async (files, destFolder) => {
    for (let index in files) {
        await copyFile(files[index], destFolder)
    }
}

const getFileName = uri => {
    const parts = uri.split('/')
    return parts[parts.length - 1]
}

export const toast = msg => ToastAndroid.show(msg, ToastAndroid.SHORT)

export const getHeightForFullWidth = (imgWidth, imgHeight) => {
    let { width } = Dimensions.get('window');
    return width * (imgHeight / imgWidth);
}

export const sendMail = (to, sub = '', body = '') => {
    Linking.openURL(`mailto:${to}`)
}

export const getSupportEmail = async () => {
    return await get('/support/supportEmail')
}