import React from 'react';
import { ToastAndroid, Dimensions } from 'react-native';
import { checkAndCreateDir } from './file-system-helper';
import { NativeModules } from 'react-native'
import { t } from '../i18n/i18n';

const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

export const presistImage = async (path, dest) => {
    await checkAndCreateDir(dest)

    const fileName = getFileName(path)
    const destPath = dest + '/' + fileName

    await fs.cp(path, destPath)
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
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

export const shareVideo = (path, message = '') => {
    try {
        NativeModules.ImageShareModule.shareVideo(path, message);
    } catch (e) {
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
}

export const getHeightForFullWidth = (imgWidth, imgHeight) => {
    let { width } = Dimensions.get('window');
    return width * (imgHeight / imgWidth);
}