/*
 * @Author: top.brids 
 * @Date: 2019-12-20 14:19:29 
 * @Last Modified by: top.brids
 * @Last Modified time: 2022-03-19 15:34:46
 */
const TaskType = require('./TaskConfig.json').task;
//mock data
//1. banner
const Banner_Mock = [
    { id: 0, imageurl: '/Banner/2bcc1032-aee4-4bfc-9128-2a123161a4a2.png' },
    { id: 1, imageurl: '/Banner/2bcc1032-aee4-4bfc-9128-2a123161a4a2.png' },
    { id: 2, imageurl: '/Banner/2bcc1032-aee4-4bfc-9128-2a123161a4a2.png' },
];
//2.message title
const Message_Mock = [
    { id: 0, title: '118创富助手今日上线公测' },
    { id: 2, title: '关于星级达人的问题' }
];
const Message2_Mock = [
    { id: 0, title: '118创富助手今日上线公测', tCreatAt: '2019-12-20 20:00:00' },
    { id: 2, title: '关于星级达人的问题', tCreatAt: '2019-12-21 20:00:00' }
];
//3.message detail
const Message_Detail_Mock = { id: 1, cerated_at: '2019-12-21 20:00:00', content: '118创富助手今日上线公测 欢迎大家积极反馈' };

//4.userInfo mock
const UserInfo_Mock = { id: 10003, gemNum: 100, name: 'top', mobile: '18333103619', logged: false, avatarUrl: '/Banner/a1bfd353-22d2-47e0-9aef-39af14088b3d.png', auditState: 0, token: '' };
//5.百问百答
const FQAMock = { title: '百问百答', content: `<p>蔚州简单来说就是一款集 线下店铺导流以及用户信息发布为一体的微服务平台！</p><p>用户群体区域划分 就是赞蔚州“老百姓”</p><p><br/></p><p>一.首页店铺引流</p><p><img src="https://kumili.net/Upload_Temp/20191130152103705365.png" title="image.png" alt="" width="423" height="918"/></p><p>如果你想让开店 请点击个人中心 申请开店即可！</p><p><img src="https://kumili.net/Upload_Temp/20191130152237443412.png" title="image.png" alt=""/></p><p>二. 信息发布&nbsp;</p><p>如果你有需要发布的信息 可以在信息市场发布！</p><p><img src="https://kumili.net/Upload_Temp/20191130152339211562.png" title="image.png" alt=""/></p><p>三 蔚县的景点</p><p>你可以在景点旅游查看蔚县的景点</p><p><img src="https://kumili.net/Upload_Temp/20191130152624815264.png" title="image.png" alt=""/></p><p><br/></p><p><br/></p>` }
//6.mock团队会员
const teamList_Mock = [
    { id: 1, phoneNumber: '18333103619', avatar: '/Banner/3a361976-36ec-4858-b73d-e7a0b56f6f72.png', name: 'top', teamNumber: 1, teamActivity: 1, isCertified: 1, star_level: 0, pushCount: 0, pushAuthCount: 0, ctime: '2019-12-24' },
    { id: 2, phoneNumber: '18333103619', avatar: '/Banner/3a361976-36ec-4858-b73d-e7a0b56f6f72.png', name: 'top1', teamNumber: 1, teamActivity: 1, isCertified: 1, star_level: 0, pushCount: 0, pushAuthCount: 0, ctime: '2019-12-24' },
    { id: 3, phoneNumber: '18333103619', avatar: '/Banner/3a361976-36ec-4858-b73d-e7a0b56f6f72.png', name: 'top2', teamNumber: 1, teamActivity: 1, isCertified: 1, star_level: 0, pushCount: 0, pushAuthCount: 0, ctime: '2019-12-24' },
    { id: 4, phoneNumber: '18333103619', avatar: '/Banner/3a361976-36ec-4858-b73d-e7a0b56f6f72.png', name: 'top3', teamNumber: 1, teamActivity: 1, isCertified: 1, star_level: 0, pushCount: 0, pushAuthCount: 0, ctime: '2019-12-24' }
];
const Team_Member_Mock = { number: 100, directPushNum: 20, activity: 500, communityActivity: 400, regionActivity: 100, star_level: 2, totalPage: 1, teamList: teamList_Mock, pushAuthCount: 0 };
//7.糖果流水
const gemRecordArr_Mock = [
    { id: 0, description: "任务领取糖果", createdAt: "2019-12-27 12:00", num: 0.366 },
    { id: 1, description: "任务领取糖果", createdAt: "2019-12-26 12:00", num: 0.366 },
    { id: 2, description: "出售1个糖果手续费0.5", createdAt: "2019-12-26 11:00", num: -1.5 }
];
const CandyList_Mock = { id: 0, freezeGemNum: 1.5, gemNum: 100, gemRecordArr: gemRecordArr_Mock, totalPage: 1 }
//8.果核明细
const activityList_Mock = [
    { id: 0, createdAt: '2019-12-28 12:23', minner: 1, actAdd: 0.05 },
    { id: 1, createdAt: '2019-12-28 12:23', minner: 1, actAdd: 0.05 }
];
const CandyHList_Mock = { resAA: 1.11, resBA: 2.34, activityList: activityList_Mock, totalPage: 1 };
//9.果皮明细

