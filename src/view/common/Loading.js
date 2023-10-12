import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animatin: true
        };
    }

    componentWillUnmount(){
        this.setState({animatin: false});
    }

    render() {
        return (
            <View style={styles.fa}>
                <View style={styles.smallbg}>
                    <ActivityIndicator animatin={true} color={'#fff'} size={50} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    fa: {
        flex: 1,
        width: width, 
        height: height, 
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    smallbg: {
        width: 100, 
        height: 100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        borderRadius: 5,
    },
})