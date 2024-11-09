import React, {useEffect, useState} from 'react'
import { Layout, Menu, } from 'antd'; 
import{ useNavigate, useLocation } from 'react-router-dom' /* 引入useNavigate 这个hook 方便跳转 确保你的组件能够访问到 props.history */
import {
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons'
import './index.css'  
import axios from 'axios'



const { Sider } = Layout; /* 解构sider */  /* const不能提升 所以一定写在前面 */
/* 模拟未来动态数组结构 */
const { SubMenu} = Menu/* 从引入的组件中解构出SubMenu */

/* 初始test的模拟数组结构 看React组件是如何渲染的 调整好逻辑之后 --加入test.json检测逻辑是否完整 --最终再用正式假数据db.json 较为复杂*/
// const menuList =[
//   {
//   key:"/home", /* 路径 方便好找 且唯一*/
//   title:"首页",
//   icon:<UserOutlined />
// /* 如果判断没有children属性 根据其他三个属性渲染出Menu.Item*/
//   },
//   {
//     key:"/user-manage", /* 路径 方便好找 且唯一*/
//     title:"用户管理",
//     icon:<UserOutlined />,
//     type: 'group',
//     children:[ /* 有就渲染成SubMenu */
//       {key:"/user-manage/list", /* 路径 方便好找 且唯一*/
//         title:"用户列表",
//         icon:<UserOutlined />},
//     ]
//   },
//   {
//     key:"/right-manage", /* 路径 方便好找 且唯一*/
//     title:"权限管理",
//     icon:<UserOutlined />,
//     children:[
//       {key:"/right-manage/right/list", /* 路径 方便好找 且唯一*/
//         title:"角色列表",
//         icon:<UserOutlined />},
//       {key:"/right-manage/role/list", /* 路径 方便好找 且唯一*/
//         title:"权限列表",
//         icon:<UserOutlined />},
//     ]
//   }
// ]/*  */
const iconList ={ /* 创建一个本地的iconlist 对象解构  保证后端路径和前端匹配 根据路径来取*/
  "/home": <UserOutlined />,
  "/user-manage/list": <UploadOutlined />,
  "/right-manage/role/list": <UploadOutlined />

}

/* 将代码放在组件外部会使其只在模块加载时执行一次，而不管组件内部的状态如何更新或组件如何重新渲染，外部代码都不会再次执行。 */



export default function SideMenu(props){ /* Menu是SideMenu的子组件，可以直接用menu的props，sidemenu也可以被导入别的父组件进行使用 */
  // console.log("第一次挂载之后的token值",localStorage.getItem("token"))

  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))  

  const [menu, setMenu] = useState([])
  
  const checkPermission = (item) => {
    return item.pagepermisson === 1 && rights.includes(item.key)
  
  }

  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{/* 9.24ebbin复习了.then promise  */
      console.log(res.data)
      setMenu(res.data)
      // console.log("setMenu执行了")
    })
  },[]) /* 空依赖表明只在初次渲染之后触发该useEffect，因此如果登录期间对于权限有改动，只有下次登录的时候才能看到 */

  useEffect(() => {
    console.log("Menu updated:", menu); // 每次 menu 更新时
  }, [menu]);
  
  const navigate = useNavigate() /* 引入useNavigate 这个hook 方便跳转 */
  
  
  /* pagepermission是一个用来标识某个页面数据显示与否的字段，1就是显示，没有就是不显示。由于这里我们想把它做成页面里面的功能，所以在侧边栏可以把它去掉 */
  
  const renderMenu = (menuList) =>{ /* renderMenu 函数的作用是生成菜单项的结构 这个函数负责输出一个数组，在最终渲染的时候会被嵌入到Menu组件中 这个数组中的元素是 React 组件，可以直接渲染在 JSX 中。*/  /* 在你的 renderMenu 函数中，你的主要任务是根据传入的菜单数据（如 menuList）生成相应的菜单项（Menu.Item 和 SubMenu）。这个函数负责遍历菜单数据并输出正确的组件结构。 当你将生成的组件插入到 Menu 中时，Ant Design 负责将这些组件渲染到 DOM 中。*/
    return menuList.map(item=>{ /* 箭头函数作为回调函数 外层函数map遍历数组每一个对象 */
      if(item.children?.length>0 && checkPermission(item) ){ /* 奇妙小用法item.children? 这?代表如果前面的为假就不会执行后面的 */ /* 这里children要做判断的原因是首页那一栏没有children不需要做折叠效果，但是递归会导致对空children访问.length会报错，所以要加一个?来进行判断 */
        // console.log("第一次挂载的时候获取了token的rights", rights)
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)} {/* 终止条件在没有children 走下面 */}  {/* 这些 JSX 元素会作为 SubMenu 的 children() 被渲染 */} {/* 注意递归这里，checkPermission可以直接影响到children级别 */}
        </SubMenu> /* 在JSX语法中嵌入JS表达式 {} */
      }
      return  checkPermission(item) &&<Menu.Item key={item.key} icon={iconList[item.key]} onClick={()=>{
        //console.log(props)
        navigate(item.key) /* 点击菜单项 跳转到对应的路由 */
        // props.history.push(item.key) /* 这里的 props 是组件的属性对象，history 是其中的一个属性，代表浏览器的历史记录对象。当执行这个方法时，浏览器的地址栏将更新为 item.key 对应的路径，并且组件将被重新渲染以反映新的状态。 */
      }}>{item.title}</Menu.Item>  /* Menu.Item和SubMenu是并列级别的，只是前者没有子菜单 后者有，后者要在内部递归渲染子菜单 */

    })

  } 

  console.log(props.location)
  const location = useLocation()
  const openKeys = ["/"+ location.pathname.split("/")[1]] /* 用/作为分隔，把前面的部分取出来，因为一层路径里面的路径如果高亮了，要把一层保持打开状态 */
  // console.log(openKeys)

  return( /*  这个部分是 SideMenu 组件的 UI 结构。它定义了组件渲染的外观和布局。*/
        <Sider trigger={null} collapsible collapsed={false} > {/* Sider 是从layout对象中解构出来的属性或组件 这样就可以直接用这个名称  collapsible可折叠的 */}
          <div style ={{display:"flex", height:"100%","flexDirection":"column"}}>  {/* 弹性盒，控制主元素，剩余空间自适应，高度是父元素的100% 主轴改成垂直 */}
            <div className="logo">全球新闻发布管理系统</div>{/* 。在React的JSX语法中，className代替了原生HTML中的class。这是因为class是JavaScript的保留关键字，为避免冲突  类选择器使用一个点（.）符号来定义样式  这里logo的css已经固定好了*/}
            <div style={{flex:1, "overflow":"auto"}}> {/* flex1 占满剩下空间 如有多个flex1 平均分配  overflow滚动条只有这一部分自己滚动 */}
              <Menu /* menu下面的都是menu的props */
                theme="dark" /* 颜色风格 */
                mode="inline" /* 纵向排列 horizontal横向排列 */
                selectedKeys={location.pathname}/* 默认选中的key切换页面的时候会高亮显示 路由的navigate控制active class好像也可以控制高亮 需要哪个高亮就把它的key放进去 表示一个 React 组件的属性（prop）。是一个数组是因为它一次可以高亮两个*/
                /* 去看ANTD给的属性（API） defaultOpenKeys是不受控组件，只会高亮选中初始的路径，但是如果出现重定向（去看newssandbox里面"/" navigate to了"/honme"，这时候如果想要重定向后的地址也有高亮效果，需要改成受控组件selectKeys（也就是会受到外部改变而改变）  */
                /* 你需要确保传入的值是一个字符串数组，而不是 location 对象。通常，你应该使用 location.pathname 作为选中的关键字，因为它代表当前路由的路径。 */
                defaultOpenKeys={openKeys} /* 一层路径里面的路径如果高亮了，要把一层保持打开状态 */
                
                // items={[ /* items 是Menu组件的props 中括号包含了一组对象，每个对象代表一个列表项目（js中对象必须用大括号括起来），其中每个元素都是一个菜单项。items是一个数组。 */
                //   {
                //     key: 'sub1', /* 正因为defaultSelectedKeys 所以每个menu item都必须有个特殊的key */
                //     icon: <UserOutlined />,
                //     label: 'nav 1',
                //     /* 这里每对话括号表示一个对象，包含该菜单项的属性，有key icon label */
                //     children: [
                //       {
                //         key: 'g1',
                //         label: 'Item 1',
                //         type: 'group',
                //         children: [
                //           {
                //             key: '1',
                //             label: 'Option 1',
                //           },
                //           {
                //             key: '2',
                //             label: 'Option 2',
                //           },
                //         ],
                //       },
                //       {
                //         key: 'g2',
                //         label: 'Item 2',
                //         type: 'group',
                //         children: [
                //           {
                //             key: '3',
                //             label: 'Option 3',
                //           },
                //           {
                //             key: '4',
                //             label: 'Option 4',
                //           },
                //         ],
                //       },
                //     ],
                //   },
                //   {
                //     key: 'sub2',
                //     icon: <VideoCameraOutlined />,
                //     label: 'nav 2',
                //   },
                //   {
                //     key: 'sub3',
                //     icon: <UploadOutlined />,
                //     label: 'nav 3',
                //   },
                // ]}/* items最外面的话括号是一个JS表达式插值  它将一个数组传递给 Menu 组件的 items prop。更多内容见下*/
                // 这样写会导致主组件特别繁琐特别长，而且是静态的没办法根据后端数据变化而重新渲染
              >{renderMenu(menu)}</Menu>{/* 函数式编程 renderMenu调用menuList实参运行后 传到上面函数定义形参 接收到之后按照定义运行 也就是说把这个长长的menu拿到组件外面去了*/}
          </div>
          </div>
      </Sider>
    )
  
}
// 新版react 已经弃用 withRouter高阶组件HOC export default withRouter(SideMenu) /* 这里的withRouter是react-router-dom提供的高阶组件，可以让路由信息直接传递给组件 */

