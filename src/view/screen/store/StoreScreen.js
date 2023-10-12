import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated, Image, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Ionicons';
import { Geolocation } from "react-native-amap-geolocation";
import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';

import { OtherApi, StoreApi } from '../../../api';
import { onPressSwiper } from '../../../utils/CommonFunction';
import { Header, StickyHeader } from '../../components/Index';

import { Colors, Metrics } from '../../theme/Index';
import { connect } from 'react-redux';

const OPTIONS = [
    { key: 0, name: "全部", image: require('../../images/store/quanbu.png') },
    { key: 1, name: "美食", image: require('../../images/store/meishi.png') },
    { key: 2, name: "娱乐", image: require('../../images/store/yule.png') },
    { key: 3, name: "日用百货", image: require('../../images/store/riyongbaihuo.png') },
    { key: 4, name: "生活服务", image: require('../../images/store/shenghuofuwu.png') },
    { key: 5, name: "更多", image: require('../../images/store/qita.png') },
];
const tarNum = 6;

class StoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bannerList: [],
            banner: require('../../images/store/storeBanner.png'),
            selected: 0,
            scrollY: new Animated.Value(0),
            headHeight: -1,
            dataList: [],
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            PageSize: 10,
            PageIndex: 1,
        };
    }

    componentDidMount() {
        // await Geolocation.getCurrentPosition(
        //     position => {
        //         let latitude = position.location.latitude.toFixed(6);
        //         let longitude = position.location.longitude.toFixed(6);
        //         this.setState({
        //             latitude: latitude,
        //             longitude: longitude
        //         })
        //         this.onHeaderRefresh()
        //     error => {
        //         console.log('error', error)
        //     }})
        this.onHeaderRefresh()
    }

    getBanner = () => {
        OtherApi.getActiveList(0)
            .then((data) => {
                this.setState({ bannerList: data });
            }).catch((err) => console.log('err', err))
    }

    getStoreList = () => {
        let params = {
            "Type": this.state.selected,
            "Longitude": this.state.longitude,
            "Latitude": this.state.latitude,
            "PageIndex": this.state.PageIndex,
            "PageSize": this.state.PageSize
        }
        console.log('params: ', params.Type);
        StoreApi.getStoresList(params)
            .then((data) => {
                this.setState({
                    dataList: this.state.PageIndex <= 1 ? data : this.state.dataList.concat(data),
                    refreshState: data.length < this.state.PageSize ? RefreshState.EmptyData : RefreshState.Idle,
                })
            }).catch((err) =>
                this.setState({
                    dataList: [],
                    refreshState: RefreshState.EmptyData,
                }))
    }

    onOptionPress = (item) => {
        this.setState({
            selected: item.key,
            refreshState: RefreshState.HeaderRefreshing,
            PageIndex: 1
        }, () => {
            this.getStoreList();
        });
    }

    onHeaderRefresh = () => {
        this.setState({ refreshState: RefreshState.HeaderRefreshing, PageIndex: 1 }, () => {
            this.getStoreList();
        });
    }

    onFooterRefresh = () => {
        this.setState({
            refreshState: RefreshState.FooterRefreshing,
            PageIndex: this.state.PageIndex + 1
        }, () => {
            this.getStoreList();
        });
    }


    openAMap = (lat, lon) => {
        const url = Platform.OS === 'ios'
            ? `iosamap://path?sourceApplication=applicationName&sid=&slat=${this.state.latitude}&slon=${this.state.longitude}&sname=当前位置&did=&dlat=${lat}&dlon=${lon}&dname=目标位置&dev=0&t=0`
            : `amapuri://route/plan/?sid=&slat=${this.state.latitude}&slon=${this.state.longitude}&sname=当前位置&did=&dlat=${lat}&dlon=${lon}&dname=目标位置&dev=0&t=0`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url)
            } else {
                console.log("请先安装")
            }
        })
    }


    /**
     * 渲染轮播图
     */
    renderSwiper = () => {
        return (
            <View style={styles.swiper}>
                <Swiper
                    key={this.state.bannerList.length}
                    horizontal={true}
                    loop={true}
                    autoplay={true}
                    autoplayTimeout={16}
                    removeClippedSubviews={false}
                    paginationStyle={{ bottom: 5 }}
                    showsButtons={false}
                    activeDotStyle={{ width: 15, height: 3, backgroundColor: Colors.White, borderRadius: 1 }}
                    dotStyle={{ width: 15, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1 }}
                >
                    {this.state.bannerList.map((item, index) =>
                        <TouchableOpacity key={index} onPress={() => onPressSwiper(item, this.props.mobile, this.props.userId)}>
                            <Image style={styles.banner} resizeMode='stretch' source={{ uri: item.imageUrl }} />
                        </TouchableOpacity>
                    )}
                </Swiper>
            </View >
        )
    }
    /*
    * 渲染轮播图
    */
    renderBanner = () => {
        return (
            <View style={styles.swiper}>
                <TouchableOpacity onPress={() => Actions.push('AddStore')}>
                    <Image style={styles.banner} resizeMode='stretch' source={this.state.banner} />
                </TouchableOpacity>
            </View >
        )
    }

    renderOptions() {
        return (
            <View style={styles.options}>
                {OPTIONS.map(item => {
                    let { key, name, route, image } = item;
                    return (
                        <TouchableOpacity key={key} style={styles.optionTouch} onPress={() => this.onOptionPress(item)}>
                            <Image source={image} style={this.state.selected == key ? { width: 35, height: 35 } : { width: 30, height: 30 }} />
                            <Text style={styles.optionTitle}>{name}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={styles.item} onPress={() => Actions.push('StoreDetail', { store: item })}>
                <Image style={{ width: 90, height: 90 }} source={{ uri: item.logoPic }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        {item.order != 0 &&
                            <View style={{ marginTop: 5, paddingHorizontal: 5, borderRadius: 3, backgroundColor: Colors.main, marginRight: 5 }}>
                                <Text style={{ color: Colors.White, fontSize: 13 }}>精选</Text>
                            </View>
                        }
                        <Text style={{ marginTop: 5, fontSize: 14 }}>{item.name}</Text>
                    </View>
                    {/* <Text style={{color: Colors.grayFont}}>{'助力'}</Text> */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.itemTag}>
                            <Text style={{ fontSize: 12, color: Colors.main }}>{item.type}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row',marginHorizontal:10,marginTop:5 }}>
                            <Icon name={'thumbs-up-sharp'} size={16} color={Colors.grayFont} />
                        </View>
                        <View style={{ flexDirection: 'row',marginTop:5 }}>                            
                            <Icon name={'thumbs-down-sharp'} size={16} color={Colors.grayFont} />
                        </View> */}
                    </View>
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }} onPress={() => this.openAMap(item.latitude, item.longitude)}>
                    <Icon name={'navigate-outline'} size={18} color={Colors.grayFont} />
                    <Text style={{ color: Colors.grayFont }}>{item.distance >= 1000 ? `${(item.distance / 1000).toFixed(2)}km` : `${item.distance}m`}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    listHeaderComponent = () => {
        return <View>
            {this.renderBanner()}
            {this.renderOptions()}
        </View>
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.backgroundColor }}>
                <Header isTabBar={true} title={'附近店铺'} />
                <View style={{ flex: 1 }}>
                    <RefreshListView
                        ListHeaderComponent={this.listHeaderComponent()}
                        data={this.state.dataList}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={this.renderItem}
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

const mapStateToProps = state => ({
    location: state.user.location,
});

const mapDispatchToProps = dispatch => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(StoreScreen);

const styles = StyleSheet.create({
    swiper: {
        height: 150,
        paddingVertical: 10,
        backgroundColor: Colors.White,
    },
    banner: {
        height: 130,
        width: Metrics.screenWidth - 20,
        marginLeft: 10,
        borderRadius: 5
    },
    options: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 10,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        backgroundColor: Colors.White,
    },
    optionTouch: {
        justifyContent: 'center',
        alignItems: 'center',
        width: (Metrics.screenWidth - 20) / tarNum,
        marginTop: 10
    },
    optionTitle: {
        marginTop: 5,
        fontSize: 12
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: Colors.White
    },
    itemTag: {
        marginBottom: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: Colors.main,
        paddingVertical: 3,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
})