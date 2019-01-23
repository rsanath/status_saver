export const WhatsAppConstants = {
    CHANGE_STATUS_SOURCE: 'CHANGE_STATUS_SOURCE',
    ON_STATUS_DATA_MODIFIED: 'ON_STATUS_DATA_MODIFIED'
};

export const WhatsAppActions = {
    changeStatusSource: path => ({type: WhatsAppConstants.CHANGE_STATUS_SOURCE, payload: path}),
    onStatusDataModified: data => ({type: WhatsAppConstants.ON_STATUS_DATA_MODIFIED, payload: data})
};