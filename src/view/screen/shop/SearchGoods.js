import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { ShopApi } from '../../../api';
import { Loading } from '../../common';
import { Colors } from '../../theme/Index';
import GoodsListItem from './GoodsListItem';

export default class SearchGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title ? this.props.title : '',
            type: this.props.type,
            keyword: '',
            dataList: [],
            pageIndex: 1,
            pageSize: 20,
            isLoading: false
        };
    }

    componentDidMount() {
        if (this.state.type && this.state.type != '') {
            this.submit()
        }
    }

    submit = () => {
        const { type, keyword, pageIndex, pageSize } = this.state;
        ShopApi.getShopsByType(type, keyword, pageIndex, pageSize)
            .then((data) => {
                this.setState({
                    dataList: pageIndex <= 1 ? data : this.state.dataList.concat(data),
                    refreshState: data.length < pageSize ? RefreshState.EmptyData : RefreshState.Idle,
                    isLoading: false
                })
            }).catch((err) => {
                this.setState({
                    goodsList: [],
                    refreshState: RefreshState.EmptyData,
                    isLoading: false
                })
            })
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, pageIndex: 1 }, () => {
            this.submit();
        });
    }

    onFooterRefresh = () => {
        this.setState({
            refreshState: RefreshState.FooterRefreshing,
            pageIndex: this.state.pageIndex + 1
        }, () => {
            this.submit();
        });
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 44, backgroundColor: Colors.main }}>
                    <TouchableOpacity style={{ width: 40, height: 44, justifyContent: 'center', alignItems: 'center' }} onPress={() => Actions.pop()}>
                        <Icon name={'ios-chevron-back-outline'} size={20} color={Colors.White} />
                    </TouchableOpacity>
                    {
                        this.props.title ?
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 40 }}>
                                <Text style={{ fontSize: 16, color: Colors.White }}>{this.props.title}</Text>
                            </View> :
                            <View style={styles.topbar}>
                                <Icon name={'search-sharp'} size={16} color={Colors.grayFont} />
                                <TextInput
                                    style={{ flex: 1, padding: 0, marginLeft: 5 }}
                                    placeholder={'请输入关键字'}
                                    value={this.state.keyword}
                                    autoFocus={true}
                                    onChangeText={(value) => this.setState({ keyword: value })}
                                    onSubmitEditing={() => this.setState({ isLoading: true }, this.submit)}
                                    returnKeyType={'search'}
                                    returnKeyLabel={'搜索'}
                                />
                            </View>
                    }
                </View>

                <View style={{ flex: 1 }}>
                    <RefreshListView
                        style={{ flex: 1, paddingTop: 10 }}
                        data={this.state.dataList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => <GoodsListItem data={item} index={index} />}
                        ListEmptyComponent={() => {
                            if (this.state.isLoading) {
                                return <View />;
                            }
                            return (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../images/shop/wushangping.png')} />
                                </View>
                            )
                        }
                        }
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
                {this.state.isLoading && <Loading />}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    topbar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 17,
        marginHorizontal: 10,
        marginVertical: 5,
        backgroundColor: Colors.backgroundColor
    }
})
