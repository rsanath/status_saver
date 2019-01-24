import Constants from '../../constants';
import { WhatsAppConstants } from '../actions/whatsapp-actions';

const initialState = {
    data: [],
    statusSource: Constants.WHATSAPP_STATUS_PATH,
};


export default function WhatsAppReducer(state = initialState, action) {
    switch (action.type) {
        case WhatsAppConstants.CHANGE_WHATSAPP_SOURCE:
            return {
                ...state,
                statusSource: action.payload
            };
        case WhatsAppConstants.ON_STATUS_DATA_MODIFIED:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state
    }
}