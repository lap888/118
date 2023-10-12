/*
 * @Author: top.brids 
 * @Date: 2019-11-30 20:29:04 
 * @Last Modified by: top.brids
 * @Last Modified time: 2020-05-22 17:30:45
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { createBlacklistFilter, createFilter } from 'redux-persist-transform-filter';
//add your reducer
import UserReducer from './UserReducer';
import TaskReducer from './TaskReducer';
import DividendReducer from './DividendReducer';
import RuleReducer from './RuleReducer';
import NoticeReducer from './NoticeReducer';
import RouterReducer from './RouterReducer';
import YoBangReducer from './YoBangReducer';
//add enhancers
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//set middler eg:logger...
const enhancer = composeEnhancers(
    applyMiddleware(
        // createLogger()
    )
)
export default function CreateStore() {
    //combine reducer
    const RootReducer = combineReducers({
        user: UserReducer,
        task: TaskReducer,
        dividend: DividendReducer,
        rule: RuleReducer,
        notice: NoticeReducer,
        router: RouterReducer,
        yoBang: YoBangReducer
    });
    const persistConfig = {
        key: 'root',
        storage: AsyncStorage,
        stateReconciler: autoMergeLevel2,
        debug: false
    };
    const presistRootReducer = persistReducer(persistConfig, RootReducer);
    const store = createStore(presistRootReducer, enhancer);
    const persistor = persistStore(store);
    return { store, persistor };
}
