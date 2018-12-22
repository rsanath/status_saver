export const WhatsAppConstants = {
    CHANGE_STATUS_SOURCE: 'CHANGE_STATUS_SOURCE'
};

export const WhatsAppActions = {
    changeStatusSource: path => ({type: WhatsAppConstants.CHANGE_STATUS_SOURCE, payload: path})
};