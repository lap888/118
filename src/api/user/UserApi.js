import { Send } from "../../utils/Http";
import { Toast } from "../../view/common";
import CryptoJS from 'crypto-js';
// import { Toast } from "native-base";
let UserApi = {};

let recommendNews = "http://martinbear-cdn.sappartneracademy.com/api/v1/news/recommendNews"

// params=section=2&pers=2&id=0
UserApi.recommendNews = (params, deviceId) => { // 
    return new Promise((resolve, reject) => {
        fetch(recommendNews + params, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'martinbear-cdn.sappartneracademy.com',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0.1; V9 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36',
                'lang': 'zh-CN',
                'uuid': deviceId,
                'platform': 'android',
                'buildversion': '2021052801',
                'appversion': '1.1.1',
                'debugtoken': 'fowin',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip'
            }
        }).then(response => {

            return response.json();
        }).then(resJson => {
            resolve(resJson);
        }).catch(error => {
            console.log('fetch error=>', error);
            reject(error)
        });
    })
}
let articleDetail = "http://martinbear-cdn.sappartneracademy.com/api/v1/news/articleDetail";

UserApi.articleDetail = (params, deviceId, id) => { // 
    return new Promise((resolve, reject) => {
        fetch(articleDetail + params, {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                'debugtoken': 'fowin',
                'appversion': '1.1.1',
                'buildversion': '2021052801',
                'platform': 'android',
                'lang': 'zh-CN',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0.1; V9 Build/V417IR; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/68.0.3440.70 Mobile Safari/537.36',
                'uuid': deviceId,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'martinbear-cdn.sappartneracademy.com',
                'Connection': 'Keep-Alive',
                'Accept-Encoding': 'gzip'
            }
        }).then(response => {
            return response.json();
        }).then(resJson => {
            resolve(resJson);
        }).catch(error => {
            console.log('fetch error=>', error);
            reject(error)
        });
    })
}

UserApi.getEquityDetail = (mobile) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/GetUserByMobile?mobile=${mobile}`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}


UserApi.setContact = (params) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/SetContact`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}


UserApi.ticketInfo = () => {
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/Info`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}
UserApi.qxyTicketInfo = () => {
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/QuxiYouInfo`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}


/**
 * @name 兑换
 * @param {} params 
 */
UserApi.exchangeTicket = (params) => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/Exchange`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

UserApi.exchangeQxyTicket = (params) => { // 
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/QxyExchange`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

/**
 * @name 记录
 * @param {*} params 
 */
UserApi.ticketRecords = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/Records`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}
/**
 * @name 使用新人券
 * @param {*} params 
 */
UserApi.useTicket = () => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/Use`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

/**
 * @name 修改是否使用新人券
 * @param {*} params 
 */
UserApi.ticketState = (params) => { // mobile
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/Switch`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

/**
 * @name 把糖果转到小鱼
 * @param {*} params 
 */
UserApi.toSmallFish = (params) => { // params
    return new Promise((resolve, reject) => {
        Send(`api/Account/ToSmallFish`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
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
/**
 * @name 查询充值订单是否成功
 * @param {*} params 
 */
UserApi.searchOrderState = (tradeNo) => { // TradeNo
    return new Promise((resolve, reject) => {
        Send(`api/Notify/QueryCashRecharge?TradeNo=${tradeNo}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(true)
                } else {
                    resolve(false)
                    // Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}
/**
 * @name 查询充值订单是否成功
 * @param {*} params 
 */
UserApi.searchWePayOrderState = (tradeNo) => { // TradeNo
    return new Promise((resolve, reject) => {
        Send(`api/Notify/WePayCashRecharge?TradeNo=${tradeNo}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

UserApi.getAddress = () => {
    return new Promise((resolve, reject) => {
        Send('api/UserAddress/List', {}, 'get').then(res => {
            if (res.code == 200) {
                resolve(res.data);
            } else {
                reject(res);
                Toast.tipBottom(res.message)
            }
        })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

UserApi.exchangeYB = (candyNum, passward) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/ExchangeYB?candyNum=${candyNum}&passward=${passward}`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}


UserApi.exchangeXfq = (candyNum, passward) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/ExchangeXfq?candyNum=${candyNum}&passward=${passward}`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}
UserApi.exchangeGcx = (candyNum, passward) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/ExchangeGcx?candyNum=${candyNum}&passward=${passward}`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}
UserApi.ExchangeTicket = (candyNum, passward) => {
    return new Promise((resolve, reject) => {
        Send(`api/Trade/ExchangeTicket`, { Amount: candyNum, TradePwd: passward }, 'post')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

// 

UserApi.exchangeNL = (candyP, passward) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/ExchangeNL?candyP=${candyP}&passward=${passward}`, {}, 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

/**
 * @name 贡献值流水
 * @param {*} params 
 */
UserApi.getGlodsRecord = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/GlodsRecord`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res)
                } else {
                    Toast.tipBottom(res.message)
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}



export default UserApi