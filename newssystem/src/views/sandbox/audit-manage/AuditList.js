import axios from 'axios'
import { Button, Table } from 'antd'
import React, { useEffect, useState } from 'react'

export default function AuditList() {
  const [dataSource, setdataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem("token"))
  useEffect(()=>{
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_embed=category`).then(res=>{
      /* json server ne是不等于 lte是小于 */
      console.log("audit",res.data)
      setdataSource(res.data)
    }) 
  },[username])


  const columns = [ /* 定义表格的列 */
    {
      title: '新闻标题',
      dataIndex: 'title',  /* 这个报错好奇怪？为什么读不到title */
      render:(title, item)=>{
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category', /* */
      render: (category) => ( /* 这里的key是一个形参，至于实参调用的过程是由antd定义的，去找dataIndex对应的属性 */
         <div>{category.title}</div>
      ),},
    {
      title: '审核状态',
      dataIndex: 'auditState', /* */
      render: (auditState) => ( /* 这里的key是一个形参，至于实参调用的过程是由antd定义的，去找dataIndex对应的属性 */
        <div>auditState</div>
      ),},

    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
      
          <Button danger shape="circle"> 发布 </Button>

        </div>
    ),},
  ];

  return (
    <div>
       <Table dataSource={dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }} 
      rowKey={item=>item.id}/> {/* 分页 控制一页只有五行数据 */}
    </div>
  )
}

    {/* auditState 0 未审核 1 审核中 2 已通过 3 未通过 >=1 */}
    {/* pushlishState 0 未发布 1 待发布 2 已发布 3 已下线  这里<=1 */}