/*
 * @Author: top.brids 
 * @Date: 2019-12-21 21:02:57 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-04-17 18:37:46
 */
import * as ActionTypes from './ActionTypes';
// {
//     id:1,
//     type: 1,
//     describe: "",
//     content: "",
//     sort: 0
// }
const initialState = {
    taskId: 0,
    userPic: "",
    project: "",
    title: "",
    cateId: 0,
    desc: "",
    submitHour: 1,
    auditHour: 24,
    isRepeat: 1,
    rewardType: 2,
    unitPrice: 0,
    total: 0,
    remainderCount: 0,
    commission: 0,
    finishCount: 0,
    steps: [
    ],
    state: 0
}

export default YoBangReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.Add_Task:
            return {
                ...state,
                ...action.payload.taskBase,
            }
        case ActionTypes.Add_Task_Step:
            return {
                ...state,
                steps: action.payload.taskStep,
            }
        case ActionTypes.Modify_Task_submitHour:
            return {
                ...state,
                submitHour: action.payload.submitHour,
            }
        case ActionTypes.Modify_Task_auditHour:
            return {
                ...state,
                auditHour: action.payload.auditHour,
            }
        case ActionTypes.Modify_Task_project:
            return {
                ...state,
                project: action.payload.project,
            }
        case ActionTypes.Modify_Task_title:
            return {
                ...state,
                title: action.payload.title,
            }
        case ActionTypes.Modify_Task_desc:
            return {
                ...state,
                desc: action.payload.desc,
            }
        case ActionTypes.Modify_Task_isRepeat:
            return {
                ...state,
                isRepeat: action.payload.isRepeat,
            }
        case ActionTypes.Modify_Task_rewardType:
            return {
                ...state,
                rewardType: action.payload.rewardType,
            }

        case ActionTypes.Modify_Task_rewardType:
            return {
                ...state,
                rewardType: action.payload.rewardType,
            }
        case ActionTypes.Modify_Task_unitPrice:
            return {
                ...state,
                unitPrice: action.payload.unitPrice,
            }
        case ActionTypes.Modify_Task_total:
            return {
                ...state,
                total: action.payload.total,
            }
        case ActionTypes.Modify_Task_cateId:
            return {
                ...state,
                cateId: action.payload.cateId,
            }
        case ActionTypes.Modify_Task_remainderCount:
            return {
                ...state,
                remainderCount: action.payload.remainderCount,
            }
        case ActionTypes.Modify_Task_commission:
            return {
                ...state,
                commission: action.payload.commission,
            }
        default:
            return state;
    }
}