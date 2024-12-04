import React, {useEffect, useState} from 'react'
import { Button } from 'antd'
import axios from 'axios' /* JS HTTP客户端用于发送请求获取数据 */
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [thumbList, setthumbList] = useState([])

  useEffect( ()=>{
    axios.get("http://localhost:5000/news?publisState=2&_embed=category&_sort=-view&_limit=6").then(res=>{
      // console.log(res.data)
      setviewList(res.data)
    })
  },[])

  useEffect( ()=>{
    axios.get("http://localhost:5000/news?publisState=2&_embed=category&_sort=-view&_limit=6").then(res=>{
      // console.log(res.data)
      
    })
  },[])



  const ajax =() =>{
   /* 查数据 */
  //   axios.get('http://localhost:8000/posts/1').then(res => {
  //     console.log(res.data)
  // }) /* json server按照rest格式定义 */

  /* 增数据 */
    // axios.post('http://localhost:8000/posts',{  /* 注意一定是http不是https */
    //   title: 'test', /* id自动生成 自增长*/
    //   author: "mimi"
    // })  /* 按照restful规范 增加数据 */

    /* put替换修改数据 */
    // axios.put("http://localhost:8000/posts/1",{
    //   title:'1111-修改' /* put会把没修改的都删掉 */
    // })

    /* patch 补丁修改 */
    // axios.patch("http://localhost:8000/posts/1",{
    //   title:"love u data change 补丁"
    // })

    /* 删除数据 delete*/
    // axios.delete("http://localhost:8000/posts/1")

    //_embed 连接数据
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
    //   console.log(res.data)
    // }) 
    /* ?_embed=comments 连接posts和comments 让comments里面postID==id的取出 对应好id一起放在posts里面  */
    /* comments这些都是接口的名字 */
    /* jsonserver向下表关联 */

    // _expand 向上关联 比如：从comments找到新闻相关信息
    // axios.get("http://localhost:8000/rights?_expand=post").then(res=>{ /* posts postId post 这里用到关联名称是接口固定的 */
    //   console.log(res.data)
    // })
  }
  return (
    <div>
      
      <Row gutter={16}>
        <Col span={8}> {/* 24栅格系统，每个占8三等分 */}
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              
              // bordered /* 边框 */
              dataSource={viewList}
              renderItem={(item) => <List.Item>
                <a  href={`/news-manage/preview/${item.id}`}> {item.title} </a>
                </List.Item>} /* 遍历渲染每一项 */
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
          <List
              size="small"
              
              // bordered /* 边框 */
              dataSource={["111","222","333"]}
              renderItem={(item) => <List.Item>{item}</List.Item>} /* 遍历渲染每一项 */
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            // style={{
            //   width: 300,  /* 这里原本有组建自己设置的宽，但是不写就默认继承父组件宽 */
            // }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
      
    </div>
  )
}
/* json server还可以查看数据库中的数据http://localhost:8000/posts/1 或者http://localhost:8000/posts?id=1 */
/* json文件符合rest格式 */  


/* 首页用户最长浏览等数据，交给后端去计算，前端只负责渲染 这样效率高 */