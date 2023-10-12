import CryptoJS from 'crypto-js';
import { API_PATH, AUTH_SECRET, Env } from '../config/Index';
import Cookie from 'cross-cookie';
import { Actions } from 'react-native-router-flux';

export function Send(api, data = {}, m = 'POST') {
    return new Promise((resolve, reject) => {
        Cookie.get('token')
            .then(value => {
                let token = value == null || value == '' ? '' : value;
                let sign = '';
                let timeSpan = ''
                if (token !== '') {
                    timeSpan = new Date().getTime()
                    sign = Sign(api, token, timeSpan);
                }
                let url = /^http(s*)/.test(api) ? api : API_PATH + api;
                if (Env=='dev') {
                    console.log('req', url)
                }
                if (m == 'Post' || m == 'POST' || m == 'post') {
                    fetch(url, {
                        method: m,
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token,
                            'sign': sign,
                            'timeSpan': timeSpan
                        }

                    }).then(response => {
                        return response.json();
                    }).then(resJson => {
                        if (Env=='dev') {
                            console.log('fetch ok=>', resJson);
                        }
                        resolve(resJson);
                        if (resJson.code == '10001' || resJson.code == 10001) {
                            Cookie.remove('token')
                            Actions.replace('Login', { type: 'replace' })
                        }
                    }).catch(error => {
                        console.log('fetch error=>', error);
                        reject(error)
                    });
                } else {
                    fetch(url, {
                        method: m,
                        headers: {
                            'Content-Type': 'application/json',
                            'token': token,
                            'sign': sign,
                            'timeSpan': timeSpan
                        }

                    }).then(response => {
                        return response.json();
                    }).then(resJson => {
                        if (Env == 'dev') {
                            console.log('fetch ok=>', resJson);
                        }
                        resolve(resJson);
                        if (resJson.code == '10001' || resJson.code == 10001) {
                            Cookie.remove('token')
                            Actions.replace('Login', { type: 'replace' })
                        }
                    }).catch(error => {
                        console.log('fetch error=>', error);
                        reject(error)
                    });
                }
            }).catch(error => {
                console.log('get cook error=>', error);
                reject(error);
            });
    });
}
//sign
function Sign(api, token, timeSpan) {
    let params = [];
    params.push(api.toUpperCase());
    params.push(token.toUpperCase());
    params.push(timeSpan);
    params.push(AUTH_SECRET.toUpperCase());//服务端分发对应key
    params.sort();
    let utf8Params = CryptoJS.enc.Utf8.parse(params.join(''));
    let sign = CryptoJS.MD5(utf8Params).toString(CryptoJS.enc.Hex).substring(5, 29);
    return sign;
}