const activityPList_Mock = [
    { id: 0, createdAt: '2019-12-28 12:23', content: '开启超级任务', rep: 1200 },
    { id: 1, createdAt: '2019-12-28 12:23', content: '开启初级任务', rep: 22 },
    { id: 3, createdAt: '2019-12-28 12:23', content: '出售一个糖果', rep: -1 }
];
const CandyPList_Mock = { activityList: activityPList_Mock, totalPage: 1 };
const CandyP_Rule = {
    title: '果皮规则',
    rules: [
        {
            key: '0', title: `果皮价值`, text: `LV1卖一个扣1.50糖果跟1.50果皮\r\nLV2卖一个扣1.35糖果跟1.35果皮\r\nLV3卖一个扣1.30糖果跟1.30果皮\r\nLV4卖一个扣1.28糖果跟1.28果皮\r\nLV5卖一个扣1.25糖果跟1.25果皮\r\n同时扣除！缺一不可！`
        },
        {
            key: '1', title: `果皮获取途径`, text: `1.每直推一名用户【实名】可增加2果皮\r\n2.每购买1个糖果可增加2个果皮\r\n3.兑换任务增加果皮\r\n4.分享广告到朋友圈或者分享给好友，只要有朋友帮点，那么分享者可以获得0.02-0.08个果皮，无上限，点的越多送的越多「强调 每个人每天只能帮一个人点一次， 多次点击或帮多人都无效」每个广告系统每天释放500个果皮红利，每次进入广告会系统提示该广告还剩下多少果皮，提示剩余果皮为0时，分享出去朋友点击也不会有果皮赠送！\r\n5.复投任务送果皮\r\n\t初阶任务包15果皮\r\n\t初级任务30果皮\r\n\t中级任务300果皮\r\n\t高级任务900果皮\r\n\t高阶任务包2000果皮\r\n\t超级任务5000果皮`
        },
    ]
}
//10.提现记录
const Ti_Xian = [

];
const Ti_Xian_R = { withdrawHistory: Ti_Xian, totalPage: 1 }
const Wallet_R = {
    totalPage: 1,
    withdrawHistory: [
    ]
}
// 首页功能Buttun
const HOME_OPTIONS = [
    { key: 0, name: "任务商店", route: 'Task', icon: 'tasks', image: require('../view/images/host/kuangji.png') },
    // { key: 1, name: "免费小说", route: 'xBook', icon: 'graduation-cap', image: require('../view/images/host/news.png') },
    { key: 2, name: "新手指南", route: 'College', icon: 'graduation-cap', image: require('../view/images/host/xinshou.png') },
    // { key: 6, name: "好玩荣耀", route: 'QuanMinTask', icon: 'graduation-cap', image: require('../view/images/home/quanmingtask1.gif') },
    { key: 3, name: "我的团队", route: 'MyTeam', icon: 'user-md', image: require('../view/images/host/team.png') },
    { key: 4, name: "邀请好友", route: 'BitCoinNews', icon: 'user-md', image: require('../view/images/host/friends.png') },
    // { key: 1, name: "拉新排行", route: 'PushUserBang', icon: 'user-md', image: require('../view/images/home/fenxiangph.png') },
    // { key: 4, name: "收购排行", route: 'AcquisitionRanking', icon: 'user-md', image: '', image: "require('../../images/GoToWard.gif')" },
    // { key: 3, name: "分享排行", route: 'BuyCandyBang', icon: 'trophy', image:  require('../view/images/home/fenxiangph.png')},
    // { key: 12, name: '城市大厅', icon: 'flash', route: 'CityShow', image: require('../view/images/my/chengshidating.png') },
    // { key: 8, name: "话费充值", route: 'TelphoneRecharge', icon: 'flash', image: require('../view/images/home/huafeicz.png') },

    // { key: 8, name: "帮帮赚", route: 'Zbangbang', icon: 'flash', image: require('../view/images/home/fenxiangph.png') },
    // { key: 10, name: "消费券", route: 'XfqScreen', icon: 'flash', image: require('../view/images/mine/laxin.png') },
    // { key: 11, name: "2.0入口", route: 'Home2Screen', icon: 'flash', image: require('../view/images/home/erdianling.png') },
    // { key: 10, name: "拼多多", route: 'PinDuoduoShop', icon: 'flash', image: require('../view/images/home/pingduoduo.png') },
    // { key: 7, name: "一键加油", route: 'YouKa', icon: 'barcode', image: require('../view/images/home/yijianjy.png') },
    // { key: 13, name: "游戏", route: 'Game', icon: 'flash', image: require('../view/images/home/youxi.png')},
    // { key: 12, name: "YOYO", route: 'Block', icon: 'flash', image: require('../view/images/home/yobang.png')},
    // { key: 9, name: "活动分享", route: 'ActiveScreen', icon: 'flash', image: require('../view/images/home/huodong.png')},

];
// 首页功能Buttun
const HOME_OPTIONS2 = [
    // { key: 4, name: "拼多多", route: 'PinDuoduoShop', icon: 'trophy', image: "require('../../images/GoToWard.gif')" },
    // { key: 5, name: "淘宝商城", route: 'TaoBaoShop', icon: 'globe', image: "require('../../images/GoToWard.gif')" },
    // { key: 6, name: "幸运夺宝", route: 'notOpen', icon: 'comments', image: '' },
    { key: 6, name: "交易大厅", route: 'Otc', icon: 'comments', image: '' },
    { key: 7, name: "一键加油", route: 'YouKa', icon: 'barcode', image: '' },
    { key: 8, name: "话费充值", route: 'TelphoneRecharge', icon: 'flash', image: '' },
    // { key: 9, name: "哟哟抽奖", route: 'GoToReward', icon: 'globe', image: "require('../../images/GoToWard.gif')" }
];
const HOME_OPTIONS3 = [
    { key: 8, name: "哟哟抽奖", route: 'GetReward', icon: 'trophy' }
];
//首页预加载bar
let PROFILE_BAR = [
    { key: "5", keyname: "gc", title: "GC", name: 'GC明细', router: "GC" },
    { key: "3", keyname: "candyNum", title: "钻石", name: '钻石明细', router: "CandyDetail" },
    { key: "2", keyname: "candyP", title: "荣耀值", name: '荣耀值明细', router: "CandyP" },
    { key: "1", keyname: "candyH", title: "荣耀碎片", name: '荣耀碎片明细', router: "CandyH" },
    // { key: "6", keyname: "gcx", title: "GCX", name: 'GCX明细', router: "GCX" }
];

