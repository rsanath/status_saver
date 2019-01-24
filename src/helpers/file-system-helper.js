import fs from '../native-modules/file-system';
import notifyError from './exceptions-helper';

const sortByLatestFirst = files => {
    return files.sort((a, b) => b.lastModified - a.lastModified)
};

export const checkAndCreateDir = async dir => {
    const exist = await fs.exists(dir);

    if (exist) {
        const isdir = await fs.isDir(dir);
        if (!isdir) {
            await fs.mkdir(dir);
        }
    } else {
        await fs.mkdir(dir);
    }
};

export const listContent = path => {
    return fs.lstat(path)
        .then(files => sortByLatestFirst(files))
        .then(files => files.map(file => file.path))
        .catch(notifyError)
};