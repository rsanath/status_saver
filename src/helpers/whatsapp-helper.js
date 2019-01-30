import Constants from "../constants";
import fs from "../native-modules/file-system";
import CommonUtil from "../utils/common-utils";
import {notifyError} from "./exceptions-helper";

const WhatsAppTypes = {
    WHATSAPP: 'WhatsApp',
    WHATSAPP_BUSINESS: 'WhatsApp Business',
    GB_WHATSAPP: 'GB WhatsApp'
};

const getPathForWhatsAppType = type => {
    const pathMap = {};
    pathMap[WhatsAppTypes.WHATSAPP] = Constants.WHATSAPP_STATUS_PATH;
    pathMap[WhatsAppTypes.GB_WHATSAPP] = Constants.GBWHATSAPP_STATUS_PATH;
    pathMap[WhatsAppTypes.WHATSAPP_BUSINESS] = Constants.WHATSAPP_BUSINESS_STATUS_PATH;
    return pathMap[type];
};

const saveMultipleStatus = async (items) => {
    const exist = await fs.exists(Constants.WHATSAPP_STATUS_SAVE_PATH);
    if (!exist) {
        await fs.mkdir(Constants.WHATSAPP_STATUS_SAVE_PATH);
    }
    let saves = items.map(item => {
        let dest = Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(item);
        return fs.cp(item, dest);
    });
    return Promise.all(saves)
        .catch(e => {
            notifyError(e);
            throw e
        })
};

const saveStatus = async (path) => {
    const exist = await fs.exists(Constants.WHATSAPP_STATUS_SAVE_PATH);
    if (!exist) {
        await fs.mkdir(Constants.WHATSAPP_STATUS_SAVE_PATH);
    }
    let dest = Constants.WHATSAPP_STATUS_SAVE_PATH + '/' + CommonUtil.getFileName(path);
    return fs.cp(path, dest)
        .catch(e => {
            notifyError(e);
            throw e
        })
};

const getInitialStatusDir = async () => {
    let statusDirs = [
        Constants.WHATSAPP_STATUS_PATH,
        Constants.GBWHATSAPP_STATUS_PATH,
        Constants.WHATSAPP_BUSINESS_STATUS_PATH
    ];

    for (let i in statusDirs) {
        let dir = statusDirs[i];
        if (await fs.exists(dir)) {
            return dir;
        }
    }

    return null;
};

const WhatsAppHelper = {
    WhatsAppTypes,
    getPathForWhatsAppType,
    saveMultipleStatus,
    saveStatus,
    getInitialStatusDir
};

export default WhatsAppHelper;