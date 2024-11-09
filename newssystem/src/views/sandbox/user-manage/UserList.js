import React, { useState, useEffect, useRef } from 'react'
import{ Button, Table, Modal, Switch, Form, Input, Select, Flex } from 'antd'
import axios from 'axios' 
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserFormItem from '../../../components/user-manage/UserFormItem.js'

const { confirm } = Modal;

export default function UserList() {
  // datasource也就是数据应当做成状态，因为我们的权限是动态改变的，根据不同的角色
  const [dataSource, setdataSource] = useState([]) /* 第一次渲染结束就被更新赋值，通过useEffect */
  const [isModalOpen, setisModalOpen] = useState(false)
  const [isUpdateOpen, setisUpdateOpen] = useState(false) 
  const [roleList, setroleList] = useState([]) /* 第一次渲染结束就被更新赋值，通过useEffect */
  const [regionList, setregionList] = useState([]) /* 第一次渲染结束就被更新赋值，通过useEffect */
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false) /* 父组件的值传给子组件实现控制 */
  const [updateCurrent, setupdateCurrent] = useState(null) /* 保存一下更新的对象 */
  const [controlRendering, setcontrolRendering] = useState(false)

  const [selectedItem, setSelectedItem] = useState(null);  // 存储要编辑的用户数据

  const {roleId, region, username} = JSON.parse(localStorage.getItem("token"))

  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"  
  } /* 映射对象，在数字意义模糊的时候可以用这种方法，便于写代码 */

  useEffect(()=>{
    axios.get("/users?_embed=role").then(res=>{
      const list = res.data
      setdataSource(roleObj[roleId]==="superadmin"?list:[
        ...list.filter(item=>item.username===username),  
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")  /* 这个本来应该是后端处理好的,但是json-server没办法 */
        /* 区域编辑是不允许看到这个页面的，所以说除了超级管理员就是管理员，而管理员应该只能看到自己和同区域的比自己低级的区域管理员 */
      ])   /* 不能一股脑都扔出来，因为不同角色的人他的权限范围是不同的 */
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/regions").then(res=>{
      const list = res.data
      setregionList(list)
      // console.log(regionList)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/roles").then(res=>{
      const list = res.data
      setroleList(list)
      // console.log(roleList)
    })
  },[])

 
  const addForm = useRef(null); /* 用forwardRef让父组件取子组件那里获取数据 */
  const updateForm = useRef(null);
  const initialIsUpdateDisabled = useRef(isUpdateDisabled) 
  /* 关于forwardRef ：updateForm.current 的初始值为 undefined（null），当你将其关联到某个组件（例如，表单组件）后，current 的值会变为该组件的实例。具体来说，它会在组件渲染完成后被赋值。 */

  const columns = [ /* 定义表格的列 */
    {
      title: '区域',
      dataIndex: 'region', /* 表示会把region放到第一列中 对应上面datasource的属性 */ /* 'region' 是一个字符串，它告诉代码要从数据源中使用名为 region 的属性。这是一个键，和对象的属性名对应。 */
      filters: [
        ...regionList.map(item=>({  /* 使用扩展运算符 ... 将 map() 的结果数组“展开”到 filters 数组中。这样做的好处是将转换后的对象直接作为 filters 数组的元素。
          如果不使用 ...，filters 会变成一个嵌套数组，因为 map() 返回的是一个数组。 */
          text:item.title,
          value:item.value
        })),
        {
          text: "全球",
          value: ""
        }
      ],

      onFilter:(value,item)=>item.region===value, /* 这里value是点击的值  item是每一项*/

      render:(region)=>{  /* render依赖于dataIndex,这里region只是一个形参，实际上取的是dataIndex取到的字段值 */
        return <b>{region==""?'全球':region}</b> /* 超级管理员不用选区域，region为空字段自动赋值全球 */
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role)=> {return role.roleName}
    },
    {
      title: '用户名',
      dataIndex: 'username', 
    },
    {
      title: '用户状态',
     
      render:(item) => {  /*  其实可以传两个参数 */
        return <Switch checked={item.roleState} disabled={item.default} Checked onChange={()=>handleChange(item)}></Switch> /* 用onchange改成非受控组件 */
      }
    },
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的实参 */
        <div>
         
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default}
          onClick={()=>handleUpdate(item)}/>  {/* 这里的item就是当前遍历到的对象 */}
          
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} 
          onClick={()=>confirmMethod(item)} disabled={item.default}
           />

        </div>
    ),},
  ];

  useEffect(() => {
    if (isUpdateOpen && updateForm.current) {
      // 确保 Modal 打开且 ref 已经初始化后，设置表单的值
      updateForm.current.setFieldsValue(selectedItem);  // 将 selectedItem 作为表单初始值  setFieldsValue是antd的一个方法 只会更新对应字段的值，不会触发验证。它可以接受一个对象，格式通常是字段名作为键，字段值作为值。这个方法会更新表单中对应字段的值。
    }
    console.log("目前状态："+ isUpdateDisabled)  /* 注意这里打log的方法，和前面互相验证，前面setstate根据roleid进行set，那么这里要验证useEffect有没有看到正确更新状态后的值 */
  
  }, [isUpdateOpen, selectedItem]); /* 依赖项，这两个发生了变化然后触发useEffect */

  const handleUpdate = (item) => {
    console.log("role id 是：" + item.roleId)
    
    // setTimeout(()=>{
     setSelectedItem(item);  /* 存储selectedItem数据 */
      if(item.roleId==="1"){  /* 需要实现父子通信，updateform如果是超级管理员，region也不现实select */
        //禁用 设置父组件控制状态 原始是false
        setisUpdateDisabled(true) /* 这时候还没打开，子组件useEffect不会被执行 */
      }else{
        //取消禁用
        setisUpdateDisabled(false)
      }
      setcontrolRendering(!controlRendering) /* 父组件更新每点击一次都会改变controlRendering,因此即使取消之后，原先role没有改，也会触发子组件useEffect，因为依赖两个变量，这是其中之一 */
      setisUpdateOpen(true)
      console.log("update", updateForm)

      setupdateCurrent(item)
      // react状态更新不保证是同步的
    
      // updateForm.current.setFieldsValue(item) /* 把点击的item再传到子组件中渲染 */
      // 报错updateForm总是报错，Cannot read properties of null (reading 'setFieldsValue')TypeError: Cannot read properties of null (reading 'setFieldsValue') 
    // },0) 
    
  } /* https://chatgpt.com/share/670db0b3-b784-8010-b2ed-4dd193df8ad0 按照chatgpt修改的，但是还没完全搞明白为什么 */
