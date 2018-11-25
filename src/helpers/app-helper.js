import React from 'react';
import { ToastAndroid, Dimensions } from 'react-native';
import { checkAndCreateDir } from './file-system-helper';
import C from '../constants'
import { NativeModules } from 'react-native'

const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

export const presistImage = async path => {
    await checkAndCreateDir(C.statusPresistLocation)

    const fileName = getFileName(path)
    const destPath = C.statusPresistLocation + '/' + fileName

    await fs.cp(path, destPath)
}

const getFileName = uri => {
    const parts = uri.split('/')
    return parts[parts.length - 1]
}

export const toast = msg => ToastAndroid.show(msg, ToastAndroid.SHORT)

export const shareImage = (path, message = '') => {
    NativeModules.ImageShareModule.shareImage(path, message);
}

export const shareVideo = (path, message = '') => {
    NativeModules.ImageShareModule.shareVideo(path, message);
}

export const getHeightForFullWidth = (imgWidth, imgHeight) => {
    let { width } = Dimensions.get('window');
    return width * (imgHeight / imgWidth);
}