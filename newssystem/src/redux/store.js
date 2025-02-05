import { combineReducers} from 'redux'
import { legacy_createStore as createStore} from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = { /* 配置 */
    key: 'Vicky',
    storage,
    blacklist: ['LoadingReducer'] // 黑名单 里面的state will not be persisted
  }
  
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer) /* 参数是配置和reducer 
存到本地  普通reducer变成persist的*/

const store = createStore(persistedReducer); /* 单一对象 store  把不同的reducer合并 */
const persistor = persistStore(store) /*  */

export  {
    store,
    persistor
}
/* export default 语法用于导出一个默认对象。只能有一个。 普通export可以有多个 */

/* 
store.dispatch()
sotre.subscribe()
*/


/* 接受props.changeCollapsed()的返回值，然后在交给reducers处理（遍历找到对应的reducer）  */

/* 这里是redux结构的起始 */

/* 在github中找redux persist改成永久状态管理 */