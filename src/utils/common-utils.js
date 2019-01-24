import Constants from "../constants";

Array.prototype.contains = function(item) {
    for (let i in this) {
        if (this[i] === item) return true;
    }
    return false;
};

Array.prototype.remove = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

Array.prototype.equals = function(arr) {
    if (this.length != arr.length) return false;
    for (let i in this) {
        if (this[i] != arr[i]) {
            return false;
        }
    }
    return true;
};

const getMediaType = filepath => {
    let parts = filepath.split('.');
    let ext = parts[parts.length - 1];
    if (Constants.VIDEO_FILE_FORMATS.contains(ext)) {
        return 'video';
    } else if (Constants.IMAGE_FILE_FORMATS.contains(ext)) {
        return 'image';
    } else {
        return null;
    }
};

const getFileName = path => {
    const parts = path.split('/');
    return parts[parts.length - 1];
};

const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
};

const CommonUtil = {
    getMediaType,
    getFileName,
    isLightColor
};

export default CommonUtil;