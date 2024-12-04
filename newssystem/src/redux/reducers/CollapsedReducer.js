export const CollapsedReducer = (prevState = {
    isCollapsed: false /* reducer管理初始状态 */
}, action) => {  
    console.log("action是什么", action)
    let { type } = action
    switch(type){
        case"changeCollapsed":
        /* 匹配type 为changeCollapsed情况的处理 */
            /* 先对老状态复制，再改新的状态 */
            let newState = {...prevState} /* 复制老状态 扩展运算符，将prevState的所有属性展开并且拷贝到newState, 浅拷贝，保持不可变性 */
            newState.isCollapsed = !newState.isCollapsed /* 改新状态 */
            return newState /* 返回新状态 */
        default:
            return prevState /* 处理不了的时候的情况 */

    }

    
}

/* Redux payload逻辑： 
1. Topheader侧边栏按钮点击完
2. action 传到store
3. store中有很多reducer, 匹配相应reducer
4. 在reducer中解构type做case分支，确定是这个，然后深复制取反，然后返回newstate
5. 返回之后connect感应到状态改变，有订阅mapDispatchToProps把变化传给孩子，孩子组件收到折叠(mapStateToProps)，从而状态改变，达到想要的效果 */


