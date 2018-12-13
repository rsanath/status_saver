import { get } from '../firebase'
import config from '../../config';
import { notifyError } from './bugsnag-helper';

export const getAdConfig = () => {
    return get(config.routes.appRoute + '/config/ads')
        .catch(error => {
            notifyError(error)
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