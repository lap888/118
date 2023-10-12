import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Header, ScrollTopBar } from '../../components/Index';
import { Colors } from '../../theme/Index';
import PurchasePage from './PurchasePage';
import SalesListPage from './SalesListPage';
import TransactionPage from './TransactionPage';
import BusinessCompletePage from './BusinessCompletePage';
export default class BusinessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.businessType
        };
    }

    select = (index) => {
        this.setState({index})
    }
    render() {
        const { index } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.White }}>
                <Header title="我的订单" />
                <View style={{flexDirection: 'row', height: 50, borderWidth: 1, borderColor: Colors.C13}}>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(0)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: index === 0 ? Colors.C6 : Colors.C11, fontSize: 16 }}> 买单 </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(1)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: index === 1 ? Colors.C6 : Colors.C11, fontSize: 16 }}> 卖单 </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(2)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: index === 2 ? Colors.C6 : Colors.C11, fontSize: 16 }}>交易中</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1, alignItems: 'center' }} onPress={() => this.select(3)}>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: index === 3 ? Colors.C6 : Colors.C11, fontSize: 16 }}>已完成</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    {index === 0 && <PurchasePage isFocus={this.state.index === 0} />}
                    {index === 1 && <SalesListPage isFocus={this.state.index === 1} />}
                    {index === 2 && <TransactionPage isFocus={this.state.index === 2} />}
                    {index === 3 && <BusinessCompletePage isFocus={this.state.index === 3} />}
                </View>
            </View>
        );
    }
}
