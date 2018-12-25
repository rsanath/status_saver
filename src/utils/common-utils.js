const CommonUtils = {
    isVideo: filename => {
        let parts = filename.split('.');
        let ext = parts[parts.length - 1];
        return ext.toLowerCase() == 'mp4';
    }
};

export default CommonUtils;