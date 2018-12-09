import { t } from '../i18n/i18n';
import C from '../constants';
import { copyFile, toast, copyFiles } from './app-helper';
const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

export const getStatuses = path => {
    return fs.lstat(path)
        .then(files => sortByLatestFirst(files))
        .then(files => files.map(file => file.path))
        .catch(() => [])
}

export const getPhotoStatuses = async path => {
    const statuses = await getStatuses(path)
    return statuses.filter(status => isPhoto(status))
}

export const getVideoStatuses = async path => {
    const statuses = await getStatuses(path)
    return statuses.filter(status => isVideo(status))
}

const isPhoto = file => {
    const parts = file.split('.')
    const ext = parts[parts.length - 1]
    return ext == 'jpg'
}

const isVideo = file => {
    const parts = file.split('.')
    const ext = parts[parts.length - 1]
    return ext == 'mp4'
}

export const saveWhatsAppStatus = status => {
    copyFile(status, C.whatsAppStatusPersistPath)
        .then(() => toast(t('statusSaveSuccessMsg')))
        .catch(e => toast(t('statusSaveFailureMsg') + '\nErrMsg: ' + e.toString()))
}

export const saveWhatsAppStatuses = statuses => {
    copyFiles(statuses, C.whatsAppStatusPersistPath)
        .then(() => toast(t('statusSaveSuccessMsg')))
        .catch(e => toast(t('statusSaveFailureMsg') + '\nErrMsg: ' + e.toString()))
}

const sortByLatestFirst = files => {
    return files.sort((a, b) => b.lastModified - a.lastModified)
}