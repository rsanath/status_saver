import Constants from '../../constants';
import { WhatsAppConstants } from '../actions/whatsapp-actions';

const initialState = {
    statusSource: Constants.WHATSAPP_STATUS_PATH,
};

export default function WhatsAppReducer(state = initialState, action) {
    switch (action.type) {
        case WhatsAppConstants.CHANGE_STATUS_PATH:
            return {
                ...state,
                statusPath: action.payload
            }
        default:
            return state
    }
}