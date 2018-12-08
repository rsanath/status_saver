import config from '../config';
import firebase from '@firebase/app';
import '@firebase/database';

firebase.initializeApp(config.firebase);

let _db = null;

export const db = (path = '') => {
    if (!_db) (_db = firebase.database())

    return _db.ref(config.routes.appRoute + path);
}