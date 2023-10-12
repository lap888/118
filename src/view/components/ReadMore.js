import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/Index';

function measureHeightAsync(component) {
    return new Promise(resolve => {
        component.measure((x, y, w, h) => {
            resolve(h);
        });
    });
}
function nextFrameAsync() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
export default class ReadMore extends Component {
    state = {
        measured: false,
        shouldShowReadMore: false,
        showAllText: false
    };

    async componentDidMount() {
        this._isMounted = true;
        await nextFrameAsync();
        if (!this._isMounted) {
            return;
        }
        const fullHeight = await measureHeightAsync(this._text);
        this.setState({ measured: true });
        await nextFrameAsync();
        if (!this._isMounted) {
            return;
        }
        const limitedHeight = await measureHeightAsync(this._text);
        if (fullHeight > limitedHeight) {
            this.setState({ shouldShowReadMore: true }, () => {
                this.props.onReady && this.props.onReady();
            });
        } else {
            this.props.onReady && this.props.onReady();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handlePressReadMore = () => {
        this.setState({ showAllText: true });
    };

    handlePressReadLess = () => {
        this.setState({ showAllText: false });
    };

    maybeRenderReadMore() {
        let { shouldShowReadMore, showAllText } = this.state;
        if (shouldShowReadMore && !showAllText) {
            if (this.props.renderTruncatedFooter) {
                return this.props.renderTruncatedFooter(this.handlePressReadMore);
            }

            return (
                <Text style={styles.button} onPress={this.handlePressReadMore}>
                    显示更多
            </Text>
            );
        } else if (shouldShowReadMore && showAllText) {
            if (this.props.renderRevealedFooter) {
                return this.props.renderRevealedFooter(this.handlePressReadLess);
            }

            return (
                <Text style={styles.button} onPress={this.handlePressReadLess}>
                    收起
            </Text>
            );
        }
    }

    render() {
        let { measured, showAllText } = this.state;
        let { numberOfLines } = this.props;
        return (
            <View>
                <Text
                    numberOfLines={measured && !showAllText ? numberOfLines : 0}
                    ref={text => {
                        this._text = text;
                    }}
                >
                    {this.props.children}
                </Text>
                {this.maybeRenderReadMore()}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        color: Colors.C6,
        marginTop: 5
    }
});
