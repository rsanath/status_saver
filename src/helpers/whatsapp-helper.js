import { t } from '../i18n/i18n';
import C from '../constants';
import { presistImage, toast, shareImage, shareVideo } from './app-helper';
const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

const whatappStatusDir = '/sdcard/WhatsApp/Media/.Statuses'

export const getStatuses = () => {
    return fs.lstat(whatappStatusDir)
        .then(files => sortByLatestFirst(files))
        .then(files => files.map(file => file.path))
        .catch(() => [])
}

export const isWhatsappInstalled = async () => {
    return (await fs.exists(whatappStatusDir)) && (await fs.isDir(whatappStatusDir))
}

export const getPhotoStatuses = async () => {
    const statuses = await getStatuses()
    return statuses.filter(status => isPhoto(status))
}

export const getVideoStatuses = async () => {
    const statuses = await getStatuses()
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
    presistImage(status, C.whatsAppStatusPersistPath)
        .then(() => toast(t('statusSaveSuccessMsg')))
        .catch(e => toast(t('statusSaveFailureMsg') + '\nErrMsg: ' + e.toString()))
}

const sortByLatestFirst = files => {
    return files.sort((a, b) => b.lastModified - a.lastModified)
}