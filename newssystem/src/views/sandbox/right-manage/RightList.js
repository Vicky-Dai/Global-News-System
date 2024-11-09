import React, { useState, useEffect } from 'react'
import{ Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import axios from 'axios' 
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {
  // datasource也就是数据应当做成状态，因为我们的权限是动态改变的，根据不同的角色
  const [dataSource, setdataSource] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      const list = res.data
      list.map(item=>{if (item.children.length === 0){item.children = ""}return item} )
      setdataSource(res.data)
    })
  },[])



  const columns = [ /* 定义表格的列 */
    {
      title: 'ID',
      dataIndex: 'id', /* 表示会把name放到第一列中 对应上面datasource的属性 */
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key', /* */
      render: (key) => ( /* 这里的key是一个形参，至于实参调用的过程是由antd定义的，去找dataIndex对应的属性 */
        <Tag color = "gold">
          {key}
        </Tag>
      ),},
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
          <Popover content={<div style={{textAlign: 'center'}} ><Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch></div>} title="页面配置项" trigger="click">
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
          </Popover>   {/* 写法见antd */}
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} 
          onClick={()=>confirmMethod(item)}
          />

        </div>
    ),},
  ];

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1? 0 : 1 /* 控制pagepermisson的状态 点一下就切换 */
    setdataSource([...dataSource]) /* 这里的dataSource是状态，所以要用set方法更新状态 */

    if(item.grade===1){ /* 从dataSource对应服务端数据，更新pagepermisson */
      axios.patch(`http://localhost:5000/rights/${item.id}`,{  /* 更新服务端父级数据 */
        pagepermisson: item.pagepermisson
      })
    }else{  
      axios.patch(`http://localhost:5000/children/${item.id}`,{  /* 更新服务端子级数据 */
      pagepermisson: item.pagepermisson
      })
    }
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
    
    if(item.grade===1){
      setdataSource(dataSource.filter(data => data.id !== item.id))
    // 这是在过滤 判断当前dataid是否等于item.id，如果是的话就删除，否则保留
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }else{
      let list = dataSource.filter(data=>data.id!==item.rightId) // 找到父级
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      setdataSource([...dataSource])
      axios.delete('http://localhost:5000/children/${item.id}')
    }
  }
  


    

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }} /> {/* 分页 控制一页只有五行数据 */}
      </div>
   ) 
  
}

/* 总结：
1. rightlist的主要功能是对于权限的管理，包含修改和删除，dataflow是从前端按钮交互，到后端服务端数据的交互，以下根据dataflow的步骤进行分析：
2. 修改逻辑：通过在数据最后一列“操作”列中增加一个按钮，在按钮上增加一个Popover组件，Popover组件内容是一个Switch组件，Switch组件的checked属性控制页面权限的开关，点击Switch组件时，触发Switch组件的onChange事件监听器，onChange执行绑定的事件处理函数，将pagepermisson的状态反转
    反转后，根据前端数据的变动，通过axios.patch更新服务端数据
3. 删除逻辑: 通过在数据最后一列“操作”列中增加一个按钮，点击按钮时，触发confirmMethod方法，confirmMethod方法弹出一个确认框，用户点击确认后，触发deleteMethod方法，deleteMethod方法执行删除逻辑，删除服务端数据，刷新页面 */