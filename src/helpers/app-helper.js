import { ToastAndroid, Dimensions, Linking } from 'react-native';
import { checkAndCreateDir } from './file-system-helper';
import { NativeModules } from 'react-native';
import { t } from '../i18n/i18n';
import { get } from '../firebase';
import { notifyError } from './bugsnag-helper';
import fs from '../native-modules/file-system-module';


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

export const shareImage = (path, message = '') => {
    try {
        NativeModules.ImageShareModule.shareImage(path, message);
    } catch (e) {
        notifyError(e)
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

export const shareImages = (images, message = '') => {
    try {
        NativeModules.ImageShareModule.shareImages(images, message);
    } catch (e) {
        notifyError(e)
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

export const shareVideo = (path, message = '') => {
    try {
        NativeModules.ImageShareModule.shareVideo(path, message);
    } catch (e) {
        notifyError(e)
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

export const shareVideos = (videos, message = '') => {
    try {
        NativeModules.ImageShareModule.shareVideos(videos, message);
    } catch (e) {
        notifyError(e)
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

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