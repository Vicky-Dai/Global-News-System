/* 新闻系统登录之后的路由，动态展示 , 这个组件其实就是登陆之后页面除了side和top之外中间的部分*/
import React, { useEffect, useState } from 'react'
import {Routes,Route,Navigate} from 'react-router-dom'
import Home from '../../views/sandbox/home/Home' /* src/views/sandbox/home */
import UserList from '../../views/sandbox/user-manage/UserList'  /* 这个路径简写要点 1·从当前文件出发 newsrouter，走到和目标路径共同的父级 2.当前文件的文件夹不算一级 ../是当前文件夹的上一级（比如当前文件夹所在的sandbox，../是components,再../是src),然后到了父级，再向下找目标文件*/
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import NoPermission from '../../views/sandbox/noPermission/NoPermission'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import axios from 'axios'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'

const LocalRouterMap = {
    "/home":<Home/>,
    "/right-manage/right/list": <RightList/>,
    "/right-manage/role/list": <RoleList/>,
    "/user-manage/list": <UserList/>,
    "/news-manage/add": <NewsAdd/>,
    "/news-manage/draft": <NewsDraft/>,
    "/news-manage/category": <NewsCategory/>,
    "/audit-manage/audit": <Audit/>,
    "/audit-manage/list": <AuditList/>,
    "/publish-manage/unpublished": <Unpublished/>,
    "/publish-manage/published": <Published/>,
    "/publish-manage/sunset": <Sunset/>,
    "/news-manage/preview/:id": <NewsPreview/>, 
    "/news-manage/update/:id": <NewsUpdate/>,

}
/* 创建一个本地对象，后端给返回/home，前端就知道要加载Home */

export default function NewsRouter() {
    
    const [backRouteList, setbackRouteList] = useState([])
    useEffect(() => {
        Promise.all([ /* Promise.all保证两个axios AJAX请求都完成之后再继续 */
            axios.get("http://localhost:5000/rights"),
            axios.get("http://localhost:5000/children")
        ]).then(res=>{
            // console.log(res)
            setbackRouteList([...res[0].data,...res[1].data]) /* res[0]就是promise对象，和之前用的没有区别，只是这里有两个对象，data才是真正的数据数组*/
            // console.log([...res[0].data,...res[1].data])
        })
    },[]) /* 不加依赖项数组: useEffect 会在每次组件更新时执行，可能会导致无限循环，特别是在你设置状态的情况下。 */
    
    const{role:{rights}} = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson||item.routepermisson) /* 检查权限列表里的删除和编辑开关（pagepermission） */
    } /* 这样即使是我直接在导航栏里面用URL进去，如果没有权限也进不去，因为这个route根本不会创建（下方），也就不会显示 */

    const checkUserPermission = (item) => {  /* 检查当前用户是否有这个权限 */
        return rights.includes(item.key)
    }

  
    return (
    <div>
        {/*路由的作用是通过路径改变而重新加载新的组件 这里不同组件在不同路径（自己定义路径 在浏览器就能在这个路径找到  注意在后续链接跳转的时候 路径要保持一致） 继续写路由  */}  
        <Routes>
            {
                backRouteList.map(item=>
                    // <Route path={item.key} key={item.key}
                    // element={LocalRouterMap[item.key]} ></Route>
                    {
                        if(checkRoute(item) && checkUserPermission(item)){ /* 第一个函数判断当前权限列表管理是否打开 第二个函数是当前用户是否有这个权限 */
                            // console.log("checkRoute item", item)
                            return (<Route path={item.key} key={item.key}
                                element={LocalRouterMap[item.key]} ></Route>)

                        }
                        return null  /* 原先是这样，没有key 所以报错(<Route path="/noPermission" element={<NoPermission />} />) */
                    } /* [NoPermission] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment> */
                )
            } {/* 路由是模糊匹配的， */}
            <Route path="/" element={<Navigate to="/home" />} />
            {  
            backRouteList.length>0 &&<Route path="*" element={<NoPermission />} />
            }
            
            {/* <Route path="/home" element={<Home />} />
            <Route path="/right-manage/right/list" element={<RightList />} />
            <Route path="/right-manage/role/list" element={<RoleList />} />
            <Route path="/user-manage/list" element={<UserList />} />  */}
        </Routes>
    </div>
  )
}


