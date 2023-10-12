/*
 * @Author: top.brids 
 * @Date: 2019-12-21 17:58:09 
 * @Last Modified by: top.brids
 * @Last Modified time: 2019-12-21 18:14:40
 */

import { isEmpty, isMobile, isLegalLength, isPassword, isNickname } from './BaseValidate';

export function ParamsValidate(field, value) {
    switch (field) {
        case 'mobile':
            if (isEmpty(value)) {
                return '手机号不可为空';
            } else if (!isMobile(value) || !isLegalLength(value, 11, 11)) {
                return '手机号不合法';
            } else {
                return null
            }
        case 'password':
            if (isEmpty(value)) {
                return '密码不可为空';
            } else if (!isLegalLength(value, 6, 16)) {
                return '请输入6-16位密码';
            } else if (!isPassword(value)) {
                return '密码必须是数字或字母'
            } else {
                return null
            }
        case 'vcode':
            if (isEmpty(value)) {
                return '验证码不可为空';
            } else if (!isLegalLength(value, 6, 6)) {
                return '请输入6位验证码';
            } else {
                return null
            }
        case 'nickName':
            if (isEmpty(value)) {
                return '昵称不可为空';
            } else if (!isLegalLength(value, 1, 15)) {
                return '请输入1-15位的昵称';
            } else if (!isNickname(value)) {
                return '昵称格式不正确';
            } else {
                return null
            }
    }
}