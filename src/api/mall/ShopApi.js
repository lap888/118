import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
let ShopApi = {};

ShopApi.getHomeShops = (PageIndex, PageSize) => { // index, size
    return new Promise((resolve, reject) => {
        Send(`api/Shop/RecommendShops`, { PageIndex, PageSize })
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


ShopApi.getShopDetail = (shopId) => { // shopId
    return new Promise((resolve, reject) => {
        Send(`api/Shop/ShopDetail?shopId=${shopId}`, {}, 'get')
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

ShopApi.getMyStore = (userId) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/Shop/MyStore?userId=${userId}`, {}, 'get')
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


ShopApi.getShopType = () => {
    return new Promise((resolve, reject) => {
        Send(`api/Shop/GetShopType`, {}, 'get')
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

ShopApi.getShopsByType = (Type, Name, PageIndex, PageSize) => { // type, index, size
    return new Promise((resolve, reject) => {
        Send(`api/Shop/GetShopsByType`, { Type, Name, PageIndex, PageSize })
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

export default ShopApi