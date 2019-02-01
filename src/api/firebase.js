import config from '../../config';
import firebase from '@firebase/app';
import '@firebase/database';


firebase.initializeApp(config.firebase);

const database = firebase.database();

const read = async (path) => {
    const snapshot = await database.ref(path).once('value');
    return snapshot.val();
};

const write = (path, val) => {
    database.ref(path).set(val);
};

const getKey = () => {
    return database.ref().push().key
};

const db = {
    read, write, getKey, database
};

export default db;