/* 动态创建，这样根据不同的用户只显示有权限的 */

/* 影响一个用户的路由权限的有：1.该用户的角色对应的权限 2. 权限管理（这个只有超级管理员可以控制）里面的角色列表（通过角色控制权限） 3.权限管理里面的权限列表（直接对权限控制，且有permission开关（01）和直接删除两种
3对应的是checkRoute方法
*/


/* 我不明白为什么通过角色修改，想看到界面上权限变化必须重新登陆，而前面的直接修改权限，就可以点击刷新就能看到变化?? 
让switchMethod能够点击刷新就看见，handleOk必须重新登陆才能看到变化的根本区别在哪里
来自chatgpt：switchMethod 和 handleOk 的区别：
switchMethod - 即时更新本地状态，UI 立即响应：

switchMethod 在更新权限时，会立即通过 setdataSource([...dataSource]) 更新前端的状态。这是 局部更新，而且前端状态的更新会立刻反映到 UI 上。
由于前端权限数据（如 dataSource）是直接在本地修改的，因此用户点击后，UI 会立即显示变化，无需等待后端响应，前端数据和 UI 是同步的。
即使后端的数据没有及时更新，UI 已经反映了用户的操作，用户可以马上看到变化，直到网络请求成功后后端数据被同步。
handleOk - 角色权限修改可能需要重新加载或者重新登录：

handleOk 中，你修改的是角色的权限数据（rights），这些权限数据的变更可能是全局性的（即涉及到角色的权限），而不仅仅是局部权限项。
更新 dataSource 后，虽然也会触发前端状态更新并立即渲染 UI，但角色权限的更改通常需要 后端同步。修改角色权限后，可能需要重新加载当前用户的权限数据，才能保证前端显示的是最新的权限数据。
权限数据来源：如果你在登录时从后端拉取了权限数据（比如角色的所有权限），那么角色权限的修改可能不会立即反映到当前的会话中，除非用户重新登录或刷新页面以重新获取更新后的权限数据。 */

/* JSX 中的大括号 {} 允许你嵌入 JavaScript 表达式，这些表达式会被求值并插入渲染的结果。这些表达式可以是：

变量
函数调用
数学计算
三元运算符
&& 逻辑与运算符等 

JSX 本质上是 JavaScript 的语法糖，用于描述 UI 结构。在 JSX 中，必须返回一个表达式（JavaScript 表达式），而 if 语句本身是控制结构，不能作为一个表达式直接返回。如果你希望在 JSX 中进行条件渲染，必须使用 JavaScript 表达式（如三元运算符或逻辑与运算符）来替代 if。
component文件中return 语句中的部分就是 JSX 语法，用于描述 React 组件的 UI 结构。除了 return 之外，React 组件中的其他部分通常使用的是 JavaScript 语法。React 组件本质上是一个 JavaScript 函数，它结合了 JSX 和 JavaScript 逻辑。*/

/* 在你的代码中，backRouteList.map 的逻辑只会在 NewsRouter 组件重新渲染时执行。路由切换时，React Router 会根据当前路径匹配相应的 Route 组件，并渲染对应的组件，而不会重新执行 backRouteList.map 的逻辑，除非 NewsRouter 组件本身重新渲染。
当用户点击不同的路由链接时，React Router 会根据当前路径匹配相应的 Route 组件，并渲染对应的组件。这个过程是由 React Router 内部机制处理的，而不是重新执行 backRouteList.map 的逻辑。 */