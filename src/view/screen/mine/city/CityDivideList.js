import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../theme/Index';
import { Header, CityDevideItem } from '../../../components/Index';
import { Send } from '../../../../utils/Http';

export default class CityDivideList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseCandyH: 0,
            extCandyH: 0,
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            candyHList: [],
            candyHRule: []
        }
    }
    componentDidMount() {
        this.onHeaderRefresh();
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 })
        let params = {
            pageIndex: 1,
            pageSize: this.state.pageSize,
            dividendType: this.props.dividendType,
            accountType: this.props.accountType,
            cityNo: this.props.cityNo,
            keyType: this.props.keyType

        }
        Send('api/city/RecordNew', params).then(res => {
            if (res.code == 200) {
                this.setState({
                    candyHList: res.data,
                    totalPage: res.recordCount,
                    refreshState: res.data.length < 1 ? RefreshState.EmptyData : RefreshState.Idle
                })
            } else {
                this.setState({
                    candyHList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            }
        });
    }

    onFooterRefresh = () => {
        let that = this;
        that.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            let params = {
                pageIndex: that.state.pageIndex,
                pageSize: that.state.pageSize,
                dividendType: this.props.dividendType,
                accountType: this.props.accountType,
                cityNo: this.props.cityNo,
                keyType: this.props.keyType
            }
            Send('api/city/RecordNew', params).then(res => {
                if (res.code == 200) {
                    this.setState({
                        candyHList: that.state.candyHList.concat(res.data),
                        totalPage: res.recordCount,
                        refreshState: this.state.candyHList.length >= this.state.totalPage ? RefreshState.EmptyData : RefreshState.Idle,
                    })
                } else {
                    this.setState({
                        candyHList: [],
                        totalPage: 0,
                        refreshState: RefreshState.EmptyData
                    })
                }
            });
        });
    }
    keyExtractor = (item, index) => {
        return index.toString()
    }
    /**
     * 渲染活跃值列表
     */
    renderCandyHList() {
        return (
            <RefreshListView
                data={this.state.candyHList}
                keyExtractor={this.keyExtractor}
                renderItem={({ item, index }) => <CityDevideItem index={index} item={item} />}
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.onHeaderRefresh}
                onFooterRefresh={this.onFooterRefresh}
                // 可选
                footerRefreshingText='正在玩命加载中...'
                footerFailureText='我擦嘞，居然失败了 =.=!'
                footerNoMoreDataText='暂无更多数据...'
                footerEmptyDataText='暂无更多数据...'
            />
        )
    }
    render() {
        return (
            <View style={Styles.container}>
                <Header title={`${this.props.title}`} />
                {this.renderCandyHList()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    totalDiamond: {
        backgroundColor: Colors.primary,
        paddingTop: 2,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    stick: { height: 40, width: 3, borderRadius: 3 },
    totalNum: {
        color: Colors.C8,
        fontSize: 14
    },
    tTxt: {
        marginLeft: 4,
        fontSize: 15,
        color: Colors.White
    }
});
