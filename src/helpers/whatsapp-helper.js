const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

const whatappStatusDir = '/sdcard/WhatsApp/Media/.Statuses'

export const getStatuses = () => {
    return fs.ls(whatappStatusDir)
        .then(files => files.map(file => `${whatappStatusDir}/${file}`))
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