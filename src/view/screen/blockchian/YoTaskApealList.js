import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';

import { Header } from '../../components/Index';
import { Colors, Metrics } from '../../theme/Index';
import CurrencyApi from '../../../api/yoyoTwo/currency/CurrencyApi';

class YoTaskApealList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            pageIndex: 1,
            pageSize: 20
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
        DeviceEventEmitter.addListener('refranshQAList', () => {
            this.onHeaderRefresh();
        })
    }

    getList = () => {
        const { dataList, pageIndex, pageSize } = this.state;
        CurrencyApi.feedbackRecord(pageIndex, pageSize)
            .then((data) => {
                this.setState({
                    dataList: pageIndex == 1 ? data : dataList.concat(data),
                    totalPage: 0,
                    refreshState: data.length < pageSize ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }).catch((err) => {
                this.setState({
                    dataList: [],
                    totalPage: 0,
                    refreshState: RefreshState.EmptyData
                })
            })
            
    }
    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.getList()
        });
    }

    onFooterRefresh = () => {
        this.setState({ refreshState: RefreshState.FooterRefreshing, pageIndex: this.state.pageIndex + 1 }, () => {
            this.getList()
        });
    }

    renderList() {
        return (
            <RefreshListView
                data={this.state.dataList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    let res =  JSON.parse(item.description);
                    return (
                        <View>
                            <TouchableOpacity style={styles.item} onPress={() => { Actions.push('FeedbackDetails', { data: item }) }}>
                                <Text style={{ fontSize: 14, color: Colors.fontColor }}>{res[0].content}</Text>
                                <Text style={{ fontSize: 12, color: Colors.grayFont, marginTop: 5 }}>{item.updatedAt}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
                refreshState={this.state.refreshState}
                onHeaderRefresh={this.onHeaderRefresh}
                onFooterRefresh={this.onFooterRefresh}
                // 可选
                footerRefreshingText='正在玩命加载中...'
                footerFailureText='我擦嘞，居然失败了 =.=!'
                footerNoMoreDataText='暂无更多数据...'
                footerEmptyDataText='暂无更多数据...'
            />
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header title="反馈记录" />
                {this.renderList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(YoTaskApealList);

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    sequenceTitle: { fontSize: 14, color: Colors.C11 },
    sequenceTitleed: { fontSize: 16, color: Colors.main },
    sequence: {
        flexDirection: 'row', 
        alignItems: 'center', 
        height: 50, 
        width: Metrics.screenWidth, 
        backgroundColor: Colors.White
    },
    searchContainer: { padding: 12, borderWidth: 1, borderColor: Colors.C16, paddingTop: 8, paddingBottom: 8, borderRadius: 8, backgroundColor: Colors.White, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    mobileText: { fontSize: 15, color: Colors.C6, fontWeight: 'bold' },
    mobileInput: { padding: 8, marginLeft: 10, borderRadius: 6, backgroundColor: Colors.C8, marginRight: 10, fontSize: 15, color: Colors.C2, flex: 1, textAlignVertical: 'center', borderWidth: 1, borderColor: Colors.C16 },
    searchIcon: { fontWeight: 'bold', color: Colors.C6, fontSize: 30 },
    inviteCode: { fontSize: 12, color: Colors.C16, },

    item: { margin: 10, marginBottom: 0, backgroundColor: Colors.White, borderRadius: 5, padding: 10 },
    iptView: {
        minHeight: 178,
        flexDirection: 'row',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: Colors.White,
        borderRadius: 5
    },
    imgView: {
        width: 80,
        height: 80,
        borderRadius: 3,
        marginRight: 5,
        marginLeft: 20,
        backgroundColor: Colors.White
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 3,
    },
    bigBtn: {
        marginTop: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 80
    },
});



