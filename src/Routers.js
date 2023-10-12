import React, { PureComponent } from 'react';
import { View, Image, Text, InteractionManager, ProgressViewIOS, ProgressBarAndroid, Platform, Modal, StyleSheet, Dimensions, ScrollView, NativeModules, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Root } from 'native-base';
import { Router, Scene } from 'react-native-router-flux';
import {
    upgrade
} from 'rn-app-upgrade';
import Loading from './view/screen/home/Loading';
import { UPDATE_VERSION } from './redux/ActionTypes';
import { Colors, Metrics } from './view/theme/Index';
import { Version, CodePushKey, CodePushKeyIos } from './config/Index';
//主页
import Index from './view/screen/Index';
import Home from './view/screen/home/Home';
import BitCoinNews from './view/screen/home/BitCoinNews';
import NewDetail from './view/screen/home/NewDetail';

import Task from './view/screen/home/task/Task';
import DaJin from './view/screen/home/DaJin';

import College from './view/screen/home/College';
import AdDetail from './view/screen/home/AdDetail';
import AdH5 from './view/screen/home/AdH5';
import PushUserBang from './view/screen/home/PushUserBang';
import DayDoTask from './view/screen/home/task/DayDoTask';
import AdReward from './view/screen/home/AdReward';
import BuyCandyBang from './view/screen/home/BuyCandyBang';
import TelphoneRecharge from './view/screen/home/TelphoneRecharge';

import CollegeFAQ from './view/screen/home/CollegeFAQ';
import CandyDetail from './view/screen/home/CandyDetail';
import CandyH from './view/screen/home/CandyH';
import CandyP from './view/screen/home/CandyP';
import GameDividend from './view/screen/home/GameDividend';
import GameDividendWithDraw from './view/screen/home/GameDividendWithDraw';
import GameDividendWithDrawList from './view/screen/home/GameDividendWithDrawList';
import GameDividendIncomeList from './view/screen/home/GameDividendIncomeList';

//游戏
import Game from './view/screen/game/Game';
import GameHtml from './view/screen/game/GameHtml';

import H5 from './view/screen/game/H5';
import GameDetail from './view/screen/game/GameDetail';
import HomeH5 from './view/screen/game/HomeH5';
//Otc
import Otc from './view/screen/otc/Otc';

import NOtc from './view/screen/home2/notc/Otc';
//区块
import Block from './view/screen/blockchian/Block';
import PublicYoTask from './view/screen/blockchian/PublicYoTask';
import PublicStep from './view/screen/blockchian/PublicStep';
import PreViewTask from './view/screen/blockchian/PreViewTask';
import ViewTask from './view/screen/blockchian/ViewTask';
import YoTaskSetting from './view/screen/blockchian/YoTaskSetting';
import MyYoTask from './view/screen/blockchian/MyYoTask';
import YoTaskApeal from './view/screen/blockchian/YoTaskApeal';
import JieDian from './view/screen/blockchian/JieDian';
import TaskSubRecord from './view/screen/blockchian/TaskSubRecord';
import TaskSubRecordDetail from './view/screen/blockchian/TaskSubRecordDetail';



//我的
import Mine from './view/screen/mine/Mine';
import MineScreen from './view/screen/mine/MineScreen';
import Message from './view/screen/mine/Message';
import SystemMessage from './view/screen/mine/SystemMessage';
import MessageDetail from './view/screen/mine/MessageDetail';
import Invitation from './view/screen/mine/Invitation';
import MyTeam from './view/screen/mine/MyTeam';
import StarLevelRule from './view/screen/mine/StarLevelRule';
import CommonRules from './view/screen/mine/CommonRules';
import BusinessPage from './view/screen/mine/BusinessPage';
import TransactionDetail from './view/screen/mine/TransactionDetail';
import BusinessCompDetail from './view/screen/mine/BusinessCompDetail';
import AppealPage from './view/screen/mine/AppealPage';
import UserInfo from './view/screen/mine/userInfo/UserInfo';
import EditUserInfo from './view/screen/mine/userInfo/EditUserInfo';
import EditUserCoin from './view/screen/mine/userInfo/EditUserCoin';

