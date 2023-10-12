import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image, TextInput, Keyboard, Platform, Pressable, Alert } from 'react-native';
import { Container, Content, Text, View, Form, Item } from 'native-base';
import Cookie from 'cross-cookie';
import CryptoJS from 'crypto-js';
import { AUTH_SECRET } from '../../../config/Index';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { LOGIN_SUCCESS, LOGOUT } from '../../../redux/ActionTypes';
import { Metrics, Colors } from '../../theme/Index';
import { Header } from '../../components/Index';
import { ParamsValidate } from '../../../utils/Index';
import { Send } from '../../../utils/Http';
import Advert from '../advert/Advert';
import { Toast } from '../../common';
import Verification from 'react-native-verification'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: props.navigation.state.params.mobile || '',
      password: '',
      displayMobile: "none",
      displayPassword: "none",
      agreed: false,
      type: '',
      valiCode: '',
      myVliCode: '',
      url: `https://picsum.photos/${Metrics.screenWidth}/200`
    };
  }
  componentDidMount = () => {
    if (this.props.type == 'replace') {
      this.props.logout();
    }
  };
  onReload = () => {
    console.warn('onReload')
    this.setState({ url: `https://picsum.photos/${Metrics.screenWidth}/200` })
  }
  _onChangeMobile = (inputData) => {
    this.setState({ displayMobile: "flex", mobile: inputData });
  }

  _onChangePassword = (inputData) => {
    this.setState({ displayPassword: "flex", password: inputData });
  }
  _onChangeVliCode = (inputData) => {
    this.setState({ displayPassword: "flex", myVliCode: inputData });
  }
  //sign
  Sign(vlicode, deviceId, timeSpan) {
    let params = [];
    params.push(vlicode.toUpperCase());
    params.push(deviceId.toUpperCase());
    params.push(timeSpan);
    params.push(AUTH_SECRET.toUpperCase());//服务端分发对应key
    params.sort();
    let utf8Params = CryptoJS.enc.Utf8.parse(params.join(''));
    let sign = CryptoJS.MD5(utf8Params).toString(CryptoJS.enc.Hex).substring(2, 28);
    return sign;
  }
  async Login() {
    Keyboard.dismiss();
    var that = this;
    let mobile = this.state.mobile;
    let mobileMsg = ParamsValidate('mobile', mobile);
    if (mobileMsg !== null) {
      Toast.tipBottom(mobileMsg)
      return;
    }
    let password = this.state.password;
    let passwordMsg = ParamsValidate('password', password);
    if (passwordMsg !== null) {
      Toast.tipBottom(passwordMsg)
      return;
    }
    if (this.state.valiCode.toLocaleLowerCase() != this.state.myVliCode.toLocaleLowerCase()) {
      Toast.tipBottom('验证码输入有误')
      return;
    }
    let deviceName = ''
    await DeviceInfo.getDeviceName()
      .then((name) => {
        deviceName = name;
      }).catch((err) => console.log('err', err));
    let params = {};
    params = this.state;
    params.version = DeviceInfo.getVersion();
    params.uniqueID = DeviceInfo.getUniqueId();
    params.systemName = Platform.OS === 'android' ? 'Android' : 'IOS';
    params.systemVersion = DeviceInfo.getSystemVersion();
    params.deviceName = deviceName;
    params.lat = this.props.location.latitude;
    params.lng = this.props.location.longitude;
    params.province = typeof this.props.location.province == 'object' ? '' : this.props.location.province;
    params.provinceCode = 0;
    params.city = this.props.location.city == 'object' ? '' : this.props.location.city;
    params.cityCode = this.props.location.cityCode == 'object' ? 0 : this.props.location.cityCode;
    params.area = this.props.location.district == 'object' ? '' : this.props.location.district;
    params.areaCode = this.props.location.adCode == 'object' ? 0 : this.props.location.adCode;
    let timeSpan = new Date().getTime();
    params.timeSpan = timeSpan;
    params.vlicode = this.state.valiCode;
    params.mSign = this.Sign(params.vlicode, params.uniqueID, params.timeSpan);
    Send("api/login2", params).then(res => {
      // 后端返回结果,获得用户信息,存id到cookie里
      if (res.code == 200) {
        that.props.loginSuccess(res.data.user);
        Cookie.set({ 'token': res.data.token });

        Cookie.set({ 'userId': res.data.user.id });
        Advert.setUserId(`s9${res.data.user.id}`)
        setTimeout(function () {
          Actions.replace("Index");
        }, 1000);
      } else {
        Toast.tipBottom(res.message);
      }
    })
  }

  displayBack() {
    if (this.props.relogin === "resetPwd") {
      return (
        <Header title="登录" rightText="注册" leftIcon="" onRightPress={() => Actions.InvitationCode()} />
      )
    } else {
      return (
        <Header title="登录" rightText="注册" onRightPress={() => Actions.InvitationCode()} />
      )
    }
  }
  /**
   * 进入交易规则界面
   */
  PrivacyPolicy = () => {
    Send(`api/system/CopyWriting?type=pro_rule`, {}, 'get').then(res => {
      Actions.push('CommonRules', { title: '隐私政策', rules: res.data });
    });
  }

  render() {
    return (
      <Container>
        {this.displayBack()}
        <Content>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
            {/* <Image style={styles.imagestyle} source={require('../../images/logo.png')}></Image> */}
            {/* <Text style={{ padding: 18,fontWeight:'bold', color: Colors.main }}>欢迎登录【好玩怀旧】版</Text> */}
          </View>
          <Form>
            <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 }}>
              <TextInput
                value={this.state.mobile}
                style={styles.placeholderText}
                placeholder="请输入已注册手机号"
                onChangeText={this._onChangeMobile}
                clearButtonMode="while-editing" />
            </Item>
            <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 }}>
              <TextInput
                value={this.state.password}
                style={styles.placeholderText}
                secureTextEntry={true}
                placeholder="请输入密码"
                onChangeText={this._onChangePassword}
                clearButtonMode="while-editing"
              />
              <Text></Text>
            </Item>
            <Item style={{ borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.C7 }}>
              <TextInput
                value={this.state.myVliCode}
                style={styles.placeholderText}
                placeholder="请输入验证码"
                onChangeText={this._onChangeVliCode}
                clearButtonMode="while-editing"
                returnKeyType="done"
                onSubmitEditing={() => this.Login()}
              />
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Verification
                  type={'number'}
                  getValue={(value) => this.setState({ valiCode: value })}

                />
              </View>
            </Item>
          </Form>

          <View style={styles.signInView}>
            <TouchableOpacity onPress={() => { this.Login() }}>
              <View style={styles.signInBtn} >
                <Text style={{ padding: 15, color: "#ffffff" }}>登录</Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
            <TouchableOpacity onPress={() => Actions.UnLockDevice()}>
              <View style={styles.resetPwd}>
                <Text style={{ fontSize: 16, padding: 10, color: Colors.C10 }}>解绑设备</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Actions.Password()}>
              <View style={styles.resetPwd}>
                <Text style={{ fontSize: 16, padding: 10, color: Colors.C10 }}>忘记密码</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Content>

      </Container>
    );
  }
}
const mapStateToProps = state => ({
  location: state.user.location
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch({ type: LOGOUT }),
  loginSuccess: userInfo => dispatch({ type: LOGIN_SUCCESS, payload: { userInfo } }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
  signInView: {
    height: Metrics.screenWidth * 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
  },
  signInBtn: {
    backgroundColor: Colors.main,
    width: Metrics.screenWidth * 0.6,
    alignItems: "center",
    borderRadius: 8,
  },
  resetPwd: {
    width: Metrics.screenWidth * 0.3,
    alignItems: 'center',
  },
  placeholderText: {
    height: 50,
    fontSize: 16,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#ffffff',
  },
  imagestyle: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  clearIcon: {
    width: 20,
    height: 20
  },
})