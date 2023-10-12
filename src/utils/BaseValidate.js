/*
 * @Author: top.brids 
 * @Date: 2019-12-21 17:57:52 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-03-16 12:08:58
 */

// 检验值是否为空
export function isEmpty(value1) {
    let value = value1.trim();
    return (value === '' || value === null || value === undefined);
};

// 检验邮箱是否合法
export function isEmail(value) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
};

// 检验手机号是否合法
export function isMobile(value) {
    const mobileRegex = /^1[3456789]\d{9}$/;
    return mobileRegex.test(value);
}

// 字符长度是否符合要求
export function isLegalLength(value, minLength, maxLength) {
    length = value.trim().length;
    return (minLength <= length && length <= maxLength);
}

/* 昵称必须是数字、字母、汉字或它们的组合 */
export function isNickname(value) {
    const nicknameRegex = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;
    return nicknameRegex.test(value);
}

/* 登录密码是数字或字母或数字和字母的组合校验 */
export function isPassword(value) {
    const passwordRegex = /^[0-9a-zA-Z]*$/;
    return passwordRegex.test(value);
}

/**
 * 随机生成一个字
 * @param {} value 
 */
export function freeGenWord() {
    const familyNames = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐钟离宇文长孙慕容鲜于闾丘司徒司空丌官司寇仉督子车颛孙端木巫马公西漆雕乐正壤驷公良拓跋夹谷宰父谷梁晋楚闫法汝鄢涂钦段干百里东郭南门呼延归海羊舌微生岳帅缑亢况郈有琴梁丘左丘东门西门商牟佘佴伯赏南宫墨哈谯笪年爱阳佟";
    var i = parseInt(familyNames.length * Math.random());
    var familyName = familyNames.substr(i, 1);
    return familyName;
}
/**
 * 字符长度截取
 * @param {} value 
 */
export function interception(str = '', number = 0) {
    const value = String(str);
    if (number === 0) {
        return value;
    } else if (str.length < number) {
        return value;
    } else {
        return str.substring(0, Number(number)) + '...';
    }
}
/**
 * 隐藏字符串中间部分
 * @param {*} str tr：要进行隐藏的变量
 * @param {*} frontLen frontLen: 前面需要保留几位
 * @param {*} endLen endLen: 后面需要保留几位
 * @returns 
 */
export function hiddenStr(str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = "";
    for (var i = 0; i < len; i++) {
        xing += "*";
    }
    return (
        str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
    );
}
/**
 * @name 生成随机数
 * @param {开始} start 
 * @param {结束} end 
 * @param {几位小数} fixed 
 */
export function getRandom(start, end, fixed = 0) {
    let differ = end - start
    let random = Math.random()
    return (start + differ * random).toFixed(fixed)
}