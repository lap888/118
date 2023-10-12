/*
 * @Author: top.brids 
 * @Date: 2019-12-22 18:08:09 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-22 23:08:40
 */
import * as ActionTypes from './ActionTypes';
const initialState = {
    showIndicator: false,
    miningTime: null,
    collectTime: null,
    // 新版
    taskTypeList: [],     // 任务列表
    taskList: [],        // 我的任务列表
    taskListHistory: [],       // 历史矿机列表

    // 运行矿机列表
    // miningMachines: [
    //     { minning_name: "初级矿机", activity_level: 1, bootTime: "Fri Dec 22 2018 10:15:24 GMT+0800 (CST)", shutdownTime: "Fri Dec 22 2018 17:40:24 GMT+0800 (CST)" },
    //     { minning_name: "初级矿机", activity_level: 1, bootTime: "Fri Dec 22 2018 10:15:24 GMT+0800 (CST)", shutdownTime: "Fri Dec 22 2018 17:40:24 GMT+0800 (CST)" },
    //     { minning_name: "中级矿机", activity_level: 1, bootTime: "Fri Dec 22 2018 10:15:24 GMT+0800 (CST)", shutdownTime: "Fri Dec 22 2018 17:40:24 GMT+0800 (CST)" },
    //     { minning_name: "初级矿机", activity_level: 1, bootTime: "Fri Dec 22 2018 10:15:24 GMT+0800 (CST)", shutdownTime: "Fri Dec 22 2018 17:40:24 GMT+0800 (CST)" },
    // ],
    miningMachines: [
    ],
    // // 基础活跃度
    // baseActivity: 10,
    // 加成活跃度
    additionActivity: 0,
    // 秒产能(固定参数)
    productionCapacity: 0.00003395,
    // 今日挖矿状态(挖矿生命周期的状态) 0 待开启 1 挖矿中 2 待收取 3 已完成
    status: 0
};
export default MiningReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.TASK_LIST:
            return {
                ...state,
                taskList: action.payload.taskList
            }
        case ActionTypes.TASK_TYPE_LIST:
            return {
                ...state,
                taskTypeList: action.payload.taskTypeList
            }
        case ActionTypes.TASK_LIST_HISTORY:
            return {
                ...state,
                taskListHistory: action.payload.taskListHistory
            }

        default:
            return state;
    }
}