import EditInviterUser from './view/screen/mine/userInfo/EditInviterUser';

import EditSignInPwd from './view/screen/mine/userInfo/EditSignInPwd';
import BusinessPwd from './view/screen/mine/userInfo/BusinessPwd';
import Certification from './view/screen/mine/Certification';
import CertificationManual from './view/screen/mine/CertificationManual';
import PayPage from './view/screen/mine/PayPage';
import EditInviterCode from './view/screen/mine/EditInviterCode';
import Adress from './view/screen/mine/Adress';
import AddAdress from './view/screen/mine/AddAdress';
import PayPage2 from './view/screen/mine/PayPage2';
import ModifyAlipay from './view/screen/mine/userInfo/ModifyAlipay';
import WalletPay from './view/screen/mine/WalletPay';
import CityShow from './view/screen/mine/city/CityShow';
import CityDivideList from './view/screen/mine/city/CityDivideList';
import EquityExchange from './view/screen/mine/equity/EquityExchange';
import EquityDetailList from './view/screen/mine/equity/EquityDetailList';
import EquityMailed from './view/screen/mine/equity/EquityMailed';
import ElectronicEquity from './view/screen/mine/equity/ElectronicEquity';
import GoodLuck from './view/screen/mine/good/GoodLuck';
import ZpLuck from './view/screen/mine/good/ZpLuck';
import ZpRecord from './view/screen/mine/good/ZpRecord';




//Login
import Login from './view/screen/login/Login';
import Password from './view/screen/login/Password';
import InvitationCode from './view/screen/login/InvitationCode';
import SignUp from './view/screen/login/SignUp';
import SignUpPage from './view/screen/login/SignUpPage';
import UnLockDevice from './view/screen/login/UnLockDevice';


import { Send } from './utils/Http';
import AdvertScreen from './view/screen/advert/AdvertScreen';
import CitySetting from './view/screen/mine/city/CitySetting';
import SuperiorInfo from './view/screen/mine/userInfo/SuperiorInfo';
import SetContact from './view/screen/mine/userInfo/SetContact';
import AcquisitionRanking from './view/screen/home/AcquisitionRanking';
import Information from './view/screen/news/Information';
import PinDuoduoShop from './view/screen/shop/PinDuoduoShop';
import Zbangbang from './view/screen/shop/Zbangbang';

import NewTicket from './view/screen/mine/wallet/NewTicket';
import QuXiYou from './view/screen/mine/wallet/QuXiYou';
import Yjj from './view/screen/mine/wallet/Yjj';


import TicketDetailList from './view/screen/mine/wallet/TicketDetailList';
import Help from './view/screen/mine/help/Help';

import CodePush from "react-native-code-push";
import MoveToExchange from './view/screen/mine/wallet/MoveToExchange';
import RechargeCandy from './view/screen/mine/wallet/RechargeCandy';
import GoodsDetail from './view/screen/shop/GoodsDetail';
import ConfirmOrder from './view/screen/order/ConfirmOrder';
import ClassfiyScreen from './view/screen/shop/ClassfiyScreen';
import OrderListScreen from './view/screen/shop/OrderListScreen';
import SearchGoods from './view/screen/shop/SearchGoods';
import ShopDetail from './view/screen/shop/ShopDetail';
import OrderDetail from './view/screen/shop/OrderDetail';

