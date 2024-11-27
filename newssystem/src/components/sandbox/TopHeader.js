import React, {useState} from 'react'
import { Layout, theme, Dropdown, Avatar} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
  } from '@ant-design/icons';
import{ useNavigate, useLocation } from 'react-router-dom' 
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
  
const { Header } = Layout;



function TopHeader(){

    console.log(props)
    const [collapsed, setCollapsed] = useState(false) /* Hooks一种特殊函数 用于改变状态 const [collapsed, setCollapsed] = useState(false); 分别是变量 函数 Hook函数设置初始值  前面的函数作用是由hook决定的，这意味着前面的变量和函数可以自己定义名称 只要和后面一致就可以*/
    const changeCollapsed = ()=> { 
        setCollapsed(!collapsed) /* 一发生变化就取反 */
    }

    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate() /* 引入useNavigate 这个hook 方便跳转 */

    const {role:{roleName}, username} = JSON.parse(localStorage.getItem("token")) /* 之前是一个字符串 JSON.parse解析成对象 */ /* const 用大括号解构对象，取出需要的部分 */
    const items = [
      {
        key: '1',
        label: (
          <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            {roleName}
          </a>
        ),
      },
      {
        key: '4',
        danger: true,
        label: '退出登录',
        onClick: ()=>{
          localStorage.removeItem("token")
          navigate("/login")
        }
      },
    ];
    
    return(
        <Header className="site-layout-background" style={{padding: '0 16px',
          background: colorBgContainer,
        }}>
          {
            collapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>
          }

          <div style={{float:"right"}}>
            <span>欢迎<span style={{color:"#1677FF"}}>{username}</span>回来</span> {/*设置欢迎语言 div单独占一行 所以要在上面style内联右侧浮动 */}
            <Dropdown menu={{ items }}>
              {/* <span>hover me</span> */}
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
    )
}
/* 
connect(
//mapStateToProps: 读操作，从state中读取数据并映射到组件的props中
//mapDispatchToProps 把dispatch方法映射成一个props，通过属性把它分发出去
)(被包装的组件)
*/
const mapStateToProps = (state) => {
  return {
    a: 1   /* 会往Topheader里面扔一个a */
  }
}

export default connect(mapStateToProps)(withRouter(TopHeader))