import WhatsAppHelper from "../../helpers/whatsapp-helper";

export const WhatsAppConstants = {
    CHANGE_WHATSAPP_SOURCE: 'CHANGE_WHATSAPP_SOURCE',
    ON_STATUS_DATA_MODIFIED: 'ON_STATUS_DATA_MODIFIED',
    GET_INITIAL_STATUS_SOURCE: 'GET_INITIAL_STATUS_SOURCE',
    ON_NO_WHATSAPP_AVAILABLE: 'ON_NO_WHATSAPP_AVAILABLE'
};

export const WhatsAppActions = {
    changeWhatsAppType: path => ({type: WhatsAppConstants.CHANGE_WHATSAPP_SOURCE, payload: path}),
};

export const getInitialStatusSource = dispatch => {
    WhatsAppHelper.getInitialStatusDir()
        .then(path => {
            if (path == null) {
                dispatch({type: WhatsAppConstants.ON_NO_WHATSAPP_AVAILABLE})
            } else {
                dispatch(WhatsAppActions.changeWhatsAppType(path))
            }
        })
};