import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
// import { Toast } from "native-base";
let HistoryApi = {};

/**
 * 
 * @param {
 * "ModifyType": 23, 分红：23，
 * "PageIndex": 0, 
 * "PageSize": 0
 * } params 
 */
HistoryApi.WallerRecord = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Account/WallerRecord`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 1000,
                // })
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

/**
 * 
 * @param {
 * "Source": 90, 糖果分红：90，
 * "PageIndex": 0, 
 * "PageSize": 0
 * } params  
 */
HistoryApi.CandyRecord = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Account/CandyRecord`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                Toast.tipBottom(res.message)
                // Toast.show({
                //     text: res.message,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 1000,
                // })
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}


export default HistoryApi