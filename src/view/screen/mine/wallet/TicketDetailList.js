import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import { Header } from '../../../components/Index';
import { Colors, Metrics } from '../../../theme/Index';
import RefreshListView from 'react-native-refresh-list-view';
import { UserApi } from '../../../../api';

export default class TicketDetailList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: '',
            loading: true,
            more: true
        };
        this.params = { 
            "PageIndex": 1, 
            "PageSize": 100
        }
    }

    componentDidMount() {
        this.getGetailList(this.params)
    }

    getGetailList = (params) => {
        UserApi.ticketRecords(params)
        .then((res) => {
            if (res.code === 200) {
                this.setState({
                    data: res.data,
                    more: res.data.length < this.params.PageSize ? false : true,
                    loading: false,
                })
            }
        }).catch((err) => this.setState({loading: false, data: ''}))
    }

    onHeaderRefresh = () => {
        this.params.PageIndex = 1;
        this.getGetailList(this.params);
    }

    onFooterRefresh = () => {
        if (this.state.loading || !this.state.more) {
            return ;
        }
        this.params.PageIndex++;
        this.getGetailList(this.params);
    }

    renderItem = ({item, index}) => {
        return(
            <View style={{paddingHorizontal: 15, marginTop: 10 }}>
                <ImageBackground style={{paddingHorizontal: 15, width: Metrics.screenWidth - 30, height: (Metrics.screenWidth - 30)/5 }} resizeMode={'stretch'} source={require('../../../images/mine/wallet/itembg.png')}>
                    <View style={{flexDirection: 'row', backgroundColor: Colors.White, height: 60, margin: 1, borderRadius: 6}}>
                        <View style={{flex: 1, padding: 5}}>
                            <Text style={{flex: 1, fontSize: 15}} numberOfLines={2}>{item.modifyDesc}</Text>
                            <Text style={{fontSize: 12, color: Colors.grayFont}}>时间:  {item.modifyTime}</Text>
                        </View>
                        <View style={{paddingHorizontal: 10, justifyContent: 'center'}}>
                            <Text style={{fontSize: 18, color: Colors.C6}}>{item.incurred > 0 ? `+${item.incurred}` : item.incurred}</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
                <Header title={'新人券明细'} />
                <View style={{flex: 1}}>
                    {this.state.data ?
                        <RefreshListView
                            data={this.state.data}
                            keyExtractor={(item, index) => `${item.recordId} + ${item.modifyTime} + ${index}`}
                            renderItem={this.renderItem}
                            refreshState={this.state.loading}
                            onHeaderRefresh={this.onHeaderRefresh}
                            onFooterRefresh={this.onFooterRefresh}
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
