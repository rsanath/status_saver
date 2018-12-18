import config from '../../config';
import firebase from '@firebase/app';
import '@firebase/database';

firebase.initializeApp(config.firebase);

let _db = null;

export const db = () => {
    if (!_db) (_db = firebase.database())
    return _db
}

export const get = path => {
    return db().ref(path).once('value')
        .then(snapshot => snapshot.val())
}