//home2
import YbToSomeOne from './view/screen/home2/accounting/YbToSomeOne';
import Home2Screen from './view/screen/home2/Home2Screen';
import Substitution from './view/screen/home2/Substitution';
import Accounting from './view/screen/home2/accounting/Accounting';
import MiningMachineryShop from './view/screen/home2/miningMachinery/MiningMachineryShop';
import FlowDetails from './view/screen/home2/accounting/FlowDetails';
import MoveToExchange2 from './view/screen/home2/accounting/MoveToExchange2';
import Level from './view/screen/mine/team/Level';
import ActiveScreen from './view/screen/home/active/ActiveScreen';
import MapViewScreen from './view/components/MapViewScreen';
import StoreDetail from './view/screen/store/StoreDetail';
import AddStore from './view/screen/store/AddStore';
import StorePay from './view/screen/store/StorePay';
import MemberCard from './view/screen/home2/MemberCard';
import Browser from './view/screen/home2/browser/Browser';
import BrowserDetail from './view/screen/home2/browser/BrowserDetail';
import YoTaskApealList from './view/screen/blockchian/YoTaskApealList';
import FeedbackDetails from './view/screen/blockchian/FeedbackDetails';
import CandyPExchangeNL from './view/screen/home/CandyPExchangeNL';

//消费券


import XfqScreen from './view/screen/Xfq/XfqScreen';
import AdFlowDetails from './view/screen/Xfq/AdFlowDetails';
import SubstitutionVideo from './view/screen/Xfq/SubstitutionVideo';
import SubstitutionZuanshi from './view/screen/Xfq/SubstitutionZuanshi';
import ImageCode from './view/screen/Xfq/ImageCode';

//Nft
import Nft from './view/screen/nft/Nft';
import NftDetail from './view/screen/nft/NftDetail';


// // 静默方式，app每次启动的时候，都检测一下更新 'ON_APP_RESUME'

