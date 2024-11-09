import React, { useState, useEffect} from 'react'
import {Table, Button, Modal, Tree} from 'antd'
import axios from 'axios'
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setdataSource] = useState([]) /* 表格数据 */
  const [rightList, setRightList] = useState([]) /* 权限列表 跟tree结构要求的数据类似 */ /* 树形控件数据 */
  const [currentRights, setcurrentRights] = useState([]) /* 树形控件中当前被选中的checkbox */
  const [currentId, setcurrentId] = useState([]) /* 当前点击的对象的id */
  const [currentItem, setcurrentItem] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false) /* 管理修改按钮弹出对话框的状态 */ /* useState 是一个钩子（Hook）。
  isModalOpen 是一个状态变量（State Variable）。
  setIsModalOpen 是一个状态更新函数（State Update Function）。
  false 是初始状态值（Initial State Value）。 */
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id', 
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      
    },
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参（可以自己定义）,so item就是dataSource中的每一行数据（数组中的一个对象），是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
          
          <Button type="primary" shape="circle" icon={<EditOutlined />} /* antd的Button组件 */
          onClick={()=>{ /* Event Handler Prop / Event Listener*/
            setIsModalOpen(true) /* State Update Function */
            setcurrentRights(item.rights) /* 获取当前点击的对象的rights数据 */
            setcurrentId(item.id) /* 获取当前点击对象的id值 */
          }}/>
          
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={()=>confirmMethod(item)} /* ()=>confirmMethod(item) 是匿名箭头函数，隐式作为onClick的回调函数（系统内部将confirmMethod作为参数) */
          />

        </div>
    ),},
  ]  /* 设置table的列 */

  const confirmMethod = (item) => {
    confirm({
      title: '确认删除？',  // 对话框标题
      icon : <ExclamationCircleOutlined />,  // 对话框图标
      // content: 'Are you sure you want to proceed?',  // 对话框内容
      onOk() {  // 用户点击 "OK" 按钮时执行
        // console.log('Confirmed'); 
        deleteMethod(item) 
      },
      onCancel() {  // 用户点击 "Cancel" 按钮时执行
        // console.log('Cancelled');
      },
    });
  }
