import React from 'react'
import {Form, Button, Input, message} from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import './Login.css'
import axios from 'axios'
import{ useNavigate, useLocation } from 'react-router-dom' 


export default function Login(props) {
    // console.log(props)
    
    const navigate = useNavigate()

    const onFinish = (values) =>{
        console.log("values是", values)
        axios.get(`http://localhost:5000/users?username=${values.username}&password=${values.password}&roleState=true&_embed=role`).then(
            res=>{
                console.log(res.data)
                if(res.data.length===0){
                    message.error("用户名或密码不匹配")
                }else{
                    localStorage.setItem("token",JSON.stringify(res.data[0]))
                    // console.log("token是否被设置成功",localStorage.getItem("token"))
                    // console.log("登录成功，导航到 /home");
                    return navigate("/home")
                }
            }
        )
    }
/* values:当用户填写表单并点击提交按钮时，Ant Design 会自动收集表单中各个 <Form.Item> 的 name 属性和对应的输入值，生成一个对象，并将这个对象传递给 onFinish 方法作为参数。 */

    return(
        <div style = {{background:'rgb(35,39,65)', height:"100%"}}>
            {/* <Particles id="tsparticles" url="http://foo.bar/particles.json" init={particlesInit} loaded={particlesLoaded}/> */}
            <div class = "formContainer">
                <div class = "logintitle">全球新闻发布管理系统</div>
                <Form class = "Form"
                    name="login"
                    style={{
                        maxWidth: 360,
                    }}
                    onFinish={onFinish}  /* antd Form component onFinish method: Trigger after submitting the form and verifying data successfully */
                    >
                    <Form.Item
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        ]}
                    >
                        <Input class="full-width-input" prefix={<UserOutlined />} placeholder="Username"  />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        ]}
                    >
                        <Input class="full-width-input" prefix={<LockOutlined />} type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button className="full-width-button" block type="primary" htmlType="submit"> {/* Button 的 onClick 属性 提交按钮的 htmlType="submit" 会自动触发表单的 onFinish 方法 */}
                        Log in
                        </Button>
                        or <a href="">Register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

