import axios from 'axios'
import React, { useEffect, useState } from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublished.js'
import usePublish from '../../../components/publish-manage/usePublish.js'
import { Button } from 'antd'



export default function Unpublished() {
  const {dataSource, handlePublish} = usePublish(1) /* 1是待发布的 */
  
  return (
    <div>
      <NewsPublish dataSource = {dataSource} button={(id)=><Button type ="primary"
       onClick={()=>{handlePublish(id)}}>
        发布
      </Button>}> </NewsPublish>
    </div>
  )
}
