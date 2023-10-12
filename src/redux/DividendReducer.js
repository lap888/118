/*
 * @Author: top.brids 
 * @Date: 2019-12-30 09:11:39 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-04-23 02:57:24
 */
import * as ActionTypes from './ActionTypes';

const initialState = {
    userBalance: 0,
    userBalanceTotal: 0,
    userBalanceLock: 0,
    userBalanceNormal: 0
};

export default DividendReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.UPDATE_DIVIDEND_INFO:
            let { userBalanceLock, userBalanceNormal, userBalanceTotal } = action.payload;
            return {
                ...state,
                userBalanceLock,
                userBalanceNormal,
                userBalanceTotal
            }
        case ActionTypes.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}