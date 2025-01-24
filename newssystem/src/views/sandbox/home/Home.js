import React, {useEffect, useRef, useState} from 'react'
import { Button, Drawer } from 'antd'
import axios from 'axios' /* JS HTTP客户端用于发送请求获取数据 */
import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as Echarts from 'echarts' /* 把echarts所有东西导入到Echarts */
import _ from 'lodash' /* lodash是一个一致性、模块化、高性能的 JavaScript 实用工具库。 */
const { Meta } = Card;

export default function Home() {
  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])
  const [allList, setallList] = useState([])
  const [open, setopen] = useState(false)
  const barRef = useRef() /* 获取图表需要放置的节点位置 */
  const pieRef = useRef()

  useEffect(() => {
    console.log("Home 渲染");
  }, []);/* 测试login页面navigate问题 */

  useEffect( ()=>{
    axios.get("http://localhost:5000/news?publishState=2&_embed=category&_sort=-view&_limit=6").then(res=>{
      // console.log(res.data)
      setviewList(res.data)
    })
  },[])

  useEffect( ()=>{
    axios.get("http://localhost:5000/news?publishState=2&_embed=category&_sort=-star&_limit=6").then(res=>{
      // console.log(res.data)
      setstarList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/news?publishState=2&_embed=category").then( 
      res=>{
        // console.log("res.data", _.groupBy((res.data),item=>item.category.title)) /* lodash的groupBy方法，按照某个属性(第二个参数）分组 */
        renderBarView( _.groupBy((res.data),item=>item.category.title))
        setallList(res.data)
      })


      return () => { /* 组件卸载时执行 */
        window.onresize = null /* 组件卸载时，清除resize事件 */ /* 因为是给window绑的方法，不销毁在任何窗口都执行 */
      }
  },[])

  /* 数据请求好之后再初始化图表 */
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);/* barRef用于获取domtree上节点的位置，引用在下面的div占位的地方 */
    console.log("barRef是什么",barRef)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj), /* 取出对象的key */
        axisLabel: {
          rotate: 30, /* 旋转30度 */
          interval: 0 /* 间隔0 保证所有内容都显示 */
        }
      },
      yAxis: {minInterval: 1},
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length) /* 内置方法 取出对象的value，然后map取出每个分类的长度 */
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    /* 保证表格和窗口一起resize */
    window.onresize= ()=>{ /* 窗口大小改变时触发 */
      console.log("resize")
      myChart.resize()
    }
  }

  const renderPieView = (obj) => {
    //数据处理
    var currentList = allList.filter(item=>item.author === username) /* 过滤出推荐的新闻 */
    // console.log("currentList",currentList)
    var groupObj = _.groupBy(currentList,item=>item.category.title) /* 按照分类分组 */
    var list = []
    for(var i in groupObj){
      list.push({
        name: i,
        value:groupObj[i].length
      })
    }
    console.log("list",list)
    // var chartDom = document.getElementById('main'); /* 获取图表需要放置的节点位置 */
    var myChart = Echarts.init(pieRef.current); /* 初始化图表 */
    var option;

    option = {
      title: {
        text: '当前用户新闻分类图示',
        subtext: '',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
 
    option && myChart.setOption(option); /* 如果option存在就渲染 */
  }


    


  const{username, region, role:{roleName} } = JSON.parse(localStorage.getItem("token")) /* 从localStorage中获取token，解构出来的是一个对象，对象中包含了用户的信息 */

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
              dataSource={starList}
              renderItem={(item) => <List.Item>
                <a  href={`/news-manage/preview/${item.id}`}> {item.title} </a>
                </List.Item>} /* 遍历渲染每一项 */
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
              <SettingOutlined key="setting" onClick={
                ()=>{
                  setopen(true)
                  setTimeout(() => {
                    renderPieView();
                  }, 0); // 确保在 DOM 创建之后再初始化图表 /* 为了让图表初始化在DOM创建之后 */
                  /* 状态更新异步处理，DOM在这里还没有被直接创建，那么下面那个直接在未创建的DOM中render会报错 */
                 /* 点击第一个按钮时，初始化图表 */  
                  /* React waits until all code in the event handlers has run before processing your state updates. setOpen异步的 */
                }
                 /* setTimeout 0秒看起来没有用，但实际上会将回调函数添加到 任务队列（task queue）中，等待当前执行栈中的所有同步代码执行完成后，才会去执行队列中的回调。即使你传递 0 毫秒的延迟，回调也不会立即执行，它依然会被放入任务队列，等待当前的同步任务执行完毕后再执行。 */
              }/>,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
              title={username}
              description={
                <div>
                 
                  <b>
                    {region?region:"全球"}
                  </b>
                  <span style={{
                    padding:"30px"}}>
                      {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer 
        width="500px"
        title="个人新闻分类" 
        onClose={()=>{
          setopen(false)}
        } 
        open={open}>
        <div ref={pieRef} style={{
          width: '100%',
          height: "400px",
          marginTop: "30px"}}>

        </div>
      </Drawer>

      <div ref={barRef} style={{
        width: '100%',
        height: "400px",
        marginTop: "30px"}}>

      </div>
      
    </div>
  )
}
/* json server还可以查看数据库中的数据http://localhost:8000/posts/1 或者http://localhost:8000/posts?id=1 */
/* json文件符合rest格式 */  


/* 首页用户最长浏览等数据，交给后端去计算，前端只负责渲染 这样效率高 */


/* 组件需要的部分引用div结构，然后做好上面useEffect图表初始化工作 */

/* 在你的代码中，barRef 是一个通过 useRef 创建的引用，用于获取和操作 DOM 元素。具体来说，barRef 被用来引用一个 DOM 元素，该元素是 ECharts 图表的容器。通过 barRef.current，你可以访问这个 DOM 元素，并在其上初始化和渲染 ECharts 图表。 */

/* 在 React 中，只有挂载到 DOM 树中的组件才是活跃且可用的。挂载过程将组件的 JSX 或虚拟 DOM 转换为实际的浏览器 DOM 节点，这些节点才可以被用户交互或通过代码操作。 */


/* React waits until all code in the event handlers has run before processing your state updates. */