import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { ScrollTopBar, Header } from '../../components/Index';
import ClientGameList from './ClientGameList';
import { Colors, Metrics } from '../../theme/Index';
import GameHtml from './GameHtml'
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Advert from '../advert/Advert';
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectFlag: 0,
    };
  }

  /**
         * 渲染HeaderLeft
         */
  renderHeaderLeft() {
    return (
      <TouchableWithoutFeedback onPress={() => Actions.pop()}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 16, paddingRight: 16 }}>
          {/* <FontAwesome name='angle-left' size={30} color="#FFFFFF" /> */}
        </View>
      </TouchableWithoutFeedback>
    )
  }
  /**
   * 渲染HeaderRight
   */
  renderHeaderRight() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 16, paddingRight: 16 }}></View>
    )
  }
  /**
   * 渲染HeaderTitle
   */
  renderHeaderTitle() {
    return (
      <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: Colors.White, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => this.setState({ selectFlag: 0 })} style={{ flex: 1, backgroundColor: this.state.selectFlag == 0 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }}>
            <Text style={{ padding: 5, color: this.state.selectFlag == 0 ? Colors.main : Colors.White }}>首页</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ selectFlag: 1 })} style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: Colors.White, borderRightWidth: 1, borderRightColor: Colors.White, backgroundColor: this.state.selectFlag == 1 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ padding: 5, color: this.state.selectFlag == 1 ? Colors.main : Colors.White }}>福利</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            if (!this.props.logged) {
              Actions.push("Login");
              return;
            }
            Advert.jumpAdList(this.props.userId)
          }} style={{ flex: 1, backgroundColor: this.state.selectFlag == 2 ? Colors.White : Colors.main, justifyContent: 'center', alignItems: 'center', borderBottomRightRadius: 5, borderTopRightRadius: 5 }}>
            <Text style={{ padding: 5, color: this.state.selectFlag == 2 ? Colors.main : Colors.White }}>打金</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  renderHeader() {
    return (
      <View style={{ paddingTop: Metrics.STATUSBAR_HEIGHT, height: Metrics.HEADER_HEIGHT, width: Metrics.screenWidth, backgroundColor: Colors.main, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {this.renderHeaderLeft()}
        {this.renderHeaderTitle()}
        {this.renderHeaderRight()}
      </View>
    )
  }
  renderScrollTab() {
    return (
      <ScrollTopBar
        topBarUnderlineStyle={{ backgroundColor: Colors.C6, width: 40, height: 3, borderRadius: 3 }}				                                                    // 下划线样式
        labelList={['全部', '棋牌', '角色', '传奇', '策略', '卡牌', '挂机', '经营', '休闲', '女生']}			// 标题栏素材
        topBarInactiveTextColor='#666666'		                                              // label 文字非选中颜色
        topBarActiveTextColor={Colors.C6}	                                                // label 文字选中颜色
        topBarBackgroundColor="#FFFFFF"	                                                // 背景颜色
      >
        <ClientGameList type={0} />
        <ClientGameList type={1} />
        <ClientGameList type={2} />
        <ClientGameList type={3} />
        <ClientGameList type={4} />
        <ClientGameList type={5} />
        <ClientGameList type={6} />
        <ClientGameList type={7} />
        <ClientGameList type={8} />
        <ClientGameList type={9} />
      </ScrollTopBar>
    )
  }
  render() {
    return (
      <View style={Styles.container}>
        <StatusBar backgroundColor={Colors.main} />
        {this.renderHeader()}
        {this.state.selectFlag == 0 ? this.renderScrollTab() : <GameHtml />}

      </View>
    );
  }
}
const mapStateToProps = state => ({
  logged: state.user.logged,
  userId: state.user.id
});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Game);
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  }
});
