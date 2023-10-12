/**
 * @name ImageCode
 * @desc 滑动拼图验证
 * @author darcrand
 * @version 2019-02-26
 *
 * @param {String} imageUrl 图片的路径
 * @param {Number} imageWidth 展示图片的宽带
 * @param {Number} imageHeight 展示图片的高带
 * @param {Number} fragmentSize 滑动图片的尺寸
 * @param {Function} onReload 当点击'重新验证'时执行的函数
 * @param {Function} onMath 匹配成功时执行的函数
 * @param {Function} onError 匹配失败时执行的函数
*/
import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, PanResponder, Image, TouchableOpacity } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';
const icoSuccess = require("../../images/icons/success.png")
const icoError = require("../../images/icons/error.png")
const icoReload = require("../../images/icons/reload.png")
const icoSlider = require("../../images/icons/slider.png")

const STATUS_LOADING = 0 // 还没有图片
const STATUS_READY = 1 // 图片渲染完成,可以开始滑动
const STATUS_MATCH = 2 // 图片位置匹配成功
const STATUS_ERROR = 3 // 图片位置匹配失败

const arrTips = [{ ico: icoSuccess, text: "匹配成功" }, { ico: icoError, text: "匹配失败" }]

// 生成裁剪路径
function createClipPath(ctx, size = 100, styleIndex = 0) {
    const styles = [
        [0, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
    ]
    const style = styles[styleIndex]

    const r = 0.1 * size
    ctx.save()
    ctx.beginPath()
    // left
    ctx.moveTo(r, r)
    ctx.lineTo(r, 0.5 * size - r)
    ctx.arc(r, 0.5 * size, r, 1.5 * Math.PI, 0.5 * Math.PI, style[0])
    ctx.lineTo(r, size - r)
    // bottom
    ctx.lineTo(0.5 * size - r, size - r)
    ctx.arc(0.5 * size, size - r, r, Math.PI, 0, style[1])
    ctx.lineTo(size - r, size - r)
    // right
    ctx.lineTo(size - r, 0.5 * size + r)
    ctx.arc(size - r, 0.5 * size, r, 0.5 * Math.PI, 1.5 * Math.PI, style[2])
    ctx.lineTo(size - r, r)
    // top
    ctx.lineTo(0.5 * size + r, r)
    ctx.arc(0.5 * size, r, r, 0, Math.PI, style[3])
    ctx.lineTo(r, r)

    ctx.clip()
    ctx.closePath()
}

export default class ImageCode extends Component {
    static defaultProps = {
        imageUrl: "",
        imageWidth: 500,
        imageHeight: 300,
        fragmentSize: 80,
        onReload: () => { },
        onMatch: () => { },
        onError: () => { }
    }

    constructor(props) {
        super(props);
        this.state = {
            isMovable: false,
            offsetX: 0, //图片截取的x
            offsetY: 0, //图片截取的y
            startX: 0, // 开始滑动的 x
            oldX: 0,
            currX: 0, // 滑块当前 x,
            status: STATUS_LOADING,
            showTips: false,
            tipsIndex: 0
        };
    }
    UNSAFE_componentWillMount() {
        this.panResponder1 = PanResponder.create({
            /***************** 要求成为响应者 *****************/
            // 单机手势是否可以成为响应者
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // 移动手势是否可以成为响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // 拦截子组件的单击手势传递,是否拦截
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            // 拦截子组件的移动手势传递,是否拦截
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            /***************** 响应者事件回调处理 *****************/
            // 单击手势监听回调
            onPanResponderGrant: (e, gestureState) => {
                this.onMoving(e)
            },

            // 手势释放, 响应者释放回调
            onPanResponderRelease: (e) => {
                this.onMoveEnd()
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
            },
            // 手势申请失败,未成为响应者的回调
            onResponderReject: (e) => {
                // 申请失败,其他组件未释放响应者
                console.log('onResponderReject==>' + '响应者申请失败')
            },

            // 当前手势被强制取消的回调
            onPanResponderTerminate: (e) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
        this.panResponder2 = PanResponder.create({
            /***************** 要求成为响应者 *****************/
            // 单机手势是否可以成为响应者
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            // 移动手势是否可以成为响应者
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // 拦截子组件的单击手势传递,是否拦截
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            // 拦截子组件的移动手势传递,是否拦截
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            /***************** 响应者事件回调处理 *****************/
            // 移动手势监听回调
            onPanResponderMove: (e, gestureState) => {
                this.onMoveStart(e, gestureState);
            },
            // 手势动作结束回调
            onPanResponderEnd: (evt, gestureState) => {
                this.onMoveEnd(evt)
            },
            // 手势申请失败,未成为响应者的回调
            onResponderReject: (e) => {
                // 申请失败,其他组件未释放响应者
                console.log('onResponderReject==>' + '响应者申请失败')
            },

            // 当前手势被强制取消的回调
            onPanResponderTerminate: (e) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        })
    }
    shouldComponentUpdate(prevProps, nextState) {
        // 当父组件传入新的图片后，开始渲染
        console.warn(prevProps.imageUrl, this.props.imageUrl, prevProps.imageUrl !== this.props.imageUrl)
        if (prevProps.imageUrl !== this.props.imageUrl) {
            this.renderImage()
            return true;
        }
        return false;
    }

    UNSAFE_componentWillReceiveProps(prevProps, nextState) {
        console.warn("componentDidUpdate1111---组件更新完毕");
    }


    renderImage = () => {
        // 初始化状态
        this.setState({ status: STATUS_LOADING })

        // 创建一个图片对象，主要用于canvas.context.drawImage()
        const objImage = new CanvasImage(this.refs.fragmentCanvas);

        objImage.addEventListener("load", () => {
            const { imageWidth, imageHeight, fragmentSize } = this.props

            // 先获取两个ctx
            const ctxShadow = this.refs.shadowCanvas.getContext("2d")
            const ctxFragment = this.refs.fragmentCanvas.getContext("2d")

            // 让两个ctx拥有同样的裁剪路径(可滑动小块的轮廓)
            const styleIndex = Math.floor(Math.random() * 16)
            createClipPath(ctxShadow, fragmentSize, styleIndex)
            createClipPath(ctxFragment, fragmentSize, styleIndex)

            // 随机生成裁剪图片的开始坐标
            const clipX = Math.floor(fragmentSize + (imageWidth - 2 * fragmentSize) * Math.random())
            const clipY = Math.floor((imageHeight - fragmentSize) * Math.random())

            // 让小块绘制出被裁剪的部分
            ctxFragment.drawImage(objImage, clipX, clipY, fragmentSize, fragmentSize, 0, 0, fragmentSize, fragmentSize)

            // 让阴影canvas带上阴影效果
            ctxShadow.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctxShadow.fill()

            // 恢复画布状态
            ctxShadow.restore()
            ctxFragment.restore()

            // 设置裁剪小块的位置
            this.setState({ offsetX: clipX, offsetY: clipY })

            // 修改状态
            this.setState({ status: STATUS_READY })
        })

        objImage.src = this.props.imageUrl
    }

    onMoveStart = e => {
        if (this.state.status !== STATUS_READY) {
            return
        }

        // 记录滑动开始时的绝对坐标x
        this.setState({ isMovable: true, startX: e.clientX })
    }

    onMoving = e => {
        if (this.state.status !== STATUS_READY || !this.state.isMovable) {
            return
        }
        const distance = e.clientX - this.state.startX
        let currX = this.state.oldX + distance

        const minX = 0
        const maxX = this.props.imageWidth - this.props.fragmentSize
        currX = currX < minX ? 0 : currX > maxX ? maxX : currX

        this.setState({ currX })
    }

    onMoveEnd = () => {
        if (this.state.status !== STATUS_READY || !this.state.isMovable) {
            return
        }
        // 将旧的固定坐标x更新
        this.setState(pre => ({ isMovable: false, oldX: pre.currX }))

        const isMatch = Math.abs(this.state.currX - this.state.offsetX) < 5
        if (isMatch) {
            this.setState(pre => ({ status: STATUS_MATCH, currX: pre.offsetX }), this.onShowTips)
            this.props.onMatch()
        } else {
            this.setState({ status: STATUS_ERROR }, () => {
                this.onReset()
                this.onShowTips()
            })
            this.props.onError()
        }
    }

    onReset = () => {
        const timer = setTimeout(() => {
            this.setState({ oldX: 0, currX: 0, status: STATUS_READY })
            clearTimeout(timer)
        }, 1000)
    }

    onReload = () => {
        console.warn(1, this.state.status)
        if (this.state.status !== STATUS_READY && this.state.status !== STATUS_MATCH) {
            return
        }
        const ctxShadow = this.refs.shadowCanvas.getContext("2d")
        const ctxFragment = this.refs.fragmentCanvas.getContext("2d")

        // 清空画布
        ctxShadow.clearRect(0, 0, this.props.fragmentSize, this.props.fragmentSize)
        ctxFragment.clearRect(0, 0, this.props.fragmentSize, this.props.fragmentSize)

        this.setState(
            {
                isMovable: false,
                offsetX: 0, //图片截取的x
                offsetY: 0, //图片截取的y
                startX: 0, // 开始滑动的 x
                oldX: 0,
                currX: 0, // 滑块当前 x,
                status: STATUS_LOADING
            },
            this.props.onReload
        )
    }

    onShowTips = () => {
        if (this.state.showTips) {
            return
        }

        const tipsIndex = this.state.status === STATUS_MATCH ? 0 : 1
        this.setState({ showTips: true, tipsIndex })
        const timer = setTimeout(() => {
            this.setState({ showTips: false })
            clearTimeout(timer)
        }, 2000)
    }

    render() {
        const { imageUrl, imageWidth, imageHeight, fragmentSize } = this.props
        const { offsetX, offsetY, currX, showTips, tipsIndex } = this.state
        const tips = arrTips[tipsIndex]
        return (
            <View style={{ width: imageWidth, padding: 10 }}>
                <ImageBackground source={{ uri: imageUrl }} style={{ height: imageHeight }}>
                    <Canvas
                        ref="shadowCanvas"
                        width={fragmentSize}
                        height={fragmentSize}
                        style={{ left: offsetX, top: offsetY, position: 'absolute', top: 0, left: 0, }}
                    />
                    <Canvas
                        ref="fragmentCanvas"
                        width={fragmentSize}
                        height={fragmentSize}
                        style={{ left: offsetX, top: offsetY, position: 'absolute', top: 0, left: 0, }}
                    />
                    <View style={showTips ? styles.tipsContainerActive : styles.tipContainer}>
                        <Image source={tips.ico} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ color: '#666666' }}>{tips.text}</Text>
                    </View>
                </ImageBackground>
                <View style={{ marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={this.onReload}>
                        <Image source={icoReload} style={{ width: 20, height: 20, marginRight: 10 }} />
                        <Text style={{ color: '#666666', fontSize: 14 }}>刷新验证</Text>
                    </TouchableOpacity>
                </View>
                <View {...this.panResponder1.panHandlers} style={{ marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 14, padding: 10, textAlign: 'center', color: '#999', backgroundColor: '#ddd' }}>按住滑块，拖动完成拼图</Text>
                    <View {...this.panResponder2.panHandlers} style={{ left: currX, position: 'absolute', top: 50, left: 0, width: 50, height: 50, borderRadius: 25 }} >
                        <Image source={icoSlider} style={{ width: 20, height: 20, marginRight: 10 }} />
                    </View>
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    tipsContainerActive: {
        position: 'absolute',
        top: 50,
        left: 50,
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        opacity: 0,
    },
    tipContainer: {
        opacity: 1,
    }
}
);
