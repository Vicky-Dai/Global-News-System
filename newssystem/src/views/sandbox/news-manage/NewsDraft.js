import React, { useState, useEffect } from 'react'
import{ Button, Table, Modal, notification } from 'antd'
import axios from 'axios' 
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

export default function NewsDraft(props) {
  // datasource也就是数据应当做成状态，因为我们的权限是动态改变的，根据不同的角色
  const [dataSource, setdataSource] = useState([]) 
  const{username} = JSON.parse(localStorage.getItem("token")) /* 从localStorage中获取token，解构出来的是一个对象，对象中包含了用户的信息 */
  const navigate = useNavigate()  /* useNavigate 导航到某个位置 或者-1表示退后一步 */

  useEffect(()=>{
    axios.get(`http://localhost:5000/news?author=${username}&auditState=0&_embed=category`).then(res=>{
      const list = res.data
      setdataSource(list)
    })
  },[username])





  const columns = [ /* 定义表格的列 */
    {
      title: 'ID',
      dataIndex: 'id', /* 表示会把name放到第一列中 对应上面datasource的属性 */
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item)=>{
        // console.log("title是什么", title)
        // console.log("item是什么", item)
        return <a href={`/news-manage/preview/${item.id}`} params={{item}}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render:(category)=>{
        return <b>{category.title}</b> /* 这里的category是一个对象，包含了title属性 */
      } /* render 会替换 dataIndex 原本要显示的内容。dataIndex 指定了从数据源对象中读取哪个属性，而 render 函数则允许你自定义如何显示这个属性的值 */
    },
    
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
            navigate(`/news-manage/update/${item.id}`) /* 点击编辑按钮跳转到编辑页面 */

          }} />

         
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} 
          onClick={()=>confirmMethod(item)}
          />
           <Button type="primary" shape="circle" icon={<UploadOutlined />} 
           onClick={()=>handleCheck(item.id)}/>

        </div>
    ),},
  ];

  const handleCheck = (id) => {
    axios.patch(`http://localhost:5000/news/${id}`,{
      auditState: 1 /* 当前路径下的auditState进行改变 */
    }).then(res=>{
      navigate('/audit-manage/list') /* 跳转页面到审核列表 */

      // api.info({ /* 一个简单的提示 */
      //   message: ` 通知 `,
      //   description:
      //     `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
      //   placement:'bottomRight',
      // });
      notification.info({
        message: `通知`,
        description: `您可以到审核列表中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }


  const confirmMethod = (item) => {
    confirm({
      title: '确认删除？',  // 对话框标题
      icon : <ExclamationCircleOutlined />,  // 对话框图标
      // content: 'Are you sure you want to proceed?',  // 对话框内容
      onOk() {  // 用户点击 "OK" 按钮时执行
        // console.log('delet item', item); 
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
    setdataSource(dataSource.filter(data => data.id !== item.id))
    // // 这是在过滤 判断当前dataid是否等于item.id，如果是的话就删除，否则保留
    axios.delete(`http://localhost:5000/news/${item.id}`)
  }

  


    

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }} 
      rowKey = {item => item.id} /* 这里data字段中没有可以
      不加这个会console报错 hook.js:608 Warning: Each child in a list should have a unique "key" prop.
      报错会重新渲染 progress会不停地跑*/
      /> {/* 分页 控制一页只有五行数据 */}
    </div>
   ) 
  
}

// render 函数的参数是由 Table 组件自动传递的，item 是 dataSource 中的每一行数据对象。