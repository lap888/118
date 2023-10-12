/*
 * @Author: top.brids 
 * @Date: 2019-12-21 08:47:43 
 * @Last Modified by:   top.brids 
 * @Last Modified time: 2019-12-21 08:47:43 
 */
export default class MathFloat {

    /**
     * 重写toFixed 小数向下截取
     */
    static floor = (number, pow) => {
        if (!number) number = 0;
        return Math.floor(number * Math.pow(10, pow)) / Math.pow(10, pow);
    }
}