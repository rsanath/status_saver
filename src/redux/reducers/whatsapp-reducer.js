import Constants from '../../constants';
import { WhatsAppConstants } from '../actions/whatsapp-actions';
import {t} from "../../i18n/i18n";

const initialState = {
    statusSource: Constants.GBWHATSAPP_STATUS_PATH,

    multiSelectMode: false,

    navigationState: {
        index: 0,
        routes: [
            { key: 'photos', title: t('screens.whatsApp.photoStatusTitle') },
            { key: 'videos', title: t('screens.whatsApp.videoStatusTitle') },
        ],
    }
};

const routeIndexMap = {
        photos: 0,
        videos: 1
};


export default function WhatsAppReducer(state = initialState, action) {
    switch (action.type) {
        case WhatsAppConstants.CHANGE_STATUS_SOURCE:
            return {
                ...state,
                statusSource: action.payload
            };
        case WhatsAppConstants.CHANGE_STATUS_TAB:
            return {
                ...state,
                navigationState: {
                    ...state.navigationState,
                    index: routeIndexMap[action.payload.route.key]
                }
            };
        case WhatsAppConstants.ON_TAB_INDEX_CHANGE:
            return {
                ...state,
                navigationState: {
                    ...state.navigationState,
                    index: action.payload
                }
            };
        default:
            return state
    }
}