// export const withRouter = (SideMenu) =>{
//   const Wrapper = (props) =>{
//       const history = useNavigate();
//       return <SideMenu history={history} />
//   } 
//   return Wrapper;
// }
/* 先固定化做 再动态创建 静态的比如说你的这个侧边栏展开内容是固定的。但是你要想 你这个系统里面有不同的角色，每个人的权限不同侧边栏肯定也不同 所以要做成动态可以改变的*/
/* 动态的 从后端返回一个数组结构，根据这个数组结构动态创建。权限变了之后：1.重新建立新的结构 2.根据新的结构和原来总的对比 选一种 */
/* JSX是在js文件中更像HTML的代码 在 JavaScript 代码中使用 <tag> 和 </tag> 结构来描述组件的 UI。avaScript 代码使用标准的编程语法，包括变量声明、函数定义、条件语句等。 */



/* 1. 网页刷新的过程
当您刷新网页时，浏览器执行以下步骤：

重新加载页面：浏览器会停止当前页面的所有 JavaScript 代码，清除当前的 DOM、样式和任何正在运行的脚本。
重新请求资源：浏览器向服务器请求页面的 HTML、CSS 和 JavaScript 文件。
重新解析 JavaScript：浏览器加载 JavaScript 文件并执行代码。所有在文件中定义的代码，包括组件外部的代码，都会被执行。 */

/* 组件外面的代码只在初次import这个js file（我的理解是初次Import react 文件https://react.dev/learn/importing-and-exporting-components）的时候运行一次，因此，一定要把每次渲染更新的东西放到组件里面来 */