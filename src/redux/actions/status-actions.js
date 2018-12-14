export const StatusConstants = {
    CHANGE_STATUS_PATH: 'CHANGE_STATUS_PATH'
}

export const StatusActions = {
    changeStatusPath: path => ({ type: StatusConstants.CHANGE_STATUS_PATH, payload: path })
}