/* 想明白一个问题：为什么一定要用useEffect，不能把判断状态的条件放进handleUpdate里？因为一个函数代码块中的代码是同步处理的，也就是说一行一行执行，但是状态更新是异步的（只有在完成下一次渲染时值才会更新），可能会导致你在这里访问到的if条件里面的判断值还没有更新，导致一直无法进入到if判断里面进行更新，所以必须要用useEffect */
/* 所以打log的时候也要注意，不能再set之后打log，这样其实检测不到状态值的变化 */
/* 在 React 中，如果多个状态更新在同一个事件处理函数（如 handleUpdate）中被调用，React 会将这些状态更新合并为一次渲染。这意味着在事件处理函数执行结束后，React 会进行一次渲染，而不是针对每次 setState 调用都重新渲染。 */
/* 在 React 中，当你调用状态更新函数（例如 setCurrentRoom）时，React 会将该更新请求排入队列，并在下一个渲染周期中处理这些更新。这是为了提高性能，减少不必要的渲染和计算。 */

  const handleChange =(item) =>{  /* 未来用于管理用户不允许登录 */
    // console.log(item)
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    axios.patch(`http://localhost:5000/users/${item.id}`,{  
      roleState:item.roleState 
    })
  }

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
    // console.log(item)
    // // 当前页面同步状态，同时删除服务端（后端）数据（不删后端，刷新又出来）
    setdataSource(dataSource.filter(data=>data.id!==item.id)) /* 前端更新domtree */
    axios.delete(`http://localhost:5000/users/${item.id}`) /* 后端同步数据 */
    
  }
   
  const addFormOK = ()=>{
    addForm.current.validateFields().then(value=>{ /* .validateFields() 返回promise对象然后.then */
      // console.log(value)  /* 拿到数据之后 让modal框消失，然后同步后端数据 */、
      setisModalOpen(false)

      addForm.current.resetFields() /* 重置一下当前的选框 antd的API */
      /* post到后端，生成id，在设置datasource，方便后面的删除和更新，不然没有id，就算生成了这个角色，以后再想修改和删除就找不到了（因为删除和修改都是根据id来的） */
      axios.post('http://localhost:5000/users',{
        ...value, /* 这些都从填进去的前端数据传过来 */
        "roleState": true,
        "default": false,
      }).then(res=>{
        console.log(res.data)
        setdataSource([...dataSource,{  /*更新本地数据  */
          ...res.data,
          role:roleList.filter(item=>item.id===value.roleId)[0] /* https://chatgpt.com/share/67096d10-94a0-8010-9d9f-15b03d28d3b2 */
        }]) /* 本来这个是可以后端做的，但是json-server目前做不到 */
      })
      
    }).catch(err=>{
      console.log(err)
    })

  }

  const updateFormOK = () =>{
    updateForm.current.validateFields().then(value=>{  /* validateFields() 会触发Form.item表单中所有字段的验证规则（如必填项、格式验证等） */
      // console.log(value)
      setisUpdateOpen(false)

      setdataSource(dataSource.map(item=>{
        if(item.id === updateCurrent.id){
          return{
            ...item, /* 将 `item` 中所有属性展开并保留 JS扩展运算符，用于将一个对象的所有课美剧属性复制到另外一个对象中 将当前 item 对象的所有属性复制到新的对象中。这意味着你保留了这个用户的所有现有信息。 */
            ...value,  /* value 中的属性会覆盖掉 item 中相应的属性值，从而实现更新。 */
            role:roleList.filter(data=>data.id===value.roleId)[0] /* 原先useEffect用embed取过来，更新的时候也要同样加入 */
          }
        }
        return item
      }))
      axios.patch(`http://localhost:5000/users/${updateCurrent.id}`, value)
    })
  }

  return (
    <div>
      <Button type="primary" onClick={()=>setisModalOpen(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }} rowKey={item=>item.id}/> {/* 分页 控制一页只有五行数据 */} {/* item 这个参数是在组件内部自动生成的，表格组件会遍历它的数据源（例如 dataSource），对每一行(数组的每个对象）调用你提供的函数。 */}
      
      <Modal
        open={isModalOpen}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ /* 对象字面量 */
          autoFocus: true,
          htmlType: 'submit',
          
        }}
        onCancel={() => setisModalOpen(false)}
        onOk={()=>{
          // console.log("add", addForm)
          addFormOK()
        }}
        destroyOnClose
      >
       
        <UserFormItem regionList={regionList} roleList={roleList} ref={addForm}></UserFormItem>  {/* 大括号里面的ref只是一个函数名，可以自己改 */}
       
      </Modal>  {/* edit也可以复用这个，但没必要，因为要改的不少，所以直接新创建一个 */}

      <Modal
        open={isUpdateOpen}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        okButtonProps={{ /* 对象字面量 */
          autoFocus: true,
          htmlType: 'submit',
          
        }}
        onCancel={() => {
          setisUpdateOpen(false)
          //  if(selectedItem.roleId === '1'){
          //   setisUpdateDisabled(true);
          //   console.log("更新了状态， 应该是true")
          //  }else{
          //   setisUpdateDisabled(false);
          //   console.log("更新了状态， 应该是false")
          //  }
          // setisUpdateDisabled(!isUpdateDisabled) /* 关于这行代码不起作用的原因, 每次set都会重新render，但是你在oncancel的时候set了这个值，相当于状态变化了一次，假设之前是第零次，现在是第一次，下次再次打开的时候是第二次。 前提要知道如果组件关闭（即被卸载），则这个组件的所有 useEffect 都会被清理并不再执行。那么你可以看到在比较第一次和第零次的时候，组件被关闭，因此没有执行；比较第二次和第一次的时候，已经没有发生过变动，因此这句代码不起作用 */
          /* 改变isupdatedisabled 触发useEffect */
          console.log("改变isupdatedisabled 触发useEffect 更新后应当为1")
            // 打印切换的状态
          }}
        onOk={()=>{
          console.log("update", updateForm)
          updateFormOK()
        }}
        // destroyOnClose
      >
       
        <UserFormItem regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled = {isUpdateDisabled} controlRendering = {controlRendering}
        isUpdate = {true}></UserFormItem>
       {/* 直接在组件中写新属性是可行的，比如这里的isUpdateDisabled */} 
       {/* UserFormItem 组件通过 props 接收来自父组件的数据 userformitem后面这些都是*/}
      </Modal>
      
      </div>

      
   ) 
  
}

