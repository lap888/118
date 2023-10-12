import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
// import { Toast } from "native-base";
let TaskApi = {};


TaskApi.startTask = (pId) => { // 
    return new Promise((resolve, reject) => {
        Send(`api/System/DoTask2?pId=${pId}`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

TaskApi.quickenTask = () => { // 
    return new Promise((resolve, reject) => {
        Send(`api/System/QuickenTask`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

TaskApi.lookDayVideo = (vId,pId) => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/LookTodayVideo2?vId=${vId}&pId=${pId}`, {}, 'get')
        .then((res) => {
            resolve(res)
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}


TaskApi.vipDoTask = () => { 
    return new Promise((resolve, reject) => {
        Send(`api/Coin/VipDoTask`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                reject(res)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}




export default TaskApi