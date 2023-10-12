import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
let OrderApi = {};

OrderApi.subOrder = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Shop/SubOrder`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data);
            } else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) => {
            reject(err)
            console.log('err', err)
        })
    })
}

OrderApi.getOrderList = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Shop/FindShopOrder`, params)
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data);
            } else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) => {
            reject(err)
            console.log('err', err)
        })
    })
}

//确认收货
OrderApi.sureGet = (orderId) => { // orderId
    return new Promise((resolve, reject) => {
        Send(`api/Shop/SureGet?orderId=${orderId}`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data);
            } else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) => {
            reject(err)
            console.log('err', err)
        })
    })
}

//取消订单
OrderApi.cancleOrder = (orderId) => { // orderId
    return new Promise((resolve, reject) => {
        Send(`api/Shop/CancleOrder?orderId=${orderId}`, {}, 'get')
        .then((res) => {
            if (res.code == 200) {
                resolve(res.data);
            } else {
                reject(res)
                Toast.tipBottom(res.message)
            }
        })
        .catch((err) => {
            reject(err)
            console.log('err', err)
        })
    })
}


export default OrderApi