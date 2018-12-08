import { db } from '../firebase'

export const shouldShowAd = async () => {
    return db('/config/ads').once('value')
        .then(snapshot => snapshot.val())
        .then(val => val.showAds)
        .catch(error => {
            console.log(error)
            return false
        })
}