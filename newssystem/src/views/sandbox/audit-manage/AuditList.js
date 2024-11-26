import axios from 'axios'
import { Button, Table, Tag, Flex, notification } from 'antd'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuditList() {
  const [dataSource, setdataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem("token"))
  const navigate = useNavigate()

  useEffect(()=>{
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_embed=category`).then(res=>{
      /* json server ne是不等于 lte是小于 */
      console.log("audit",res.data)
      setdataSource(res.data)
    }) 
  },[username])

  const colorList = ["black", "orange", "green", "red"]
  const auditList = ["未审核", "审核中", "已通过", "未通过"]

  const handleRevert = (item) => {
    setdataSource(dataSource.filter(data=>data.id !== item.id)) /* 过滤掉当前的item */
    axios.patch(`/news/${item.id}`,{
      auditState: 0
    }).then(res=>{
      console.log("撤销成功")
      notification.info({
        message: `通知`,
        description: '撤销成功, 您可以到草稿箱中查看您的新闻',
        placement: 'bottomRight'
      })
    })
  }

  const handleUpdate = (item) => {
    navigate(`/news-manage/update/${item.id}`)
  }

  const handlePublish = (item) => {
    axios.patch(`/news/${item.id}`,{ /* 找到更新的路径，patch数据只要展开然后写里面改了的就可以 */  /* 目前感觉是这里有问题 导致update后无法preview */ 
      "publishState": 2,
      "publishTime": Date.now()
    }).then(res=>{
      navigate('/publish-manage/published') /* 跳转页面 */

      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已发布】中中查看您的新闻`,
        placement: 'bottomRight'
      })
    })
  }

  const columns = [ /* 定义表格的列 */
    {
      title: '新闻标题',
      dataIndex: 'title',  /* 这个报错好奇怪？为什么读不到title */
      render:(title, item)=>{
        // console.log("Item:", item); // 打印 item 对象
        // console.log("title:", title); // 打印 title 对象
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>  /* dataIndex 属性用于指定列数据在数据项中的路径。通过设置 dataIndex 为 title，你可以直接在 render 函数中获取到 title 的值。 但是想获取其他的值就必须从dataSource的每行item对象获取 */
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
        <Flex gap="4px 0" wrap>
          <Tag color={colorList[auditState]}> {auditList[auditState]} </Tag>
        </Flex>
        
      ),},

    {
      title: '操作',
      render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的形参 */
        <div>
          {
            item.auditState === 1 && <Button onClick={()=>handleRevert(item)}> 撤销 </Button> /* 如果审核状态是1(审核中），就显示发布按钮 */              
          }
          {
            item.auditState === 2 && <Button danger onClick={()=>handlePublish(item)}> 发布 </Button> /* 如果审核状态是2，就显示撤销按钮 */
          }
          {
            item.auditState === 3 && <Button type="primary" onClick = {()=>handleUpdate(item)}> 更新 </Button> /* 如果审核状态是3，就显示更新按钮 primary是主要样式*/
          }
          

        </div> /* button这里就不能简单的用list了，因为不同的button不仅是文字不一样，更重要的是跳转页面不同 */
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

    /* 路由本质上来说就是根据不同的路径，让React渲染不同的组件 */