import React,  { forwardRef, useState, useEffect } from 'react'
import{ Button, Table, Modal, Switch, Form, Input, Select, Flex, Option } from 'antd'

const UserFormItem = forwardRef( function UserFormItem(props, ref) { /* props父传子，省的再取一遍数据，父组件UserList去看一下，那边用到子组件的时候同样要把props传入  ref是一个特殊的属性，用于方位组件实例，这里ref被作为第二个参数传给userFormitem*/
  const [isDisabled, setisDisabled] = useState(false)
  

  useEffect(()=>{
    console.log("进了useEffect, props.isUpdateDisabled是" + props.isUpdateDisabled)
    setisDisabled(props.isUpdateDisabled);  
  },[props.isUpdateDisabled, props.controlRendering]) /* 根据从父组件UserList传入的依赖值的改变，来进行修改子组件属性的状态，从而实现父子组件通信 */
/*  */
  
//   useEffect(() => {
//     console.log('isDisabled has changed:', isDisabled);
// }, [isDisabled]); 
/* 为什么这里取消了之后，区域管理员仍然选择不了region？ */
  const handleDropdownChange = (value)=>{
    console.log("value等于：",value , props.isUpdateDisabled) /*  */
    if(value === "1"){ /* 注意跟后端数据保持一致 */
      setisDisabled(true)
       // 清除 region 字段的值
      ref.current.setFieldsValue({  
      region: ""
      })
      /* 在 React 中，ref 通常是由 useRef 或 createRef 创建的一个引用对象，它有一个 current 属性，指向所引用的组件或 DOM 元素。

在这个例子中，ref 被传递到 Ant Design 的 <Form /> 组件上，所以 ref.current 指向表单实例。这意味着我们可以通过 ref.current 来调用 Ant Design 的 Form 实例方法。 */
    }else{
      setisDisabled(false)
    }
   
  }

  const {roleId, region, username} = JSON.parse(localStorage.getItem("token"))
  const roleObj = {
    "1":"superadmin",
    "2":"admin",
    "3":"editor"  
  }
  const checkRegionDisabled = (item) => {
    if(props.isUpdate){
      /* 如果是更新用户 */
      if(roleObj[roleId]==="superadmin"){
        return false /* 可以显示区域，可以选择 */
      }else{
        return true
      }
    }else{ /* 创建用户的时候 */
      if(roleObj[roleId]==="superadmin"){ /* 超级管理员可以随便创建 */
        return false
      }else{
        return item.value!==region /* region等于当前就可选，可以创建这个用户 */
      }

    }
  }

  const checkRoleDisabled = (item) => {
    if(props.isUpdate){
      /* 如果是更新用户 */
      if(roleObj[roleId]==="superadmin"){
        return false /* 超级管理员 可以显示角色，可以选择 */
      }else{
        return true
      }
    }else{ /* 创建用户的时候 */
      if(roleObj[roleId]==="superadmin"){ /* 超级管理员可以随便创建 */
        return false
      }else{
        return roleObj[item.id]!=="editor" /* 区域管理员只可以创建区域编辑 */
      }

    }
  }

  

  return (
    <Form layout="vertical" /* 垂直布局 */ ref ={ref} initialValues={{ region: '' }}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={[
            {
              required: !isDisabled, 
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Select disabled = {isDisabled}  /* 1的话就给true，就看不见 */
            defaultValue=""
            style={{
              width: Flex,
            }}
            // options={props.regionList} /* 父传子props写法注意 */
            // options={generateOptions()} /* 父传子props写法注意 */
            options = {props.regionList.map(item => ({
              ...item,
              disabled: checkRegionDisabled(item)
            }))}
          >
          </Select>
            
        
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色" /* 有的角色比如超级管理员是不可以选地区的，所以要用一个状态来控制这个组件 */
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Select onChange={ handleDropdownChange} /* 事件监听器在监听到事件变化了之后，react自动传递变化的事件作为实参对象传递给事件处理函数函数 */
            defaultValue=""
            style={{
              width: Flex,
            }}
            // onChange={handleChange}
            options={props.roleList.map(item => ({      /* 这是通过 map() 将 roleList 的每个对象映射成一个新对象，包含 label 和 value 两个属性。 */
              label: item.roleName, // 这里是展示的文本
              value: item.id,   // 这里是选项对应的值
              disabled: checkRoleDisabled(item)
            }))} /* 箭头后面的（{}）在箭头函数中，当要返回一个对象时，必须将对象字面量用 圆括号 () 包裹起来，确保 JavaScript 将其理解为对象而不是代码块。 */ /* 最外层大括号JSX 表达式 */
          />
          
        </Form.Item>
    </Form>
  )
})

export default UserFormItem