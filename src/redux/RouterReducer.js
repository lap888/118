/*
 * @Author: top.brids 
 * @Date: 2020-01-15 17:24:50 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-01-15 17:26:47
 */
import * as ActionTypes from './ActionTypes';

const initialState = {
    // 版本忽略信息
    warnVersion: "1.0.0",
    isIgnored: false
};

export default RouterReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_VERSION:
            let { warnVersion, isIgnored } = action.payload;
            return {
                ...state,
                warnVersion,
                isIgnored
            };
        case ActionTypes.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}