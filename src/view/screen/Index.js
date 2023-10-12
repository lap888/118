import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, Image, View, Text } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Icon from "react-native-vector-icons/Ionicons";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import Home from './home/Home';
import DaJin from './home/DaJin';
import Game from './game/Game';
import GameHtml from './game/GameHtml';
import { Actions } from 'react-native-router-flux';
import Otc from './otc/Otc';
import Block from './blockchian/Block';
import Colors from '../theme/Colors';
import { Send } from '../../utils/Http';
import { UPDATE_USER } from '../../redux/ActionTypes';
import Information from './news/Information';
import { Toast } from '../common';
import MineScreen from './mine/MineScreen';
import PinDuoduoShop from './shop/PinDuoduoShop';
import ClassfiyScreen from './shop/ClassfiyScreen';
import Zbangbang from './shop/Zbangbang';
import StoreScreen from './store/StoreScreen';
import NOtc from './home2/notc/Otc';
import Advert from './advert/Advert';
import BitCoinNews from './home/BitCoinNews';



class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "game",
            badgeValue: "···"
        };
    }

    componentDidMount() {
        this.updateUserInfo(-1);
    }

    /**
     * 刷新用户信息
     */
    updateUserInfo(key) {
        if (key !== -1) {
            if (["BitCoinNews", "otc"].indexOf(key) > -1) return;
        }
        if (!this.props.logged) return;
        var that = this;
        Send(`api/InitInfo`, {}, 'GET').then(res => {
            if (res.code == 200) {
                that.props.updateUserInfo(res.data)
            } else {
                Toast.tipBottom(res.message)
            }
        });
    }
    /**
     * 切换Tab
     * @param {*} key 
     */
    switchTab(key) {
        // 修改状态栏样式
        if (Platform.OS === 'android') this.changeStatusBar(key);
        this.updateUserInfo(key);
        this.setState({ selectedTab: key });
    }

    changeStatusBar(key) {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(Colors.main, true);
    }

    /**
     * 渲染选项卡
     * @param {string} title 
     * @param {string} tabName 组件名字
     * @param {*} isBadge 
     */
    renderTabView(title, tabName, isBadge) {
        let unSelectIcon;
        let selectIcon;
        let tabPage;
        let iconPath;
        switch (tabName) {
            case 'home':
                unSelectIcon = require('../images/main/shouye0.png');
                selectIcon = require('../images/main/shouye1.png');
                iconPath = 'folder-sharp'
                tabPage = <Home />;
                break;
            case 'game':
                unSelectIcon = require('../images/main/svgmoban0.png');
                selectIcon = require('../images/main/svgmoban14.png');
                iconPath = 'cube'
                tabPage = <Game />;
                break;
            case 'news':
                unSelectIcon = require('../images/main/zixun0.png');
                selectIcon = require('../images/main/zixun_huaban.png');
                iconPath = 'game-controller'
                tabPage = <DaJin />;
                break;
            case 'shop':
                unSelectIcon = require('../images/main/tabShop0.png');
                selectIcon = require('../images/main/tabShop.png');
                iconPath = 'ios-folder'
                tabPage = <ClassfiyScreen />;
                break;
            case 'tasks':
                unSelectIcon = require('../images/main/tabShop0.png');
                selectIcon = require('../images/main/tabShop.png');
                iconPath = 'help-buoy-sharp'
                tabPage = <Zbangbang />;
                break;
            case 'otc':
                unSelectIcon = require('../images/main/tabShop0.png');
                selectIcon = require('../images/main/tabShop.png');
                iconPath = 'help-buoy-sharp'
                tabPage = <NOtc />;
                break;
            case 'block':
                unSelectIcon = require('../images/main/renwu0.png');
                selectIcon = require('../images/main/renwu.png');
                iconPath = 'ios-folder'
                tabPage = <Block />;
                break;
            case 'store':
                unSelectIcon = require('../images/main/fujin0.png');
                selectIcon = require('../images/main/fujin.png');
                iconPath = 'ios-folder'
                tabPage = <StoreScreen />;
                break;
            case 'mine':
                unSelectIcon = require('../images/main/wode0.png');
                selectIcon = require('../images/main/wode.png');
                iconPath = 'ios-person';
                tabPage = <MineScreen />;
                break;
            case 'BitCoinNews':
                unSelectIcon = require('../images/main/wode0.png');
                selectIcon = require('../images/main/wode.png');
                iconPath = 'aperture-sharp';
                tabPage = <BitCoinNews />;
                break;
        }

        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tabName}
                title={title}
                titleStyle={styles.tabText}
                selectedTitleStyle={styles.tabTextSelected}
                // renderIcon={() => <Image style={styles.imagestyle} source={unSelectIcon} />}
                // renderSelectedIcon={() => <Image style={styles.imagestyle} source={selectIcon} />}
                renderIcon={() => <Icon name={`${iconPath}`} color={Colors.ubSelectBtn} size={22} />}
                renderSelectedIcon={() => <Icon name={`${iconPath}`} color={Colors.selectBtn} size={22} />}
                onPress={() => this.switchTab(tabName)}
                renderBadge={() => isBadge ? <View style={styles.badgeView}><Text style={styles.badgeText}>{this.state.badgeValue}</Text></View> : null}
            >
                {tabPage}
            </TabNavigator.Item>
        );
    }
    //自定义tabBar simple seal for tabNavigatorItem
    renderTabBarView() {
        return (
            <TabNavigator
                tabBarStyle={styles.tab}>
                {this.renderTabView('盒子', 'game', false)}
                {this.renderTabView('资产', 'home', false)}
                {this.renderTabView('快讯', 'BitCoinNews', false)}

                {/* {this.renderTabView('打金', 'news', false)} */}
                {/* {this.renderTabView('任务', 'block', false)} */}
                {this.renderTabView('交易', 'otc', false)}
                {/* {this.renderTabView('商城', 'shop', false)} */}
                {/* {this.renderTabView('附近', 'store', false)} */}
                {this.renderTabView('我的', 'mine', false)}
            </TabNavigator>
        );
    }

    render() {
        return (
            this.renderTabBarView()
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id,
});

const mapDispatchToProps = dispatch => ({

    updateUserInfo: (userInfo) => dispatch({ type: UPDATE_USER, payload: { userInfo } })

});
export default connect(mapStateToProps, mapDispatchToProps)(Index);
const styles = StyleSheet.create({
    imagestyle: { width: 22, height: 22 },
    tabTextSelected: { color: Colors.C6, fontSize: 12, paddingTop: 0, fontWeight: 'bold' },
    tabText: { color: Colors.C10, fontSize: 12, fontWeight: 'bold' },
    tab: {
        flex: 1,
        // borderTopWidth: 1,
        borderColor: '#FFFFFF',
        backgroundColor: '#FFFFFF',
        overflow: 'visible',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50 + (isIphoneX() ? 15 : 0),
        paddingBottom: isIphoneX() ? 15 : 0,
    },
    badgeView: {
        width: 14,
        height: 14,
        backgroundColor: Colors.main,
        borderWidth: 1,
        marginLeft: 10,
        marginTop: 3,
        borderColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 8,
    }
})

