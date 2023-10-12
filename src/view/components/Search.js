import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import {
    Container, Content, Card, CardItem, Body,
    Button, Icon, Right, Form, Label, Text, Thumbnail, Footer, FooterTab, Header, Left, Title, Item, Input
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../theme/Index';
export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
        };
    }
    _onChangeText = (inputData) => {
        //把获取到的内容，设置给showValue
        this.setState({ showValue: inputData });
    }
    _onChangeSearch = (inputData) => {
        this.setState({ searchValue: inputData });
    }
    showData() {
        alert(this.state.showValue);//展示输入框的内容
    }
    render() {
        return (
            <Header searchBar rounded >
                <Item style={{ width: 300, backgroundColor: '#f0f0f0', marginTop: 1 }} >
                    <Icon name="ios-search" />
                    <Input placeholder="搜索任务"
                        placeholderTextColor="#bebdc2" onChangeText={this._onChangeSearch} />
                </Item>
                <Button transparent onPress={() => { alert(this.state.searchValue) }}>
                    <Text style={{ color: '#7e7e7e' }}>搜索</Text>
                </Button>
            </Header>
        );
    }
}
