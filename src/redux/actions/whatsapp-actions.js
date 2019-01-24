export const WhatsAppConstants = {
    CHANGE_WHATSAPP_SOURCE: 'CHANGE_WHATSAPP_SOURCE',
    ON_STATUS_DATA_MODIFIED: 'ON_STATUS_DATA_MODIFIED'
};

export const WhatsAppActions = {
    changeWhatsAppType: path => ({type: WhatsAppConstants.CHANGE_WHATSAPP_SOURCE, payload: path})
};