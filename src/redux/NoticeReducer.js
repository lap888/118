/*
 * @Author: top.brids 
 * @Date: 2020-01-15 17:25:58 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-08-18 23:21:02
 */
import * as ActionTypes from './ActionTypes';

const initialState = {
    id: 0,
    title: "",
    content: "",
    isReaded: true
};

export default NoticeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_NOTICE_INFO:
            let { id, title, content,ceratedAt } = action.payload;
            if (id === state.id) {
                return state
            }
            return {
                ...state,
                id,
                title,
                content,
                ceratedAt,
                isReaded: false
            }
        case ActionTypes.UPDATE_NOTICE_STATUS:
            return {
                ...state,
                isReaded: false
            }
        case ActionTypes.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}