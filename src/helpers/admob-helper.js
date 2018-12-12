import { get } from '../firebase'
import config from '../../config';
import { notifyError } from './bugsnag-helper';

export const shouldShowAd = async () => {
    return get(config.routes.appRoute + '/config/ads')
        .then(config => config.showAds)
        .catch(e => {
            notifyError(error)
            return false
        })
}