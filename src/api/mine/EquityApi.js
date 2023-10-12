import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
// import { Toast } from "native-base";

let EquityApi = {};

EquityApi.getEquityDetail = () => {
    return new Promise((resolve, reject) => {
        Send('api/Equity/EquityPage', {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                Toast.tipBottom(res.message);
                // Toast.show({
                //     text: `${res.message}`,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 2000,
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
 * @name 股权兑换
 * @param {
 * } params 
 */
EquityApi.exchangeEquity = (params) => {
    return new Promise((resolve, reject) => {
        Send('api/Equity/ExchangeEquity', params)
        .then((res) => {
            if (res.code == 200) {
                resolve(true)
            }else{
                Toast.tipBottom(res.message);
                // Toast.show({
                //     text: `${res.message}`,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 2000,
                // })
                resolve(false)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}
/***
 * @name 股权转让
 * @param  PayPwd_string
 * @param Mobile_string
 * @param Shares_number
 */
EquityApi.transferEquity = (params) => {
    return new Promise((resolve, reject) => {
        Send('api/Equity/TransferEquity', params)
        .then((res) => {
            if (res.code == 200) {
                resolve(true)
            }else{
                Toast.tipBottom(res.message);
                // Toast.show({
                //     text: `${res.message}`,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 2000,
                // })
                resolve(false)
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
 * @param {PageIndex, PageSize} params 
 */
EquityApi.EquityRecords = (params) => {
    return new Promise((resolve, reject) => {
        Send('api/Equity/EquityRecords', params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else{
                Toast.tipBottom(res.message);
                // Toast.show({
                //     text: `${res.message}`,
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //     duration: 2000,
                // })
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}




export default EquityApi;