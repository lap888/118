import { Send } from "../../../utils/Http";
import { Toast } from "../../../view/common";
let CurrencyApi = {};


CurrencyApi.getActiveList = (source) => {
    return new Promise((resolve, reject) => {
        Send(`api/system/banners?source=${source}`, {}, 'GET')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    reject(res)
                    Toast.tipBottom(res.message);
                }
            })
            .catch((err) => {
                reject(err)
                console.log('err', err)
            })
    })
}

/**
 * 矿机列表
 */
CurrencyApi.getMinningList = () => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/MinningList`, '', 'get')
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

CurrencyApi.getVideoList = () => {
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/GetTodayVideoRecords2`, '', 'get')
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
CurrencyApi.getCoinAmount = (type) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/FindCoinAmount?type=${type}`, '', 'get')
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
 * 商店矿机列表
 */
CurrencyApi.getTasksShop = (status) => {
    return new Promise((resolve, reject) => {
        Send(`api/System/TasksShop2?status=${status}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
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
 * 兑换矿机
 */
CurrencyApi.exchange = (minningId) => {
    return new Promise((resolve, reject) => {
        Send(`api/System/Exchange2?minningId=${minningId}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
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

CurrencyApi.GetCanExMingings = () => {
    return new Promise((resolve, reject) => {
        Send(`api/System/GetCanExMingings`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
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
 * @name 获取各个币种记录
 * @param {*} params 
 */
CurrencyApi.getCoinRecord = (params) => { // params
    return new Promise((resolve, reject) => {
        Send(`api/Coin/CoinRecord`, params)
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
 * @name 获取各个币种记录
 * @param {*} params 
 */
CurrencyApi.getJifenRecord = (params) => { // params
    return new Promise((resolve, reject) => {
        Send(`api/Ticket/JifenRecord`, params)
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
 * @name 获取抽奖记录
 * @param {*} params 
 */
CurrencyApi.getZpLuckRecord = (params) => { // params
    return new Promise((resolve, reject) => {
        Send(`api/Coin/ZpLuckRecord`, params)
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
 * @name 挖矿&收取
 * @param {*} mid 
 */
CurrencyApi.doTask = (mid) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/DoTask?mId=${mid}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
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
 * @name 检查是否为会员
 * @param {*} 
 */
CurrencyApi.findIsMerber = () => {
    return new Promise((resolve, reject) => {
        Send(`api/UserAli/FindIsMerber`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tipBottom(res.message)
                    reject(res)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @name 充值会员
 * @param {*} type 
 */
CurrencyApi.exchangeMerber = (type, payType) => {
    return new Promise((resolve, reject) => {
        Send(`api/UserAli/ExchangeMerber?Type=${type}&payType=${payType}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
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
 * @name 区块链浏览器
 * @param {*} params 
 */
CurrencyApi.blockBrowser = (type, hash, pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/BlockBrowser?type=${type}&hash=${hash}&pageIndex=${pageIndex}&pageSize=${pageSize}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tip(res.message)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @name 问题反馈
 * @param {*} params 
 */
CurrencyApi.feedback = (params) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/Feedback`, params)
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tip(res.message)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @name 问题反馈记录
 * @param {*} params 
 */
CurrencyApi.feedbackRecord = (pageIndex, pageSize) => {
    return new Promise((resolve, reject) => {
        Send(`api/Coin/FeedbackRecord?pageSize=${pageSize}&pageIndex=${pageIndex}`, '', 'get')
            .then((res) => {
                if (res.code == 200) {
                    resolve(res.data)
                } else {
                    Toast.tip(res.message)
                }
            })
            .catch((err) => {
                reject(err)
            })
    })
}


export default CurrencyApi