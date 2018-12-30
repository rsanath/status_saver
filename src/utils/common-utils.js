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

export default {
    getMediaType
};