class Routers extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            updateModalVisible: false,
            updateInfo: {},
            updateProgressBarVisible: false,
            noticeModalVisible: true
        };
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            CodePush.notifyAppReady();
            this.fetchVersion();
        });
    }
    /**
     * 获取线上版本
     * updateContent
     * currentVersion: "1.0.1",
     * downloadUrl: "",
     */
    fetchVersion() {
        let systemName = Platform.OS.toLowerCase();
        Send(`api/system/ClientDownloadUrl?name=${systemName}`, {}, 'get').then(res => {
            if (res.code == 200) {
                this.checkUpdateApp(res.data);//{ currentVersion: '1.0.0', downloadUrl: 'http://app-1251750492.file.myqcloud.com/prod/x7game2.0.7.apk', updateContent: '118创富助手 喜普大奔 今日上线公测! 1.0.1' }
            }
        });
    }
    /**
	 * 线上版本获取
	 */
    checkUpdateApp(updateInfo) {
        let { currentVersion, isHotReload, isSilent } = updateInfo;
        this.props.updateVersion(currentVersion, true);
        if (Version >= currentVersion) {
            return;
        }
        this.setState({ updateInfo }, () => {
            if (isHotReload) {
                // 热更新强制弹框
                if (isSilent) {
                    // 静默更新
                    this.hotReload(CodePush.InstallMode.IMMEDIATE);
                } else {
                    this.setState({ updateModalVisible: true });
                }
            } else {
                if (Platform.OS === 'ios') {
                    // IOS升级ipa
                    this.setState({ updateModalVisible: true });
                } else {
                    this.setState({ updateModalVisible: true });
                }
            }
        });
    }
    /**
    * 热更新更新流程
    * @param {*} mode 
    */
    hotReload(mode) {
        if (!this.state.updateProgressBarVisible) this.setState({ updateProgressBarVisible: true });
        CodePush.sync(
            {
                installMode: CodePush.InstallMode.IMMEDIATE,
                mandatoryInstallMode: mode,
                deploymentKey: Platform.OS === 'ios' ? CodePushKeyIos : CodePushKey,
                updateDialog: false,
            }, (status) => {
                console.log("code-push status" + status);
                if ([0, 2, 3, 8].indexOf(status) !== -1) this.setState({ updateModalVisible: false });
            }, (process) => {
                let { totalBytes, receivedBytes } = process;
                console.log("code-push process" + processValue);
            }, (update) => {
                console.log("code-push update" + update);
            }
        );
    }
    /**
     * 应用商店更新流程
     */
    downloadApp() {
        let updateInfo = this.state.updateInfo;
        let that = this;
        if (Platform.OS === 'ios') {
            // var IPAInstall = NativeModules.IPAInstall2;
            // IPAInstall.itms_install(updateInfo['downloadUrl']);
            Linking.openURL(updateInfo.downloadUrl);
        } else {
            upgrade(updateInfo.downloadUrl);
        }
        if (!this.state.updateProgressBarVisible) this.setState({ updateProgressBarVisible: true });
    }
    /**
     * 渲染更新Bar
     */
    renderAppUpdateBar() {
        return (
            <TouchableOpacity onPress={() => this.downloadApp()}>
                <View style={styles.updateFooter}>
                    <Text style={styles.updateText}>立即更新</Text>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     * 热更新进度条
     */
    renderAppUpdateProgress = () => {
        let progressValue = 0;
        return (
            <View style={{ paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 35 : 20 }}>
                {Platform.OS === 'ios' ?
                    <ProgressViewIOS progressTintColor={Colors.C6} trackTintColor={Colors.C6} progress={progressValue} />
                    :
                    <ProgressBarAndroid animating styleAttr="Horizontal" color={Colors.C6} progress={progressValue} />
                }
            </View>
        )
    }
    /**
     * 系统更新提示框
     */
    renderUpdateModal() {
        return (
            <Modal transparent visible={this.state.updateModalVisible} onRequestClose={() => { }}>
                <View style={styles.updateContainer}>
                    <View style={[styles.updateContainer, { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'black', opacity: 0.5 }]} />
                    <View style={styles.updateHeader}>
                        <Image source={require('./view/images/lib_update_app_top_bg.png')} resizeMode="contain" style={{ width: Metrics.screenWidth * 0.75, height: Metrics.screenWidth * 0.75 * 0.454, marginTop: -30 }} />
                        <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                            <Text style={styles.updateVersion}>{`是否升级到${this.state.updateInfo['currentVersion']}版本？`}</Text>
                            <Text style={styles.updateContent}>{this.state.updateInfo['updateContent']}</Text>
                            {this.state.updateProgressBarVisible ? this.renderAppUpdateProgress() : this.renderAppUpdateBar()}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
    render() {
        return (
            <Root>
                <Router headerMode="none">
                    <Scene key="root">
                        <Scene key="Loading" component={Loading} />
                        <Scene key="Index" component={Index} />

                        <Scene key="Home" component={Home} />
                        <Scene key="DaJin" component={DaJin} />
                        
                        <Scene key="Task" component={Task} />
                        <Scene key="College" component={College} />
                        <Scene key="AdDetail" component={AdDetail} />
                        <Scene key="AdH5" component={AdH5} />
                        <Scene key="CollegeFAQ" component={CollegeFAQ} />
                        <Scene key="CandyDetail" component={CandyDetail} />
                        <Scene key="CandyH" component={CandyH} />
                        <Scene key="CandyP" component={CandyP} />
                        <Scene key="GameDividend" component={GameDividend} />
                        <Scene key="GameDividendWithDraw" component={GameDividendWithDraw} />
                        <Scene key="GameDividendWithDrawList" component={GameDividendWithDrawList} />
                        <Scene key="GameDividendIncomeList" component={GameDividendIncomeList} />
                        <Scene key="PushUserBang" component={PushUserBang} />
                        <Scene key="DayDoTask" component={DayDoTask} />
                        <Scene key="AdReward" component={AdReward} />
                        <Scene key="BuyCandyBang" component={BuyCandyBang} />
                        <Scene key="TelphoneRecharge" component={TelphoneRecharge} />
                        

                        <Scene key="Game" component={Game} />
                        <Scene key="GameHtml" component={GameHtml} />
                        
                        <Scene key="H5" component={H5} />
                        <Scene key="GameDetail" component={GameDetail} />
                        <Scene key="HomeH5" component={HomeH5} />
                        <Scene key="BitCoinNews" component={BitCoinNews} />
                        <Scene key="NewDetail" component={NewDetail} />
                        
                        <Scene key="Otc" component={Otc} />
                        <Scene key="NOtc" component={NOtc} />

                        <Scene key="Mine" component={Mine} />
                        <Scene key="MineScreen" component={MineScreen} />
                        <Scene key="Message" component={Message} />
                        <Scene key="SystemMessage" component={SystemMessage} />
                        <Scene key="MessageDetail" component={MessageDetail} />
                        <Scene key="Invitation" component={Invitation} />
                        <Scene key="MyTeam" component={MyTeam} />
                        <Scene key="StarLevelRule" component={StarLevelRule} />
                        <Scene key="CommonRules" component={CommonRules} />
                        <Scene key="BusinessPage" component={BusinessPage} />
                        <Scene key="TransactionDetail" component={TransactionDetail} />
                        <Scene key="BusinessCompDetail" component={BusinessCompDetail} />
                        <Scene key="AppealPage" component={AppealPage} />
                        <Scene key="UserInfo" component={UserInfo} />
                        <Scene key="EditUserInfo" component={EditUserInfo} />
                        <Scene key="EditInviterUser" component={EditInviterUser} />
                        <Scene key="EditUserCoin" component={EditUserCoin} />
                        
                        
                        <Scene key="EditSignInPwd" component={EditSignInPwd} />
                        <Scene key="BusinessPwd" component={BusinessPwd} />
                        <Scene key="Certification" component={Certification} />
                        <Scene key="CertificationManual" component={CertificationManual} />
                        <Scene key="PayPage" component={PayPage} />
                        <Scene key="EditInviterCode" component={EditInviterCode} />
                        <Scene key="Adress" component={Adress} />
                        <Scene key="AddAdress" component={AddAdress} />
                        <Scene key="PayPage2" component={PayPage2} />
                        <Scene key="ModifyAlipay" component={ModifyAlipay} />
                        <Scene key="WalletPay" component={WalletPay} />
                        <Scene key="CityShow" component={CityShow} />
                        <Scene key="CityDivideList" component={CityDivideList} />                        
                        <Scene key="SuperiorInfo" component={SuperiorInfo} />                        
                        
                        <Scene key="Block" component={Block} />
                        <Scene key="PublicYoTask" component={PublicYoTask} />
                        <Scene key="PublicStep" component={PublicStep} />
                        <Scene key="PreViewTask" component={PreViewTask} />
                        <Scene key="ViewTask" component={ViewTask} />
                        <Scene key="YoTaskSetting" component={YoTaskSetting} />
                        <Scene key="MyYoTask" component={MyYoTask} />
                        <Scene key="YoTaskApeal" component={YoTaskApeal} />
                        <Scene key="JieDian" component={JieDian} />
                        
                        <Scene key="TaskSubRecord" component={TaskSubRecord} />
                        <Scene key="TaskSubRecordDetail" component={TaskSubRecordDetail} />
                        <Scene key="MoveToExchange" component={MoveToExchange} />
                        <Scene key="RechargeCandy" component={RechargeCandy} />
                        

                        <Scene key="Login" component={Login} />
                        <Scene key="Password" component={Password} />
                        <Scene key="InvitationCode" component={InvitationCode} />
                        <Scene key="SignUp" component={SignUp} />
                        <Scene key="SignUpPage" component={SignUpPage} />
                        <Scene key="UnLockDevice" component={UnLockDevice} />
                        <Scene key="EquityExchange" component={EquityExchange} />
                        <Scene key="EquityDetailList" component={EquityDetailList} />
                        <Scene key="EquityMailed" component={EquityMailed}/>
                        <Scene key="ElectronicEquity" component={ElectronicEquity}/>
                        <Scene key="AdvertScreen" component={AdvertScreen}/>
                        <Scene key="CitySetting" component={CitySetting}/>
                        <Scene key="SetContact" component={SetContact}/>
                        <Scene key="AcquisitionRanking" component={AcquisitionRanking}/>
                        <Scene key="Information" component={Information}/>
                        <Scene key="PinDuoduoShop" component={PinDuoduoShop}/>
                        <Scene key="Zbangbang" component={Zbangbang}/>
                        
                        <Scene key="NewTicket" component={NewTicket}/>
                        <Scene key="QuXiYou" component={QuXiYou}/>
                        <Scene key="Yjj" component={Yjj}/>
                        
                        
                        <Scene key="TicketDetailList" component={TicketDetailList}/>
                        <Scene key="Help" component={Help}/>
                        <Scene key="ActiveScreen" component={ActiveScreen}/>
                        <Scene key="YoTaskApealList" component={YoTaskApealList}/>
                        <Scene key="FeedbackDetails" component={FeedbackDetails}/>
                        <Scene key="GoodLuck" component={GoodLuck}/>
                        <Scene key="ZpLuck" component={ZpLuck}/>
                        <Scene key="ZpRecord" component={ZpRecord}/>
                        
                        <Scene key="Classfiy" component={ClassfiyScreen}/>
                        <Scene key="GoodsDetail" component={GoodsDetail}/>
                        <Scene key="ConfirmOrder" component={ConfirmOrder}/>
                        <Scene key="OrderList" component={OrderListScreen}/>
                        <Scene key="OrderDetail" component={OrderDetail}/>
                        <Scene key="SearchGoods" component={SearchGoods}/>
                        <Scene key="ShopDetail" component={ShopDetail}/>
                        <Scene key="Level" component={Level}/>
                        
                        <Scene key="Home2Screen" component={Home2Screen}/>
                        <Scene key="MiningMachineryShop" component={MiningMachineryShop}/>
                        <Scene key="Substitution" component={Substitution}/>
                        <Scene key="Accounting" component={Accounting}/>
                        <Scene key="YbToSomeOne" component={YbToSomeOne}/>
                        
                        <Scene key="FlowDetails" component={FlowDetails}/>
                        <Scene key="MoveToExchange2" component={MoveToExchange2}/>
                        <Scene key="StoreDetail" component={StoreDetail}/>
                        <Scene key="AddStore" component={AddStore}/>
                        <Scene key="StorePay" component={StorePay}/>
                        <Scene key="MemberCard" component={MemberCard}/>
                        <Scene key="Browser" component={Browser}/>
                        <Scene key="BrowserDetail" component={BrowserDetail}/>
                        <Scene key="CandyPExchangeNL" component={CandyPExchangeNL}/>

                        <Scene key="MapView" component={MapViewScreen}/>
                        {/* 消费券 */}
                        <Scene key="XfqScreen" component={XfqScreen}/>
                        <Scene key="AdFlowDetails" component={AdFlowDetails}/>
                        <Scene key="SubstitutionVideo" component={SubstitutionVideo}/>
                        <Scene key="SubstitutionZuanshi" component={SubstitutionZuanshi}/>
                        <Scene key="ImageCode" component={ImageCode}/>
                        <Scene key="Nft" component={Nft}/>
                        <Scene key="NftDetail" component={NftDetail}/>
                    </Scene>
                </Router>
                {this.renderUpdateModal()}
            </Root>
        );
    }
}
const mapStateToProps = state => ({
    showIndicator: state.user.showIndicator,
    warnVersion: state.router.warnVersion,
    isIgnored: state.router.isIgnored,
    userId: state.user.id || -1,
    id: state.notice.id,
    title: state.notice.title,
    content: state.notice.content,
    isReaded: state.notice.isReaded

});
const mapDispatchToProps = dispatch => ({
    updateVersion: (warnVersion, isIgnored) => dispatch({ type: UPDATE_VERSION, payload: { warnVersion, isIgnored } })
});
export default connect(mapStateToProps, mapDispatchToProps)(Routers);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    updateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    updateHeader: { width: Metrics.screenWidth * 0.75, backgroundColor: '#FFFFFF', borderRadius: 10 },
    updateVersion: { fontSize: 17, textAlign: 'left', marginTop: 20 },
    updateContent: { fontSize: 14, paddingTop: 15 },
    updateFooter: { marginTop: 15, marginBottom: 15, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: 38, width: 180, backgroundColor: Colors.notice,opacity:0.9, borderRadius: 17 },
    updateText: { fontSize: 14, color: '#FFFFFF' }
});
