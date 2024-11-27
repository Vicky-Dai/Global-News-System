import {createStore, combineReducers} from 'redux'
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