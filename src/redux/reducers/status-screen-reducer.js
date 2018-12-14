import C from '../../constants';
import { StatusConstants } from '../actions/status-actions';

const initialState = {
    statusPath: C.WhatappStatusPath
};

export default function StatusScreenReducer(state = initialState, action) {
    switch (action.type) {
        case StatusConstants.CHANGE_STATUS_PATH:
            return {
                ...state,
                statusPath: action.payload
            }
        default:
            return state
    }
}