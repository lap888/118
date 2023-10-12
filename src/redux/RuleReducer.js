import * as ActionTypes from './ActionTypes';

const initialState = {
    // 规则忽略信息
    isIgnored: false
};

export default RuleReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.IGNORE_TRANSATION_RULE:
            return {
                ...state,
                isIgnored: true
            };
        case ActionTypes.LOGOUT:
            return {
                ...initialState
            }
        default:
            return state;
    }
}