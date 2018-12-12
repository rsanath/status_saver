import fs from '../native-modules/file-system-module';

export const checkAndCreateDir = async dir => {
    const exist = await fs.exists(dir)
    
    if (!exist) {
        console.log('before1')
        const isdir = await fs.isDir(dir)
        console.log('after1')

        if (!isdir) {
            console.log('before2')
            await fs.mkdir(dir)
            console.log('after2')
        }
    }
}
