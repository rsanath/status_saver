export const WhatsAppConstants = {
    CHANGE_STATUS_SOURCE: 'CHANGE_STATUS_SOURCE',
    CHANGE_STATUS_TAB: 'CHANGE_STATUS_TAB',
    ON_TAB_INDEX_CHANGE: 'ON_TAB_INDEX_CHANGE'
};

export const WhatsAppActions = {
    changeStatusSource: path => ({type: WhatsAppConstants.CHANGE_STATUS_SOURCE, payload: path}),
    changeStatusTab: route => ({type: WhatsAppConstants.CHANGE_STATUS_TAB, payload: route}),
    onTabIndexChange: index => ({type: WhatsAppConstants.ON_TAB_INDEX_CHANGE, payload: index})
};