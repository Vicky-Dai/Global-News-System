import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublished.js'



export default function Unpublished() {
  const {username} = JSON.parse(localStorage.getItem("token"))
  const [dataSource, setdataSource] = useState([])

  useEffect(()=>{
    axios(`/news?author=${username}&publishState=1&_embed=category`).then(res=>{
      console.log(res.data)
      setdataSource(res.data)
    })
  },[username])
  

  return (
    <div>
      <NewsPublish dataSource = {dataSource}> </NewsPublish>
    </div>
  )
}
