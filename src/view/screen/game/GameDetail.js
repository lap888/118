import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Card, CardItem, Icon, Body, Toast } from 'native-base';
import { Header, Loading, ReadMore } from '../../components/Index';
import GameDetailFooter from './GameDetailFooter';
import { Send } from '../../../utils/Http';
class GameDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInfo: props.info,
            propagandaList: [],
        };
    }

    componentDidMount() {
        let gameId = this.state.gameInfo.id;
        let that = this;
        Send(`api/Game/GameDetail?gameId=${gameId}`, {}, 'get').then(res => {
            if (res.code == 200) {
                that.setState({ propagandaList: res.data });
            }
        });
    }


    /**
     * 显示版本和大小
     */
    vsdisplay(refs) {
        if (refs.gSize != null && refs.gVersion != null) {
            return (
                <View style={Styles.topTextTag}>
                    <Text style={Styles.littleText}>
                        版本 {refs.gVersion}
                    </Text>
                    <Text style={Styles.littleText}>
                        大小：{refs.gSize} MB
              </Text>
                </View>
            )
        } else if (refs.gSize === null && refs.gVersion != null) {
            return (
                <View style={Styles.topTextTag}>
                    <Text style={Styles.littleText}>
                        版本 {refs.gVersion}
                    </Text>
                </View>
            )
        } else if (refs.gSize != null && refs.gVersion === null) {
            return (
                <View style={Styles.topTextTag}>
                    <Text style={Styles.littleText}>
                        大小：{refs.gSize} MB
              </Text>
                </View>
            )
        }
    }
    /**
     * 游戏插图
     */
    illustration(imgs) {
        if (imgs != undefined) {
            return (
                imgs.map((item) =>
                    <Image key={item['id'].toString()}
                        source={{ uri: item['url'] }}
                        style={Styles.img}
                    />
                )
            )
        }
        return <View />
    }
    /**
     * 显示内容
     */
    displayView() {
        if (this.state.gameInfo != null) {
            return (
                <View>
                    <View style={Styles.topViewStyle}>
                        <View style={Styles.imageStyle}>
                            <Image
                                style={Styles.imageStyle}
                                source={{ uri: this.state.gameInfo.gameLogoUrl }}
                            />
                        </View>
                        <View style={Styles.topViewText}>
                            <Text style={Styles.topTextTitle}>{this.state.gameInfo.gTitle}</Text>
                            <View style={Styles.topTextTag}>
                                <Text style={Styles.tagStyle}>
                                    {this.state.gameInfo.categoryName}
                                </Text>
                            </View>
                            {this.vsdisplay(this.state.gameInfo)}
                        </View>
                    </View>
                    <Card>
                        <CardItem header>
                            <Text>游戏介绍</Text>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <ScrollView horizontal={true}>
                                    <View style={Styles.swiperStyle}>
                                        {this.illustration(this.state.propagandaList)}
                                    </View>
                                </ScrollView>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <ReadMore
                                    numberOfLines={4}
                                >
                                    <Text style={Styles.textCenterStyle}>
                                        {this.state.gameInfo.description}
                                    </Text>
                                </ReadMore>
                            </Body>
                        </CardItem>
                        <CardItem footer>
                        </CardItem>
                    </Card>
                </View>
            )
        } else {
            return (
                <Loading />
            )
        }
    }

    render() {
        let { gameInfo } = this.state;
        let { gTitle } = gameInfo;
        return (
            <Container>
                <Header title={gTitle} />
                <Content>
                    {this.displayView()}
                </Content>
                <GameDetailFooter Data={gameInfo != null ? gameInfo : {}} />
            </Container>
        );
    }
}
const mapStateToProps = state => ({
    logged: state.user.logged,
    userId: state.user.id
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GameDetail);
const Styles = StyleSheet.create({
    swiperStyle: {
        flex: 1,
        flexDirection: "row",
    },
    img: {
        height: 260,
        width: 130,
        margin: 5,
        borderRadius: 10,
        resizeMode: 'stretch',
    },
    iconStyle: {
        color: "gray",
        marginLeft: 20,
    },
    header: {
        backgroundColor: '#4cc7ab',
        justifyContent: "space-between",
        alignItems: "center"
    },
    title: {
        fontSize: 14,
        color: 'white',
    },
    body: {
        backgroundColor: '#4cc7ab',
        alignItems: 'center'
    },
    lineStyle: {
        height: 5,
        backgroundColor: "lightgray"
    },
    topViewStyle: {
        flexDirection: 'row',
        margin: 10,
    },
    imageStyle: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    topViewText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
    },
    topTextTitle: {
        fontSize: 16,
    },
    topTextTag: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
    },
    tagStyle: {
        marginRight: 5,
        fontSize: 11,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#25CDFF",
        color: "#25CDFF",
        padding: 3,
    },
    littleText: {
        fontSize: 10,
        marginRight: 15,
    },
    topContent: {
        flexDirection: 'row',
        margin: 10,
        justifyContent: 'space-around',
    },
    topContentFrame: {
        flexDirection: 'row',
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
    },
    paddingView: {
        flexDirection: "row",
        padding: 10,
    },
    topIcon: {
        width: 32,
        height: 32,
    },
    topPlay: {
        flexDirection: 'column',
        margin: 5,
    },
    topNum: {
        flexDirection: 'row',
        marginTop: 3,
    },
    number: {
        fontSize: 10,
        color: '#25CDFF',
    },
    topPeople: {
        fontSize: 10,
        color: 'gray',
    },
    coupon: {
        marginTop: 5,
        fontSize: 10,
        color: 'gray',
    },
    textCenterStyle: {
        fontSize: 14,
        textAlign: 'left',
        color: 'gray',
    },
    gameContent: {
        flexDirection: "row",
    },
    gcText: {
        flexDirection: "column",
        marginLeft: 10,
    },
    gcTitle: {
        fontSize: 10,
        color: 'red',
    },
    cntNavRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconRight: {
        color: "#4cc7ab",

    },
    imgSize: {
        width: 28,
        height: 28,
    },
    commentNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 15,
    },
    cmtNavTxt: {
        fontSize: 12,
        color: "#4cc7ab",
        marginLeft: 5,
        marginRight: 5,
    },
    shareContainer: { position: 'absolute', backgroundColor: '#FFFFFF', height: 196, left: 0, right: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
    shareHeader: { alignSelf: 'center', padding: 20, fontSize: 16, fontWeight: "400" },
    shareBody: { flexDirection: 'row' },
    shareItem: { justifyContent: 'center', alignItems: 'center', paddingLeft: 20 },
    shareImage: { justifyContent: 'center', alignItems: 'center', width: 50, height: 50 },
    shareText: { marginTop: 6 },
    shareFooter: { alignSelf: 'center', padding: 20 },
    shareFooterText: { fontSize: 16, fontWeight: "400" },
});