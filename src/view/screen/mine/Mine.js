import React, { Component } from 'react';
import { View, Text, NativeModules, StyleSheet, ScrollView, TouchableWithoutFeedback, Linking, Image, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Toast } from 'native-base';
import Toast from '../../common/Toast';
import Cookie from 'cross-cookie';
import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import { LOGOUT, UPDATE_USER } from '../../../redux/ActionTypes';
import { AUTH_SECRET, API_PATH, Env, Version } from '../../../config/Index';
import MathFloat from '../../../utils/MathFloat';
import { PROFILE_BAR } from '../../../config/Constants';
import { Send } from '../../../utils/Http';

const FeiMa = NativeModules.FeiMaModule;

// 交易
let TRANSACTION_BAR = [
  { key: "0", title: "买单", icon: 'buysellads', businessType: 0, router: "BuyOrder" },
  { key: "1", title: "卖单", icon: 'buysellads', businessType: 1, router: "BuyOrder" },
  { key: "2", title: "交易中", icon: 'exchange', businessType: 2, router: "BuyingOrder" },
  { key: "3", title: "已完成", icon: 'snapchat', businessType: 3, router: "BuyedOrder" },
  { key: "4", title: "消息", icon: 'wechat', router: "Message" },
];
// 基本信息
let BASICINFO_BAR = [
  { key: "0", title: "实名认证", icon: 'credit-card', router: 'Certification' },
  // { key: "1", title: "二次认证", icon: 'credit-card-alt', router: 'PayPage2' },
  { key: "2", title: "我的团队", icon: 'user-md', router: 'MyTeam' },
  { key: "3", title: "邀请好友", icon: 'steam-square', router: 'Invitation' }
];
let BASICINFO_BAR2 = [
  { key: "4", title: "地址管理", icon: 'address-book', router: 'Adress' },
  { key: "5", title: '城市大厅', icon: 'home', router: 'CityShow' },
  { key: "6", title: "换购", icon: 'address-book', router: 'EquityExchange' },
];
class Mine extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  /**
	 * 渲染用户收益
	 */
  renderProfile() {
    return (
      <View style={Styles.profile}>
        {PROFILE_BAR.map(item => {
          let { key, title, router } = item;
          let value = (this.props[key] == 'undefined' || this.props[key] == null) ? 0 : this.props[key];
          if (key === 'candyH') {
            value = value.toFixed(2);
          } else if (key === 'candyP' || key === 'candyNum') {
            value = value.toFixed(2);//
          } else if (key === 'balance') {
            value = MathFloat.floor(this.props.userBalanceNormal, 2) + MathFloat.floor(this.props.userBalanceLock, 2);
            value = value.toFixed(2);
          } else {
            value = '¥' + MathFloat.floor(value, 2);
          }
          return (
            <TouchableWithoutFeedback key={key} onPress={() => {
              Actions.push(this.props.logged ? router : 'Login')
            }}>
              <View style={Styles.profileItem}>
                <Text style={[Styles.profileText]}>{value}</Text>
                <Text style={Styles.profileTitle}>{title}</Text>
              </View>
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    )
  }
  /**
   * 渲染变色版
   */
  renderGradient() {
    let { avatar, nickname, rcode } = this.props;
    return (
      <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0.1 }} end={{ x: 0, y: 1 }} style={Styles.gradient}>
        <View style={{ flexDirection: 'row' }}>
          {this.props.logged ?
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableWithoutFeedback onPress={() => Actions.push('UserInfo')}>
                <Image source={{ uri: avatar }} style={Styles.avatar} />
              </TouchableWithoutFeedback>
              <View style={{ flex: 1, marginLeft: 15, marginTop: 10 }}>
                <Text style={Styles.nickname} numberOfLines={2}>{nickname || "该用户很懒，还没有修改昵称"}</Text>
                <TouchableOpacity onPress={() => Actions.push('EditInviterCode')}>
                  <Text style={Styles.inviteCode} numberOfLines={2}>{rcode == "0" ? "申请邀请码" : `邀请码:${rcode}`}</Text>
                </TouchableOpacity>
              </View>
            </View>
            :
            <View style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => Actions.push('Login')}>
                <View style={{ borderRadius: 20, width: 100, padding: 20, paddingTop: 0, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, color: Colors.C8 }}>登录</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          }
          <TouchableWithoutFeedback onPress={() => Actions.push(this.props.logged ? 'SettingPage' : 'Login')}>
            <View style={Styles.setting}>
              <Text style={Styles.version}>{`版本号: ${Env === 'dev' ? Env : ''}${Version}`}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        {this.renderProfile()}
      </LinearGradient>
    )
  }
  onClickLevelBar() {
    if (this.props.logged) {
      Send(`api/system/CopyWriting?type=userlevel`, {}, 'get').then(res => {
        Actions.push('CommonRules', { title: '会员等级', rules: res.data });
      });
    } else {
      Actions.push('Login');
    }
  }
  /**
	 * 渲染用户等级Bar
	 */
  renderLevelBar() {
    let { golds, level } = this.props;
    let LEVEL_CLASS = ["LV0", "LV1", "LV2", "LV3", "LV4", "LV5", "LV6", "LV7", "LV8", "LV9"];
    return (
      <TouchableWithoutFeedback onPress={() => this.onClickLevelBar()}>
        <View style={Styles.level}>
          <View style={{ marginLeft: 15, marginRight: 12 }}>
            <Text style={Styles.levelText}>{level}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={Styles.contributionValueText}>{`贡献值${golds}`}</Text>
              {/* <Text style={Styles.contributionValueText}>{``}</Text> */}
            </View>
          </View>
          <View style={{ height: 40, width: 1, backgroundColor: Colors.C7 }} />
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={Styles.levelPropaganda}>{`推广越多 等级越高 手续费越低`}</Text>
            <Text style={[Styles.levelPropaganda, { marginTop: 4, fontSize: 12 }]}>点击查看贡献值规则</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  /**
	 * 交易Bar 点击事件
	 */
  handleTransactionBar(item) {
    if (this.props.logged) {
      if (item.hasOwnProperty('businessType')) {
        Actions.push('BusinessPage', { businessType: item['businessType'] });
      } else {
        Actions.push(item['router']);
      }
    } else {
      Actions.push('Login');
    }
  }
  /**
	 * 渲染交易Bar
	 */
  renderTransaction() {
    return (
      <View style={Styles.barContainer}>
        <View style={Styles.barHeader}>
          <Text style={Styles.barTitle}>我的交易</Text>
          {/* <TouchableWithoutFeedback onPress={() => Actions.push(this.props.logged ? 'BusinessPage' : 'Login', { businessType: 0})}> */}
          <TouchableWithoutFeedback onPress={() => this.handleTransactionBar({businessType: 0})}>
            <View style={Styles.barHeaderRight}>
              <Text style={Styles.barMore}>查看全部交易</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={Styles.barBody}>
          {TRANSACTION_BAR.map(item =>
            <TouchableWithoutFeedback key={item['key']} onPress={() => this.handleTransactionBar(item)}>
              <View style={Styles.barBodyItem}>
                {item['router'] == 'BuyOrder' ?
                  <Image source={require('../../images/mine/maidan.png')} style={{ width: 30, height: 30 }} /> :
                  item['router'] == 'BuyingOrder' ?
                    <Image source={require('../../images/mine/jiaoyizhong.png')} style={{ width: 30, height: 30 }} /> :
                    item['router'] == 'BuyedOrder' ?
                      <Image source={require('../../images/mine/yiwancheng.png')} style={{ width: 30, height: 30 }} /> :
                      item['router'] == 'Message' ?
                        <Image source={require('../../images/mine/xiaoxi.png')} style={{ width: 30, height: 30 }} /> :
                        <FontAwesome name={item['icon']} color={Colors.C6} size={28} />
                }
                <Text style={Styles.barText}>{item['title']}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    )
  }
  /**
	 * 渲染基本信息
	 */
  renderBasicInfo() {
    return (
      <View style={Styles.barContainer}>
        <View style={Styles.barHeader}>
          <Text style={Styles.barTitle}>基本信息</Text>
        </View>
        <View style={Styles.barBody}>
          {BASICINFO_BAR.map(item =>
            <TouchableWithoutFeedback key={item['key']} onPress={() => {
              if (item['router'] == "PayPage2" && this.props.alipayUid != '') {
                Toast.tipBottom('无需二次认证')
                // Toast.show({
                //   text: '无需二次认证',
                //   position: "top",
                //   textStyle: { textAlign: "center" },
                // });
                return;
              }
              Actions.push(this.props.logged ? (item['router'] == "Certification" && !this.props.isPay) ? "PayPage" : item['router'] : 'Login')
            }}>
              <View style={Styles.barBodyItem}>
                {item['router'] == 'Certification' ?
                  <Image source={require('../../images/mine/shimingrenzheng.png')} style={{ width: 30, height: 30 }} /> :
                  item['router'] == 'MyTeam' ?
                    <Image source={require('../../images/mine/wodetuandui.png')} style={{ width: 30, height: 30 }} /> :
                    item['router'] == 'Invitation' ?
                      <Image source={require('../../images/mine/yaoqinghaoyou.png')} style={{ width: 30, height: 30 }} /> :
                      <FontAwesome name={item['icon']} color={Colors.C6} size={28} />
                }
                <Text style={Styles.barText}>{item['title']}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10, paddingBottom: 14 }}>
          {BASICINFO_BAR2.map(item =>
            item.title == '' ? <View style={Styles.barBodyItem} /> :
              <TouchableWithoutFeedback key={item['key']} onPress={() => {
                // if (item['router'] == "PayPage2" && this.props.alipayUid != '') {
                //   Toast.show({
                //     text: '无需二次认证',
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //   });
                //   return;
                // }
                // if (item['router'] == 'CityShow') {
                //   Toast.show({
                //     text: '城市大厅暂未开放',
                //     position: "top",
                //     textStyle: { textAlign: "center" },
                //   });
                //   return;
                // }
                Actions.push(this.props.logged ? item['router'] : 'Login')
              }}>
                <View style={Styles.barBodyItem}>
                  {item['router'] == 'CityShow' ?
                    <Image source={require('../../images/mine/chengshidating.png')} style={{ width: 30, height: 30 }} /> :
                    item['router'] == 'PayPage2' ?
                      <Image source={require('../../images/mine/ercirenzheng.png')} style={{ width: 30, height: 30 }} /> :
                      item['router'] == 'Adress' ?
                        <Image source={require('../../images/mine/dizhiguanli.png')} style={{ width: 30, height: 30 }} /> :
                        item['router'] == 'EquityExchange' ?
                          <Image source={require('../../images/mine/guquan.png')} style={{ width: 30, height: 30 }} /> :
                        <FontAwesome name={item['icon']} color={Colors.C6} size={28} />
                  }
                  <Text style={Styles.barText}>{item['title']}</Text>
                </View>
              </TouchableWithoutFeedback>

          )}
        </View>
      </View>
    )
  }
  /**
	 * 联系QQ客服
	 */
  onClickQQ() {
    Send(`api/system/CopyWriting?type=call_me`, {}, 'get').then(res => {
      Actions.push('CommonRules', { title: '联系我们', rules: res.data });
    });
  }
  /**
	 * 服务Bar 点击事件
	 */
  handleServiceBar(item) {
    if (this.props.logged) {
      if (item.hasOwnProperty('router')) {
        if (item['router'] === 'CommonRules') {
          this.onServicePress()
        } else if (item['router'] === 'qq') {
          this.onClickQQ();
        } else {
          Actions.push(item['router']);
        }
      } else {
        if (item['key'] === '0') this.onClickQQ();
      }
    } else {
      Actions.push('Login');
    }
  }
  onServicePress() {
    Send(`api/system/CopyWriting?type=day_q`, {}, 'get').then(res => {
      Actions.push('CommonRules', { title: '常见问题', rules: res.data });
    });
  }
  /**
	 * 渲染我的服务
	 */
  renderService() {
    let SERVICE_BAR = [
      { key: "0", title: "联系我们", icon: 'qq', router: 'qq' },
      { key: "1", title: "常见问题", icon: 'server', router: 'CommonRules' },
    ];
    return (
      <View style={Styles.barContainer}>
        <TouchableOpacity style={Styles.barHeader} onPress={()=> Actions.push('Information')}>
          <Text style={Styles.barTitle}>帮助中心</Text>
        </TouchableOpacity>
        <View style={Styles.barBody}>
          {SERVICE_BAR.map(item =>
            <TouchableWithoutFeedback key={item['key']} onPress={() => this.handleServiceBar(item)}>
              <View style={Styles.barBodyItem}>
                {item['router'] == 'qq' ?
                  <Image source={require('../../images/mine/lianxiwomen.png')} style={{ width: 30, height: 30 }} /> :
                  item['router'] == 'CommonRules' ?
                    <Image source={require('../../images/mine/changjianwenti.png')} style={{ width: 30, height: 30 }} /> :
                    <FontAwesome name={item['icon']} color={Colors.C6} size={28} />
                }
                <Text style={Styles.barText}>{item['title']}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    )
  }
  /**
     * 服务Bar 点击事件
     */
  handleServiceYoBang(item) {
    if (this.props.logged) {
      if (item.hasOwnProperty('router')) {
        if (item['router'] === 'CommonRules') {
          this.onServicePress()
        } else {
          Actions.push(item['router']);
        }
      } else {
        if (item['key'] === '0') this.onClickQQ();
      }
    } else {
      Actions.push('Login');
    }
  }
  /**
	 * 渲染哟帮
	 */
  renderYoBang() {
    let SERVICE_BAR = [
      { key: "0", title: "悬赏管理", icon: 'eercast', router: 'YoTaskSetting' },
      { key: "1", title: "我的任务", icon: 'superpowers', router: 'MyYoTask' },
      { key: "2", title: "举报维权", icon: 'microchip', router: 'YoTaskApeal' },
    ];
    return (
      <View style={Styles.barContainer}>
        <View style={Styles.barHeader}>
          <Text style={Styles.barTitle}>哟帮管理</Text>
        </View>
        <View style={Styles.barBody}>
          {SERVICE_BAR.map(item =>
            <TouchableWithoutFeedback key={item['key']} onPress={() => this.handleServiceYoBang(item)}>
              <View style={Styles.barBodyItem}>
                {item['router'] == 'YoTaskSetting' ?
                  <Image source={require('../../images/mine/xuanshangguanli.png')} style={{ width: 30, height: 30 }} /> :
                  item['router'] == 'MyYoTask' ?
                    <Image source={require('../../images/mine/woderenwu.png')} style={{ width: 30, height: 30 }} /> :
                    item['router'] == 'YoTaskApeal' ?
                      <Image source={require('../../images/mine/jubaoweiquan.png')} style={{ width: 30, height: 30 }} /> :
                      <FontAwesome name={item['icon']} color={Colors.C6} size={28} />
                }
                <Text style={Styles.barText}>{item['title']}</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    )
  }
  render() {
    return (
      <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0.5 }} style={{ flex: 1 }}>

        <Header title="我的" isTabBar={true} rightIcon="gear" rightIconSize={24} onRightPress={() => { Actions.push(this.props.logged ? 'UserInfo' : 'Login') }} />
        <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
          {this.renderGradient()}
          {this.renderLevelBar()}
          {this.renderTransaction()}
          {this.renderBasicInfo()}
          {this.renderYoBang()}
          {this.renderService()}
        </ScrollView>
      </LinearGradient>
    );
  }
}
const mapStateToProps = state => ({
  name: state.user.name,
  isPay: state.user.isPay,
  alipayUid: state.user.alipayUid,
  logged: state.user.logged,
  userId: state.user.id,
  level: state.user.level,
  rcode: state.user.rcode,
  golds: state.user.golds,
  mobile: state.user.mobile,
  nickname: state.user.name,
  avatar: state.user.avatarUrl,
  balance: state.dividend.userBalance,
  candyH: state.user.candyH || 0,
  candyP: state.user.candyP,
  candyNum: state.user.candyNum,
  userBalanceNormal: state.dividend.userBalanceNormal,
  userBalanceLock: state.dividend.userBalanceLock
});
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: LOGOUT }),
  updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Mine);

const Styles = StyleSheet.create({
  gradient: { padding: 15, paddingTop: 0, paddingBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 0.5, borderColor: Colors.C8 },
  nickname: { fontSize: 18, color: Colors.C8, fontWeight: '500' },
  inviteCode: { fontSize: 15, color: Colors.C8, },
  setting: { paddingLeft: 30, paddingBottom: 30, paddingTop: 20, alignItems: 'flex-end' },
  version: { marginTop: 2, fontSize: 14, color: Colors.C8 },
  profile: { flexDirection: 'row', alignItems: 'center' },
  profileItem: { flex: 1, alignItems: 'center' },
  profileTitle: { marginTop: 2, fontSize: 16, color: Colors.C8 },
  profileText: { fontSize: 14, color: Colors.main },
  level: { height: 70, width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.C8 },
  levelText: { fontSize: 19, color: Colors.C6, fontWeight: 'bold' },
  contributionValueText: { marginTop: 4, fontSize: 14, color: Colors.C0 },
  levelPropaganda: { fontSize: 15, color: Colors.C10 },
  icon: { width: 30, height: 30 },
  barContainer: { width: Metrics.screenWidth - 30, borderRadius: 15, alignSelf: 'center', backgroundColor: Colors.C8, marginTop: 15 },
  barHeader: { flexDirection: 'row', padding: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 },
  barTitle: { fontSize: 15, color: Colors.C10, fontWeight: '500' },
  barHeaderRight: { flex: 1 },
  barMore: { textAlign: 'right', fontSize: 14, color: Colors.C10 },
  barBody: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 14 },
  barBodyItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  barText: { marginTop: 6, fontSize: 14, color: Colors.C10 },
  badge: { position: 'absolute', left: 20, top: -2 },
});