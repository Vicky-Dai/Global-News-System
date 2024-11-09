import React from 'react'
import {Route, Routes, HashRouter, Navigate, BrowserRouter} from 'react-router-dom'
import Login from '../views/login/Login'
import NewsSandBox from '../views/sandbox/NewsSandBox'
import Home from '../views/sandbox/home/Home'
import UserList from '../views/sandbox/user-manage/UserList'
import RoleList from '../views/sandbox/right-manage/RoleList'
import RightList from '../views/sandbox/right-manage/RightList'
import NoPermission from '../views/sandbox/noPermission/NoPermission'


function IndexRouter(){
    return (
        <BrowserRouter>{/* 一种路由器类型，使用URLhash的部分即#后面的内容来管理和解析 */}
            <Routes>  {/* 名为元素匹配机制 新版路由必须要用Routes包裹，他会遍历所有Route并且按照精确匹配路径。精确匹配：相对于模糊匹配，必须字字对应，而不是模糊，比如/about 和/about/team会被匹配到渲染同一个页面也就是/about对应的 */}
                <Route path = "/login" element = {<Login />}/> {/* path即URL的path部分 element是Route组件的一个属性，定义了当URL路径匹配时要渲染的组件  Route组件包裹的组件可以直接访问Route组件的props，但是下面的子组件就不行，所以要用到高阶组件 */} 
                <Route path = "/" element = {<NewsSandBox /> /*localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to="/login" /> /* React的两种组件语法：<new></new>标准组件标签，复合标准JSX写法 */ } >
                    <Route path="home" element={<Home/>} />
                </Route>
            </Routes>
        </BrowserRouter>

    )

}

export default IndexRouter
//views路由组件 底下分别两个login 和sandbox分别存放各自js和css
//components 子组件 共享组件
//router路由结构 