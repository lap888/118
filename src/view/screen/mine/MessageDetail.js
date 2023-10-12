import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Header, Loading } from '../../components/Index';
import moment from 'moment';
import { Metrics } from '../../theme/Index';
import TDetailContent from '../digg/TDetailContent';
import { Message_Detail_Mock } from '../../../config/Constants';
export default class MessageDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msgData: {},
      isLoad: true
    };
  }
  UNSAFE_componentWillMount() {
    this.reloadTopicData();
  }

  reloadTopicData() {
    this.setState({
      isLoad: false,
      msgData: this.props.msgData
    });

  }

  renderContent() {
    if (this.state.isLoad) {
      return (
        <Loading />
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <Text style={{ textAlign: "center", marginTop: 10, fontSize: 18 }}>
          {this.props.msgData.title ? this.props.msgData.title : ""}
        </Text>
        <Text style={{
          fontSize: 12,
          padding: 10,
          color: "gray"
        }}>
          发布时间: {this.props.msgData.ceratedAt}
        </Text>
        <View style={{ alignItems: "center", height: Metrics.screenHeight }}>
          <TDetailContent TDContent={this.props.flag === "system" ? this.state.msgData.content : this.props.msgData.content} />
        </View>
        {/* <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 13, letterSpacing: 1 }}>
            {`${this.props.flag === "system" ? this.state.msgData.content : this.props.msgData.content}`}
          </Text>
        </ScrollView> */}
      </View>
    )
  }
  render() {
    return (
      <SafeAreaView style={Styles.contentContainer}>
        <Header title={this.props.flag === "system" ? "系统消息" : "我的消息"} />
        {this.renderContent()}
      </SafeAreaView>
    );
  }
}
const Styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  }
});
