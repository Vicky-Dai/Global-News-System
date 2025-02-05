import { Button, notification, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Audit() {
    const [dataSource, setdataSource] = useState([])
    const roleObj = {
      "1":"superadmin",
      "2":"admin",
      "3":"editor"  
    } /* 映射对象，在数字意义模糊的时候可以用这种方法，便于写代码 */
    
    const {roleId, region, username} = JSON.parse(localStorage.getItem("token"))
    const navigate = useNavigate()
    
    useEffect(() => {
        axios.get(`http://localhost:5000/news?_embed=category&_embed=role`).then((res) => {
          const list = res.data  
          setdataSource(roleObj[roleId] === "superadmin" ? list : 
            list.filter(item=>item.region===region&&roleObj[item.roleId]==="editor")) /* filter 本事也是一个对iterable的loop，true就留下 */
          
        })
    }, [roleId, region, username])

    const handlePass = (item) => {
      axios.patch(`/news/${item.id}`,{
        auditState: 2,
        publishState: 1
      }).then(res=>{
        setdataSource(dataSource.filter(data=>data.id !== item.id)) /* 过滤掉当前的item */
        console.log("通过成功")
        notification.info({
          message: `通知`,
          description: `新闻已通过，您可以到[审核管理/审核列表]中查看您的新闻`,
          placement: 'bottomRight'
        })

      })
    }

    const handleReject = (item) => {
      axios.patch(`/news/${item.id}`,{
        auditState: 3
      }).then(res=>{
        setdataSource(dataSource.filter(data=>data.id !== item.id)) /* 过滤掉当前的item */
        console.log("驳回成功")
        notification.info({
          message: `通知`,
          description: `已驳回，您可以到[审核管理/审核列表]中查看您的新闻`,
          placement: 'bottomRight'
        })

      })
    }

    const columns = [ /* 定义表格的列 */
      {
        title: '新闻标题',
        dataIndex: 'title', /* 表示会把region放到第一列中 对应上面datasource的属性 */ /* 'region' 是一个字符串，它告诉代码要从数据源中使用名为 region 的属性。这是一个键，和对象的属性名对应。 */
        render: (title, item) => {
          return <a href={`/news-manage/preview/${item.id}`} params={{item}}>{title}</a> /* 这里的item就是当前遍历到的对象 */
        }/* 当你需要在组件中访问 URL 参数时，可以使用 useParams 钩子  useParams 是 React Router 提供的一个钩子，用于在函数组件中访问路由参数。它返回一个对象，其中包含当前 URL 中的所有参数。 */
      },
      {
        title: '作者',
        dataIndex: 'author',
        render: (author) => { /* 这里的author就是当前遍历到的对象 */
          return <b>{author}</b>
        }
      },
      {
        title: '新闻分类',
        dataIndex: 'category', 
        render: (category) => ( /* 这里的key是一个形参，至于实参调用的过程是由antd定义的，去找dataIndex对应的属性 */
          <div>{category.title}</div>
       ),
      },
      {
        title: '操作',
        render: (item) => ( /* 这里的item就是render函数的形参,so item就是dataSource中的每一行数据，是第一层对象 为什么？因为不用dataIndex,直接用item antd的Table组件会自动遍历dataSource中的每一行数据，并将每一行数据作为render函数的实参 */
          <div>
           
            <Button type="primary"  disabled={item.default}
            onClick={()=>handlePass(item)}> 通过 </Button> {/* 这里的item就是当前遍历到的对象 */}
            
            <Button danger 
            onClick={()=>handleReject(item)} disabled={item.default}
             > 驳回 </Button>
  
          </div>
      ),},
    ];


    return (
        <div>
          <Table dataSource={dataSource} columns={columns}  /* 表格本身支持树形表格，即可以多层嵌套，当有children的时候自动使用 */
             pagination={{ pageSize: 5 }} rowKey={item=>item.id}/>

        </div>
    )
}
