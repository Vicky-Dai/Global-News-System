import React, { useEffect } from 'react'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'

import { Layout } from 'antd'
import './NewsSandBox.css'
import NewsRouter from '../../components/sandbox/NewsRouter'

import NProgress from 'nprogress'
import'nprogress/nprogress.css'
const { Content } = Layout;


export default function NewsSandBox(){
    NProgress.start()
    console.log("nprogress运行了")
    useEffect(() => {
      NProgress.done()
      console.log("nprogress done了1111")  /* ？？？？为什么没有在渲染结束触发done呢  目前发现的问题是，路由重定向之后，只会渲染和重新执行定向的组件，比如home，但是这里的代码似乎是不会在执行的，我的两个log在切换页面的时候都没有打印*/
    }) /* 这个是每次修改路由的时候，触发了外层路由，重新render NewsSandBox，就触发一次这个进度条 */
    
    return (
        <Layout> {/* antd组件 本身控制页面的格式 */}
                
            <SideMenu></SideMenu>
            <Layout>
                <TopHeader></TopHeader>
                
                <Content
                    style={{                  
                        margin: '24px 16px',
                        padding: '24px',
                        minHeight: '280px',
                        backgroundColor: 'white'                      
                    }}
                    >
                    
            
                    {/* 路由的作用是通过路径改变而重新加载新的组件 这里不同组件在不同路径（自己定义路径 在浏览器就能在这个路径找到  注意在后续链接跳转的时候 路径要保持一致） 继续写路由   
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/noPermission" element={<NoPermission />} />
                        <Route path="/right-manage/right/list" element={<RightList />} />
                        <Route path="/right-manage/role/list" element={<RoleList />} />
                        <Route path="/user-manage/list" element={<UserList />} /> 
                    </Routes> */}
                    <NewsRouter></NewsRouter>
                </Content>  
            </Layout>
        </Layout>
        )
        
}

/* React渲染机制会把父组件和子组件一起渲染出来 */

/* 路由要动态创建，根据权限、本地映射表、登录账号的表三个已匹配才能展示出来 */

/* m每次content发生变化，都会引发外层路由IndexRouter重新走一遍 */

/* 在React中，父组件的重新渲染会导致其子组件的重新渲染。子组件会在以下情况下重新渲染：其props或state发生变化，或者其父组件重新渲染。这种关系影响了组件的生命周期和性能，因此需要谨慎管理状态和props的变化，以避免不必要的重新渲染。 */
