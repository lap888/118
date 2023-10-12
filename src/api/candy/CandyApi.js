import { Toast } from "../../view/common";
import { Send } from "../../utils/Http";

let CandyApi = {};


CandyApi.setObtainIntegral = () => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Account/ObtainIntegral`, {}, 'get')
        .then((res) => {
            if (res.code === 200) {
                resolve(res.data)
            }else{
                reject(res);
                Toast.tip(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
        })
    })
}

CandyApi.getIntegral = () => {  
    return new Promise((resolve, reject) => {
        Send(`api/Account/Integral`, {}, 'get')
        .then((res) => {
            if (res.code === 200) {
                resolve(res.data)
            }else{
                reject(res);
                Toast.tip(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

CandyApi.setObtainIntegral2 = () => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Account/ObtainIntegral2`, {}, 'get')
        .then((res) => {
            if (res.code === 200) {
                resolve(res.data)
            }else{
                reject(res);
                Toast.tip(res.message)
            }
        }) 
        .catch((err) =>{
            reject(err)
        })
    })
}

CandyApi.getExchangeIntegral = () => {  
    return new Promise((resolve, reject) => {
        Send(`api/Account/ExchangeIntegral`, {}, 'get')
        .then((res) => {
            if (res.code === 200) {
                resolve(res.data)
            }else{
                reject(res);
                Toast.tip(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}




export default CandyApi