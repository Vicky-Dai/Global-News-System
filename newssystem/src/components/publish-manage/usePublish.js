/* 自定义hooks逻辑：把news里面的publish-manage三个类似组件的数据获取逻辑提取出来 */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { notification } from 'antd'
import { useNavigate } from 'react-router-dom'

function usePublish(type){
    const {username} = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setdataSource] = useState([])
    const navigate = useNavigate()
    
    useEffect(()=>{
        axios(`/news?author=${username}&publishState=${type}&_embed=category`).then(res=>{
        console.log(res.data)
        setdataSource(res.data)
        })
    },[username,type])


    /* 把几个发布管理的操作按钮方法写在这里 */
    const handlePublish = (id) => {
        // console.log(id)
        setdataSource(dataSource.filter(data=>data.id !== id))
        axios.patch(`/news/${id}`,{ /* 找到更新的路径，patch数据只要展开然后写里面改了的就可以 */  /* 目前感觉是这里有问题 导致update后无法preview */ 
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
    const handleSunset = (id) => {
        // console.log(id)
        setdataSource(dataSource.filter(data=>data.id !== id))
        axios.patch(`/news/${id}`,{ /* 找到更新的路径，patch数据只要展开然后写里面改了的就可以 */  /* 目前感觉是这里有问题 导致update后无法preview */ 
            "publishState": 3,
  
          }).then(res=>{
            navigate('/publish-manage/sunset') /* 跳转页面 */
      
            notification.info({
              message: `通知`,
              description: `您可以到【发布管理/已下线】中查看您的新闻`,
              placement: 'bottomRight'
            })
          })

    }
    const handleDelete = (id) => {
        // console.log(id)
        setdataSource(dataSource.filter(data=>data.id !== id))
        axios.delete(`/news/${id}`,{ /* 找到更新的路径，patch数据只要展开然后写里面改了的就可以 */  /* 目前感觉是这里有问题 导致update后无法preview */ 
          }).then(res=>{
      
            notification.info({
              message: `通知`,
              description: `删除成功`,
              placement: 'bottomRight'
            })
          })

    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish