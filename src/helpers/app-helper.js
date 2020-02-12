import {ToastAndroid, Dimensions, Linking} from 'react-native';
import qs from 'qs';
import {checkAndCreateDir} from './file-system-helper';
import {t} from '../i18n/i18n';
import {notifyError} from './exceptions-helper';
import fs from '../native-modules/file-system';
import {NavigationActions} from 'react-navigation';
import db from "../api/firebase";


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

export const getSupportEmail = async () => {
    return await db.read('/support/supportEmail')
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

export function navigateBack(context) {
    const {navigation} = context.props;
    if (!navigation) return;
    navigation.dispatch(NavigationActions.back())
}

export const sendMail = async (to, {cc, bcc, subject, body} = {}) => {
    let url = 'mailto:';

    if (to) {
        const toStr = Array.isArray(to) ? to.join(',') : to;
        url += encodeURIComponent(toStr);

        if (cc) {
            cc = Array.isArray(cc) ? cc.join(',') : cc
        }
        if (bcc) {
            bcc = Array.isArray(bcc) ? bcc.join(',') : bcc
        }

        const query = qs.stringify({cc, bcc, subject, body});

        if (query.length) {
            url += `?${query}`
        }
    }

    const supported = await Linking.canOpenURL(url);
    if (!supported) {
        return Promise.reject(new Error('Provided URL can not be handled'))
    }

    return Linking.openURL(url)
};