/* 组件构成和dataflow */
/* 组件：
1. 整体有一个userlist, userlist里面有一个添加用户button 以及一个表格，表格最右侧还有两个button（修改和删除权限） */

/* state 开关 dataflow  ‘用户状态’
1.首先初始化渲染, 先是useState
2.点击button onChange监听到触发 handleChange，里面的各种set更新完成之后，进行重新渲染，然后检查useEffect钩子依赖项，发现变化，然后if (isUpdateOpen && updateForm.current)
3.通过了if条件执行updateForm.current.setFieldsValue(selectedItem)，也就是说更新userform里面的值
4.这时候点击表单userform里面的角色（角色的变化应当会联动region是否可见，说应当是因为这是我们要实现的效果），点击角色，onchange监听到了变化，触发调用了了handlechange, 把选中的角色作为实参传递给handlechange(该函数定义的形参是value，通过打印看传递是否正确)
*/
/* Edit button dataflow:
首先分清楚，修改button中，弹出的框，只有表格是子组件，存放在UserFormItem
1.首先初始化渲染, 先是useState
2（父）.点击button 触发handleUpdate，把选中的item对象传入
3（子）.选role修改，举例：把角色从区域编辑改成超级管理员，子组件监听到并触发handledropdownchange，setisUpdateDisabled(true),这样区域那一行就看不见了
4（父）.cancel逻辑，此时如果是区域编辑（2）转超级管理员（1）上一次的打印value应该是1，然后点击取消 onCancel监听（在父组件上的按钮），然后先把modal关闭，此时selecteditem.roleid其实全程都没有被改变，所以仍然是2，走else逻辑，setisUpdateDisabled(false)，所以！！你会发现这里，如果子组件的useEffect只依赖于这个，那么点击cancel事件前后，它都是false（在 React 中，如果使用 setState 更新状态的值和当前状态相同，React 不会触发重新渲染。），因此这次set之后不会触发子组件的useEffect，这就导致子组件useEffect内部的逻辑不会运行，那么就会保持着上一次渲染的结果，这也就导致为什么之前出错在cancel之后再次打开，区域仍然是不能选
6. 如何解决这个问题呢？那么久得保证，即使是cancel，setisUpdateDisabled没有变，也得走到子组件的useEffect中，让它重新按照isUpdateDisabled渲染一遍，然后重新恢复到原始的状态，即可以选择*/

/* rendering process
1. 改变了数据（状态改变）
2. 因为数据改变dom tree被改变
3. React检测到dom tree被改变，重新渲染，并且触发符合变化条件的useEffect
 */

/* 然而原先改变isupdatedisabled的时候，modal已经被关闭了，这时候触发useEffect的效果无法显示，下次再次打开modal的时候，只发生了setmodalopen，其他的值没有变化，子组件的useEffect也就没法被触发（条件是isupdatedisabled) */

/* 草稿画了个图 可以去看 */


/* addFormOK 这种是从前端-后端-前端的过程，再次回到前端是为了保持后端和前端数据一致（比如有统一的id，方便后续管理） */
/* setdataSource([...dataSource, {...res.data, role: ...}]) 语法  [...dataSource] 表示创建一个新的数组，该数组包含 dataSource 中的所有元素。这是为了避免直接修改原始的 dataSource 数组（因为在 React 中，直接修改状态是不可取的）。
...res.data 是对象展开运算符（Spread Operator）。它会将 res.data 对象的所有属性展开到一个新的对象中。  role: 是给新对象添加一个 role 属性。*/