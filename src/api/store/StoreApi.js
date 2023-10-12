import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";

let StoreApi = {};


StoreApi.addStore = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Shop/AddPStore`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

StoreApi.getStoresList = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Shop/GetPStores`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

StoreApi.getStoresDetail = (id) => { 
    return new Promise((resolve, reject) => {
        Send(`api/Shop/GetPStoresDetail?storeId=${id}`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}

StoreApi.payUsdt = (params) => { 
    return new Promise((resolve, reject) => {
        Send(`api/Shop/StorePayUsdt`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data)
            }else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) =>{
            reject(err)
            console.log('err', err)
        })
    })
}



export default StoreApi