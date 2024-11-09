import React, {useState, useEffect, useRef} from 'react'
import { PageHeader } from '@ant-design/pro-components'
import { Steps, Button, Form, Input, Select } from "antd";
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor';


const {Option} = Select;

const description = 'This is a description.';
export default function NewsAdd() {
  const [currentStep, setcurrentStep] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  
  const handleNext = () => {
    if(currentStep===0){
      NewsForm.current.validateFields().then(res=>{
        console.log(res)
        setcurrentStep(currentStep+1)
      }).catch(error=>{
        console.log(error)
      })
    }else{
      setcurrentStep(currentStep+1)
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

  useEffect(() => {
    axios.get("/categories").then(res=>{
      console.log(res.data)
      setcategoryList(res.data)
    })
  },[])

  return (
    <div>
        <PageHeader
          className="site-page-header"
          onBack={() => null}
          title="撰写新闻"
          subTitle="This is a subtitle"
        />
        <Steps
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
          <div className={currentStep===0?'': style.active}>
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
                <Input />
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
                <Select>
                  {
                    categoryList.map(item=><Option value={item.id} key={item.id}>{item.title}</Option>)
                  }
                 {/* value 是该 <Option> 的实际值，当用户选择此选项时，这个 value 值会被提交。{item.title} 是放在 <Option> 组件的内部，表示用户在页面上看到的文本内容。 */}
                </Select>
              </Form.Item>
            </Form>
          </div>

          <div className={currentStep===1?'': style.active}>
            <NewsEditor></NewsEditor>
          </div>
          <div className={currentStep===2?'': style.active}>3333333333333</div>

        </div>

        <div style={{marginTop:"50px"}}>
          {
            currentStep === 2 && <span>
              <Button type="primary">保存草稿箱</Button>
              <Button danger>提交审核</Button>
            </span>
          }
          {
            currentStep<2 && <Button type="primary" onClick = {handleNext}>下一步</Button>
          }
          {
            currentStep>0 && <Button onClick = {handlePrevious} >上一步</Button>
          }
          
        </div>

    </div>
  )
}

  /* 在 React 中，ref 是一个特殊的属性，用于引用某个 DOM 元素或组件实例，从而允许直接访问该元素或组件。NewsForm 在这个语句中实际上是一个 ref 对象，通过 ref 赋值后，NewsForm 中就存储了对应的 DOM 或组件实例。 */
 /* 在 Ant Design 中，validateFields 是 Form 实例上的一个方法，通常配合 ref 一起使用，用来执行表单的验证。

1. validateFields 的作用
validateFields 方法会根据在 Form.Item 中定义的验证规则（比如 rules）来验证表单中的字段。如果字段不符合规则，validateFields 会返回一个包含错误信息的 Promise。

2. current 和 validateFields 结合使用
通常，validateFields 被用于通过 form 的 ref 直接引用表单实例来进行字段验证。例如，使用 useRef 来创建一个对 Form 组件的引用，并通过 ref.current.validateFields() 来验证表单。 */