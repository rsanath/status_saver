import { combineReducers } from 'redux';
import StatusScreenReducer from './status-screen-reducer';

export default combineReducers({
    status: StatusScreenReducer
})