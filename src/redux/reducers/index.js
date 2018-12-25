import { combineReducers } from 'redux';
import WhatsappReducer from './whatsapp-reducer';

export default combineReducers({
    whatsapp: WhatsappReducer
})