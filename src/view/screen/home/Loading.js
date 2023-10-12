import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
class Loading extends Component {

    componentDidMount() {
        // SplashScreen.hide();
        this.timer = setTimeout(() => {
            SplashScreen.hide(); 
            Actions.replace('Index');
        }, 2000);
    }

    render() {
        return (
            <>
            </>
        );
    }
}
const mapStateToProps = state => ({

});
const mapDispatchToProps = dispatch => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Loading);

