import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { TASK_LIST_HISTORY } from '../../../../redux/ActionTypes';
import { Colors } from '../../../theme/Index';
import { EmptyComponent } from '../../../components/Index';
import { Send } from '../../../../utils/Http';
import { Toast } from '../../../common';
import moment from 'moment';
class TaskHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstLoading: true
    };
  }
  componentDidMount() {
    this.getMinningHistory();
  }
  /**
     * 获取过期任务列表
     */
  getMinningHistory() {
    if (!this.props.logged) return;
    var that = this;
    Send("api/system/TaskList?type=" + 1, {}, 'get').then(res => {
      if (that.state.firstLoad) that.setState({ firstLoad: false });
      if (res.code == 200) {
        that.props.resetTaskHistory(res.data);
      } else {
        Toast.tipBottom(res.message)
      }
    });
  }
  /**
   * 渲染任务Item
   * @param {*} item 
   * @param {*} index 
   */
  renderTaskItem(item, index) {
    return (
      <LinearGradient colors={[item.colors, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.miningItem} >
        <View style={Styles.miningItemHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.source !== 1 && <Icon name="codepen" color={Colors.White} size={20} type="FontAwesome" style={{ marginRight: 4 }} />}
            <Text style={Styles.miningItemName}>{`${item.minningName}`}</Text>
          </View>
        </View>
        <View style={Styles.miningItembody}>
          <View>
            <Text style={Styles.miningItemTime}>{`周期:${moment(item.beginTime).format('YYYY/MM/DD')} - ${moment(item.endTime).format('YYYY/MM/DD')}`}</Text>
            <Text style={Styles.miningItemGemout}>{`任务已到期`}</Text>
          </View>
        </View>
      </LinearGradient >
    )
  }
  /**
   * 空列表组件
   */
  renderEmptyComponent() {
    return (
      <EmptyComponent isLoading={this.state.firstLoad}></EmptyComponent>
    )
  }
  render() {
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: 10 }}
        data={this.props.taskListHistory}
        renderItem={({ item, index }) => this.renderTaskItem(item, index)}
        ListEmptyComponent={() => this.renderEmptyComponent()}
        onEndReachedThreshold={0.5}
        keyExtractor={(item, index) => String(index)}
      />
    );
  }
}
const mapStateToProps = state => ({
  logged: state.user.logged,
  userId: state.user.id,
  taskListHistory: state.task.taskListHistory
});
const mapDispatchToProps = dispatch => ({
  resetTaskHistory: taskListHistory => dispatch({ type: TASK_LIST_HISTORY, payload: { taskListHistory } })
});
export default connect(mapStateToProps, mapDispatchToProps)(TaskHistory);

const Styles = StyleSheet.create({
  miningItem: { margin: 10, marginBottom: 0, backgroundColor: '#53b488', borderRadius: 5, padding: 15 },
  miningItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miningItemName: { fontSize: 18, color: '#ffffff' },
  miningItemActivity: { fontSize: 14, color: '#ffffff' },
  miningItembody: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  miningItemGemin: { fontSize: 14, color: '#ffffff' },
  miningItemGemout: { marginTop: 6, fontSize: 14, color: '#ffffff' },
  miningItemTime: { marginTop: 6, fontSize: 14, color: '#ffffff', width: 320 },
  miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#ffffff', padding: 18, paddingTop: 10, paddingBottom: 10 },
  miningItemExchange: { fontSize: 18, color: '#ffffff' },
});
