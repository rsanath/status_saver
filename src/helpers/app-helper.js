import {ToastAndroid, Dimensions, Linking} from 'react-native';
import {checkAndCreateDir} from './file-system-helper';
import {NativeModules} from 'react-native';
import {t} from '../i18n/i18n';
import {get} from '../api/firebase';
import {notifyError} from './bugsnag-helper';
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
    let {width} = Dimensions.get('window');
    return width * (imgHeight / imgWidth);
}

export const sendMail = (to, sub = '', body = '') => {
    Linking.openURL(`mailto:${to}`)
}

export const getSupportEmail = async () => {
    return await get('/support/supportEmail')
}

export const getFileInfoAsString = async (filepath) => {
    const info = (await fs.lstat(filepath))[0];

    let {lastModified, size, path, filename} = info;

    new Date().toDateString();

    lastModified = new Date(Number(lastModified));
    lastModified = lastModified.toDateString().slice(4) + ' ' + lastModified.toTimeString().slice(0, 5);

    size = Math.round((size / 1048576) * 100) / 100 + ' MB';

    let message = '';
    message += `${t('labels.name')} : ${filename}\n\n`;
    message += `${t('labels.location')} : ${path}\n\n`;
    message += `${t('labels.size')} : ${size}\n\n`;
    message += `${t('labels.lastModified')} : ${lastModified}`;

    return message;
}