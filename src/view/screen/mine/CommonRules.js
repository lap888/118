/*
 * @Author: top.brids 
 * @Date: 2019-12-28 16:18:51 
 * @Last Modified by: top.brids
 * @Last Modified time: 2021-08-29 17:39:40
 */
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Header } from '../../components/Index';
import { Colors } from '../../theme/Index';
export default class CommonRules extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderItem(item) {
        return (
            <View style={Styles.ruleContainer} key={item['key']}>
                <View style={Styles.verticalLine} />
                <View style={{ marginLeft: 6 }}>
                    <Text style={{ color: Colors.C0, fontSize: 16, fontWeight:'300' }}>{item['title']}</Text>
                    <Text style={Styles.ruleText}>{item['text']}</Text>
                </View>
            </View>
        );
    }
    renderContent(dataList) {
        return (
            <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={dataList}
                renderItem={({ item, index }) => this.renderItem(item, index)}
                keyExtractor={(item, index) => String(index)}
            />
        );
    }

    render() {
        let { title, rules } = this.props;
        return (
            <View style={Styles.container}>
                <Header title={title || '规则'} />
                {this.renderContent(rules)}
            </View>
        );
    }
}
const Styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.C8 },
    ruleContainer: { flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 20 },
    ruleText: { marginTop: 10, fontSize: 14, lineHeight: 19, color: Colors.C16 },
    verticalLine: { height: 20, width: 12, borderRadius: 1, backgroundColor: Colors.C6,marginTop:2 },
});