// 这里的item就是我们点击的那一行的数据 因为我们在columns中定义了render函数，所以这里的item就是render函数的形参
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id)) /* 本地页面状态更新 */
    // 这是在过滤 判断当前dataid是否等于item.id，如果是的话就删除，否则保留
    axios.delete(`http://localhost:5000/roles/${item.id}`) /* 删除对应id的整个元素 */  /* 利用delete API */
  }

  useEffect(()=> { /* 在一个 React 组件中可以使用多次 useEffect */
    axios.get("http://localhost:5000/roles").then /* 利用get API */
    (res=> {
       setdataSource(res.data)

    })

  },[])
  

  useEffect(()=> {
    axios.get("http://localhost:5000/rights?_embed=children").then
    (res=> {
       setRightList(res.data)

    })

  },[])

  const handleOk = () =>{
    // console.log(checkedKeys) 发现checkStrictly=true的时候，那么checkedKeys就是个对象
    setIsModalOpen(false) /* 先把对话框关闭 */
    //同步datasource
    setdataSource(dataSource.map(item=>{ /* item在这里是dataSource数组的每一行对象数据，当你调用 dataSource.map(item => {...}) 时，JavaScript 会遍历 dataSource 数组并在每次迭代时将当前元素传递给回调函数。
      在回调函数内部，item 只是一个形参，代表的是当前正在处理的数组元素。这种机制使得函数能够自动知道 item 指向的是 dataSource 数组中的对象。 */
      /* 这里箭头函数是匿名函数，没有实际的调用过程，在被触发时自动调用。在 map 方法内部，它会自动将 dataSource 数组中的每个元素作为实参传递给箭头函数。即每次迭代时，当前的数组元素都会被传递给形参 item。 */
      if(item.id === currentId){  /* currentId是我们点击的那一行数据的id 找到匹配的那个数据，然后把他改掉*/ /* map 方法返回一个新数组，结果是通过对原数组中的每个元素调用一个提供的函数得到的。 */
        setcurrentItem(item);
        return{
          ...item, // 保留原始项的所有属性
          rights:currentRights // 这个新对象中, 更新 rights 属性为 currentRights 的值
        }
        
      }
      return item /* 如果不符合前面的if，就原样返回当前这一行对象数据 */
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`,{
      
      rights: currentRights // 仅更新 rights 属性
    })
    .then(res => {
        console.log("Update successful:", res.data); // 处理成功响应
    })
    .catch(err => {
        console.error("Update failed:", err); // 处理错误
    });
};

  const handleCancel =()=>{
    setIsModalOpen(false)

  } 

  const onCheck = (checkedKeys, e) => {
    // console.log(checkedKeys)
    setcurrentRights(checkedKeys.checked) /* 受控组件最大的作用就是得到新的值之后重新set给状态 */

  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}> </Table> {/* columns控制列 rowkey控制行特定标识 */}
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}> {/* open onOk onCancel各自都是antd封装的组件Modal的属性， 第一个属性open的属性值（也称为props）是一个布尔类型，用于控制对话框的开关；第二个和第三个属性（props）onOk的属性值（props）是一个event handler事件处理函数，分别用于确认和取消*/}
        <Tree
        checkable/* 可选择的 */
        checkedKeys={currentRights} /* defaultCheckedKeys非受控属性，第一次会生效，后面不再受状态改变而影响。把default去掉就变成受控属性 */
        onCheck={onCheck} /* 监听Checkbox的点击事件，如果我们想修改的时候能够被前端影响*/
        checkStrictly = {true} /* 父子节点互斥，父节点选中，子节点自动取消选中 */
        treeData={rightList}
      />
      </Modal>
    </div>
  ) /* table自己在生成的时候通过遍历item类里面的key（唯一）来生成，但是有时候有些数据没有key，那么用rowKey来指定唯一的key。比如之前写rightlist的时候数据里面本身就有key，所以不写antd table组件自己遍历的时候也能找到位置  */
}

/* 角色列表主要feature及数据流：
feature
主要
1.表格显示有哪些角色，每个角色后配有删除和修改角色权限的按钮 2.删除角色权限: 点击按钮，确认 3.修改角色权限通过点开修改赶牛，弹出一个对话框里嵌套树形结构checkbox来实现
对话框Modal:
1. 直接从antd引入Modal，对话框没有太多数据，就初始赋值title 
2. 有几个可以交互的属性，通过传入props来实现 
（1）open属性（props） 传入布尔值属性值（props）isModalOpen

数据流：
形成表格<Table/>：
1. useState 初始化数据dataSource (此时首先组件被按照useState后的初始值进行渲染），把dataSource赋给Table的dataSource, 形成表格；同时useEffect从后端拉取数据dataSource，副作用成功实现setdataSource之后，会更新状态（更新数据）并重新触发渲染（虚拟DOM和实际DOM对比)。
绑定在表格里面修改按钮的对话框：
1. 点击Button按钮（setIsMoalOpen方法绑定在Button组件上（弹窗），按钮open的值由初始值false转变为True
2. 点击弹窗ok, 触发onOk属性(事件监听器），调用handleOk事件处理函数event handler function（同时也是回调函数）（用一个匿名箭头函数定义）, 显示通过状态更新函数更新open属性的值，
    来把弹窗关掉，然后根据前端对checkbox的改变，遍历更新rights的值。
树形控件数据流：
1. 初始化，用状态Hook useState来初始化空treeDate，形成树形结构（流程同表格）；同时useEffect从后端拉去数据，用setRightList数据更新函数来更新rightList, 并重新渲染树形控件
    与表格不同的一点，它还有checkbox，通过checkedKeys来控制目前被选中的checkbox，通过状态Hook useState来初始化（空），但是当你点击某一行数据的修改的按钮的时候，currentRights便被setcurrentRights(item.rights)更新为当前对象的rights值，
    树形结构的checkbox勾选便被更新为currentRights的数据
2. 修改属性控件check，触发onCheck事件监听，调用onCheck(跟上一个不一样) event handler（一个箭头匿名回调函数）, 来setcurrentRights重新渲染checkbox  checkedKeys.checked是在console中看antd给数据命的名来写的
3. 如果要确认修改，就点击ok，触发handleOk方法，先关闭对话框，然后根据现有数据更新后端数据保存结果：对dataSource遍历，找到对应Id（在之前点击Button时 setCurrentId来更新）的对象，展开数据，修改rights那一个key的值，并返回修改后的对象（map方法做到的）。
4. 如果取消，就点击cancel，触发handleCancel方法，直接关闭对话框，不更新数据



 */


/* 关键词：
React component ;  Event handler  props ; state and lifesycle of component ;  
Hook ; state variable ; state update function ; initial state value*/

/* 命名规则：组件开头大写 event handler驼峰命名法（camel-case 通常handle开头） */

// const handleOk = () =>{
//   // console.log(checkedKeys) 发现checkStrictly=true的时候，那么checkedKeys就是个对象
//   setIsModalOpen(false) /* 先把对话框关闭 */
//   //同步datasource
//   setdataSource(dataSource.map(item=>{ /* item在这里是dataSource数组的每一行对象数据，当你调用 dataSource.map(item => {...}) 时，JavaScript 会遍历 dataSource 数组并在每次迭代时将当前元素传递给回调函数。
//     在回调函数内部，item 只是一个形参，代表的是当前正在处理的数组元素。这种机制使得函数能够自动知道 item 指向的是 dataSource 数组中的对象。 */
//     /* 这里箭头函数是匿名函数，没有实际的调用过程，在被触发时自动调用。在 map 方法内部，它会自动将 dataSource 数组中的每个元素作为实参传递给箭头函数。即每次迭代时，当前的数组元素都会被传递给形参 item。 */
//     if(item.id === currentId){  /* currentId是我们点击的那一行数据的id 找到匹配的那个数据，然后把他改掉*/ /* map 方法返回一个新数组，结果是通过对原数组中的每个元素调用一个提供的函数得到的。 */
//       setcurrentItem(item);
//       return{
//         ...item, // 保留原始项的所有属性
//         rights:currentRights // 这个新对象中, 更新 rights 属性为 currentRights 的值
//       }
      
//     }
//     return item /* 如果不符合前面的if，就原样返回当前这一行对象数据 */
//   }))
//   axios.put(`http://localhost:5000/roles/${currentId}`,{
//     ...currentItem, // 展开当前项目的所有属性
//     rights: currentRights // 仅更新 rights 属性
//   })
//   .then(res => {
//       console.log("Update successful:", res.data); // 处理成功响应
//   })
//   .catch(err => {
//       console.error("Update failed:", err); // 处理错误
//   });
// };

/* 这个后半段都是我自己写的，很有意思，总结注意的：1.axios put patch post delete get 区分，看看需要用哪个，这里的思考就是put是完全更新整个数据（但是没有处理的数据会被直接删除），post是创建数据，适合增加条目的时候，patch适合什么呢? 
这里选择了put之后要注意，要把当前的对象数据，全部展开    
但是发现 还是很难写,entirely更新会改变数据顺序很可能出错，所以还是要用patch!!! 
/* patch 补丁修改 */
    // axios.patch("http://localhost:8000/posts/1",{
    //   title:"love u data change 补丁"
    // })*/