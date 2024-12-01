import { combineReducers} from 'redux'
import { legacy_createStore as createStore} from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer';


const reducer = combineReducers({
    CollapsedReducer
})

const store = createStore(reducer); /* 单一对象 store  把不同的reducer合并 */

export default store


/* 
store.dispatch()
sotre.subscribe()
*/

/* 接受props.changeCollapsed()的返回值，然后在交给reducers处理（遍历找到对应的reducer）  */