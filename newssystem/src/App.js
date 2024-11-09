import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './views/login/Login'
import NewsSandBox from './views/sandbox/NewsSandBox'
import Home from './views/sandbox/home/Home'

function App() {
  
  return (
    
      <Routes>  {/* 名为元素匹配机制 新版路由必须要用Routes包裹，他会遍历所有Route并且按照精确匹配路径。精确匹配：相对于模糊匹配，必须字字对应，而不是模糊，比如/about 和/about/team会被匹配到渲染同一个页面也就是/about对应的 */}
        <Route path = "/login" element = {<Login />}/> {/* path即URL的path部分 element是Route组件的一个属性，定义了当URL路径匹配时要渲染的组件  */} 
        <Route path = "/*" element = {localStorage.getItem('token') ? <NewsSandBox /> : <Navigate to="/login" /> /* React的两种组件语法：<new></new>标准组件标签，复合标准JSX写法 */ } >
        </Route> {/*上面token哪里 看看这个localStorage里面 token key有没有对应的值  */} 
      </Routes>
    
  )
  
}

export default App