import React, {useState, useEffect, useRef} from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Steps, Button, Form, Input, Select, message, notification, Space } from "antd";
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';
import{ useNavigate, useLocation, useParams } from 'react-router-dom'

const {Option} = Select;

export default function NewsUpdate() {
    const [currentStep, setcurrentStep] = useState(0)
    const [categoryList, setcategoryList] = useState([])
    const [formInfo, setformInfo] = useState("")
    const [content, setContent] = useState("")
    const User = JSON.parse(localStorage.getItem("token")) /* 用于获取当前新闻的各种信息，与user相关的 */
    const [api, contextHolder] = notification.useNotification();
    const {id} = useParams() /* 从路由中获取id */
    // const params = useParams() /* useParams返回一个对象 包含dynamic信息和路径 可以自己打印看看 */
    
    const handleNext = () => {
      if(currentStep===0){
        NewsForm.current.validateFields().then(res=>{
          // console.log(res, "NewsForm.current") /* form的数据打印  */
          setformInfo(res)
          setcurrentStep(currentStep+1)
          // console.log(User)
        }).catch(error=>{
          console.log(error)
        })
      }else{
        console.log(formInfo, content)
        if(content===""||content.trim()==="<p></p>"){ /* 這裡有個小坑，console里面显示的<p></p>后面是有个空格的 */
          message.error("新闻内容不能为空")
        }else{
          setcurrentStep(currentStep+1)
        }
      }
      
      /* 下一步要校验 */
      
    }
  
    const handlePrevious = () => {
      setcurrentStep(currentStep-1)
    }
  
    const onFinish = () =>{}
    const onFinishFailed = () => {}
  
    const NewsForm = useRef(null) /* 对当前form做ref绑定 */
    /* 最下方对于useRef的理解 */
  
    const navigate = useNavigate()
  
    useEffect(() => {
      axios.get("/categories").then(res=>{
        // console.log(res.data, "test /categories")
        setcategoryList(res.data)
      })
    },[])

    useEffect(() => {
        axios.get(`http://localhost:5000/news/${id}?author=admin&auditState=0&_embed=category`).then(res=>{
            let {title, categoryId, content} = res.data
            NewsForm.current.setFieldsValue({
              title,
              categoryId
            }) /* 已有数据再次打开，设置表单的值 */
            // const list = res.data console.log(list)
            // console.log(params)
            setContent(content)
        })
    }, [id])
  
    const handleSave = (auditState) => {
      axios.post('/news',{
        ...formInfo,
        /* "title": "千锋教育",
        "categoryId" :  3,  这俩从formInfo来*/
        "content": content,
        "region": User.region?User.region:"全球", /* true就显示region，false（为空）就是全球 */
        "author": User.username,
        "roleId": User.roleId,
        "auditState": auditState, /* 0草稿箱 1待审核 2审核通过 3审核驳回 */
        "publishState": 0, /* 默认未发布 */
        "createTime": Date.now(), /* 自动获取当前时间 */
        "star": 0,
        "view": 0,
        // "id": "1", id post自增长
        // "publishTime": 0 /* 还没发布 */
      }).then(res=>{
        navigate(auditState===0?'/news-manage/draft':'/audit-manage/list') /* 跳转页面 */
  
        // api.info({ /* 一个简单的提示 */
        //   message: ` 通知 `,
        //   description:
        //     `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的新闻`,
        //   placement:'bottomRight',
        // });
        openNotification('bottomRight') /* 为什么弹不出来？？ */
      })
    }
  
    const openNotification = (placement) => {
      api.info({
        message: `Notification ${placement}`,
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        placement,
      });
    }
  
    return (
      <div>
          <PageHeader
            className="site-page-header"
            onBack={() => null}
            title="更新新闻"
            subTitle="This is a subtitle"
          />
          <Steps /* antd步骤条 */
            current={currentStep}
            items={[
              {
                title: '基本信息',
                description: "新闻标题，新闻分类",
              },
              {
                title: '新闻内容',
                description:"新闻主题内容",
                subTitle: '',
              },
              {
                title: '新闻提交',
                description:"保存草稿或者提交审核",
              },
            ]}
          />
  
          <div style = {{marginTop: "50px"}}>
            
            <div className={currentStep===0?'': style.active}> {/* style.active是控制是否隐藏的 0的时候说明第一个页面要显示 */}
              <Form
                name="basic"
                labelCol={{
                  span: 4,  /* antd是24栅格系统，lable 占8，输入框16， 所以两者是1:2关系 */
                }}
                wrapperCol={{
                  span: 20,
                }}
                style={{
                  maxWidth: 600,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                ref={NewsForm} /* 通过ref拿到form实例，然后通过 .validateFields 校验通过走.then*/
              >
                <Form.Item
                  label="新闻标题"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Input placeholder={formInfo.title?formInfo.title:""}/> 
                </Form.Item>
  
                <Form.Item
                  label="新闻分类"
                  name="categoryId"  /* 方便后端连表查是哪个新闻分类 */
                  rules={[
                    {
                      required: true,
                      message: 'Please input your username!',
                    },
                  ]}
                >
                  <Select value={formInfo?.category?.title}
                  // onChange={(formInfo) = {
                  //   setformInfo(formInfo);}}
                  >
                    {
                      categoryList.map(item=><Option value={item.id} key={item.id}>{item.title}</Option>)
                    }
                   {/* value 是该 <Option> 的实际值，当用户选择此选项时，这个 value 值会被提交。{item.title} 是放在 <Option> 组件的内部，表示用户在页面上看到的文本内容。 */}
                  </Select>
                </Form.Item>
              </Form>
            </div>
  
            <div className={currentStep===1?'': style.active}>
              <NewsEditor getContent={(value)=>{
                  // console.log(value)
                  setContent(value)
              }} content={content}></NewsEditor>
            </div>
            <div className={currentStep===2?'': style.active}></div>
  
          </div>
  
          <>
            {contextHolder}
            <Space>
              <div style={{marginTop:"50px"}}> {/* 这里写的是不同页面的button */}
                  {
                    currentStep === 2 && <span>
                      <Button type="primary" onClick={()=>handleSave(0)}>保存草稿箱</Button>
                      <Button danger onClick={()=>handleSave(1)}>提交审核</Button>
                    </span>
                  }
                  {
                    currentStep<2 && <Button type="primary" onClick = {handleNext}>下一步</Button>
                  }
                  {
                    currentStep>0 && <Button onClick = {handlePrevious} >上一步</Button>
                  }
              
              </div>
  
            </Space>
          
          </>
  
          
      </div>
    )
}
