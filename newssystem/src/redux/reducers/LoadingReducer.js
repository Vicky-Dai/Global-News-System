export const LoadingReducer = (prevState = {
    isLoading: true /* reducer管理初始状态 */
}, action) => { 
    console.log("action是什么", action)
    let { type, payload } = action
    switch(type){
        case"changeLoading":
        /* 匹配type 为changeCollapsed情况的处理 */
            /* 先对老状态复制，再改新的状态 */
            let newState = {...prevState} /* 复制老状态 扩展运算符，将prevState的所有属性展开并且拷贝到newState, 浅拷贝，保持不可变性 */
            newState.isLoading = payload /* 改新状态 */
            return newState /* 返回新状态 */
        default:
            return prevState /* 处理不了的时候的情况 */

    }

    
}


