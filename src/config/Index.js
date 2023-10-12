/*
 * @Author: top.brids 
 * @Date: 2019-12-20 14:24:23 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-02-24 15:02:31
 */
const env = require('./Env');
const Config = require('./Config.env.json');
const version = require('./Version.json').version;

global.API_PATH = Config[env]['API_PATH'];

module.exports = {
    Env: env,
    Version: version,
    CodePushKey:Config[env]['CodePushKey'],
    CodePushKeyIos:Config[env]['CodePushKeyIos'],
    PIC_PATH:Config[env]['PIC_PATH'],
    API_PATH: Config[env]['API_PATH'],
    WEB_PATH:Config[env]['WEB_PATH'],
    AUTH_SECRET: Config[env]['AUTH_SECRET']
};