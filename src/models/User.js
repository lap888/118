/* 单例类
 * @Author: top.brids 
 * @Date: 2019-12-21 20:09:27 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-21 20:16:02
 */
class User {
    constructor() {
        this.data = {};
    }
    /**
     * 
     * @param {*} data 保存用户数据
     */
    setData(data) {
        this.data = data;
    }
    /**
     * 获取用户数据
     */
    getData() {
        return this.data;
    }

    /**
     * 获取用户ID
     */
    getUserId() {
        return this.data.id;
    }
    /**
     * 获取用户手机号
     */
    getUserMobile() {
        return this.data.mobile;
    }

    /**
     * 设置用户登录flag
     * @param {*} flag bool
     */
    setLoginMark(flag) {
        this.data.logged = flag;
    }

    isLoggedIn() {
        return this.data.logged;
    }

    /**
     * 设置消息未读数
     * @param {*} No number
     */
    setProfileNo(No) {
        this.Pcount = No || 0;
    }
    /**
     * 获取消息未读数
     */
    getProfileNo() {
        return this.Pcount;
    }

}
export default new User;