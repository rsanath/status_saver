import db from '../api/firebase'
import { notifyError } from './exceptions-helper';

export const getAdConfig = () => {
    return db.read('/config/ads')
        .catch(error => {
            notifyError(error);
            return DeafultAdConfig
        })
}

export const DeafultAdConfig = {
    showAds: false,
    bottomBannerAd: {
        showAd: false
    },
    appCloseAd: {
        showAd: false
    }
}