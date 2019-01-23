import {NativeModules} from "react-native";
import {notifyError} from "../helpers/bugsnag-helper";
import {t} from "../i18n/i18n";
import {toast} from "../helpers/app-helper";

const shareMedia = (path, mimeType = '*/*', message = '') => {
    try {
        NativeModules.MediaShareModule.shareMedia(path, mimeType, message);
    } catch (e) {
        notifyError(e);
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
};

const shareMultipleMedia = (media, mimeType = '*/*', message = '') => {
    try {
        NativeModules.MediaShareModule.shareMedia(media, mimeType, message);
    } catch (e) {
        notifyError(e);
        toast(t('shareFailureMsg') + '\nErrMsg: ' + e.toString())
    }
};

const ShareModule = {
    shareMedia,
    shareMultipleMedia
};

export default ShareModule;