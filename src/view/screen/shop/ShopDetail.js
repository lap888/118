import React, { Component } from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import RefreshListView from 'react-native-refresh-list-view';
import { ShopApi } from '../../../api';
import { Header } from '../../components/Index';
import GoodsListItem from './GoodsListItem';

export default class ShopDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            shopName: '',
            shopImg: ''
        };
    }

    componentDidMount() {
        this.getStore()
    }

    getStore = () => {
        ShopApi.getMyStore(this.props.id)
        .then((data) => {
            this.setState({
                shopName: data.shopName,
                dataList: data.shopList,
                shopImg: data.avatarUrl
            })
        }).catch((err) => console.log('err', err))
    }
    
    render() {
        const { shopName, shopImg, dataList,  } = this.state;
        return (
            <View style={{flex: 1}}>
                <Header title={'店铺'} />
                <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginVertical: 20}}>
                    {shopImg == "" ? <Image style={{height: 40, width: 40, borderRadius: 20}} source={require('../../images/logo.png')} /> : 
                    <Image style={{height: 40, width: 40, borderRadius: 20}} source={{uri: shopImg}} />}
                    <Text style={{fontSize: 14, marginLeft: 10 }}>{shopName}</Text>
                </View>
                <Text style={{marginLeft: 20, }}>商品</Text>
                <View style={{flex: 1, marginTop: 10 }}>
                    <RefreshListView
                        style={{paddingTop: 10}}
						data={dataList}
						keyExtractor={(item, index) =>  index + '1'}
                        renderItem={({ item, index }) => <GoodsListItem data={item} index={index} /> }
                        numColumns={2}
                        // ListEmptyComponent={() => 
                        // <View style={{flex: 1}}>
                        //     <Text>暂时没有查到哦</Text>
                        // </View>}
						refreshState={this.state.refreshState}
						onHeaderRefresh={this.onHeaderRefresh}
						onFooterRefresh={this.onFooterRefresh}
						// 可选
						footerRefreshingText='正在玩命加载中...'
						footerFailureText='我擦嘞，居然失败了 =.=!'
						footerNoMoreDataText='暂无更多数据...'
						footerEmptyDataText='暂无更多数据...'
					/>
                </View>
            </View>
        );
    }
}
