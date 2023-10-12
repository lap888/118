import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import EmptyComponent from './EmptyComponent';
import ShowMore from './ShowMore';
import GameListItem from './GameListItem';
export default class GameList extends Component {
    static propTypes = {
        data: PropTypes.array,
        firstLoading: PropTypes.bool,
        loadingMore: PropTypes.bool,
        currentPage: PropTypes.number,
        totalPage: PropTypes.number,
        ListHeaderComponent: PropTypes.element,
        fetchList: PropTypes.func
    }

    static defaultProps = {
        data: [],
        firstLoading: true,
        loadingMore: false,
        currentPage: 1,
        totalPage: 1,
        ListHeaderComponent: <View />
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    /**
     * 分页触底操作
     */
    onEndReached() {
        if (this.props.currentPage >= this.props.totalPage) return;
        this.props.fetchList(this.props.currentPage + 1);
    }
    render() {
        let { data, firstLoading, loadingMore, ListHeaderComponent } = this.props;
        return (
            <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={data}
                renderItem={({ item, index }) => <GameListItem index={index} item={item} />}
                ListEmptyComponent={() => <EmptyComponent isLoading={firstLoading} />}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={() => <ShowMore visible={loadingMore} />}
                onEndReached={() => this.onEndReached()}
                onEndReachedThreshold={0.5}
                keyExtractor={(item, index) => item['id'].toString()}
            />
        );
    }
}
