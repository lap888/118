import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors, Metrics } from '../../theme/Index';
import { MathFloat } from '../../../utils/Index';

export default class GoodsListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		let { data, index } = this.props;
		return (
			<TouchableOpacity key={index} activeOpacity={0.8} style={[styles.itemView, { flexDirection: 'row', paddingHorizontal: 10 }]} onPress={() => { Actions.push('GoodsDetail', { data: data }) }}>
				<Image style={styles.img} source={{ uri: data.shopPic1 }} />
				<View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
					<Text style={{ marginTop: 5, width: Metrics.screenWidth / 2 }} numberOfLines={3}>{data.name}</Text>
					<View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 5, marginBottom: 3 }}>
						<Text style={{ fontSize: 14, color: Colors.main }}><Text style={{ fontSize: 12 }}></Text>{data.ybPrice}GC </Text>
						<Text style={{ fontSize: 12, color: Colors.grayFont, lineHeight: 18, textDecorationLine: 'line-through' }} >原价 ￥{(data.price * 1.1).toFixed(2)}</Text>
					</View>
					<Text style={{ fontSize: 12, color: Colors.grayFont, marginTop: 5 }}>库存 {data.totalAmount}</Text>
					<Text style={{ fontSize: 12, color: Colors.grayFont, marginTop: 5 }}>{'点击查看商品详情 >'}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	itemView: {
		width: Metrics.screenWidth - 10,
		borderRadius: 2,
		marginBottom: 10,
		backgroundColor: Colors.White,
	},
	img: {
		width: (Metrics.screenWidth - 150) / 2,
		height: (Metrics.screenWidth - 150) / 2,
		borderTopRightRadius: 2,
		borderTopLeftRadius: 2,
		backgroundColor: Colors.main
	},
})
