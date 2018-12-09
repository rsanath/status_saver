import { get } from '../firebase'
import config from '../../config';

export const shouldShowAd = async () => {
    return get(config.routes.appRoute + '/config/ads')
        .catch(e => {
            console.log(error)
            return false
        })
}