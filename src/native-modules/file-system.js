import { NativeModules } from 'react-native';

const fs = NativeModules.FileSystemModule;

function addCode(code, error) {
    error.code = code
    return error
}

function lstat(path) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string') {
            return reject(addCode('EINVAL', new TypeError('Missing argument "path" ')))
        }
        fs.lstat(path, (err, stat) => {
            if (err)
                reject(addCode('EUNSPECIFIED', new Error(err)))
            else
                resolve(stat)
        })
    })
}

function exists(path) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string') {
            return reject(addCode('EINVAL', new TypeError('Missing argument "path" ')))
        }
        try {
            fs.exists(path, (exist) => {
                resolve(exist)
            })
        } catch (err) {
            reject(addCode('EUNSPECIFIED', new Error(err)))
        }
    })
}

function mkdir(path) {
    if (typeof path !== 'string') {
        return Promise.reject(addCode('EINVAL', new TypeError('Missing argument "path" ')))
    }
    return fs.mkdir(path)
}

function isDir(path) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string') {
            return reject(addCode('EINVAL', new TypeError('Missing argument "path" ')))
        }
        try {
            fs.exists(path, (exist, isDir) => {
                resolve(isDir)
            })
        } catch (err) {
            reject(addCode('EUNSPECIFIED', new Error(err)))
        }
    })
}

function ls(path) {
    if (typeof path !== 'string') {
        return Promise.reject(addCode('EINVAL', new TypeError('Missing argument "path" ')))
    }
    return fs.ls(path)
}

function cp(path, dest) {
    return new Promise((resolve, reject) => {
        if (typeof path !== 'string' || typeof dest !== 'string') {
            return reject(addCode('EINVAL', new TypeError('Missing argument "path" and/or "destination"')))
        }
        fs.cp(path, dest, (err, res) => {
            if (err)
                reject(addCode('EUNSPECIFIED', new Error(err)))
            else
                resolve(res)
        })
    })
}

export function rm(path) {
    return new Promise((resolve, reject) => {
        fs.rm(path, resolve)
    })
}

const FileSystem = {
    lstat,
    exists,
    mkdir,
    isDir,
    ls,
    cp,
    rm
};

export default FileSystem;