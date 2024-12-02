import React from 'react'
import { Layout, theme, Dropdown, Avatar} from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
  } from '@ant-design/icons';
import{ useNavigate, useLocation, useParams} from 'react-router-dom' 
import {connect} from 'react-redux'
// import { withRouter } from 'react-router-dom'
// import { useNavigate, useLocation,  } from 'react-router-dom';
  
const { Header } = Layout;

function withRouter(Component) {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    return <Component {...props} navigate={navigate} location={location} params={params} />;
  };
}


function TopHeader(props){ /* 通过props获取父组件传递过来的数据 */

    // console.log("props a1", props)
    /* Redux统一管理状态，自己的本地变量状态就不需要管理了 */
    // const [collapsed, setCollapsed] = useState(false) /* Hooks一种特殊函数 用于改变状态 const [collapsed, setCollapsed] = useState(false); 分别是变量 函数 Hook函数设置初始值  前面的函数作用是由hook决定的，这意味着前面的变量和函数可以自己定义名称 只要和后面一致就可以*/
    const changeCollapsed = ()=> { 
        // setCollapsed(!collapsed) /* 一发生变化就取反 */
        // 改变state（redux全局变量state）的isCollapsed
        // dispatchEvent()
        // console.log("props a2", props)
        props.changeCollapsed() /* 通过props 让父组件帮忙dispatch,根据下面定义有返回值，返回到store中 */
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
            props.isCollapsed?<MenuUnfoldOutlined onClick={changeCollapsed}/>:<MenuFoldOutlined onClick={changeCollapsed}/>
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
connect是一个高阶组件
connect(
//mapStateToProps: 读操作，从state中读取数据并映射到组件的props中
//mapDispatchToProps 把dispatch方法映射成一个props，通过属性把它分发出去
)(被包装的组件)
*/
const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => { /* 从state中解构出来CollapsedReducer大对象，然后继续结构isCollapsed属性   接收到的 state 参数是 Redux store 中的整个状态树*/
  // console.log("state是什么", state)
  // console.log("isCollapsed",state.CollapsedReducer.isCollapsed)
  return {
    // a: 1   /* 会往Topheader里面扔一个a */
    isCollapsed
  }
  
}

const mapDispatchToProps = { /* 把dispatch映射成props 从而修改state，现在用redux统一管理，不可以自己在本地变量修改了  要让父组件取快递，在这里就是要告诉父组件我指定一个action */
  changeCollapsed(){
    return{
      type: "changeCollapsed" /* 把action发出去 */ /* 以后action会很多，reducers也是 所以怎么搭配必须靠type */
    };
  }//action
}
/* *
1. 在 Redux 中，changeCollapsed 方法是通过 mapDispatchToProps 映射到组件的 props 中的。虽然这个方法是在当前组件中定义的，但它实际上是通过 Redux 的 dispatch 方法来触发一个 action，从而修改全局的 Redux 状态。
2. changeCollapsed 方法：
在组件中，通过 props 调用 changeCollapsed 方法，实际上是触发了一个 Redux action，从而修改全局的 Redux 状态。
3. dispatch 方法用于发送 action 到 Redux store，从而触发状态的更新。通过 mapDispatchToProps 函数，你可以将 dispatch 方法映射到组件的 props 中。
*/


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))
/* 当你使用 connect 时，它会订阅 Redux store。当 store 中的状态发生变化时，React-Redux 会自动调用 mapStateToProps 函数，将最新的状态树传入作为参数。 */

/**
 * 这里的用法是JS函数链式调用和高阶函数组合使用，因此有两个小括号并列
 * 1. 第一个小括号调用connect函数，connect 是 Redux 提供的一个高阶函数（函数返回另一个函数）。
 * 调用 connect(mapStateToProps) 会返回一个新的函数（HOC，高阶组件），我们可以暂时叫它 connectedHOC，它是一个高阶组件，用于接受组件作为参数，返回一个新的增强版组件。
 * 2. 第二个小括号，connect(mapStateToProps) 返回的高阶组件被直接调用，并传入了 withRouter(TopHeader) 作为参数，把 withRouter(TopHeader) 传递给 connect 返回的高阶组件进行增强。
 * 最终，返回一个结合了 Redux 和路由功能的最终增强组件。
 * 
 * 
 * mapStateToProps 是 connect 函数的一个参数，它的作用是将 Redux store 中的 state 映射到 React 组件的 props 中。它的作用是将 Redux 中的状态（state）注入到组件的 props 中，使得组件能够访问到 Redux store 中的数据。
*/  

/* *
Redux 流程中的主要步骤
Redux 通常遵循以下流程：

React Components: 用户与界面交互，触发 UI 更新。
Action Creators: React 组件调用 action creators，创建 "action" 对象。
Dispatch Action: 通过 Redux dispatch 方法，action 会被发送到 Redux 的 reducer。
Reducers: 根据接收到的 action 更新 Redux 的 state。
React Components: Redux 的 state 变化会导致组件重新渲染。 */


/* 
Redux设置步骤：
1. store创建
2. reducer创建
3. connect连接, 把状态（store）和dispatch映射到props( mapStateToProps 映射 mapDispatchToProps 映射)
4. dispatch action 通过props调用 传递到reducer (action是一个对象，有type属性 这里就和下面payload连接起来了) 


Redux payload:  期望是点击按钮，按钮转换方向
1. UI被点击，onClick监听触发changeCollapsed，用了redux之后不是自己管理自己的状态变化了，而是交给父组件props统一管理
2. props.changeCollapsed() 通过父组件帮忙dispatch到store中  这个 dispatch 方法实际上是 Redux 提供的，它会负责将 action 分发到 store，并触发 reducer。
3. reducer 的返回值会自动成为 Redux store 的新的状态 state （redux核心机制之一）
4. connect 会自动监听 Redux store 的变化：当你使用 connect 将组件与 Redux 绑定时，connect 会订阅 Redux store 的变化，如果有变化，就触发组件重新渲染 （Redux store 的状态是全局的，不属于任何单独的组件。）
*/

/* 如何理解store全局变量？怎么来的，又有什么作用
1. 点击按钮后，props.increment() 被调用。
2. mapDispatchToProps 中的函数触发 dispatch，将 INCREMENT action 派发到 Redux store。
3. Redux 的 reducer 处理这个 action，更新 store 中的状态。
4. Redux store 通知所有订阅者，重新调用 mapStateToProps。
5. mapStateToProps 的返回值变化，React-Redux 更新组件的 props，触发重新渲染。
*/