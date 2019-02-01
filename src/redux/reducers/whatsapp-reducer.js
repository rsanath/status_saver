import { WhatsAppConstants } from '../actions/whatsapp-actions';

const initialState = {
    data: [],
    statusSource: '',
    noWhatsAppAvailable: false
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
        case WhatsAppConstants.ON_NO_WHATSAPP_AVAILABLE:
            return {
                ...state,
                noWhatsAppAvailable: true
            };
        default:
            return state
    }
}