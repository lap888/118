import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '../../components/Index';
import { STAR_LEVEL_DETAILS } from '../../../config/Constants';
import { Metrics, Colors } from '../../theme/Index';
export default class StarLevelRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    /**
     * 渲染星级达人Item
     * @param {*} item 
     * @param {*} index
     */
    renderStarLevelItem(item, index) {
        let { name, request, reward } = item;
        return (
            <LinearGradient colors={[Colors.C6, Colors.LightG]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={Styles.miningItem}>
                <View style={Styles.miningItemHeader}>
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Text style={Styles.miningItemName}>{name}</Text>
                    </View>
                    <Text style={Styles.miningItemExchange}>{`${request}`}</Text>
                </View>
                <Text style={Styles.miningItemGemin}>{reward}</Text>
            </LinearGradient>
        );
    }
    /**
     * 渲染星级达人等级列表
     */
    renderStarLevelList() {
        return (
            <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={STAR_LEVEL_DETAILS}
                renderItem={({ item, index }) => this.renderStarLevelItem(item, index)}
                keyExtractor={(item, index) => String(index)}
            />
        )
    }

    /**
     * 渲染各类星级达人规则
     */
    renderStarLevelRule() {
        return (
            this.renderStarLevelList()
        );
    }
    render() {
        return (
            <View style={Styles.container}>
                <Header title="规则" />
                {this.renderStarLevelRule()}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    miningItem: { marginBottom: 5, backgroundColor: '#53b488', padding: 15 },
    miningItemHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    miningItemName: { fontSize: 16, color: '#ffffff', marginLeft: 4 },
    miningItemGemin: { fontSize: 14, color: '#ffffff', marginTop: 6 },
    miningItemFooter: { alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'flex-end', width: Metrics.screenWidth * 0.3, flexWrap: "wrap" },
    miningItemExchange: { flex: 3, fontSize: 13, color: '#ffffff' },
});