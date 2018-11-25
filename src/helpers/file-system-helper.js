const RNFetchBlob = require('rn-fetch-blob').default
const fs = RNFetchBlob.fs

export const ls = dir => {
    return fs.ls(dir)
        .then(files => {
            files.map(file => `${dir}/${file}`)
        })
}

export const checkAndCreateDir = async dir => {
    const exist = await fs.exists(dir)
    if (!(exist && await fs.isDir(dir))) {
        await fs.mkdir(dir)
    }
}