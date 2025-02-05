import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublished.js'
import usePublish from '../../../components/publish-manage/usePublish.js'
import { Button } from 'antd'

export default function Published() {
  // const {username} = JSON.parse(localStorage.getItem("token"))
  // const [dataSource, setdataSource] = useState([])

  // useEffect(()=>{
  //   axios(`/news?author=${username}&publishState=2&_embed=category`).then(res=>{
  //     console.log(res.data)
  //     setdataSource(res.data)
  //   })
  // },[username])
  const {dataSource, handleSunset} = usePublish(2) /* 2是已发布的 */

  

  return (
    <div>
      <NewsPublish dataSource = {dataSource} button={(id)=><Button onClick={()=>handleSunset(id)}> 
        下线
      </Button>}> </NewsPublish>
    </div>
  )
}
