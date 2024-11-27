import React, { useState, useEffect } from 'react'
import{ Button, Table, Modal } from 'antd'
import axios from 'axios' 


const { confirm } = Modal;

export default function NewsPublished(props) {
  

  const columns = [ /* 定义表格的列 */
    {
      title: '新闻标题',
      dataIndex: 'title', /* 表示会把name放到第一列中 对应上面datasource的属性 */
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
        <div> {category.title} </div>
      ),
    },
    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
          {props.button(item.id)} {/* 加了小括号箭头函数执行了，直接执行得到的就是button组件，调用父组件的回调函数，并把参数传过去 */}
          {/* 这里button里面有callback function，通过这种方式实现了子component向父component通信 */}
        </div>
    ),},
  ];

  

    

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
      pagination={{ pageSize: 5 }}
      rowKey = {item=>item.id} /> {/* 分页 控制一页只有五行数据 */}
      </div>
   ) 
  
}