// 任务配置参数列表
const TASK_OPTIONS_LIST = {
    0: { "minning_id": 0, "minning_name": "试炼矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#fd2701' },
    1: { "minning_id": 1, "minning_name": "初级矿机", "gem_in": 10, "gem_out": 11, "minning_time": "4h", "activity_level": 1, "color": '#4cc7ab' },
    2: { "minning_id": 2, "minning_name": "中级矿机", "gem_in": 100, "gem_out": 120, "minning_time": "4h", "activity_level": 10, "color": '#1e93f6' },
    3: { "minning_id": 3, "minning_name": "高级矿机", "gem_in": 1000, "gem_out": 1280, "minning_time": "4h", "activity_level": 100, "color": '#127f07' },
    4: { "minning_id": 4, "minning_name": "超级矿机", "gem_in": 10000, "gem_out": 13500, "minning_time": "4h", "activity_level": 1000, "color": '#994dd7' },
    5: { "minning_id": 5, "minning_name": "专家矿机", "gem_in": 100000, "gem_out": 14000, "minning_time": "4h", "activity_level": 100000, "color": '#a603a8' }
};
//我的任务
// name, minning_time, source, gem_num, minning_id, state, begin_time, end_time
const My_Task_Mock = [
    { key: 1, name: '高级任务', minning_time: '2019-10-1 09:10', source: 100, gem_num: 1200, minning_id: 3, state: 2, begin_time: '2019-10-1 09:10', end_time: '2019-11-1 09:10' },
    { key: 2, name: '高级任务', minning_time: '2019-10-1 09:10', source: 100, gem_num: 1200, minning_id: 3, state: 2, begin_time: '2019-10-1 09:10', end_time: '2019-11-1 09:10' },
    { key: 3, name: '超级任务', minning_time: '2019-10-1 09:10', source: 100, gem_num: 1200, minning_id: 4, state: 2, begin_time: '2019-10-1 09:10', end_time: '2019-11-1 09:10' }
]

// 星级达人名称
const STAR_LEVEL = ["暂无等级", "一星达人", "二星达人", "三星达人", "四星达人", "五星达人"];
// 1. 等级：一星达人 要求：直推实名20人且团队活跃度500点 奖励：一个初级任务且全球交易手续费5%
// 2. 等级：二星达人 要求：直推实名20人且团队活跃度2000点且小区活跃度400点 奖励：一个中级任务且全球交易手续费20%
// 3. 等级：三星达人 要求：直推实名20人且团队活跃度8000点且小区活跃度2000点 奖励：一个高级任务且全球交易手续费15%
// 4. 等级：四星达人 要求：直推实名20人且团队活跃度25000点且小区活跃度10000点 奖励：一个超级任务且全球交易手续费5%
// 星级达人升级指南
const STAR_LEVEL_DETAILS = [
    {
        key: 0, name: "一星达人", reward: "奖励：一个初级任务且全球交易手续费5%", request: `直推实名20人且团队活跃度500点`
    },
    {
        key: 1, name: "二星达人", reward: "奖励：一个中级任务且全球交易手续费20%", request: `直推实名20人且团队活跃度2000点且小区活跃度400点`
    },
    {
        key: 2, name: "三星达人", reward: "奖励：一个高级任务且全球交易手续费15%", request: `直推实名20人且团队活跃度8000点且小区活跃度2000点`
    },
    {
        key: 3, name: "四星达人", reward: "奖励：一个超级任务且全球交易手续费5%", request: `直推实名20人且团队活跃度100000点且小区活跃度25000点`
    },
    { key: 4, name: "团队活跃度", reward: "", request: "团队实名成员越多团队活跃度越多 团队成员开任务越多团队活跃度越多 团队成员无任务则相应减去团队活跃度" },
    { key: 5, name: "大区活跃度", reward: "", request: "最高的两个团队的团队活跃度之和" },
    { key: 6, name: "小区活跃度", reward: "", request: "除最高的两个团队的团队活跃度外 其他团队活跃度之和;如果小区活跃度大于大区活跃度则小区活跃度成为大区活跃度" }
];
const STAR_LEVEL_DETAILS2 = {
    title: '团队规则',
    rules: [
        {
            key: 0, title: "一星达人", text: `奖励：一个初级任务且全球交易手续费10%且奖励哟帮放单全球手续费10% \r\n要求：直推实名20人且团队活跃度达到500点`
        },
        {
            key: 1, title: "二星达人", text: "奖励:一个中级任务且全球交易手续费20%且奖励哟帮放单全球手续费20% \r\n要求:直推实名20人且团队活跃度2000点且小区活跃度400点且直推中包含两个一星",
        },
        {
            key: 2, title: "三星达人", text: "奖励:一个高级任务且全球交易手续费15%且奖励哟帮放单全球手续费15% \r\n要求:直推实名20人且团队活跃度8000点且小区活跃度2000点且直推中包含两个二星",
        },
        {
            key: 3, title: "四星达人", text: "奖励:一个超级任务且全球交易手续费10%且奖励哟帮放单全球手续费10% \r\n要求:直推实名20人且团队活跃度100000点且小区活跃度25000点且直推中包含两个三星",
        },
        {
            key: 4, title: "五星达人", text: "奖励:一个超级任务且全球交易手续费5%且奖励哟帮放单全球手续费5% \r\n要求:直推实名20人且团队活跃度1000000点且小区活跃度250000点且直推中包含两个四星",
        },
        { key: 5, title: "团队活跃度", text: "团队实名成员越多团队活跃度越多 团队成员开任务越多团队活跃度越多 团队成员任务到期则相应减去团队活跃度" },
        { key: 6, title: "大区活跃度", text: "最高的两个团队的团队活跃度之和" },
        { key: 7, title: "小区活跃度", text: "除最高的两个团队的团队活跃度外 其他团队活跃度之和;如果小区活跃度大于大区活跃度则小区活跃度成为大区活跃度" }
    ]
};
const CandyHDetail = {
    title: '果核规则',
    rules: [
        { key: '0', title: `果核价值`, text: `1、果核越多糖果产量越高` },
        {
            key: '1', title: `果核来源`, text: `1.任务果核(任务商店兑换)\r\n2.推广果核加成\r\n邀请的下级实名认证通过（下级任务的5%）`
        },
    ]
};
// 1. 团队活跃度：团队实名成员越多团队活跃度越多，团队成员开任务越多团队活跃度越多，团队成员无任务则相应减去团队活跃度
// 2. 大区活跃度：最高的两个团队的团队活跃度之和
// 3. 小区活跃度：除最高的两个团队的团队活跃度外，其他团队活跃度之和
const TEAM_CANDY = [
    { key: 0, name: "团队活跃度", content: "团队实名成员越多团队活跃度越多 团队成员开任务越多团队活跃度越多 团队成员无任务则相应减去团队活跃度" },
    { key: 1, name: "大区活跃度", content: "最高的两个团队的团队活跃度之和" },
    { key: 2, name: "小区活跃度", content: "除最高的两个团队的团队活跃度外 其他团队活跃度之和;如果小区活跃度大于大区活跃度则小区活跃度成为大区活跃度" }
];
// 会员等级
const MEMBERSHIP_LEVEL = [
    { key: 0, name: "会员等级LV0", contribution: "注册未实名认证通过的用户", handlingFee: "禁止交易" },
    { key: 1, name: "会员等级LV1", contribution: "注册未并实名认证通过的用户", handlingFee: "交易手续费50%" },
    { key: 2, name: "会员等级LV2", contribution: "贡献值≥100点", handlingFee: "交易手续费35%" },
    { key: 3, name: "会员等级LV3", contribution: "贡献值≥200点", handlingFee: "交易手续费30%" },
    { key: 4, name: "会员等级LV4", contribution: "贡献值≥2000点", handlingFee: "交易手续费28%" },
    { key: 5, name: "会员等级LV5", contribution: "贡献值≥5000点", handlingFee: "交易手续费25%" },
];

// 实名认证审核状态
const CERTIFICATION_STATUS = [
    // 0:审核中, 1:初步审核通过, 2:审核通过, 3:审核未通过
    { key: 0, name: "审核中" },
    { key: 1, name: "待刷脸认证" },
    { key: 2, name: "已刷脸认证" },
    { key: 3, name: "审核未通过" },
];

const INVITATION_STATUS = [
    // 0:审核中, 1:初步审核通过, 2:审核通过, 3:审核未通过
    { key: 0, name: "已注册" },
    { key: 1, name: "待刷脸认证" },
    { key: 2, name: "已刷脸认证" },
    { key: 3, name: "审核未通过" },
];

// 游戏分类
const GAME_TYPE = [
    { key: 0, name: "钻石抵扣游戏" },
    { key: 1, name: "端游" },
    { key: 2, name: "H5游戏" },
];

// 实名认证
const AUTHENTICATION_STATUS = [
    { key: null, value: "未实名认证", title: "提交人工审核" },
    { key: 0, value: "审核中", title: "审核中" },
    { key: 1, value: "初步审核通过", title: "提交人工审核" },
    { key: 2, value: "审核通过", title: "审核通过" },
    { key: 3, value: "审核未通过", title: "再次提交" },
];

// 交易统计信息
// [
//     { key: "lastAvgPrice", title: "昨日交易均价", unit: "￥" },
//     { key: "todayAvgPrice", title: "今日交易均价", unit: "￥" },
// ],
const TRANSACTION_STATISTICS = [
    [
        { key: "lastMaxPrice", title: "昨日最高价", unit: "￥" },
        { key: "todayMaxPrice", title: "今日最高价", unit: "￥" },
    ],
    [
        { key: "lastTradeAmount", title: "昨日成交", description: "今日交易成交单数", unit: "" },
        { key: "todayTradeAmount", title: "今日成交 ", description: "今日交易成交单数", unit: "" },
    ],
    { key: "lastAvgPrice", title: "当前", description: "交易单价下限", unit: "￥" },
    { key: "todayAmount", title: "买量", description: "今日发布买单单数", unit: "" },
    { key: "upRate", title: "涨跌", description: "涨跌", unit: "" }
];

// 提现方式
const WITHDRAW_TYPE = [
    { key: '0', title: '其他' },
    { key: '1', title: '支付宝' },
];

// 提现状态
const WITHDRAW_STATUS = [
    { key: '0', title: '审核中', color: 'yellow' },
    { key: '1', title: '提现成功', color: 'green' },
    { key: '2', title: '审核失败', color: 'red' },
];

// 群组成员角色
const GROUP_ROLE = [
    { key: 0, value: '群主', text: '【群主】' },
    { key: 1, value: '管理员', text: '【管理员】' },
    { key: 2, value: '群成员', text: '' },
];

// 中国省份ProvinceCode对照表
const PROVINCE_CODE = {
    "北京市": 11,
    "天津市": 12,
    "河北省": 13,
    "山西省": 14,
    "内蒙古自治区": 15,
    "辽宁省": 21,
    "吉林省": 22,
    "黑龙江省": 23,
    "上海市": 31,
    "江苏省": 32,
    "浙江省": 33,
    "安徽省": 34,
    "福建省": 35,
    "江西省": 36,
    "山东省": 37,
    "河南省": 41,
    "湖北省": 42,
    "湖南省": 43,
    "广东省": 44,
    "广西壮族自治区": 45,
    "海南省": 46,
    "重庆市": 50,
    "四川省": 51,
    "贵州省": 52,
    "云南省": 53,
    "西藏自治区": 54,
    "陕西省": 61,
    "甘肃省": 62,
    "青海省": 63,
    "宁夏回族自治区": 64,
    "新疆维吾尔自治区": 65,
    "台湾省": 71,
    "香港特别行政区": 81,
    "澳门特别行政区": 82,
}

export {
    HOME_OPTIONS,
    PROFILE_BAR,
    MEMBERSHIP_LEVEL,
    STAR_LEVEL,
    STAR_LEVEL_DETAILS,
    CERTIFICATION_STATUS,
    INVITATION_STATUS,
    GAME_TYPE,
    AUTHENTICATION_STATUS,
    TRANSACTION_STATISTICS,
    WITHDRAW_TYPE,
    WITHDRAW_STATUS,
    GROUP_ROLE,
    PROVINCE_CODE,
    Banner_Mock,
    Message_Mock,
    Message2_Mock,
    Message_Detail_Mock,
    UserInfo_Mock,
    TASK_OPTIONS_LIST,
    My_Task_Mock,
    TaskType,
    FQAMock,
    Team_Member_Mock,
    TEAM_CANDY,
    CandyList_Mock,
    STAR_LEVEL_DETAILS2,
    CandyHDetail,
    CandyHList_Mock,
    CandyPList_Mock,
    CandyP_Rule,
    Ti_Xian_R,
    Wallet_R,
    HOME_OPTIONS2,
    HOME_OPTIONS3
};