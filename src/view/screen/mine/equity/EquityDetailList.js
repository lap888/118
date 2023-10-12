import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Header, EquityListItem } from '../../../components/Index';
import { Colors } from '../../../theme/Index';
import { EquityApi, HistoryApi } from '../../../../api';
import RefreshListView from 'react-native-refresh-list-view';

export default class EquityDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            data: [],
            more: true,
            loading: true
        };
        this.params = {
            page: 1,
            PageSize: 20,
            type: ''
        }
    }

    componentDidMount() {
        this.getEquityRecords()
    }
    
    getEquityRecords = () => {
        EquityApi.EquityRecords({PageIndex: this.params.page, PageSize: this.params.PageSize})
        .then((data) => {
            if (data) {
                this.setState({
                    data: this.params.page == 1 ? data : this.state.data.concat(data), 
                    more: data.length < this.params.PageSize ? false : true,
                    loading: false, 
                })
            }else {
                this.setState({loading: false})
            }
        }).catch((err) => console.log('err', err))
    }

    getCandyRecord = () => {
        HistoryApi.CandyRecord({Source: 90, PageIndex: this.params.page, PageSize: this.params.PageSize})
        .then((data) => {
            if (data) {
                this.setState({
                    data: this.params.page == 1 ? data : this.state.data.concat(data),
                    more: data.length < this.params.PageSize ? false : true, 
                    loading: false
                })
                return;
            }else {
                this.setState({loading: false})
            }
        }).catch((err) => console.log('err', err))
    }
    
    getWallerRecord = () => {
        HistoryApi.WallerRecord({ModifyType: 23, PageIndex: this.params.page, PageSize: this.params.PageSize})
        .then((data) => {
            if (data) {
                this.setState({
                    data: this.params.page == 1 ? data : this.state.data.concat(data), 
                    more: data.length < this.params.PageSize ? false : true,
                    loading: false
                })
            }else {
                this.setState({loading: false})
            }
        }).catch((err) => console.log('err', err))
    }


    select = (value) => {
        this.setState({loading: true, data: [], type: value})
        this.params.page = 1;
        if (value === 1) {
            this.getEquityRecords()
        } if (value === 2) {
            this.getCandyRecord()
        } if (value === 3) {
            this.getWallerRecord()
        }
    }

    nextPage = () => {
        if (this.state.loading || !this.state.more) {
            return ;
        }
        this.setState({
            loading: true
        },() => {
            this.params.page++;
            if (this.state.type === 1) {
                this.getEquityRecords()
            } if (this.state.type === 2) {
                this.getCandyRecord()
            } if (this.state.type === 3) {
                this.getWallerRecord()
            }
        })
    }

    renderItem = ({item, index}) => {
        if (this.state.type === 1) {
            return (
                <EquityListItem type={1} item={item} index={index} />
            )
        }
        if (this.state.type === 2) {
            return (
                <EquityListItem type={2} item={item} index={index} />
            )
        }
        if (this.state.type === 3) {
            return (
                <EquityListItem type={3} item={item} index={index} />
            )
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.White}}>
                <Header title={'流水明细'}/>
                <View style={{flexDirection: 'row', height: 40, backgroundColor: Colors.White}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(1)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: this.state.type == 1 ? Colors.C6 : Colors.C12,}}>记录</Text>
                        </View>
                        <View style={{height: 2, width: 80, backgroundColor: this.state.type == 1 ? Colors.C6 : Colors.White}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(2)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: this.state.type == 2 ? Colors.C6 : Colors.C12,}}>糖果分红</Text>
                        </View>
                        <View style={{height: 2, width: 80, backgroundColor: this.state.type == 2 ? Colors.C6 : Colors.width}}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(3)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: this.state.type == 3 ? Colors.C6 : Colors.C12,}}>现金分红</Text>
                        </View>
                        <View style={{height: 2, width: 80, backgroundColor: this.state.type == 3 ? Colors.C6 : Colors.width}}/>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    {this.state.data ?
                        <RefreshListView
                            data={this.state.data}
                            keyExtractor={(item, index) => `${item.recordId} + ${item.modifyTime} + ${index}`}
                            renderItem={this.renderItem}
                            refreshState={this.state.loading}
                            onHeaderRefresh={() => this.select(this.state.type)}
                            onFooterRefresh={this.nextPage}
                            // 可选
                            footerRefreshingText='正在玩命加载中...'
                            footerFailureText='我擦嘞，居然失败了 =.=!'
                            footerNoMoreDataText='暂无更多数据...'
                            footerEmptyDataText='暂无更多数据...'
                        />
                    : null}                    
                </View>
            </View>
        );
    }
}


